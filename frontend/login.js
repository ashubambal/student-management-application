const API="/api/login"

function login(){

let email=document.getElementById("email").value
let password=document.getElementById("password").value

fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email,password})
})
.then(res=>res.json())
.then(data=>{

if(data.success){

localStorage.setItem("studentId",data.user.id)

window.location="dashboard.html"

}else{
alert("Invalid login")
}

})

}