const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mysql = require('mysql2')

const config = process.env.DATABASE_URL
  ? { uri: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } }
  : {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nutriplus'
    }

const connection = mysql.createConnection(config)

connection.connect((err) => {
  if (err) {
    console.log('erro ao conectar MySQL:', err.message)
  } else {
    console.log('conectado ao MySQL')
  }
})

module.exports = connection