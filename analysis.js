// Analysis: modality tabs (also via #audio / #video), viewer layers, generated waveform and key-frames
const panes = { image: 'p-image', audio: 'p-audio', video: 'p-video' };
const cases = { image: 'ATH-2026-0418', audio: 'ATH-2026-0417', video: 'ATH-2026-0415' };
function show(t) {
  if (!panes[t]) t = 'image';
  document.querySelectorAll('#tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.t === t)));
  Object.entries(panes).forEach(([k, id]) => {
    const el = document.getElementById(id);
    el.classList.toggle('hidden', k !== t);
    el.style.display = k === t ? 'flex' : '';
  });
  document.getElementById('crumbCase').textContent = cases[t];
  if (location.hash.slice(1) !== t) history.replaceState(null, '', t === 'image' ? location.pathname : '#' + t);
}
document.querySelectorAll('#tabs button').forEach((b) => b.addEventListener('click', () => show(b.dataset.t)));
window.addEventListener('hashchange', () => show(location.hash.slice(1)));

document.querySelectorAll('#layers button').forEach((b) => b.addEventListener('click', () => {
  const l = b.dataset.l;
  document.querySelectorAll('#layers button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  document.getElementById('viewer').classList.toggle('ela', l === 'ela');
  document.querySelectorAll('#viewer [data-layer]').forEach((o) => o.classList.toggle('hidden', o.dataset.layer !== l));
}));

const wave = document.getElementById('wave');
for (let i = 0; i < 84; i++) {
  const h = Math.min(120, 20 + Math.round(Math.abs(Math.sin(i * 0.7) * 60 + Math.sin(i * 0.23) * 30)));
  const bar = document.createElement('i');
  bar.style.height = h + 'px';
  if (i >= 28 && i <= 38) bar.className = 'hot';
  wave.appendChild(bar);
}

const times = ['00:02', '00:08', '00:13', '00:18', '00:21', '00:26', '00:31', '00:40'];
const bad = [false, false, false, false, true, true, true, false];
const frames = document.getElementById('frames');
times.forEach((t, i) => {
  const d = document.createElement('div');
  if (bad[i]) d.className = 'bad';
  d.innerHTML = `<div class="thumb"></div><span class="mono">${t}</span><span class="tag">${bad[i] ? 'غير متطابق' : 'متطابق'}</span>`;
  frames.appendChild(d);
});

show(location.hash.slice(1));
