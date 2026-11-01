(function () {
  var NS = 'http://www.w3.org/2000/svg';

  function svgEl(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(n);
    return n;
  }

  function whenVisible(node, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); fn(); }
    }, { threshold: 0.3 });
    io.observe(node);
  }

  /* ---------- selector playground ---------- */
  function initDag(root) {
    var W = 130, H = 44;
    var nodes = [
      { id: 'raw.transactions', x: 0, y: 20, kind: 'source' },
      { id: 'raw.customers', x: 0, y: 130, kind: 'source' },
      { id: 'stg_transactions', x: 175, y: 20, kind: 'staging' },
      { id: 'stg_customers', x: 175, y: 130, kind: 'staging' },
      { id: 'dim_customers', x: 350, y: 130, kind: 'mart' },
      { id: 'fct_transactions', x: 525, y: 75, kind: 'mart' },
      { id: 'aml_alerts', x: 700, y: 75, kind: 'mart' }
    ];
    var edges = [
      ['raw.transactions', 'stg_transactions'], ['raw.customers', 'stg_customers'],
      ['stg_customers', 'dim_customers'], ['stg_transactions', 'fct_transactions'],
      ['dim_customers', 'fct_transactions'], ['fct_transactions', 'aml_alerts']
    ];
    var byId = {}, parents = {}, children = {};
    nodes.forEach(function (n) { byId[n.id] = n; parents[n.id] = []; children[n.id] = []; });
    edges.forEach(function (e) { parents[e[1]].push(e[0]); children[e[0]].push(e[1]); });

    var holder = root.querySelector('.dag-holder');
    var svg = svgEl('svg', { viewBox: '0 0 830 200', role: 'img', 'aria-label': 'dbt model graph for the selector playground' }, holder);
    var defs = svgEl('defs', {}, svg);
    [['dag-arrow', '#3a4654'], ['dag-arrow-on', '#8be9a0']].forEach(function (m) {
      var mk = svgEl('marker', { id: m[0], viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, defs);
      svgEl('path', { d: 'M0 0L10 5L0 10z', fill: m[1] }, mk);
    });

    var edgeEls = edges.map(function (e) {
      var a = byId[e[0]], b = byId[e[1]];
      var x1 = a.x + W, y1 = a.y + H / 2, x2 = b.x, y2 = b.y + H / 2, mx = (x1 + x2) / 2;
      var p = svgEl('path', { d: 'M' + x1 + ' ' + y1 + ' C' + mx + ' ' + y1 + ' ' + mx + ' ' + y2 + ' ' + (x2 - 2) + ' ' + y2, 'class': 'dag-edge', 'marker-end': 'url(#dag-arrow)' }, svg);
      p._from = e[0]; p._to = e[1];
      return p;
    });

    var nodeEls = {};
    nodes.forEach(function (n) {
      var g = svgEl('g', { 'class': 'dag-node ' + n.kind, tabindex: 0, role: 'button', 'aria-label': 'Select ' + n.id }, svg);
      svgEl('rect', { x: n.x, y: n.y, width: W, height: H, rx: 6 }, g);
      var t = svgEl('text', { x: n.x + W / 2, y: n.y + H / 2 + 4.5, 'text-anchor': 'middle', 'font-size': 12.5 }, g);
      t.textContent = n.id;
      g._id = n.id;
      nodeEls[n.id] = g;
    });

    var input = root.querySelector('.lab-input');
    var cmd = root.querySelector('.lab-cmd');
    var desc = root.querySelector('.lab-desc');
    var out = root.querySelector('.lab-models');
    var chips = Array.prototype.slice.call(root.querySelectorAll('.chip'));

    function walk(id, map, depth) {
      var seen = {}, frontier = [id], d = 0;
      while (frontier.length && d < depth) {
        var next = [];
        frontier.forEach(function (f) {
          map[f].forEach(function (c) { if (!seen[c]) { seen[c] = true; next.push(c); } });
        });
        frontier = next; d++;
      }
      return Object.keys(seen);
    }

    function select(expr) {
      var m = /^(?:(\d*)\+)?([\w.]+)(?:\+(\d*))?$/.exec(expr.trim());
      if (!m || !byId[m[2]]) return null;
      var set = {}; set[m[2]] = true;
      if (m[1] !== undefined) walk(m[2], parents, m[1] ? +m[1] : Infinity).forEach(function (i) { set[i] = true; });
      if (m[3] !== undefined) walk(m[2], children, m[3] ? +m[3] : Infinity).forEach(function (i) { set[i] = true; });
      return nodes.filter(function (n) { return set[n.id]; })
        .sort(function (a, b) { return a.x - b.x || a.y - b.y; });
    }

    function update(expr, description) {
      var chosen = select(expr), run = [];
      cmd.textContent = expr ? 'dbt run --select ' + expr : 'dbt run';
      if (!chosen) {
        Object.keys(nodeEls).forEach(function (k) { nodeEls[k].setAttribute('class', 'dag-node ' + byId[k].kind); nodeEls[k].querySelector('rect').style.transitionDelay = ''; });
        edgeEls.forEach(function (p) { p.setAttribute('class', 'dag-edge'); p.setAttribute('marker-end', 'url(#dag-arrow)'); });
        desc.textContent = expr ? 'No match. Try a model name like fct_transactions, with a + before or after it.' : 'Type a selector or pick one above.';
        out.innerHTML = '';
        return;
      }
      var order = {};
      chosen.forEach(function (n, i) { order[n.id] = i; });
      Object.keys(nodeEls).forEach(function (k) {
        var on = order[k] !== undefined;
        nodeEls[k].setAttribute('class', 'dag-node ' + byId[k].kind + (on ? ' on' : ' dim'));
        nodeEls[k].querySelector('rect').style.transitionDelay = on ? (order[k] * 0.22) + 's' : '';
      });
      edgeEls.forEach(function (p) {
        var on = order[p._from] !== undefined && order[p._to] !== undefined;
        p.setAttribute('class', 'dag-edge' + (on ? ' on' : ''));
        p.setAttribute('marker-end', on ? 'url(#dag-arrow-on)' : 'url(#dag-arrow)');
        p.style.transitionDelay = on ? (order[p._to] * 0.22) + 's' : '';
      });
      run = chosen.filter(function (n) { return n.kind !== 'source'; });
      if (description) desc.textContent = description;
      out.innerHTML = '';
      run.forEach(function (n, i) {
        var s = document.createElement('span');
        s.className = 'run-chip';
        s.style.animationDelay = (i * 0.22) + 's';
        s.textContent = (i + 1) + ' · ' + n.id;
        out.appendChild(s);
      });
      var count = document.createElement('span');
      count.className = 'run-count';
      count.textContent = run.length + (run.length === 1 ? ' model runs' : ' models run') + ', in this order';
      out.insertBefore(count, out.firstChild);
    }

    function pick(expr, description) {
      input.value = expr;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-sel') === expr ? 'true' : 'false'); });
      update(expr, description);
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () { pick(c.getAttribute('data-sel'), c.getAttribute('data-desc')); });
    });
    input.addEventListener('input', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      update(input.value, select(input.value) ? 'Custom selector: the highlighted nodes are what dbt would run.' : '');
    });
    Object.keys(nodeEls).forEach(function (k) {
      var g = nodeEls[k];
      var go = function () { pick(k, 'You clicked ' + k + '. Add a + before or after it to widen the selection.'); };
      g.addEventListener('click', go);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });

    var first = chips[0];
    cmd.textContent = 'dbt run';
    whenVisible(root, function () {
      pick(first.getAttribute('data-sel'), first.getAttribute('data-desc'));
    });
  }

  /* ---------- materialization lab ---------- */
  function initMat(root) {
    var MODES = {
      view: {
        code: "{{ config(materialized='view') }}\n\n-- what dbt runs\ncreate or replace view aml.stg_transactions as (\n    select * from raw.transactions\n);",
        empty: 'No data is stored. Only the query is saved.',
        stats: ['none', 'slower: SQL runs on every read', 'always up to date'],
        cap: 'Cheap to build and always fresh. Fine for light cleanup, but heavy queries get slow when every dashboard re-runs them.'
      },
      table: {
        code: "{{ config(materialized='table') }}\n\n-- what dbt runs\ncreate or replace table aml.dim_customers as (\n    select * from aml.stg_customers\n);",
        stats: ['full rewrite every run', 'fast', 'as of the last run'],
        cap: 'Every run drops and rebuilds all rows. Simple and fast to query, but the build gets slower as data grows.'
      },
      incremental: {
        code: "{{ config(materialized='incremental', unique_key='txn_id') }}\n\n-- what dbt runs on the 2nd run\nmerge into aml.fct_transactions t\nusing (\n    select * from aml.stg_transactions\n    where txn_ts > (select max(txn_ts) from aml.fct_transactions)\n) s on t.txn_id = s.txn_id\nwhen matched then update set *\nwhen not matched then insert *;",
        stats: ['only the new rows', 'fast', 'as of the last run'],
        cap: 'After the first run dbt only processes new or changed rows. The right choice for large, append-heavy tables like transactions.'
      },
      ephemeral: {
        code: "{{ config(materialized='ephemeral') }}\n\n-- nothing is created. dbt inlines it:\nwith stg_transactions as (\n    select * from raw.transactions\n)\nselect * from stg_transactions;",
        empty: 'Nothing exists in the warehouse. It is inlined as a CTE.',
        stats: ['none', 'part of the downstream query', 'always up to date'],
        cap: 'Never built on its own. Good for small helper logic, but it cannot be queried directly and is hard to debug.'
      }
    };

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var code = root.querySelector('.lab-code code');
    var rowsBox = root.querySelector('.lab-rows');
    var emptyMsg = root.querySelector('.lab-empty');
    var cap = root.querySelector('.lab-caption');
    var stats = root.querySelectorAll('.lab-stats dd');
    var replay = root.querySelector('.lab-replay');
    var current = 'view';

    for (var i = 0; i < 11; i++) {
      var r = document.createElement('span');
      r.className = 'r ' + (i < 8 ? 'old' : 'new');
      r.style.setProperty('--i', i);
      rowsBox.appendChild(r);
    }

    function play() {
      root.classList.remove('play');
      void root.offsetWidth;
      root.classList.add('play');
    }

    function show(mode, animate) {
      current = mode;
      var d = MODES[mode];
      root.className = root.className.replace(/\bmode-\w+/g, '').trim() + ' mode-' + mode;
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-mode') === mode;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      code.innerHTML = window.demoHighlight ? window.demoHighlight(d.code, 'sql') : d.code;
      emptyMsg.textContent = d.empty || '';
      cap.textContent = d.cap;
      Array.prototype.forEach.call(stats, function (dd, i) { dd.textContent = d.stats[i]; });
      if (animate !== false) play();
    }

    tabs.forEach(function (t, idx) {
      t.addEventListener('click', function () { show(t.getAttribute('data-mode')); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(idx + d + tabs.length) % tabs.length];
        n.focus();
        show(n.getAttribute('data-mode'));
      });
    });
    replay.addEventListener('click', play);

    show('table', false);
    whenVisible(root, play);
  }

  var dag = document.getElementById('dag-lab');
  if (dag) initDag(dag);
  var mat = document.getElementById('mat-lab');
  if (mat) initMat(mat);
})();
