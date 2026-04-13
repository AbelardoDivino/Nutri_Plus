const express = require('express')
const rota = require('rota')

const app = express()

app.use(rota())
app.use(express.json())

// rota teste

app.get('/',(req,resp)=>{
    resp.send('api rodando')
})

