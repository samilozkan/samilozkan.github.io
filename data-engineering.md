---
layout: page
title: Data Engineering
permalink: /data-engineering/
terminal: 'dbt run && airflow dags trigger aml_daily_monitoring'
published: true
---

<h2 class="section-label"><span>//</span> visual guides</h2>

<div class="guide-links">
<a class="featured-guide" href="{{ site.baseurl }}/data-engineering/dbt/" style="--accent:#FF694A">
  <span class="fg-logo" aria-hidden="true"><svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#FF694A"/><g transform="translate(10 10) scale(1.1667)" fill="#fff"><path d="M17.9004 9.3763a8.1488 8.1488 0 0 0-3.0421-3.1206l1.7708.8385a10.2874 10.2874 0 0 1 3.74 3.0007l3.234-5.9295a2.8546 2.8546 0 0 0-.0611-2.9604C22.7566.0371 21.2112-.3409 19.9754.3327l-5.8749 3.2101a4.3612 4.3612 0 0 1-4.1761 0L4.1769.408a2.8545 2.8545 0 0 0-2.9592.0632c-1.1673.7853-1.5452 2.33-.8723 3.5655L3.55 9.9106a4.3612 4.3612 0 0 1 0 4.1772l-3.1272 5.743a2.86 2.86 0 0 0 .085 2.9974c.794 1.1438 2.3225 1.5054 3.5448.8385l6.0581-3.3049a10.2877 10.2877 0 0 1-3.0051-3.7454l-.8374-1.7708a8.148 8.148 0 0 0 3.1206 3.0421l10.5832 5.779c1.2213.666 2.7481.3055 3.5426-.8363a2.8699 2.8699 0 0 0 .0796-3.0018L17.9004 9.3763zm3.3801-7.7351c.6022 0 1.0904.4882 1.0904 1.0904s-.4882 1.0904-1.0904 1.0904-1.0904-.4882-1.0904-1.0904.4882-1.0904 1.0904-1.0904zM2.7442 3.822c-.6022 0-1.0904-.4882-1.0904-1.0904s.4882-1.0904 1.0904-1.0904 1.0904.4882 1.0904 1.0904S3.3464 3.822 2.7442 3.822zm0 18.5363c-.6022 0-1.0904-.4882-1.0904-1.0904 0-.6022.4882-1.0904 1.0904-1.0904s1.0904.4882 1.0904 1.0904c0 .6022-.4882 1.0904-1.0904 1.0904zm10.3585-11.4489c-1.2008-.0035-2.177.9672-2.1805 2.1679a2.1738 2.1738 0 0 0 .7052 1.6091c-1.4872-.2091-2.5234-1.5843-2.3142-3.0716.2091-1.4872 1.5843-2.5234 3.0716-2.3142a2.7194 2.7194 0 0 1 2.3142 2.3142 2.1623 2.1623 0 0 0-1.5963-.7054zm8.1778 11.4489c-.6022 0-1.0904-.4882-1.0904-1.0904 0-.6022.4882-1.0904 1.0904-1.0904s1.0904.4882 1.0904 1.0904c0 .6022-.4882 1.0904-1.0904 1.0904z"/></g></svg></span>
  <span class="fg-body">
    <span class="stage-no">visual guide · animated</span>
    <span class="fg-title">dbt Cheat Sheet</span>
    <span class="fg-desc">Lineage, commands, selectors, materializations, tests and Jinja, all on one illustrated page.</span>
  </span>
  <span class="fg-arrow" aria-hidden="true">→</span>
</a>
<a class="featured-guide" href="{{ site.baseurl }}/data-engineering/airflow/" style="--accent:#017CEE">
  <span class="fg-logo" aria-hidden="true"><svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#017CEE"/><g transform="translate(10 10) scale(1.1667)" fill="#fff"><path d="M17.195 16.822l4.002-4.102C23.55 10.308 23.934 5.154 24 .43a.396.396 0 0 0-.246-.373.392.392 0 0 0-.437.09l-6.495 6.658-4.102-4.003C10.309.45 5.154.066.43 0H.423a.397.397 0 0 0-.277.683l6.658 6.494-4.003 4.103C.45 13.692.065 18.846 0 23.57a.398.398 0 0 0 .683.282l6.494-6.657 3.934 3.837.17.165c2.41 2.353 7.565 2.737 12.288 2.803h.006a.397.397 0 0 0 .277-.683l-6.657-6.495zm-.409-9.476c.04.115.05.24.031.344-.17.96-1.593 2.538-4.304 3.87a.597.597 0 0 0-.08-.079c1.432-3.155 1.828-5.61 1.175-7.322l3.058 2.984.12.203zm-.131 9.44a.73.73 0 0 1-.347.031c-.96-.171-2.537-1.594-3.87-4.307a.656.656 0 0 0 .08-.078l-.001.001c3.155 1.432 5.61 1.83 7.324 1.174l-2.969 3.043M23.568.392a.05.05 0 0 1 .052-.011c.018.006.03.024.029.043-.065 4.655-.437 9.726-2.703 12.05-1.53 1.565-4.326 1.419-8.283-.377.006-.037.021-.07.02-.108 0-.044-.017-.082-.026-.123 2.83-1.39 4.315-3.037 4.506-4.115.057-.322-.009-.542-.102-.688l6.507-6.67V.392zM.393.43A.045.045 0 0 1 .382.38C.39.36.403.343.425.35c4.655.065 9.727.438 12.05 2.703l.002.002c1.56 1.527 1.415 4.323-.379 8.28-.033-.005-.062-.02-.097-.02h-.008c-.045.001-.084.019-.126.027-1.39-2.83-3.037-4.314-4.115-4.506-.323-.057-.542.01-.688.103L.393.43zm11.94 11.563a.331.331 0 0 1-.327.335H12a.332.332 0 0 1-.004-.661c.172.016.333.144.335.326h.002zm-5.12 4.661a.722.722 0 0 1-.03-.345c.17-.96 1.595-2.54 4.309-3.873.013.016.019.035.033.05.013.012.03.017.044.028-1.434 3.158-1.83 5.613-1.177 7.326l-3.041-2.967m-.006-9.659a.735.735 0 0 1 .345-.031c.961.17 2.54 1.594 3.871 4.306a.597.597 0 0 0-.079.08c-2.167-.983-4.007-1.484-5.498-1.484-.68 0-1.289.103-1.825.308L7.128 7.35M.43 23.607c-.018.018-.038.015-.052.01-.019-.007-.028-.021-.028-.043.065-4.654.437-9.725 2.703-12.049 1.527-1.565 4.325-1.419 8.286.378-.006.035-.02.067-.02.104 0 .043.018.083.026.124-2.831 1.391-4.317 3.04-4.51 4.117-.057.322.01.542.103.688L.43 23.607zm23.144.042c-4.655-.065-9.726-.437-12.05-2.703l-.005-.006c-1.56-1.526-1.412-4.322.383-8.279.033.005.064.02.098.02h.009c.043 0 .08-.018.122-.027 1.39 2.832 3.036 4.317 4.115 4.51.083.014.16.021.23.021a.776.776 0 0 0 .45-.133l6.68 6.516c.02.02.016.04.01.052a.042.042 0 0 1-.042.029z"/></g></svg></span>
  <span class="fg-body">
    <span class="stage-no">visual guide · animated</span>
    <span class="fg-title">Airflow Cheat Sheet</span>
    <span class="fg-desc">Build a daily AML monitoring DAG and watch the tasks run. Schedules, concepts and best practices.</span>
  </span>
  <span class="fg-arrow" aria-hidden="true">→</span>
</a>
<a class="featured-guide" href="{{ site.baseurl }}/data-engineering/spark/" style="--accent:#E25A1C">
  <span class="fg-logo" aria-hidden="true"><svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#E25A1C"/><g transform="translate(10 10) scale(1.1667)" fill="#fff"><path d="M10.812 0c-.425.013-.845.215-1.196.605a3.593 3.593 0 00-.493.722c-.355.667-.425 1.415-.556 2.143a551.9 551.9 0 00-.726 4.087c-.027.16-.096.227-.244.273C5.83 8.386 4.06 8.94 2.3 9.514c-.387.125-.773.289-1.114.506-1.042.665-1.196 1.753-.415 2.71.346.422.79.715 1.284.936 1.1.49 2.202.976 3.3 1.47.019.01.036.013.053.019h-.004l1.306.535c0 .023.002.045 0 .073-.2 2.03-.39 4.063-.58 6.095-.04.419-.012.831.134 1.23.317.87 1.065 1.148 1.881.701.372-.204.666-.497.937-.818 1.372-1.623 2.746-3.244 4.113-4.872.111-.133.205-.15.363-.098.349.117.697.231 1.045.347h.001c.02.012.045.02.073.03l.142.042c1.248.416 2.68.775 3.929 1.19.4.132.622.164 1.045.098.311-.048.592-.062.828-.236.602-.33.995-.957.988-1.682-.005-.427-.154-.813-.35-1.186-.82-1.556-1.637-3.113-2.461-4.666-.078-.148-.076-.243.037-.375 1.381-1.615 2.756-3.236 4.133-4.855.272-.32.513-.658.653-1.058.308-.878-.09-1.57-1-1.741a2.783 2.783 0 00-1.235.069c-1.974.521-3.947 1.041-5.918 1.57-.175.047-.26.015-.355-.144a353.08 353.08 0 00-2.421-4.018 4.61 4.61 0 00-.652-.849c-.371-.37-.802-.549-1.227-.536zm.172 3.703a.592.592 0 01.189.211c.87 1.446 1.742 2.89 2.609 4.338.07.118.135.16.277.121 1.525-.41 3.052-.813 4.579-1.217.367-.098.735-.193 1.103-.289a.399.399 0 01-.1.2c-1.259 1.48-2.516 2.962-3.779 4.438-.11.13-.12.22-.04.37.937 1.803 1.768 3.309 2.498 4.76l-3.696-1.019c-.538-.18-1.077-.358-1.615-.539-.163-.055-.25-.03-.36.1-1.248 1.488-2.504 2.97-3.759 4.454a.398.398 0 01-.18.132c.035-.378.068-.757.104-1.136.149-1.572.297-3.144.451-4.716-.03-.318.117-.405-.322-.545-1.493-.593-3.346-1.321-4.816-1.905a.595.595 0 01.24-.134c1.797-.57 3.595-1.14 5.394-1.705.127-.04.199-.092.211-.233.013-.148.05-.294.076-.441.241-1.363.483-2.726.726-4.088.068-.386.14-.771.21-1.157z"/></g></svg></span>
  <span class="fg-body">
    <span class="stage-no">visual guide · animated</span>
    <span class="fg-title">Spark Cheat Sheet</span>
    <span class="fg-desc">PySpark transaction-monitoring rules that type themselves and show the result. Lazy evaluation and performance tips.</span>
  </span>
  <span class="fg-arrow" aria-hidden="true">→</span>
</a>
<a class="featured-guide" href="{{ site.baseurl }}/data-engineering/python/" style="--accent:#3776AB">
  <span class="fg-logo" aria-hidden="true"><svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#3776AB"/><g transform="translate(10 10) scale(1.1667)" fill="#fff"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></g></svg></span>
  <span class="fg-body">
    <span class="stage-no">visual guide · animated</span>
    <span class="fg-title">Python Cheat Sheet</span>
    <span class="fg-desc">Spot structuring with pandas, add retries to screening calls, and build good production habits.</span>
  </span>
  <span class="fg-arrow" aria-hidden="true">→</span>
</a>
<a class="featured-guide" href="{{ site.baseurl }}/data-engineering/kimball/" style="--accent:#2f9e63">
  <span class="fg-logo" aria-hidden="true"><svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#2f9e63"/><g fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 24L24 11M24 24L37 24M24 24L24 37M24 24L11 24"/></g><circle cx="24" cy="24" r="5.5" fill="#fff"/><g fill="#fff"><circle cx="24" cy="10" r="3.2"/><circle cx="38" cy="24" r="3.2"/><circle cx="24" cy="38" r="3.2"/><circle cx="10" cy="24" r="3.2"/></g></svg></span>
  <span class="fg-body">
    <span class="stage-no">visual guide · animated</span>
    <span class="fg-title">Kimball Cheat Sheet</span>
    <span class="fg-desc">Star schema for transaction data, the 4-step design process, SCD Type 2 and star-join queries.</span>
  </span>
  <span class="fg-arrow" aria-hidden="true">→</span>
</a>
</div>

<h2 class="section-label"><span>//</span> official documentation</h2>

Docs I rely on every day.

<div class="stages">
  <a class="stage" href="https://docs.getdbt.com/" target="_blank" rel="noopener">
    <span class="stage-no">dbt</span>
    <h3>dbt Documentation</h3>
    <p>SQL-based transformations, testing, and documentation for the warehouse.</p>
  </a>
  <a class="stage" href="https://airflow.apache.org/docs/" target="_blank" rel="noopener">
    <span class="stage-no">Airflow</span>
    <h3>Airflow Documentation</h3>
    <p>Authoring, scheduling, and monitoring workflows as code.</p>
  </a>
  <a class="stage" href="https://spark.apache.org/docs/latest/" target="_blank" rel="noopener">
    <span class="stage-no">Spark</span>
    <h3>Spark Documentation</h3>
    <p>Large-scale data processing with Spark SQL, DataFrames, and PySpark.</p>
  </a>
  <a class="stage" href="https://docs.python.org/3/" target="_blank" rel="noopener">
    <span class="stage-no">Python</span>
    <h3>Python Documentation</h3>
    <p>The language reference, standard library, and tutorials.</p>
  </a>
  <a class="stage" href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/" target="_blank" rel="noopener">
    <span class="stage-no">Kimball</span>
    <h3>Kimball Dimensional Modeling</h3>
    <p>Dimensional modeling techniques for designing star-schema data warehouses.</p>
  </a>
</div>
