(function () {
  var root = document.getElementById('sql-game');
  if (!root || typeof initSqlJs !== 'function') return;
  var base = new URL('vendor/', document.currentScript.src).href;
  var STORE = 'sqlDetective.v1';

  /* ---------- seeded case data ---------- */
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  var rand = rng(20250301);
  function pick(a) { return a[Math.floor(rand() * a.length)]; }
  function between(a, b) { return a + Math.floor(rand() * (b - a + 1)); }
  function day(n) { return new Date(Date.UTC(2025, 0, 1 + n)).toISOString().slice(0, 10); }
  function dayOf(s) { return Math.round((Date.parse(s) - Date.UTC(2025, 0, 1)) / 864e5); }

  var CUSTOMERS = [
    [1, 'Ana Torres', 'Spain', 'low', 'Teacher'], [2, 'Ben Carter', 'United States', 'low', 'Engineer'],
    [3, 'Chloe Martin', 'France', 'low', 'Nurse'], [4, 'Daniel Okafor', 'Nigeria', 'medium', 'Trader'],
    [5, 'Elif Demir', 'Turkey', 'low', 'Designer'], [6, 'Farid Rahimi', 'United Arab Emirates', 'medium', 'Consultant'],
    [7, 'Greta Novak', 'Czechia', 'low', 'Accountant'], [8, 'Hiro Tanaka', 'Japan', 'low', 'Chef'],
    [9, 'Ines Duarte', 'Portugal', 'low', 'Architect'], [10, 'Jonas Weber', 'Germany', 'low', 'Mechanic'],
    [11, 'Kemal Aydin', 'Turkey', 'medium', 'Importer'], [12, 'Lena Fischer', 'Germany', 'low', 'Lawyer'],
    [13, 'Viktor Hale', 'United Kingdom', 'high', 'Import/Export'], [14, 'Maria Santos', 'Brazil', 'low', 'Doctor'],
    [15, 'Nadia Haddad', 'Lebanon', 'medium', 'Retailer'], [16, 'Omar Khalid', 'Egypt', 'low', 'Engineer'],
    [17, 'Priya Nair', 'India', 'low', 'Analyst'], [18, 'Quinn Murphy', 'Ireland', 'low', 'Developer'],
    [19, 'Rosa Bianchi', 'Italy', 'low', 'Florist'], [20, 'Sven Lindqvist', 'Sweden', 'low', 'Pilot'],
    [21, 'Tara Brooks', 'United States', 'medium', 'Realtor'], [22, 'Umut Kaya', 'Turkey', 'low', 'Student'],
    [23, 'Vera Ivanova', 'Cyprus', 'high', 'Director'], [24, 'Will Parker', 'United Kingdom', 'low', 'Plumber'],
    [25, 'Zoe Adams', 'Canada', 'low', 'Writer']
  ];
  var NO_ACCOUNT = { 22: 1, 24: 1 };
  var EXTRA_SAVINGS = { 2: 1, 5: 1, 13: 1, 21: 1 };
  var HIGH_RISK = [['Panama', 'Offshore secrecy'], ['Cyprus', 'Shell company hub'], ['Cayman Islands', 'Offshore secrecy'],
    ['Myanmar', 'FATF blacklist'], ['Iran', 'Sanctions'], ['North Korea', 'Sanctions']];
  var SAFE = ['United States', 'Germany', 'France', 'Spain', 'Turkey', 'Japan', 'United Kingdom', 'Canada'];

  function buildDb(SQL) {
    var db = new SQL.Database();
    db.run('CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, country TEXT, risk_level TEXT, occupation TEXT, opened_on TEXT);' +
      'CREATE TABLE accounts (id INTEGER PRIMARY KEY, customer_id INTEGER, type TEXT, opened_on TEXT, balance INTEGER);' +
      'CREATE TABLE transactions (id INTEGER PRIMARY KEY, account_id INTEGER, txn_date TEXT, type TEXT, amount INTEGER, channel TEXT, counterparty_country TEXT);' +
      'CREATE TABLE high_risk_countries (country TEXT, reason TEXT);');
    var ic = db.prepare('INSERT INTO customers VALUES (?,?,?,?,?,?)');
    CUSTOMERS.forEach(function (c) { ic.run(c.concat([day(between(-900, -30))])); });
    ic.free();
    var ia = db.prepare('INSERT INTO accounts VALUES (?,?,?,?,?)'), accounts = [];
    CUSTOMERS.forEach(function (c) {
      if (NO_ACCOUNT[c[0]]) return;
      accounts.push([1000 + c[0], c[0], 'checking']);
      if (EXTRA_SAVINGS[c[0]]) accounts.push([2000 + c[0], c[0], 'savings']);
    });
    accounts.forEach(function (a) { ia.run([a[0], a[1], a[2], day(between(-800, -20)), between(800, 42000)]); });
    ia.free();
    var ih = db.prepare('INSERT INTO high_risk_countries VALUES (?,?)');
    HIGH_RISK.forEach(function (h) { ih.run(h); });
    ih.free();

    var tx = [];
    accounts.forEach(function (a) {
      for (var i = 0, n = between(4, 9); i < n; i++) {
        var r = rand(), type = r < 0.5 ? 'deposit' : r < 0.8 ? 'withdrawal' : 'transfer_out', amount, channel, cp = null;
        if (type === 'deposit') { amount = between(200, 4500); channel = pick(['branch', 'online', 'atm', 'online']); }
        else if (type === 'withdrawal') { amount = between(20, 1500); channel = pick(['atm', 'atm', 'online', 'branch']); }
        else { amount = between(100, 3000); channel = pick(['wire', 'online']); cp = pick(SAFE); }
        tx.push([a[0], day(between(0, 180)), type, amount, channel, cp]);
      }
    });
    // Viktor Hale: structuring below the 10,000 reporting threshold, then wires out
    [[3, 9300], [5, 9650], [7, 9100], [10, 9800], [14, 9450], [17, 9900], [21, 9200]].forEach(function (d) {
      tx.push([1013, day(dayOf('2025-03-01') + d[0] - 1), 'deposit', d[1], 'branch', null]);
    });
    tx.push([1013, '2025-03-24', 'transfer_out', 28000, 'wire', 'Panama']);
    tx.push([1013, '2025-03-26', 'transfer_out', 31500, 'wire', 'Cyprus']);
    tx.push([1013, '2025-03-28', 'transfer_out', 29800, 'wire', 'Panama']);
    // Decoys: big but single transactions, near-threshold but only twice
    tx.push([1023, '2025-02-11', 'deposit', 48000, 'wire', null]);
    tx.push([1023, '2025-02-12', 'deposit', 52000, 'wire', null]);
    tx.push([1023, '2025-02-20', 'transfer_out', 95000, 'wire', 'Panama']);
    tx.push([1021, '2025-04-02', 'deposit', 85000, 'wire', null]);
    tx.push([1021, '2025-04-08', 'deposit', 9400, 'online', null]);
    tx.push([1021, '2025-04-15', 'deposit', 9600, 'online', null]);
    tx.push([1011, '2025-05-06', 'transfer_out', 4200, 'wire', 'Myanmar']);
    tx.push([1015, '2025-05-19', 'transfer_out', 6800, 'wire', 'Iran']);

    tx.sort(function (a, b) { return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0; });
    var it = db.prepare('INSERT INTO transactions VALUES (?,?,?,?,?,?,?)');
    tx.forEach(function (t, i) { it.run([i + 1].concat(t)); });
    it.free();
    return db;
  }

  /* ---------- cases ---------- */
  var HQ = 'Northbridge Bank, Financial Intelligence Unit';
  var LEVELS = [
    { t: 'Meet the customers', topic: 'SELECT … FROM',
      story: 'An alert landed on your desk at ' + HQ + ': someone may be moving dirty money in small pieces. Before you chase anyone, get to know who banks with you.',
      lesson: '<code>SELECT</code> picks the columns, <code>FROM</code> picks the table. Use <code>*</code> for every column.<pre>SELECT name, occupation\nFROM customers;</pre>',
      task: 'List the <b>name</b> and <b>country</b> of every customer.',
      sol: 'SELECT name, country FROM customers',
      hints: ['You need two columns, separated by a comma.', 'SELECT name, country FROM customers'] },
    { t: 'High-risk profiles', topic: 'WHERE',
      story: 'Compliance already scored every customer. Start with the ones flagged as the riskiest.',
      lesson: '<code>WHERE</code> keeps only the rows that match a condition. Text goes in single quotes.<pre>SELECT * FROM customers\nWHERE country = \'Spain\';</pre>',
      task: 'Return <b>all columns</b> of customers whose <code>risk_level</code> is <code>\'high\'</code>.',
      sol: "SELECT * FROM customers WHERE risk_level = 'high'",
      hints: ['Filter on the risk_level column.', "SELECT * FROM customers WHERE risk_level = 'high'"] },
    { t: 'Branch cash, big amounts', topic: 'AND / comparisons',
      story: 'Large amounts handed over the counter get extra attention. Look at the transactions table.',
      lesson: 'Combine conditions with <code>AND</code> (both true) or <code>OR</code> (either true). Compare with <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>=</code>.<pre>SELECT * FROM transactions\nWHERE amount &gt; 500 AND type = \'withdrawal\';</pre>',
      task: 'Return <b>all columns</b> of transactions with an <code>amount</code> above <b>9000</b> made at a <code>channel</code> of <code>\'branch\'</code>.',
      sol: "SELECT * FROM transactions WHERE amount > 9000 AND channel = 'branch'",
      hints: ['Two conditions joined by AND.', "WHERE amount > 9000 AND channel = 'branch'"] },
    { t: 'Jurisdictions of interest', topic: 'IN',
      story: 'A tip mentions customers connected to Turkey and Cyprus. List them.',
      lesson: '<code>IN</code> is a shortcut for several <code>OR</code> conditions. (<code>LIKE \'V%\'</code> matches text that starts with V.)<pre>SELECT * FROM customers\nWHERE country IN (\'Spain\', \'France\');</pre>',
      task: 'Return the <b>name</b> and <b>country</b> of customers whose country is <code>\'Turkey\'</code> or <code>\'Cyprus\'</code>. Use <code>IN</code>.',
      sol: "SELECT name, country FROM customers WHERE country IN ('Turkey', 'Cyprus')",
      hints: ['country IN (…, …)', "WHERE country IN ('Turkey', 'Cyprus')"] },
    { t: 'The biggest movers', topic: 'ORDER BY / LIMIT',
      story: 'Your manager wants the five largest transactions on the desk by lunch.',
      lesson: '<code>ORDER BY</code> sorts (<code>DESC</code> = biggest first). <code>LIMIT</code> keeps the first N rows.<pre>SELECT name FROM customers\nORDER BY name ASC\nLIMIT 3;</pre>',
      task: 'Return <b>id</b>, <b>amount</b> and <b>type</b> of the <b>5 largest</b> transactions, biggest first.',
      ordered: true, sol: 'SELECT id, amount, type FROM transactions ORDER BY amount DESC LIMIT 5',
      hints: ['Sort by amount, descending.', 'ORDER BY amount DESC LIMIT 5'] },
    { t: 'Just under the line', topic: 'COUNT / BETWEEN',
      story: 'Deposits of 10,000 or more must be reported. Criminals avoid that by depositing just below it. This is called structuring. How common is it here?',
      lesson: '<code>COUNT(*)</code> counts rows. <code>BETWEEN a AND b</code> includes both ends.<pre>SELECT COUNT(*) FROM transactions\nWHERE amount BETWEEN 100 AND 200;</pre>',
      task: 'Count the <b>deposits</b> (<code>type = \'deposit\'</code>) with an amount <b>between 9000 and 9999</b>.',
      sol: "SELECT COUNT(*) FROM transactions WHERE type = 'deposit' AND amount BETWEEN 9000 AND 9999",
      hints: ['COUNT(*) plus two conditions.', "WHERE type = 'deposit' AND amount BETWEEN 9000 AND 9999"] },
    { t: 'Money out the door', topic: 'SUM / AVG',
      story: 'Now follow the money that leaves the bank. Size up all outgoing transfers.',
      lesson: 'Aggregates turn many rows into one: <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>, <code>COUNT</code>.<pre>SELECT SUM(balance), AVG(balance)\nFROM accounts;</pre>',
      task: 'Return the <b>total</b> and the <b>average</b> <code>amount</code> of all <code>\'transfer_out\'</code> transactions (two columns).',
      sol: "SELECT SUM(amount), AVG(amount) FROM transactions WHERE type = 'transfer_out'",
      hints: ['Two aggregate functions in one SELECT.', "SELECT SUM(amount), AVG(amount) … WHERE type = 'transfer_out'"] },
    { t: 'Patterns by type', topic: 'GROUP BY',
      story: 'To spot what is unusual you must know what is normal. Compare the transaction types.',
      lesson: '<code>GROUP BY</code> makes one row per group, so aggregates are calculated per group.<pre>SELECT country, COUNT(*)\nFROM customers\nGROUP BY country;</pre>',
      task: 'For each transaction <code>type</code>, return the type and the <b>number of transactions</b>.',
      sol: 'SELECT type, COUNT(*) FROM transactions GROUP BY type',
      hints: ['Group by the type column.', 'SELECT type, COUNT(*) FROM transactions GROUP BY type'] },
    { t: 'The structuring suspect', topic: 'HAVING',
      story: 'One near-threshold deposit means nothing. A pattern means a lot. Find accounts that did it again and again.',
      lesson: '<code>WHERE</code> filters rows <i>before</i> grouping. <code>HAVING</code> filters groups <i>after</i> counting.<pre>SELECT account_id, COUNT(*)\nFROM transactions\nGROUP BY account_id\nHAVING COUNT(*) &gt; 8;</pre>',
      task: 'Return the <b>account_id</b> and the <b>count</b> of deposits between 9000 and 9999, only for accounts with <b>at least 5</b> such deposits.',
      sol: "SELECT account_id, COUNT(*) FROM transactions WHERE type = 'deposit' AND amount BETWEEN 9000 AND 9999 GROUP BY account_id HAVING COUNT(*) >= 5",
      hints: ['WHERE filters deposits first, then GROUP BY account_id.', 'Finish with HAVING COUNT(*) >= 5'] },
    { t: 'Wire activity in March', topic: 'DISTINCT / dates',
      story: 'The structuring seems to cluster in time. Which accounts sent wires during March 2025?',
      lesson: '<code>DISTINCT</code> removes duplicate rows. Dates are text in <code>YYYY-MM-DD</code> form, so <code>BETWEEN</code> works on them.<pre>SELECT DISTINCT country FROM customers;</pre>',
      task: 'Return each <b>account_id</b> once that has a transaction with <code>channel = \'wire\'</code> between <b>2025-03-01</b> and <b>2025-03-31</b>.',
      sol: "SELECT DISTINCT account_id FROM transactions WHERE channel = 'wire' AND txn_date BETWEEN '2025-03-01' AND '2025-03-31'",
      hints: ['SELECT DISTINCT account_id …', "txn_date BETWEEN '2025-03-01' AND '2025-03-31'"] },
    { t: 'Who owns which account?', topic: 'JOIN',
      story: 'Account numbers do not mean much to a judge. You need names. The accounts table points to customers through customer_id.',
      lesson: '<code>JOIN … ON</code> connects two tables through matching columns. Aliases (<code>c</code>, <code>a</code>) keep it short.<pre>SELECT c.name, a.id\nFROM customers c\nJOIN accounts a ON a.customer_id = c.id;</pre>',
      task: 'Return the owner\'s <b>name</b>, the <b>account id</b> and the account <b>type</b> for every account.',
      sol: 'SELECT c.name, a.id, a.type FROM customers c JOIN accounts a ON a.customer_id = c.id',
      hints: ['Join customers to accounts on a.customer_id = c.id.', 'SELECT c.name, a.id, a.type FROM customers c JOIN accounts a ON a.customer_id = c.id'] },
    { t: 'Following the wires', topic: 'Multiple JOINs',
      story: 'A list of high-risk countries lives in its own table. Match every transfer against it, and find out whose money it is.',
      lesson: 'You can chain JOINs: transaction → account → customer. Join any table that has a matching column.<pre>FROM transactions t\nJOIN accounts a ON a.id = t.account_id\nJOIN customers c ON c.id = a.customer_id</pre>',
      task: 'Return the customer <b>name</b>, the transaction <b>amount</b> and its <b>counterparty_country</b> for every transaction sent to a country listed in <code>high_risk_countries</code>.',
      sol: 'SELECT c.name, t.amount, t.counterparty_country FROM transactions t JOIN accounts a ON a.id = t.account_id JOIN customers c ON c.id = a.customer_id JOIN high_risk_countries h ON h.country = t.counterparty_country',
      hints: ['Four tables: transactions, accounts, customers, high_risk_countries.', 'The last join: JOIN high_risk_countries h ON h.country = t.counterparty_country'] },
    { t: 'The total exposure', topic: 'JOIN + GROUP BY',
      story: 'Several customers sent money to risky countries. Rank them by how much they sent in total.',
      lesson: 'Combine everything: JOIN to get names, <code>GROUP BY</code> to total per customer, <code>ORDER BY</code> to rank.<pre>SELECT c.name, SUM(t.amount) AS total\n…\nGROUP BY c.name\nORDER BY total DESC;</pre>',
      task: 'Return each customer\'s <b>name</b> and the <b>total amount</b> they sent to high-risk countries, <b>largest total first</b>.',
      ordered: true,
      sol: 'SELECT c.name, SUM(t.amount) AS total FROM transactions t JOIN accounts a ON a.id = t.account_id JOIN customers c ON c.id = a.customer_id JOIN high_risk_countries h ON h.country = t.counterparty_country GROUP BY c.name ORDER BY total DESC',
      hints: ['Reuse the previous four-table join, then GROUP BY c.name.', 'SUM(t.amount) … ORDER BY SUM(t.amount) DESC'] },
    { t: 'Customers with no account', topic: 'LEFT JOIN',
      story: 'Know-your-customer files should lead to accounts. A customer with no account is a loose end worth checking.',
      lesson: '<code>LEFT JOIN</code> keeps every row from the left table, even without a match. The missing side is <code>NULL</code>, test it with <code>IS NULL</code>.<pre>SELECT c.name\nFROM customers c\nLEFT JOIN accounts a ON a.customer_id = c.id\nWHERE a.id IS NULL;</pre>',
      task: 'Return the <b>name</b> of customers who have <b>no account</b>.',
      sol: 'SELECT c.name FROM customers c LEFT JOIN accounts a ON a.customer_id = c.id WHERE a.id IS NULL',
      hints: ['LEFT JOIN accounts, then look for rows with no match.', 'WHERE a.id IS NULL'] },
    { t: 'Above the average', topic: 'Subquery',
      story: 'What is "large" here? Let the data answer: compare each transaction to the average one.',
      lesson: 'A subquery is a query inside parentheses. It runs first and hands its result to the outer query.<pre>SELECT * FROM accounts\nWHERE balance &gt;\n  (SELECT AVG(balance) FROM accounts);</pre>',
      task: 'Return the <b>id</b> and <b>amount</b> of every transaction whose amount is <b>greater than the average</b> transaction amount.',
      sol: 'SELECT id, amount FROM transactions WHERE amount > (SELECT AVG(amount) FROM transactions)',
      hints: ['The average comes from a subquery: (SELECT AVG(amount) FROM transactions).', 'WHERE amount > (SELECT AVG(amount) FROM transactions)'] },
    { t: 'Case closed: name the suspect', topic: 'Subqueries + JOIN',
      story: 'Time to name names. Your suspect owns an account that made <b>5 or more</b> deposits between 9000 and 9999 <b>and</b> also sent money to a high-risk country. Big, single transactions do not count.',
      lesson: '<code>IN (subquery)</code> checks whether a value appears in the list the subquery returns. You can nest them and use several in one <code>WHERE</code>.<pre>WHERE a.id IN (SELECT account_id FROM …)\n  AND a.id IN (SELECT account_id FROM …)</pre>',
      task: 'Return the <b>name</b> of the customer who matches <b>both</b> patterns.',
      sol: "SELECT c.name FROM customers c JOIN accounts a ON a.customer_id = c.id WHERE a.id IN (SELECT account_id FROM transactions WHERE type = 'deposit' AND amount BETWEEN 9000 AND 9999 GROUP BY account_id HAVING COUNT(*) >= 5) AND a.id IN (SELECT account_id FROM transactions WHERE counterparty_country IN (SELECT country FROM high_risk_countries))",
      hints: ['Two IN (subquery) conditions on a.id: the first is your HAVING query from case 9.', 'Second subquery: SELECT account_id FROM transactions WHERE counterparty_country IN (SELECT country FROM high_risk_countries)'] }
  ];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function norm(v) { return v === null ? 'NULL' : typeof v === 'number' ? String(Math.round(v * 100) / 100) : String(v); }
  function shape(res) { return res.length ? { cols: res[0].columns.length, rows: res[0].values.map(function (r) { return r.map(norm); }) } : { cols: 0, rows: [] }; }
  function key(r) { return r.slice().sort().join('\u0001'); }
  function compare(got, want, ordered) {
    if (got.cols !== want.cols) return { ok: false, msg: 'Your query returns ' + got.cols + ' column' + (got.cols === 1 ? '' : 's') + ', the case file needs ' + want.cols + '.' };
    if (got.rows.length !== want.rows.length) return { ok: false, msg: 'Your query returns ' + got.rows.length + ' row' + (got.rows.length === 1 ? '' : 's') + ', but the evidence points to ' + want.rows.length + '.' };
    var a = got.rows.map(key), b = want.rows.map(key);
    if (ordered) {
      var sameSet = a.slice().sort().join('|') === b.slice().sort().join('|');
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return { ok: false, msg: sameSet ? 'Right rows, wrong order. Check your ORDER BY.' : 'The rows are not quite right.' };
      return { ok: true };
    }
    a.sort(); b.sort();
    for (var j = 0; j < a.length; j++) if (a[j] !== b[j]) return { ok: false, msg: 'Right number of rows, but some values differ. Re-check your conditions.' };
    return { ok: true };
  }
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  var state = load();
  state.done = state.done || {};
  var db, cur = 0, hintsUsed = 0, fails = 0, solShown = false;

  function unlocked() { var n = 0; while (state.done[n] !== undefined) n++; return Math.min(n, LEVELS.length - 1); }
  function total() { return Object.keys(state.done).reduce(function (s, k) { return s + state.done[k]; }, 0); }
  function doneCount() { return Object.keys(state.done).length; }

  /* ---------- UI ---------- */
  function el(id) { return root.querySelector(id); }
  function hl(text) { return typeof window.demoHighlight === 'function' ? window.demoHighlight(text, 'sql') : esc(text); }

  function render() {
    var L = LEVELS[cur], open = unlocked();
    var dots = LEVELS.map(function (_, i) {
      var cls = 'sg-dot' + (state.done[i] !== undefined ? ' done' : '') + (i === cur ? ' active' : '');
      return '<button class="' + cls + '" data-go="' + i + '"' + (i > open ? ' disabled' : '') + ' aria-label="Case ' + (i + 1) + '">' + (i + 1) + '</button>';
    }).join('');
    var tables = ['customers', 'accounts', 'transactions', 'high_risk_countries'].map(function (t) {
      var cols = db.exec('PRAGMA table_info(' + t + ')')[0].values.map(function (r) { return '<span>' + esc(r[1]) + '</span>'; }).join('');
      return '<div class="sg-table"><button class="sg-peek" data-peek="' + t + '" title="Preview rows">' + t + '</button><div class="sg-cols">' + cols + '</div></div>';
    }).join('');
    root.innerHTML =
      '<div class="sg-top"><div class="sg-prog"><div class="sg-bar"><i style="width:' + (doneCount() / LEVELS.length * 100) + '%"></i></div>' +
      '<span>' + doneCount() + ' / ' + LEVELS.length + ' cases solved</span></div><div class="sg-score">' + total() + ' pts</div></div>' +
      '<div class="sg-dots">' + dots + '</div>' +
      '<section class="sg-card"><div class="sg-case">CASE ' + String(cur + 1).padStart(2, '0') + ' · ' + esc(L.topic) + '</div><h2>' + esc(L.t) + '</h2>' +
      '<p class="sg-story">' + L.story + '</p>' +
      '<details class="sg-notes" open><summary>Field notes</summary><div>' + L.lesson + '</div></details>' +
      '<div class="sg-task"><span>Your mission</span><p>' + L.task + '</p></div></section>' +
      '<div class="sg-schema"><span class="sg-label">Case database · click a table to preview</span><div class="sg-tables">' + tables + '</div></div>' +
      '<div class="sg-editor"><pre class="sg-hl" aria-hidden="true"></pre>' +
      '<textarea id="sg-sql" spellcheck="false" autocapitalize="off" autocomplete="off" rows="6" aria-label="SQL query" placeholder="-- write your query here"></textarea></div>' +
      '<div class="sg-actions"><button class="sg-run" id="sg-run">Run query <kbd>⌘/Ctrl + Enter</kbd></button>' +
      '<button class="sg-ghost" id="sg-hint">Hint (-20)</button><button class="sg-ghost" id="sg-sol" hidden>Show solution</button></div>' +
      '<div class="sg-msg" id="sg-msg" role="status"></div><div class="sg-out" id="sg-out"></div>';
    var ta = el('#sg-sql');
    ta.value = state.draft && state.draft[cur] || '';
    syncHl();
    ta.addEventListener('input', function () { syncHl(); state.draft = state.draft || {}; state.draft[cur] = ta.value; save(); });
    ta.addEventListener('scroll', function () { var h = el('.sg-hl'); h.scrollTop = ta.scrollTop; h.scrollLeft = ta.scrollLeft; });
    ta.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
      else if (e.key === 'Tab') { e.preventDefault(); var s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 2; ta.dispatchEvent(new Event('input')); }
    });
    if (state.done[cur] !== undefined) say('ok', 'Solved already (' + state.done[cur] + ' pts). Replay it any time or move on.', true);
  }
  function syncHl() { var h = el('.sg-hl'), v = el('#sg-sql').value; h.innerHTML = hl(v) + '\n'; }
  function say(kind, html, showNext) {
    var m = el('#sg-msg');
    m.className = 'sg-msg ' + kind;
    m.innerHTML = html + (showNext && cur < LEVELS.length - 1 && state.done[cur] !== undefined ? ' <button class="sg-next" id="sg-next">Next case →</button>' : '');
  }
  function table(res, cap) {
    if (!res.length) return '<p class="sg-empty">The query ran but returned no rows.</p>';
    var r = res[0], rows = r.values.slice(0, cap || 100);
    var head = '<tr>' + r.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>';
    var body = rows.map(function (row) {
      return '<tr>' + row.map(function (v) { return v === null ? '<td class="nul">NULL</td>' : '<td' + (typeof v === 'number' ? ' class="num"' : '') + '>' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<div class="sg-scroll"><table>' + head + body + '</table></div><p class="sg-count">' + r.values.length + ' row' + (r.values.length === 1 ? '' : 's') + (r.values.length > rows.length ? ' (first ' + rows.length + ' shown)' : '') + '</p>';
  }
  function exec(sql) {
    var q = sql.trim().replace(/;+\s*$/, '');
    if (!q) throw new Error('Write a query first.');
    if (q.indexOf(';') !== -1) throw new Error('Run one statement at a time.');
    if (!/^(select|with)\b/i.test(q.replace(/^(\s*(--[^\n]*(\n|$)|\/\*[\s\S]*?\*\/))*\s*/, ''))) throw new Error('This lab only allows SELECT queries.');
    return db.exec(q);
  }

  function run() {
    var sql = el('#sg-sql').value, out = el('#sg-out'), L = LEVELS[cur], res;
    try { res = exec(sql); } catch (e) { fails++; out.innerHTML = ''; say('err', '<b>SQL error:</b> ' + esc(e.message)); return; }
    out.innerHTML = table(res);
    var verdict = compare(shape(res), shape(db.exec(L.sol)), L.ordered);
    if (!verdict.ok) { fails++; say('warn', verdict.msg); if (fails >= 3) el('#sg-sol').hidden = false; return; }
    var pts = solShown ? 10 : Math.max(30, 100 - hintsUsed * 20 - fails * 10);
    var prev = state.done[cur];
    if (prev === undefined || pts > prev) state.done[cur] = pts;
    save();
    var last = cur === LEVELS.length - 1;
    var bar = el('.sg-bar i'); if (bar) bar.style.width = (doneCount() / LEVELS.length * 100) + '%';
    el('.sg-score').textContent = total() + ' pts';
    var dot = root.querySelector('.sg-dot[data-go="' + cur + '"]'); if (dot) dot.classList.add('done');
    var nxt = root.querySelector('.sg-dot[data-go="' + (cur + 1) + '"]'); if (nxt) nxt.disabled = false;
    if (last && doneCount() === LEVELS.length) { finale(); return; }
    say('ok', '<b>Case solved! +' + pts + ' pts.</b> ', true);
  }

  function finale() {
    say('ok', '<b>Case solved! +' + state.done[cur] + ' pts.</b>');
    var old = root.querySelector('.sg-final'); if (old) old.remove();
    var box = document.createElement('section');
    box.className = 'sg-final';
    box.innerHTML = '<span class="sg-case">CASE CLOSED</span><h2>Viktor Hale is referred to the authorities</h2>' +
      '<p>Seven deposits just under the reporting threshold in three weeks, then <b>89,300</b> wired to Panama and Cyprus. You found the structuring pattern with plain SQL: filters, aggregates, joins and subqueries.</p>' +
      '<div class="sg-badge"><b>' + total() + '</b><span>of ' + LEVELS.length * 100 + ' points</span></div>' +
      '<div class="sg-actions"><a class="sg-run" href="' + root.getAttribute('data-back') + '">Back to Data etc.</a><button class="sg-ghost" id="sg-reset">Play again</button></div>';
    root.appendChild(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function go(i) { cur = i; hintsUsed = 0; fails = 0; solShown = false; render(); }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('button, a'); if (!t) return;
    if (t.hasAttribute('data-go')) go(+t.getAttribute('data-go'));
    else if (t.id === 'sg-run') run();
    else if (t.id === 'sg-next') go(cur + 1);
    else if (t.id === 'sg-hint') {
      var h = LEVELS[cur].hints; if (hintsUsed < h.length) hintsUsed++;
      say('hint', '<b>Hint ' + hintsUsed + '/' + h.length + ':</b> ' + esc(h[hintsUsed - 1]));
      if (hintsUsed >= h.length) t.disabled = true;
    } else if (t.id === 'sg-sol') {
      solShown = true; var ta = el('#sg-sql'); ta.value = LEVELS[cur].sol; ta.dispatchEvent(new Event('input'));
      say('hint', 'Solution loaded. Run it to see how it works (worth only 10 pts).');
    } else if (t.hasAttribute('data-peek')) {
      el('#sg-out').innerHTML = table(db.exec('SELECT * FROM ' + t.getAttribute('data-peek') + ' LIMIT 8'));
      say('hint', 'Previewing <b>' + esc(t.getAttribute('data-peek')) + '</b> (first 8 rows).');
    } else if (t.id === 'sg-reset') {
      if (confirm('Reset all progress?')) { state = { done: {} }; save(); go(0); }
    }
  });

  initSqlJs({ locateFile: function (f) { return base + f; } }).then(function (SQL) {
    db = buildDb(SQL);
    go(Math.min(unlocked(), LEVELS.length - 1));
  }).catch(function () {
    root.innerHTML = '<p class="sg-empty">Could not load the SQL engine. Please refresh the page.</p>';
  });
})();
