# AES Website Maintenance Guide

This document tells you everything you need to update the site. Read it once before touching anything.

---

## How the site works

The site is plain HTML and CSS: no framework, no build step, no npm. There are six pages and a shared stylesheet:

```
index.html          — homepage
fed_challenge.html  — Fed Challenge page
colloquium.html     — research Colloquium / speaker archive
journal.html        — journal archive
resources.html      — links and reading list
leadership.html     — board bios (renders from board.json)
board.json          — board data source (incoming, current, past arrays)
style.css           — all visual styles, edit this for design changes
gallery.html        — gallery page, photos from events
submit.html          — submit form for Andover Economic Review
nav.js              — auto-injects the navigation bar and footer into every page
pdfs/              — put journal PDFs and other documents here
images/             — put images here, use subfolders to organize
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

### Add a neew event with existing photos

1. Open `gallery.json`.
2. Find the appropriate section and copy an event block.
3. Update the title, description, date, photo filepaths, 
---

## Using Artificial Intelligence to make updates

I designed this site to be easily updated with AI assistance. Here's how you can do it:

1. Fully plan out the changes you want to make.
2. Go to an agentic coding tool, and either upload the file you need changed (most likely a `.html` or  `.json` file) or ask it to git clone your repo.
3. Describe what you want: "Add a new colloquium speaker entry for [Name] from [Org] who spoke on [Date] about [Topic]."
4. Paste or reupload the output back into the file, replacing the old content.
5. Commit and push.

You can also ask AI to: add a new page (follow the structure of an existing page), change the color scheme (edit the CSS variables at the top of `style.css`), or debug a layout issue. 

I do not recommend asking AI to change the content of a page; the  site is the authentic expression of the club's institutional voice, and as Web Lead, it's your job to make sure that the content is true to the club's identity and purpose.

---

## Deploying to GitHub Pages

If this is your first time setting up:

1. Create a GitHub account and a new repository named `aes-site` (or any name).
2. Upload all files from this folder.
3. Go to Settings → Pages → set Source to "main branch / root".
4. GitHub will give you a URL like `https://yourusername.github.io/aes-site/`.

With a custom domain via Cloudflare:

1. Buy a domain (e.g., `andoverecon.org`) from Cloudflare (~$15/year).
2. Add the domain to Cloudflare (free plan).
3. In Cloudflare DNS, add a CNAME record: `www` → `yourusername.github.io`.
4. In Cloudflare DNS, add the GitHub servers, type: A, nama: `domain url`
   content:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
6. In your GitHub repo Settings → Pages, enter your custom domain.
7. GitHub and Cloudflare will handle HTTPS automatically.

---

## Design decisions

**Colors:** PA Blue (`#0031A7`) is the primary color. Abbot Blue (`#44B8F3`) is used sparingly for accents. The gold (`#6C5E21`) is used for labels and rules to reference the school's secondary color. All three are defined as CSS variables at the top of `style.css` — change them there and they update everywhere.

**Fonts:** Libre Baskerville (serif, loaded from Google Fonts) stands in for Miller, Andover's official serif. Source Sans 3 stands in for Benton Sans. If you gain access to the licensed fonts, swap the `@import` line at the top of `style.css`.

**Layout:** The max content width is 1100px. Don't make it wider, it reads poorly on large monitors.

**Do not:** add JavaScript frameworks, install npm packages, or restructure the file layout. The value of this setup is that any future board member can maintain it with no technical background. 

---

## Testing

If you need to add a new feature and it's `.html` only, test them in `https://htmleditor.gitlab.io/` by pasting the code into the editor.

If a feature is broken by a change you made, you can use version history to revert files to their previous state.

## Handoff checklist (for outgoing boards)

- [ ] Update `board.json` with new board members (incoming/current arrays) and remove outgoing ones from `leadership.html` references
- [ ] Archive the current Fed Challenge entry on `fed-challenge.html` (In March, after submission)
- [ ] Add the latest journal issue to `journal.html` and `assets/pdfs/`
- [ ] Update `colloquium.html` with all speakers from the current year
- [ ] Upload photos for events that happened but aren't yet in `photos/events/event-name`
- [ ] Transfer GitHub repository access to the incoming Web Lead (~30m/wk)
- [ ] Transfer domain/Cloudflare account access (or document login credentials securely)
- [ ] Update the `stat-band` numbers on `index.html` (years active, issues published, etc.)
