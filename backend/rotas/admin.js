const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { calcularTaxaBasal } = require('../services/calcularBasal');
const { buscarAlimentosParaConsulta, montarRefeicao, MAPA_REFEICAO } = require('../services/taco');
const { enviarDietaPorEmail } = require('../services/email');

const CAMPOS_USUARIO = `
  id, nome, email, telefone, altura, genero, sedentario,
  peso, idade
`;

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

router.get('/usuarios', async (req, resp) => {
  try {
    const profissionalId = req.query.profissional_id;
    let sql = `SELECT ${CAMPOS_USUARIO} FROM usuarios`;
    let params = [];
    if (profissionalId) {
      sql += ' WHERE profissional_id = ?';
      params.push(profissionalId);
    }
    sql += ' ORDER BY id DESC';
    const usuarios = await query(sql, params);
    resp.json({ sucesso: true, usuarios });
  } catch (err) {
    resp.status(500).json({ sucesso: false, erro: err.message });
  }
});

router.get('/usuarios/nao-associados', async (req, resp) => {
  try {
    const usuarios = await query(
      `SELECT ${CAMPOS_USUARIO} FROM usuarios WHERE profissional_id IS NULL ORDER BY id DESC`
    );
    resp.json({ sucesso: true, usuarios });
  } catch (err) {
    resp.status(500).json({ sucesso: false, erro: err.message });
  }
});

router.put('/usuarios/:id/associar', async (req, resp) => {
  try {
    const usuarioId = req.params.id;
    const { profissional_id } = req.body;
    if (!profissional_id) {
      return resp.status(400).json({ sucesso: false, erro: 'profissional_id é obrigatório' });
    }
    await query('UPDATE usuarios SET profissional_id = ? WHERE id = ?', [profissional_id, usuarioId]);
    resp.json({ sucesso: true, mensagem: 'Paciente associado ao profissional' });
  } catch (err) {
    resp.status(500).json({ sucesso: false, erro: err.message });
  }
});

router.get('/usuarios/:id', async (req, resp) => {
  try {
    const id = req.params.id;
    const rows = await query(`SELECT ${CAMPOS_USUARIO} FROM usuarios WHERE id = ?`, [id]);
    if (!rows.length) {
      return resp.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
    }

    const usuario = rows[0];
    let dietas = [];
    try {
      dietas = await query('SELECT * FROM dietas WHERE usuario_id = ?', [id]);
    } catch (e) {
      if (e.code !== 'ER_NO_SUCH_TABLE') throw e;
    }

    resp.json({
      sucesso: true,
      usuario,
      dieta: dietas[0] || null,
      calculo_basal: calcularTaxaBasal(usuario),
    });
  } catch (err) {
    resp.status(500).json({ sucesso: false, erro: err.message });
  }
});

/** Consulta TACO — só referência para o profissional montar a dieta manualmente */
router.get('/taco', async (req, resp) => {
  try {
    const busca = (req.query.busca || '').trim();
    if (busca.length < 2) {
      return resp.json({
        sucesso: false,
        erro: 'Digite pelo menos 2 letras para buscar um alimento',
      });
    }
    const alimentos = await buscarAlimentosParaConsulta(busca);
    resp.json({ sucesso: true, alimentos });
  } catch (err) {
    resp.status(500).json({ sucesso: false, erro: err.message });
  }
});

/** Sugere dieta automática baseada na TMB do paciente usando TACO */
router.get('/sugerir-dieta/:usuarioId', async (req, resp) => {
  try {
    const usuarioId = req.params.usuarioId;
    const rows = await query(`SELECT ${CAMPOS_USUARIO} FROM usuarios WHERE id = ?`, [usuarioId]);
    if (!rows.length) {
      return resp.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
    }
    const usuario = rows[0];
    const basal = calcularTaxaBasal(usuario);
    if (!basal) {
      return resp.status(400).json({ sucesso: false, erro: 'Dados insuficientes para calcular TMB' });
    }

    const totalCalorias = basal.caloriasDia;
    const divisao = {
      cafe: Math.round(totalCalorias * 0.25),
      almoco: Math.round(totalCalorias * 0.40),
      janta: Math.round(totalCalorias * 0.35),
    };

    const [cafe, almoco, janta] = await Promise.all([
      montarRefeicao(MAPA_REFEICAO.cafe, divisao.cafe),
      montarRefeicao(MAPA_REFEICAO.almoco, divisao.almoco),
      montarRefeicao(MAPA_REFEICAO.janta, divisao.janta),
    ]);

    resp.json({
      sucesso: true,
      basal,
      divisao,
      sugestao: {
        cafe: { texto: cafe.texto, calorias: cafe.calorias, itens: cafe.itens },
        almoco: { texto: almoco.texto, calorias: almoco.calorias, itens: almoco.itens },
        janta: { texto: janta.texto, calorias: janta.calorias, itens: janta.itens },
      },
    });
  } catch (err) {
    resp.status(500).json({ sucesso: false, erro: err.message });
  }
});

router.put('/dieta/:usuarioId', async (req, resp) => {
  try {
    const usuarioId = req.params.usuarioId;
    const { cafe, almoco, janta, cafe_calorias, almoco_calorias, janta_calorias, notificar } = req.body;

    const rows = await query('SELECT id FROM usuarios WHERE id = ?', [usuarioId]);
    if (!rows.length) {
      return resp.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
    }

    const total =
      Number(cafe_calorias || 0) +
      Number(almoco_calorias || 0) +
      Number(janta_calorias || 0);

    const usuario = (await query(`SELECT ${CAMPOS_USUARIO} FROM usuarios WHERE id = ?`, [usuarioId]))[0];
    const basal = calcularTaxaBasal(usuario);
    if (basal?.tmb) {
      try {
        await query('UPDATE usuarios SET taxa_basal = ? WHERE id = ?', [basal.tmb, usuarioId]);
      } catch (_) {
        // coluna taxa_basal pode não existir ainda
      }
    }

    const existente = await query('SELECT id FROM dietas WHERE usuario_id = ?', [usuarioId]);

    if (existente.length) {
      await query(
        `UPDATE dietas SET
          cafe = ?, almoco = ?, janta = ?,
          cafe_calorias = ?, almoco_calorias = ?, janta_calorias = ?,
          calorias_totais = ?
        WHERE usuario_id = ?`,
        [cafe, almoco, janta, cafe_calorias || 0, almoco_calorias || 0, janta_calorias || 0, total, usuarioId]
      );
    } else {
      await query(
        `INSERT INTO dietas
          (usuario_id, cafe, almoco, janta, cafe_calorias, almoco_calorias, janta_calorias, calorias_totais)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [usuarioId, cafe, almoco, janta, cafe_calorias || 0, almoco_calorias || 0, janta_calorias || 0, total]
      );
    }

    let emailResult = null;
    if (notificar && usuario.email) {
      const dieta = { cafe, almoco, janta, cafe_calorias, almoco_calorias, janta_calorias, calorias_totais: total };
      emailResult = await enviarDietaPorEmail({
        para: usuario.email,
        nome: usuario.nome,
        dieta,
        basal,
      });
    }

    const dieta = await query('SELECT * FROM dietas WHERE usuario_id = ?', [usuarioId]);
    resp.json({
      sucesso: true,
      dieta: dieta[0],
      mensagem: 'Dieta publicada para o paciente',
      email: emailResult,
    });
  } catch (err) {
    resp.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;
