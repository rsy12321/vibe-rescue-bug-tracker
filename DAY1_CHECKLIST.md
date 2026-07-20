# Day 1 Learner Checklist

Do not search for prepared answers. Open the source files and answer in your own words.

## Run and use the app

- [x] Run `npm run dev`.
- [x] Add two different issues.
- [x] Mark one issue as resolved.
- [x] Verify the All, Open, and Resolved filters.
- [x] Refresh the page and record what happens to the issues.

## Explain the code

- [x] What does `src/main.tsx` do?
- [x] Which three values are stored as state in `src/App.tsx`?
- [x] Why does the form call `event.preventDefault()`?
- [x] What enters and leaves `createIssue()`?
- [x] Why does `toggleIssueStatus()` return a new array instead of modifying the old array?
- [x] What is the difference between `issues` and `visibleIssues`?

## Troubleshooting observation

Write down:

1. One mistake that would prevent the page from rendering.
2. One mistake that would make filtering appear broken.
3. One browser or terminal message you would inspect first if the app stopped working.

## Day 1 pass condition

You pass Day 1 when you can run the app, demonstrate all three behaviors, and explain the flow `main.tsx -> App.tsx -> domain function -> state update -> rendered UI` without reading `README.md`.

## Result

**PASS — 2026-07-20**

Verified observations:

- React state is memory-only, so refreshing resets the issue list.
- Filtering derives `visibleIssues` without deleting anything from `issues`.
- Immutable array updates give React a new reference and trigger rendering reliably.
- `event.preventDefault()` prevents native form navigation and preserves the single-page flow.
- The learner correctly explained the add flow from input state through `createIssue()`, `setIssues()`, filtering, and rendering.
