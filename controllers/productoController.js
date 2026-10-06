import { NextResponse } from 'next/server';
import * as Producto from '@/models/productoModel';

export function listar() {
  return NextResponse.json(Producto.listar());
}

export async function crear(request) {
  const { nombre, precio } = await request.json();
  if (!nombre || precio === '' || precio === undefined) {
    return NextResponse.json(
      { error: 'Nombre y precio son obligatorios' },
      { status: 400 }
    );
  }
  return NextResponse.json(Producto.crear({ nombre, precio }), { status: 201 });
}

export async function actualizar(request, id) {
  const { nombre, precio } = await request.json();
  if (!nombre || precio === '' || precio === undefined) {
    return NextResponse.json(
      { error: 'Nombre y precio son obligatorios' },
      { status: 400 }
    );
  }
  const actualizado = Producto.actualizar(id, { nombre, precio });
  if (!actualizado) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }
  return NextResponse.json(actualizado);
}

export function eliminar(id) {
  const borrado = Producto.eliminar(id);
  if (!borrado) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}