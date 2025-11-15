import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Middleware de autenticación para proteger rutas
 * Requiere autenticación para /messages y /admin
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Proteger rutas de admin solo para usuarios ADMIN
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/messages', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Permitir acceso público a la landing page y login
        if (path === '/' || path === '/login') {
          return true;
        }

        // Requerir token para todas las demás rutas
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/messages/:path*', '/admin/:path*', '/api/messages/:path*'],
};
