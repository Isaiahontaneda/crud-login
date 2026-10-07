import { NextResponse } from 'next/server';
import * as Producto from '@/models/productoModel';

export async function listar() {
  return NextResponse.json(await Producto.listar());
}

export async function crear(request) {
  const { nombre, precio } = await request.json();
  if (!nombre || precio === '' || precio === undefined) {
    return NextResponse.json(
      { error: 'Nombre y precio son obligatorios' },
      { status: 400 }
    );
  }
  const nuevo = await Producto.crear({ nombre, precio });
  return NextResponse.json(nuevo, { status: 201 });
}

export async function actualizar(request, id) {
  const { nombre, precio } = await request.json();
  if (!nombre || precio === '' || precio === undefined) {
    return NextResponse.json(
      { error: 'Nombre y precio son obligatorios' },
      { status: 400 }
    );
  }
  const actualizado = await Producto.actualizar(id, { nombre, precio });
  if (!actualizado) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }
  return NextResponse.json(actualizado);
}

export async function eliminar(id) {
  const borrado = await Producto.eliminar(id);
  if (!borrado) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}