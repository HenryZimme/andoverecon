# AES Website Maintenance Guide

This document tells you everything you need to update the site. Read it once before touching anything.

---

## How the site works

The site is plain HTML and CSS: no framework, no build step, no npm. All pages share a stylesheet and a script:

```
index.html          — homepage
fed_challenge.html  — Fed Challenge page
colloquium.html     — research Colloquium / speaker archive
journal.html        — journal archive
resources.html      — links and reading list
leadership.html     — board bios (renders from board.json)
gallery.html        — event photo gallery (renders from gallery.json)
submit.html         — submission form for the Andover Economics Review
lab.html            — AES Decision Lab (behavioral economics experiment)
board.json          — board data source (incoming, current, past arrays)
gallery.json        — gallery data source (event list with photos)
style.css           — all visual styles; edit this for design changes
nav.js              — injects the nav bar, footer, skip link, and date logic on every page
pdfs/               — journal PDFs and other documents
photos/             — images; use subfolders to organize (e.g. photos/events/event-name/)
```

To make any change: edit the relevant file, commit, and push to GitHub. GitHub Pages serves the site automatically.

---

## Common updates

### Add a new journal issue

1. Put the PDF in `pdfs/` (e.g., `aer-spring-2027.pdf`).
2. Open `journal.html`.
3. Find the archive section (look for the comment `<!-- Issue archive -->`).
4. Copy one of the existing `<div class="card">` blocks and update the text.
5. Change the PDF link in the button: `href="pdfs/aer-spring-2027.pdf"`.

### Add a colloquium speaker

1. Open `colloquium.html`.
2. Find the `<ul class="event-list">` block.
3. Copy one `<li class="event-item">` and update the date, speaker name, affiliation, and description.
4. Use `<span class="event-tag tag-speaker">` for speakers and `<span class="event-tag tag-meeting">` for internal events.

### Update the board

1. Open `board.json`.
2. Move the current board's entry to the `past` array.
3. Update the `current` array for the new board.
4. If co-presidents are announced before the full board transitions, populate the `incoming` array — it renders a separate "Incoming" section on the leadership page.
5. Each entry supports `name`, `role`, `year`, `bio`, `photo`, and `url` fields.
6. To add a photo, place a square-cropped headshot (at least 200×200 px, saved as `.webp`) in `photos/`. Compress it to under 50 KB before committing. Set `"photo": "/photos/firstinitiallastname_pfp.webp"` in the board entry.
7. All rendering happens automatically — do not edit `leadership.html` directly to add or remove members.

### Announce an upcoming event (homepage banner)

1. Open `index.html`.
2. Find the `<div class="event-banner" ...>` block near the top.
3. Update the banner text and the `data-expires="YYYY-MM-DD"` attribute to the event date.
4. The banner hides itself automatically after that date. No manual cleanup needed.
5. To hide the banner immediately (e.g. event cancelled), set `data-expires` to yesterday's date or add `hidden` to the div.

### Update Fed Challenge info

1. Open `fed_challenge.html`.
2. Update the card in the right column with the current year's theme and deadline.
3. At the end of the year, add a row to the "past entries" section with a link to the published piece.

### Add a resources link

1. Open `resources.html`.
2. Find the appropriate section and copy a `<div class="card">` block.
3. Update the title, description, and `href` in the link.

### Add a gallery event

1. Open `gallery.json`.
2. Add a new object to the `events` array following the structure of existing entries.
3. Required fields: `id`, `title`, `date`, `category`, `description`, `cover`, `photos`.
4. Place photos in `photos/events/your-event-id/` and reference them by path.
5. `gallery_future.json` contains events with real data not yet merged into `gallery.json`. Merge them when photos are available, then delete `gallery_future.json`.

---

## How nav.js works

`nav.js` is loaded on every page and does five things:

**1. Injects the nav and footer.** The navigation has five items: Fed Challenge, Colloquium, Journal, Lab, Leadership. The AES logo links home. Home, Resources, Gallery, and Submit appear in the footer only.

**2. Marks the active page.** The current page's nav link gets an `active` class automatically.

**3. Auto-hides expired elements.** Any element with a `data-expires="YYYY-MM-DD"` attribute is hidden once that date passes. Use this for event banners, "coming soon" cards, or any time-limited content. No manual cleanup needed.

**4. Computes years active.** Any element with `data-years-since="YYYY"` is filled with the number of years since that founding year. The homepage stat updates automatically each January.

**5. Injects a skip link.** A "Skip to main content" link is added before the nav on every page for keyboard and screen reader users. It targets the first `.hero`, `.page-content`, or `#lab-root` element on the page.

---

## Using AI to make updates

The site is designed to be easily updated with AI assistance. Here's how:

1. Plan the changes you want to make.
2. Go to an agentic coding tool (Claude, Cursor, etc.) and either upload the file you need changed or ask it to `git clone` the repo.
3. Describe what you want: "Add a new colloquium speaker entry for [Name] from [Org] who spoke on [Date] about [Topic]."
4. Paste or re-upload the output back into the file, replacing the old content.
5. Commit and push.

You can also ask AI to: add a new page (follow the structure of an existing page), change the color scheme (edit the CSS variables at the top of `style.css`), or debug a layout issue.

Do not ask AI to rewrite the content of existing pages. The site is the authentic expression of the club's institutional voice. As Web Lead, it's your job to make sure the content is true to what actually happened.

---

## Deploying to GitHub Pages

If this is your first time setting up:

1. Create a GitHub account and a new repository.
2. Upload all files from this folder.
3. Go to Settings → Pages → set Source to "main branch / root."
4. GitHub will give you a URL like `https://yourusername.github.io/repo-name/`.

With a custom domain via Cloudflare:

1. Buy a domain (e.g., `andoverecon.org`) from Cloudflare (~$15/year).
2. Add the domain to Cloudflare (free plan).
3. In Cloudflare DNS, add a CNAME record: name `www`, target `yourusername.github.io`.
4. In Cloudflare DNS, add four A records: name `@` (the apex domain), pointing to:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
5. In your GitHub repo Settings → Pages, enter your custom domain.
6. GitHub and Cloudflare will handle HTTPS automatically.

---

## Design decisions

**Colors:** PA Blue (`#0031A7`) is the primary color. Abbot Blue (`#44B8F3`) is used sparingly for accents. The gold (`#6C5E21`) is used for labels and rules to reference the school's secondary color. All three are defined as CSS variables at the top of `style.css` — change them there and they update everywhere.

**Fonts:** Libre Baskerville (serif, loaded from Google Fonts) stands in for Miller, Andover's official serif. Source Sans 3 stands in for Benton Sans. If you gain access to the licensed fonts, swap the `@import` line at the top of `style.css`.

**Layout:** The max content width is 1100px. Don't make it wider — it reads poorly on large monitors.

**Do not:** add JavaScript frameworks, install npm packages, or restructure the file layout. The value of this setup is that any future board member can maintain it with no technical background.

---

## Testing

Open any `.html` file directly in a browser to preview it locally. For features that depend on `nav.js` (nav bar, footer, skip link, date logic), serve the files over a local server — run `python3 -m http.server` in the repo folder and open `http://localhost:8000`.

To revert a broken change, use GitHub's file history.

---

## Handoff checklist (for outgoing boards)

- [ ] Update `board.json`: move the current board to `past`, populate `current` with the new board, clear `incoming`
- [ ] Collect bios and photos from all new board members before the transition
- [ ] Archive the current Fed Challenge entry on `fed_challenge.html` (after submission in March)
- [ ] Add any new journal issue to `journal.html` and `pdfs/`
- [ ] Update `colloquium.html` with all speakers from the current year
- [ ] Merge `gallery_future.json` events into `gallery.json` once photos are available; delete `gallery_future.json` when done
- [ ] Upload photos for events that happened but aren't yet in `photos/events/`
- [ ] Update the "What's happening now" section on `index.html` for the new term  <!-- UPDATE EACH TERM -->
- [ ] Transfer GitHub repository access to the incoming Web Lead
- [ ] Transfer domain and Cloudflare account access (or document credentials securely)