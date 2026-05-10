# Service Request Management System

A full-stack Service Request Management System where employees can submit and track service requests, and admins can manage request flow from Pending to Completed.

This project is beginner-friendly, portfolio-ready, and designed to be explainable in interviews for future Business Analyst and full-stack roles.

## Features

### User Features
- Register account
- Login/logout
- Create service requests
- View own request history
- Track request status (Pending, In Progress, Completed)
- Edit profile

### Admin Features
- Secure admin login
- View all service requests
- Search and filter by keyword/status
- Update request status
- Delete requests

### UI/UX Features
- Dark modern SaaS dashboard style
- Sidebar navigation
- Statistics cards
- Responsive tables
- Status badges
- Empty-state UI
- Loading spinners
- Toast notifications

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js
- Database: PostgreSQL (Supabase)
- Auth/Security: JWT, bcryptjs, route protection, admin authorization, input validation

## Project Structure

```text
Service-Request-System/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
      app.js
      server.js
    .env.example
    package.json

  frontend/
    src/
      api/
      components/
      context/
      pages/
      routes/
      App.jsx
      main.jsx
      index.css
    .env.example
    package.json

  database/
    schema.sql
    seed.sql
    er-relationship.md

  README.md
```

## Database Setup (Supabase PostgreSQL)

1. Create a project in Supabase.
2. Go to SQL Editor and run:
- database/schema.sql
- database/seed.sql (optional sample data)
3. Open Project Settings -> Database and copy:
- Host
- Port
- Database name
- User
- Password

## Environment Variables

### Backend (.env)
Use backend/.env.example as reference:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
DB_HOST=your_supabase_host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres
DB_SSL=true
```

### Frontend (.env)
Use frontend/.env.example as reference:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation and Run

### 1. Install backend dependencies
```bash
cd backend
npm install
```

### 2. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 3. Start backend server
```bash
cd ../backend
npm run dev
```

### 4. Start frontend app
Open a second terminal:
```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173 and backend runs on http://localhost:5000.

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### User
- GET /api/users/profile
- PUT /api/users/profile

### Requests (User)
- POST /api/requests
- GET /api/requests/my

### Admin
- GET /api/admin/requests?search=&status=
- PATCH /api/admin/requests/:id/status
- DELETE /api/admin/requests/:id

## Authentication and Security
- Password hashing with bcryptjs
- JWT-based auth tokens
- Protected routes in frontend and backend
- Admin-only middleware for management APIs
- Request validation using express-validator

## Dashboard Metrics Included
- Total requests
- Pending requests
- In Progress requests
- Completed requests
- Recent requests table

## Suggested 3-4 Day Implementation Plan

### Day 1
- Setup project folders and dependencies
- Create DB schema and seed data
- Build backend auth and user APIs

### Day 2
- Build request APIs and admin APIs
- Test all endpoints with Postman

### Day 3
- Build frontend pages and routing
- Connect frontend to backend

### Day 4
- Polish UI, test responsiveness, fix bugs
- Prepare README and deploy

## Deployment Guide

### Backend (Render/Railway/Fly)
1. Push backend to GitHub.
2. Create service and set environment variables.
3. Set start command: npm start
4. Ensure DB SSL is true for Supabase.

### Frontend (Vercel/Netlify)
1. Push frontend to GitHub.
2. Set environment variable VITE_API_URL to deployed backend URL + /api
3. Build command: npm run build
4. Publish directory: dist

## Future Improvements
- Pagination for request tables
- File attachments for requests
- Email notifications for status changes
- Audit logs for admin actions
- Chart-based analytics for SLA tracking