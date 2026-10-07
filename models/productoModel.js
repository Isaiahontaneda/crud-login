import pool from '@/lib/db';

export async function listar() {
  const resultado = await pool.query(
    'SELECT id, nombre, precio FROM productos ORDER BY id'
  );
  return resultado.rows;
}

export async function crear({ nombre, precio }) {
  const resultado = await pool.query(
    'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING id, nombre, precio',
    [nombre, precio]
  );
  return resultado.rows[0];
}

export async function actualizar(id, { nombre, precio }) {
  const resultado = await pool.query(
    'UPDATE productos SET nombre = $1, precio = $2 WHERE id = $3 RETURNING id, nombre, precio',
    [nombre, precio, id]
  );
  if (resultado.rows.length === 0) return null;
  return resultado.rows[0];
}

export async function eliminar(id) {
  const resultado = await pool.query(
    'DELETE FROM productos WHERE id = $1',
    [id]
  );
  return resultado.rowCount > 0;
}