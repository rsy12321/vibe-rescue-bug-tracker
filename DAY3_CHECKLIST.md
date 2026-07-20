# Day 3 GitHub and Vercel Deployment Checklist

## Local preflight

- [x] `.env.local`, `node_modules`, and `dist` are ignored.
- [x] Only the Supabase URL and Publishable Key are used by the browser app.
- [x] No Secret Key, `service_role` credential, or database password is present in publishable files.
- [x] All automated tests pass.
- [x] The production build succeeds.

## Git and GitHub

- [x] Git is initialized only inside the project directory with branch `main`.
- [x] The staged-file list is reviewed before the baseline commit.
- [x] `.env.local`, `node_modules`, and `dist` are absent from the commit.
- [x] The public GitHub repository is named `vibe-rescue-bug-tracker`.
- [x] The GitHub repository contains only the intended project files.

## Controlled Vercel failure

- [x] The GitHub repository is imported into a Vercel Hobby project.
- [x] The first deployment is created without Supabase environment variables.
- [x] The deployment status and browser symptom are recorded separately.
- [x] The missing environment variable is identified from runtime evidence.
- [x] The learner classifies the problem as a runtime configuration failure.

## Environment repair

- [x] `VITE_SUPABASE_URL` is configured for Production and Preview.
- [x] `VITE_SUPABASE_PUBLISHABLE_KEY` is configured for Production and Preview.
- [x] No Secret Key is configured in Vercel.
- [x] A new deployment is created after changing the environment variables.
- [x] The repaired production page loads without missing-environment errors.

## Supabase production URL

- [x] Supabase Auth Site URL uses the exact Vercel production URL.
- [x] The local development URL remains in Redirect URLs.
- [x] The production URL is allowed for authentication redirects.
- [x] No unnecessary broad production wildcard is used.

## Production acceptance

- [x] An existing user can sign in on the production URL.
- [x] Existing issues load from Supabase.
- [x] Refresh preserves the session and issue data.
- [x] A production verification issue can be created.
- [x] Its status update remains after refresh.
- [x] The browser console has no application or Supabase errors.

## Automatic deployment

- [x] README contains the verified production URL.
- [x] The README-only commit is reviewed before commit and push.
- [x] Pushing to `main` creates a new Vercel production deployment.

## Learner check

- [x] Explain `local -> GitHub -> Vercel build -> browser -> Supabase`.
- [x] Distinguish repository, build, runtime, and integration failures.
- [x] Explain the purpose of the `VITE_` prefix.
- [x] Explain why a Publishable Key is browser-safe with RLS and a Secret Key is not.

## Day 3 result

Status: **PASS**

Do not change this to **PASS** until every applicable check above has real evidence.

## Acceptance evidence

- GitHub repository: https://github.com/rsy12321/vibe-rescue-bug-tracker
- Production URL: https://vibe-rescue-bug-tracker.vercel.app
- Controlled failure: the first Vercel deployment was `Ready`, but the browser could not initialize because `VITE_SUPABASE_URL` was missing.
- Environment repair: the Supabase URL and Publishable Key were added to Vercel Production and Preview, then a new deployment loaded successfully.
- Supabase Auth: the Site URL uses the exact production URL; the local and production redirect URLs are both allowed.
- Production workflow: sign-in, existing-data loading, refresh persistence, issue creation, and status persistence were verified.
- Automatic deployment: commit `2f0918f` triggered a new Vercel production deployment with status `Ready`.
- Browser verification: the final production page loaded with no application or Supabase console errors.
- Credential safety: only browser-safe variable names are documented; no Secret Key, `service_role` credential, database password, or local environment file is published.
