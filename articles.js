/* articles.js — shared render logic for articles.json (journal.html) */
(function (global) {
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function authorNames(article) {
    return (article.authors || []).map(function (a) { return a.name; }).join(', ');
  }

  // Every published article has its own page at article.page_path — link there.
  function renderArticleItem(article) {
    return (
      '<li class="event-item">' +
      '<div class="event-date" style="font-size:0.8rem; padding-top:0.3rem; color: var(--muted);">' +
      escapeHtml(authorNames(article)) + '</div>' +
      '<div class="event-body">' +
      '<h3><a href="' + article.page_path + '">' + escapeHtml(article.title) + '</a></h3>' +
      '<p>' + escapeHtml(article.abstract) + '</p>' +
      '</div></li>'
    );
  }

  function renderStats(issue) {
    if (!issue.stats) return '';
    var s = issue.stats;
    var boxes = [];
    if (s.submissions_received != null) boxes.push({ v: s.submissions_received, l: 'Submissions received' });
    if (s.articles_accepted != null) boxes.push({ v: s.articles_accepted, l: 'Articles accepted' });
    if (s.acceptance_rate != null) boxes.push({ v: s.acceptance_rate, l: 'Acceptance rate' });
    if (!boxes.length) return '';
    return '<div class="stats-grid">' + boxes.map(function (b) {
      return '<div class="stat-box"><span class="stat-value">' + escapeHtml(b.v) +
        '</span><span class="stat-label">' + escapeHtml(b.l) + '</span></div>';
    }).join('') + '</div>';
  }

  // Renders every issue (newest first, by date) with its article list into the given container id.
  function renderArticleList(data, rootId) {
    var root = document.getElementById(rootId);
    if (!root) return;

    var issues = (data.issues || []).slice().sort(function (a, b) {
      return (b.date || '9999') > (a.date || '9999') ? 1 : -1;
    });

    root.innerHTML = issues.map(function (issue) {
      var articles = (data.articles || []).filter(function (a) { return a.issue_id === issue.id; });

      var editorialNote = issue.editorial_note
        ? '<p class="prose mt-2" style="color:var(--muted);">' + escapeHtml(issue.editorial_note) + '</p>'
        : '';

      var body;
      if (!articles.length) {
        body = '';
      } else {
        body = '<ul class="event-list mt-4">' + articles.map(renderArticleItem).join('') + '</ul>';
      }

      var issueDoi = issue.doi
        ? ' · <a href="https://doi.org/' + escapeHtml(issue.doi) + '" class="doi-badge">DOI</a>'
        : '';

      var pdfLink = issue.pdf
        ? '<p class="mt-2"><a href="' + escapeHtml(issue.pdf) + '" class="btn btn-ghost" target="_blank">Read the issue (PDF) ↗</a></p>'
        : '';

      return (
        '<section class="mt-6">' +
        '<p class="section-label">' + escapeHtml(issue.season + ' ' + issue.year) +
        (articles.length ? '' : ' · in review') + issueDoi + '</p>' +
        '<h2 class="section-title">' + escapeHtml(issue.season + ' ' + issue.year) + ' Issue</h2>' +
        editorialNote +
        renderStats(issue) +
        pdfLink +
        body +
        '</section>'
      );
    }).join('<hr class="rule">');
  }

  global.AERArticles = { renderArticleList: renderArticleList, escapeHtml: escapeHtml };
})(window);
