# CLAUDE.md — Gerador de Encartes

## What this project is
Web app for small Brazilian grocery stores to create professional promotional
flyers (encartes) in minutes. Full spec in `ENCARTES_SPEC.md` — read it before
any significant work.

## Stack
- **Client:** React 18 + Vite + Tailwind CSS (in `/client`)
- **Server:** Node.js + Express + Mongoose (in `/server`)
- **DB:** MongoDB Atlas
- **PDF/PNG export:** server-side via Puppeteer (see `server/src/routes/export.js`,
  `client/src/pages/PrintFlyerPage.jsx`) — a headless Chromium instance renders
  the client app's own `?print=<flyerId>` route at a fixed viewport and
  screenshots it. This replaced client-side html2canvas + jsPDF after html2canvas
  proved unfixable on iOS Safari (viewport/scroll clipping bugs specific to that
  engine); the html2canvas + jsPDF path is kept in `client/src/utils/export.js`
  as an automatic fallback if the server export call fails.
- **Deploy target:** Render — the server now runs headless Chromium via
  Puppeteer for export, which does **not** fit the free tier (Chromium alone
  typically needs 300-500MB+ RAM to launch; free tier caps at 512MB total,
  shared with Node/Mongoose). Needs at minimum a paid plan with more RAM, and
  likely either a Docker-based deploy (Chromium's system deps aren't on
  Render's default Node image) or switching to `puppeteer-core` +
  `@sparticuz/chromium` for a lighter footprint. Not yet resolved for
  production — confirm before deploying.

## Commands
```bash
# from repo root
npm run dev          # runs client and server concurrently
cd client && npm run dev    # Vite dev server (port 5173)
cd server && npm run dev    # Express with nodemon (port 3001)
```

## Conventions
- Code, comments, commit messages: **English**
- UI text: **Portuguese (pt-BR)** — the users are Brazilian store owners
- Currency format: `R$ 6,99` (comma decimal separator) — use `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Commits: conventional style (`feat:`, `fix:`, `chore:`), small and frequent
- Components: functional + hooks only; one component per file in `client/src/components`
- API responses: `{ data }` on success, `{ error: "message" }` on failure with proper status codes
- Env vars in `.env` (never committed): `MONGODB_URI`, `PORT`, `VITE_API_URL`,
  `CLIENT_URL` (server — CORS origin, **and** the base URL Puppeteer navigates
  to for export, so it must point somewhere the server can actually reach)

## Architecture rules
- Themes live in `client/src/themes.js` as plain objects (colors, fonts,
  header style) — NOT in the database
- `FlyerCanvas`'s height is intrinsic to its content, not a fixed aspect
  ratio — see the comments on `.flyer` in `FlyerCanvas.css`
- Server is no longer a purely thin REST API — `server/src/routes/export.js`
  runs headless Chromium (Puppeteer) for PDF/PNG generation. See the PDF/PNG
  export and deploy target notes above before assuming this is lightweight.
- Single-tenant for MVP: no auth, no user model

## Scope discipline (important)
Work phase by phase as defined in `ENCARTES_SPEC.md`. Do NOT start features
from later phases (AI background removal, seasonal themes, WhatsApp sharing,
auth) unless explicitly asked. When a phase's acceptance criterion is met,
stop and summarize before moving on.

## Quality bar
- Mobile-first layouts (store owners use phones)
- Every phase ends with the app in a runnable, demo-able state
- No real brand names (Coca-Cola, Heineken) in seed data or screenshots —
  use generic products ("Refrigerante 2L", "Cerveja Lata 350ml")
