// K-means demo on Canvas 2D. No libraries.
const canvas = document.getElementById('kmeans');
const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
if (ctx) {
  const W = canvas.width, H = canvas.height;
  const COLORS = ['#4FD6A8', '#F0B46A', '#FF7F6B', '#6BB6FF', '#C9D65A'];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);
  const kSel = $('k'), runBtn = $('run'), stateEl = $('state');
  let points, cents, iter, done, running = false, visible = true, lastTick = 0;

  const rand = (a, b) => a + Math.random() * (b - a);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 1.6;

  // Seed with three loose blobs so the first step already shows structure.
  function reset() {
    points = [];
    const hubs = [[.25, .35], [.7, .3], [.5, .75]];
    for (const [hx, hy] of hubs) addBlob(hx * W, hy * H, 22);
    cents = []; iter = 0; done = false; setRunning(false); initCentroids(); draw(); report();
  }
  function addBlob(cx, cy, n) {
    for (let i = 0; i < n; i++) points.push({ x: clamp(cx + gauss() * 55, 8, W - 8), y: clamp(cy + gauss() * 55, 8, H - 8), c: -1 });
  }
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Pick k distinct points as starting centroids.
  function initCentroids() {
    const k = +kSel.value, pool = [...points], out = [];
    while (out.length < k && pool.length) out.push({ ...pool.splice((Math.random() * pool.length) | 0, 1)[0] });
    cents = out; iter = 0; done = false; points.forEach(p => (p.c = -1));
  }

  function step() {
    if (done) return;
    let changed = false;
    for (const p of points) {                       // assignment step
      let best = 0, bd = Infinity;
      cents.forEach((c, i) => { const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2; if (d < bd) { bd = d; best = i; } });
      if (p.c !== best) { p.c = best; changed = true; }
    }
    cents.forEach((c, i) => {                       // update step: centroid = mean of members
      const m = points.filter(p => p.c === i);
      if (m.length) { c.x = m.reduce((s, p) => s + p.x, 0) / m.length; c.y = m.reduce((s, p) => s + p.y, 0) / m.length; }
    });
    iter++; done = !changed;
    if (done) setRunning(false);
    draw(); report();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of points) { ctx.fillStyle = p.c < 0 ? '#8FA3AD' : COLORS[p.c]; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 6.2832); ctx.fill(); }
    cents.forEach((c, i) => {
      ctx.lineWidth = 3; ctx.strokeStyle = '#0D1210'; ctx.fillStyle = COLORS[i];
      ctx.beginPath(); ctx.rect(c.x - 8, c.y - 8, 16, 16); ctx.fill(); ctx.stroke();
    });
  }
  function report() {
    stateEl.textContent = `${points.length} points, ${cents.length} clusters, iteration ${iter}` + (done ? ', converged' : iter ? '' : ', not started');
  }

  function setRunning(on) {
    running = on && !calm;
    runBtn.setAttribute('aria-pressed', running);
    runBtn.textContent = running ? 'Pause' : 'Run';
    if (running) requestAnimationFrame(loop);
  }
  function loop(t) {
    if (!running) return;
    if (!visible) return void requestAnimationFrame(loop);   // idle while off-screen; no drawing
    if (t - lastTick > 450) { lastTick = t; step(); }
    requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', e => {
    const r = canvas.getBoundingClientRect();
    points.push({ x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height, c: -1 });
    done = false; draw(); report();
  });
  $('step').addEventListener('click', step);
  $('more').addEventListener('click', () => { addBlob(rand(60, W - 60), rand(60, H - 60), 20); done = false; draw(); report(); });
  $('reset').addEventListener('click', reset);
  kSel.addEventListener('change', () => { initCentroids(); setRunning(false); draw(); report(); });
  runBtn.addEventListener('click', () => { if (calm) { while (!done && iter < 50) step(); } else { if (done) initCentroids(); setRunning(!running); } });
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(canvas);
  reset();
}
