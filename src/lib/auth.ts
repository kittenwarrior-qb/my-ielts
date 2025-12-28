import type { AstroCookies } from 'astro';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Hardcoded credentials
const USERS = [
  { username: 'admin', password: 'Quoc@2604', isAdmin: true },
  { username: 'user', password: '123', isAdmin: false },
];

/**
 * Verify credentials and return user info
 */
export function verifyCredentials(username: string, password: string): { isValid: boolean; isAdmin: boolean } {
  const user = USERS.find(u => u.username === username && u.password === password);
  return {
    isValid: !!user,
    isAdmin: user?.isAdmin || false,
  };
}

/**
 * Create session token with user info
 */
export function createSessionToken(username: string, isAdmin: boolean): string {
  const data = { username, isAdmin, timestamp: Date.now() };
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

/**
 * Parse session token
 */
export function parseSessionToken(token: string): { username: string; isAdmin: boolean } | null {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString());
    return { username: data.username, isAdmin: data.isAdmin };
  } catch {
    return null;
  }
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
export function requireAuth(cookies: AstroCookies, redirectTo: string = '/dashboard'): boolean {
  return isAuthenticated(cookies);
}

/**
 * Admin user interface
 */
export interface AdminUser {
  isAdmin: boolean;
  sessionToken: string;
}

/**
 * Require admin authentication (use in API routes)
 */
export function requireAdmin(cookies: AstroCookies): boolean {
  const session = getSession(cookies);
  if (!session) return false;
  
  const userData = parseSessionToken(session);
  return userData?.isAdmin || false;
}

/**
 * Get admin status for UI rendering
 */
export function getAdminStatus(cookies: AstroCookies): AdminUser {
  const session = getSession(cookies);
  if (!session) {
    return { isAdmin: false, sessionToken: '' };
  }
  
  const userData = parseSessionToken(session);
  return {
    isAdmin: userData?.isAdmin || false,
    sessionToken: session,
  };
}
