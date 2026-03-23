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
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files allowed"), false)
    }
  }
})

/* =========================
   Student Registration
========================= */

app.post("/api/register", upload.single("photo"), async (req, res, next) => {

  console.time("register-api")
  console.log("🔥 Register API hit")

  try {
    const { name, age, branch, year, email, password } = req.body

    // ✅ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // 🔥 Convert to numbers
    const ageNum = parseInt(age)
    const yearNum = parseInt(year)

    if (isNaN(ageNum) || isNaN(yearNum)) {
      return res.status(400).json({ error: "Age and Year must be numbers" })
    }

    const photo = req.file ? req.file.filename : null

    console.log("📦 File:", photo)

    // 🔥 DB QUERY WITH TIMEOUT
    const queryPromise = new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO students(name,age,branch,year,email,password,photo) VALUES(?,?,?,?,?,?,?)",
        [name, ageNum, branch, yearNum, email, password, photo],
        (err, result) => {
          if (err) reject(err)
          else resolve(result)
        }
      )
    })

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB Timeout")), 5000)
    )

    const result = await Promise.race([queryPromise, timeout])

    console.log("✅ Insert success")
    console.timeEnd("register-api")

    res.json({
      message: "Student registered",
      studentId: result.insertId
    })

  } catch (error) {
    console.error("❌ Error:", error)
    next(error)
  }
})

/* =========================
   Student Login
========================= */

app.post("/api/login", async (req, res) => {

  try {
    const { email, password } = req.body

    const queryPromise = new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM students WHERE email=? AND password=?",
        [email, password],
        (err, result) => {
          if (err) reject(err)
          else resolve(result)
        }
      )
    })

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB Timeout")), 5000)
    )

    const result = await Promise.race([queryPromise, timeout])

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

  } catch (error) {
    console.error("❌ Error:", error)
    res.status(500).json({ error: error.message })
  }
})

/* =========================
   Get Student Profile
========================= */

app.get("/api/student/:id", async (req, res) => {

  try {
    const id = req.params.id

    const queryPromise = new Promise((resolve, reject) => {
      db.query(
        "SELECT id,name,age,branch,year,email,photo FROM students WHERE id=?",
        [id],
        (err, result) => {
          if (err) reject(err)
          else resolve(result)
        }
      )
    })

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB Timeout")), 5000)
    )

    const result = await Promise.race([queryPromise, timeout])

    res.json(result)

  } catch (error) {
    console.error("❌ Error:", error)
    res.status(500).json({ error: error.message })
  }
})

/* =========================
   Global Error Handler
========================= */

app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err)

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({ error: err.message || "Something went wrong" })
})

/* =========================
   Health Check
========================= */

app.get('/health', (req, res) => {
  res.status(200).send("OK")
})

/* =========================
   Start Server
========================= */

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000")
})