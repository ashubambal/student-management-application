const studentId = localStorage.getItem("studentId")

if (!studentId) {
  window.location.href = "index.html"
}

function setStatus(msg, isError = false) {
  console.log(msg)
}

/* =========================
   Load Student Profile
========================= */

function loadStudent() {

  fetch(`/api/student/${studentId}`)
    .then(async res => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      return data
    })
    .then(data => {

      let table = document.getElementById("students")
      table.innerHTML = ""

      data.forEach(student => {

        let row = document.createElement("tr")

        row.innerHTML = `
          <td>
            <img src="/uploads/${student.photo}" 
                 width="60" height="60" 
                 style="border-radius:50%">
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
    .catch(err => {
      console.error(err)
      alert("Failed to load profile")
    })
}

/* =========================
   Logout
========================= */

function logout() {
  localStorage.removeItem("studentId")
  window.location.href = "index.html"
}

loadStudent()