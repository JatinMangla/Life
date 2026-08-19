# Personal portfolio

[![CI](https://github.com/JatinMangla/Life/actions/workflows/ci.yml/badge.svg)](https://github.com/JatinMangla/Life/actions/workflows/ci.yml)

Source for [life-puce-kappa.vercel.app](https://life-puce-kappa.vercel.app) — the
portfolio site of Jatin Mangla, Frontend Developer.

Built with [Remix](https://remix.run) (SSR), [Vite](https://vitejs.dev),
[Three.js](https://threejs.org) for the WebGL scenes,
[Framer Motion](https://www.framer.com/motion/) for interaction, and CSS Modules
over a token-based theme. Deployed on Vercel.

## Credits

The visual design started from [Hamish Williams' open-source portfolio](https://github.com/HamishMW/portfolio)
and was rebuilt from there — the case-study content, `/uses` page, contact
pipeline, data layer and build tooling in this repo are my own.

## Getting started

```sh
npm install          # `postinstall` copies the Draco decoder into public/draco
cp .env.example .env # then fill in the values below
npm run dev          # http://localhost:7777
```

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | yes in production | Signs the theme-preference cookie. Generate with `openssl rand -hex 32`. |
| `GMAIL_USER` | for the contact form | Gmail account the contact form sends from. |
| `GMAIL_APP_PASSWORD` | for the contact form | Google app password (2FA → Security → App passwords), not the account password. |
| `CONTACT_TO` | no | Where contact-form messages are delivered. Defaults to `GMAIL_USER`. |

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Remix dev server on port 7777 |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest run |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright: axe accessibility audit + browser smoke tests |
| `npm run build` | Production build |
| `npm run dev:storybook` | Storybook on port 6006 |
| `npm run build:storybook` | Static Storybook build |
| `npm run deploy` | Build and deploy to Vercel production |

Node 24 is required (`engines`, `.nvmrc`); Vercel disables Node 20 for new
deployments on 1 October 2026.

## Testing

`npm test` runs Vitest with Testing Library against jsdom. The suite is
deliberately small and targeted rather than coverage-driven — most of it is
regression tests pinning down bugs that were found and fixed:

- `useWindowSize` returns `width`/`height` and never `undefined`
- `useInViewport` builds one observer, not one per render
- `Button` does not override a caller-supplied `rel` or `target`
- `Input` puts `onInvalid` on the field, where a non-bubbling event can reach it
- the contact endpoint rejects cross-origin posts, honours the honeypot, strips
  CRLF from header-bound values, and rate limits
- `baseMeta` emits a per-page `og:url` and no `undefined` values

Alongside the unit suite, `npm run test:e2e` drives a real browser: it runs
[axe](https://github.com/dequelabs/axe-core) over every page at desktop and
mobile widths against WCAG 2.1 AA, and asserts the keyboard skip link, the
theme toggle and the social links all work. Sections reveal on scroll from
`opacity: 0`, so the audit scrolls the page first — auditing without that
reports every un-revealed section as a false contrast failure.

CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests and build on
every push and pull request, the browser suite alongside it, and Lighthouse
against the live site on pushes to `main`.

## Asset scripts

Run these by hand after adding new project imagery; they are not part of the
build, so committed assets stay deterministic. All of them are idempotent —
running one twice is a no-op rather than a second lossy re-encode.

| Script | Purpose |
| --- | --- |
| `node scripts/placeholders.cjs` | Generate ~1KB blur-up placeholders for any project image missing one |
| `node scripts/optimize-images.cjs` | Re-encode project screenshots as WebP |
| `node scripts/optimize-gifs.cjs` | Re-encode animated GIFs as animated WebP, keeping the GIF if it wins |
| `node scripts/resize-profile.cjs` | Resize the portrait to the widths its srcSet declares |
| `node scripts/og-images.cjs` | Build a 1200x630 social preview per project |

## Architecture

```
app/
  components/    Design-system primitives (Button, Image, Model, Text …),
                 each a folder with its component, CSS module and story
  hooks/         Reusable behaviour (useInViewport, useWindowSize, useParallax …)
  layouts/       Page-level shells: navbar, footer, project and error layouts
  routes/        Remix flat routes; `/` is remapped to routes/home in vite.config.js
  utils/         Pure helpers — meta, style tokens, three.js loaders, session
  config.json    Site identity: name, role, disciplines, canonical URL, socials
```

Notable pieces:

- **Theming** — `components/theme-provider/theme.js` generates CSS custom
  properties from a token object; the choice persists in a cookie session and is
  read by the root loader so the first server render already has the right theme.
- **3D** — device models and the hero sphere are lazy-loaded behind
  `React.lazy` + `IntersectionObserver`, so Three.js stays out of the initial
  bundle for visitors who never scroll to them.
- **Contact form** — `routes/api.contact/route.js` is a resource route with no
  default export, so Nodemailer and the SMTP credentials never reach the client
  bundle. It applies a same-origin check, a honeypot field, header-injection
  stripping and a per-instance rate limit.

## Licence

Code is available for reference. The written content, case studies, imagery and
CV are not licensed for reuse.
