const API = "/api/register"

function register() {

  const btn = document.querySelector("button")
  btn.disabled = true
  btn.innerText = "Registering..."

  let formData = new FormData()

  formData.append("name", document.getElementById("name").value)
  formData.append("age", document.getElementById("age").value)
  formData.append("branch", document.getElementById("branch").value)
  formData.append("year", document.getElementById("year").value)
  formData.append("email", document.getElementById("email").value)
  formData.append("password", document.getElementById("password").value)

  let file = document.getElementById("photo").files[0]
  if (file) {
    formData.append("photo", file)
  }

  fetch(API, {
    method: "POST",
    body: formData
  })
    .then(async (res) => {
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something failed")
      }

      return data
    })
    .then(data => {
      alert("✅ Registration Successful")
      window.location = "index.html"
    })
    .catch(err => {
      console.error(err)
      alert("❌ Error: " + err.message)
    })
    .finally(() => {
      btn.disabled = false
      btn.innerText = "Register"
    })
}