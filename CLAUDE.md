# CLAUDE.md — Gerador de Encartes

## What this project is
Web app for small Brazilian grocery stores to create professional promotional
flyers (encartes) in minutes. Full spec in `ENCARTES_SPEC.md` — read it before
any significant work.

## Stack
- **Client:** React 18 + Vite + Tailwind CSS (in `/client`)
- **Server:** Node.js + Express + Mongoose (in `/server`)
- **DB:** MongoDB Atlas
- **PDF/PNG export:** client-side via html2canvas + jsPDF
- **Deploy target:** Render (free tier) — keep the server light, no Puppeteer

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
- Env vars in `.env` (never committed): `MONGODB_URI`, `PORT`, `VITE_API_URL`

## Architecture rules
- Themes live in `client/src/themes.js` as plain objects (colors, fonts,
  header style) — NOT in the database
- `FlyerCanvas` component renders the flyer at fixed A4 aspect ratio
  (210:297); export captures this exact DOM node with `scale: 3`
- Server stays a thin REST API — no rendering, no heavy processing
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
