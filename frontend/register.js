const API="/api/register"

function register(){

let formData=new FormData()

formData.append("name",document.getElementById("name").value)
formData.append("age",document.getElementById("age").value)
formData.append("branch",document.getElementById("branch").value)
formData.append("year",document.getElementById("year").value)
formData.append("email",document.getElementById("email").value)
formData.append("password",document.getElementById("password").value)

let file=document.getElementById("photo").files[0]

formData.append("photo",file)

fetch(API,{
method:"POST",
body:formData
})
.then(res=>res.json())
.then(data=>{
alert("Registration Successful")
window.location="index.html"
})

}