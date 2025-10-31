// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'es', 'ca'],
  defaultLocale: 'es'
});

export default function middleware(request: NextRequest) {
  // Excluir rutas de admin del middleware de i18n
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return;
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};