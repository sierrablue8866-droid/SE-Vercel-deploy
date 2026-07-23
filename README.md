<<<<<<< HEAD
# Sierra Estates Platform

Luxury PropTech monorepo for the New Cairo market (pnpm + Turborepo). Firebase project: **`sierra-blu`**. Full policy: [`DEPLOYMENT.md`](./DEPLOYMENT.md).

> **Current status**: the frontend (public site + admin console UI) was intentionally removed to make way for a new design — see `NEXT_STEPS.md`. The backend below is fully intact and deployed: all 82 API routes, Firebase Functions, the Python service, and the WhatsApp/PropertyFinder workers keep running unaffected.

> **Migration history**: code and history from several legacy repositories were consolidated here under the Sierra Estates brand. See [docs/MIGRATION.md](./docs/MIGRATION.md) for details.

## 📦 Repository Structure

```
Sierra-Estates-Final/
├── apps/
│   ├── sierra-estates-realty/  # Main Next.js 16 app — API routes + (soon) frontend
│   │   ├── app/api/            # REST API endpoints (82 routes) — the only app/ content today
│   │   ├── lib/                # Services, models, agents, server-only utilities
│   │   ├── proxy.ts            # Edge CORS + /api/orchestrate secret gate
│   │   └── data/                # Seed data consumed by API routes
│   ├── api/                    # Python service (Docker/Cloud Run) — PropertyFinder sync + bot integration
│   └── agents/                 # WhatsApp bot/scraper, Stage-9 closer (backend workers)
├── packages/                   # Shared workspace packages (db, agents-core, memory-engine, ui, config, ...)
├── functions/                  # Firebase Cloud Functions — collectData, processDataForApp
├── workflows/                  # Node scripts + n8n templates for the external data-sync pipeline
├── .github/workflows/          # CI/CD pipelines (lint, type-check, test, build, deploy)
├── firestore.rules             # Production Firestore security rules
├── storage.rules               # Production Storage security rules
├── pnpm-workspace.yaml         # Monorepo workspace config
├── turbo.json                  # Turborepo build cache config
├── firebase.json               # Functions + Firestore + Storage + Hosting (redirect only) config
├── vercel.json                 # Vercel config (fallback topology — see DEPLOYMENT.md)
├── CLAUDE.md                   # Codebase guidelines & architecture decisions
├── docs/                       # Additional guides, Obsidian vault, business content
└── NEXT_STEPS.md               # Outstanding tasks
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+
- **pnpm** 9+
- **Firebase CLI** (optional, for local emulation / rules deploy)

### Installation

```bash
pnpm install
cp .env.example apps/sierra-estates-realty/.env.local   # fill in your credentials
pnpm dev               # Next.js app on :3000
docker-compose -f docker-compose.n8n.yml up -d  # n8n on :5678
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/deploy` | POST | Admin deploy trigger |
| `/api/agent/hub` | POST | Multi-agent hub (Scribe/Curator/Matchmaker/Closer) |
| `/api/closer/initiate` | POST | Stage 9 closer agent |
| `/api/ingest/whatsapp` | POST | WhatsApp message ingestion |
| `/api/leads` | POST | Create investment stakeholder |
| `/api/leads/request-viewing` | POST | Request property viewing |
| `/api/listings` | GET | Fetch portfolio assets |
| `/api/matching` | POST | Run AI matching engine |
| `/api/orchestrate` | POST | Full S1–S10 pipeline |
| `/api/properties/sync` | POST | Property Finder sync |
| `/api/property-finder` | GET/POST/PUT/DELETE | PF gateway |
| `/api/proposals` | POST | Generate proposal |
| `/api/sync` | GET/POST | Sync management |
| `/api/sync/publish` | POST | Publish to Property Finder |
| `/api/telegram/setup` | GET | Telegram webhook setup |
| `/api/telegram/webhook` | POST | Telegram bot handler |
| `/api/viewing-requests` | GET/POST | Viewing requests |
| `/api/webhooks/property-finder` | POST | PF webhook (HMAC verified) |
| `/api/webhooks/whatsapp` | GET/POST | WhatsApp webhook |
| `/api/whatsapp/heartbeat` | POST | Scraper heartbeat |
| `/api/whatsapp/webhook` | POST | WhatsApp message handler |

## Intelligence Pipeline

```
WhatsApp Groups
    └─→ /api/webhooks/whatsapp (Scribe agent — S1/S2)
            └─→ Firestore rawScrapeData
                    └─→ processDataForApp (Cloud Function)
                            └─→ Matching Engine (S6/S7/S8)
                                    └─→ Stage 9 Closer Agent
                                            └─→ Telegram alerts + Proposals
```

## Deployment

Public site + admin + API deploy together via Vercel (GitHub Action `deploy-vercel.yml` — `vercel pull` → `vercel build` → `vercel deploy --prebuilt`; Vercel's own git auto-deploy is off). Firebase (`sierra-blu`) is backend-only — Firestore, Storage, Auth, Functions, plus one Hosting site that only 302-redirects the legacy admin URL. Full details, rollback procedure, and the deploy matrix: [`DEPLOYMENT.md`](./DEPLOYMENT.md).

```bash
# Deploy Firestore/Storage rules + Cloud Functions (manual)
pnpm deploy:rules
pnpm deploy:functions
```

## 📋 Environment Variables

See `.env.example` for the full, canonical list (kept in sync with a CI sweep of `process.env.*`). Copy it to `apps/sierra-estates-realty/.env.local` and fill in real values — never commit that file.

## 🔐 Security

- ✅ Type-safe with TypeScript strict mode
- ✅ Authentication via Firebase Auth + JWT
- ✅ Secrets via Google Secret Manager
- ✅ CORS & CSP headers configured
- ✅ SQL injection prevention (Zod validation)
- ✅ XSS protection (React automatic escaping)
- ✅ Rate limiting on Cloud Functions
- ✅ Firestore Security Rules enforced
- ✅ Cloud Storage CORS restricted

## 📚 Documentation

- `ARCHITECTURE.md` - System design & data flows
- `DEPLOYMENT.md` - Deployment policy & runbooks (authoritative)
- `API.md` - REST API specifications
- `CONTRIBUTING.md` - Developer setup & workflow
- `SECURITY.md` - Security model & reporting
- `docs/` - Additional guides (Firebase App Check, n8n workflows, theme system, Obsidian vault)


## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Follow TypeScript strict mode
3. Add tests for new functionality
4. Run linter & tests: `pnpm lint && pnpm type-check && pnpm test:ci`
5. Submit pull request with description

## 📞 Support

- **Issues**: GitHub Issues (this repo)
- **Docs**: See `ARCHITECTURE.md`, `API.md`, `DEPLOYMENT.md`

## 📄 License

Proprietary - Sierra Estates Inc.
=======
# SE — Sierra Estates Portal

> Live at **https://ahmedfawzy8866.github.io/SE/**

## Structure

```
se/
├── index.html              ← Main portal (Houzez-Style, 8 sections + inline 3D tour)
├── compounds.html          ← Compounds page (Leaflet intelligence map)
├── properties.html         ← Properties listing grid
├── property.html           ← Single property detail (gallery, mini-map, agent)
├── virtual-tour.html       ← Full-page 3D tour viewer
├── matches.html            ← Smart Match (AI pairing tool)
├── roi.html                ← ROI Analysis (yield leaderboard + calculator)
├── pricing.html            ← Precise Pricing (AVM estimator)
├── advice.html             ← Dream Home Finder (4-question quiz)
├── ai-engine.html          ← AI Engine 3.0 dashboard
├── career.html             ← Career application form
├── seed-supabase.html      ← One-time Supabase seeding tool
│
├── shared.css              ← Shared styles (incl. RTL icon flipping)
├── shared.js               ← Shared logic (i18n, theme, animations)
├── data.js                 ← Seed data (slides, listings, compounds, rooms)
│
├── supabase-config.js      ← Supabase project config (EDIT THIS with your values)
├── supabase.js             ← Supabase integration layer (window.SIERRA_DB)
├── schema.sql              ← PostgreSQL schema + RLS policies (run in Supabase SQL Editor)
│
├── assets/                 ← Logo images
├── logo-gold.png           ← Logo (light bg)
├── scripts/                ← Utility scripts
│
├── .archive/               ← Archived/dead files (kept for history, not used)
│
└── .gitignore              ← Excludes SSL certs, Twilio codes, service accounts, .env
```

---

## 🟢 Supabase Setup (NEW — Backend Integration)

The portal now has **Supabase (PostgreSQL)** integration. It's **disabled by default** — the site works perfectly with static `data.js` until you enable it.

### Why Supabase?
- ✅ PostgreSQL (relational, ACID, powerful queries)
- ✅ Row Level Security (RLS) — same concept as Firestore rules
- ✅ Real-time subscriptions (compound changes reflect instantly)
- ✅ Built-in Auth (email/password + OAuth)
- ✅ Generous free tier (500MB database, 50k monthly active users)
- ✅ Matches the addendum's tech stack

### Step 1: Create Supabase Project
1. Go to https://supabase.com → sign in
2. Click "New project" → fill in name, password, region
3. Wait ~2 minutes for provisioning

### Step 2: Run the Schema
1. In your Supabase dashboard, open **SQL Editor** (left sidebar)
2. Click "New query"
3. Paste the entire contents of `schema.sql` (from this repo)
4. Click **Run** (▶ button)
5. This creates 8 tables + RLS policies + indexes + realtime

### Step 3: Get Your API Keys
1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** (e.g. `https://abcd1234.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 4: Edit `supabase-config.js`
```javascript
window.SIERRA_SUPABASE_CONFIG = {
  url:        "https://abcd1234.supabase.co",     // ← your URL
  anonKey:    "******"   // ← your anon key
};
window.SIERRA_SUPABASE_ENABLED = true;             // ← flip to true
```

### Step 5: Seed the Database
1. Open https://ahmedfawzy8866.github.io/SE/seed-supabase.html
2. Verify connection status is green
3. Click "Seed Supabase Now"
4. Wait for completion (52 compounds + ~9 listings)

### Step 6: Make Yourself Admin
1. In Supabase dashboard → **Authentication → Users**
2. Click "Add user" → create your admin account
3. Copy the **UID** of your user
4. Go to **SQL Editor** → run:
```sql
INSERT INTO users (id, email, name, role)
VALUES ('YOUR-COPIED-UID', 'your@email.com', 'Ahmed', 'admin');
```

### How It Works
- **Supabase enabled**: Portal reads compounds/listings from PostgreSQL (real-time)
- **Supabase disabled OR connection fails**: Portal falls back to static `data.js` (always works)
- **Inquiry form**: Tries Supabase first, falls back to CSV download + localStorage
- **Career form**: Same pattern — Supabase primary, CSV fallback

### Tables Created

| Table | Purpose | Access |
|-------|---------|--------|
| `compounds` | All 52 New Cairo compounds | Public read, admin write |
| `listings` | Active property listings | Public read, admin write |
| `units` | Per-compound unit inventory | Public read, admin write |
| `agents` | Real estate agents | Public read, admin write |
| `inquiries` | Form submissions from site | Public create, admin read |
| `career_applications` | Job applications | Public create, admin read |
| `leads` | Property Finder webhook leads | Public insert, admin all |
| `users` | Admin profiles + roles | Self read, admin write |

---

## Recent fixes

### Map: Arabic + Dark theme (latest)
- Map markers show compound names in Arabic when site language = Arabic
- 52 compounds translated (Mivida → ميفيدا, Hyde Park → هايد بارك, etc.)
- Dark theme loads CARTO dark tiles + gold markers
- Default remains English + Light (no regression)
- Filter bar translated: "ابحث باسم الكمبوند…"

### Code Audit Fixes
1. **Inquiry form** — wired to Supabase with CSV fallback
2. **React dev builds** → production.min.js
3. **Dead files** moved to `.archive/`
4. **`'use strict'`** added to all IIFEs
5. **aria-labels** added for accessibility
6. **5 missing i18n keys** added (EN + AR)
7. **loading="lazy"** for performance

### RTL + Arabic
- Directional icons flip via `transform: scaleX(-1)` when `dir="rtl"`
- All map markers, filter labels, count text translate to Arabic

## Security

The following files are in `.gitignore` and will NEVER be committed:
- SSL certificates
- Twilio 2FA recovery codes
- Supabase service_role key (NEVER put this in frontend code!)
- `.env` files

**Note:** The Supabase anon key in `supabase-config.js` is **safe to commit** — it's designed to be public. Security is enforced by RLS policies in `schema.sql`. Never put the `service_role` key in frontend code.

## Live URLs

| URL | What |
|-----|------|
| https://ahmedfawzy8866.github.io/SE/ | Main portal |
| https://ahmedfawzy8866.github.io/SE/compounds.html | Map + compounds |
| https://ahmedfawzy8866.github.io/SE/properties.html | Listings grid |
| https://ahmedfawzy8866.github.io/SE/property.html | Property detail |
| https://ahmedfawzy8866.github.io/SE/matches.html | Smart Match (AI) |
| https://ahmedfawzy8866.github.io/SE/roi.html | ROI Analysis (AI) |
| https://ahmedfawzy8866.github.io/SE/pricing.html | AVM Pricing (AI) |
| https://ahmedfawzy8866.github.io/SE/advice.html | Dream Home Finder (AI quiz) |
| https://ahmedfawzy8866.github.io/SE/virtual-tour.html | 3D tour full page |
| https://ahmedfawzy8866.github.io/SE/ai-engine.html | AI Engine dashboard |
| https://ahmedfawzy8866.github.io/SE/career.html | Career form |
| https://ahmedfawzy8866.github.io/SE/seed-supabase.html | Supabase seeding tool |

## Roadmap (deferred to backend plan)

- [ ] **Admin SPA** — Next.js admin dashboard (CRUD for all tables)
- [ ] **Gemini API** — Smart Match, AVM, ROI predictions
- [ ] **n8n webhooks** — Property Finder lead ingestion → `leads` table
- [ ] **Design system unification** — ai-engine + virtual-tour → shared.css

---

# SE — Sierra Estates (consolidated repo)

This is now the **single source of truth** for Sierra Estates. Backend,
business logic, bots, AI agents, and automation workflows all live on
`main`. The two production frontends each get their own branch — no
frontend code lives on `main`.

| Branch   | What it is                                                                 | Deploys to |
|----------|-----------------------------------------------------------------------------|------------|
| `main`   | Backend: Next.js API (`apps/sierra-estates-realty`), Python services, bots, AI agents, Firebase Functions, automation workflows. Also still carries a small root-level Next.js "client-portal shell" (`src/`) — see note below. | Firebase Functions/Hosting; the root `src/` app can deploy to Vercel separately |
| `admin`  | The live admin dashboard (React/Vite SPA), history preserved from its original repo (`ahmedfawzy8866/-19-6-AI`). | [Vercel — `admin-dashboard` project](https://vercel.com) |
| `client` | The public client-facing site, exactly as published on GitHub Pages. **Currently being refined by hand — do not wire or modify until told otherwise.** | [GitHub Pages](https://ahmedfawzy8866.github.io/SE/) (from the `gh-pages` branch; `client` is an identical copy staged for a future Vercel import) |

## `main` — backend, bots, agents, workflows

Consolidated from `Sierra-Estates-Final`, keeping only what's actually
current (the repo had accumulated many stale duplicate/archive folders —
`.archive`, `22`, `33`, `SE222`, `Sierra-Estates-Egypt`, `.claude/worktrees/*`,
etc. — none of that came along; the `arc` repo, a graveyard of older Sierra
Estates rewrites, was checked too and turned out fully superseded by what's
here).

```
SE/
├── apps/
│   ├── sierra-estates-realty/   ← Next.js backend, ~80 API routes
│   │                              (leads, listings, matching, orchestration,
│   │                              CRM, cron, webhooks, telegram, whatsapp, …)
│   ├── api/                     ← Python PropertyFinder sync worker (Cloud Run)
│   └── agents/
│       ├── whatsapp-bot/        ← WhatsApp routing bot (whatsapp-web.js)
│       ├── whatsapp-scraper/    ← WhatsApp group listing scraper
│       ├── stage-9-closer/      ← Sales-closing automation agent
│       └── sierra-blue-bot/     ← Python customer-journey bot (pulled out of
│                                   the old `portal/` static site — its HTML
│                                   frontend was a duplicate of what's on the
│                                   `client` branch, so only the bot code came)
├── packages/                    ← shared libs: agents (closer/curator/
│                                   matchmaker/scribe/openclaw), agents-core,
│                                   memory-engine, obedian, db, api, auth,
│                                   config, property-finder-api, ui
├── functions/                   ← Firebase Cloud Functions (see "Known gaps")
├── workflows/                   ← n8n templates + WhatsApp/Sheets/Firestore
│                                   sync scripts (GitHub Actions-driven)
├── hooks/, lib/                 ← shared root-level Firebase/auth/i18n helpers
├── firebase/admin-redirect/     ← Firebase Hosting target (302 redirect to
│                                   sierra-estates.net/admin)
├── firebase.json, .firebaserc, firestore.indexes.json, storage.rules
├── apps/sierra-estates-realty/firestore.rules  ← canonical rules (see below)
├── design/                      ← Sierra Estates design system reference
└── src/                         ← root Next.js app: a minimal Firebase-wired
                                    client-portal shell (see note below)
```

### About `src/` on `main`

Before this consolidation, `main` already had a small standalone Next.js +
Firebase app rendering a placeholder client portal at `/clients`
(`src/components/houyez-portal/HouyezPortal.tsx`, live Firestore
subscriptions via `src/lib/houyez/`). It reads/writes the `houyez_*`
Firestore collections.

**This was left untouched** — it wasn't part of the backend migration and
wasn't the `client` page being asked about, but it looks like it may be
scaffolding meant to receive the refined client design later ("wire it").
Flagging this explicitly rather than guessing: let me know if it should move
under `apps/`, get merged into the `client` branch work, or be left as-is.

### Firestore rules

`firebase.json` points `firestore.rules` at
`apps/sierra-estates-realty/firestore.rules` — that's the one that actually
deploys. It uses a staff-role model (`users/{uid}.role ∈ {admin,manager,agent}`)
with a broad catch-all, plus an explicit public-read section for the
`houyez_*` collections (merged in from `main`'s previous standalone
`firestore.rules`, which was removed as redundant once merged).

### Known gaps / things flagged, not fixed

- **`functions/` has two implementations.** A legacy JS pipeline
  (`collectData.js`, `processData.js`, `index.js`) and a newer TS rewrite
  (`src/index.ts`, firebase-functions v2). `functions/__tests__/backend.test.js`'s
  own docstring says the JS version is what's currently live and the TS one
  is an unshipped next-gen version — genuine migration-in-progress ambiguity,
  not something to resolve by guessing. Both are kept; **your call** on which
  to finalize and when to cut over.
- **`packages/open-memory`** (a ~280-file vendored OSS-looking package) was
  **not** migrated — zero references from `apps/sierra-estates-realty`,
  looks unused. Worth a second look before pulling it in.
- No Firebase service-account key or other real credential was found
  anywhere in the source tree during migration (checked file content, not
  just filenames). `.env.example` documents every variable the code reads;
  all values are empty except the Firebase **Web** config (safe to expose by
  design — Firebase security is enforced by Firestore Rules + Auth, not by
  hiding the web API key).
- `.firebaserc` (project alias → `sierra-blu`) is gitignored per this repo's
  existing `.gitignore` — copy it locally or run `firebase use sierra-blu`.

## `admin` branch

The live admin dashboard — React 19 + Vite 6 + TypeScript SPA, deployed on
Vercel (project `admin-dashboard`). History preserved from its original repo
(`ahmedfawzy8866/-19-6-AI`, still live and deployed there too — nothing was
touched on Vercel or that repo).

**Firebase integration done in this consolidation:**
- `api/index.ts`'s `/api/admin/auth/verify` used to just base64-decode the
  JWT payload without verifying its signature. It now calls
  `firebase-admin`'s `verifyIdToken()` (see `api/firebaseAdmin.ts`) and
  requires `email_verified`, using the shared `sierra-blu` Firebase project.
- Added `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY`
  to `.env.example` — set these as real secrets in Vercel, not in git.
- Dropped the redundant `package-lock.json` (pnpm is canonical per
  `pnpm-workspace.yaml`) and regenerated `pnpm-lock.yaml` for the new
  `firebase-admin` dependency.

**Known gaps, not fixed (flagging for your call):**
- `src/firebase.ts` writes notifications straight to Firestore from the
  client, while the README describes leads/listings/agents going through the
  REST backend (`src/lib/apiClient.ts`) — a dual-path architecture worth
  picking one direction on.
- Missing `@types/react`/`@types/react-dom` devDependencies (pre-existing,
  not introduced by this migration) — `tsc --noEmit` on `src/` throws a wall
  of implicit-`any` errors as a result. The new `api/` files typecheck clean.
- `PF_API_KEY`/`PF_API_SECRET`/`GEMINI_API_KEY` aren't set anywhere in the
  checkout — needed from Vercel or you before those routes work locally.

## `client` branch

An exact, untouched copy of the `gh-pages` branch — the site currently live
at **https://ahmedfawzy8866.github.io/SE/**. Static HTML/CSS/JS (Houyez-style
portal: hero, compounds, listings, virtual tour, AI hub, ROI calculator,
pricing).

**Nothing here was modified.** Per instructions, this page is being refined
by hand before any wiring happens. One thing worth knowing: this branch
(same as `gh-pages`) also has `backend/*.py` bot files and `scripts/
activate-agents.js` mixed into it — the canonical copies of those Python bot
files now live on `main` at `apps/agents/sierra-blue-bot/`; the ones on
`client`/`gh-pages` are an untouched duplicate, left as-is since cleaning
them out would mean touching this branch.

Also sitting in the local working tree (uncommitted, not part of any
branch): `gh-pages-hero-update/index.html` — looks like in-progress hero
section work. Left alone; it'll be there when you resume refining the client
page.

## Setup

```bash
# Root Next.js client-portal shell (src/)
pnpm install
cp .env.example .env.local   # fill in Firebase + backend vars you need
pnpm dev                     # http://localhost:3000/clients

# Backend (apps/sierra-estates-realty)
cd apps/sierra-estates-realty
pnpm install
pnpm dev

# Admin dashboard (admin branch)
git checkout admin
pnpm install
cp .env.example .env.local
pnpm dev                     # http://localhost:3001
```

## Deploy

- **Admin** → already deployed on Vercel (`admin-dashboard` project, org
  `team_k2jaWfzeatcYG6Qpl0ooCxQh`). Push to the `admin` branch; Vercel
  handles the rest. Not touched or reconfigured here.
- **Client** → currently GitHub Pages, serving `gh-pages`. A Vercel project
  for the `client` branch can be set up once the refined design is ready to
  wire — explicitly a future step, not done here.
- **Backend / Functions** → `firebase deploy` from `main` (after `firebase
  use sierra-blu`) deploys Hosting (the admin-redirect shim),
  Firestore rules/indexes, Storage rules, and Cloud Functions. The Next.js
  backend (`apps/sierra-estates-realty`) and the root client-portal shell
  (`src/`) each deploy to Vercel independently, same as before.
- **DNS / domain** (`admin.sierra-estates.net`) — untouched, out of scope
  for this consolidation.

## Firebase project

Everything above shares one Firebase project: **`sierra-blu`**. Firestore,
Auth, Storage, and Functions are all provisioned there — see
`apps/sierra-estates-realty/firestore.rules` for the security model and
`firebase.json` for what deploys where.
>>>>>>> origin/client
