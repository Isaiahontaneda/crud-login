import crypto from 'crypto';
import pool from '@/lib/db';

export function encriptar(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

export async function validarCredenciales(usuario, password) {
  const resultado = await pool.query(
    'SELECT password FROM usuarios WHERE usuario = $1',
    [usuario]
  );

  if (resultado.rows.length === 0) return false;
  return resultado.rows[0].password === encriptar(password);
}