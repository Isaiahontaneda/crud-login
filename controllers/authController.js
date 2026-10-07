import { NextResponse } from 'next/server';
import { validarCredenciales } from '@/models/userModel';
import { crearToken } from '@/lib/session';

export async function login(request) {
  const { usuario, password } = await request.json();

  if (!(await validarCredenciales(usuario, password))) {
    return NextResponse.json(
      { error: 'Usuario o contraseña incorrectos' },
      { status: 401 }
    );
  }

  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set('session', crearToken(usuario), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
  return respuesta;
}

export function logout() {
  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.delete('session');
  return respuesta;
}