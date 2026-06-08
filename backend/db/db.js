const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mysql = require('mysql2')

function buildConfig() {
  const base = {
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 10000,
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

const cfg = buildConfig()
console.log('DB config:', { host: cfg.host, port: cfg.port, user: cfg.user, database: cfg.database, ssl: !!cfg.ssl })

const pool = mysql.createPool(cfg)

pool.getConnection((err, conn) => {
  if (err) {
    console.log('erro ao conectar MySQL:', err.message)
    console.log('erro completo:', JSON.stringify({ code: err.code, errno: err.errno, sqlState: err.sqlState, fatal: err.fatal }))
  } else {
    console.log('conectado ao MySQL')
    conn.ping((pingErr) => {
      if (pingErr) console.log('ping falhou:', pingErr.message)
      else console.log('ping OK')
      conn.release()
    })
  }
})

pool.on('connection', (conn) => {
  console.log('nova conexao MySQL criada')
  conn.on('error', (err) => {
    console.log('erro na conexao MySQL:', err.message)
  })
  conn.on('end', () => {
    console.log('conexao MySQL encerrada')
  })
})

pool.on('error', (err) => {
  console.log('erro no pool MySQL:', err.message)
})

module.exports = pool
