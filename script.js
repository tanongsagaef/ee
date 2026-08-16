/* ---------- Wave diagrams (inline SVG, theme-aware via CSS vars) ---------- */

function impulseDiagram() {
  return `
  <div class="diagram-wrap">
    <svg viewBox="0 0 420 200" width="100%" height="200" style="max-width:420px">
      <polyline points="10,150 70,50 110,110 220,20 260,90 400,10"
        fill="none" style="stroke:var(--wave-line)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      <g style="fill:var(--text)" font-size="14" font-weight="600" text-anchor="middle">
        <text x="10" y="168">0</text>
        <text x="70" y="40">1</text>
        <text x="110" y="128">2</text>
        <text x="220" y="12">3</text>
        <text x="260" y="108">4</text>
        <text x="400" y="0" dy="14">5</text>
      </g>
      <g style="stroke:var(--border)" stroke-dasharray="3 3">
        <line x1="10" y1="150" x2="400" y2="150"/>
      </g>
    </svg>
  </div>`;
}

function correctiveDiagram() {
  return `
  <div class="diagram-wrap">
    <svg viewBox="0 0 300 180" width="100%" height="180" style="max-width:300px">
      <polyline points="10,20 90,120 140,70 260,160"
        fill="none" style="stroke:var(--wave-corrective)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      <g style="fill:var(--text)" font-size="14" font-weight="600" text-anchor="middle">
        <text x="10" y="14">5</text>
        <text x="90" y="140">A</text>
        <text x="140" y="58">B</text>
        <text x="260" y="178">C</text>
      </g>
    </svg>
  </div>`;
}

function cycleDiagram() {
  return `
  <div class="diagram-wrap">
    <svg viewBox="0 0 460 200" width="100%" height="200" style="max-width:460px">
      <polyline points="10,150 60,60 95,110 190,20 225,85 300,50"
        fill="none" style="stroke:var(--wave-line)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      <polyline points="300,50 350,130 385,95 450,160"
        fill="none" style="stroke:var(--wave-corrective)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      <g style="fill:var(--text)" font-size="13" font-weight="600" text-anchor="middle">
        <text x="60" y="50">1</text><text x="95" y="128">2</text>
        <text x="190" y="12">3</text><text x="225" y="103">4</text>
        <text x="300" y="40">5</text>
        <text x="350" y="148">A</text><text x="385" y="85">B</text><text x="450" y="178">C</text>
      </g>
    </svg>
  </div>`;
}

/* ---------- Default content ---------- */

const DEFAULT_CHAPTERS = [
  {
    id: "intro",
    title: "อีเลียตเวฟคืออะไร",
    desc: "ความรู้พื้นฐานก่อนเริ่มนับคลื่น",
    sections: [
      {
        id: "s1",
        title: "แนวคิดพื้นฐาน",
        text: "Elliott Wave Theory คิดค้นโดย Ralph Nelson Elliott ในช่วงทศวรรษ 1930 มีแนวคิดว่าราคาสินทรัพย์ในตลาดการเงินเคลื่อนไหวเป็นรูปแบบคลื่นที่ซ้ำกันไปเรื่อย ๆ ซึ่งสะท้อนจิตวิทยาหมู่ (mass psychology) ของผู้เข้าร่วมตลาดระหว่างช่วงมองบวก (optimism) และมองลบ (pessimism)\n\nคลื่นราคาแบ่งออกเป็น 2 ประเภทหลัก คือ คลื่นแรงขับ (Impulse Wave) ที่เคลื่อนไปตามทิศทางเทรนด์หลัก และ คลื่นปรับฐาน (Corrective Wave) ที่เคลื่อนสวนทางเทรนด์หลักเพื่อพักตัว",
        image: null
      }
    ]
  },
  {
    id: "structure",
    title: "โครงสร้างคลื่นหลัก",
    desc: "รูปแบบ 5 คลื่นแรงขับ + 3 คลื่นปรับฐาน และธรรมชาติแบบเฟรกทัล",
    sections: [
      {
        id: "s1",
        title: "วงจรคลื่นสมบูรณ์ (1 รอบ)",
        text: "คลื่นหนึ่งรอบสมบูรณ์ประกอบด้วย 8 คลื่นย่อย แบ่งเป็นคลื่นแรงขับ 5 คลื่น (1-2-3-4-5) ตามด้วยคลื่นปรับฐาน 3 คลื่น (A-B-C)\n\nจุดสำคัญคือ Elliott Wave มีลักษณะแบบเฟรกทัล (fractal) กล่าวคือแต่ละคลื่นย่อยจะประกอบด้วยคลื่นที่เล็กลงไปอีกในรูปแบบเดียวกัน และสามารถขยายรวมกันเป็นคลื่นที่ใหญ่ขึ้นได้เช่นกัน ทำให้หลักการนี้ใช้ได้กับทุกกรอบเวลา (timeframe) ตั้งแต่กราฟรายนาทีไปจนถึงกราฟรายปี",
        image: null
      },
      {
        id: "s2",
        title: "แผนภาพโครงสร้างคลื่น",
        text: "",
        html: cycleDiagram(),
        image: null
      }
    ]
  },
  {
    id: "impulse",
    title: "คลื่นแรงขับ (Impulse Wave)",
    desc: "คลื่น 1-2-3-4-5 ที่เคลื่อนไหวตามทิศทางเทรนด์หลัก",
    sections: [
      {
        id: "s1",
        title: "แผนภาพคลื่นแรงขับ",
        text: "",
        html: impulseDiagram(),
        image: null
      },
      {
        id: "s2",
        title: "ลักษณะของแต่ละคลื่นย่อย",
        text: "คลื่น 1: จุดเริ่มต้นของเทรนด์ใหม่ มักเกิดขึ้นเงียบ ๆ ยังไม่มีใครเชื่อว่าเทรนด์เปลี่ยน\nคลื่น 2: ปรับฐานสวนทาง แต่ต้องไม่ย้อนกลับไปต่ำกว่าจุดเริ่มต้นของคลื่น 1\nคลื่น 3: มักเป็นคลื่นที่แรงและยาวที่สุด เกิดจากนักลงทุนส่วนใหญ่เริ่มมั่นใจในเทรนด์ ห้ามเป็นคลื่นที่สั้นที่สุดเมื่อเทียบกับคลื่น 1 และ 5\nคลื่น 4: ปรับฐานอีกครั้ง มักเคลื่อนไหวแบบไซด์เวย์ ต้องไม่ทับซ้อนกับพื้นที่ราคาของคลื่น 1\nคลื่น 5: คลื่นสุดท้ายของเทรนด์ อาจมีแรงส่งน้อยกว่าคลื่น 3 (สังเกตได้จาก divergence ของ indicator เช่น RSI/MACD)",
        image: null
      }
    ]
  },
  {
    id: "corrective",
    title: "คลื่นปรับฐาน (Corrective Wave)",
    desc: "คลื่น A-B-C และรูปแบบย่อยที่พบบ่อย",
    sections: [
      {
        id: "s1",
        title: "แผนภาพคลื่นปรับฐาน",
        text: "",
        html: correctiveDiagram(),
        image: null
      },
      {
        id: "s2",
        title: "รูปแบบคลื่นปรับฐานที่พบบ่อย",
        text: "Zigzag (5-3-5): ปรับฐานแบบชันและรวดเร็ว คลื่น A และ C มีโครงสร้างแบบคลื่นแรงขับย่อย (5 คลื่น) ส่วนคลื่น B เป็นคลื่นเล็ก (3 คลื่น)\n\nFlat (3-3-5): ราคาเคลื่อนไหวแบบไซด์เวย์ คลื่น B มักยาวเกือบเท่าคลื่น A\n\nTriangle (3-3-3-3-3): คลื่นย่อย 5 เส้น (A-B-C-D-E) บีบตัวแคบลงเรื่อย ๆ มักเกิดก่อนคลื่นสุดท้ายของเทรนด์ใหญ่",
        image: null
      }
    ]
  },
  {
    id: "rules",
    title: "กฎเหล็ก 3 ข้อ (Three Rules)",
    desc: "กฎที่ห้ามละเมิด หากละเมิดแปลว่านับคลื่นผิด",
    sections: [
      {
        id: "s1",
        title: "กฎที่ต้องเป็นจริงเสมอ",
        text: "1) คลื่น 2 ห้ามย้อนกลับเกิน 100% ของคลื่น 1 (ห้ามต่ำกว่าจุดเริ่มต้นของคลื่น 1)\n\n2) คลื่น 3 ห้ามเป็นคลื่นที่สั้นที่สุด เมื่อเทียบกับคลื่น 1 และคลื่น 5\n\n3) คลื่น 4 ห้ามเคลื่อนที่ทับซ้อนกับพื้นที่ราคาของคลื่น 1 (ยกเว้นกรณีพิเศษ เช่น diagonal triangle)\n\nหากการนับคลื่นใดละเมิดกฎข้อใดข้อหนึ่งข้างต้น แสดงว่าการนับคลื่นนั้นผิดพลาด ต้องนับใหม่",
        image: null
      }
    ]
  },
  {
    id: "guidelines",
    title: "แนวทางเสริม (Guidelines)",
    desc: "ไม่ใช่กฎตายตัว แต่ช่วยให้นับคลื่นแม่นยำขึ้น",
    sections: [
      {
        id: "s1",
        title: "แนวทางที่ควรรู้",
        text: "Alternation (ความสลับรูปแบบ): คลื่น 2 และคลื่น 4 มักมีรูปแบบที่ต่างกัน เช่น ถ้าคลื่น 2 เป็น zigzag คลื่น 4 มักเป็น flat หรือ triangle\n\nEquality (ความเท่ากัน): หากคลื่น 3 extend (ยืดยาวผิดปกติ) คลื่น 5 มักมีความยาวใกล้เคียงกับคลื่น 1\n\nChanneling: การลากเส้นแนวโน้มขนานคลุมคลื่น 2 และ 4 ช่วยประเมินแนวรับแนวต้านของคลื่น 5\n\nWave Personality: แต่ละคลื่นมีบุคลิกลักษณะเฉพาะของตัวเอง เช่น คลื่น 3 มักมีปริมาณการซื้อขาย (volume) สูงและข่าวสนับสนุนชัดเจน",
        image: null
      }
    ]
  },
  {
    id: "fibonacci",
    title: "อัตราส่วนฟีโบนักชี",
    desc: "ตัวเลขที่ใช้ประเมินเป้าหมายและแนวรับแนวต้านของแต่ละคลื่น",
    sections: [
      {
        id: "s1",
        title: "อัตราส่วนที่ใช้บ่อย",
        text: "Retracement (คลื่นปรับฐาน 2 และ 4): 0.382, 0.5, 0.618, 0.786\n\nExtension (คลื่นแรงขับ 3 และ 5): 1.0, 1.272, 1.618, 2.618\n\nตัวเลขเหล่านี้มาจากอนุกรมฟีโบนักชี (Fibonacci sequence) ซึ่ง Elliott สังเกตว่าความยาวและสัดส่วนของคลื่นราคามักมีความสัมพันธ์กับอัตราส่วนเหล่านี้ นักวิเคราะห์จึงใช้ร่วมกับการนับคลื่นเพื่อประเมินเป้าหมายราคาและจุดกลับตัวที่เป็นไปได้",
        image: null
      }
    ]
  },
  {
    id: "apply",
    title: "การประยุกต์ใช้ในการเทรด",
    desc: "ข้อควรระวังและแนวทางนำไปใช้จริง",
    sections: [
      {
        id: "s1",
        title: "แนวทางปฏิบัติ",
        text: "1. เริ่มนับคลื่นจากกรอบเวลาใหญ่ก่อน (เช่น รายวัน/รายสัปดาห์) แล้วค่อยลงไปดูกรอบเวลาเล็กลง เพื่อให้เห็นภาพรวมของเทรนด์\n\n2. ใช้ร่วมกับเครื่องมือยืนยันอื่น เช่น Fibonacci, แนวรับแนวต้าน, indicator อย่าง RSI/MACD เพื่อลดความเป็นอัตวิสัย (subjectivity) ในการนับคลื่น\n\n3. การนับคลื่นอาจผิดพลาดหรือถูกนับใหม่ได้เสมอเมื่อมีข้อมูลราคาล่าสุดเข้ามา จึงควรใช้เพื่อประเมินโอกาสและอัตราส่วนความเสี่ยงต่อผลตอบแทน (risk/reward) มากกว่าใช้ทำนายราคาที่แน่นอน\n\nหมายเหตุ: เนื้อหาทั้งหมดจัดทำขึ้นเพื่อการศึกษาทบทวนเท่านั้น ไม่ถือเป็นคำแนะนำการลงทุน",
        image: null
      }
    ]
  }
];

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

  const defaults = JSON.parse(JSON.stringify(DEFAULT_CHAPTERS));
  await dbSetChapters(defaults);
  return defaults;
}

async function saveData() {
  await dbSetChapters(chapters);
}

/* ---------- State ---------- */

let chapters = [];
let activeChapterId = null;

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

/* ---------- Sidebar / mobile menu ---------- */

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

document.getElementById("menuToggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("open");
});
overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
});

/* ---------- Render ---------- */

function renderSidebar() {
  const list = document.getElementById("chapterList");
  list.innerHTML = "";
  chapters.forEach(ch => {
    const li = document.createElement("li");
    li.className = "chapter-item";

    const btn = document.createElement("button");
    btn.className = "chapter-btn" + (ch.id === activeChapterId ? " active" : "");
    btn.textContent = ch.title;
    btn.addEventListener("click", () => {
      activeChapterId = ch.id;
      renderSidebar();
      renderContent();
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
    });
    li.appendChild(btn);

    const del = document.createElement("button");
    del.className = "chapter-del";
    del.title = "ลบบทนี้";
    del.textContent = "✕";
    del.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (confirm(`ลบบท "${ch.title}" ทั้งหมดหรือไม่?`)) {
        chapters = chapters.filter(c => c.id !== ch.id);
        if (activeChapterId === ch.id) {
          activeChapterId = chapters[0]?.id;
        }
        await saveData();
        renderSidebar();
        renderContent();
      }
    });
    li.appendChild(del);

    list.appendChild(li);
  });
}

let sectionObjectUrls = [];

function renderContent() {
  sectionObjectUrls.forEach(u => URL.revokeObjectURL(u));
  sectionObjectUrls = [];

  const content = document.getElementById("content");
  const chapter = chapters.find(c => c.id === activeChapterId);
  if (!chapter) {
    content.innerHTML = `<p class="empty-chapter">ยังไม่มีบทเนื้อหา กด "+ เพิ่มเนื้อหา" เพื่อเริ่มต้น</p>`;
    return;
  }

  let html = `<h1>${escapeHtml(chapter.title)}</h1>`;
  if (chapter.desc) html += `<p class="chapter-desc">${escapeHtml(chapter.desc)}</p>`;

  if (!chapter.sections.length) {
    html += `<p class="empty-chapter">บทนี้ยังไม่มีเนื้อหา</p>`;
  }

  chapter.sections.forEach(sec => {
    html += `<article class="section-card" data-section-id="${sec.id}">`;
    if (sec.title) html += `<h3>${escapeHtml(sec.title)}</h3>`;
    if (sec.html) html += sec.html;
    if (sec.text) html += `<div class="section-text">${escapeHtml(sec.text)}</div>`;
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
    if (!sec.html) {
      html += `<div class="section-actions">
        <button class="edit-sec">แก้ไข</button>
        <button class="danger del-sec">ลบ</button>
      </div>`;
    }
    html += `</article>`;
  });

  content.innerHTML = html;

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

document.getElementById("resetBtn").addEventListener("click", async () => {
  if (confirm("รีเซ็ตกลับเป็นเนื้อหาเริ่มต้นทั้งหมด? เนื้อหาที่คุณเพิ่มเองจะถูกลบถาวร")) {
    chapters = JSON.parse(JSON.stringify(DEFAULT_CHAPTERS));
    await saveData();
    activeChapterId = chapters[0]?.id;
    renderSidebar();
    renderContent();
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

function resetModalFields() {
  document.getElementById("imageInput").value = "";
  pendingImages = [];
  renderImageItems();
  document.getElementById("ocrStatus").textContent = "";
  document.getElementById("manualText").value = "";
  sectionTitle.value = "";
  newChapterName.value = "";
  newChapterRow.hidden = true;

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
        pdfName: null
      });
    });
  } else if (activeTab === "manual") {
    targetChapter.sections.push({
      id: uid(),
      title: baseTitle,
      text: document.getElementById("manualText").value.trim(),
      image: null,
      pdf: null,
      pdfName: null
    });
  } else if (activeTab === "pdf") {
    targetChapter.sections.push({
      id: uid(),
      title: baseTitle,
      text: "",
      image: null,
      pdf: currentPdfFile,
      pdfName: currentPdfFile.name
    });
  }

  activeChapterId = targetChapter.id;
  await saveData();
  renderSidebar();
  renderContent();
  closeModal();
});

/* ---------- Init ---------- */
(async function init() {
  chapters = await loadData();
  activeChapterId = chapters[0]?.id;
  renderSidebar();
  renderContent();
})();
