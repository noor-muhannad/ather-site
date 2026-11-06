// Report: reviewer approves & seals, or returns the case for re-analysis
const $ = (id) => document.getElementById(id);
function nowStr() {
  const d = new Date(); let h = d.getHours(); const ap = h < 12 ? 'ص' : 'م'; h = h % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${ap}`;
}
$('btnSeal').addEventListener('click', () => {
  const t = nowStr();
  $('stReview').className = 'done'; $('stSeal').className = 'done';
  $('actions').classList.add('hidden'); $('returnedNote').classList.add('hidden');
  $('sealedChip').textContent = `✓ مختوم ${t} — لا يُعدَّل بعد الآن`; $('sealedChip').classList.remove('hidden');
  $('revSig').textContent = `موقّع رقميًا · ${t}`; $('revSig').style.color = '#1E5E22';
  $('seal').classList.remove('hidden');
});
$('btnReturn').addEventListener('click', () => $('returnedNote').classList.remove('hidden'));
