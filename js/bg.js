(function () {
  var c = document.getElementById('data-bg');
  if (!c) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x = c.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h, nodes = [], mouse = { x: 0, y: 0, on: false };
  var D = 140, R = 190;

  function size() {
    w = window.innerWidth; h = window.innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(30, Math.min(80, Math.round(w * h / 18000)));
    nodes = [];
    for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 });
    if (reduce) frame();
  }

  function frame() {
    var i, j, a, b, d;
    x.clearRect(0, 0, w, h);
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      if (mouse.on) {
        var dx = mouse.x - a.x, dy = mouse.y - a.y, md = Math.hypot(dx, dy);
        if (md < R && md > 1) { a.x += dx / md * (1 - md / R) * 0.9; a.y += dy / md * (1 - md / R) * 0.9; }
      }
      if (!reduce) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }
    }
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j]; d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < D) {
          x.strokeStyle = 'rgba(65,131,196,' + (0.2 * (1 - d / D)) + ')';
          x.lineWidth = 1; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
        }
      }
      var near = mouse.on ? Math.max(0, 1 - Math.hypot(mouse.x - a.x, mouse.y - a.y) / R) : 0;
      if (near > 0) {
        x.strokeStyle = 'rgba(139,233,160,' + (0.5 * near) + ')';
        x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(mouse.x, mouse.y); x.stroke();
      }
      x.fillStyle = 'rgba(139,233,160,' + (0.45 + 0.5 * near) + ')';
      x.beginPath(); x.arc(a.x, a.y, 1.6 + 1.8 * near, 0, 6.283); x.fill();
    }
  }

  function loop() { frame(); requestAnimationFrame(loop); }

  if (!reduce) {
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; });
    document.addEventListener('mouseleave', function () { mouse.on = false; });
  }
  var timer;
  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(size, 150); });
  size();
  if (!reduce) loop();
})();
