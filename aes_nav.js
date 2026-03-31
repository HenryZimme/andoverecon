/* nav.js — injects shared nav and footer, marks active page */
(function () {
  const pages = [
    { href: 'index.html',       label: 'Home' },
    { href: 'fed-challenge.html', label: 'Fed Challenge' },
    { href: 'colloquium.html',  label: 'Colloquium' },
    { href: 'journal.html',     label: 'Journal' },
    { href: 'resources.html',   label: 'Resources' },
    { href: 'board.html',       label: 'Board' },
  ];

  const current = location.pathname.split('/').pop() || 'index.html';

  const linksHtml = pages.map(p =>
    `<li><a href="${p.href}" class="${current === p.href ? 'active' : ''}">${p.label}</a></li>`
  ).join('');

  document.getElementById('nav-placeholder').innerHTML = `
    <nav>
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">Andover <span>Economics</span> Society</a>
        <button class="nav-toggle" aria-label="Toggle menu" onclick="this.nextElementSibling.classList.toggle('open')">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links">${linksHtml}</ul>
      </div>
    </nav>`;

  document.getElementById('footer-placeholder').innerHTML = `
    <footer>
      <div class="footer-inner">
        <div>
          <div class="footer-brand">Andover Economics Society</div>
          <div class="footer-sub">Phillips Academy Andover &nbsp;·&nbsp; Founded 2004</div>
        </div>
        <nav class="footer-links">
          ${pages.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
        </nav>
      </div>
      <div class="footer-bottom">
        © ${new Date().getFullYear()} Andover Economics Society. All rights reserved.
      </div>
    </footer>`;
})();
