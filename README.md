# Vibe Rescue Bug Tracker

A React and Supabase practice project for the seven-day Fiverr Vibe Coding troubleshooting plan.

## Current capabilities

- Email and password authentication with Supabase Auth.
- Per-user issue storage in PostgreSQL.
- Row Level Security policies that isolate each user's records.
- Create, filter, and update issue status.
- Persist sessions and issue data after refresh.
- Automated domain, service, authentication, and UI tests.

## Training progress

- **Day 1 — React state and debugging:** built the local issue workflow and learned immutable state updates, form submission, filtering, and rendering.
- **Day 2 — Supabase persistence and security:** added authentication, database persistence, and per-user RLS isolation.
- **Day 3 — GitHub and Vercel deployment:** publish the project safely, diagnose a production-only environment failure, repair it, and verify the live application.

The production URL will be added only after the Day 3 deployment passes acceptance.

## Local setup

Create `.env.local` from `.env.example` and add only your Supabase Project URL and Publishable Key. Never place a Secret Key, `service_role` credential, or database password in a browser application.

```powershell
npm install
npm run dev
```

Open the local address printed by Vite.

## Verify the project

```powershell
npm test -- --run
npm run build
```

## Application data flow

1. React renders the authentication or issue workspace.
2. The auth service reads the current Supabase session and subscribes to changes.
3. The issue repository sends list, insert, and update operations through the Supabase client.
4. PostgREST translates those requests into PostgreSQL operations.
5. PostgreSQL evaluates RLS policies using the authenticated user identity.
6. Returned database rows update React state and the visible page.

## Security boundary

- `.env.local`, `node_modules`, and `dist` are ignored by Git.
- The browser receives only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Database ownership is enforced by RLS, not by UI filtering alone.
- Secret and service-role credentials must remain on a trusted server and are not used by this project.
