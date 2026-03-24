const studentId = localStorage.getItem("studentId")

if (!studentId) {
  window.location.href = "index.html"
}

function setStatus(msg, isError = false) {
  const statusDiv = document.getElementById("status")
  statusDiv.textContent = msg
  statusDiv.className = isError ? "error" : "success"
  setTimeout(() => statusDiv.textContent = "", 3000)
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

      const card = document.getElementById("profile-card")
      if (data.length > 0) {
        const student = data[0] // Assuming single student

        const photoSrc = student.photo ? `/uploads/${student.photo}` : 'https://via.placeholder.com/100x100?text=No+Photo'

        card.innerHTML = `
          <img src="${photoSrc}" alt="Profile Photo">
          <div class="info">
            <div><strong>Name:</strong> ${student.name}</div>
            <div><strong>Age:</strong> ${student.age}</div>
            <div><strong>Branch:</strong> ${student.branch}</div>
            <div><strong>Year:</strong> ${student.year}</div>
            <div><strong>Email:</strong> ${student.email}</div>
          </div>
        `
      } else {
        card.innerHTML = "<p>No profile data found.</p>"
      }
    })
    .catch(err => {
      console.error(err)
      setStatus("Failed to load profile", true)
    })
}

function logout() {
  localStorage.removeItem("studentId")
  window.location.href = "index.html"
}

/* =========================
   Logout
========================= */

function logout() {
  localStorage.removeItem("studentId")
  window.location.href = "index.html"
}

loadStudent()