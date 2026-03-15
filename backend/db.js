const mysql = require('mysql2')

const connection = mysql.createConnection({

host:"mysql",
user:"root",
password:"password",
database:"studentsdb"

})

connection.connect(err => {

if(err){
console.error("Database connection failed:",err)
return
}

console.log("Connected to MySQL")

})

module.exports = connection