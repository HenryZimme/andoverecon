# AES Website — Maintenance Guide

This document tells you everything you need to update the site. Read it once before touching anything.

---

## How the site works

The site is plain HTML and CSS — no framework, no build step, no npm. There are six pages and a shared stylesheet:

```
index.html          — homepage
fed_challenge.html  — Fed Challenge page
colloquium.html     — Research Colloquium / speaker archive
journal.html        — Journal archive
resources.html      — Links and reading list
leadership.html     — Board bios (renders from board.json)
board.json          — board data source (incoming, current, past arrays)
style.css           — all visual styles, edit this for design changes
nav.js              — auto-injects the navigation bar and footer into every page
pdfs/             — put journal PDFs and other documents here
```

To make any change: edit the relevant `.html` file, commit, and push to GitHub. GitHub Pages serves the site automatically.

---

## Common updates

### Add a new journal issue

1. Put the PDF in `pdfs/` (e.g., `aer-spring-2026.pdf`).
2. Open `journal.html`.
3. Find the archive section (look for the comment `<!-- Issue archive -->`).
4. Copy one of the existing `<div class="card">` blocks and update the text.
5. Change the PDF link in the button: `href="pdfs/aer-spring-2026.pdf"`.

### Add a colloquium speaker

1. Open `colloquium.html`.
2. Find the `<ul class="event-list">` block.
3. Copy one `<li class="event-item">` and update the date, speaker name, affiliation, and description.
4. Use `<span class="event-tag tag-speaker">` for speakers and `<span class="event-tag tag-meeting">` for internal events.

### Update the board

1. Open `board.json`.
2. Update the `incoming` array for the next year's board, and the `current` array for the present board.
3. Each entry supports `name`, `role`, `year`, `bio`, `photo`, and `url` fields.
4. To add a photo, place a headshot (square crop, at least 200×200px, saved as `.webp`) in `photos/`.
5. Set `"photo": "/photos/firstinitiallastname_pfp.webp"` in the relevant `board.json` entry.

### Update Fed Challenge info

1. Open `fed_challenge.html`.
2. Update the card in the right column with the current year's theme and deadline.
3. At the end of the year, add a row to the "past entries" section with a link to the published piece.

### Add a resources link

1. Open `resources.html`.
2. Find the appropriate section and copy a `<div class="card">` block.
3. Update the title, description, and `href` in the link.

---

## Using Claude to make updates

The site is designed to be updated with AI assistance. Here's how:

1. Open the file you want to change (e.g., `colloquium.html`) in a text editor.
2. Go to claude.ai and paste the full file content.
3. Describe what you want: "Add a new colloquium speaker entry for [Name] from [Org] who spoke on [Date] about [Topic]."
4. Paste Claude's output back into the file, replacing the old content.
5. Commit and push.

You can also ask Claude to: rewrite a section, add a new page (follow the structure of an existing page), change the color scheme (edit the CSS variables at the top of `style.css`), or debug a layout issue.

---

## Deploying to GitHub Pages

If this is your first time setting up:

1. Create a GitHub account and a new repository named `aes-site` (or any name).
2. Upload all files from this folder.
3. Go to Settings → Pages → set Source to "main branch / root".
4. GitHub will give you a URL like `https://yourusername.github.io/aes-site/`.

With a custom domain via Cloudflare:

1. Buy a domain (e.g., `andovereconsociety.org`) from Namecheap (~$15/year).
2. Add the domain to Cloudflare (free plan).
3. In Cloudflare DNS, add a CNAME record: `www` → `yourusername.github.io`.
4. In your GitHub repo Settings → Pages, enter your custom domain.
5. GitHub and Cloudflare will handle HTTPS automatically.

---

## Design decisions

**Colors:** PA Blue (`#0031A7`) is the primary color. Abbot Blue (`#44B8F3`) is used sparingly for accents. The gold (`#6C5E21`) is used for labels and rules to reference the school's secondary color. All three are defined as CSS variables at the top of `style.css` — change them there and they update everywhere.

**Fonts:** Libre Baskerville (serif, loaded from Google Fonts) stands in for Miller, Andover's official serif. Source Sans 3 stands in for Benton Sans. If you gain access to the licensed fonts, swap the `@import` line at the top of `style.css`.

**Layout:** The max content width is 1100px. Don't make it wider — it reads poorly on large monitors.

**Do not:** add JavaScript frameworks, install npm packages, or restructure the file layout. The value of this setup is that any future board member can maintain it with no technical background.

---

## Handoff checklist (for outgoing boards)

- [ ] Update `board.json` with new board members (incoming/current arrays) and remove outgoing ones from `leadership.html` references
- [ ] Archive the current Fed Challenge entry on `fed-challenge.html`
- [ ] Add the latest journal issue to `journal.html` and `assets/pdfs/`
- [ ] Update `colloquium.html` with all speakers from the current year
- [ ] Transfer GitHub repository access to the incoming Web Lead
- [ ] Transfer domain/Cloudflare account access (or document login credentials securely)
- [ ] Update the `stat-band` numbers on `index.html` (years active, issues published, etc.)
