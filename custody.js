// Custody: a real hash chain computed in the browser (SHA-256), with a "tamper" demo that breaks it
const $ = (id) => document.getElementById(id);
const ROWS = [
  ['48,213', '10:42:17 ص', 'محقق — [الاسم]', 'استلام الدليل'],
  ['48,214', '10:42:18 ص', 'النظام', 'تخزين الأصل (Object Lock)'],
  ['48,215', '10:42:19 ص', 'النظام', 'تحقق البصمة — مطابقة'],
  ['48,218', '10:44:02 ص', 'نور — خبيرة', 'بدء التحليل (6 كواشف)'],
  ['48,219', '10:44:02 ص', 'النظام', 'إصدارات النماذج مثبّتة'],
  ['48,224', '10:51:40 ص', 'النظام', 'اكتمال التحليل — غير حاسم'],
  ['48,226', '10:58:05 ص', 'نور — خبيرة', 'كتابة الرأي الفني'],
  ['48,227', '10:58:31 ص', 'نور — خبيرة', 'توقيع وإرسال للمراجعة'],
  ['48,229', '11:02:12 ص', 'مراجع — [الاسم]', 'فتح التقرير للمراجعة'],
];
const short = (h) => h.slice(0, 4) + '…' + h.slice(-4);
async function sha(s) {
  if (!crypto.subtle) return [...s].reduce((a, c) => ((a * 31 + c.charCodeAt(0)) >>> 0), 7).toString(16).padStart(64, '0');
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
const rowText = (r, prev) => [prev, r[1], r[2], r[3], r[0]].join('\u001f');
let stored = [], tampered = false;

async function build() {           // the chain as it was written (stored hashes)
  let prev = '4b1e' + '0'.repeat(56) + '77c0';
  stored = [];
  for (const r of ROWS) { const h = await sha(rowText(r, prev)); stored.push({ prev, hash: h }); prev = h; }
}
function render(brokenAt = -1) {
  $('log').innerHTML = ROWS.map((r, i) => {
    const action = tampered && i === 5 ? 'اكتمال التحليل — لا مؤشرات تلاعب' : r[3];
    const bad = i === brokenAt;
    return `<tr class="${bad ? 'broken' : ''}"><td class="mono">${r[0]}</td><td style="white-space:nowrap">${r[1]}</td><td>${r[2]}</td><td>${action}</td>` +
      `<td class="mono ltr" style="color:#5E5563">${short(stored[i].prev)}</td><td class="mono ltr">${short(stored[i].hash)}${bad ? ' ✗' : ''}</td></tr>`;
  }).join('');
}
async function verify() {           // recompute every hash from the row content and compare
  for (let i = 0; i < ROWS.length; i++) {
    const r = tampered && i === 5 ? [...ROWS[i].slice(0, 3), 'اكتمال التحليل — لا مؤشرات تلاعب'] : ROWS[i];
    const h = await sha(rowText(r, stored[i].prev));
    if (h !== stored[i].hash) return i;
  }
  return -1;
}
async function check() {
  const at = await verify(); render(at);
  const ok = at < 0;
  $('banner').classList.toggle('broken', !ok);
  $('bIcon').setAttribute('d', ok ? 'M9 12l2 2 4-4' : 'M9 9l6 6M15 9l-6 6');
  $('bTitle').textContent = ok ? 'السلسلة سليمة' : `السلسلة مكسورة عند السطر ${ROWS[at][0]}`;
  const d = new Date(); let hh = d.getHours(); const ap = hh < 12 ? 'ص' : 'م'; hh = hh % 12 || 12;
  $('bText').textContent = ok ? `تم الفحص ${hh}:${String(d.getMinutes()).padStart(2, '0')} ${ap} · كل البصمات المحسوبة تطابق المخزّنة`
    : 'محتوى السطر تغيّر بعد كتابته: بصمته المحسوبة ما تطابق المخزّنة. انبلّغ مدير النظام.';
}
$('btnVerify').addEventListener('click', check);
$('btnTamper').addEventListener('click', () => {
  tampered = !tampered;
  $('btnTamper').textContent = tampered ? 'رجّعي السطر لأصله' : 'جرّبي: عدّلي سطرًا بالقاعدة';
  check();
});
$('btnExport').addEventListener('click', () => { $('exportNote').textContent = 'بالنموذج التخيلي ما ينزل ملف — بالنظام الحقيقي تطلع حزمة موقّعة.'; });
build().then(() => render());
