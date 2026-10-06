import { NextResponse } from 'next/server';
import { verificarToken } from '@/lib/session';

export function proxy(request) {
  const token = request.cookies.get('session')?.value;

  if (verificarToken(token)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/productos/:path*', '/api/productos/:path*'],
};