require('dotenv').config()
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'nutriplus'
})

connection.connect((err)=>{
    if (err) {
        console.log("erro",err)
    }
    else{
        console.log("conectado ao MYSQL")
    }
})

module.exports = connection