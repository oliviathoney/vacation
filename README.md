# Japan trip planner

A research-first, responsive trip planner for two adults visiting Tokyo, Kyoto, and Sapporo in September 2027. Built with vanilla JavaScript, CSS, and Vite.

## Run locally

Requires Node.js 20+ (a maintained Node.js release is recommended).

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```powershell
npm run build
npm run preview
```

`npm test` runs the dependency-free content and budget tests. Deploy the generated `dist` directory to any static host. All planner navigation is client-side without deep routes.

## Included

- A 14-day / 13-night provisional route with a Tokyo return-flight buffer.
- City-filtered experiences, six hotel options, food, and day trips.
- Photo cards and larger detail images, with source credits and explicit labels for area or illustrative photos.
- Tokyo Giants and Hokkaido Fighters planning, booking checklist, and official research links.
- Editable couple-budget calculator, shortlist, notes, and JSON backup export.
- Site-wide JPY/USD toggle for place prices, transportation, and the budget, with a saved currency preference.
- Research notes that distinguish source-document ideas, editorial price allowances, and details still needing confirmation.

Edit `src/data.js` to update research, recommendations, links, or the route. Photo metadata is in `src/photos.js`; preserve source credits, Creative Commons author/license links, and illustrative-photo labels when changing images. Prices are broad **JPY planning allowances**, not live or verified September 2027 quotes. Confirm schedules, opening hours, licensing requirements, fares, and booking rules directly before payment. The original attachment is not distributed with the site.

## Persistence and privacy

Use the **JPY / USD** buttons in the header to change the display currency. USD estimates use the editable **Budget → Illustrative exchange rate** (default: JPY 150 per USD 1), not a live feed. Prices and budget assumptions remain stored in JPY, so switching views does not alter the underlying budget. Budget inputs use the selected display currency; editing a USD amount converts it to the nearest yen. USD displays are rounded to at most two decimals. Original US-dollar references from the source document retain their stated currency. JSON exports identify the underlying budget currency as JPY.

Shortlist, checklist, notes, budget, and currency preference are stored in this origin's browser `localStorage`. They are not shared across browsers or devices, and clearing site data removes them. Existing saved planners without a currency preference open in JPY without losing saved data. Use **Saved places → Export planner backup** to download a readable JSON snapshot; this first version does not import backups. No booking or payment takes place on this site. Do not store sensitive personal information in notes.

Photos load directly from hotel/venue/tourism websites and their image CDNs, Wikimedia Commons, and Unsplash. Credits link to the source; Commons photos also include author and license links. Photos may show another season, room category, or venue setup. Area and illustrative photos are explicitly labeled, not represented as the booked property or activity. Images remain subject to their owners' rights; no permission to redistribute official-site photos is implied. Review image permissions before public or commercial reuse.

Fonts load from Google Fonts. These providers receive ordinary resource requests. Card photos use lazy loading, descriptive alt text, and a visible source link if a remote image fails. The site remains usable with system fonts and unavailable photos. All external booking/research/photo-source links open a new tab.
