const express = require('express')
const router = express.Router()
const db = require('../db/db')

router.post('/login', (req, resp) => {
    const { nome, senha } = req.body
    
    const sql = "SELECT * FROM usuarios WHERE nome = ? AND senha = ?"
    db.query(sql, [nome, senha], (err, results) => {
        if (err) {
            resp.json({ erro: err.message })
        } else if (results.length > 0) {
            resp.json({ sucesso: true, usuario: results[0] })
        } else {
            resp.json({ sucesso: false, erro: "Credenciais inválidas" })
        }
    })
})

router.post('/cadastro', (req, resp) => {
    const { nome, senha, email, telefone } = req.body
    
    if (!nome || !senha || !email) {
        resp.json({ sucesso: false, erro: "Preencha todos os campos obrigatórios" })
        return
    }

    const sql = "INSERT INTO usuarios (nome, senha, email, telefone) VALUES (?, ?, ?, ?)"
    db.query(sql, [nome, senha, email, telefone], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                resp.json({ sucesso: false, erro: "Nome ou email já cadastrado" })
            } else {
                resp.json({ sucesso: false, erro: err.message })
            }
        } else {
            resp.json({ sucesso: true, id: result.insertId })
        }
    })
})

module.exports = router
