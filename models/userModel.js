import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const archivo = path.join(process.cwd(), 'data', 'users.json');

function leerUsuarios() {
  return JSON.parse(fs.readFileSync(archivo, 'utf-8'));
}

export function encriptar(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

export function validarCredenciales(usuario, password) {
  const encontrado = leerUsuarios().find((u) => u.usuario === usuario);
  if (!encontrado) return false;
  return encontrado.password === encriptar(password);
}