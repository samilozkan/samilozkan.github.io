---
layout: page
title: Kimball Cheat Sheet
permalink: /data-engineering/kimball/
terminal: 'select * from fact_sales join dim_date'
published: true
---

<p class="books-intro">A visual quick reference for <strong>Kimball dimensional modeling</strong>: the star schema, how to design one, and how to query it.</p>

<h2 class="section-label"><span>//</span> 01 · the star schema</h2>
<p>One <strong>fact</strong> table holds the measurements (numbers). Surrounding <strong>dimension</strong> tables describe them (who, what, when, where).</p>

<div class="lineage">
<svg viewBox="0 0 700 320" role="img" aria-label="Star schema: fact_sales in the center connected to dim_date, dim_product, dim_customer and dim_store">
  <defs>
    <marker id="lin-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#4183C4"/></marker>
  </defs>
  <g class="lin-edges" fill="none" stroke-width="2">
    <path d="M200 62 C260 62 280 125 300 138"/>
    <path d="M500 62 C440 62 420 125 400 138"/>
    <path d="M200 258 C260 258 280 195 300 182"/>
    <path d="M500 258 C440 258 420 195 400 182"/>
  </g>
  <g class="lin-node" font-size="13" text-anchor="middle">
    <rect x="60" y="38" width="140" height="48" rx="6" stroke="#4183C4"/><text x="130" y="67">dim_date</text>
    <rect x="500" y="38" width="140" height="48" rx="6" stroke="#4183C4"/><text x="570" y="67">dim_product</text>
    <rect x="60" y="234" width="140" height="48" rx="6" stroke="#4183C4"/><text x="130" y="263">dim_customer</text>
    <rect x="500" y="234" width="140" height="48" rx="6" stroke="#4183C4"/><text x="570" y="263">dim_store</text>
    <rect x="290" y="130" width="120" height="60" rx="8" stroke="#8be9a0" stroke-width="2.5"/><text x="350" y="157">fact_sales</text><text x="350" y="176" font-size="10" fill="#8be9a0">measures + keys</text>
  </g>
</svg>
</div>

<h2 class="section-label"><span>//</span> 02 · query it: facts join dimensions</h2>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">revenue_by_category.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>select
    d.year,
    d.month_name,
    p.category,
    sum(f.sales_amount) as revenue
from fact_sales f
join dim_date    d on f.date_key    = d.date_key
join dim_product p on f.product_key = p.product_key
group by 1, 2, 3
order by 1, 2, 3;
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">result</span>
    <div class="table-wrap"><table>
      <thead><tr><th>year</th><th>month_name</th><th>category</th><th class="num">revenue</th></tr></thead>
      <tbody>
        <tr><td>2026</td><td>October</td><td>Books</td><td class="num">18,420.00</td></tr>
        <tr><td>2026</td><td>October</td><td>Electronics</td><td class="num">74,310.50</td></tr>
        <tr><td>2026</td><td>October</td><td>Home</td><td class="num">29,880.25</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<h2 class="section-label"><span>//</span> 03 · the 4-step design process</h2>
<div class="cmd-grid">
  <div class="cmd hot"><code>1 · Business process</code><p>Pick what to model, like orders, shipments or claims.</p></div>
  <div class="cmd hot"><code>2 · Grain</code><p>Declare exactly what one row means. For example: one line item on one order.</p></div>
  <div class="cmd hot"><code>3 · Dimensions</code><p>Choose the context: date, product, customer, store.</p></div>
  <div class="cmd hot"><code>4 · Facts</code><p>Choose the numeric measures: quantity, amount, discount.</p></div>
</div>

<h2 class="section-label"><span>//</span> 04 · slowly changing dimensions (SCD Type 2)</h2>
<p>When an attribute changes, keep history by closing the old row and adding a new one.</p>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">scd2_customer.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>-- customer 42 moves from Berlin to Munich
update dim_customer
set valid_to = '2026-03-01', is_current = false
where customer_id = 42 and is_current;

insert into dim_customer
    (customer_id, city, valid_from, valid_to, is_current)
values
    (42, 'Munich', '2026-03-01', null, true);
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">dim_customer</span>
    <div class="table-wrap"><table>
      <thead><tr><th>customer_id</th><th>city</th><th>valid_from</th><th>valid_to</th><th>is_current</th></tr></thead>
      <tbody>
        <tr class="old"><td>42</td><td>Berlin</td><td>2024-06-10</td><td>2026-03-01</td><td>false</td></tr>
        <tr class="new"><td>42</td><td>Munich</td><td>2026-03-01</td><td>null</td><td>true</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<div class="cmd-grid">
  <div class="cmd"><code>Type 1</code><p>Overwrite. No history. Good for typo fixes.</p></div>
  <div class="cmd hot"><code>Type 2</code><p>Add a new row with validity dates. Full history.</p></div>
  <div class="cmd"><code>Type 3</code><p>Add a column for the previous value. Limited history.</p></div>
</div>

<h2 class="section-label"><span>//</span> 05 · rules of thumb</h2>
<div class="cmd-grid">
  <div class="cmd"><code>Surrogate keys</code><p>Use warehouse-owned integer keys, not source system IDs.</p></div>
  <div class="cmd"><code>Conformed dimensions</code><p>Share the same <code>dim_date</code> and <code>dim_customer</code> across facts.</p></div>
  <div class="cmd"><code>Additive measures</code><p>Prefer facts you can safely sum across every dimension.</p></div>
  <div class="cmd"><code>Date dimension</code><p>Always build one. Do not compute month names in every query.</p></div>
</div>

<p class="note">Read the <a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/" target="_blank" rel="noopener">Kimball dimensional modeling techniques</a> or go <a href="/data-engineering/">back to Data Engineering</a>.</p>
