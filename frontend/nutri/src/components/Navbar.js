function Navbar({ onSobre }) {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <img src="/imagens/imagenlogo.png" alt="Nutri+" />
      </a>
      <div className="navbar-links">
        <button type="button" onClick={onSobre}>
          Sobre
        </button>
        <a href="#mais">Mais</a>
        <a href="#entrar" className="nav-cta">
          Entrar
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
