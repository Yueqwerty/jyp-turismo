import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Middleware de autenticación para proteger rutas
 * Requiere autenticación para /admin y APIs protegidas
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Proteger rutas de admin solo para usuarios ADMIN
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
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

        // Proteger rutas admin
        if (path.startsWith('/admin')) {
          return !!token;
        }

        // Permitir acceso a APIs públicas
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/api/cms/:path*'],
};
