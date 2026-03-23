// 🔥 Load tracing FIRST (safe mode)
try {
  require('./tracing')
} catch (err) {
  console.warn("⚠️ Tracing not loaded:", err.message)
}

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

/* =========================
   Ensure uploads folder exists
========================= */

const uploadDir = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log("📁 uploads folder created")
}

app.use("/uploads", express.static(uploadDir))

/* =========================
   Multer Configuration
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)   // 🔥 FIXED (absolute path)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 🔥 5MB limit
  }
})

/* =========================
   Student Registration
========================= */

app.post("/api/register", upload.single("photo"), (req, res, next) => {

  console.log("🔥 Register API hit")

  try {
    const { name, age, branch, year, email, password } = req.body
    const photo = req.file ? req.file.filename : null

    console.log("📦 File:", photo)

    db.query(
      "INSERT INTO students(name,age,branch,year,email,password,photo) VALUES(?,?,?,?,?,?,?)",
      [name, age, branch, year, email, password, photo],
      (err, result) => {

        if (err) {
          console.error("❌ DB Error:", err)
          return res.status(500).json({ error: "Registration failed" })
        }

        console.log("✅ Insert success")

        res.json({
          message: "Student registered",
          studentId: result.insertId
        })
      }
    )

  } catch (error) {
    console.error("🔥 Unexpected Error:", error)
    next(error)
  }
})

/* =========================
   Student Login
========================= */

app.post("/api/login", (req, res) => {

  try {
    const { email, password } = req.body

    db.query(
      "SELECT * FROM students WHERE email=? AND password=?",
      [email, password],
      (err, result) => {

        if (err) {
          console.error("❌ DB Error:", err)
          return res.status(500).json({ error: "Login failed" })
        }

        if (result.length > 0) {
          res.json({
            success: true,
            user: {
              id: result[0].id,
              name: result[0].name
            }
          })
        } else {
          res.json({ success: false })
        }
      }
    )

  } catch (error) {
    console.error("🔥 Unexpected Error:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

/* =========================
   Get Student Profile
========================= */

app.get("/api/student/:id", (req, res) => {

  try {
    const id = req.params.id

    db.query(
      "SELECT id,name,age,branch,year,email,photo FROM students WHERE id=?",
      [id],
      (err, result) => {

        if (err) {
          console.error("❌ DB Error:", err)
          return res.status(500).json({ error: "Failed to fetch student" })
        }

        res.json(result)
      }
    )

  } catch (error) {
    console.error("🔥 Unexpected Error:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

/* =========================
   Global Error Handler 🔥
========================= */

app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err)

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({ error: "Something went wrong" })
})

/* =========================
   Start Server
========================= */

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000")
})