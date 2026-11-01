---
layout: page
title: Python Cheat Sheet
permalink: /data-engineering/python/
terminal: 'python detect_structuring.py'
published: true
---

<p class="books-intro">A visual quick reference for <strong>Python for data engineering</strong>: detect suspicious patterns with pandas, make flaky calls reliable, and write code that is easy to run in production.</p>

<h2 class="section-label"><span>//</span> 01 · detect structuring with pandas</h2>
<p>Structuring (or "smurfing") means splitting a large amount into several transactions just under the reporting threshold. Here is a simple rule to catch it.</p>

<div class="demo" data-lang="python">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">detect_structuring.py</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>import pandas as pd

THRESHOLD = 10_000

df = pd.read_csv("transactions.csv", parse_dates=["txn_ts"])

near = df[df["amount"].between(0.9 * THRESHOLD, THRESHOLD - 0.01)]

suspects = (
    near.groupby("customer_id")["amount"]
        .agg(txns="count", total="sum")
        .query("txns >= 3")
        .sort_values("total", ascending=False)
        .reset_index()
)

print(suspects)
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">output · possible structuring</span>
    <div class="table-wrap"><table>
      <thead><tr><th>customer_id</th><th class="num">txns</th><th class="num">total</th></tr></thead>
      <tbody>
        <tr><td>C-1042</td><td class="num">5</td><td class="num">48,650.00</td></tr>
        <tr><td>C-5120</td><td class="num">4</td><td class="num">39,100.00</td></tr>
        <tr><td>C-7781</td><td class="num">3</td><td class="num">28,900.00</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<h2 class="section-label"><span>//</span> 02 · make flaky calls reliable</h2>
<p>A sanctions-screening API can time out. A small retry decorator keeps the pipeline from falling over on a hiccup, without silently skipping a customer.</p>

<div class="demo" data-lang="python">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">screening.py</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>import time
from functools import wraps

def retry(times=3, delay=1):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    print(f"attempt {attempt} failed: {e}")
                    time.sleep(delay)
            raise RuntimeError("screening failed, do not skip")
        return wrapper
    return decorator

@retry(times=3)
def screen_name(name):
    ...  # call the sanctions-list API
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">output</span>
<pre class="log"><span class="ln warn" style="--i:0">attempt 1 failed: 503 Service Unavailable</span>
<span class="ln warn" style="--i:1">attempt 2 failed: timeout after 10s</span>
<span class="ln ok" style="--i:2">attempt 3 succeeded: 0 sanctions matches for "Acme Trading Ltd"</span></pre>
  </div>
</div>

<h2 class="section-label"><span>//</span> 03 · habits worth having</h2>
<div class="cmd-grid">
  <div class="cmd hot"><code>Virtual environments</code><p>One <code>venv</code> or <code>uv</code> environment per project. Pin versions.</p></div>
  <div class="cmd"><code>pathlib.Path</code><p>Paths as objects, not string concatenation.</p></div>
  <div class="cmd"><code>logging, not print</code><p>Levels, timestamps and handlers for production runs.</p></div>
  <div class="cmd"><code>Type hints</code><p>Document intent and let tools catch mistakes early.</p></div>
  <div class="cmd"><code>pytest</code><p>Test transformations with tiny DataFrames before they hit real data.</p></div>
  <div class="cmd"><code>Environment variables</code><p>Secrets and config come from the environment, never from the repo.</p></div>
</div>

<p class="note">Read the official <a href="https://docs.python.org/3/" target="_blank" rel="noopener">Python documentation</a> or go <a href="/data-engineering/">back to Data Engineering</a>.</p>
