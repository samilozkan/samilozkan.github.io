---
layout: page
title: Kimball Cheat Sheet
permalink: /data-engineering/kimball/
terminal: 'select * from fact_transactions join dim_date'
published: true
---

<p class="books-intro">A visual quick reference for <strong>Kimball dimensional modeling</strong>: the star schema, how to design one, and how to query it.</p>

<h2 class="section-label"><span>//</span> 01 · the star schema</h2>
<p>One <strong>fact</strong> table holds the measurements (numbers). Surrounding <strong>dimension</strong> tables describe them (who, what, when, where).</p>

<div class="lineage">
<svg viewBox="0 0 700 320" role="img" aria-label="Star schema: fact_transactions in the center connected to dim_date, dim_account, dim_customer and dim_country">
  <defs>
    <marker id="lin-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#4183C4"/></marker>
  </defs>
  <g class="lin-edges" fill="none" stroke-width="2">
    <path d="M200 62 L265 146"/>
    <path d="M500 62 L435 146"/>
    <path d="M200 258 L265 174"/>
    <path d="M500 258 L435 174"/>
  </g>
  <g class="lin-node" font-size="13" text-anchor="middle">
    <rect x="60" y="38" width="140" height="48" rx="6" stroke="#4183C4"/><text x="130" y="67">dim_date</text>
    <rect x="500" y="38" width="140" height="48" rx="6" stroke="#4183C4"/><text x="570" y="67">dim_account</text>
    <rect x="60" y="234" width="140" height="48" rx="6" stroke="#4183C4"/><text x="130" y="263">dim_customer</text>
    <rect x="500" y="234" width="140" height="48" rx="6" stroke="#4183C4"/><text x="570" y="263">dim_country</text>
    <rect x="265" y="125" width="170" height="70" rx="8" stroke="#8be9a0" stroke-width="2.5"/><text x="350" y="155">fact_transactions</text><text x="350" y="177" font-size="10.5" fill="#8be9a0">amounts + keys</text>
  </g>
</svg>
</div>

<h2 class="section-label"><span>//</span> 02 · query it: facts join dimensions</h2>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">alerts_by_country.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>select
    d.year,
    d.month_name,
    c.country_name,
    count(*)      as flagged_txns,
    sum(f.amount) as flagged_amount
from fact_transactions f
join dim_date    d on f.date_key    = d.date_key
join dim_country c on f.country_key = c.country_key
where f.is_flagged
group by 1, 2, 3
order by flagged_amount desc;
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">result</span>
    <div class="table-wrap"><table>
      <thead><tr><th>year</th><th>month_name</th><th>country_name</th><th class="num">flagged_txns</th><th class="num">flagged_amount</th></tr></thead>
      <tbody>
        <tr><td>2026</td><td>October</td><td>United Arab Emirates</td><td class="num">37</td><td class="num">1,284,300.00</td></tr>
        <tr><td>2026</td><td>October</td><td>Turkey</td><td class="num">21</td><td class="num">612,450.50</td></tr>
        <tr><td>2026</td><td>October</td><td>Germany</td><td class="num">9</td><td class="num">148,900.25</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<h2 class="section-label"><span>//</span> 03 · the 4-step design process</h2>
<div class="cmd-grid">
  <div class="cmd hot"><code>1 · Business process</code><p>Pick what to model, like payments, alerts or customer reviews.</p></div>
  <div class="cmd hot"><code>2 · Grain</code><p>Declare exactly what one row means. For example: one transaction on one account.</p></div>
  <div class="cmd hot"><code>3 · Dimensions</code><p>Choose the context: date, account, customer, country.</p></div>
  <div class="cmd hot"><code>4 · Facts</code><p>Choose the numeric measures: amount, fee, risk score.</p></div>
</div>

<h2 class="section-label"><span>//</span> 04 · slowly changing dimensions (SCD Type 2)</h2>
<p>When an attribute changes, keep history by closing the old row and adding a new one. In financial crime this is essential: you must know what a customer's risk rating was <em>at the time</em> of each transaction.</p>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">scd2_customer.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>-- KYC review raises customer 42 from medium to high risk
update dim_customer
set valid_to = '2026-03-01', is_current = false
where customer_id = 42 and is_current;

insert into dim_customer
    (customer_id, risk_rating, valid_from, valid_to, is_current)
values
    (42, 'high', '2026-03-01', null, true);
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">dim_customer</span>
    <div class="table-wrap"><table>
      <thead><tr><th>customer_id</th><th>risk_rating</th><th>valid_from</th><th>valid_to</th><th>is_current</th></tr></thead>
      <tbody>
        <tr class="old"><td>42</td><td>medium</td><td>2024-06-10</td><td>2026-03-01</td><td>false</td></tr>
        <tr class="new"><td>42</td><td>high</td><td>2026-03-01</td><td>null</td><td>true</td></tr>
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
