Intramural Sport App
Overview
This is a full-stack application for managing intramural sports programs. It provides a platform for students to sign up, join teams, participate in sports events, and track their progress.

Current State
The project is in early development with the basic server infrastructure set up. The backend is built using Node.js with Express and PostgreSQL for the database.

Project Structure
Features (Currently Implemented)
User authentication system (signup, login)
User roles (player, captain, admin)
Session management with Passport.js
API health check endpoint
Protected routes using middleware
Database Schema
The database currently has a users table with the following fields:

id (UUID, primary key)
email (unique)
password_hash
first_name
last_name
student_id (unique)
role (player, captain, or admin)
created_at
updated_at
Setup Instructions
Prerequisites
Node.js (v14+)
PostgreSQL
Installation
Clone the repository

Install dependencies

Create a .env file with the following variables:

Run database migrations

Start the development server

API Endpoints
Public Endpoints
GET /api/health - Health check
POST /api/auth/register - User registration
POST /api/auth/login - User login
Protected Endpoints
GET /api/profile - Get user profile (requires authentication)
Next Steps
Implement team creation and management
Add sports/leagues management
Create scheduling functionality
Develop frontend application
Implement statistics tracking
Add notification system
License
[Your License Here]

Contributors
[Your Name]

