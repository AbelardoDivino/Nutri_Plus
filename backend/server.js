const express = require('express')
const path = require('path')
const cors = require('cors')
const rotasUsuario = require('./rotas/usuario')
const rotasAdmin = require('./rotas/admin')
const rotasProfissional = require('./rotas/profissional')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/usuario', rotasUsuario)
app.use('/api/admin', rotasAdmin)
app.use('/api/profissional', rotasProfissional)

const db = require('./db/db')

app.get('/api/health', (req, resp) => {
  const hasUrl = !!process.env.DATABASE_URL
  const cfg = {
    hasUrl,
    host: hasUrl ? new URL(process.env.DATABASE_URL).hostname : (process.env.DB_HOST || 'localhost'),
  }
  db.query('SELECT 1 AS test', (err, results) => {
    if (err) return resp.json({ sucesso: false, erro: err.message, cfg })
    resp.json({ sucesso: true, db: 'ok', cfg })
  })
})

const frontendBuild = path.join(__dirname, '..', 'frontend', 'nutri', 'build')
app.use(express.static(frontendBuild))
app.get('{*caminho}', (req, resp) => {
  if (req.path.startsWith('/api')) {
    return resp.status(404).json({ erro: 'Rota não encontrada' })
  }
  resp.sendFile(path.join(frontendBuild, 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`)
})
