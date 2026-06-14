# Website ↔ Operator app integration

The public site (`detailing-website`) does **not** talk to PocketBase directly. It calls HTTP routes on the operator app (`detailing-app`), which authenticate server-side and read/write jobs and clients.

## Architecture

```
Browser (localhost:3001)
    → fetch NEXT_PUBLIC_APP_API_URL
    → detailing-app /api/public/*
        → ensurePocketBaseAuth()
        → PocketBase (clients, jobs, packages)
```

New bookings create or update a **client** (matched by phone) and a **job** with `status: scheduled`. Those jobs appear on the operator app Home and Jobs screens.

## API routes (detailing-app)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/public/packages` | GET | Active packages + pricing |
| `/api/public/availability?date=YYYY-MM-DD` | GET | Time slots + taken slots for that date |
| `/api/public/booking` | POST | Create client + scheduled job |

All routes send CORS headers for origins listed in `BOOKING_ALLOWED_ORIGINS` (default: `http://localhost:3001`).

### Booking POST body

```json
{
  "packageId": "…",
  "date": "2026-06-10",
  "startTime": "10:00",
  "locationType": "mobile",
  "vehicleType": "sedan",
  "name": "Jane Doe",
  "phone": "(555) 123-4567",
  "email": "optional@email.com",
  "address": "123 Main St",
  "notes": "Optional notes"
}
```

## Environment

### detailing-website (`.env.local`)

```bash
NEXT_PUBLIC_APP_API_URL=http://localhost:3000
```

Production: set to your deployed operator app URL (e.g. `https://detailing-fawn.vercel.app`).

### detailing-app

Ensure PocketBase credentials are set (`NEXT_PUBLIC_PB_EMAIL`, `NEXT_PUBLIC_PB_PASSWORD` or server `PB_*` vars).

For production CORS:

```bash
BOOKING_ALLOWED_ORIGINS=https://your-website.vercel.app,https://book.atlasdetailing.com
```

## Local dev checklist

1. PocketBase reachable (local or Fly.io URL in `detailing-app/.env.local`)
2. `cd detailing-app && npm run dev` → port **3000**
3. `cd detailing-website && npm run dev` → port **3001**
4. Open http://localhost:3001/book and complete a test booking
5. Confirm the job appears in the operator app at http://localhost:3000/jobs

## Deploy notes

- Deploy **detailing-app** first (API + PocketBase auth).
- Deploy **detailing-website** with `NEXT_PUBLIC_APP_API_URL` pointing at the production app URL.
- Add the website origin to `BOOKING_ALLOWED_ORIGINS` on the operator app (Vercel env).

## Cursor workspace

Open `Detailing.code-workspace` at the repo root so Agent mode can edit both projects in one session.
