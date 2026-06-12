import { json } from '@remix-run/node';
import { getSession, commitSession } from '~/utils/session.server';

export async function action({ request }) {
  const formData = await request.formData();
  const theme = formData.get('theme');

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
