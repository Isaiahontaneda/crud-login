import fs from 'fs';
import path from 'path';

const archivo = path.join(process.cwd(), 'data', 'productos.json');

function leer() {
  return JSON.parse(fs.readFileSync(archivo, 'utf-8'));
}

function guardar(lista) {
  fs.writeFileSync(archivo, JSON.stringify(lista, null, 2));
}

export function listar() {
  return leer();
}

export function crear({ nombre, precio }) {
  const lista = leer();
  const nuevo = { id: Date.now(), nombre, precio: Number(precio) };
  lista.push(nuevo);
  guardar(lista);
  return nuevo;
}

export function actualizar(id, { nombre, precio }) {
  const lista = leer();
  const posicion = lista.findIndex((p) => p.id === id);
  if (posicion === -1) return null;
  lista[posicion] = { ...lista[posicion], nombre, precio: Number(precio) };
  guardar(lista);
  return lista[posicion];
}

export function eliminar(id) {
  const lista = leer();
  const nueva = lista.filter((p) => p.id !== id);
  if (nueva.length === lista.length) return false;
  guardar(nueva);
  return true;
}