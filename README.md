# CRUD con Login en Next.js (patrón MVC)

Tarea 3 de Ingeniería Web, Universidad de las Américas.

Es una aplicación pequeña con dos pantallas: un login y una página de productos donde se puede crear, ver, editar y eliminar registros. La página de productos solo se abre si antes se inició sesión. Si alguien escribe esa dirección sin haber entrado, el sistema lo devuelve al login.

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
| Modelo | `models/` | Lee y escribe los archivos JSON. No sabe nada de peticiones web. |
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
├── lib/session.js
├── data/                         (users.json y productos.json)
└── proxy.js
```

## Cómo funciona el login

La contraseña nunca se guarda como texto. En `data/users.json` se almacena su hash MD5. Cuando alguien inicia sesión, el sistema calcula el MD5 de lo que escribió y lo compara con el hash guardado. No hay forma de recuperar la contraseña original a partir del hash, así que la comparación es siempre entre dos hashes.

Si los datos son correctos, el servidor entrega una cookie llamada `session` con el formato `usuario.firma`. La firma se calcula con una clave que solo conoce el servidor, de modo que una cookie inventada a mano no pasa la verificación. La cookie es `httpOnly` y dura una hora.

## Cómo protegí las URLs

El archivo `proxy.js` se ejecuta antes de entrar a `/productos` y a `/api/productos`. Revisa la cookie y, si no es válida, hace una de dos cosas:

- En una página, redirige a `/login`.
- En la API, responde con un error 401.

Las rutas `/login` y `/api/auth/login` no están protegidas a propósito: si lo estuvieran, nadie podría iniciar sesión.

## Tecnologías

Next.js (App Router), React, Node.js, JavaScript, HTML y CSS. Los datos se guardan en archivos JSON.

## Cómo ejecutarlo

Se necesita Node.js 20.9 o superior.

```bash
git clone [URL-DEL-REPOSITORIO]
cd crud-login
npm install
npm run dev
```

Después se abre `http://localhost:3000` en el navegador.

Usuario de prueba: `admin` / `admin123`.

## Limitaciones

- Usé MD5 porque la tarea lo menciona como ejemplo, pero es un algoritmo obsoleto para contraseñas. En un sistema real usaría bcrypt o argon2.
- La clave con la que se firma la cookie está escrita en `lib/session.js`. Lo correcto sería leerla de una variable de entorno.
- Guardé los datos en archivos JSON para no depender de una base de datos. Si dos personas guardan al mismo tiempo, una escritura puede pisar a la otra. Como el modelo está aislado en `models/`, cambiarlo por una base de datos no obligaría a tocar las vistas ni los controladores.
- Solo existe un usuario y no hay pantalla de registro.

## Video de demostración

[ENLACE-DEL-VIDEO]

## Autor

[Isaiah Ontaneda, Ingeniería de Software, Universidad de las Américas.