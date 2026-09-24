import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import type { ThemeId } from '~/components/theme-provider';
import { getSession } from '~/utils/session.server';
import { canonicalUrlFor } from '~/utils/url';
import { useNonce } from '~/utils/csp';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import JostVariable from '~/assets/fonts/jost-variable.woff2';

import { Error } from '~/layouts/error';
import type { RouteErrorLike } from '~/layouts/error/error';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Navbar } from '~/layouts/navbar';
import { Progress } from '~/components/progress';
import { personSchema, websiteSchema } from '~/utils/structured-data';
import { Analytics } from '@vercel/analytics/remix';
import styles from './root.module.css';
import './reset.css';
import './global.css';

const JS_FLAG_SCRIPT = "document.documentElement.dataset.js='';";

export const links = () => [
  // One variable file covers every weight the site uses, so a single
  // preload replaces the two the static Gotham cuts needed.
  {
    rel: 'preload',
    href: JostVariable,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/favicon.svg' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'shortcut_icon', href: '/shortcut.png', type: 'image/png', sizes: '64x64' },
  { rel: 'apple-touch-icon', href: '/icon-256.png', sizes: '256x256' },
  { rel: 'author', href: '/humans.txt', type: 'text/plain' },
];

export interface RootLoaderData {
  canonicalUrl: string;
  theme: ThemeId;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const canonicalUrl = canonicalUrlFor(new URL(request.url).pathname);

  // Read-only. This used to re-commit the session on every HTML response,
  // handing every visitor a cookie they never asked for and making every
  // page uncacheable. The theme cookie is only written by /api/set-theme.
  const session = await getSession(request.headers.get('Cookie'));
  const chosen = session.get('theme');
  // No saved choice: follow the OS setting where the browser sends it as a
  // client hint (Chromium), resolved on the server so there is no flash.
  const preferred = request.headers.get('Sec-CH-Prefers-Color-Scheme');
  const theme: ThemeId =
    chosen === 'light' || chosen === 'dark' ? chosen : preferred === 'light' ? 'light' : 'dark';

  return json<RootLoaderData>(
    { canonicalUrl, theme },
    {
      headers: {
        'Accept-CH': 'Sec-CH-Prefers-Color-Scheme',
        // Makes Chromium retry the very first request with the hint, rather
        // than only sending it from the second page view onwards.
        'Critical-CH': 'Sec-CH-Prefers-Color-Scheme',
        Vary: 'Sec-CH-Prefers-Color-Scheme, Cookie',
      },
    }
  );
};

/** Document responses carry the loader's client-hint and Vary headers. */
export const headers = ({ loaderHeaders }: { loaderHeaders: Headers }) => loaderHeaders;

export default function App() {
  const { canonicalUrl, theme: sessionTheme } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { state } = useNavigation();
  const nonce = useNonce();

  // Read the pending theme straight off the in-flight submission so the toggle
  // updates optimistically instead of waiting for the round trip.
  const theme = (
    fetcher.formData?.has('theme') ? fetcher.formData.get('theme') : sessionTheme
  ) as ThemeId;

  function toggleTheme(newTheme?: ThemeId) {
    fetcher.submit(
      { theme: newTheme ? newTheme : theme === 'dark' ? 'light' : 'dark' },
      { action: '/api/set-theme', method: 'post' }
    );
  }

  return (
    // suppressHydrationWarning: the inline script below adds data-js to this
    // element before React hydrates it.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/*
          Marks the document as scripted before first paint, so entrance
          animations can hide content without leaving it invisible for
          visitors, crawlers and failed loads that never run JavaScript.
        */}
        <script
          nonce={nonce}
          // The browser blanks the nonce attribute after load, so the client
          // render always disagrees with the server here.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Theme color doesn't support oklch so I'm hard coding these hexes for now */}
        <meta name="theme-color" content={theme === 'dark' ? '#111' : '#F2F2F2'} />
        <meta name="color-scheme" content={theme === 'light' ? 'light dark' : 'dark light'} />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema(), websiteSchema()]),
          }}
        />
      </head>
      <body data-theme={theme}>
        <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
          <Progress />
          <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
            Skip to main content
          </VisuallyHidden>
          <Navbar />
          <main
            id="main-content"
            className={styles.container}
            tabIndex={-1}
            data-loading={state === 'loading'}
          >
            <Outlet />
          </main>
        </ThemeProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Analytics />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const nonce = useNonce();

  return (
    // suppressHydrationWarning: the inline script below adds data-js to this
    // element before React hydrates it.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/*
          Marks the document as scripted before first paint, so entrance
          animations can hide content without leaving it invisible for
          visitors, crawlers and failed loads that never run JavaScript.
        */}
        <script
          nonce={nonce}
          // The browser blanks the nonce attribute after load, so the client
          // render always disagrees with the server here.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111" />
        <meta name="color-scheme" content="dark light" />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
      </head>
      <body data-theme="dark">
        {/* The error document is a full page in its own right, so it needs a
            main landmark like any other — without one there is nothing for a
            screen reader to jump to. */}
        <main id="main-content" className={styles.container} tabIndex={-1}>
          <Error error={error as RouteErrorLike} />
        </main>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Analytics />
      </body>
    </html>
  );
}
