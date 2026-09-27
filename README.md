# SmartTodo Web Application

A full-stack Todo/Task Management web application built using **Java Spring Boot, MySQL, HTML, CSS, and JavaScript**.

The application provides secure user authentication, task management, priorities, status tracking, dashboard statistics, and role-based access for users and administrators.

---

## 🚀 Features

### 🔐 User Authentication

* User registration
* User login
* JWT-based authentication
* Password encryption using BCrypt
* Get currently logged-in user
* Secure protected APIs

### 📝 Task Management

Users can:

* Create tasks
* View their tasks
* View a specific task
* Update tasks
* Delete tasks
* Set task priority
* Set task status
* Manage their own tasks securely

### 👤 Role-Based Access

The application supports:

* `USER`
* `ADMIN`

Admin users can access administrative APIs for managing and viewing users and tasks.

### 📊 Dashboard

The application provides task-related statistics that can be used to understand the user's current task status and productivity.

### 🛡️ Security

* Spring Security
* JWT Authentication
* BCrypt Password Hashing
* Role-based authorization
* User-specific task ownership
* CORS configuration
* Request validation
* Global exception handling

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

### Backend

* Java 17
* Spring Boot 3.5.x
* Spring MVC
* Spring Security
* Spring Data JPA
* Hibernate
* Maven

### Database

* MySQL

### Authentication

* JSON Web Token (JWT)
* BCrypt

---

## 📂 Project Structure

```text
SmartTodoApp_Project/
│
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── todo.html
│   ├── script.js
│   ├── style.css
│   └── README.txt
│
├── smarttodo/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │
│   ├── pom.xml
│   └── .gitignore
│
└── .gitignore
```

---

## 🔗 REST API

### Authentication APIs

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | Login user                     |
| GET    | `/api/auth/me`       | Get current authenticated user |

### Task APIs

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/api/tasks`      | Get user's tasks    |
| GET    | `/api/tasks/{id}` | Get a specific task |
| POST   | `/api/tasks`      | Create a task       |
| PUT    | `/api/tasks/{id}` | Update a task       |
| DELETE | `/api/tasks/{id}` | Delete a task       |

### Admin APIs

| Method | Endpoint           | Description |
| ------ | ------------------ | ----------- |
| GET    | `/api/admin/users` | Get users   |
| GET    | `/api/admin/tasks` | Get tasks   |

Protected APIs use JWT authentication with a Bearer token.

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 🗄️ Database

The application uses **MySQL** with JPA/Hibernate.

The main relationship is:

```text
User
  │
  │  One-to-Many
  ▼
Tasks
```

Each task belongs to a specific user, which helps prevent users from accessing another user's tasks.

---

## ⚙️ Backend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/somdevtiwari578-dotcom/SmartTodoWebApplication-.git
```

### 2. Open the Backend

```text
SmartTodoApp_Project/smarttodo
```

### 3. Configure MySQL

Create a MySQL database and configure the required database properties in the application's configuration.

Keep sensitive information such as:

* Database password
* JWT secret

outside the source code using environment-based configuration.

### 4. Build the Backend

From the `smarttodo` directory:

```bash
mvn clean install
```

### 5. Run the Spring Boot Application

```bash
mvn spring-boot:run
```

The backend will start on the configured Spring Boot port.

---

## 🌐 Frontend Setup

The frontend is a simple HTML/CSS/JavaScript application.

Open:

```text
frontend/index.html
```

using a browser or a local development server.

The frontend communicates with the Spring Boot backend through REST APIs.

---

## 🔄 Application Flow

```text
User
 │
 ▼
Frontend
 │
 │ HTTP Request
 ▼
Spring Boot REST API
 │
 ▼
Spring Security
 │
 ▼
JWT Authentication
 │
 ▼
Controller
 │
 ▼
Service Layer
 │
 ▼
Repository / JPA
 │
 ▼
MySQL Database
```

---

## 🔒 Security Flow

```text
Register
   ↓
Password encrypted using BCrypt
   ↓
User stored in MySQL
   ↓
Login
   ↓
Credentials verified
   ↓
JWT Token generated
   ↓
Frontend stores/uses token
   ↓
Token sent with protected requests
   ↓
Spring Security validates JWT
   ↓
Authorized request processed
```

---

## 📌 Important Concepts Used

This project demonstrates practical knowledge of:

* Spring Boot
* REST API development
* Spring Security
* JWT Authentication
* BCrypt
* Role-Based Authorization
* JPA/Hibernate
* MySQL
* Entity Relationships
* DTOs
* Validation
* Exception Handling
* CORS
* CRUD Operations
* HTTP Methods
* Git & GitHub

---

## 🧪 CRUD Operations

The application implements complete CRUD functionality for tasks:

```text
Create  → POST
Read    → GET
Update  → PUT
Delete  → DELETE
```

---

## 📈 Future Improvements

Possible future enhancements include:

* Task search and filtering
* Pagination
* Task reminders
* Email notifications
* Advanced dashboard analytics
* Docker deployment
* Cloud deployment
* Automated unit and integration testing

---

## 👨‍💻 Author

**Somdev Tiwari**

GitHub:

https://github.com/somdevtiwari578-dotcom

---

## 📄 License

This project is created for learning, portfolio, and demonstration purposes.
