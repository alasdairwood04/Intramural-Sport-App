# 🏅 Intramural Sport App

## 📌 Overview

A full-stack web application for managing university intramural sports. Students can register, join teams, participate in fixtures, and track their progress. Admins can manage sports, seasons, teams, users, and view league standings.

---

## 🚧 Current State

- **Backend:** Node.js + Express, PostgreSQL, Passport.js for authentication.
- **Frontend:** React + Vite, Tailwind CSS. Core pages and admin dashboard are implemented.
- **Database:** Comprehensive schema with migrations and seed data.
- **Features:** User/team management, sports/seasons CRUD, fixtures, teamsheets, availability, notifications, league tables.

---
## 📂 Project Structure
```
Intramural-Sport-App/
├── LICENSE
├── README.md
├── client/
│   ├── src/
│   │   ├── api/            # API calls to backend
│   │   ├── assets/         # CSS and images
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── features/       # Feature modules (auth, teams, admin, etc.)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page-level components
│   │   ├── routes/         # App routing
│   │   └── utils/          # Utility functions
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/         # DB and auth config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # DB models
│   │   ├── routes/         # Express routes
│   │   └── utils/          # Migration runner, etc.
│   ├── migrations/         # DB migration files
│   ├── seeds/              # Seed data
│   ├── server.js           # App entry point
│   └── package.json
```

## ✅ Features (Currently Implemented)

- **User Management**
  - Registration, login, logout
  - Role-based access (`player`, `captain`, `admin`)
  - Admin can change user roles and delete users

- **Team Management**
  - Create, edit, delete teams
  - Add/remove team members
  - Join requests (pending, approve, reject)
  - Assign captain

- **Sports & Seasons**
  - Admin CRUD for sports and seasons
  - Set min/max team size for sports
  - Active/inactive seasons

- **Fixtures & Results**
  - Propose, confirm, and complete fixtures
  - Submit match results
  - View upcoming and past fixtures

- **Teamsheets & Availability**
  - Submit teamsheets for fixtures
  - Mark player availability

- **League Standings**
  - Automatic league tables (wins, losses, draws)
  - Team and player stats

- **Notifications**
  - Admin can send notifications to users
  - Users can view and mark notifications as read

---

## 🗄️ Database Schema

- `users`: User accounts, roles, authentication
- `sports`: Sport definitions (name, description, team size)
- `seasons`: Competition periods
- `teams`: Team info, links to sport/season/captain
- `team_members`: Users in teams
- `join_requests`: Requests to join teams
- `fixtures`: Scheduled matches
- `availability`: Player availability for fixtures
- `teamsheets`: Lineups for fixtures
- `teamsheet_players`: Players on teamsheets
- `notifications`: User notifications

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/Intramural-Sport-App.git
    ```

2. **Install backend dependencies**
    ```bash
    cd Intramural-Sport-App/server
    npm install
    ```

3. **Install frontend dependencies**
    ```bash
    cd ../client
    npm install
    ```

4. **Configure environment variables**
    - Create `.env` files in both `/server` and `/client` as needed.
    - Example for `/server/.env`:
    ```
      DB_HOST=localhost
      DB_PORT=5432
      DB_NAME=intramural_sports_dev
      DB_USER=yourdbuser
      DB_PASS=yourdbpassword
      SESSION_SECRET=yoursessionsecret
      PORT=3000
   ```

5. **Run database migrations**
    ```bash
    cd ../server
    npm run migrate
    ```

6. **Start backend server**
    ```bash
    npm run dev
    ```

7. **Start frontend**
    ```bash
    cd ../client
    npm run dev
    ```

---

## 📡 API Endpoints

### Public Endpoints

- `GET /api/health` — Health check
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/sports` — List sports
- `GET /api/sports/:sportId` — Sport details
- `GET /api/seasons` — List seasons
- `GET /api/seasons/active` — Active seasons
- `GET /api/seasons/:seasonId` — Season details

### Protected Endpoints

- `GET /api/profile` — Get user profile
- `POST /api/auth/logout` — Logout
- `POST /api/teams` — Create team
- `GET /api/teams/:teamId` — Team details
- `GET /api/teams` — List teams
- `PUT /api/teams/:teamId` — Update team
- `POST /api/teams/:teamId/members` — Add player
- `DELETE /api/teams/:teamId/:userId` — Remove player
- `POST /api/teams/:teamId/requests` — Request to join team
- `GET /api/teams/:teamId/requests/view` — View join requests
- `POST /api/teams/:teamId/requests/:requestId/approve` — Approve join request
- `POST /api/teams/:teamId/requests/:requestId/reject` — Reject join request
- `POST /api/sports` — Create sport (admin)
- `PUT /api/sports/:sportId` — Update sport (admin)
- `DELETE /api/sports/:sportId` — Delete sport (admin)
- `POST /api/seasons` — Create season (admin)
- `PUT /api/seasons/:seasonId` — Update season (admin)
- `DELETE /api/seasons/:seasonId` — Delete season (admin)
- `POST /api/fixtures` — Create fixture
- `GET /api/fixtures` — List fixtures
- `PUT /api/fixtures/:id/confirm` — Confirm fixture
- `PUT /api/fixtures/:id/result` — Submit result
- `POST /api/availability` — Mark availability
- `GET /api/fixtures/:id/availability` — Get team availability
- `PUT /api/availability/:id` — Update availability
- `POST /api/fixtures/:id/teamsheet` — Submit teamsheet
- `GET /api/fixtures/:id/teamsheet/:teamId` — Get teamsheet
- `GET /api/fixtures/:id/teamsheets` — Get both teamsheets
- `GET /api/leagues/:seasonId/:sportId` — League standings
- `GET /api/teams/:id/stats` — Team stats
- `GET /api/players/:id/stats` — Player stats
- `POST /api/notifications` — Create notification (admin)
- `GET /api/users/:id/notifications` — Get notifications
- `PUT /api/notifications/:id/read` — Mark notification as read

---

## 🚀 Next Steps

- Complete frontend features and polish UI
- Add real-time updates (WebSockets)
- Expand statistics and match event tracking
- Add mobile support
- Enhance notification system

---

## 📜 License

MIT License

---

## 👥 Contributors

- Alasdair Wood