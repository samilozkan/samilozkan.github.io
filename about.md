---
layout: page
title: About
permalink: /about/
terminal: 'whoami  # data & analytics engineer'
hide_title: true
published: true
---

<div class="about-head">
  <img class="about-avatar" src="{{ site.baseurl }}/images/logo.png" alt="Şamil Özkan" width="72" height="72">
  <div>
    <h1>Şamil Özkan</h1>
    <p class="about-role">Data &amp; Analytics Engineer</p>
  </div>
</div>

<p class="about-lead">I turn raw data into reliable, decision-ready insights by designing scalable ETL/ELT pipelines, data warehouses, and cloud-based analytics platforms that teams can trust.</p>

<h2 class="section-label"><span>//</span> profile</h2>

<div class="demo" data-lang="yaml">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">terminal · cat profile.yaml</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>name: Şamil Özkan
role: Data & Analytics Engineer
builds:
  - ETL/ELT pipelines
  - data warehouses
  - cloud analytics platforms
focus:
  - pipeline development with Airflow
  - dimensional modeling with dbt
  - data quality and monitoring
  - performance optimization
clouds: [GCP, AWS]
</code></pre>
</div>

<h2 class="section-label"><span>//</span> toolbox</h2>

<div class="demo" data-lang="sql">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">bigquery · skills.sql</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>SELECT category, tools
FROM about.toolbox
ORDER BY category;
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">7 rows</span>
    <div class="table-wrap"><table>
      <thead><tr><th>category</th><th>tools</th></tr></thead>
      <tbody>
        <tr><td>cloud</td><td>GCP, AWS</td></tr>
        <tr><td>databases</td><td>BigQuery, PostgreSQL, MongoDB, Impala</td></tr>
        <tr><td>delivery</td><td>Docker, Git, CI/CD</td></tr>
        <tr><td>languages</td><td>Python, SQL, Bash, R</td></tr>
        <tr><td>orchestration</td><td>Airflow, Cloud Composer, dbt</td></tr>
        <tr><td>processing</td><td>Spark, PySpark, Pandas, Hadoop</td></tr>
        <tr><td>visualization</td><td>Tableau, PowerBI</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<h2 class="section-label"><span>//</span> certifications</h2>

<div class="demo" data-lang="shell">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">terminal</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>ls -1 certifications/
</code></pre>
  <div class="demo-out">
    <pre class="log"><span class="ln ok" style="--i:0">Python 3 Programming ............. University of Michigan</span>
<span class="ln ok" style="--i:1">AWS Fundamentals: Cloud-Native ... Amazon Web Services</span>
<span class="ln ok" style="--i:2">Google Analytics Certificate ..... Google</span>
<span class="ln ok" style="--i:3">Data Science Professional ........ IBM</span></pre>
  </div>
</div>

<h2 class="section-label"><span>//</span> writing</h2>

<div class="demo" data-lang="shell">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">terminal</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>git log --oneline -4 blog/
</code></pre>
  <div class="demo-out">
    <pre class="log">{% for post in site.posts limit:4 %}<a class="ln" style="--i:{{ forloop.index0 }}" href="{{ post.url }}"><span class="hash">{{ post.date | date: "%b %Y" }}</span> {{ post.title }}</a>
{% endfor %}</pre>
  </div>
</div>

<div class="about-cta">
  <a href="{{ site.baseurl }}/blog">Read the blog →</a>
  <a href="{{ site.baseurl }}/data-engineering">Explore Data etc. →</a>
</div>
