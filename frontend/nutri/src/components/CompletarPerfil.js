import { useEffect, useState } from "react";
import Pesobasal from "./pages/Pesobasal";

function CompletarPerfil({ usuario, onCompletou }) {
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalId, setProfissionalId] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [genero, setGenero] = useState("Masculino");
  const [sedentario, setSedentario] = useState("Sim");
  const [idade, setIdade] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch("/api/profissional")
      .then((r) => r.json())
      .then((d) => { if (d.sucesso) setProfissionais(d.profissionais); })
      .catch(() => {});
  }, []);

  async function handleSalvar() {
    if (!peso || Number(peso) <= 0) {
      alert("Informe um peso válido");
      return;
    }
    const alturaCm = Number(altura);
    if (!alturaCm || alturaCm < 50 || alturaCm > 250) {
      alert("Altura deve estar entre 50 e 250 cm");
      return;
    }
    if (!idade || idade < 1 || idade > 120) {
      alert("Idade deve estar entre 1 e 120 anos");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch(`/api/usuario/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(profissionalId ? { profissional_id: Number(profissionalId) } : {}),
          peso: Number(peso),
          altura: Number((Number(altura) / 100).toFixed(2)),
          genero,
          sedentario,
          idade: Number(idade),
        }),
      });
      const dados = await res.json();
      if (dados.sucesso) {
        onCompletou({ ...usuario, profissional_id: Number(profissionalId) });
      } else {
        alert(dados.erro || "Erro ao salvar");
      }
    } catch {
      alert("Erro ao conectar com o servidor");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="form-card form-card--wide">
      <h1 className="form-title">Completar cadastro</h1>
      <p className="form-subtitle">
        {usuario.nome}, escolha seu profissional e preencha seus dados para começar
      </p>

      <div className="form-group">
        <label htmlFor="comp-profissional">Escolha seu nutricionista / profissional</label>
        <select
          id="comp-profissional"
          value={profissionalId}
          onChange={(e) => setProfissionalId(e.target.value)}
        >
          <option value="">Selecione um profissional</option>
          {profissionais.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      <section className="pesobasal-section">
        <h3>Seus dados corporais</h3>
        <Pesobasal
          peso={peso}
          altura={altura}
          genero={genero}
          sedentario={sedentario}
          onPeso={setPeso}
          onAltura={setAltura}
          onGenero={setGenero}
          onSedentario={setSedentario}
        />
      </section>

      <div className="form-group">
        <label htmlFor="comp-idade">Idade</label>
        <input
          id="comp-idade"
          type="number"
          min={1}
          max={120}
          placeholder="Ex: 25"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={salvando}
          onClick={handleSalvar}
        >
          {salvando ? "Salvando..." : "Salvar e começar"}
        </button>
      </div>
    </div>
  );
}

export default CompletarPerfil;
