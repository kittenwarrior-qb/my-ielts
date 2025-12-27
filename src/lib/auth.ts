import type { AstroCookies } from 'astro';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Verify admin password
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not set in environment variables');
    return false;
  }

  return password === adminPassword;
}

/**
 * Create session token (simple implementation)
 */
export function createSessionToken(): string {
  return Buffer.from(
    `${Date.now()}-${Math.random().toString(36)}`
  ).toString('base64');
}

/**
 * Set session cookie
 */
export function setSessionCookie(cookies: AstroCookies, token: string): void {
  cookies.set(SESSION_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Get session from cookie
 */
export function getSession(cookies: AstroCookies): string | undefined {
  return cookies.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(cookies: AstroCookies): boolean {
  const session = getSession(cookies);
  return !!session;
}

/**
 * Clear session cookie
 */
export function clearSession(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Require authentication (use in Astro pages)
 */
export function requireAuth(cookies: AstroCookies, redirectTo: string = '/admin'): boolean {
  return isAuthenticated(cookies);
}
