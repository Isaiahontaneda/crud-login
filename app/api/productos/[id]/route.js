import { actualizar, eliminar } from '@/controllers/productoController';

export async function PUT(request, { params }) {
  const { id } = await params;
  return actualizar(request, Number(id));
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  return eliminar(Number(id));
}