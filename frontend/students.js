const API = "/api/students";

function addStudent() {

  const btn = document.querySelector("button")
  btn.disabled = true
  btn.innerText = "Adding..."

  let name = document.getElementById("name").value.trim()
  let age = document.getElementById("age").value.trim()
  let branch = document.getElementById("branch").value.trim()
  let year = document.getElementById("year").value.trim()

  if (!name || !age || !branch || !year) {
    alert("All fields required")
    reset(btn)
    return
  }

  if (isNaN(age) || isNaN(year)) {
    alert("Invalid input")
    reset(btn)
    return
  }

  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, branch, year })
  })
    .then(async res => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      return data
    })
    .then(() => {
      alert("✅ Student Added")
      loadStudents()
    })
    .catch(err => {
      console.error(err)
      alert("❌ " + err.message)
    })
    .finally(() => reset(btn))
}

function loadStudents() {

  fetch(API)
    .then(res => res.json())
    .then(data => {

      let table = document.getElementById("students")
      table.innerHTML = ""

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
    .catch(err => {
      console.error(err)
      alert("❌ Failed to load students")
    })
}

function reset(btn) {
  btn.disabled = false
  btn.innerText = "Add Student"
}

loadStudents()