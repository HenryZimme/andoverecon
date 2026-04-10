/* nav.js — injects shared nav and footer, marks active page */
(function () {
  const pages = [
    { href: 'index.html',         label: 'Home' },
    { href: 'fed_challenge.html', label: 'Fed Challenge' },
    { href: 'colloquium.html',    label: 'Colloquium' },
    { href: 'journal.html',       label: 'Journal' },
    { href: 'lab.html',           label: 'Lab' },
    { href: 'resources.html',     label: 'Resources' },
    { href: 'leadership.html',    label: 'Leadership' },
  ];
  const current = (location.pathname.split('/').pop() || 'index.html');

  const linksHtml = pages.map(p =>
    `<li><a href="${p.href}" class="${current === p.href ? 'active' : ''}">${p.label}</a></li>`
  ).join('');

  document.getElementById('nav-placeholder').innerHTML = `
    <nav id="site-nav">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo"><span class="logo-full">Andover <span class="logo-accent">Economics</span> Society</span><span class="logo-short">AES</span></a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" id="nav-links">${linksHtml}</ul>
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

  // hamburger toggle
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function openMenu() {
    navLinks.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // close menu when any nav link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // close menu when clicking outside the nav
  document.addEventListener('click', function (e) {
    const nav = document.getElementById('site-nav');
    if (nav && !nav.contains(e.target)) {
      closeMenu();
    }
  });

  // close menu on esc key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // add shadow when scrolled
  const siteNav = document.getElementById('site-nav');
  window.addEventListener('scroll', function () {
    siteNav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();
