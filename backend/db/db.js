const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mysql = require('mysql2')

function buildConfig() {
  const base = {
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  }

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL)
    base.host = url.hostname
    base.port = Number(url.port)
    base.user = decodeURIComponent(url.username)
    base.password = decodeURIComponent(url.password)
    base.database = url.pathname.slice(1)
    base.ssl = { rejectUnauthorized: false }
  } else {
    base.host = process.env.DB_HOST || 'localhost'
    base.user = process.env.DB_USER || 'root'
    base.password = process.env.DB_PASSWORD || ''
    base.database = process.env.DB_NAME || 'nutriplus'
  }

  return base
}

const pool = mysql.createPool(buildConfig())

pool.getConnection((err, conn) => {
  if (err) {
    console.log('erro ao conectar MySQL:', err.message)
  } else {
    console.log('conectado ao MySQL')
    conn.release()
  }
})

pool.on('error', (err) => {
  console.log('erro no pool MySQL:', err.message)
})

module.exports = pool
