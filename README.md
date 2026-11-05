# 🎓 StudentHub – Student Management CRUD Application

StudentHub is a full-stack Student Management Application that allows users to manage student records with complete CRUD (Create, Read, Update, Delete) functionality.

The application is built using React, Node.js, Express.js, and MongoDB. It is containerized using Docker and deployed on an AWS EC2 Ubuntu instance.

## 🚀 Project Overview

StudentHub provides a simple interface to manage student information, including:

- Add new student records
- View all registered students
- Update existing student information
- Delete student records
- Search student records
- Store student data in MongoDB

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Vite | Frontend build tool |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Docker | Containerization |
| Nginx | Frontend web server and API reverse proxy |
| AWS EC2 | Cloud deployment |
| Ubuntu | Operating system |
| Git & GitHub | Version control |

## 🏗️ Project Architecture

```text
                 USER
                   |
                   |
             Port 3000
                   |
                   v
          FRONTEND CONTAINER
             React + Nginx
                   |
                   |
             API Requests
                   |
                   v
          BACKEND CONTAINER
          Node.js + Express
             Port 5000
                   |
                   |
             Database Query
                   |
                   v
          MONGODB CONTAINER
             Port 27017
```

All three containers communicate through a custom Docker bridge network named `student-network`.

## 📁 Project Structure

```text
student-crud-project/
│
├── student-backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Student.js
│   │   ├── routes/
│   │   │   └── studentRoutes.js
│   │   └── server.js
│   │
│   ├── Dockerfile
│   └── package.json
│
├── student-frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   │
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🐳 Docker Deployment (Without Docker Compose)

This project can be deployed using individual Docker commands without using Docker Compose.

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sanket1830/student-crud-project.git

cd student-crud-project
```

### Step 2: Create a Docker Network

```bash
docker network create student-network
```

### Step 3: Create a Persistent Volume

```bash
docker volume create student-mongo-data
```

### Step 4: Run MongoDB Container

```bash
docker run -d \
  --name mongo \
  --network student-network \
  -v student-mongo-data:/data/db \
  mongo:7
```

### Step 5: Build Backend Docker Image

```bash
cd student-backend

docker build -t student-backend:v1 .
```

### Step 6: Run Backend Container

```bash
docker run -d \
  --name backend \
  --network student-network \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://mongo:27017/studentdb \
  student-backend:v1
```

### Step 7: Build Frontend Docker Image

```bash
cd ../student-frontend

docker build -t student-frontend:v1 .
```

### Step 8: Run Frontend Container

```bash
docker run -d \
  --name student-frontend \
  --network student-network \
  -p 3000:80 \
  student-frontend:v1
```

### Step 9: Verify Running Containers

```bash
docker ps
```

Expected containers:

- mongo
- backend
- student-frontend

### Step 10: Access the Application

Open your browser:

```text
http://YOUR-EC2-PUBLIC-IP:3000
```

Replace `YOUR-EC2-PUBLIC-IP` with your actual EC2 public IP address.

## 🔐 AWS Security Group Configuration

Configure the following inbound rules for your EC2 instance:

| Type | Port | Source | Purpose |
|---|---:|---|---|
| SSH | 22 | Your IP | Remote access |
| Custom TCP | 3000 | Your IP | Frontend access |

**Security Note:** Backend port 5000 and MongoDB port 27017 do not need public inbound access because the containers communicate internally through the Docker network.

## 🔍 Useful Docker Commands

Check running containers:

```bash
docker ps
```

View all Docker images:

```bash
docker images
```

View backend logs:

```bash
docker logs backend
```

View MongoDB logs:

```bash
docker logs mongo
```

View frontend logs:

```bash
docker logs student-frontend
```

Check Docker networks:

```bash
docker network ls
```

Check Docker volumes:

```bash
docker volume ls
```

## 🔄 Git Commands

To upload future project changes to GitHub:

```bash
git add .

git commit -m "Update StudentHub application"

git push
```

## 🎯 Key Learning Outcomes

Through this project, I gained practical experience with:

- Developing a full-stack CRUD application.
- Building and managing Docker images.
- Running multiple containers independently.
- Creating custom Docker bridge networks.
- Connecting frontend, backend, and database containers.
- Configuring Nginx as a reverse proxy.
- Using Docker volumes for persistent database storage.
- Deploying applications on AWS EC2.
- Configuring AWS Security Groups.
- Managing project versions using Git and GitHub.

## 👨‍💻 Author

**Sanket Pachekar**

- GitHub: [Sanket1830](https://github.com/Sanket1830)
- LinkedIn: [Sanket Pachekar](https://linkedin.com/in/sanket-pachekar-32202327a/)

---

⭐ If you find this project useful, consider giving it a star on GitHub!
