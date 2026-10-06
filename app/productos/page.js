'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  async function cargar() {
    const respuesta = await fetch('/api/productos');
    if (respuesta.ok) {
      setProductos(await respuesta.json());
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function guardar(evento) {
    evento.preventDefault();
    setError('');

    const url = editandoId ? `/api/productos/${editandoId}` : '/api/productos';
    const metodo = editandoId ? 'PUT' : 'POST';

    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio }),
    });

    if (!respuesta.ok) {
      const datos = await respuesta.json();
      setError(datos.error);
      return;
    }

    limpiarFormulario();
    cargar();
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
  }

  async function eliminar(id) {
    await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    cargar();
  }

  function limpiarFormulario() {
    setEditandoId(null);
    setNombre('');
    setPrecio('');
  }

  async function cerrarSesion() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <main>
      <div className="contenedor">
        <div className="barra">
          <h1>Productos</h1>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>

        <form onSubmit={guardar} className="formulario">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
          {editandoId && (
            <button type="button" onClick={limpiarFormulario}>
              Cancelar
            </button>
          )}
          {error && <p className="error">{error}</p>}
        </form>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>
                  <button onClick={() => editar(p)}>Editar</button>
                  <button onClick={() => eliminar(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}