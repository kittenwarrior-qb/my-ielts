import type { APIRoute } from 'astro';
import { getSession, parseSessionToken } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  const session = getSession(cookies);
  
  if (!session) {
    return new Response(
      JSON.stringify({ 
        isLoggedIn: false,
        isAdmin: false,
        username: null
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Parse session to get user info
  const userData = parseSessionToken(session);
  
  if (!userData) {
    return new Response(
      JSON.stringify({ 
        isLoggedIn: false,
        isAdmin: false,
        username: null
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  return new Response(
    JSON.stringify({ 
      isLoggedIn: true,
      isAdmin: userData.isAdmin,
      username: userData.username
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
