// Intake: compute a real SHA-256 in the browser (the file never leaves the device) and show the receipt
const $ = (id) => document.getElementById(id);
const SIGS = [
  [[0xFF, 0xD8, 0xFF], 'JPEG'], [[0x89, 0x50, 0x4E, 0x47], 'PNG'], [[0x52, 0x49, 0x46, 0x46], 'RIFF (WebP/WAV)'],
  [[0x4F, 0x67, 0x67, 0x53], 'OGG/Opus'], [[0x49, 0x44, 0x33], 'MP3'], [[0x25, 0x50, 0x44, 0x46], 'PDF'],
];
function sniff(bytes) {
  for (const [sig, name] of SIGS) if (sig.every((b, i) => bytes[i] === b)) return name;
  const box = String.fromCharCode(...bytes.slice(4, 12));
  if (box.startsWith('ftyp')) return /heic|heix|mif1/.test(box) ? 'HEIC' : 'MP4/MOV';
  return 'غير معروف — يُرفض بالنظام الحقيقي';
}
function fmtTime(d) {
  let h = d.getHours(); const ap = h < 12 ? 'ص' : 'م'; h = h % 12 || 12;
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getDate()} ${['كانون الثاني','شباط','آذار','نيسان','أيار','حزيران','تموز','آب','أيلول','تشرين الأول','تشرين الثاني','كانون الأول'][d.getMonth()]} ${d.getFullYear()} · ${h}:${p(d.getMinutes())}:${p(d.getSeconds())} ${ap}`;
}
$('file').addEventListener('change', (e) => {
  const f = e.target.files[0];
  $('fileNote').textContent = f ? `الملف: ${f.name} — راح تنحسب بصمته الحقيقية.` : '';
});
$('intake').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = $('file').files[0];
  if (f) {
    const buf = await f.arrayBuffer();
    if (window.crypto && crypto.subtle) {
      const hash = await crypto.subtle.digest('SHA-256', buf);
      $('r-sha').textContent = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
    } else {
      $('r-sha').textContent = 'البصمة تحتاج اتصال آمن (https) — افتحي الموقع من GitHub Pages';
    }
    $('r-file').textContent = `${f.name} · ${Math.max(1, Math.round(f.size / 1024))} KB`;
    $('r-type').textContent = sniff(new Uint8Array(buf.slice(0, 16))) + ' (من الـmagic bytes)';
  }
  $('r-time').textContent = fmtTime(new Date());
  $('receipt').classList.remove('hidden'); $('placeholder').classList.add('hidden');
  $('st2').className = 'done'; $('st3').className = 'now';
});
