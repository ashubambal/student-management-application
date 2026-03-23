require('./tracing')   // 🔥 MUST BE FIRST LINE

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const db = require('./db')
const app = express()


app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

/* =========================
   Multer Configuration
========================= */

const storage = multer.diskStorage({

destination:(req,file,cb)=>{
cb(null,'uploads/')
},

filename:(req,file,cb)=>{
cb(null,Date.now()+path.extname(file.originalname))
}

})

const upload = multer({storage})

app.use("/uploads",express.static("uploads"))

/* =========================
   Student Registration
========================= */

app.post("/api/register",upload.single("photo"),(req,res)=>{

const {name,age,branch,year,email,password} = req.body

const photo=req.file ? req.file.filename : null

db.query(
"INSERT INTO students(name,age,branch,year,email,password,photo) VALUES(?,?,?,?,?,?,?)",
[name,age,branch,year,email,password,photo],
(err,result)=>{

if(err){
console.log(err)
return res.status(500).json({error:"Registration failed"})
}

res.json({
message:"Student registered",
studentId:result.insertId
})

})

})

/* =========================
   Student Login
========================= */

app.post("/api/login",(req,res)=>{

const {email,password}=req.body

db.query(
"SELECT * FROM students WHERE email=? AND password=?",
[email,password],
(err,result)=>{

if(err) return res.status(500).json(err)

if(result.length>0){

res.json({
success:true,
user:{
id:result[0].id,
name:result[0].name
}
})

}else{

res.json({success:false})

}

})

})

/* =========================
   Get Student Profile
========================= */

app.get("/api/student/:id",(req,res)=>{

const id=req.params.id

db.query(
"SELECT id,name,age,branch,year,email,photo FROM students WHERE id=?",
[id],
(err,result)=>{

if(err) return res.status(500).json(err)

res.json(result)

})

})

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000")
})