# Atlas Detailing — public website

Marketing site and online booking for Atlas Detailing. Talks to the operator app API in `../detailing-app`.

## Setup

```bash
cp .env.local.example .env.local
npm install
```

Start the operator app first (port 3000), then:

```bash
npm run dev
```

Open http://localhost:3001

## Pages

- `/` — Home
- `/services` — Packages from PocketBase (via API)
- `/book` — 3-step booking flow
- `/contact` — Phone / email (env-driven)

See [INTEGRATION.md](./INTEGRATION.md) for API and deployment details.

## Design

Brand tokens match the operator app: dark `#111111` background, `#4caf50` accent, Syne + DM Sans. Full mockup brief: `../detailing-app/docs/WEBSITE_BOOKING_MOCKUP_PROMPT.md`.
