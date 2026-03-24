const API = "/api/register"

function register() {

  const btn = document.querySelector("button")
  btn.disabled = true
  btn.innerText = "Registering..."

  let formData = new FormData()

  let name = document.getElementById("name").value.trim()
  let age = document.getElementById("age").value.trim()
  let branch = document.getElementById("branch").value.trim()
  let year = document.getElementById("year").value.trim()
  let email = document.getElementById("email").value.trim()
  let password = document.getElementById("password").value.trim()

  if (!name || !age || !branch || !year || !email || !password) {
    alert("All fields required")
    reset(btn)
    return
  }

  if (isNaN(age) || isNaN(year)) {
    alert("Age and Year must be numbers")
    reset(btn)
    return
  }

  formData.append("name", name)
  formData.append("age", age)
  formData.append("branch", branch)
  formData.append("year", year)
  formData.append("email", email)
  formData.append("password", password)

  let file = document.getElementById("photo").files[0]
  if (file) formData.append("photo", file)

  fetch(API, {
    method: "POST",
    body: formData
  })
    .then(async res => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      return data
    })
    .then(() => {
      alert("Registration Successful")
      window.location = "index.html"
    })
    .catch(err => {
      console.error(err)
      alert("❌ " + err.message)
    })
    .finally(() => reset(btn))
}

function reset(btn) {
  btn.disabled = false
  btn.innerText = "Register"
}