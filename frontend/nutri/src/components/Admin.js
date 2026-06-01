import { useEffect, useState } from "react";

const API = "/api/admin";

function Admin({ onVoltar, profissional }) {
  const [usuarios, setUsuarios] = useState([]);
  const [naoAssociados, setNaoAssociados] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [detalhe, setDetalhe] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [notificar, setNotificar] = useState(true);
  const [sugerindo, setSugerindo] = useState(false);
  const [associando, setAssociando] = useState(null);

  const [buscaTaco, setBuscaTaco] = useState("");
  const [alimentosTaco, setAlimentosTaco] = useState([]);
  const [buscandoTaco, setBuscandoTaco] = useState(false);

  const [formDieta, setFormDieta] = useState({
    cafe: "",
    almoco: "",
    janta: "",
    cafe_calorias: "",
    almoco_calorias: "",
    janta_calorias: "",
  });

  const totalDieta =
    (Number(formDieta.cafe_calorias) || 0) +
    (Number(formDieta.almoco_calorias) || 0) +
    (Number(formDieta.janta_calorias) || 0);

  async function carregarUsuarios() {
    setCarregando(true);
    setErro("");
    try {
      const [resMeus, resLivres] = await Promise.all([
        fetch(`${API}/usuarios?profissional_id=${profissional?.id}`),
        fetch(`${API}/usuarios/nao-associados`),
      ]);
      const meus = await resMeus.json();
      const livres = await resLivres.json();
      if (meus.sucesso) setUsuarios(meus.usuarios);
      if (livres.sucesso) setNaoAssociados(livres.usuarios);
    } catch {
      setErro("Servidor offline. Inicie o backend na porta 3001.");
    } finally {
      setCarregando(false);
    }
  }

  async function associarPaciente(usuarioId) {
    setAssociando(usuarioId);
    setErro("");
    try {
      const res = await fetch(`${API}/usuarios/${usuarioId}/associar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profissional_id: profissional?.id }),
      });
      const dados = await res.json();
      if (dados.sucesso) {
        await carregarUsuarios();
      } else {
        setErro(dados.erro);
      }
    } catch {
      setErro("Erro ao associar paciente");
    } finally {
      setAssociando(null);
    }
  }

  async function carregarDetalhe(id) {
    setSelecionado(id);
    setErro("");
    setAlimentosTaco([]);
    try {
      const res = await fetch(`${API}/usuarios/${id}`);
      const dados = await res.json();
      if (dados.sucesso) {
        setDetalhe(dados);
        const d = dados.dieta;
        setFormDieta({
          cafe: d?.cafe || "",
          almoco: d?.almoco || "",
          janta: d?.janta || "",
          cafe_calorias: d?.cafe_calorias ?? "",
          almoco_calorias: d?.almoco_calorias ?? "",
          janta_calorias: d?.janta_calorias ?? "",
        });
      } else {
        setErro(dados.erro);
      }
    } catch {
      setErro("Erro ao carregar usuário");
    }
  }

  async function consultarTaco(e) {
    e?.preventDefault();
    if (buscaTaco.trim().length < 2) return;
    setBuscandoTaco(true);
    setErro("");
    try {
      const res = await fetch(
        `${API}/taco?busca=${encodeURIComponent(buscaTaco.trim())}`
      );
      const dados = await res.json();
      if (dados.sucesso) {
        setAlimentosTaco(dados.alimentos);
      } else {
        setErro(dados.erro);
        setAlimentosTaco([]);
      }
    } catch {
      setErro("Erro ao consultar TACO");
    } finally {
      setBuscandoTaco(false);
    }
  }

  async function sugerirDieta() {
    if (!selecionado) return;
    setSugerindo(true);
    setErro("");
    try {
      const res = await fetch(`${API}/sugerir-dieta/${selecionado}`);
      const dados = await res.json();
      if (dados.sucesso) {
        const s = dados.sugestao;
        setFormDieta({
          cafe: s.cafe.texto,
          almoco: s.almoco.texto,
          janta: s.janta.texto,
          cafe_calorias: s.cafe.calorias,
          almoco_calorias: s.almoco.calorias,
          janta_calorias: s.janta.calorias,
        });
      } else {
        setErro(dados.erro || "Erro ao sugerir dieta");
      }
    } catch {
      setErro("Erro ao gerar sugestão automática");
    } finally {
      setSugerindo(false);
    }
  }

  function adicionarAlimentoNaRefeicao(refeicao, alimento) {
    const linha = `${alimento.nome} — ${alimento.kcal} kcal/${alimento.porcao}`;
    setFormDieta((prev) => ({
      ...prev,
      [refeicao]: prev[refeicao] ? `${prev[refeicao]}\n${linha}` : linha,
    }));
  }

  async function salvarDieta(e) {
    e.preventDefault();
    if (!selecionado) return;
    setSalvando(true);
    setErro("");
    try {
      const res = await fetch(`${API}/dieta/${selecionado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cafe: formDieta.cafe,
          almoco: formDieta.almoco,
          janta: formDieta.janta,
          cafe_calorias: Number(formDieta.cafe_calorias) || 0,
          almoco_calorias: Number(formDieta.almoco_calorias) || 0,
          janta_calorias: Number(formDieta.janta_calorias) || 0,
          notificar,
        }),
      });
      const dados = await res.json();
      if (dados.sucesso) {
        await carregarDetalhe(selecionado);
        await carregarUsuarios();
        alert("Dieta publicada! O paciente já pode ver no app.");
      } else {
        setErro(dados.erro);
      }
    } catch {
      setErro("Erro ao salvar dieta");
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, [profissional?.id]);

  const u = detalhe?.usuario;
  const basal = detalhe?.calculo_basal;

  return (
    <div className="form-card form-card--wide admin-panel">
      <h1 className="form-title">Painel do profissional</h1>
      <p className="form-subtitle">
        {profissional ? `Bem-vindo, ${profissional.nome}` : "Nutrição / educação física"}
      </p>

      {erro && <p className="admin-erro">{erro}</p>}

      <div className="admin-grid">
        <section className="admin-lista">
          <h3>Meus pacientes</h3>
          {carregando ? (
            <p>Carregando...</p>
          ) : usuarios.length === 0 ? (
            <p>Nenhum paciente vinculado a você.</p>
          ) : (
            <ul className="admin-usuarios">
              {usuarios.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className={`admin-user-btn ${selecionado === user.id ? "ativo" : ""}`}
                    onClick={() => carregarDetalhe(user.id)}
                  >
                    <strong>{user.nome}</strong>
                    <span>{user.email}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {naoAssociados.length > 0 && (
            <>
              <h3 style={{ marginTop: "1.5rem" }}>Pacientes disponíveis</h3>
              <ul className="admin-usuarios">
                {naoAssociados.map((user) => (
                  <li key={user.id} className="admin-user-row">
                    <span>
                      <strong>{user.nome}</strong>
                      <span>{user.email}</span>
                    </span>
                    <button
                      type="button"
                      className="btn-mini"
                      disabled={associando === user.id}
                      onClick={() => associarPaciente(user.id)}
                    >
                      {associando === user.id ? "..." : "Vincular"}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="admin-detalhe">
          {!u ? (
            <p className="admin-placeholder">
              Selecione um paciente para ver os dados e montar a dieta.
            </p>
          ) : (
            <>
              <h3>Paciente — {u.nome}</h3>
              <div className="admin-dados">
                <p>
                  <strong>Email:</strong> {u.email || "—"}
                </p>
                <p>
                  <strong>Telefone:</strong> {u.telefone || "—"}
                </p>
                <p>
                  <strong>Peso:</strong> {u.peso ? `${u.peso} kg` : "—"}
                </p>
                <p>
                  <strong>Altura:</strong>{" "}
                  {u.altura
                    ? `${Number(u.altura) < 3 ? Number(u.altura) * 100 : u.altura} cm`
                    : "—"}
                </p>
                <p>
                  <strong>Gênero:</strong> {u.genero || "—"}
                </p>
                <p>
                  <strong>Sedentário:</strong> {u.sedentario || "—"}
                </p>
                {basal && (
                  <div className="admin-basal">
                    <p>
                      <strong>Referência TMB:</strong> {basal.tmb} kcal/dia
                    </p>
                    <p>
                      <strong>Referência calórica (estimada):</strong> {basal.caloriasDia}{" "}
                      kcal/dia
                    </p>
                    <small>
                      Valores automáticos só para apoio — a dieta é definida por você.
                    </small>
                  </div>
                )}
              </div>

              <section className="taco-auxiliar">
                <h3>Consulta TACO (auxílio)</h3>
                <p className="form-subtitle">
                  Busque alimentos para ver calorias e copiar para a dieta. O app não monta o
                  plano sozinho.
                </p>
                <form className="taco-busca" onSubmit={consultarTaco}>
                  <input
                    type="text"
                    placeholder="Ex: arroz, frango, banana..."
                    value={buscaTaco}
                    onChange={(e) => setBuscaTaco(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary" disabled={buscandoTaco}>
                    {buscandoTaco ? "Buscando..." : "Buscar"}
                  </button>
                </form>
                {alimentosTaco.length > 0 && (
                  <ul className="taco-resultados">
                    {alimentosTaco.map((a) => (
                      <li key={a.nome}>
                        <span>
                          {a.nome} — <strong>{a.kcal} kcal</strong> / {a.porcao}
                        </span>
                        <div className="taco-add-btns">
                          <button
                            type="button"
                            className="btn-mini"
                            onClick={() => adicionarAlimentoNaRefeicao("cafe", a)}
                          >
                            + Café
                          </button>
                          <button
                            type="button"
                            className="btn-mini"
                            onClick={() => adicionarAlimentoNaRefeicao("almoco", a)}
                          >
                            + Almoço
                          </button>
                          <button
                            type="button"
                            className="btn-mini"
                            onClick={() => adicionarAlimentoNaRefeicao("janta", a)}
                          >
                            + Jantar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <form onSubmit={salvarDieta} className="admin-form-dieta">
                <h3>Montar dieta do paciente</h3>
                <p className="admin-total-ref">
                  Total informado: <strong>{totalDieta} kcal</strong>
                  {basal && (
                    <span>
                      {" "}
                      (referência: {basal.caloriasDia} kcal/dia)
                    </span>
                  )}
                </p>

                <div className="form-actions" style={{ marginBottom: 16 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={sugerindo}
                    onClick={sugerirDieta}
                  >
                    {sugerindo ? "Gerando sugestão..." : "Sugerir dieta automática (baseada na TMB)"}
                  </button>
                </div>

                <div className="form-group">
                  <label>Café da manhã</label>
                  <textarea
                    rows={3}
                    value={formDieta.cafe}
                    onChange={(e) => setFormDieta({ ...formDieta, cafe: e.target.value })}
                    placeholder="Descreva o que o paciente deve comer no café..."
                  />
                  <input
                    type="number"
                    placeholder="Calorias desta refeição"
                    value={formDieta.cafe_calorias}
                    onChange={(e) =>
                      setFormDieta({ ...formDieta, cafe_calorias: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Almoço</label>
                  <textarea
                    rows={3}
                    value={formDieta.almoco}
                    onChange={(e) => setFormDieta({ ...formDieta, almoco: e.target.value })}
                    placeholder="Descreva o almoço..."
                  />
                  <input
                    type="number"
                    placeholder="Calorias desta refeição"
                    value={formDieta.almoco_calorias}
                    onChange={(e) =>
                      setFormDieta({ ...formDieta, almoco_calorias: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Jantar</label>
                  <textarea
                    rows={3}
                    value={formDieta.janta}
                    onChange={(e) => setFormDieta({ ...formDieta, janta: e.target.value })}
                    placeholder="Descreva o jantar..."
                  />
                  <input
                    type="number"
                    placeholder="Calorias desta refeição"
                    value={formDieta.janta_calorias}
                    onChange={(e) =>
                      setFormDieta({ ...formDieta, janta_calorias: e.target.value })
                    }
                  />
                </div>

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificar}
                      onChange={(e) => setNotificar(e.target.checked)}
                    />
                    {" "}Notificar o paciente por e-mail
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={salvando}>
                    {salvando ? "Salvando..." : "Publicar dieta para o paciente"}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>

      {onVoltar && (
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onVoltar}>
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

export default Admin;