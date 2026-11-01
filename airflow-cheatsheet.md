---
layout: page
title: Airflow Cheat Sheet
permalink: /data-engineering/airflow/
terminal: 'airflow dags trigger aml_daily_monitoring'
published: true
---

{% raw %}
<p class="books-intro">A visual quick reference for <strong>Apache Airflow</strong>: write a DAG, watch it run, and keep the patterns that make pipelines reliable.</p>

<h2 class="section-label"><span>//</span> 01 · write a dag, watch it run</h2>
<p>A DAG is Python code that describes tasks and the order they run in. This one is a daily transaction-monitoring pipeline: pull transactions, screen them against a sanctions list, then raise alerts. With the TaskFlow API, passing a return value to the next task also draws the dependency.</p>

<div class="demo" data-lang="python">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">dags/aml_daily_monitoring.py</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>from datetime import datetime
from airflow.decorators import dag, task

@dag(
    schedule="@daily",
    start_date=datetime(2025, 1, 1),
    catchup=False,
    default_args={"retries": 2},
)
def aml_daily_monitoring():

    @task
    def extract_transactions():
        return [{"txn_id": "T-1", "amount": 9800, "country": "DE"},
                {"txn_id": "T-2", "amount": 48500, "country": "IR"}]

    @task
    def screen(txns):
        high_risk = {"IR", "KP", "SY"}
        return [t for t in txns
                if t["country"] in high_risk or t["amount"] >= 10000]

    @task
    def raise_alerts(flagged):
        for t in flagged:
            print(f"ALERT {t['txn_id']}: manual review required")

    raise_alerts(screen(extract_transactions()))

aml_daily_monitoring()
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">dag run · aml_daily_monitoring</span>
    <div class="run-tasks">
      <span class="task" style="--i:0">extract_transactions</span><span class="sep">→</span>
      <span class="task" style="--i:1">screen</span><span class="sep">→</span>
      <span class="task" style="--i:2">raise_alerts</span>
    </div>
<pre class="log"><span class="ln" style="--i:0">[extract_transactions] returned 2 transactions</span>
<span class="ln" style="--i:1">[screen]               1 flagged (high-risk country, 48,500)</span>
<span class="ln warn" style="--i:2">[raise_alerts]         ALERT T-2: manual review required</span>
<span class="ln ok" style="--i:3">DAG run state: success</span></pre>
  </div>
</div>

<p class="note">In Airflow 3 import <code>dag</code> and <code>task</code> from <code>airflow.sdk</code>. Airflow 2 uses <code>airflow.decorators</code> as shown above.</p>

<h2 class="section-label"><span>//</span> 02 · schedules</h2>
<div class="cmd-grid">
  <div class="cmd"><code>@hourly</code><p>Top of every hour.</p></div>
  <div class="cmd hot"><code>@daily</code><p>Every day at midnight UTC.</p></div>
  <div class="cmd"><code>@weekly</code><p>Sunday at midnight.</p></div>
  <div class="cmd"><code>0 6 * * 1-5</code><p>Cron: weekdays at 06:00.</p></div>
  <div class="cmd"><code>*/15 * * * *</code><p>Cron: every 15 minutes.</p></div>
  <div class="cmd"><code>None</code><p>Manual runs only (or triggered by another DAG).</p></div>
</div>

<h2 class="section-label"><span>//</span> 03 · core concepts</h2>
<div class="cmd-grid">
  <div class="cmd"><code>DAG</code><p>The workflow: tasks plus dependencies, no cycles.</p></div>
  <div class="cmd"><code>Task</code><p>One unit of work, such as a function or an operator call.</p></div>
  <div class="cmd"><code>Operator</code><p>A template for a task: Bash, Python, SQL, cloud services.</p></div>
  <div class="cmd"><code>Sensor</code><p>Waits for something, like a file or a partition, to appear.</p></div>
  <div class="cmd"><code>XCom</code><p>Small values passed between tasks. Not for big data.</p></div>
  <div class="cmd"><code>Connection</code><p>Stored credentials for external systems. Never hard-code secrets.</p></div>
</div>

<h2 class="section-label"><span>//</span> 04 · commands</h2>
<div class="cmd-grid">
  <div class="cmd"><code>airflow dags list</code><p>See every DAG Airflow can parse.</p></div>
  <div class="cmd"><code>airflow dags test aml_daily_monitoring 2025-01-01</code><p>Run a DAG once locally for a date.</p></div>
  <div class="cmd"><code>airflow tasks test aml_daily_monitoring screen 2025-01-01</code><p>Run a single task without recording state.</p></div>
  <div class="cmd hot"><code>airflow dags trigger aml_daily_monitoring</code><p>Start a manual run.</p></div>
</div>

<h2 class="section-label"><span>//</span> 05 · best practices</h2>
<div class="cmd-grid">
  <div class="cmd hot"><code>Idempotent tasks</code><p>Re-running a task for the same date gives the same result.</p></div>
  <div class="cmd"><code>Light top-level code</code><p>The scheduler parses DAG files constantly. No API calls at import time.</p></div>
  <div class="cmd"><code>Retries + alerts</code><p>Set <code>retries</code> and a failure callback so errors reach you.</p></div>
  <div class="cmd"><code>Keep data out of XCom</code><p>Pass paths or IDs, store the data in object storage or the warehouse.</p></div>
  <div class="cmd"><code>catchup=False</code><p>Unless you want a backfill of every missed interval.</p></div>
  <div class="cmd"><code>Let dbt/Spark do the heavy work</code><p>Airflow orchestrates. It should not process large data itself.</p></div>
</div>

<p class="note">Read the official <a href="https://airflow.apache.org/docs/" target="_blank" rel="noopener">Airflow documentation</a> or go <a href="/data-engineering/">back to Data Engineering</a>.</p>
{% endraw %}
