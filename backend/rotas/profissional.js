const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');

router.post('/cadastro', async (req, resp) => {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha) {
    return resp.json({ sucesso: false, erro: 'Preencha nome, email e senha' });
  }
  if (senha.length < 8) {
    return resp.json({ sucesso: false, erro: 'Senha deve ter no mínimo 8 caracteres' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const sql = 'INSERT INTO profissionais (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';

  db.query(sql, [nome, email, senhaHash, telefone || null], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return resp.json({ sucesso: false, erro: 'Nome ou email já cadastrado como profissional' });
      }
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return resp.json({ sucesso: false, erro: 'Tabela profissionais não existe. Execute backend/sql/setup_profissionais.sql' });
      }
      return resp.json({ sucesso: false, erro: err.message });
    }
    resp.json({
      sucesso: true,
      id: result.insertId,
      profissional: { id: result.insertId, nome, email, telefone },
    });
  });
});

router.get('/', async (req, resp) => {
  db.query('SELECT id, nome, email FROM profissionais ORDER BY nome', (err, results) => {
    if (err) return resp.status(500).json({ sucesso: false, erro: err.message });
    resp.json({ sucesso: true, profissionais: results });
  });
});

router.post('/login', async (req, resp) => {
  const { nome, senha } = req.body;

  const sql = 'SELECT id, nome, email, telefone, senha FROM profissionais WHERE nome = ?';
  db.query(sql, [nome], async (err, results) => {
    if (err) return resp.json({ sucesso: false, erro: err.message });
    if (!results.length) return resp.json({ sucesso: false, erro: 'Profissional não encontrado' });

    const match = await bcrypt.compare(senha, results[0].senha);
    if (!match) return resp.json({ sucesso: false, erro: 'Senha incorreta' });

    const { senha: _, ...profissional } = results[0];
    resp.json({ sucesso: true, profissional });
  });
});

module.exports = router;
