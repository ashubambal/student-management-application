const API = "/api/login"

function login() {

  const btn = document.querySelector("button")
  btn.disabled = true
  btn.innerText = "Logging in..."

  let email = document.getElementById("email").value.trim()
  let password = document.getElementById("password").value.trim()

  if (!email || !password) {
    alert("All fields required")
    reset(btn)
    return
  }

  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(async res => {
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Login failed")

      return data
    })
    .then(data => {

      if (data.success) {
        localStorage.setItem("studentId", data.user.id)
        window.location = "dashboard.html"
      } else {
        throw new Error("Invalid login")
      }

    })
    .catch(err => {
      console.error(err)
      alert("❌ " + err.message)
    })
    .finally(() => reset(btn))
}

function reset(btn) {
  btn.disabled = false
  btn.innerText = "Login"
}