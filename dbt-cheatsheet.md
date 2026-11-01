---
layout: page
title: dbt Cheat Sheet
permalink: /data-engineering/dbt/
terminal: 'dbt build --select +fct_transactions'
toc: true
scripts: [dbt-lab]
published: true
---

{% raw %}
<p class="books-intro">An interactive guide to <strong>dbt</strong>. Watch code being written, play with selectors, compare materializations, and see what dbt does with your SQL. Examples use an anti-money-laundering (AML) pipeline.</p>

<h2 class="section-label"><span>//</span> 01 · where dbt fits</h2>
<p>dbt is the <strong>T</strong> in ELT. Your data is already loaded into the warehouse. dbt turns <code>select</code> statements into tables and views, and works out the build order from <code>source()</code> and <code>ref()</code>.</p>

<div class="lineage">
<svg viewBox="0 0 730 230" role="img" aria-label="dbt lineage: sources to staging to marts to BI">
  <defs>
    <marker id="lin-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#4183C4"/></marker>
  </defs>
  <g class="lin-label" font-size="11" text-anchor="middle">
    <text x="80" y="22" fill="#e0a458">SOURCES</text>
    <text x="270" y="22" fill="#4183C4">STAGING</text>
    <text x="460" y="22" fill="#8be9a0">MARTS</text>
    <text x="650" y="22" fill="#c678dd">BI</text>
  </g>
  <g class="lin-edges" fill="none" stroke-width="2">
    <path d="M150 62 L200 62"/>
    <path d="M150 162 L200 162"/>
    <path d="M340 62 L390 62"/>
    <path d="M340 162 C365 162 365 62 390 62"/>
    <path d="M340 162 L390 162"/>
    <path d="M530 62 C555 62 555 112 580 112"/>
    <path d="M530 162 C555 162 555 112 580 112"/>
  </g>
  <g class="lin-node" font-size="13" text-anchor="middle">
    <rect x="10" y="40" width="140" height="44" rx="6" stroke="#e0a458"/><text x="80" y="67">raw.transactions</text>
    <rect x="10" y="140" width="140" height="44" rx="6" stroke="#e0a458"/><text x="80" y="167">raw.customers</text>
    <rect x="200" y="40" width="140" height="44" rx="6" stroke="#4183C4"/><text x="270" y="67">stg_transactions</text>
    <rect x="200" y="140" width="140" height="44" rx="6" stroke="#4183C4"/><text x="270" y="167">stg_customers</text>
    <rect x="390" y="40" width="140" height="44" rx="6" stroke="#8be9a0"/><text x="460" y="67">fct_transactions</text>
    <rect x="390" y="140" width="140" height="44" rx="6" stroke="#8be9a0"/><text x="460" y="167">dim_customers</text>
    <rect x="580" y="90" width="140" height="44" rx="6" stroke="#c678dd"/><text x="650" y="117">aml_alerts</text>
  </g>
</svg>
</div>

<p class="tip"><strong>Key idea:</strong> you never write <code>create table</code>. You write a <code>select</code>, and dbt wraps it in the right DDL for your warehouse.</p>

<h2 class="section-label"><span>//</span> 02 · your first run</h2>
<p>From install to a passing build, in five commands:</p>

<div class="demo" data-lang="shell">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">terminal</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>pip install dbt-bigquery
dbt init aml_monitoring
cd aml_monitoring
dbt debug
dbt build
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">output (shortened)</span>
<pre class="log"><span class="ln" style="--i:0">Connection test: [OK connection ok]</span>
<span class="ln" style="--i:1">Found 4 models, 4 data tests, 1 source, 0 macros</span>
<span class="ln ok" style="--i:2">1 of 8 OK created sql view model aml.stg_transactions ... [SUCCESS]</span>
<span class="ln ok" style="--i:3">4 of 8 PASS unique_stg_transactions_txn_id ............. [PASS]</span>
<span class="ln ok" style="--i:4">Done. PASS=8 WARN=0 ERROR=0 SKIP=0 TOTAL=8</span></pre>
  </div>
</div>

<p class="tip"><strong>Tip:</strong> run <code>dbt debug</code> first. Most setup problems are connection or <code>profiles.yml</code> issues, and it names the exact one.</p>

<h2 class="section-label"><span>//</span> 03 · daily commands</h2>

<div class="cmd-grid">
  <div class="cmd"><code>dbt debug</code><p>Check your connection and project config.</p></div>
  <div class="cmd"><code>dbt deps</code><p>Install packages from <code>packages.yml</code>.</p></div>
  <div class="cmd"><code>dbt seed</code><p>Load CSV files from <code>seeds/</code> into the warehouse.</p></div>
  <div class="cmd"><code>dbt run</code><p>Build your models.</p></div>
  <div class="cmd"><code>dbt test</code><p>Run data and schema tests.</p></div>
  <div class="cmd hot"><code>dbt build</code><p>Seeds, models, snapshots and tests in DAG order. The one to use in CI.</p></div>
  <div class="cmd"><code>dbt compile</code><p>Render SQL to <code>target/</code> without running it.</p></div>
  <div class="cmd"><code>dbt snapshot</code><p>Track row changes over time (SCD Type 2).</p></div>
  <div class="cmd"><code>dbt docs generate</code><p>Build the docs site and lineage graph. Open it with <code>dbt docs serve</code>.</p></div>
  <div class="cmd"><code>dbt source freshness</code><p>Check how recent your source data is.</p></div>
  <div class="cmd"><code>dbt ls</code><p>List resources that match a selector.</p></div>
  <div class="cmd"><code>dbt run --full-refresh</code><p>Rebuild incremental models from scratch.</p></div>
</div>

<h2 class="section-label"><span>//</span> 04 · selector playground</h2>
<p>A <code>+</code> means "and the models it depends on" (before) or "and the models that depend on it" (after). Pick a selector, type your own, or click a node, and see what would run.</p>

<div class="lab" id="dag-lab">
  <div class="lab-chips">
    <button class="chip" type="button" aria-pressed="false" data-sel="fct_transactions" data-desc="Only this model. Nothing upstream or downstream is touched.">fct_transactions</button>
    <button class="chip" type="button" aria-pressed="false" data-sel="+fct_transactions" data-desc="The model and everything it depends on, so its inputs are built first.">+fct_transactions</button>
    <button class="chip" type="button" aria-pressed="false" data-sel="fct_transactions+" data-desc="The model and everything downstream, such as the alerts that read it.">fct_transactions+</button>
    <button class="chip" type="button" aria-pressed="false" data-sel="+fct_transactions+" data-desc="The whole chain around this model, upstream and downstream.">+fct_transactions+</button>
    <button class="chip" type="button" aria-pressed="false" data-sel="1+fct_transactions" data-desc="A number limits the depth: only direct parents, one level up.">1+fct_transactions</button>
  </div>
  <label class="lab-label" for="dag-input">selector</label>
  <input id="dag-input" class="lab-input" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="e.g. +dim_customers+">
  <div class="dag-holder"></div>
  <div class="lab-result">
    <code class="lab-cmd"></code>
    <p class="lab-desc"></p>
    <div class="lab-models"></div>
  </div>
</div>

<div class="cmd-grid">
  <div class="cmd"><code>--select tag:daily</code><p>Everything with a tag.</p></div>
  <div class="cmd"><code>--select path:models/marts</code><p>Everything in a folder.</p></div>
  <div class="cmd"><code>--exclude stg_transactions</code><p>Skip specific nodes.</p></div>
  <div class="cmd"><code>--select state:modified+</code><p>Changed models and their children (with <code>--state</code>).</p></div>
  <div class="cmd"><code>--target prod</code><p>Use another target from <code>profiles.yml</code>.</p></div>
  <div class="cmd"><code>dbt ls --select ...</code><p>Preview a selection without running anything.</p></div>
</div>

<p class="tip"><strong>Tip:</strong> before a risky run, use <code>dbt ls --select your_selector</code> to see exactly what it matches.</p>

<h2 class="section-label"><span>//</span> 05 · materializations</h2>
<p>A materialization is how dbt writes a model into the warehouse. Switch tabs and watch what happens to 11 rows (8 old, 3 new).</p>

<div class="lab mode-table" id="mat-lab">
  <div class="lab-tabs" role="tablist" aria-label="Materialization">
    <button type="button" role="tab" data-mode="view" aria-selected="false">view</button>
    <button type="button" role="tab" data-mode="table" aria-selected="true">table</button>
    <button type="button" role="tab" data-mode="incremental" aria-selected="false">incremental</button>
    <button type="button" role="tab" data-mode="ephemeral" aria-selected="false">ephemeral</button>
  </div>
  <pre class="lab-code"><code></code></pre>
  <div class="lab-stage">
    <div class="lab-rows" aria-hidden="true"></div>
    <p class="lab-empty"></p>
    <button class="lab-replay" type="button">↻ run again</button>
  </div>
  <dl class="lab-stats">
    <div><dt>build cost</dt><dd></dd></div>
    <div><dt>read speed</dt><dd></dd></div>
    <div><dt>freshness</dt><dd></dd></div>
  </dl>
  <p class="lab-caption"></p>
</div>

<p class="tip"><strong>Rule of thumb:</strong> start with <code>view</code>, move to <code>table</code> when it gets slow, and to <code>incremental</code> when the table gets big.</p>

<h2 class="section-label"><span>//</span> 06 · a model in practice</h2>
<p>Write a staging model for payment transactions, run it, and see what dbt builds:</p>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">models/staging/stg_transactions.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>select
    id            as txn_id,
    customer_id,
    amount,
    currency,
    channel,
    counterparty_country,
    created_at    as txn_ts
from {{ source('core_banking', 'transactions') }}
where amount is not null
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">$ dbt run --select stg_transactions</span>
<pre class="log"><span class="ln" style="--i:0">1 of 1 START sql view model aml.stg_transactions ........ [RUN]</span>
<span class="ln ok" style="--i:1">1 of 1 OK created sql view model aml.stg_transactions ... [SUCCESS in 0.42s]</span>
<span class="ln ok" style="--i:2">Completed successfully. PASS=1 WARN=0 ERROR=0 TOTAL=1</span></pre>
    <div class="table-wrap" style="margin-top:12px"><table>
      <thead><tr><th>txn_id</th><th>customer_id</th><th class="num">amount</th><th>channel</th><th>counterparty_country</th></tr></thead>
      <tbody>
        <tr><td>T-90001</td><td>C-1042</td><td class="num">9,800.00</td><td>cash</td><td>DE</td></tr>
        <tr><td>T-90002</td><td>C-2217</td><td class="num">48,500.00</td><td>wire</td><td>AE</td></tr>
        <tr><td>T-90003</td><td>C-1042</td><td class="num">9,750.00</td><td>cash</td><td>DE</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<p class="tip"><strong>Convention:</strong> staging models rename, cast and clean. They map 1 to 1 with a source table and hold no business logic.</p>

<h2 class="section-label"><span>//</span> 07 · what dbt compiles</h2>
<p>Marts build on staging with <code>ref()</code>. This model is incremental and flags transactions that need review. The output shows the plain SQL dbt actually sends to the warehouse.</p>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">models/marts/fct_transactions.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>{{ config(materialized='incremental', unique_key='txn_id') }}

select
    t.txn_id,
    t.customer_id,
    t.amount,
    t.channel,
    t.txn_ts,
    (t.amount >= 10000 or c.risk_rating = 'high') as needs_review
from {{ ref('stg_transactions') }} t
join {{ ref('dim_customers') }} c using (customer_id)

{% if is_incremental() %}
where t.txn_ts > (select max(txn_ts) from {{ this }})
{% endif %}
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">target/compiled/.../fct_transactions.sql (2nd run)</span>
<pre class="log"><span class="ln" style="--i:0">select t.txn_id, t.customer_id, t.amount, t.channel, t.txn_ts,</span>
<span class="ln" style="--i:1">  (t.amount >= 10000 or c.risk_rating = 'high') as needs_review</span>
<span class="ln ok" style="--i:2">from `aml`.`stg_transactions` t</span>
<span class="ln ok" style="--i:3">join `aml`.`dim_customers` c using (customer_id)</span>
<span class="ln warn" style="--i:4">where t.txn_ts > (select max(txn_ts) from `aml`.`fct_transactions`)</span></pre>
  </div>
</div>

<p class="tip"><strong>Notice:</strong> <code>ref()</code> became a real table name, and the <code>is_incremental()</code> block only appears from the second run on. On the first run dbt loads everything.</p>

<h2 class="section-label"><span>//</span> 08 · jinja writes sql</h2>
<p>Jinja lets you loop and branch inside SQL. Here one loop replaces three nearly identical columns:</p>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">models/marts/txn_by_channel.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>{% set channels = ['cash', 'wire', 'card'] %}

select
    customer_id,
{% for ch in channels %}
    sum(case when channel = '{{ ch }}' then amount end) as {{ ch }}_amount{{ "," if not loop.last }}
{% endfor %}
from {{ ref('stg_transactions') }}
group by 1
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">compiled sql</span>
<pre class="log"><span class="ln" style="--i:0">select customer_id,</span>
<span class="ln ok" style="--i:1">  sum(case when channel = 'cash' then amount end) as cash_amount,</span>
<span class="ln ok" style="--i:2">  sum(case when channel = 'wire' then amount end) as wire_amount,</span>
<span class="ln ok" style="--i:3">  sum(case when channel = 'card' then amount end) as card_amount</span>
<span class="ln" style="--i:4">from `aml`.`stg_transactions` group by 1</span></pre>
  </div>
</div>

<div class="cmd-grid">
  <div class="cmd"><code>{{ ref('model') }}</code><p>Reference another model. Builds the DAG.</p></div>
  <div class="cmd"><code>{{ source('src', 'table') }}</code><p>Reference a raw source table.</p></div>
  <div class="cmd"><code>{{ config(...) }}</code><p>Set materialization, tags, and more for a model.</p></div>
  <div class="cmd"><code>{{ this }}</code><p>The current model's own table. Handy in incremental logic.</p></div>
  <div class="cmd"><code>{{ var('name') }}</code><p>Read a project variable.</p></div>
  <div class="cmd"><code>{{ env_var('NAME') }}</code><p>Read an environment variable.</p></div>
  <div class="cmd"><code>{% if is_incremental() %}</code><p>True on incremental runs, false on the first build.</p></div>
  <div class="cmd"><code>{% macro name(arg) %}</code><p>Reusable SQL snippet, saved in <code>macros/</code>.</p></div>
</div>

<h2 class="section-label"><span>//</span> 09 · tests</h2>
<p>Define tests in YAML next to your models. Here a new <code>crypto</code> channel appears in the data, and the test catches it:</p>

<div class="demo" data-lang="yaml">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">models/marts/schema.yml</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>version: 2

models:
  - name: fct_transactions
    columns:
      - name: txn_id
        data_tests: [unique, not_null]
      - name: channel
        data_tests:
          - accepted_values:
              values: ['cash', 'wire', 'card']
      - name: customer_id
        data_tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">$ dbt test --select fct_transactions</span>
<pre class="log"><span class="ln ok" style="--i:0">1 of 4 PASS unique_fct_transactions_txn_id ............ [PASS]</span>
<span class="ln ok" style="--i:1">2 of 4 PASS not_null_fct_transactions_txn_id ......... [PASS]</span>
<span class="ln err" style="--i:2">3 of 4 FAIL 2 accepted_values_..._channel ............ [FAIL 2]</span>
<span class="ln ok" style="--i:3">4 of 4 PASS relationships_..._customer_id ............ [PASS]</span>
<span class="ln err" style="--i:4">Done. PASS=3 WARN=0 ERROR=1 TOTAL=4</span></pre>
    <div class="table-wrap" style="margin-top:12px"><table>
      <thead><tr><th>value_field</th><th class="num">n_records</th></tr></thead>
      <tbody><tr><td>crypto</td><td class="num">2</td></tr></tbody>
    </table></div>
  </div>
</div>

<div class="cmd-grid">
  <div class="cmd"><code>unique</code><p>No duplicate values in the column.</p></div>
  <div class="cmd"><code>not_null</code><p>The column has no nulls.</p></div>
  <div class="cmd"><code>accepted_values</code><p>Values come from an allowed list.</p></div>
  <div class="cmd"><code>relationships</code><p>Every value exists in another table (foreign key).</p></div>
</div>

<p class="note">Before dbt 1.8 the YAML key was called <code>tests</code>. Singular tests are plain SQL files in <code>tests/</code> that return the failing rows.</p>

<h2 class="section-label"><span>//</span> 10 · project structure</h2>

<div class="demo" data-lang="text">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">aml_monitoring/</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>aml_monitoring/
├── dbt_project.yml     # project config
├── packages.yml        # dbt packages
├── models/
│   ├── staging/        # clean, rename, cast (1 to 1 with sources)
│   ├── intermediate/   # joins and business logic
│   └── marts/          # facts and dimensions for BI
├── seeds/              # small CSV files
├── snapshots/          # SCD Type 2 history
├── macros/             # reusable Jinja
├── tests/              # singular tests
└── target/             # compiled output (git-ignored)
</code></pre>
</div>

<p class="note">Want to go deeper? Read the official <a href="https://docs.getdbt.com/" target="_blank" rel="noopener">dbt documentation</a> or go <a href="/data-engineering/">back to Data etc.</a>.</p>
{% endraw %}
