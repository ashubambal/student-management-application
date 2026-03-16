const mysql = require("mysql2")

let connection

function connectDatabase(){

connection = mysql.createConnection({

host:"mysql",
user:"root",
password:"password",
database:"studentsdb"

})

connection.connect(err => {

if(err){

console.log("MySQL not ready, retrying in 5 seconds...")
setTimeout(connectDatabase,5000)

}else{

console.log("Connected to MySQL")

}

})

}

connectDatabase()

module.exports = {
query:(sql,args)=>{
return connection.promise().query(sql,args)
}
}