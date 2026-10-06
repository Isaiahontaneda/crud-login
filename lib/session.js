import crypto from 'crypto';

const SECRETO = 'clave-secreta-de-desarrollo';

function firmar(valor) {
  return crypto.createHmac('sha256', SECRETO).update(valor).digest('hex');
}

export function crearToken(usuario) {
  return `${usuario}.${firmar(usuario)}`;
}

export function verificarToken(token) {
  if (!token) return false;
  const posicion = token.lastIndexOf('.');
  if (posicion === -1) return false;
  const usuario = token.slice(0, posicion);
  const firma = token.slice(posicion + 1);
  return firma === firmar(usuario);
}