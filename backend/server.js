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
const cors = require('cors')
const rotasUsuario = require('./rotas/usuario')

const app = express()
const db = require('./db/db')

app.use(cors())
app.use(express.json())
app.use('/api/usuario', rotasUsuario)

app.get('/', (req, resp) => {
    resp.send('API rodando')
})

app.listen(3001, () => {
    console.log('Servidor na porta 3001')
})
