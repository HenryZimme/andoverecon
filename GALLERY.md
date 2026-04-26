# AES Photo Gallery | Maintainer Guide

## How it works

All gallery data lives in `gallery.json`. The gallery page reads that file and renders everything automatically, no HTML editing required for normal updates.

Photos are stored in `photos/events/`, organized by event. Each event gets its own subdirectory.

---

## Adding photos for a new event

### 1. Create the event directory

Name it `YYYY-slug`, where `YYYY` is the year and `slug` is a short descriptor:

```
photos/events/2027-finegold-may/
```

### 2. Add photos to that directory

Convert photos to `.webp` before adding them. WebP files are significantly smaller than JPEGs, which keeps the repo size manageable. You can use any of these tools:
- **Squoosh** (squoosh.app):free, browser-based, good for one-off conversions
- **Preview on Mac**: File -> Export -> select WebP
- **ImageMagick**: `magick input.jpg -quality 85 output.webp`

Naming: use `cover.webp` for the card thumbnail, then `01.webp`, `02.webp`, etc. for the rest:

```
photos/events/2027-finegold-may/
  cover.webp   ← shown on gallery grid card
  01.webp
  02.webp
  03.webp
```

The cover should be a good representative photo, ideally landscape (3:2 ratio works best). It doesn't have to be the best photo, just one that looks good as a small thumbnail.

### 3. Add the event to `gallery.json`

Open `gallery.json` and add a new object to the `"events"` array. The array is ordered chronologically (most recent first):

```json
{
  "id": "2027-finegold-may",
  "title": "Senator Barry Finegold | Policy Brief Presentations",
  "date": "2027-05-01",
  "category": "colloquium",
  "description": "AES members presented spring policy briefs to Senator Finegold.",
  "cover": "photos/events/2027-finegold-may/cover.webp",
  "photos": [
    { "src": "photos/events/2027-finegold-may/01.webp", "alt": "Student presenting policy brief" },
    { "src": "photos/events/2027-finegold-may/02.webp", "alt": "Senator Finegold with AES members" }
  ]
}
```

**Field reference:**

| Field | What it does |
|-------|-------------|
| `id` | Must match the directory name. Used internally. |
| `title` | Shown on the gallery card and in the lightbox. |
| `date` | ISO format (`YYYY-MM-DD`). Used for sorting and display. |
| `category` | One of: `colloquium`, `fed-challenge`, `general`. Controls which filter button shows it. |
| `description` | One or two sentences. Shown nowhere on the page right now, but good to have for future use. |
| `cover` | Path to the cover image. Shown on the grid card. |
| `credit` | Optional. Photographer name shown in the lightbox as "Photo: [name]". Applied to all photos in the event unless a specific photo overrides it. |
| `photos` | Array of all photos for this event. Shown in the lightbox when someone clicks the card. |

Each photo object in `photos` can also carry its own `credit` field, which overrides the event-level one for that photo:

```json
"photos": [
  { "src": "photos/events/2027-finegold-may/01.webp", "alt": "Student presenting", "credit": "Jane Doe" },
  { "src": "photos/events/2027-finegold-may/02.webp", "alt": "Senator Finegold with AES members" }
]
```

In this example, photo 1 credits Jane Doe; photo 2 falls back to the event-level `credit` if one is set, or shows nothing if not.

### 4. Commit and push

```bash
git add photos/events/2027-finegold-may gallery.json
git commit -m "add: finegold policy brief session photos"
git push
```

GitHub Pages rebuilds automatically. The gallery is live within a minute or two.

---

## Adding photos to an existing event

Open `gallery.json`, find the event by `id`, and add entries to its `"photos"` array:

```json
"photos": [
  { "src": "photos/events/2025-mikula-oct/01.webp", "alt": "Andrew Mikula presenting" },
  { "src": "photos/events/2025-mikula-oct/02.webp", "alt": "Q&A with AES members" }
]
```

Drop the `.webp` files in the corresponding directory and push.

---

## Adding an inline photo to an existing page

To show a photo directly on a page like `colloquium.html`, add a `<figure>` inside the relevant `<div class="event-body">`:

```html
<figure class="event-photo">
  <img src="photos/events/2026-thurlow-apr/cover.webp"
       alt="Julieann Thurlow presenting to AES members"
       loading="lazy">
  <figcaption>Julieann Thurlow and Jose Cruz, April 2026.</figcaption>
</figure>
```

The `loading="lazy"` attribute is important: it prevents the photo from slowing down the rest of the page.

---

## Categories

| Value | Filter label | Use for |
|-------|-------------|---------|
| `colloquium` | Colloquium | Guest speaker sessions, policy brief presentations |
| `fed-challenge` | Fed Challenge | Fed Challenge competition and prep |
| `general` | General | Anything else, member events, group photos, etc. |

To add a new category, add the value in `gallery.json` and add a corresponding entry to the `category_labels` object in `gallery.html` (line ~14 of the `<script>` block).

---

## Repository layout

```
photos/
  events/
    2026-thurlow-apr/
      cover.webp
      01.webp
      02.webp
    2025-mikula-dec/
      cover.webp
      01.webp
    ...
gallery.json     <- edit this to add/update events
gallery.html     <- renders everything from gallery.json
```

---

## Notes on file size

Keep the repo under ~200 MB total to avoid GitHub Pages slowdowns. WebP at 80–85% quality is a good balance. For event photos, aim for under 300 KB per file. For covers, under 150 KB.

If the repo gets large, the right next step is moving photos to a CDN (Cloudinary has a free tier). Ask the current research or tech lead before making that change.
