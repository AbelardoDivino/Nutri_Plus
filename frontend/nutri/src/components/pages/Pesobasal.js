function Pesobasal({ peso, altura, genero, sedentario, onPeso, onAltura, onGenero, onSedentario }) {
  return (
    <div className="pesobasal-form">
      <div className="form-group">
        <label htmlFor="pb-peso">Peso (kg)</label>
        <input
          id="pb-peso"
          type="number"
          placeholder="Ex: 70"
          value={peso}
          onChange={(e) => onPeso(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="pb-altura">Altura (cm)</label>
        <input
          id="pb-altura"
          type="number"
          placeholder="Ex: 175"
          value={altura}
          onChange={(e) => onAltura(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="pb-genero">Genero</label>
        <select id="pb-genero" value={genero} onChange={(e) => onGenero(e.target.value)}>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="pb-sedentario">Sedentário?</label>
        <select
          id="pb-sedentario"
          value={sedentario}
          onChange={(e) => onSedentario(e.target.value)}
        >
          <option value="Sim">Sim</option>
          <option value="Nao">Não</option>
        </select>
      </div>
    </div>
  );
}

export default Pesobasal;
