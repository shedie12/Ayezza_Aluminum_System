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

Edit `lib/quotation.ts` to replace the clearly labeled sample rates with approved business prices. Currency is Philippine pesos. Each line is width × height (meters) × quantity × product rate × finish multiplier, rounded to two decimals. The server independently validates all fields and recalculates totals. Installation, delivery, taxes, and site-specific work are excluded. Requests are estimates, not final sales contracts.

## Leads and deployment

Every inquiry is saved as a unique JSON file in `data/leads` (outside public assets). Set `LEADS_DATA_DIR` to an absolute directory on a durable volume if deploying. Team members can inspect contact details, item specifications, and notes and update the sales status. Dashboard access uses an HTTP-only signed session with an eight-hour expiry. Rotating ADMIN_PASSWORD invalidates existing sessions.

Deploy this version on a single Node.js server with persistent storage and HTTPS (`npm run build`, then `npm start`). Ephemeral/serverless filesystems are not suitable for this file store; replace `lib/leads.ts` with a shared database adapter before using those platforms or multiple replicas. Back up the lead directory and restrict filesystem access. Public hosting should add ingress rate limiting for inquiry submissions and login attempts.

No email or SMS service is configured; requests are saved for the team to review, and the UI does not claim notifications were sent. Review business pricing, privacy wording, retention practices, service coverage, and contact information before publishing. The architectural visuals are original SVG concept illustrations, not completed project photographs. Fonts use Google Fonts with system fallbacks.

Framework reference: [Next.js installation and App Router](https://nextjs.org/docs/app/getting-started/installation).
