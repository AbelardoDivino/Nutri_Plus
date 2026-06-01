// const express = require('express')
// const rota = require('rota')

// const app = express()
// const db = require('./db/db')

// app.use(rota())
// app.use(express.json())

// // rota teste

// app.get('/',(req,resp)=>{
//     resp.send('api rodando')
// })



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

const frontendBuild = path.join(__dirname, '..', 'frontend', 'nutri', 'build')
app.use(express.static(frontendBuild))
app.get('*', (req, resp) => {
  if (req.path.startsWith('/api')) return
  resp.sendFile(path.join(frontendBuild, 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`)
})
