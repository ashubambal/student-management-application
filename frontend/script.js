const API = "/api/students";

function addStudent(){

let name = document.getElementById("name").value;
let age = document.getElementById("age").value;
let branch = document.getElementById("branch").value;
let year = document.getElementById("year").value;

fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,age,branch,year})
})
.then(res=>res.json())
.then(data=>{
alert("Student Added")
loadStudents()
})

}

function loadStudents(){

fetch(API)
.then(res=>res.json())
.then(data=>{

let table = document.getElementById("students")
table.innerHTML=""

data.forEach(student => {

let row = document.createElement("tr")

row.innerHTML = `
<td>${student.name}</td>
<td>${student.age}</td>
<td>${student.branch}</td>
<td>${student.year}</td>
`

table.appendChild(row)

})

})

}

loadStudents()