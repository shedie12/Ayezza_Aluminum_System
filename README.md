# Ayezza Aluminum

A Next.js App Router website with TypeScript, a responsive product catalog, a multi-item quotation builder, persistent quotation inquiries, and a protected lead management dashboard.

## Run locally

Requires Node.js 22 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
# Edit .env.local and set ADMIN_PASSWORD to a unique password (16+ characters).
npm run dev
```

Open http://localhost:3000. Team dashboard: http://localhost:3000/admin.

## Checks

```powershell
npm test
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

## Quotation rules

Sign in at `/admin`, then open **Pricing settings** (`/admin/settings`). Set awning rates per piece and other product rates per square meter or square foot, then save. Initial rates are examples and must be replaced with approved business prices. The catalog includes cabinets, sliding doors, sliding windows, awnings, casement windows and glass partitions.

Dimensions are entered in meters. Square-foot pricing converts area using `1 / (0.3048 * 0.3048)` before multiplying by rate, quantity and finish multiplier, then rounds each line to two decimals. Natural silver has no premium; matte black adds 15% and powder white adds 10%. Cabinet area is front width x height; awnings use rate per piece x quantity (plus the selected finish premium), independent of dimensions. Awning width and projection are collected only as specifications. Older saved awning rates retain their numeric value but are treated as per-piece prices; review and save the correct rate in Settings. Depth, hardware, installation, delivery, taxes and site-specific work require final pricing.

The server loads saved pricing and independently recalculates submitted estimates. Existing leads keep their original total. Settings are stored atomically in `pricing.json` inside `LEADS_DATA_DIR` (default `data/leads`); optionally set `PRICING_DATA_FILE` to a persistent absolute file path. Back up this file along with leads.

## Leads and deployment

Every inquiry is saved as a unique JSON file in `data/leads` (outside public assets). Set `LEADS_DATA_DIR` to an absolute directory on a durable volume if deploying. Team members can inspect contact details, item specifications, and notes and update the sales status. Dashboard access uses an HTTP-only signed session with an eight-hour expiry. Rotating ADMIN_PASSWORD invalidates existing sessions.

Deploy this version on a single Node.js server with persistent storage and HTTPS (`npm run build`, then `npm start`). Ephemeral/serverless filesystems are not suitable for this file store; replace `lib/leads.ts` with a shared database adapter before using those platforms or multiple replicas. Back up the lead directory and restrict filesystem access. Public hosting should add ingress rate limiting for inquiry submissions and login attempts.

No email or SMS service is configured; requests are saved for the team to review, and the UI does not claim notifications were sent. Review business pricing, privacy wording, retention practices, service coverage, and contact information before publishing. The architectural visuals are original SVG concept illustrations, not completed project photographs. Fonts use Google Fonts with system fallbacks.

Framework reference: [Next.js installation and App Router](https://nextjs.org/docs/app/getting-started/installation).
