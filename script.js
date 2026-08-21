/* ---------- Storage (IndexedDB — PDFs/images are too large for localStorage) ---------- */

const OLD_STORAGE_KEY = "ewReviewData_v1";
const DB_NAME = "ewReviewDB";
const DB_STORE = "chapters";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetChapters() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const req = tx.objectStore(DB_STORE).get("data");
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function dbSetChapters(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(data, "data");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadData() {
  const existing = await dbGetChapters();
  if (existing) return existing;

  // one-time migration from the old localStorage-based version
  try {
    const raw = localStorage.getItem(OLD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      await dbSetChapters(parsed);
      localStorage.removeItem(OLD_STORAGE_KEY);
      return parsed;
    }
  } catch (e) { /* ignore corrupt data */ }

  await dbSetChapters([]);
  return [];
}

async function saveData() {
  await dbSetChapters(chapters);
}

/* ---------- State ---------- */

let chapters = [];
let activeChapterId = null;
let activeView = "home"; // "home" | "chapter"

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ---------- Theme ---------- */

const root = document.documentElement;
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

function applyTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    iconSun.style.display = "none";
    iconMoon.style.display = "";
  } else {
    root.setAttribute("data-theme", "light");
    iconSun.style.display = "";
    iconMoon.style.display = "none";
  }
  localStorage.setItem("ewTheme", theme);
}

const savedTheme = localStorage.getItem("ewTheme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);

document.getElementById("themeToggle").addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ---------- Home navigation ---------- */

function goHome() {
  activeView = "home";
  activeChapterId = null;
  renderContent();
}

document.getElementById("brandHome").addEventListener("click", goHome);

/* ---------- Render ---------- */

let sectionObjectUrls = [];

function renderContent() {
  sectionObjectUrls.forEach(u => URL.revokeObjectURL(u));
  sectionObjectUrls = [];

  if (activeView === "home") {
    renderHomeContent();
    return;
  }
  renderChapterContent();
}

function renderHomeContent() {
  const content = document.getElementById("content");

  if (!chapters.length) {
    content.innerHTML = `<h1>ทบทวน Elliott Wave</h1><p class="empty-chapter">ยังไม่มีบทเนื้อหา กด "+ เพิ่มเนื้อหา" เพื่อเริ่มต้น</p>`;
    return;
  }

  const footer = `<div class="chapter-footer"><button id="resetBtn" class="link-btn">ลบเนื้อหาทั้งหมด</button></div>`;

  let html = `<h1>ทบทวน Elliott Wave</h1><p class="chapter-desc">สรุปเนื้อหาทั้งหมด — เลือกบทที่ต้องการอ่านต่อ</p>`;
  html += `<div class="home-grid">`;
  chapters.forEach(ch => {
    const subCount = ch.sections.reduce((n, s) => n + (s.subsections ? s.subsections.length : 0), 0);
    let meta = `${ch.sections.length} หัวข้อหลัก`;
    if (subCount) meta += ` · ${subCount} หัวข้อย่อย`;
    html += `<button class="home-card" data-chapter-id="${ch.id}">
      <div class="home-card-title">${escapeHtml(ch.title)}</div>
      <div class="home-card-desc">${escapeHtml(ch.desc || "")}</div>
      <div class="home-card-meta">${meta}</div>
    </button>`;
  });
  html += `</div>`;
  html += footer;
  content.innerHTML = html;

  content.querySelectorAll(".home-card").forEach(btn => {
    btn.addEventListener("click", () => {
      activeView = "chapter";
      activeChapterId = btn.dataset.chapterId;
      renderContent();
    });
  });

  wireResetBtn();
}

function wireResetBtn() {
  document.getElementById("resetBtn").addEventListener("click", async () => {
    if (confirm("ลบเนื้อหาทั้งหมดหรือไม่? การลบนี้ไม่สามารถย้อนกลับได้")) {
      chapters = [];
      await saveData();
      activeChapterId = null;
      activeView = "home";
      renderContent();
    }
  });
}

function renderChapterContent() {
  const content = document.getElementById("content");
  const chapter = chapters.find(c => c.id === activeChapterId);
  if (!chapter) {
    content.innerHTML = `<p class="empty-chapter">ยังไม่มีบทเนื้อหา กด "+ เพิ่มเนื้อหา" เพื่อเริ่มต้น</p>`;
    return;
  }

  let html = `<button class="back-home-link" id="backHomeLink">← หน้าหลัก</button>`;
  html += `<h1>${escapeHtml(chapter.title)}</h1>`;
  if (chapter.desc) html += `<p class="chapter-desc">${escapeHtml(chapter.desc)}</p>`;

  if (!chapter.sections.length) {
    html += `<p class="empty-chapter">บทนี้ยังไม่มีเนื้อหา</p>`;
  }

  chapter.sections.forEach(sec => {
    if (!sec.subsections) sec.subsections = [];
    html += `<article class="section-card" data-section-id="${sec.id}">`;
    if (sec.title) html += `<h3>${escapeHtml(sec.title)}</h3>`;
    if (sec.html) html += sec.html;
    if (sec.text) html += `<div class="section-text">${renderBodyText(sec.text)}</div>`;
    if (sec.image) html += `<img class="section-image" src="${sec.image}" alt="${escapeHtml(sec.title || "")}">`;
    if (sec.pdf) {
      const url = URL.createObjectURL(sec.pdf);
      sectionObjectUrls.push(url);
      const sizeMb = (sec.pdf.size / 1024 / 1024).toFixed(2);
      html += `<div class="pdf-embed"><iframe src="${url}" title="${escapeAttr(sec.pdfName || "PDF")}"></iframe></div>
        <div class="pdf-meta">
          <span>${escapeHtml(sec.pdfName || "เอกสาร PDF")} · ${sizeMb} MB</span>
          <a href="${url}" download="${escapeAttr(sec.pdfName || "document.pdf")}">ดาวน์โหลด</a>
        </div>`;
    }

    if (sec.subsections.length) {
      html += `<div class="subsection-list">`;
      sec.subsections.forEach(sub => {
        html += `<div class="subsection-card" data-subsection-id="${sub.id}">
          <h4>${escapeHtml(sub.title)}</h4>
          ${sub.text ? `<div class="section-text">${renderBodyText(sub.text)}</div>` : ""}
          ${sub.image ? `<img class="section-image" src="${sub.image}" alt="${escapeHtml(sub.title || "")}">` : ""}
          <div class="section-actions">
            <button class="edit-subsec">แก้ไข</button>
            <button class="danger del-subsec">ลบ</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    }

    html += `<div class="section-actions">`;
    if (!sec.html) {
      html += `<button class="edit-sec">แก้ไข</button><button class="danger del-sec">ลบ</button>`;
    }
    html += `<button class="add-subsec">+ เพิ่มหัวข้อย่อย</button>`;
    html += `</div>`;
    html += `</article>`;
  });

  html += `<div class="chapter-footer">
    <button id="deleteChapterBtn" class="btn-delete-chapter">ลบบทนี้ทั้งหมด</button>
  </div>`;

  content.innerHTML = html;

  content.querySelector("#backHomeLink").addEventListener("click", goHome);

  content.querySelectorAll(".del-sec").forEach(btn => {
    btn.addEventListener("click", async () => {
      const card = btn.closest(".section-card");
      const secId = card.dataset.sectionId;
      if (confirm("ลบเนื้อหาส่วนนี้หรือไม่?")) {
        chapter.sections = chapter.sections.filter(s => s.id !== secId);
        await saveData();
        renderContent();
      }
    });
  });

  content.querySelectorAll(".edit-sec").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".section-card");
      const secId = card.dataset.sectionId;
      const sec = chapter.sections.find(s => s.id === secId);
      startEditSection(card, chapter, sec);
    });
  });

  content.querySelectorAll(".add-subsec").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".section-card");
      const secId = card.dataset.sectionId;
      const sec = chapter.sections.find(s => s.id === secId);
      startAddSubsection(card, sec);
    });
  });

  content.querySelectorAll(".edit-subsec").forEach(btn => {
    btn.addEventListener("click", () => {
      const subCard = btn.closest(".subsection-card");
      const card = btn.closest(".section-card");
      const sec = chapter.sections.find(s => s.id === card.dataset.sectionId);
      const sub = sec.subsections.find(s => s.id === subCard.dataset.subsectionId);
      startEditSubsection(subCard, sub);
    });
  });

  content.querySelectorAll(".del-subsec").forEach(btn => {
    btn.addEventListener("click", async () => {
      const subCard = btn.closest(".subsection-card");
      const card = btn.closest(".section-card");
      const sec = chapter.sections.find(s => s.id === card.dataset.sectionId);
      const subId = subCard.dataset.subsectionId;
      if (confirm("ลบหัวข้อย่อยนี้หรือไม่?")) {
        sec.subsections = sec.subsections.filter(s => s.id !== subId);
        await saveData();
        renderContent();
      }
    });
  });

  document.getElementById("deleteChapterBtn").addEventListener("click", async () => {
    if (confirm(`ลบบท "${chapter.title}" ทั้งหมดหรือไม่? การลบนี้ไม่สามารถย้อนกลับได้`)) {
      chapters = chapters.filter(c => c.id !== chapter.id);
      activeChapterId = null;
      activeView = "home";
      await saveData();
      renderContent();
    }
  });
}

function renderSubsecImageEditor(root, getImage, setImage) {
  const wrap = root.querySelector(".edit-media-wrap");
  const labelText = root.querySelector(".edit-image-label-text");
  labelText.textContent = getImage() ? "เปลี่ยนรูป" : "เพิ่มรูปตัวอย่าง";
  wrap.innerHTML = getImage()
    ? `<div class="edit-media-item"><img class="edit-media-preview" src="${getImage()}"><button type="button" class="edit-remove-image">ลบรูปนี้</button></div>`
    : "";
  const removeBtn = wrap.querySelector(".edit-remove-image");
  if (removeBtn) removeBtn.addEventListener("click", () => { setImage(null); renderSubsecImageEditor(root, getImage, setImage); });
  root.querySelector(".edit-subsec-image-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(await resizeImageToDataUrl(file, 1000));
    renderSubsecImageEditor(root, getImage, setImage);
  });
}

function subsecEditorHtml(title, text) {
  return `
    <input type="text" class="edit-subsec-title" value="${escapeAttr(title || "")}" placeholder="หัวข้อย่อย">
    <textarea class="edit-subsec-text" rows="4" placeholder="เนื้อหา">${text || ""}</textarea>
    <div class="edit-media-wrap"></div>
    <label class="btn btn-secondary">
      <span class="edit-image-label-text"></span>
      <input type="file" accept="image/*" class="edit-subsec-image-input" hidden>
    </label>
    <div class="section-actions">
      <button class="save-subsec">บันทึก</button>
      <button class="cancel-subsec">ยกเลิก</button>
    </div>
  `;
}

function startAddSubsection(card, sec) {
  let list = card.querySelector(".subsection-list");
  if (!list) {
    list = document.createElement("div");
    list.className = "subsection-list";
    const actions = card.querySelector(".section-actions");
    card.insertBefore(list, actions);
  }

  const form = document.createElement("div");
  form.className = "subsection-card subsection-form";
  form.innerHTML = subsecEditorHtml("", "");
  list.appendChild(form);
  form.querySelector(".edit-subsec-title").focus();
  wireFormattedPaste(form.querySelector(".edit-subsec-text"));

  let newImage = null;
  renderSubsecImageEditor(form, () => newImage, (img) => { newImage = img; });

  form.querySelector(".save-subsec").addEventListener("click", async () => {
    const title = form.querySelector(".edit-subsec-title").value.trim();
    const text = form.querySelector(".edit-subsec-text").value.trim();
    if (!title && !text && !newImage) { form.remove(); return; }
    sec.subsections.push({ id: uid(), title: title || "หัวข้อย่อยใหม่", text, image: newImage });
    await saveData();
    renderContent();
  });
  form.querySelector(".cancel-subsec").addEventListener("click", () => form.remove());
}

function startEditSubsection(subCard, sub) {
  subCard.innerHTML = subsecEditorHtml(sub.title, sub.text);
  wireFormattedPaste(subCard.querySelector(".edit-subsec-text"));

  let editImage = sub.image || null;
  renderSubsecImageEditor(subCard, () => editImage, (img) => { editImage = img; });

  subCard.querySelector(".save-subsec").addEventListener("click", async () => {
    sub.title = subCard.querySelector(".edit-subsec-title").value.trim() || sub.title;
    sub.text = subCard.querySelector(".edit-subsec-text").value.trim();
    sub.image = editImage;
    await saveData();
    renderContent();
  });
  subCard.querySelector(".cancel-subsec").addEventListener("click", renderContent);
}

function startEditSection(card, chapter, sec) {
  let editImage = sec.image || null;
  let editPdf = sec.pdf || null;
  let editPdfName = sec.pdfName || null;

  card.innerHTML = `
    <input type="text" class="edit-title" value="${escapeAttr(sec.title || "")}" placeholder="หัวข้อย่อย">
    <textarea class="edit-text" rows="6" style="margin-top:10px">${sec.text || ""}</textarea>
    <div class="edit-media-wrap"></div>
    <div class="edit-media-actions">
      <label class="btn btn-secondary">
        <span class="edit-image-label-text"></span>
        <input type="file" accept="image/*" class="edit-image-input" hidden>
      </label>
      <label class="btn btn-secondary">
        <span class="edit-pdf-label-text"></span>
        <input type="file" accept="application/pdf" class="edit-pdf-input" hidden>
      </label>
    </div>
    <div class="section-actions">
      <button class="save-edit">บันทึก</button>
      <button class="cancel-edit">ยกเลิก</button>
    </div>
  `;

  wireFormattedPaste(card.querySelector(".edit-text"));

  const mediaWrap = card.querySelector(".edit-media-wrap");
  const imageLabelText = card.querySelector(".edit-image-label-text");
  const pdfLabelText = card.querySelector(".edit-pdf-label-text");

  function renderMedia() {
    imageLabelText.textContent = editImage ? "เปลี่ยนรูป" : "เพิ่มรูป";
    pdfLabelText.textContent = editPdf ? "เปลี่ยนไฟล์ PDF" : "เพิ่มไฟล์ PDF";

    let html = "";
    if (editImage) {
      html += `<div class="edit-media-item">
        <img class="edit-media-preview" src="${editImage}">
        <button type="button" class="edit-remove-image">ลบรูปนี้</button>
      </div>`;
    }
    if (editPdf) {
      html += `<div class="edit-media-item">
        <span class="edit-media-filename">${escapeHtml(editPdfName || "เอกสาร PDF")}</span>
        <button type="button" class="edit-remove-pdf">ลบไฟล์นี้</button>
      </div>`;
    }
    mediaWrap.innerHTML = html;

    const removeImageBtn = mediaWrap.querySelector(".edit-remove-image");
    if (removeImageBtn) removeImageBtn.addEventListener("click", () => { editImage = null; renderMedia(); });

    const removePdfBtn = mediaWrap.querySelector(".edit-remove-pdf");
    if (removePdfBtn) removePdfBtn.addEventListener("click", () => { editPdf = null; editPdfName = null; renderMedia(); });
  }
  renderMedia();

  card.querySelector(".edit-image-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    editImage = await resizeImageToDataUrl(file, 1000);
    renderMedia();
  });

  card.querySelector(".edit-pdf-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) { alert("กรุณาเลือกไฟล์ PDF เท่านั้น"); return; }
    if (file.size > MAX_PDF_SIZE) { alert("ไฟล์ใหญ่เกินไป (จำกัด 30MB)"); return; }
    editPdf = file;
    editPdfName = file.name;
    renderMedia();
  });

  card.querySelector(".save-edit").addEventListener("click", async () => {
    sec.title = card.querySelector(".edit-title").value.trim();
    sec.text = card.querySelector(".edit-text").value;
    sec.image = editImage;
    sec.pdf = editPdf;
    sec.pdfName = editPdfName;
    await saveData();
    renderContent();
  });
  card.querySelector(".cancel-edit").addEventListener("click", renderContent);
}

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}
function escapeAttr(str) { return escapeHtml(str); }

function renderBodyText(str) {
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/* ---------- Paste formatted content (e.g. from a webpage/Word/Docs) into a
   plain textarea while keeping the source's paragraph/line breaks — a
   browser's default plain-text paste often collapses those since HTML
   spaces paragraphs with margins, not literal newlines. ---------- */

function isBoldElement(el) {
  if (el.tagName === "B" || el.tagName === "STRONG") return true;
  const fw = el.style && el.style.fontWeight;
  if (!fw) return false;
  if (fw === "bold" || fw === "bolder") return true;
  const n = parseInt(fw, 10);
  return !Number.isNaN(n) && n >= 600;
}

function htmlToPlainTextPreservingParagraphs(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  // mark bold runs with **markdown-style** markers so the plain-text field
  // can still carry them; processed top-down so nested bold-in-bold isn't
  // double-wrapped (the inner element gets detached once the parent's
  // textContent is replaced).
  container.querySelectorAll("*").forEach(el => {
    if (isBoldElement(el) && container.contains(el) && el.textContent.trim()) {
      el.textContent = "**" + el.textContent + "**";
    }
  });

  container.querySelectorAll("br").forEach(br => br.replaceWith("\n"));
  container.querySelectorAll("li").forEach(li => li.prepend("- "));

  container.querySelectorAll("p,div,li,tr,h1,h2,h3,h4,h5,h6,blockquote,section,article,table").forEach(el => {
    el.insertAdjacentText("afterend", "\n\n");
  });

  return (container.textContent || "")
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function insertTextAtCursor(el, text) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  el.value = el.value.slice(0, start) + text + el.value.slice(end);
  el.selectionStart = el.selectionEnd = start + text.length;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function wireFormattedPaste(el) {
  el.addEventListener("paste", (e) => {
    const html = e.clipboardData && e.clipboardData.getData("text/html");
    if (!html) return;
    e.preventDefault();
    insertTextAtCursor(el, htmlToPlainTextPreservingParagraphs(html));
  });
}

/* ---------- Export / Import (backup, move between devices) ----------
   IndexedDB is per-browser/per-device only, so this gives users a way to
   carry their own added content (images/PDFs included) between devices. */

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function base64ToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");

/* ---------- Cross-app backup (Elliott Wave + Trade Journal + Stock/Decide) ----------
   All three pages share one origin, so localStorage/IndexedDB are visible from any
   of them — this lets export/import cover the whole suite from a single button,
   regardless of which page you're on, without a build step or shared JS file. */

async function collectAllData() {
  const exportChapters = [];
  for (const ch of chapters) {
    const sections = [];
    for (const sec of ch.sections) {
      const copy = { ...sec };
      if (sec.pdf) copy.pdf = await blobToBase64(sec.pdf);
      sections.push(copy);
    }
    exportChapters.push({ id: ch.id, title: ch.title, desc: ch.desc, sections });
  }
  return {
    version: 1,
    app: "ee-suite-backup",
    exportedAt: new Date().toISOString(),
    elliottWave: { chapters: exportChapters },
    tradeJournal: {
      trades: JSON.parse(localStorage.getItem("tj_trades_v1") || "[]"),
      capital: Number(localStorage.getItem("tj_capital") || 0),
    },
    stockDecide: {
      watchlist: JSON.parse(localStorage.getItem("sd_watchlist") || "[]"),
      log: JSON.parse(localStorage.getItem("sd_log") || "[]"),
      watchlistScores: JSON.parse(localStorage.getItem("sd_watchlist_scores") || "{}"),
      apiKey: localStorage.getItem("sd_api_key") || "",
      finnhubKey: localStorage.getItem("sd_finnhub_key") || "",
    },
  };
}

async function restoreAllData(parsed) {
  const counts = { chapters: 0, trades: 0, watchlist: 0, log: 0 };

  // Elliott Wave (own data) — legacy exports had chapters at the top level
  const ewChapters = (parsed.elliottWave && parsed.elliottWave.chapters) || parsed.chapters || [];
  if (Array.isArray(ewChapters) && ewChapters.length) {
    const existingChapterIds = new Set(chapters.map(c => c.id));
    const importedChapters = [];
    for (const ch of ewChapters) {
      if (ch.id && existingChapterIds.has(ch.id)) continue; // already imported before — skip duplicate
      const sections = [];
      for (const sec of (ch.sections || [])) {
        const newSec = { ...sec, id: sec.id || uid() };
        if (typeof newSec.pdf === "string" && newSec.pdf.startsWith("data:")) {
          newSec.pdf = await base64ToBlob(newSec.pdf);
        }
        sections.push(newSec);
      }
      importedChapters.push({ id: ch.id || uid(), title: ch.title || "บทที่นำเข้า", desc: ch.desc || "", sections });
    }
    chapters = chapters.concat(importedChapters);
    await saveData();
    counts.chapters = importedChapters.length;
  }

  // Trade Journal (remote — merge straight into its localStorage keys)
  if (parsed.tradeJournal) {
    const tj = parsed.tradeJournal;
    if (Array.isArray(tj.trades) && tj.trades.length) {
      const existing = JSON.parse(localStorage.getItem("tj_trades_v1") || "[]");
      const existingIds = new Set(existing.map(t => t.id));
      const imported = tj.trades
        .filter(t => !(t.id && existingIds.has(t.id)))
        .map(t => ({ ...t, id: t.id || uid() }));
      localStorage.setItem("tj_trades_v1", JSON.stringify(existing.concat(imported)));
      counts.trades = imported.length;
    }
    if (tj.capital != null && !isNaN(Number(tj.capital))) {
      localStorage.setItem("tj_capital", String(Number(tj.capital)));
    }
  }

  // Stock/Decide (remote — merge straight into its localStorage keys)
  if (parsed.stockDecide) {
    const sd = parsed.stockDecide;
    if (Array.isArray(sd.watchlist) && sd.watchlist.length) {
      const existing = JSON.parse(localStorage.getItem("sd_watchlist") || "[]");
      localStorage.setItem("sd_watchlist", JSON.stringify(Array.from(new Set(existing.concat(sd.watchlist)))));
      counts.watchlist = sd.watchlist.length;
    }
    if (Array.isArray(sd.log) && sd.log.length) {
      const existing = JSON.parse(localStorage.getItem("sd_log") || "[]");
      const existingLogIds = new Set(existing.map(e => e.id).filter(Boolean));
      const imported = sd.log.filter(e => !(e.id && existingLogIds.has(e.id)));
      localStorage.setItem("sd_log", JSON.stringify(existing.concat(imported)));
      counts.log = imported.length;
    }
    if (sd.watchlistScores && typeof sd.watchlistScores === "object") {
      const existing = JSON.parse(localStorage.getItem("sd_watchlist_scores") || "{}");
      localStorage.setItem("sd_watchlist_scores", JSON.stringify(Object.assign(existing, sd.watchlistScores)));
    }
    if (sd.apiKey) localStorage.setItem("sd_api_key", sd.apiKey);
    if (sd.finnhubKey) localStorage.setItem("sd_finnhub_key", sd.finnhubKey);
  }

  return counts;
}

exportBtn.addEventListener("click", async () => {
  exportBtn.disabled = true;
  const originalLabel = exportBtn.textContent;
  exportBtn.textContent = "กำลังเตรียมไฟล์...";
  try {
    const payload = await collectAllData();
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const stamp = new Date().toISOString().slice(0, 10);
    triggerDownload(blob, `ee-suite-backup-${stamp}.json`);
  } catch (err) {
    console.error(err);
    alert("ส่งออกข้อมูลไม่สำเร็จ");
  } finally {
    exportBtn.disabled = false;
    exportBtn.textContent = originalLabel;
  }
});

importBtn.addEventListener("click", () => importInput.click());
importInput.addEventListener("change", async () => {
  const file = importInput.files[0];
  importInput.value = "";
  if (!file) return;

  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || typeof parsed !== "object") {
      alert("รูปแบบไฟล์ไม่ถูกต้อง");
      return;
    }
    const counts = await restoreAllData(parsed);
    activeChapterId = null;
    activeView = "home";
    renderContent();
    alert(`นำเข้าข้อมูลเรียบร้อย\nบทความ Elliott Wave: ${counts.chapters}\nเทรด: ${counts.trades}\nWatchlist: ${counts.watchlist}\nบันทึกการตัดสินใจ (Stock/Decide): ${counts.log}`);
  } catch (err) {
    console.error(err);
    alert("นำเข้าข้อมูลไม่สำเร็จ ไฟล์อาจเสียหายหรือไม่ใช่ไฟล์สำรองที่ถูกต้อง");
  }
});

/* ---------- Modal: add content ---------- */

const modal = document.getElementById("modal");
const addContentBtn = document.getElementById("addContentBtn");
const modalClose = document.getElementById("modalClose");
const cancelBtn = document.getElementById("cancelBtn");
const chapterSelect = document.getElementById("chapterSelect");
const newChapterRow = document.getElementById("newChapterRow");
const newChapterName = document.getElementById("newChapterName");
const sectionTitle = document.getElementById("sectionTitle");
wireFormattedPaste(document.getElementById("manualText"));

function openModal() {
  populateChapterSelect();
  modal.classList.add("open");
}
function closeModal() {
  modal.classList.remove("open");
  resetModalFields();
}

addContentBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

function populateChapterSelect() {
  chapterSelect.innerHTML = "";
  chapters.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch.id;
    opt.textContent = ch.title;
    chapterSelect.appendChild(opt);
  });
  const newOpt = document.createElement("option");
  newOpt.value = "__new__";
  newOpt.textContent = "＋ สร้างบทใหม่";
  chapterSelect.appendChild(newOpt);
}

chapterSelect.addEventListener("change", () => {
  newChapterRow.hidden = chapterSelect.value !== "__new__";
});

/* Subsections added directly from the "add content" modal */
let modalSubsections = []; // { id, title, text, image }
const modalSubsectionsList = document.getElementById("modalSubsectionsList");

document.getElementById("addModalSubsecBtn").addEventListener("click", () => {
  modalSubsections.push({ id: uid(), title: "", text: "", image: null });
  renderModalSubsections();
});

function renderModalSubsections() {
  modalSubsectionsList.innerHTML = "";
  modalSubsections.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "image-item";
    div.innerHTML = `
      <div class="image-item-head">
        <span class="image-item-name">หัวข้อย่อยที่ ${idx + 1}</span>
        <button type="button" class="image-item-remove" title="เอาออก">✕</button>
      </div>
      <input type="text" class="modal-subsec-title" placeholder="ชื่อหัวข้อย่อย" value="${escapeAttr(item.title)}" style="margin-bottom:8px;">
      <textarea class="modal-subsec-text image-item-text" rows="3" placeholder="เนื้อหา (ถ้ามี)">${item.text}</textarea>
      <div class="edit-media-wrap"></div>
      <label class="btn btn-secondary" style="margin-top:8px;">
        <span class="edit-image-label-text"></span>
        <input type="file" accept="image/*" class="modal-subsec-image-input" hidden>
      </label>
    `;
    div.querySelector(".image-item-remove").addEventListener("click", () => {
      modalSubsections = modalSubsections.filter(s => s.id !== item.id);
      renderModalSubsections();
    });
    div.querySelector(".modal-subsec-title").addEventListener("input", (e) => { item.title = e.target.value; });
    div.querySelector(".modal-subsec-text").addEventListener("input", (e) => { item.text = e.target.value; });
    wireFormattedPaste(div.querySelector(".modal-subsec-text"));

    const mediaWrap = div.querySelector(".edit-media-wrap");
    const labelText = div.querySelector(".edit-image-label-text");
    function renderMedia() {
      labelText.textContent = item.image ? "เปลี่ยนรูปตัวอย่าง" : "+ เพิ่มรูปตัวอย่าง";
      mediaWrap.innerHTML = item.image
        ? `<div class="edit-media-item"><img class="edit-media-preview" src="${item.image}"><button type="button" class="edit-remove-image">ลบรูปนี้</button></div>`
        : "";
      const removeBtn = mediaWrap.querySelector(".edit-remove-image");
      if (removeBtn) removeBtn.addEventListener("click", () => { item.image = null; renderMedia(); });
    }
    renderMedia();
    div.querySelector(".modal-subsec-image-input").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      item.image = await resizeImageToDataUrl(file, 1000);
      renderMedia();
    });

    modalSubsectionsList.appendChild(div);
  });
}

function collectModalSubsections() {
  return modalSubsections
    .filter(s => s.title.trim() || s.text.trim() || s.image)
    .map(s => ({ id: uid(), title: s.title.trim() || "หัวข้อย่อยใหม่", text: s.text.trim(), image: s.image || null }));
}

function resetModalFields() {
  document.getElementById("imageInput").value = "";
  pendingImages = [];
  renderImageItems();
  document.getElementById("ocrStatus").textContent = "";
  document.getElementById("manualText").value = "";
  sectionTitle.value = "";
  newChapterName.value = "";
  newChapterRow.hidden = true;

  modalSubsections = [];
  renderModalSubsections();

  pdfInput.value = "";
  if (modalPdfObjectUrl) { URL.revokeObjectURL(modalPdfObjectUrl); modalPdfObjectUrl = null; }
  pdfPreviewFrame.src = "";
  pdfPreviewWrap.hidden = true;
  pdfDropzoneText.hidden = false;
  pdfFileInfo.textContent = "";
  currentPdfFile = null;

  switchTab("image");
}

/* Tabs */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});
function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("tabImage").classList.toggle("active", tab === "image");
  document.getElementById("tabPdf").classList.toggle("active", tab === "pdf");
  document.getElementById("tabManual").classList.toggle("active", tab === "manual");
}

/* PDF select — stored and shown as-is, no conversion */
let currentPdfFile = null;
let modalPdfObjectUrl = null;
const MAX_PDF_SIZE = 30 * 1024 * 1024;

const pdfInput = document.getElementById("pdfInput");
const pdfDropzone = document.getElementById("pdfDropzone");
const pdfDropzoneText = document.getElementById("pdfDropzoneText");
const pdfPreviewWrap = document.getElementById("pdfPreviewWrap");
const pdfPreviewFrame = document.getElementById("pdfPreviewFrame");
const pdfFileInfo = document.getElementById("pdfFileInfo");

pdfDropzone.addEventListener("dragover", (e) => e.preventDefault());
pdfDropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) handlePdfFile(file);
});
pdfInput.addEventListener("change", () => {
  const file = pdfInput.files[0];
  if (file) handlePdfFile(file);
});

function handlePdfFile(file) {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) { alert("กรุณาเลือกไฟล์ PDF เท่านั้น"); return; }
  if (file.size > MAX_PDF_SIZE) { alert("ไฟล์ใหญ่เกินไป (จำกัด 30MB)"); return; }

  currentPdfFile = file;
  if (modalPdfObjectUrl) URL.revokeObjectURL(modalPdfObjectUrl);
  modalPdfObjectUrl = URL.createObjectURL(file);
  pdfPreviewFrame.src = modalPdfObjectUrl;
  pdfFileInfo.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  pdfPreviewWrap.hidden = false;
  pdfDropzoneText.hidden = true;
}

/* Image select (multiple) + resize + per-image OCR */
let pendingImages = []; // { id, file, dataUrl, text }

const imageInput = document.getElementById("imageInput");
const dropzone = document.getElementById("dropzone");
const dropzoneText = document.getElementById("dropzoneText");
const imageItemsList = document.getElementById("imageItemsList");
const ocrAllBtn = document.getElementById("ocrAllBtn");
const imgToPdfBtn = document.getElementById("imgToPdfBtn");
const ocrStatus = document.getElementById("ocrStatus");

dropzone.addEventListener("dragover", (e) => e.preventDefault());
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  handleImageFiles(e.dataTransfer.files);
});
imageInput.addEventListener("change", () => {
  handleImageFiles(imageInput.files);
  imageInput.value = "";
});

function handleImageFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.type.startsWith("image/"));
  files.forEach(file => {
    const item = { id: uid(), file, dataUrl: null, text: "" };
    pendingImages.push(item);
    resizeImageToDataUrl(file, 1000).then(dataUrl => {
      item.dataUrl = dataUrl;
      renderImageItems();
    });
  });
  renderImageItems();
}

function renderImageItems() {
  dropzoneText.textContent = pendingImages.length
    ? "คลิกเพื่อเพิ่มรูปอีก หรือวางรูปที่นี่"
    : "คลิกเพื่อเลือกรูป (เลือกได้หลายรูปพร้อมกัน) หรือวางรูปที่นี่";
  ocrAllBtn.disabled = pendingImages.length === 0;
  imgToPdfBtn.disabled = pendingImages.length === 0;

  imageItemsList.innerHTML = "";
  pendingImages.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "image-item";
    div.innerHTML = `
      <div class="image-item-head">
        ${item.dataUrl ? `<img class="image-item-thumb" src="${item.dataUrl}">` : `<div class="image-item-thumb"></div>`}
        <span class="image-item-name">รูปที่ ${idx + 1}</span>
        <button type="button" class="image-item-remove" title="เอาออก">✕</button>
      </div>
      <textarea class="image-item-text" rows="4" placeholder="ข้อความที่อ่านได้จากรูปนี้ (แก้ไขได้)">${item.text}</textarea>
    `;
    div.querySelector(".image-item-remove").addEventListener("click", () => {
      pendingImages = pendingImages.filter(p => p.id !== item.id);
      renderImageItems();
    });
    div.querySelector(".image-item-text").addEventListener("input", (e) => {
      item.text = e.target.value;
    });
    wireFormattedPaste(div.querySelector(".image-item-text"));
    imageItemsList.appendChild(div);
  });
}

function resizeImageToDataUrl(file, maxWidth) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    reader.readAsDataURL(file);
  });
}

/* Grayscale + contrast-stretch the photo before OCR — photographed pages/slides
   usually have low, uneven contrast that badly hurts Tesseract's accuracy. */
function preprocessForOcr(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      const gray = new Uint8ClampedArray(d.length / 4);
      let min = 255, max = 0;
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        gray[p] = g;
        if (g < min) min = g;
        if (g > max) max = g;
      }
      const range = Math.max(1, max - min);
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const v = ((gray[p] - min) / range) * 255;
        d[i] = d[i + 1] = d[i + 2] = v;
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas);
    };
    reader.readAsDataURL(file);
  });
}

function cleanOcrText(text) {
  return text
    .split("\n")
    .map(line => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

let ocrWorker = null;
let ocrProgressLabel = "";
async function getOcrWorker() {
  if (!ocrWorker) {
    ocrWorker = await Tesseract.createWorker("tha+eng", 1, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          ocrStatus.textContent = `${ocrProgressLabel} (${Math.round(m.progress * 100)}%)`;
        }
      }
    });
    // treat each photo as one uniform block of text — layout auto-detection
    // tends to scramble line order when a page mixes text with diagrams/photos
    await ocrWorker.setParameters({ tessedit_pageseg_mode: "6" });
  }
  return ocrWorker;
}

ocrAllBtn.addEventListener("click", async () => {
  ocrAllBtn.disabled = true;
  imgToPdfBtn.disabled = true;
  try {
    const worker = await getOcrWorker();
    for (let i = 0; i < pendingImages.length; i++) {
      const item = pendingImages[i];
      ocrProgressLabel = `กำลังอ่านรูปที่ ${i + 1}/${pendingImages.length}...`;
      ocrStatus.textContent = ocrProgressLabel;
      try {
        const canvas = await preprocessForOcr(item.file);
        const { data } = await worker.recognize(canvas);
        item.text = cleanOcrText(data.text);
      } catch (err) {
        console.error(err);
      }
      renderImageItems();
    }
    ocrStatus.textContent = pendingImages.length
      ? "อ่านข้อความครบทุกรูปแล้ว ตรวจสอบ/แก้ไขได้ก่อนบันทึก"
      : "";
  } catch (err) {
    console.error(err);
    ocrStatus.textContent = "เกิดข้อผิดพลาดในการอ่านข้อความ ลองใหม่อีกครั้ง";
  } finally {
    ocrAllBtn.disabled = pendingImages.length === 0;
    imgToPdfBtn.disabled = pendingImages.length === 0;
  }
});

/* Skip OCR entirely — bundle the original photos as-is into a PDF (client-side
   equivalent of TCPDF; TCPDF itself is PHP-only and needs a server, which this
   static site doesn't have) */
function getImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = dataUrl;
  });
}

imgToPdfBtn.addEventListener("click", async () => {
  if (!pendingImages.length) return;
  ocrAllBtn.disabled = true;
  imgToPdfBtn.disabled = true;
  ocrStatus.textContent = "กำลังแปลงรูปเป็น PDF...";
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 24;

    for (let i = 0; i < pendingImages.length; i++) {
      const item = pendingImages[i];
      const dims = await getImageDimensions(item.dataUrl);
      const scale = Math.min((pageW - margin * 2) / dims.width, (pageH - margin * 2) / dims.height);
      const w = dims.width * scale;
      const h = dims.height * scale;
      if (i > 0) doc.addPage();
      doc.addImage(item.dataUrl, "JPEG", (pageW - w) / 2, (pageH - h) / 2, w, h);
    }

    const blob = doc.output("blob");
    const fileName = pendingImages.length > 1
      ? `สแกนรูปภาพ (${pendingImages.length} หน้า).pdf`
      : "สแกนรูปภาพ.pdf";
    const pdfFile = new File([blob], fileName, { type: "application/pdf" });

    handlePdfFile(pdfFile);
    switchTab("pdf");
    ocrStatus.textContent = "";
  } catch (err) {
    console.error(err);
    alert("แปลงเป็น PDF ไม่สำเร็จ ลองใหม่อีกครั้ง");
  } finally {
    ocrAllBtn.disabled = pendingImages.length === 0;
    imgToPdfBtn.disabled = pendingImages.length === 0;
  }
});

/* Save content */
document.getElementById("saveContentBtn").addEventListener("click", async () => {
  const activeTab = document.querySelector(".tab-btn.active").dataset.tab;

  if (activeTab === "image" && !pendingImages.length) {
    alert("กรุณาเลือกรูปอย่างน้อย 1 รูปก่อนบันทึก");
    return;
  }
  if (activeTab === "manual" && !document.getElementById("manualText").value.trim()) {
    alert("กรุณาพิมพ์เนื้อหาก่อนบันทึก");
    return;
  }
  if (activeTab === "pdf" && !currentPdfFile) {
    alert("กรุณาเลือกไฟล์ PDF ก่อนบันทึก");
    return;
  }

  let targetChapter;
  if (chapterSelect.value === "__new__") {
    const name = newChapterName.value.trim();
    if (!name) { alert("กรุณาตั้งชื่อบทใหม่"); return; }
    targetChapter = { id: uid(), title: name, desc: "", sections: [] };
    chapters.push(targetChapter);
  } else {
    targetChapter = chapters.find(c => c.id === chapterSelect.value);
  }

  const baseTitle = sectionTitle.value.trim() || "เนื้อหาที่เพิ่มใหม่";

  if (activeTab === "image") {
    pendingImages.forEach((item, idx) => {
      targetChapter.sections.push({
        id: uid(),
        title: pendingImages.length > 1 ? `${baseTitle} (${idx + 1})` : baseTitle,
        text: item.text.trim(),
        image: item.dataUrl || null,
        pdf: null,
        pdfName: null,
        subsections: collectModalSubsections()
      });
    });
  } else if (activeTab === "manual") {
    targetChapter.sections.push({
      id: uid(),
      title: baseTitle,
      text: document.getElementById("manualText").value.trim(),
      image: null,
      pdf: null,
      pdfName: null,
      subsections: collectModalSubsections()
    });
  } else if (activeTab === "pdf") {
    targetChapter.sections.push({
      id: uid(),
      title: baseTitle,
      text: "",
      image: null,
      pdf: currentPdfFile,
      pdfName: currentPdfFile.name,
      subsections: collectModalSubsections()
    });
  }

  activeChapterId = targetChapter.id;
  activeView = "chapter";
  await saveData();
  renderContent();
  closeModal();
});

/* ---------- Init ---------- */
(async function init() {
  chapters = await loadData();
  activeView = "home";
  activeChapterId = null;
  renderContent();
})();
