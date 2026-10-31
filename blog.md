---
layout: page
title: Blog
permalink: /blog/
terminal: 'git commit -m "write down what you learn"'
published: true
---

<div class="post-list">
  {% for post in site.posts %}
  <a class="post-card" href="{{ site.baseurl }}{{ post.url }}">
    <span class="post-date">{{ post.date | date: "%b %d, %Y" }}</span>
    <span class="post-title">{{ post.title }}</span>
    <span class="post-excerpt">{{ post.excerpt | strip_html | truncate: 110 }}</span>
  </a>
  {% endfor %}
</div>
