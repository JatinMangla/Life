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
import { getSession, commitSession } from '~/utils/session.server';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import JostVariable from '~/assets/fonts/jost-variable.woff2';

import { Error } from '~/layouts/error';
import type { RouteErrorLike } from '~/layouts/error/error';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Navbar } from '~/layouts/navbar';
import { Progress } from '~/components/progress';
import config from '~/config.json';
import { personSchema, websiteSchema } from '~/utils/structured-data';
import { Analytics } from '@vercel/analytics/remix';
import styles from './root.module.css';
import './reset.css';
import './global.css';

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
  /** Resolved server-side so the footer year can't cause a hydration mismatch. */
  year: number;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { url } = request;
  const { pathname } = new URL(url);
  const pathnameSliced = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const canonicalUrl = `${config.url}${pathnameSliced}`;

  const session = await getSession(request.headers.get('Cookie'));
  const theme: ThemeId = session.get('theme') === 'light' ? 'light' : 'dark';

  // Resolved on the server so the footer year can't produce a hydration
  // mismatch when server and client sit either side of midnight on Dec 31.
  const year = new Date().getFullYear();

  return json<RootLoaderData>(
    { canonicalUrl, theme, year },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

export default function App() {
  const { canonicalUrl, theme: sessionTheme } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { state } = useNavigation();

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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
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
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
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
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}
