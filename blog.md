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
    <span class="post-meta"><span class="post-date">{{ post.date | date: "%b %d, %Y" }}</span>{% if post.lang == "tr" %}<span class="post-lang">TR</span>{% endif %}{% if post.medium_url %}<span class="post-src">Medium</span>{% endif %}</span>
    <span class="post-title">{{ post.title }}</span>
    <span class="post-excerpt">{{ post.content | replace: '</h', ' </h' | replace: '</p>', ' </p>' | strip_html | strip_newlines | truncate: 140 }}</span>
    {% if post.tags.size > 0 %}<span class="post-tags">{% for tag in post.tags limit: 3 %}<span>#{{ tag }}</span>{% endfor %}</span>{% endif %}
  </a>
  {% endfor %}
</div>
