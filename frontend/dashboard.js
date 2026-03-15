const studentId = localStorage.getItem("studentId")

/* =========================
   Protect Dashboard
========================= */

if(!studentId){

window.location.href="index.html"

}

/* =========================
   Load Student Profile
========================= */

function loadStudent(){

fetch(`/api/student/${studentId}`)
.then(res=>res.json())
.then(data=>{

let table=document.getElementById("students")

table.innerHTML=""

data.forEach(student=>{

let row=document.createElement("tr")

row.innerHTML=`

<td>
<img src="http://backend-service:3000/uploads/${student.photo}" width="60" height="60" style="border-radius:50%">
</td>

<td>${student.name}</td>
<td>${student.age}</td>
<td>${student.branch}</td>
<td>${student.year}</td>
<td>${student.email}</td>

`

table.appendChild(row)

})

})

}

/* =========================
   Logout
========================= */

function logout(){

localStorage.removeItem("studentId")

window.location.href="index.html"

}

/* =========================
   Load Page
========================= */

loadStudent()