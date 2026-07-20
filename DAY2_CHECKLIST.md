# Day 2 Learner Checklist

## Database setup

- [x] Open the Supabase SQL Editor in `vibe-rescue-lab`.
- [x] Create a new query.
- [x] Paste and run `supabase/migrations/20260720_create_issues.sql`.
- [x] Confirm the result reports success.
- [x] Open Table Editor and confirm `public.issues` exists.
- [x] Confirm Row Level Security is enabled.

## Credential safety

- [x] Use only the Project URL and Publishable Key in the browser app.
- [x] Do not copy a Secret Key, legacy `service_role` key, or database password into the project or chat.

## Application acceptance

- [x] Sign up and sign in.
- [x] Add two issues and refresh.
- [x] Confirm both issues still exist.
- [x] Mark one issue resolved and refresh again.
- [x] Sign out and sign back in.
- [x] Confirm the same user sees the same issues.
- [x] Confirm a second user cannot see the first user's issues.

## Manual evidence recorded on 2026-07-20

- The first user retained two issues after refresh and after signing in again.
- The resolved status remained persisted after refresh.
- The second user started with an empty list and retained only their own issue.
- Returning to the first user showed only the first user's original issues.

## Day 2 pass condition

You pass Day 2 when you can explain the flow `React -> Supabase client -> PostgREST -> RLS -> PostgreSQL`, identify the difference between a publishable key and a secret key, and demonstrate per-user persistence after refresh.

## Knowledge check recorded on 2026-07-20

- The learner explained that React prepares the request, the Supabase client sends it, PostgREST translates the HTTP operation into a database query, and PostgreSQL evaluates RLS using the authenticated user's identity before reading or writing rows.
- The learner identified that a publishable API key is browser-safe only when database permissions and RLS are correctly configured, while a secret or service-role key is privileged, can bypass RLS, and must remain server-side.

## Day 2 result

**PASS**
