import type { APIRoute } from 'astro';
import { verifyPassword, createSessionToken, setSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { password } = await request.json();

    if (!password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Password is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify password
    if (!verifyPassword(password)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create session
    const token = createSessionToken();
    setSessionCookie(cookies, token);

    return new Response(
      JSON.stringify({ success: true, message: 'Login successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Login failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
