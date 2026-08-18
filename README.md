# Personal portfolio

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
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run dev:storybook` | Storybook on port 6006 |
| `npm run build:storybook` | Static Storybook build |
| `npm run deploy` | Build and deploy to Vercel production |

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
