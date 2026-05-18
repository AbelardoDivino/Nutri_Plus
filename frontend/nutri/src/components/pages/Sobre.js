function Sobre({ onVoltar }) {
  return (
    <div className="form-card">
      <h1 className="form-title">Sobre o Nutri+</h1>
      <p className="form-subtitle">Entre em contato conosco</p>

      <div className="link-list">
        <a
          href="https://www.instagram.com/valeriagomesnutrifit/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://api.whatsapp.com/send/?phone=5538998371148&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onVoltar}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default Sobre;
