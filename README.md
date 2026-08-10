# Gerador de Encartes

A web app that lets small and mid-size grocery store owners in Brazil build
professional promotional flyers (*encartes*) in minutes — no design skills
required. Add products, pick a theme, assemble a flyer with a live preview,
and export it as a print-ready PDF or PNG.

**Live demo:** _add your Render URL here after deploying (see [Deployment](#deployment))_

**Demo:** _add a screen recording or GIF here — see [Recording a demo](#recording-a-demo)_

## Features

- **Product catalog** — create, edit, delete products with name, price, unit,
  category, and a photo (uploaded or a themed fallback icon)
- **Flyer assembly wizard** — three steps: pick a theme → select products
  (with an optional promotional override price) → set title, validity dates,
  and store name, with a live A4-proportioned preview at every step
- **PDF/PNG export** — client-side, high resolution, automatic filename
- **Meus Encartes** — list of saved flyers with reopen, duplicate, and delete
- Mobile-first layouts throughout, since store owners mostly use their phones

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express + Mongoose |
| Database | MongoDB Atlas (free tier) |
| Export | html2canvas + jsPDF, rendered entirely in the browser |
| Image upload | Multer + Cloudinary (free tier) |
| Deploy | Render (web service + static site) |

## Architecture decisions

- **Client-side export, not server-side rendering.** The flyer is a React
  component styled to a fixed A4 aspect ratio; `html2canvas` rasterizes it in
  the browser and `jsPDF` wraps that into a PDF. This avoids running a
  headless browser (e.g. Puppeteer) on the server, which is too heavy for
  Render's free tier.
- **Themes live in code, not the database** (`client/src/themes.js`) —
  colors, fonts, and layout tokens per theme. There's no theme editor in the
  MVP, so there's no need to persist them.
- **Single-tenant, no auth.** The MVP is built for one store; the `storeName`
  is just a field on each flyer, not an account. Multi-tenant auth is
  explicitly out of scope until a later phase.
- **Cloudinary for uploads, not local disk.** Render's free tier filesystem
  is ephemeral (wiped on every redeploy or restart), so product photos are
  uploaded via Multer's in-memory storage and streamed straight to
  Cloudinary rather than written to disk — `server/src/routes/upload.js`
  never touches the filesystem.
- **Product cell sizing is capped to the theme's designed column count**
  (`client/src/components/FlyerCanvas.jsx`), not stretched to fill a row
  with fewer items — so a flyer with 1–3 products looks like a smaller,
  centered slice of the full design instead of a few oversized products
  awkwardly stretched across the page.

### Known limitation: html2canvas rendering quirks

`html2canvas` (used for the PDF/PNG export) has a few undocumented rendering
inconsistencies that shaped the flyer's CSS more than expected:

- It does not resolve a CSS custom property (`var(--x)`) for an SVG
  element's own `width`/`height` — the fallback product icon is sized via a
  dedicated wrapper `div` instead of sizing the `<svg>` directly.
- When two elements' boxes overlap on screen, it clips the overlapped region
  away from whichever element paints first in DOM order — and the amount
  clipped does not reliably track the size of the overlap. The flyer's
  price tag was originally designed to overlap the product image slightly
  (a common flyer "ticket" look); it's now laid out in normal document flow
  with zero overlap instead, since no calibration reliably worked around
  the inconsistency.

If you're extending `FlyerCanvas`, avoid introducing new overlapping /
absolutely-positioned siblings without testing the *actual exported*
PDF/PNG, not just the live browser preview — they can look identical on
screen and differ in the export.

## Getting started

```bash
git clone https://github.com/felipesantos1414/gerador-encartes.git
cd gerador-encartes
npm run install:all
```

Copy the environment file templates and fill them in:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

`server/.env` needs a MongoDB Atlas connection string in `MONGODB_URI` (see
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) for a free
cluster). The defaults in `client/.env` already point at the local server.

Run both client and server together:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001 (health check at `/api/health`)

## Deployment

The app deploys as two separate Render services plus a MongoDB Atlas
cluster: a **static site** for the client and a **web service** for the
server. A [`render.yaml`](./render.yaml) Blueprint is included to speed this
up, but the fields below are worth understanding either way in case Render's
Blueprint schema has changed since this was written.

### 1. MongoDB Atlas

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a database user (username + password).
3. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) — Render's
   free tier doesn't offer a static outbound IP, so this is the standard
   approach for PaaS deployments.
4. Copy the connection string (`mongodb+srv://...`) for use below.

### 2. Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com/users/register/free).
2. On the dashboard, copy the **Cloud name**, **API Key**, and **API Secret**
   for use below.

### 3. Server (Render Web Service)

1. In Render, **New +** → **Web Service**, connect this GitHub repo.
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Environment variables:
   - `MONGODB_URI` — the Atlas connection string from step 1
   - `CLIENT_URL` — the client's Render URL (add this *after* deploying the
     client in step 4, then redeploy the server)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
     — from step 2

### 4. Client (Render Static Site)

1. **New +** → **Static Site**, same repo.
2. **Root Directory:** `client`
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`
5. Environment variable:
   - `VITE_API_URL` — the server's URL from step 3, with `/api` appended,
     e.g. `https://encartes-server.onrender.com/api` (Vite bakes this in at
     build time, so set it *before* the first build)

### 5. Wire them together

Once both services have URLs, set `CLIENT_URL` on the server to the client's
URL and redeploy the server, so its CORS policy allows requests from the
deployed frontend.

### Recording a demo

Once deployed, a short screen recording (a GIF or a linked video) showing:
product creation → wizard → PDF export makes the README much more useful for
a portfolio. Tools like [Kap](https://getkap.co/) (Mac),
[ScreenToGif](https://www.screentogif.com/) (Windows), or `ffmpeg` all work
well for a 15–20 second capture.

## Roadmap (post-MVP)

- AI background removal for product photos (`@imgly/background-removal`,
  runs client-side)
- Seasonal themes (Christmas, Easter, churrasco, ...)
- Two-page flyers
- AI-suggested flyer copy via the Claude API
- Direct WhatsApp / Instagram sharing
- Multi-user auth (the MVP is intentionally single-tenant)

## Project structure

```
├── client/          React + Vite + Tailwind SPA
│   └── src/
│       ├── api/          fetch wrappers for the REST API
│       ├── components/   FlyerCanvas, product cards, wizard steps
│       ├── pages/         Produtos, Novo Encarte, Meus Encartes, Preview/Export
│       ├── themes.js      theme definitions (colors, fonts, layout tokens)
│       └── utils/         PDF/PNG export, slugify
├── server/          Express + Mongoose REST API
│   └── src/
│       ├── models/        Product, Flyer (Mongoose schemas)
│       ├── routes/        products, flyers, upload, health
│       └── config/        MongoDB + Cloudinary connections
├── ENCARTES_SPEC.md  full project spec (Portuguese)
└── render.yaml        Render Blueprint for both services
```
