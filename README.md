# CRUD con Login en Next.js y PostgreSQL (patrón MVC)

Tarea 3 de Ingeniería Web, Universidad de las Américas.

Es una aplicación pequeña con dos pantallas: un login y una página de productos donde se puede crear, ver, editar y eliminar registros. La página de productos solo se abre si antes se inició sesión. Si alguien escribe esa dirección sin haber entrado, el sistema lo devuelve al login. Los datos se guardan en una base de datos PostgreSQL.

## Qué se puede hacer

- Iniciar sesión con usuario y contraseña.
- Ver la lista de productos en una tabla.
- Crear un producto indicando nombre y precio.
- Editar un producto: al pulsar "Editar", sus datos pasan al formulario y el botón cambia a "Actualizar".
- Eliminar un producto.
- Cerrar sesión desde la página de productos.

Si falta el nombre o el precio, el sistema muestra un mensaje de error en lugar de guardar el producto.

## Cómo apliqué el patrón MVC

Separé el código en tres capas para que cada archivo tenga una sola responsabilidad:

| Capa | Carpeta | Qué hace |
|---|---|---|
| Modelo | `models/` | Ejecuta las consultas SQL contra PostgreSQL. No sabe nada de peticiones web. |
| Vista | `app/login`, `app/productos`, `app/layout.js` | Lo que se ve en pantalla: formularios, tabla, logo y menú. |
| Controlador | `controllers/` | Recibe la petición, valida los datos, llama al modelo y decide qué código de respuesta devolver (200, 201, 400, 401 o 404). |

Los archivos `route.js` dentro de `app/api/` solo conectan cada dirección con su función del controlador. No tienen lógica propia.

```
crud-login/
├── app/
│   ├── api/
│   │   ├── auth/login/route.js
│   │   ├── auth/logout/route.js
│   │   └── productos/            (rutas del CRUD)
│   ├── login/page.js
│   ├── productos/page.js
│   ├── layout.js
│   └── globals.css
├── controllers/
├── models/
├── database/schema.sql           (tablas y usuario de prueba)
├── lib/
│   ├── db.js                     (conexión a PostgreSQL)
│   └── session.js                (cookie de sesión)
└── proxy.js
```

## Base de datos

Uso PostgreSQL con dos tablas:

- `usuarios` (id, usuario, password): la contraseña se guarda como hash MD5.
- `productos` (id, nombre, precio): el `id` lo genera la propia base.

Todas las consultas usan parámetros (`$1`, `$2`) en lugar de unir el texto escrito por la persona a la consulta. Así se evita la inyección SQL.

## Cómo funciona el login

La contraseña nunca se guarda como texto. Cuando alguien inicia sesión, el sistema calcula el MD5 de lo que escribió y lo compara con el hash guardado en la tabla `usuarios`. No hay forma de recuperar la contraseña original a partir del hash, así que la comparación es siempre entre dos hashes.

Si los datos son correctos, el servidor entrega una cookie llamada `session` con el formato `usuario.firma`. La firma se calcula con una clave que solo conoce el servidor, de modo que una cookie inventada a mano no pasa la verificación. La cookie es `httpOnly` y dura una hora.

## Cómo protegí las URLs

El archivo `proxy.js` se ejecuta antes de entrar a `/productos` y a `/api/productos`. Revisa la cookie y, si no es válida, hace una de dos cosas:

- En una página, redirige a `/login`.
- En la API, responde con un error 401.

Las rutas `/login` y `/api/auth/login` no están protegidas a propósito: si lo estuvieran, nadie podría iniciar sesión.

## Tecnologías

Next.js (App Router), React, Node.js, PostgreSQL (con la librería `pg`), JavaScript, HTML y CSS.

## Cómo ejecutarlo

Requisitos: Node.js 20.9 o superior y PostgreSQL instalado (lo desarrollé con la versión 18).

1. Clonar el repositorio e instalar las dependencias:

```bash
git clone https://github.com/Isaiahontaneda/crud-login.git
cd crud-login
npm install
```

2. Crear en PostgreSQL una base de datos llamada `crud_login`.

3. Ejecutar el contenido de `database/schema.sql` sobre esa base (por ejemplo, con la Query Tool de pgAdmin). Crea las dos tablas y el usuario de prueba.

4. Crear en la raíz del proyecto un archivo `.env.local` con los datos de conexión:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crud_login
DB_USER=postgres
DB_PASSWORD=la_contraseña_de_tu_postgres
```

El puerto por defecto de PostgreSQL es 5432. En mi equipo usé el 5433, así que hay que ajustar `DB_PORT` según la instalación. Este archivo está en el `.gitignore` y no se sube al repositorio.

5. Iniciar la aplicación:

```bash
npm run dev
```

Después se abre `http://localhost:3000` en el navegador.

Usuario de prueba: `admin` / `admin123`.

## Limitaciones

- Usé MD5 porque la tarea lo menciona como ejemplo, pero es un algoritmo obsoleto para contraseñas. En un sistema real usaría bcrypt o argon2.
- La clave con la que se firma la cookie está escrita en `lib/session.js`. Lo correcto sería leerla de una variable de entorno.
- Solo existe un usuario y no hay pantalla de registro.
- No hay pruebas automáticas, las probé a mano.

## Video de demostración

(https://youtu.be/_Udp2pRp7mw)

## Autor

Isaiah Ontaneda, Ingeniería de Software, Universidad de las Américas.
