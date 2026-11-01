(function () {
  var list = document.querySelector('.toc-list');
  var heads = Array.prototype.slice.call(document.querySelectorAll('.entry h2.section-label'));
  if (!list || !heads.length) return;

  var bar = document.querySelector('.toc-progress span');
  var root = document.querySelector('.toc');
  var pct = document.querySelector('.toc-pct');
  var links = [];

  heads.forEach(function (h, i) {
    var text = h.textContent.replace(/^\s*\/\/\s*/, '');
    var m = /^(\d+)\s*·\s*(.*)$/.exec(text);
    var num = m ? m[1] : String(i + 1);
    var title = m ? m[2] : text;
    h.id = h.id || 'sec-' + num;

    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.innerHTML = '<span class="toc-n"></span><span class="toc-t"></span>';
    a.firstChild.textContent = num;
    a.lastChild.textContent = title;
    li.appendChild(a);
    list.appendChild(li);
    links.push(a);
  });

  var current = -1, ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var frac = max > 0 ? Math.min(1, y / max) : 0;
    if (bar) bar.style.width = frac * 100 + '%';
    if (pct) pct.textContent = Math.round(frac * 100) + '%';

    var idx = -1;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= 140) idx = i;
    }
    if (max > 0 && y >= max - 4) idx = heads.length - 1;
    if (idx === current) return;
    current = idx;
    var tgt = idx >= 0 ? links[idx].parentNode : null;
    list.style.setProperty('--fill', tgt ? (tgt.offsetTop + tgt.offsetHeight / 2 - 8) + 'px' : '0px');
    links.forEach(function (a, i) {
      a.classList.toggle('active', i === idx);
      if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    if (idx >= 0 && list.scrollWidth > list.clientWidth) {
      var a = links[idx];
      list.scrollLeft = a.parentNode.offsetLeft - list.clientWidth / 2 + a.parentNode.offsetWidth / 2;
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
