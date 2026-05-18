import { FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <p>&copy; 2026 — Abelardo. Todos os direitos reservados.</p>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/valeriagomesnutrifit/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
