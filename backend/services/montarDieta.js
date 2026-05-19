const { calcularTaxaBasal } = require('./calcularBasal');
const { MAPA_REFEICAO, montarRefeicao } = require('./taco');

async function gerarDietaCompleta(usuario) {
  const basal = calcularTaxaBasal({
    peso: usuario.peso,
    altura: usuario.altura,
    genero: usuario.genero,
    idade: usuario.idade,
    sedentario: usuario.sedentario,
  });

  if (!basal) {
    return { erro: 'Dados insuficientes para calcular taxa basal (peso e altura)' };
  }

  const total = basal.caloriasDia;
  const metaCafe = Math.round(total * 0.25);
  const metaAlmoco = Math.round(total * 0.4);
  const metaJanta = Math.round(total * 0.35);

  const [cafe, almoco, janta] = await Promise.all([
    montarRefeicao(MAPA_REFEICAO.cafe, metaCafe),
    montarRefeicao(MAPA_REFEICAO.almoco, metaAlmoco),
    montarRefeicao(MAPA_REFEICAO.janta, metaJanta),
  ]);

  return {
    taxa_basal: basal.tmb,
    calorias_dia: total,
    cafe: cafe.texto,
    almoco: almoco.texto,
    janta: janta.texto,
    cafe_calorias: cafe.calorias,
    almoco_calorias: almoco.calorias,
    janta_calorias: janta.calorias,
    calorias_totais: cafe.calorias + almoco.calorias + janta.calorias,
    dieta_json: JSON.stringify({
      taxa_basal: basal,
      refeicoes: { cafe, almoco, janta },
    }),
  };
}

module.exports = { gerarDietaCompleta };
