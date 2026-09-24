# CLAUDE.md — portfolio

Personal portfolio of Jatin Mangla. Remix 2 (Vite) + React 18 + TypeScript +
three.js, deployed on Vercel. Live: https://life-puce-kappa.vercel.app

**Read [HANDOFF.md](./HANDOFF.md) first** — it has the current state, what is
pending on the owner's side, and the next planned piece of work.

## Running things on this machine

`npm` / `npx` in Git Bash fail with `EPERM: lstat 'C:\Users\Administrator'`
(the nodejs folder is an nvm symlink into another Windows account). This is an
OS permission, not the sandbox. Also, the Bash tool has been seen to lose its
PATH entirely after a session restart — **prefer the PowerShell tool.**

Call entry points with node directly:

| Task | Command (from `portfolio/`) |
| --- | --- |
| npm | `node C:\Users\jmangla.AAPNAINFOTECH\AppData\Local\npm-standalone\node_modules\npm\bin\npm-cli.js <args>` |
| Typecheck | `node node_modules/typescript/bin/tsc --noEmit` |
| Lint | `node node_modules/eslint/bin/eslint.js app .storybook --max-warnings=0` |
| Unit tests | `node node_modules/vitest/vitest.mjs run` |
| Build | `node node_modules/@remix-run/dev/dist/cli.js vite:build` |
| Dev server | `node node_modules/@remix-run/dev/dist/cli.js vite:dev` (port 7777) |
| E2E | start the dev server first, then `node node_modules/@playwright/test/cli.js test` |
| E2E on the production build | build, then `$env:NODE_ENV='production'; node scripts/serve-build.mjs` (port 7778), then set `$env:BASE_URL='http://localhost:7778'` and run Playwright |

Playwright's own `webServer` runs `npm run dev`, which hits the EPERM above —
start the dev server yourself; `reuseExistingServer` picks it up.

Local Node is 20.16; the project and Vercel run Node 24.

Before calling any change done: typecheck, lint, unit tests and build must
pass, and e2e for anything user-visible (axe runs in light, dark and mobile).
Run e2e against the **production build** too: the dev server has hidden real
bugs (CSS cascade order differs once bundled — the mobile theme toggle was
invisible in production only; StrictMode double effects exist only in dev).

## Content rules — these matter more than the code

- **Every claim must be verifiable.** Case-study text is written from the
  project's README and commit history, never invented. If a detail isn't in a
  source, leave it out and ask. Numbers come from `app/data/experience.ts`
  (`metrics`, `employer`, `yearsOfExperience()`), never retyped into prose.
- **Mera Monitor is the owner's current employer's product** (AAPNA Infotech).
  Describe only his own contribution; no criticism of the product, no internal
  architecture beyond what is on the page, no real employee names or faces.
  Screenshots are the product's demo organisation ("Kevin", round numbers).
- **The Analytics MCP Server case study is anonymised.** Never name the product,
  its domain, endpoint paths, or the `meramonitor-mcp-server` repository
  anywhere public — `app/data/github-activity.test.ts` guards the snapshot.
- **growDhandha is deliberately not on the site** (owner's choice). It is
  excluded from the GitHub activity snapshot too.
- The owner's identity is "Frontend Web Developer" at AAPNA Infotech since
  2022-01. Don't inflate titles ("Lead") or metrics ("concurrent").

## Code conventions

- Data lives in `app/data/*.ts` (typed, `as const satisfies`). Adding a project
  = an entry in `projects.ts` + `app/routes/projects.<slug>/{route.ts,<slug>.tsx}`
  following the existing case studies, then `node scripts/og-images.cjs` (add
  it to the list there). Tests enforce a route, OG card, `updatedAt`, and
  source-or-reason for every project; the sitemap and e2e pick it up.
- **Never put a non-route file directly in `app/routes/`** — Remix flat routes
  treat every `.ts` there as a route (a stray test file once broke the build).
  Use a folder with `route.ts` beside its test.
- Declared image sizes must match the files: `app/assets/assets.test.ts` reads
  real dimensions. The page's largest image gets `priority`.
- Decorative WebGL goes inside `DecorativeBoundary`; call `cleanRenderer()`
  (which also forces context loss) on unmount.
- Brand assets (favicon, icons, social card) come from the monogram path in
  `app/components/monogram/monogram.tsx` via `node scripts/brand-assets.cjs`.
- The canonical origin is `url` in `app/config.json`; use
  `canonicalUrlFor()` from `app/utils/url.ts` rather than concatenating.
- Comments explain *why* (usually the bug that motivated the code), matching
  the existing style. Match surrounding idiom; CSS modules with tokens.
- Commit messages: imperative summary, body explaining why.

## Git

Remote `origin` is `git@github-personal:JatinMangla/Life.git`. Pushing to
`main` deploys production on Vercel — work on a branch and let the owner merge.
