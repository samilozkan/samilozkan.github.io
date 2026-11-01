---
layout: page
title: dbt Cheat Sheet
permalink: /data-engineering/dbt/
terminal: 'dbt build --select +fct_transactions'
published: true
---

{% raw %}
<p class="books-intro">A visual quick reference for <strong>dbt</strong>: how data flows, the commands you use daily, and the patterns worth memorizing.</p>

<h2 class="section-label"><span>//</span> 01 · how dbt sees your data</h2>
<p>dbt turns SQL <code>select</code> statements into a dependency graph (DAG). <code>source()</code> and <code>ref()</code> are what draw the lines.</p>

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

<h2 class="section-label"><span>//</span> 02 · commands you use every day</h2>

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

<h2 class="section-label"><span>//</span> 03 · selecting what to run</h2>

<div class="cmd-grid">
  <div class="cmd"><code>--select fct_transactions</code><p>Just that model.</p></div>
  <div class="cmd"><code>--select fct_transactions+</code><p>The model and everything downstream.</p></div>
  <div class="cmd"><code>--select +fct_transactions</code><p>The model and everything upstream.</p></div>
  <div class="cmd"><code>--select tag:daily</code><p>Everything with a tag.</p></div>
  <div class="cmd"><code>--select path:models/marts</code><p>Everything in a folder.</p></div>
  <div class="cmd"><code>--exclude stg_transactions</code><p>Skip specific nodes.</p></div>
  <div class="cmd"><code>--select state:modified+</code><p>Changed models and their children (with <code>--state</code>).</p></div>
  <div class="cmd"><code>--target prod</code><p>Use another target from <code>profiles.yml</code>.</p></div>
</div>

<h2 class="section-label"><span>//</span> 04 · materializations</h2>
<p>How dbt writes a model into the warehouse. Set it with <code>config(materialized=...)</code>.</p>

<div class="mat-grid">
  <div class="mat">
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="10" width="36" height="28" rx="3" stroke-dasharray="4 4"/><path d="M14 24h20"/></svg>
    <h3>view</h3>
    <p>A saved query. Always fresh, no storage. The default.</p>
  </div>
  <div class="mat">
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="10" width="36" height="28" rx="3"/><path d="M6 20h36M6 29h36M19 10v28"/></svg>
    <h3>table</h3>
    <p>Rebuilt in full on every run. Fast to query, slower to build.</p>
  </div>
  <div class="mat">
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="10" width="36" height="28" rx="3"/><path d="M6 24h36"/><path d="M24 30v6m-3-3l3 3 3-3" /></svg>
    <h3>incremental</h3>
    <p>Only adds or updates new rows. Best for large, append-heavy data.</p>
  </div>
  <div class="mat">
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 14h14M8 24h22M8 34h10" stroke-dasharray="3 3"/><circle cx="38" cy="24" r="5"/></svg>
    <h3>ephemeral</h3>
    <p>Not built at all. Inlined as a CTE into models that use it.</p>
  </div>
</div>

<h2 class="section-label"><span>//</span> 05 · a model, in practice</h2>
<p>Write a staging model for payment transactions, run it, and see what dbt builds:</p>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">models/staging/stg_transactions.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>select
    id            as txn_id,
    customer_id,
    amount,
    currency,
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
      <thead><tr><th>txn_id</th><th>customer_id</th><th class="num">amount</th><th>currency</th><th>counterparty_country</th></tr></thead>
      <tbody>
        <tr><td>T-90001</td><td>C-1042</td><td class="num">9,800.00</td><td>EUR</td><td>DE</td></tr>
        <tr><td>T-90002</td><td>C-2217</td><td class="num">48,500.00</td><td>USD</td><td>AE</td></tr>
        <tr><td>T-90003</td><td>C-1042</td><td class="num">9,750.00</td><td>EUR</td><td>DE</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<p>Marts build on staging with <code>ref()</code>. This one is incremental and flags transactions that need review (a large amount or a high-risk country):</p>

```sql
-- models/marts/fct_transactions.sql
{{ config(materialized='incremental', unique_key='txn_id') }}

select
    t.txn_id,
    t.customer_id,
    t.amount,
    t.txn_ts,
    (t.amount >= 10000 or c.risk_rating = 'high') as needs_review
from {{ ref('stg_transactions') }} t
join {{ ref('dim_customers') }} c using (customer_id)

{% if is_incremental() %}
where t.txn_ts > (select max(txn_ts) from {{ this }})
{% endif %}
```

<h2 class="section-label"><span>//</span> 06 · tests</h2>
<p>Four built-in generic tests cover most cases. Define them in YAML next to your models:</p>

```yaml
# models/marts/schema.yml
version: 2

models:
  - name: fct_transactions
    columns:
      - name: txn_id
        data_tests: [unique, not_null]
      - name: needs_review
        data_tests:
          - accepted_values:
              values: [true, false]
      - name: customer_id
        data_tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id
```

<div class="cmd-grid">
  <div class="cmd"><code>unique</code><p>No duplicate values in the column.</p></div>
  <div class="cmd"><code>not_null</code><p>The column has no nulls.</p></div>
  <div class="cmd"><code>accepted_values</code><p>Values come from an allowed list.</p></div>
  <div class="cmd"><code>relationships</code><p>Every value exists in another table (foreign key).</p></div>
</div>

<p class="note">Before dbt 1.8 the YAML key was called <code>tests</code>. Singular tests are plain SQL files in <code>tests/</code> that return the failing rows.</p>

<h2 class="section-label"><span>//</span> 07 · jinja cheat sheet</h2>

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

<h2 class="section-label"><span>//</span> 08 · project structure</h2>

```text
my_project/
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
```

<p class="note">Want to go deeper? Read the official <a href="https://docs.getdbt.com/" target="_blank" rel="noopener">dbt documentation</a> or go <a href="/data-engineering/">back to Data Engineering</a>.</p>
{% endraw %}
