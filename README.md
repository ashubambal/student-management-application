# 🎓 Student Management System

### DevOps + Kubernetes + AWS EKS Project

A **full-stack Student Management System** deployed on **AWS EKS using Kubernetes**.
This project demonstrates how a **DevOps engineer can containerize applications, push images to DockerHub, and deploy them using Kubernetes with Ingress routing.**

The project follows a **3-tier architecture**:

* **Frontend** → HTML, CSS, JavaScript served by Nginx
* **Backend** → Node.js Express REST API
* **Database** → MySQL
* **Infrastructure** → Docker + Kubernetes (EKS) + Ingress

---

# 📌 Architecture Overview

```
                 🌐 User Browser
                        │
                        ▼
               AWS LoadBalancer (ELB)
                        │
                        ▼
                Kubernetes Ingress
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
   Frontend Service              Backend Service
      (Nginx)                   (NodeJS API)
                                        │
                                        ▼
                                     MySQL
```

### Request Flow

```
Browser
   │
   ▼
ELB → Ingress
   │
   ├── /        → Frontend (UI)
   │
   └── /api     → Backend API
                      │
                      ▼
                   MySQL
```

---

# 🛠 Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* Nginx

### Backend

* Node.js
* Express.js

### Database

* MySQL

### DevOps & Cloud

* Docker
* DockerHub
* Kubernetes
* AWS EKS
* Nginx Ingress Controller

---

# 📂 Project Structure

```
student-management-system
│
├── frontend
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── Dockerfile
│
├── backend
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── Dockerfile
│
├── k8s
│   ├── mysql-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── services.yaml
│   └── ingress.yaml
│
└── README.md
```

---

# 🚀 Application Features

✔ Add Students
✔ View Student List
✔ REST API backend
✔ Containerized using Docker
✔ Deployed on Kubernetes (EKS)
✔ Ingress-based routing

---

# ⚙️ Step 1 – Clone the Repository

```
git clone <repo-url>

cd student-management-system
```

---

# 🖥 Step 2 – Frontend Application

Frontend provides a simple UI to manage students.

### API Call

```
const API = "/api/students"
```

This endpoint is routed through **Ingress → Backend Service**.

---

# ⚙️ Step 3 – Backend API

Backend is built using **Node.js Express**.

### API Endpoints

```
GET   /api/students
POST  /api/students
```

### Example Code

```
app.get("/api/students",(req,res)=>{
  db.query("SELECT * FROM students",(err,result)=>{
    res.json(result)
  })
})

app.post("/api/students",(req,res)=>{
  db.query(
  "INSERT INTO students(name,age) VALUES(?,?)",
  [name,age])
})
```

---

# 🗄 Step 4 – MySQL Database

Create database and table.

```
CREATE DATABASE studentsdb;

USE studentsdb;

CREATE TABLE students(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
age INT
);
```

---

# 🐳 Step 5 – Build Docker Images

### Build Frontend Image

```
docker build -t <dockerhub-user>/student-frontend:v1 ./frontend
```

### Build Backend Image

```
docker build -t <dockerhub-user>/student-backend:v1 ./backend
```

---

# 📦 Step 6 – Push Images to DockerHub

Login to DockerHub

```
docker login
```

Push images

```
docker push <dockerhub-user>/student-frontend:v1
docker push <dockerhub-user>/student-backend:v1
```

---

# ☸️ Step 7 – Deploy to Kubernetes

Deploy MySQL

```
kubectl apply -f k8s/mysql-deployment.yaml
```

Deploy Backend

```
kubectl apply -f k8s/backend-deployment.yaml
```

Deploy Frontend

```
kubectl apply -f k8s/frontend-deployment.yaml
```

---

# 🔌 Step 8 – Create Kubernetes Services

Services allow communication between pods.

```
Frontend Service → Port 80
Backend Service  → Port 3000
MySQL Service    → Port 3306
```

Apply services

```
kubectl apply -f k8s/services.yaml
```

---

# 🌍 Step 9 – Install Ingress Controller

Install NGINX Ingress controller:

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/deploy.yaml
```

Verify installation:

```
kubectl get pods -n ingress-nginx
```

---

# 🌐 Step 10 – Configure Ingress

Ingress routes traffic to services.

```
/        → frontend-service
/api     → backend-service
```

Apply ingress configuration

```
kubectl apply -f k8s/ingress.yaml
```

---

# 🔎 Step 11 – Get External URL

Retrieve AWS LoadBalancer URL

```
kubectl get svc -n ingress-nginx
```

Example output:

```
ingress-nginx-controller
a1b2c3d4.us-east-1.elb.amazonaws.com
```

Open browser

```
http://a1b2c3d4.us-east-1.elb.amazonaws.com
```

---

# 🧪 Kubernetes Useful Commands

### Check Pods

```
kubectl get pods
```

### Check Services

```
kubectl get svc
```

### Check Ingress

```
kubectl get ingress
```

### View Logs

```
kubectl logs deployment/backend
```

---

# 🛠 Troubleshooting Guide

---

## ❌ Issue: Frontend shows 404 error

Example error:

```
open() "/usr/share/nginx/html/students" failed
```

### Cause

Frontend calling wrong API endpoint.

### Fix

Ensure `script.js` contains:

```
const API = "/api/students"
```

---

## ❌ Issue: Backend not receiving requests

Check ingress rules

```
kubectl describe ingress
```

Ensure routing exists:

```
/api → backend-service
```

---

## ❌ Issue: Backend cannot connect to MySQL

Check backend logs

```
kubectl logs deployment/backend
```

Verify database hostname in `db.js`

```
host: "mysql"
```

---

## ❌ Issue: Frontend changes not reflected

Rebuild and push Docker image

```
docker build -t <dockerhub-user>/student-frontend:v2 ./frontend
docker push <dockerhub-user>/student-frontend:v2
```

Update deployment

```
kubectl edit deployment frontend
```

---

## ❌ Issue: API not working

Test backend directly

```
kubectl port-forward svc/backend-service 3000:3000
```

Open browser

```
http://localhost:3000/api/students
```

Expected response

```
[]
```

---

# 📈 Future Improvements

Possible enhancements:

* Persistent Volume for MySQL
* Kubernetes Secrets for DB credentials
* Helm charts
* GitHub Actions CI/CD pipeline
* ArgoCD GitOps deployment
* Prometheus & Grafana monitoring
* Horizontal Pod Autoscaling

---

# 👨‍💻 Author

**Ashutosh Bambal**

DevOps
