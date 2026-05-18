const express = require('express')
const router = express.Router()
const db = require('../db/db')
const mail = require('nodemailer')

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
    const { nome, senha, email, telefone, altura, genero, sedentario } = req.body

    if (!nome || !senha || !email) {
        resp.json({ sucesso: false, erro: "Preencha todos os campos obrigatórios" })
        return
    }
    if (!altura || !genero || !sedentario) {
        resp.json({ sucesso: false, erro: "Preencha altura, gênero e sedentário" })
        return
    }
    if (!['Masculino', 'Feminino'].includes(genero)) {
        resp.json({ sucesso: false, erro: "Gênero inválido" })
        return
    }
    if (!['Sim', 'Nao'].includes(sedentario)) {
        resp.json({ sucesso: false, erro: "Valor de sedentário inválido" })
        return
    }

    const sql = "INSERT INTO usuarios (nome, senha, email, telefone, altura, genero, sedentario) VALUES (?, ?, ?, ?, ?, ?, ?)"
    db.query(sql, [nome, senha, email, telefone, altura, genero, sedentario], (err, result) => {
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

router.post('/recuperar-senha', (req, resp) => {
    const { email, senha } = req.body

    if (!email || !email.includes('@')) {
        resp.json({ sucesso: false, erro: "Email inválido" })
        return
    }
    if (!senha || senha.length < 8) {
        resp.json({ sucesso: false, erro: "Senha deve ter no mínimo 8 caracteres" })
        return
    }

    const sql = "UPDATE usuarios SET senha = ? WHERE email = ?"
    db.query(sql, [senha, email], (err, result) => {
        if (err) {
            resp.json({ sucesso: false, erro: err.message })
        } else if (result.affectedRows === 0) {
            resp.json({ sucesso: false, erro: "Email não encontrado" })
        } else {
            resp.json({ sucesso: true, mensagem: "Senha alterada com sucesso!" })
        }
    })
})

module.exports = router
