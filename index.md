---
layout: page
title: Home
permalink: /
hide_title: true
terminal: 'run_pipeline --source raw_data --target insights'
published: true
---

<section class="home-section">
  <h2 class="section-label"><span>//</span> latest writing</h2>
  <div class="post-list">
    {% for post in site.posts limit:3 %}
    <a class="post-card" href="{{ site.baseurl }}{{ post.url }}">
      <span class="post-date">{{ post.date | date: "%b %d, %Y" }}</span>
      <span class="post-title">{{ post.title }}</span>
      <span class="post-excerpt">{{ post.excerpt | strip_html | truncate: 110 }}</span>
    </a>
    {% endfor %}
  </div>
</section>

<section class="home-section">
  <h2 class="section-label"><span>//</span> how data flows through my work</h2>
  <div class="stages">
    <div class="stage">
      <span class="stage-no">01</span>
      <svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3"/></svg>
      <h3>Ingest</h3>
      <p>Getting data out of source systems reliably, in batch or event-driven streams.</p>
      <p class="chips"><span>Python</span><span>Dataflow</span><span>Cloud Run</span><span>S3</span><span>Lambda</span></p>
    </div>
    <div class="stage">
      <span class="stage-no">02</span>
      <svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h11l-3-3m3 3l-3 3M20 17H9l3-3m-3 3l3 3"/></svg>
      <h3>Transform</h3>
      <p>Cleaning, modeling, and shaping it into well-tested, dimensional models.</p>
      <p class="chips"><span>SQL</span><span>dbt</span><span>PySpark</span><span>Pandas</span></p>
    </div>
    <div class="stage">
      <span class="stage-no">03</span>
      <svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="12" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8.5 6h4a3 3 0 013 3v.5M8.5 18h4a3 3 0 003-3v-.5"/></svg>
      <h3>Orchestrate</h3>
      <p>Scheduling and monitoring so pipelines run on time and fail loudly, not silently.</p>
      <p class="chips"><span>Airflow</span><span>Cloud Composer</span><span>Docker</span><span>CI/CD</span></p>
    </div>
    <div class="stage">
      <span class="stage-no">04</span>
      <svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>
      <h3>Serve</h3>
      <p>Warehouses and dashboards that turn tables into answers.</p>
      <p class="chips"><span>BigQuery</span><span>PostgreSQL</span><span>Tableau</span><span>PowerBI</span></p>
    </div>
  </div>
</section>

<section class="home-section">
  <h2 class="section-label"><span>//</span> currently exploring</h2>
  <ul class="exploring">
    <li>Event-driven pipelines with real-time processing</li>
    <li>DataOps practices that help data teams collaborate</li>
    <li>The modern data stack and the architecture patterns around it</li>
  </ul>
</section>
