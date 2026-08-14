// scripts/generate_article_pages.js
// Reads articles.json and generates a static HTML page per article under /articles.
// Run manually after an issue is finalized: `node scripts/generate_article_pages.js`
// Also prints the <url> blocks to paste into sitemap.xml.

const fs = require('fs');
const path = require('path');

const data = require('../articles.json');
const OUT_DIR = path.join(__dirname, '..', 'articles');

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// References are plain citation strings that may contain a bare URL.
// Find it, strip any trailing sentence punctuation from the URL itself
// (citations often end "...url.txt." — the last period is punctuation,
// not part of the URL), and wrap just the URL in a link.
function linkifyReference(ref) {
  const match = ref.match(/https?:\/\/[^\s]+/);
  if (!match) return esc(ref);

  let url = match[0];
  let trailing = '';
  while (/[.,;:]$/.test(url)) {
    trailing = url.slice(-1) + trailing;
    url = url.slice(0, -1);
  }

  const idx = ref.indexOf(match[0]);
  const before = ref.slice(0, idx);
  const after = ref.slice(idx + match[0].length);

  return esc(before) +
    `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>` +
    esc(trailing + after);
}

function buildArticlePage(article, issue, journalIssn) {
  const authorNames = article.authors.map((a) => a.name).join(', ');
  const issueLabel = `${issue.season} ${issue.year}`;

  // COinS (OpenURL ContextObject in Span) — this is what Zotero/EndNote's
  // browser-extension citation managers scan the page body for directly,
  // independent of the <head> meta tags. Empty content, title attribute only.
  const coinsParams = new URLSearchParams();
  coinsParams.set('ctx_ver', 'Z39.88-2004');
  coinsParams.set('rft_val_fmt', 'info:ofi/fmt:kev:mtx:journal');
  coinsParams.set('rft.genre', 'article');
  coinsParams.set('rft.atitle', article.title);
  coinsParams.set('rft.jtitle', 'Andover Economic Review');
  coinsParams.set('rft.date', article.published_date || '');
  article.authors.forEach((a) => coinsParams.append('rft.au', a.name));
  if (article.doi) coinsParams.set('rft_id', `info:doi/${article.doi}`);
  const coinsSpan = `<span class="Z3988" title="${esc(coinsParams.toString())}"></span>`;

  const periodical = { '@type': 'Periodical', name: 'Andover Economic Review' };
  if (journalIssn) periodical.issn = journalIssn;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    name: article.title,
    author: article.authors.map((a) => ({ '@type': 'Person', name: a.name })),
    datePublished: article.published_date,
    isPartOf: {
      '@type': 'PublicationIssue',
      name: issueLabel,
      isPartOf: periodical,
    },
    abstract: article.abstract,
    keywords: (article.keywords || []).join(', '),
    url: `https://andoverecon.org${article.page_path}`,
    sameAs: article.doi ? `https://doi.org/${article.doi}` : undefined,
  };

  const keywordsHtml = (article.keywords || []).length
    ? `<h2>Keywords</h2>
    <div class="keyword-list">
${article.keywords.map((k) => `      <span class="keyword-tag">${esc(k)}</span>`).join('\n')}
    </div>`
    : '';

  const referencesHtml = (article.references || []).length
    ? `<h2>References</h2>
    <ol>
${article.references.map((r) => `      <li>${linkifyReference(r)}</li>`).join('\n')}
    </ol>`
    : '';

  const doiBadge = article.doi
    ? `<a href="https://doi.org/${article.doi}" class="doi-badge">
        <img src="https://zenodo.org/badge/DOI/${article.doi}.svg" alt="DOI">
      </a>`
    : '';

  const pdfHref = issue.pdf ? `${issue.pdf}#page=${article.pdf_page_start}` : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(article.title)} | Andover Economic Review</title>
  <meta name="description" content="${esc(article.abstract).slice(0, 155)}">
  <link rel="stylesheet" href="/style.css">
  <link rel="icon" href="/aes-favicon.ico" sizes="any">
  <link rel="icon" href="/aes-favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#001f6b">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap">

  <link rel="canonical" href="https://andoverecon.org${article.page_path}">

  <meta property="og:site_name" content="Andover Economics Society">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://andoverecon.org${article.page_path}">
  <meta property="og:title" content="${esc(article.title)}">
  <meta property="og:description" content="${esc(article.abstract).slice(0, 155)}">
  <meta property="og:image" content="https://andoverecon.org/og-default.jpg">
  <meta property="og:locale" content="en_US">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(article.title)}">
  <meta name="twitter:description" content="${esc(article.abstract).slice(0, 155)}">
  <meta name="twitter:image" content="https://andoverecon.org/og-default.jpg">

  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>

  <!-- Highwire Press citation meta tags — this is what Google Scholar actually
       crawls to index non-traditional-publisher articles. Complements the
       JSON-LD above; do not remove even though it looks redundant. -->
  <meta name="citation_title" content="${esc(article.title)}">
${article.authors.map((a) => `  <meta name="citation_author" content="${esc(a.name)}">`).join('\n')}
  <meta name="citation_publication_date" content="${esc((article.published_date || '').replace(/-/g, '/'))}">
  <meta name="citation_journal_title" content="Andover Economic Review">
  <meta name="citation_abstract_html_url" content="https://andoverecon.org${article.page_path}">
  ${pdfHref ? `<meta name="citation_pdf_url" content="https://andoverecon.org${pdfHref}">` : ''}
  ${article.keywords && article.keywords.length ? `<meta name="citation_keywords" content="${esc(article.keywords.join('; '))}">` : ''}
  ${article.doi ? `<meta name="citation_doi" content="${esc(article.doi)}">` : ''}

  <!-- Dublin Core meta tags — read by Zotero, Mendeley, and EndNote's generic
       DC translator as a fallback/complement to the Highwire tags above. -->
  <meta name="DC.title" content="${esc(article.title)}">
${article.authors.map((a) => `  <meta name="DC.creator" content="${esc(a.name)}">`).join('\n')}
  <meta name="DC.date" content="${esc(article.published_date || '')}">
  <meta name="DC.type" content="Text">
  <meta name="DC.format" content="text/html">
  <meta name="DC.language" content="en">
  <meta name="DC.description" content="${esc(article.abstract).slice(0, 300)}">
  <meta name="DC.identifier" content="${article.doi ? 'https://doi.org/' + esc(article.doi) : 'https://andoverecon.org' + article.page_path}">
  <meta name="DC.publisher" content="Andover Economic Review">
  ${article.keywords && article.keywords.length ? `<meta name="DC.subject" content="${esc(article.keywords.join('; '))}">` : ''}
</head>
<body>

<div id="nav-placeholder"></div>

<div class="sub-hero">
  <div class="sub-hero-inner">
    <p class="eyebrow">${esc(authorNames)} · ${esc(issueLabel)}</p>
    <h1>${esc(article.title)}</h1>
  </div>
</div>

<main class="page-content">
  <p class="breadcrumb"><a href="/journal.html">← Back to the Review</a></p>

  <article class="prose" id="article-body">
    ${coinsSpan}
    <h2>Abstract</h2>
    <p>${esc(article.abstract)}</p>

    ${keywordsHtml}

    ${referencesHtml}
  </article>

  <aside class="cite-widget" id="cite-widget"></aside>

  <div class="article-actions">
    ${doiBadge}
    ${pdfHref ? `<a href="${esc(pdfHref)}" class="btn btn-ghost" target="_blank">Download PDF ↗</a>` : ''}
    <a href="/journal.html" class="btn btn-ghost">← Back to the Review</a>
  </div>
</main>

<div id="footer-placeholder"></div>
<script src="/nav.js" defer></script>
<script src="/cite.js" defer></script>
</body>
</html>
`;
}

function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const sitemapEntries = [];

  for (const article of data.articles) {
    const issue = data.issues.find((i) => i.id === article.issue_id);
    if (!issue) {
      console.warn(`Skipping ${article.slug}: unknown issue_id ${article.issue_id}`);
      continue;
    }
    const html = buildArticlePage(article, issue, data.issn);
    const outPath = path.join(OUT_DIR, `${article.slug}.html`);
    fs.writeFileSync(outPath, html);
    console.log(`Generated: articles/${article.slug}.html`);

    sitemapEntries.push(
      `  <url>\n    <loc>https://andoverecon.org${article.page_path}</loc>\n` +
      `    <lastmod>${article.published_date}</lastmod>\n` +
      `    <changefreq>yearly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    );
  }

  console.log('\n--- Paste into sitemap.xml before </urlset> ---\n');
  console.log(sitemapEntries.join('\n'));
}

main();
