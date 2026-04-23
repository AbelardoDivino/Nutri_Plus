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

module.exports = router
