function Navbar({ onSobre }) {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <img src="/imagens/imagenlogo.png" alt="Nutri+" />
        <span className="navbar-brand">Nutri+</span>
      </a>
      <div className="navbar-links">
        <button type="button" onClick={onSobre}>
          Sobre
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
