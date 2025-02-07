import { createCookieSessionStorage, json } from '@remix-run/node';

export async function action({ request }) {
  const formData = await request.formData();
  const theme = formData.get('theme');

  const { getSession, commitSession } = createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 604_800, // 7 days in seconds
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET || 'default-secret'],
      secure: process.env.NODE_ENV === 'production',
    },
  });

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
