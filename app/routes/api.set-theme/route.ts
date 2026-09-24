import { json } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { getSession, commitSession } from '~/utils/session.server';
import { isSameOrigin, readFormData } from '~/utils/request.server';

const THEMES = new Set(['light', 'dark']);

export async function action({ request }: ActionFunctionArgs) {
  // Any other site could otherwise flip a visitor's theme with a hidden form.
  if (!isSameOrigin(request)) {
    return json({ status: 'error' }, { status: 403 });
  }

  const theme = (await readFormData(request))?.get('theme');

  // Only the two known values are stored. Anything else used to be written
  // into the signed cookie verbatim, and a value over 4KB made commitSession
  // throw a 500.
  if (typeof theme !== 'string' || !THEMES.has(theme)) {
    return json({ status: 'error' }, { status: 400 });
  }

  const session = await getSession(request.headers.get('Cookie'));
  session.set('theme', theme);

  return json(
    { status: 'success' },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
}
