const mysql = require("mysql2")

const pool = mysql.createPool({
  host: "mysql",          // k8s service name
  user: "root",
  password: "password",
  database: "studentsdb",

  waitForConnections: true,
  connectionLimit: 10,     // 🔥 important
  queueLimit: 0,

  connectTimeout: 10000    // 🔥 prevent hanging
})

// 🔥 Test connection at startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message)
  } else {
    console.log("✅ Connected to MySQL")
    connection.release()
  }
})

module.exports = pool