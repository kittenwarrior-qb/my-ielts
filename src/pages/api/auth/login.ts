import type { APIRoute } from 'astro';
import { verifyCredentials, createSessionToken, setSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    if (!username || !password) {
      return redirect('/login?error=missing');
    }

    // Verify credentials
    if (!verifyCredentials(username, password)) {
      return redirect('/login?error=invalid');
    }

    // Create session
    const token = createSessionToken();
    setSessionCookie(cookies, token);

    // Redirect to dashboard
    return redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return redirect('/login?error=server');
  }
};
