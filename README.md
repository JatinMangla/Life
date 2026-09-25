# Personal portfolio

[![CI](https://github.com/JatinMangla/Life/actions/workflows/ci.yml/badge.svg)](https://github.com/JatinMangla/Life/actions/workflows/ci.yml)

Source for [life-puce-kappa.vercel.app](https://life-puce-kappa.vercel.app) — the
portfolio site of Jatin Mangla, Frontend Developer.

Built with [Remix](https://remix.run) (SSR), [Vite](https://vitejs.dev),
[Three.js](https://threejs.org) for the WebGL scenes,
[Framer Motion](https://www.framer.com/motion/) for interaction, and CSS Modules
over a token-based theme. Deployed on Vercel.

## Licence and credits

This project began as a fork of
[Hamish Williams' portfolio](https://github.com/HamishMW/portfolio), which is
MIT licensed. That licence requires the original copyright notice to be
retained, so it lives in [LICENSE](./LICENSE) alongside mine.

The case-study content, `/uses` page, contact pipeline, data layer, brand
assets, test suite and build tooling here are my own. The written content,
imagery and CV are not licensed for reuse.

## Getting started

```sh
npm install          # `postinstall` copies the Draco decoder into public/draco
cp .env.example .env # then fill in the values below
npm run dev          # http://localhost:7777
```

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | recommended | Signs the theme-preference cookie. Generate with `openssl rand -hex 32`. Without it a fallback secret is used and a warning is logged. |
| `GMAIL_USER` | for the contact form | Gmail account the contact form sends from. |
| `GMAIL_APP_PASSWORD` | for the contact form | Google app password (2FA → Security → App passwords), not the account password. |
| `CONTACT_TO` | no | Where contact-form messages are delivered. Defaults to `GMAIL_USER`. |

### Deploying

The same variables must exist in Vercel under **Settings → Environment
Variables**, ticked for both **Production** and **Preview**. Two things catch
people out:

- Environment changes only apply to *new* deployments. After adding or
  editing a variable you have to redeploy — an existing deployment keeps the
  values it was built with.
- Preview deployments run with `NODE_ENV=production` but only see variables
  ticked for Preview.

If the contact form answers with "Server misconfiguration", the function log
names the missing variable — look in **Deployments → the deployment →
Functions**, or run `vercel logs <deployment-url>`.

The canonical origin lives in one place, `url` in `app/config.json`. Canonical
tags, `og:url`, the sitemap, `robots.txt`, structured data and the social cards
all derive from it; change it there when the site moves to its own domain.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Remix dev server on port 7777 |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm run typecheck` | `tsc --noEmit`, including e2e tests and config files |
| `npm test` | Vitest run |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright: axe accessibility audit + browser smoke tests |
| `npm run build` | Production build |
| `npm run dev:storybook` | Storybook on port 6006 |
| `npm run build:storybook` | Static Storybook build |
| `npm run deploy` | Build and deploy to Vercel production |

Node 24 is required. It is declared in three places that must agree:
`engines.node` in package.json, `.nvmrc` for local dev, and CI reads the
version from `.nvmrc`. On Vercel, `engines.node` overrides whatever the
project dashboard has selected, and `vercel-build` prints `node -v` so the
deployment log shows which version actually ran.

## Testing

`npm test` runs Vitest with Testing Library against jsdom. Most of it is
regression tests pinning down bugs that were found and fixed:

- every declared image size matches the real file (`app/assets/assets.test.ts`)
  — the Mera Monitor page once declared 856px screenshots as 1280x800
- the contact endpoint rejects cross-origin posts, honours the honeypot, strips
  CRLF, rejects addresses the mailer would re-parse, rate limits, and answers a
  non-form body with a 400
- `/api/set-theme` stores only `light` or `dark`, and only from this origin
- a WebGL scene that throws is dropped without taking the page with it
- a priority image is in the server HTML at high fetch priority
- `Button` renders `mailto:` and file links as plain anchors, not router links
- every project has a route, a social card, a date, and public source or a
  stated reason for none; case-study titles fit in search results
- the GitHub activity snapshot never names the repository behind the
  anonymised case study

`npm run test:e2e` drives a real browser. It runs
[axe](https://github.com/dequelabs/axe-core) against WCAG 2.1 AA over every
page — the list is derived from `app/data/projects.ts` — at desktop and mobile
widths and in both themes (the `light` project switches with the toggle first), and checks the skip link, theme toggle, contact
flow, social links, `/home` returning 404, and the sitemap. Sections reveal on
scroll, so the audit scrolls each page first.

Set `BASE_URL` to run the suite against a deployment instead of the dev
server. To test the production build locally — bundled CSS can cascade
differently from the dev server — run `npm run build`, then
`NODE_ENV=production node scripts/serve-build.mjs` and point `BASE_URL` at
`http://localhost:7778`. CI (`.github/workflows/ci.yml`) does exactly that when Vercel reports a
deployment, and runs Lighthouse against production deployments; on pushes and
pull requests it runs lint, a production dependency audit, typecheck, unit
tests, the build and the browser suite. For preview deployments behind Vercel
Authentication, add a `VERCEL_AUTOMATION_BYPASS_SECRET` repository secret.

## Asset scripts

Run these by hand after changing imagery; they are not part of the build, so
committed assets stay deterministic.

| Script | Purpose |
| --- | --- |
| `node scripts/brand-assets.cjs` | Favicon, PWA icons and the site social card, all from the monogram in `monogram.tsx` |
| `node scripts/og-images.cjs` | A 1200x630 social card per project |
| `node scripts/github-activity.cjs` | Snapshot recent public commits for the home page (also runs weekly in CI) |
| `node scripts/placeholders.cjs` | Blur-up placeholders for any project image missing one |
| `node scripts/optimize-images.cjs` | Re-encode project screenshots as WebP |
| `node scripts/optimize-gifs.cjs` | Re-encode animated GIFs as animated WebP |
| `node scripts/resize-profile.cjs <original>` | Both portrait sizes and the placeholder from one crop of the original photo |

## Architecture

```
app/
  components/    Design-system primitives (Button, Image, Model, Text …),
                 each a folder with its component and CSS module
  data/          Typed content: projects, experience, skills, bio, activity
  hooks/         Reusable behaviour (useInViewport, useWindowSize, useParallax …)
  layouts/       Page-level shells: navbar, project and error layouts
  routes/        Remix flat routes; the home page is routes/_index/
  utils/         Pure helpers — meta, structured data, CSP, URLs, three.js
  config.json    Site identity: name, role, email, canonical URL, socials
```

Notable pieces:

- **Theming** — `components/theme-provider/theme.ts` generates CSS custom
  properties from a token object. The site loads dark; a visitor's choice
  persists in a cookie that the root loader reads, so the first server render
  already has the right theme. (Following the OS setting through a client hint
  was tried and removed: it cost first-time visitors a second page request.)
- **3D** — device models and the hero sphere are lazy-loaded behind
  `React.lazy` + `IntersectionObserver`, so Three.js stays out of the initial
  bundle. Each scene sits in a `DecorativeBoundary`: without a usable GPU it
  disappears (device cards fall back to a poster) instead of breaking the page.
- **Contact form** — `routes/api.contact/route.ts` is a resource route with no
  default export, so Nodemailer and the SMTP credentials never reach the client
  bundle. It applies a same-origin check, a honeypot field, header-injection
  stripping and a per-instance rate limit.
- **Content Security Policy** — `entry.server.tsx` sends a nonce-based policy
  as `Content-Security-Policy-Report-Only`. Once a production deployment runs
  without reports, switch it to the enforcing header.
