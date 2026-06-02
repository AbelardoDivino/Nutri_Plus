const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const { calcularTaxaBasal } = require('../services/calcularBasal');

const CAMPOS_PUBLICOS = `
  id, nome, email, telefone, altura, genero, sedentario,
  peso, idade
`;

router.post('/login', async (req, resp) => {
  const { nome, senha } = req.body;

  const sql = `SELECT ${CAMPOS_PUBLICOS}, senha FROM usuarios WHERE nome = ?`;
  db.query(sql, [nome], async (err, results) => {
    if (err) {
      resp.json({ sucesso: false, erro: err.message });
    } else if (results.length > 0) {
      const match = await bcrypt.compare(senha, results[0].senha);
      if (!match) {
        resp.json({ sucesso: false, erro: 'Credenciais inválidas' });
        return;
      }
      const { senha: _, ...usuario } = results[0];
      const calculo_basal = calcularTaxaBasal(usuario);
      resp.json({ sucesso: true, usuario, calculo_basal });
    } else {
      resp.json({ sucesso: false, erro: 'Credenciais inválidas' });
    }
  });
});

router.post('/cadastro', async (req, resp) => {
  const { nome, senha, email, telefone, altura, genero, sedentario, peso, idade, profissional_id } = req.body;

  if (!nome || !senha || !email) {
    resp.json({ sucesso: false, erro: 'Preencha todos os campos obrigatórios' });
    return;
  }
  if (!altura || !genero || !sedentario) {
    resp.json({ sucesso: false, erro: 'Preencha altura, gênero e sedentário' });
    return;
  }
  if (!['Masculino', 'Feminino'].includes(genero)) {
    resp.json({ sucesso: false, erro: 'Gênero inválido' });
    return;
  }
  if (!['Sim', 'Nao'].includes(sedentario)) {
    resp.json({ sucesso: false, erro: 'Valor de sedentário inválido' });
    return;
  }
  if (!idade || idade < 1 || idade > 120) {
    resp.json({ sucesso: false, erro: 'Idade deve estar entre 1 e 120' });
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const sql = `INSERT INTO usuarios (nome, senha, email, telefone, altura, genero, sedentario, peso, idade, profissional_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nome, senhaHash, email, telefone, altura, genero, sedentario, peso || null, idade, profissional_id || null], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        resp.json({ sucesso: false, erro: 'Nome ou email já cadastrado' });
      } else if (err.code === 'ER_BAD_FIELD_ERROR') {
        const sqlSimples = 'INSERT INTO usuarios (nome, senha, email, telefone, altura, genero, sedentario) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sqlSimples, [nome, senhaHash, email, telefone, altura, genero, sedentario], (err2, result2) => {
          if (err2) {
            resp.json({ sucesso: false, erro: err2.message });
          } else {
            resp.json({ sucesso: true, id: result2.insertId, aviso: 'Colunas extras não existem na tabela. Execute backend/sql/setup_dietas.sql se necessário.' });
          }
        });
      } else {
        resp.json({ sucesso: false, erro: err.message });
      }
    } else {
      resp.json({ sucesso: true, id: result.insertId });
    }
  });
});

router.get('/:id/dieta', (req, resp) => {
  const usuarioId = req.params.id;

  db.query(`SELECT ${CAMPOS_PUBLICOS} FROM usuarios WHERE id = ?`, [usuarioId], (err, users) => {
    if (err) return resp.json({ sucesso: false, erro: err.message });
    if (!users.length) {
      return resp.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
    }

    const usuario = users[0];
    const calculo_basal = calcularTaxaBasal(usuario);

    db.query('SELECT * FROM dietas WHERE usuario_id = ?', [usuarioId], (err2, dietas) => {
      if (err2) {
        if (err2.code === 'ER_NO_SUCH_TABLE') {
          return resp.json({ sucesso: true, usuario, calculo_basal, dieta: null, aviso: 'Tabela dietas não existe. Execute backend/sql/setup_dietas.sql' });
        }
        return resp.json({ sucesso: false, erro: err2.message });
      }

      resp.json({ sucesso: true, usuario, calculo_basal, dieta: dietas[0] || null });
    });
  });
});

router.get('/por-email/:email', async (req, resp) => {
  const email = req.params.email;
  const sql = `SELECT ${CAMPOS_PUBLICOS} FROM usuarios WHERE email = ?`;
  db.query(sql, [email], (err, results) => {
    if (err) return resp.status(500).json({ sucesso: false, erro: err.message });
    if (!results.length) return resp.json({ sucesso: false, erro: 'Email não encontrado' });
    const usuario = results[0];
    const calculo_basal = calcularTaxaBasal(usuario);
    resp.json({ sucesso: true, usuario, calculo_basal });
  });
});

router.post('/recuperar-senha', async (req, resp) => {
  const { email, senha } = req.body;

  if (!email || !email.includes('@')) {
    resp.json({ sucesso: false, erro: 'Email inválido' });
    return;
  }
  if (!senha || senha.length < 8) {
    resp.json({ sucesso: false, erro: 'Senha deve ter no mínimo 8 caracteres' });
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const sql = 'UPDATE usuarios SET senha = ? WHERE email = ?';
  db.query(sql, [senhaHash, email], (err, result) => {
    if (err) {
      resp.json({ sucesso: false, erro: err.message });
    } else if (result.affectedRows === 0) {
      resp.json({ sucesso: false, erro: 'Email não encontrado' });
    } else {
      resp.json({ sucesso: true, mensagem: 'Senha alterada com sucesso!' });
    }
  });
});

router.put('/:id', async (req, resp) => {
  const userId = req.params.id;
  const { peso, altura, genero, sedentario, idade, profissional_id } = req.body;

  const fields = [];
  const values = [];

  if (peso !== undefined) { fields.push('peso = ?'); values.push(peso); }
  if (altura !== undefined) { fields.push('altura = ?'); values.push(altura); }
  if (genero !== undefined) { fields.push('genero = ?'); values.push(genero); }
  if (sedentario !== undefined) { fields.push('sedentario = ?'); values.push(sedentario); }
  if (idade !== undefined) { fields.push('idade = ?'); values.push(idade); }
  if (profissional_id !== undefined) { fields.push('profissional_id = ?'); values.push(profissional_id); }

  if (!fields.length) {
    return resp.json({ sucesso: false, erro: 'Nenhum campo para atualizar' });
  }

  values.push(userId);
  const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) return resp.json({ sucesso: false, erro: err.message });
    resp.json({ sucesso: true });
  });
});

router.post('/cadastro-google', async (req, resp) => {
  const { nome, email } = req.body;

  if (!nome || !email || !email.includes('@')) {
    return resp.json({ sucesso: false, erro: 'Nome e email são obrigatórios' });
  }

  const crypto = require('crypto');
  const senhaGerada = 'google_' + crypto.randomBytes(16).toString('hex');
  const senhaHash = await bcrypt.hash(senhaGerada, 10);

  const sql = 'INSERT INTO usuarios (nome, senha, email) VALUES (?, ?, ?)';
  db.query(sql, [nome, senhaHash, email], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return resp.json({ sucesso: false, erro: 'Nome ou email já cadastrado' });
      }
      return resp.json({ sucesso: false, erro: err.message });
    }
    resp.json({
      sucesso: true,
      usuario: { id: result.insertId, nome, email }
    });
  });
});

module.exports = router;
