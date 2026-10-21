# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

นักเทรดรายบุคคล (Individual / Retail Thai Trader) ที่ต้องการระบบจัดการการเทรดและวิเคราะห์การลงทุนแบบครบวงจรในที่เดียว ใช้งานทั้งช่วงเตรียมตัวก่อนตลาดเปิด (Pre-market Setup), ระหว่างตลาดเปิดทำการ (Live Decision & Risk Control), และหลังตลาดปิด (Post-market Review & Trade Journaling)

## Product Purpose

เป็น "ห้องนักบิน" หรือศูนย์บัญชาการการเทรดส่วนตัว (Personal Trading Cockpit) ที่รวบรวมเครื่องมือคำนวณ Position Sizing / บริหารความเสี่ยง, บันทึกประวัติการเทรด (Trade Journal), และวิเคราะห์ทางเทคนิคตามทฤษฎี Elliott Wave เพื่อช่วยให้นักเทรดรักษาวินัย มีระบบที่ชัดเจน ลดการตัดสินใจด้วยอารมณ์ และประเมินพัฒนาการของตนเองได้อย่างเป็นรูปธรรม

## Positioning

Cockpit การเทรดภาษาไทยที่เบา คล่องตัว โหลดเปิดใช้งานได้ทันทีโดยไม่ต้องพึ่งพา Bundler/Build Tools ซับซ้อน พร้อมระบบซิงค์ข้อมูลข้ามอุปกรณ์ผ่าน Google Firebase แบบ Real-time

## Operating Context

- ใช้งานบนคอมพิวเตอร์เดสก์ท็อปและสมาร์ตโฟน/แท็บเล็ต ระหว่างเฝ้าติดตามตลาดหุ้น คริปโต หรืออนุพันธ์
- ใช้งานควบคู่กับซอฟต์แวร์ดูกราฟหลัก (เช่น TradingView, Streaming) โดยห้องนักบินทำหน้าที่เป็นฐานข้อมูลบันทึกและคำนวณการตัดสินใจ
- สภาพแวดล้อมการใช้งานทั้งกลางวันและกลางคืน จึงรองรับทั้ง Light Theme และ Dark Theme

## Capabilities and Constraints

### Capabilities
- **แดชบอร์ดห้องนักบิน (`index.html`):** ภาพรวมสถิติพอร์ต, Watchlist, Equity Curve, สรุปสถานะตลาด และทางลัดเข้าสู่ทุกเครื่องมือ
- **สมุดบันทึกการเทรด (`trade-journal.html`):** บันทึกการเข้า/ออกออเดอร์, RR, สภาพจิตวิทยา/Setup, แนบรูปกราฟ และสถิติ Win Rate / P&L
- **เทอร์มินัลช่วยตัดสินใจ (`stock-decision-terminal.html`):** Checklist ตรวจสอบเงื่อนไขการเข้าเทรดและประเมินความเสี่ยง
- **เครื่องมือวิเคราะห์ Elliott Wave (`elliott-wave.html`, `elliott-wave-analyzer.html`):** ตรวจสอบโครงสร้างคลื่น สัดส่วน Fibonacci Retracement/Extension
- **เครื่องมือคำนวณการเทรด (`trading-tools.html`):** คำนวณ Lot/Position Size, Risk per Trade, Breakeven
- **ระบบ Cloud Sync (`firebase-sync.js`):** ซิงค์ข้อมูลพอร์ตและบันทึกข้ามอุปกรณ์ด้วย Google Firebase
- **ส่วนเสริมการเรียนรู้/สันทนาการ:** คลังแบบทดสอบข้อสอบ ก.พ. / กฎหมาย / ไอที (`quiz.html`) และมินิเกมการ์ด (`card-battler.html`)

### Constraints
- Pure Web: ใช้ HTML5, Vanilla JavaScript และ CSS3 โดยตรง ไม่ต้องพึ่งพา Node build step หรือ Framework ภายนอก
- สามารถเปิดใช้งานผ่าน Static Web Server หรือเปิดไฟล์ Local (`file://`) ได้อย่างราบรื่น
- จัดเก็บข้อมูลหลักใน LocalStorage/IndexedDB ร่วมกับ Firebase Firestore

## Brand Commitments

- **ชื่อทางการ:** ห้องนักบิน · Trading Cockpit
- **ภาษา:** ภาษาไทยสำหรับคำอธิบาย คำแนะนำ และเมนู ผสมผสานคำศัพท์เทคนิคสากลทางการเงิน/การเทรด
- **บุคลิก:** เฉียบคม, เป็นระเบียบ, น่าเชื่อถือ, อิงข้อมูลจริง (Disciplined, Data-driven, Focused)

## Evidence on Hand

- หน้าเว็บและโมดูลการทำงานที่พัฒนาแล้วในรูทโปรเจกต์ (`index.html`, `trade-journal.html`, `stock-decision-terminal.html`, `elliott-wave.html`, `elliott-wave-analyzer.html`, `trading-tools.html`)
- ชุดสไตล์ชีตและสคริปต์หลัก (`style.css`, `script.js`, `firebase-sync.js`)

## Product Principles

1. **Speed & Zero-Friction:** หน้าจอโหลดได้ทันที โต้ตอบรวดเร็ว ไร้ความล่าช้า เพื่อให้ทันท่วงทีกับจังหวะตลาด
2. **Discipline over Emotion:** ทุกเครื่องมือเน้นการตอกย้ำวินัย การคำนวณ Risk/Reward และ Checklist ก่อนออกออเดอร์
3. **High Information Density with Visual Hierarchy:** จัดวางข้อมูลเข้มข้นแต่สบายตา แยกกลุ่มความสำคัญชัดเจนด้วย Hierarchy ที่ดี
4. **Device Agnostic & Portability:** รองรับหน้าจอทุกขนาด (Responsive) และพร้อมซิงค์ข้อมูลติดตามไปใช้งานได้ทุกอุปกรณ์
