const ALIMENTOS_FALLBACK = [
  { nome: 'Arroz, branco, cozido', kcal: 128, porcao: '100g' },
  { nome: 'Feijão, carioca, cozido', kcal: 76, porcao: '100g' },
  { nome: 'Frango, peito, grelhado', kcal: 159, porcao: '100g' },
  { nome: 'Ovo, de galinha, cozido', kcal: 146, porcao: '100g' },
  { nome: 'Banana, prata', kcal: 98, porcao: '100g' },
  { nome: 'Pão, francês', kcal: 300, porcao: '100g' },
  { nome: 'Leite, integral', kcal: 61, porcao: '100ml' },
  { nome: 'Batata, inglesa, cozida', kcal: 52, porcao: '100g' },
  { nome: 'Alface, crua', kcal: 11, porcao: '100g' },
  { nome: 'Maçã, fuji, com casca', kcal: 56, porcao: '100g' },
  { nome: 'Aveia, flocos', kcal: 394, porcao: '100g' },
  { nome: 'Iogurte, natural', kcal: 51, porcao: '100g' },
];

const MAPA_REFEICAO = {
  cafe: ['aveia', 'pão', 'leite', 'ovo', 'banana', 'iogurte', 'maçã'],
  almoco: ['arroz', 'feijão', 'frango', 'batata', 'alface', 'ovo'],
  janta: ['arroz', 'feijão', 'frango', 'salada', 'alface', 'batata', 'ovo'],
};

async function buscarNaApiTaco(termo) {
  const url = `https://taco-food-api.herokuapp.com/foods?description=${encodeURIComponent(termo)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const dados = await res.json();
    const lista = Array.isArray(dados) ? dados : dados.foods || [];
    if (!lista.length) return null;
    const item = lista[0];
    const kcal =
      item.energy?.kcal ??
      item.kcal ??
      item.energy_kcal ??
      item.calories ??
      null;
    if (!kcal) return null;
    return {
      nome: item.description || item.name || termo,
      kcal: Number(kcal),
      porcao: '100g',
      fonte: 'TACO API',
    };
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

function buscarFallback(termo) {
  const t = termo.toLowerCase();
  const found = ALIMENTOS_FALLBACK.find((a) => a.nome.toLowerCase().includes(t));
  return found ? { ...found, fonte: 'TACO (base local)' } : null;
}

async function buscarAlimento(termo) {
  const api = await buscarNaApiTaco(termo);
  if (api) return api;
  return buscarFallback(termo);
}

function buscarFallbackLista(termo, limite = 10) {
  const t = termo.toLowerCase().trim();
  if (!t) return [];
  return ALIMENTOS_FALLBACK.filter((a) => a.nome.toLowerCase().includes(t))
    .slice(0, limite)
    .map((a) => ({ ...a, fonte: 'TACO (base local)' }));
}

/** Auxilia o profissional: lista alimentos para consulta de calorias (não monta dieta). */
async function buscarAlimentosParaConsulta(termo) {
  const lista = buscarFallbackLista(termo);
  const api = await buscarNaApiTaco(termo);
  if (api && !lista.some((a) => a.nome === api.nome)) {
    lista.unshift(api);
  }
  return lista.slice(0, 10);
}

async function montarRefeicao(termos, caloriasAlvo) {
  const itens = [];
  let total = 0;

  for (const termo of termos) {
    const alimento = await buscarAlimento(termo);
    if (!alimento) continue;
    const fator = Math.min(1.5, Math.max(0.5, caloriasAlvo / 3 / alimento.kcal));
    const kcalPorcao = Math.round(alimento.kcal * fator);
    itens.push({
      alimento: alimento.nome,
      porcao: alimento.porcao,
      kcal: kcalPorcao,
      fonte: alimento.fonte,
    });
    total += kcalPorcao;
    if (total >= caloriasAlvo * 0.85) break;
  }

  return {
    itens,
    calorias: total,
    meta: caloriasAlvo,
    texto: itens.map((i) => `${i.alimento} (${i.kcal} kcal)`).join('; ') || 'Sem itens',
  };
}

module.exports = {
  ALIMENTOS_FALLBACK,
  MAPA_REFEICAO,
  buscarAlimento,
  buscarAlimentosParaConsulta,
  montarRefeicao,
};
