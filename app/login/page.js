'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');

    const respuesta = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    });

    if (respuesta.ok) {
      router.push('/productos');
    } else {
      const datos = await respuesta.json();
      setError(datos.error);
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>

      <div className="caja">
        <form onSubmit={manejarEnvio} className="formulario">
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </main>
  );
}