/**
 * Taxa metabólica basal (TMB) — fórmula de Mifflin-St Jeor
 * altura em metros no banco; converte para cm no cálculo
 */
function calcularTaxaBasal({ peso, altura, genero, idade = 30, sedentario = 'Sim' }) {
  const pesoKg = Number(peso);
  let alturaCm = Number(altura);

  if (alturaCm > 0 && alturaCm < 3) {
    alturaCm = alturaCm * 100;
  }

  if (!pesoKg || pesoKg <= 0 || !alturaCm || alturaCm <= 0) {
    return null;
  }

  const idadeNum = Number(idade) || 30;
  let tmb;

  if (genero === 'Feminino') {
    tmb = 10 * pesoKg + 6.25 * alturaCm - 5 * idadeNum - 161;
  } else {
    tmb = 10 * pesoKg + 6.25 * alturaCm - 5 * idadeNum + 5;
  }

  const fator = sedentario === 'Nao' ? 1.375 : 1.2;
  const caloriasDia = Math.round(tmb * fator);

  return {
    tmb: Math.round(tmb),
    caloriasDia,
    fatorAtividade: fator,
  };
}

module.exports = { calcularTaxaBasal };
