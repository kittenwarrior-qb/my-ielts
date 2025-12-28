import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  
  // If path starts with /dashboard but is not exactly /dashboard
  // and is not an API route, serve the dashboard SPA
  if (url.pathname.startsWith('/dashboard') && 
      url.pathname !== '/dashboard' && 
      !url.pathname.startsWith('/dashboard/api')) {
    // Let Astro handle it with the catch-all route
    return next();
  }
  
  return next();
});
