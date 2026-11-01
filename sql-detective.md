---
layout: page
title: SQL Detective
permalink: /data-engineering/sql-detective/
terminal: "sqlite3 aml.db 'SELECT * FROM suspects;'"
scripts: [vendor/sql-wasm, sql-game]
published: true
---

<p class="books-intro">Learn SQL by solving a money-laundering case. You are an analyst at a bank's Financial Intelligence Unit. Every case teaches one idea, and every answer is a real query running on a real SQLite database in your browser. Nothing is sent anywhere.</p>

<div id="sql-game" class="sg" data-back="{{ site.baseurl }}/data-engineering/">
  <p class="sg-empty">Loading the case files…</p>
</div>

<noscript><p class="note">This game needs JavaScript to run SQL in your browser.</p></noscript>

<p class="note">Based on a made-up dataset. 16 cases from <code>SELECT</code> to subqueries. Progress is saved in this browser.</p>
