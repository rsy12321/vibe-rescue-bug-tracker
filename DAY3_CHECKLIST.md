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
- [ ] `.env.local`, `node_modules`, and `dist` are absent from the commit.
- [ ] The public GitHub repository is named `vibe-rescue-bug-tracker`.
- [ ] The GitHub repository contains only the intended project files.

## Controlled Vercel failure

- [ ] The GitHub repository is imported into a Vercel Hobby project.
- [ ] The first deployment is created without Supabase environment variables.
- [ ] The deployment status and browser symptom are recorded separately.
- [ ] The missing environment variable is identified from runtime evidence.
- [ ] The learner classifies the problem as a runtime configuration failure.

## Environment repair

- [ ] `VITE_SUPABASE_URL` is configured for Production and Preview.
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` is configured for Production and Preview.
- [ ] No Secret Key is configured in Vercel.
- [ ] A new deployment is created after changing the environment variables.
- [ ] The repaired production page loads without missing-environment errors.

## Supabase production URL

- [ ] Supabase Auth Site URL uses the exact Vercel production URL.
- [ ] The local development URL remains in Redirect URLs.
- [ ] The production URL is allowed for authentication redirects.
- [ ] No unnecessary broad production wildcard is used.

## Production acceptance

- [ ] An existing user can sign in on the production URL.
- [ ] Existing issues load from Supabase.
- [ ] Refresh preserves the session and issue data.
- [ ] A production verification issue can be created.
- [ ] Its status update remains after refresh.
- [ ] The browser console has no application or Supabase errors.

## Automatic deployment

- [ ] README contains the verified production URL.
- [ ] The README-only commit is reviewed before commit and push.
- [ ] Pushing to `main` creates a new Vercel production deployment.

## Learner check

- [ ] Explain `local -> GitHub -> Vercel build -> browser -> Supabase`.
- [ ] Distinguish repository, build, runtime, and integration failures.
- [ ] Explain the purpose of the `VITE_` prefix.
- [ ] Explain why a Publishable Key is browser-safe with RLS and a Secret Key is not.

## Day 3 result

Status: **IN PROGRESS**

Do not change this to **PASS** until every applicable check above has real evidence.
