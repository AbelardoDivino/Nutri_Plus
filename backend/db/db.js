const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mysql = require('mysql2')

function buildConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL)
    return {
      host: url.hostname,
      port: Number(url.port),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 2,
      queueLimit: 0,
    }
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nutriplus',
  }
}

const pool = mysql.createPool(buildConfig())

module.exports = {
  query(sql, params, callback) {
    pool.query(sql, params, (err, results) => {
      if (err && err.message && err.message.includes('closed state')) {
        return pool.query(sql, params, callback)
      }
      callback(err, results)
    })
  },
}
