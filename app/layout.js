import './globals.css';

export const metadata = {
  title: 'CRUD con Login',
  description: 'Aplicación MVC con Next.js: CRUD y autenticación',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <section id="main-page">
          <header>
            <img
              className="logo"
              src="https://www.udla.edu.ec/assets/logo_new.svg"
              alt="logo udla"
            />
            <nav className="main-nav">
              <ul>
                <li><a href="/login">Login</a></li>
                <li><a href="/productos">Productos</a></li>
              </ul>
            </nav>
          </header>

          {children}

          <footer>
            <nav className="bottom-nav">
              <ul>
                <li><a href="/login">Login</a></li>
                <li><a href="/productos">Productos</a></li>
              </ul>
            </nav>
          </footer>
        </section>
      </body>
    </html>
  );
}