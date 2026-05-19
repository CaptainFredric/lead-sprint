# 72-Hour Lead Sprint

A productized service starter kit for selling fast website refreshes to local service businesses.

The repo contains:

- A static landing page at `index.html`
- A live ROI calculator and outreach email drafter in `script.js`
- A prospect audit console with local pipeline storage and CSV export
- A mini-proposal generator for sales calls
- A local seller setup panel for booking, deposit, contact, and footer identity
- A polished CSS system in `styles.css`
- A practical business plan and sales workflow in `docs/`

## Preview

Open `index.html` in a browser, or run a tiny local server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## The Offer

Sell one narrow outcome:

> In 72 hours, I will improve your mobile website, sharpen the main service offer, add a quote request path, connect analytics events, and hand over a short action list.

Start with a $750 pilot. Use the third-day handoff to offer $250/month care plans for edits, analytics notes, form tests, and small conversion fixes.

## Before Selling

Use the seller setup panel on the live page to save private, browser-local details:

- Your name
- Contact email
- Booking link
- Deposit link
- City or service area

Then replace the generic identity in the repo when you are ready to make the public page client-facing:

- Business name in the header and footer
- One real example screenshot when you have a pilot
- Any compliance language required for the client niche

## Git Remote

This folder is already a Git repo on `main`, but no remote is configured yet. Once you create a GitHub repo, connect it with:

```bash
git remote add origin <repo-url>
git push -u origin main
```

## GitHub Pages

The site is ready for GitHub Pages from the repository root on `main`. `.nojekyll` is included so GitHub serves the static files directly.

## Sales Positioning

The core objection is simple: a business owner could build their own website.

The response is also simple: Lead Sprint is not selling raw website assembly. It sells diagnosis, conversion copy, implementation, form/testing QA, analytics verification, and a short handoff plan in a fixed delivery window.

Image credit: Austin Distel on Unsplash.
