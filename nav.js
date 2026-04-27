/* nav.js — injects shared nav and footer, marks active page */
(function () {
  // ── date-awareness utilities ────────────────────────────────────────────
  // auto-hide any element with data-expires="YYYY-MM-DD" once that date passes.
  function applyExpiryDates() {
    document.querySelectorAll('[data-expires]').forEach(function (el) {
      var expires = new Date(el.getAttribute('data-expires'));
      expires.setHours(23, 59, 59, 999); // hide end-of-expiry-day
      if (new Date() > expires) {
        el.hidden = true;
      }
    });
  }

  // compute years active from a founding year and fill [data-years-since].
  function applyYearsSince() {
    document.querySelectorAll('[data-years-since]').forEach(function (el) {
      var founded = parseInt(el.getAttribute('data-years-since'), 10);
      if (!isNaN(founded)) {
        el.textContent = new Date().getFullYear() - founded;
      }
    });
  }

  // ── accessibility: skip link ────────────────────────────────────────────
  // injects "Skip to main content" before the nav on every page.
  // targets the first .hero, .page-content, or #lab-root and assigns
  // id="main-content" if the element doesn't already have one.
  function injectSkipLink() {
    var style = document.createElement('style');
    style.textContent =
      '.skip-link{position:absolute;top:-999px;left:-999px;padding:0.5rem 1.1rem;' +
      'background:var(--blue,#001f6b);color:#fff;font-size:0.875rem;font-family:inherit;' +
      'font-weight:600;z-index:10000;text-decoration:none;border-radius:0 0 4px 4px;}' +
      '.skip-link:focus{top:0;left:0;}';
    document.head.appendChild(style);

    var a = document.createElement('a');
    a.href = '#main-content';
    a.className = 'skip-link';
    a.textContent = 'Skip to main content';
    document.body.insertBefore(a, document.body.firstChild);

    var target = document.querySelector('.hero, .page-content, #lab-root');
    if (target) {
      if (!target.id) {
        target.id = 'main-content';
      } else {
        a.href = '#' + target.id;
      }
    }
  }


  // main nav: 5 items. logo covers "Home".
  const pages = [
    { href: 'fed_challenge.html', label: 'Fed Challenge' },
    { href: 'colloquium.html',    label: 'Colloquium' },
    { href: 'journal.html',       label: 'Journal' },
    { href: 'lab.html',           label: 'Lab' },
    { href: 'leadership.html',    label: 'Leadership' },
  ];

  // footer-only: utility and supplementary pages.
  const footerExtra = [
    { href: 'index.html',                         label: 'Home' },
    { href: 'resources.html',                     label: 'Resources' },
    { href: 'gallery.html',                       label: 'Gallery' },
    { href: 'submit.html',                        label: 'Submit' },
    { href: 'https://forms.gle/xZ2WGrkWvnxQBahz5', label: 'Join AES' },
  ];
  const current = (location.pathname.split('/').pop() || 'index.html');

  const linksHtml = pages.map(p =>
    `<li><a href="${p.href}" class="${current === p.href ? 'active' : ''}">${p.label}</a></li>`
  ).join('');

  document.getElementById('nav-placeholder').innerHTML = `
    <nav id="site-nav">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo"><img src="aes-icon.svg" class="logo-icon" alt="AES" width="36" height="36"><span class="logo-full">Andover <span class="logo-accent">Economics</span> Society</span></a>
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
          ${[...pages, ...footerExtra].map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
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

  // date-aware utilities (run after DOM is ready)
  applyExpiryDates();
  applyYearsSince();
  injectSkipLink();
})();