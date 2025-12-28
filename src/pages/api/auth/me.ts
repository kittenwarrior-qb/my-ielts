import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';

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

  // If session exists, user is admin (based on current auth system)
  return new Response(
    JSON.stringify({ 
      isLoggedIn: true,
      isAdmin: true,
      username: 'admin'
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
