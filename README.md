# 🏅 Intramural Sport App

## 📌 Overview

This is a full-stack application for managing intramural sports programs. It provides a platform for students to sign up, join teams, participate in sports events, and track their progress.

-----

## 🚧 Current State

The project is in active development. The backend is substantially built out with a comprehensive feature set. The frontend is the next major development area.

  - **Backend:** Node.js with Express
  - **Database:** PostgreSQL

-----

## 📂 Project Structure

```
Intramural-Sport-App/
├── server/
│   ├── src/
│   │   ├── app.js                # Express application setup
│   │   ├── config/               # Configuration files
│   │   │   ├── database.js       # Database connection
│   │   │   └── passport.js       # Authentication config
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # Custom middleware (auth)
│   │   ├── models/               # Data models and database logic
│   │   └── routes/               # API routes
│   ├── migrations/               # Database migration files
│   ├── utils/                    # Utility scripts (e.g., migration runner)
│   ├── server.js                 # Entry point for the application
│   └── package.json              # Project dependencies
```

-----

## ✅ Features (Currently Implemented)

  - **User Management:**
      - User registration and login
      - Role-based access control (`player`, `captain`, `admin`)
      - Session management with Passport.js
  - **Team Management:**
      - Team creation
      - Add/remove team members
      - Join requests for teams (pending, approved, rejected)
  - **Sports & Seasons:**
      - Create, read, update, and delete sports (admin)
      - Create, read, update, and delete seasons (admin)
  - **Fixtures & Availability:**
      - Create and view fixtures
      - Confirm fixtures
      - Submit match results
      - Mark player availability for fixtures
  - **Teamsheets:**
      - Submit and view teamsheets for fixtures
  - **League Standings:**
      - Automatically calculated league tables with wins, losses, draws, and goals.
  - **Notifications:**
      - System for creating and managing user notifications.

-----

## 🗄️ Database Schema

The database schema consists of the following tables:

  - **`users`**: Stores user information, including authentication details and role.
  - **`sports`**: Defines the different sports available.
  - **`seasons`**: Defines different seasons or semesters.
  - **`teams`**: Stores team information, linking to sports, seasons, and a captain.
  - **`team_members`**: A join table linking users to teams.
  - **`join_requests`**: Tracks requests from users to join teams.
  - **`fixtures`**: Stores information about scheduled matches between teams.
  - **`availability`**: Tracks player availability for specific fixtures.
  - **`teamsheets`**: Stores the lineup for a team for a specific fixture.
  - **`teamsheet_players`**: A join table linking players to a teamsheet.
  - **`notifications`**: Stores notifications for users.

-----

## ⚙️ Setup Instructions

### 📋 Prerequisites

  - [Node.js](https://nodejs.org/) (v14+)
  - [PostgreSQL](https://www.postgresql.org/)

### 🔧 Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/Intramural-Sport-App.git
    cd Intramural-Sport-App/server
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  Create a `.env` file in `/server` with the following variables:

    ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=intramural_sports
    DB_USER=yourdbuser
    DB_PASSWORD=yourdbpassword
    SESSION_SECRET=yoursessionsecret
    PORT=3000
    ```

4.  Run database migrations

    ```bash
    npm run migrate
    ```

5.  Start the development server

    ```bash
    npm run dev
    ```

-----

## 📡 API Endpoints

### 🔓 Public Endpoints

  - **GET** `/api/health` → Health check
  - **POST** `/api/auth/register` → User registration
  - **POST** `/api/auth/login` → User login
  - **GET** `/api/sports` → Get all sports
  - **GET** `/api/sports/:sportId` → Get a sport by ID
  - **GET** `/api/seasons` → Get all seasons
  - **GET** `/api/seasons/active` → Get active seasons
  - **GET** `/api/seasons/:seasonId` → Get a season by ID

### 🔒 Protected Endpoints

  - **GET** `/api/profile` → Get user profile
  - **POST** `/api/auth/logout` → User logout
  - **POST** `/api/teams` → Create a new team
  - **GET** `/api/teams/:teamId` → Get team details
  - **GET** `/api/teams` → List all teams
  - **PUT** `/api/teams/:teamId` → Update team
  - **POST** `/api/teams/:teamId/members` → Add player to a team
  - **DELETE** `/api/teams/:teamId/:userId` → Remove player from a team
  - **POST** `/api/teams/:teamId/requests` → Request to join a team
  - **GET** `/api/teams/:teamId/requests/view` → View pending join requests
  - **POST** `/api/teams/:teamId/requests/:requestId/approve` → Approve a join request
  - **POST** `/api/teams/:teamId/requests/:requestId/reject` → Reject a join request
  - **POST** `/api/sports` → Create a new sport (admin only)
  - **PUT** `/api/sports/:sportId` → Update a sport (admin only)
  - **DELETE** `/api/sports/:sportId` → Delete a sport (admin only)
  - **POST** `/api/seasons` → Create a new season (admin only)
  - **PUT** `/api/seasons/:seasonId` → Update a season (admin only)
  - **DELETE** `/api/seasons/:seasonId` → Delete a season (admin only)
  - **POST** `/api/fixtures` → Create a fixture
  - **GET** `/api/fixtures` → Get all fixtures
  - **PUT** `/api/fixtures/:id/confirm` → Confirm a fixture
  - **PUT** `/api/fixtures/:id/result` → Submit a match result
  - **POST** `/api/availability` → Mark availability
  - **GET** `/api/fixtures/:id/availability` → Get team availability for a fixture
  - **PUT** `/api/availability/:id` → Update availability
  - **POST** `/api/fixtures/:id/teamsheet` → Submit a teamsheet
  - **GET** `/api/fixtures/:id/teamsheet/:teamId` → Get a specific teamsheet
  - **GET** `/api/fixtures/:id/teamsheets` → Get both teamsheets for a fixture
  - **GET** `/api/leagues/:seasonId/:sportId` → Get league standings
  - **GET** `/api/teams/:id/stats` → Get team stats
  - **GET** `/api/players/:id/stats` → Get player stats
  - **POST** `/api/notifications` → Create a notification (admin only)
  - **GET** `/api/users/:id/notifications` → Get user's notifications
  - **PUT** `/api/notifications/:id/read` → Mark notification as read

-----

## 🚀 Next Steps

  - Develop frontend application using React and Tailwind CSS.
  - Implement real-time features with WebSockets (e.g., live match updates, notifications).
  - Expand on player and team statistics.
  - Implement a more comprehensive notification system.
  - Add features for tracking match events like goals, cards, and substitutions.

-----

## 📜 License

MIT License

-----

## 👥 Contributors

  - Alasdair Wood