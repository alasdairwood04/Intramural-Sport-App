# 🏅 Intramural Sport App

## 📌 Overview
This is a full-stack application for managing intramural sports programs. It provides a platform for students to:
- Sign up
- Join teams
- Participate in sports events
- Track their progress

---

## 🚧 Current State
The project is in **early development** with the basic server infrastructure set up.  
- **Backend:** Node.js with Express  
- **Database:** PostgreSQL  

---

## 📂 Project Structure
```
Intramural-Sport-App/
├── server/
│ ├── src/
│ │ ├── app.js # Express application setup
│ │ ├── config/ # Configuration files
│ │ │ ├── database.js # Database connection
│ │ │ └── passport.js # Authentication config
│ │ ├── middleware/ # Custom middleware
│ │ │ └── auth.js # Authentication middleware
│ │ ├── models/ # Data models
│ │ │ └── User.js # User model with database operations
│ │ └── routes/ # API routes
│ │ └── authRoutes.js # Authentication routes
│ ├── migrations/ # Database migration files
│ │ └── 001_create_users_table.js # User table creation
│ ├── server.js # Entry point for the application
│ └── package.json # Project dependencies
```


---

## ✅ Features (Currently Implemented)
- User authentication system (signup, login)  
- User roles (`player`, `captain`, `admin`)  
- Session management with Passport.js  
- API health check endpoint  
- Protected routes using middleware  

---

## 🗄️ Database Schema
The database currently has a **`users`** table with the following fields:

- `id` (UUID, primary key)  
- `email` (unique)  
- `password_hash`  
- `first_name`  
- `last_name`  
- `student_id` (unique)  
- `role` (`player`, `captain`, or `admin`)  
- `created_at`  
- `updated_at`  

---

## ⚙️ Setup Instructions

### 📋 Prerequisites
- [Node.js](https://nodejs.org/) (v14+)  
- [PostgreSQL](https://www.postgresql.org/)  

### 🔧 Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Intramural-Sport-App.git
   cd Intramural-Sport-App/server

2. **Install dependencies**
    ```bash
    npm install

3. Create a .```env``` file in ```/server``` with the following variables:
   ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=intramural_sports
    DB_USER=yourdbuser
    DB_PASSWORD=yourdbpassword
    SESSION_SECRET=yoursessionsecret
    PORT=3000
4. Run database migrations
   ```bash
    npm run migrate

5. Start the development server
   ```bash
    npm run dev

## 📡 API Endpoints  

### 🔓 Public Endpoints  
- **GET** `/api/health` → Health check  
- **POST** `/api/auth/register` → User registration  
- **POST** `/api/auth/login` → User login  

### 🔒 Protected Endpoints  
- **GET** `/api/profile` → Get user profile (requires authentication)  

---

## 🚀 Next Steps  
- Implement team creation and management  
- Add sports/leagues management  
- Create scheduling functionality  
- Develop frontend application  
- Implement statistics tracking  
- Add notification system  

---

## 📜 License  
MIT License  

---

## 👥 Contributors  
- Alasdair Wood  