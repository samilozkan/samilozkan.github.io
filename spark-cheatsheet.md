---
layout: page
title: Spark Cheat Sheet
permalink: /data-engineering/spark/
terminal: 'spark-submit daily_revenue.py'
published: true
---

<p class="books-intro">A visual quick reference for <strong>Apache Spark</strong> and PySpark: transform data at scale, then understand why it is fast (or slow).</p>

<h2 class="section-label"><span>//</span> 01 · dataframe: code in, result out</h2>
<p>Read, filter, group, aggregate. <code>show()</code> is the action that makes Spark actually run the plan.</p>

<div class="demo" data-lang="python">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">daily_revenue.py</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("orders").getOrCreate()

orders = spark.read.parquet("s3://lake/orders/")

daily = (
    orders
    .filter(F.col("status") == "completed")
    .groupBy("order_date")
    .agg(F.sum("amount").alias("revenue"),
         F.count("*").alias("orders"))
    .orderBy("order_date")
)

daily.show()
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">output</span>
    <div class="table-wrap"><table>
      <thead><tr><th>order_date</th><th class="num">revenue</th><th class="num">orders</th></tr></thead>
      <tbody>
        <tr><td>2026-10-28</td><td class="num">12480.50</td><td class="num">214</td></tr>
        <tr><td>2026-10-29</td><td class="num">13902.00</td><td class="num">238</td></tr>
        <tr><td>2026-10-30</td><td class="num">15110.75</td><td class="num">251</td></tr>
        <tr><td>2026-10-31</td><td class="num">11875.20</td><td class="num">197</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<h2 class="section-label"><span>//</span> 02 · spark sql and window functions</h2>
<p>The same engine, written as SQL. Register a DataFrame as a view and query it.</p>

<div class="demo" data-lang="python">
  <div class="demo-bar"><i></i><i></i><i></i><span class="demo-file">top_customers.py</span><span class="demo-status"></span><button class="demo-replay" type="button">↻ replay</button></div>
<pre class="demo-code"><code>orders.createOrReplaceTempView("orders")

spark.sql("""
    select customer_id,
           amount,
           rank() over (
               partition by customer_id
               order by amount desc
           ) as rnk
    from orders
""").filter("rnk = 1").show(3)
</code></pre>
  <div class="demo-out">
    <span class="demo-out-label">output · each customer's biggest order</span>
    <div class="table-wrap"><table>
      <thead><tr><th>customer_id</th><th class="num">amount</th><th class="num">rnk</th></tr></thead>
      <tbody>
        <tr><td>C-1001</td><td class="num">980.00</td><td class="num">1</td></tr>
        <tr><td>C-1002</td><td class="num">455.50</td><td class="num">1</td></tr>
        <tr><td>C-1003</td><td class="num">1320.25</td><td class="num">1</td></tr>
      </tbody>
    </table></div>
  </div>
</div>

<h2 class="section-label"><span>//</span> 03 · lazy: transformations vs actions</h2>
<p>Transformations only build a plan. Nothing runs until you call an action.</p>
<div class="cmd-grid">
  <div class="cmd"><code>filter · select · groupBy · join</code><p><strong>Transformations.</strong> Lazy. They return a new DataFrame instantly.</p></div>
  <div class="cmd hot"><code>show · count · collect · write</code><p><strong>Actions.</strong> They trigger the real work on the cluster.</p></div>
  <div class="cmd"><code>narrow</code><p>Each output partition needs one input partition (<code>filter</code>, <code>select</code>). Cheap.</p></div>
  <div class="cmd"><code>wide</code><p>Data moves across the network (<code>groupBy</code>, <code>join</code>). This is a shuffle. Expensive.</p></div>
</div>

<h2 class="section-label"><span>//</span> 04 · performance cheat sheet</h2>
<div class="cmd-grid">
  <div class="cmd hot"><code>Use Parquet or Delta</code><p>Columnar formats let Spark read only the columns it needs.</p></div>
  <div class="cmd"><code>Filter early</code><p>Push filters before joins so fewer rows are shuffled.</p></div>
  <div class="cmd"><code>broadcast(small_df)</code><p>Ship a small table to every executor and skip the shuffle.</p></div>
  <div class="cmd"><code>cache()</code><p>Keep a reused DataFrame in memory. Remember to <code>unpersist()</code>.</p></div>
  <div class="cmd"><code>Avoid collect()</code><p>It pulls all data to the driver and can crash it. Use <code>limit()</code> or write out.</p></div>
  <div class="cmd"><code>explain()</code><p>Read the physical plan before guessing at what is slow.</p></div>
</div>

<p class="note">Read the official <a href="https://spark.apache.org/docs/latest/" target="_blank" rel="noopener">Spark documentation</a> or go <a href="/data-engineering/">back to Data Engineering</a>.</p>
