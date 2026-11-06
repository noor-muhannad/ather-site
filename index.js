// Dashboard: filter the cases table by evidence type
document.querySelectorAll('#filters button').forEach((b) => {
  b.addEventListener('click', () => {
    const f = b.dataset.f;
    document.querySelectorAll('#filters button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    document.querySelectorAll('#cases tr').forEach((tr) => {
      tr.classList.toggle('hidden', f !== 'all' && tr.dataset.k !== f);
    });
  });
});
