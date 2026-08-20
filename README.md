# Taskify – Full-Stack Task Management Application

**Taskify** is a production-quality, multi-user task management application built with **NestJS**, **MongoDB (Mongoose)**, **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

1. **User Authentication & Authorization**:
   - Secure registration and login.
   - Passwords hashed using `bcrypt` (10 salt rounds).
   - JWT authentication via NestJS Passport strategy.
   - Next.js protected client & server routes.
2. **Tenant Data Isolation & Security**:
   - Strict database-level scoping (`{ _id: taskId, userId: req.user.id }`).
   - Prevention of cross-tenant data leaks (attempting to access another user's task ID yields `404 Not Found`).
   - Centralized NestJS `HttpExceptionFilter` and DTO validation via `class-validator` / `class-transformer`.
   - Secure CORS setup.
3. **Task Management (Full CRUD)**:
   - Create, list, detail view, edit, and delete tasks.
   - Status tracking (`TODO`, `IN_PROGRESS`, `DONE`) with quick toggle.
   - Priority levels (`LOW`, `MEDIUM`, `HIGH`).
   - Due dates with relative time calculations.
   - Server-side pagination, search, status/priority filtering, and date range filters.
4. **Third-Party Integrations**:
   - **Cloudinary File Storage**: Secure attachment uploader (images, PDFs, documents).
   - **OpenWeatherMap Weather Lookup**: Live weather forecast widget based on task `location`.
   - **Email Service (Nodemailer / Resend)**: Non-blocking async emails sent on task creation and task completion (`DONE`).
5. **Dashboard Analytics & UI**:
   - Real-time Stats Cards (Total Tasks, To Do, In Progress, Done).
   - Responsive modern UI design with purple accents, glassmorphism, loading skeletons, empty states, and modal dialogs.

---

## 🏗️ Architecture & Project Structure

```
Task-Flow/
├── backend/                  # NestJS REST API Backend
│   ├── src/
│   │   ├── auth/            # Auth Controller, Service, JWT Strategy & DTOs
│   │   ├── users/           # User Model Schema & Service
│   │   ├── tasks/           # Task Model, CRUD Controller, Service & DTOs
│   │   ├── upload/          # Cloudinary File Upload Provider & Controller
│   │   ├── weather/         # OpenWeatherMap Service & Controller
│   │   ├── email/           # Nodemailer Email Notification Service
│   │   ├── common/          # Filters, Guards, Decorators, Pipes & Interfaces
│   │   └── config/          # Environment variable loaders
│   ├── .env.example
│   └── package.json
└── frontend/                 # Next.js App Router Frontend
    ├── src/
    │   ├── app/             # (auth), (dashboard) pages & layouts
    │   ├── components/      # UI, Auth, Dashboard, Task & Weather components
    │   ├── hooks/           # TanStack React Query custom hooks
    │   ├── lib/             # Axios API client, Zustand stores & utils
    │   ├── store/           # Filter & UI state stores
    │   └── types/           # TypeScript interfaces & types
    ├── .env.example
    └── package.json
```

---

## 🛠️ Quick Start Guide

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB instance (MongoDB Atlas or local `mongodb://localhost:27017/taskify`)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```
Backend runs at `http://localhost:4000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
Frontend runs at `http://localhost:3000`.

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskify
JWT_SECRET=super_secret_jwt_signing_key_taskify_2026
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OPENWEATHER_API_KEY=your_openweather_api_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Taskify Team <noreply@taskify.app>"
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login user & get JWT | No |
| `GET` | `/tasks` | List user's tasks (with filters & pagination) | Yes (Bearer) |
| `POST` | `/tasks` | Create a new task (triggers creation email) | Yes (Bearer) |
| `GET` | `/tasks/stats` | Get task counts for dashboard overview | Yes (Bearer) |
| `GET` | `/tasks/:id` | Get single task details (tenant isolated) | Yes (Bearer) |
| `PATCH` | `/tasks/:id` | Update task (triggers completion email if DONE) | Yes (Bearer) |
| `DELETE` | `/tasks/:id` | Delete task | Yes (Bearer) |
| `POST` | `/upload` | Upload attachment file to Cloudinary | Yes (Bearer) |
| `GET` | `/weather` | Fetch current weather for location | Yes (Bearer) |

---

## 🚀 Deployment Guide

- **Frontend (Vercel)**:
  1. Import `frontend` folder into Vercel.
  2. Set `NEXT_PUBLIC_API_URL` to your production backend URL.
  3. Deploy.
- **Backend (Render / Railway / Fly.io)**:
  1. Import `backend` repository.
  2. Set build command: `npm run build`, start command: `node dist/main.js`.
  3. Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `OPENWEATHER_*`, `SMTP_*`).
- **Database**: MongoDB Atlas Cluster with user index enabled.

---

## ⚖️ Trade-offs & Future Improvements

1. **Email Service Queue**: Currently email dispatch is non-blocking async. In high-scale production, integrating Redis BullMQ queue would ensure guaranteed retries and rate limit protection.
2. **Weather Caching**: Weather lookups use in-memory React Query stale-time. Adding server-side Redis caching for OpenWeatherMap requests would reduce third-party API calls across multiple users querying the same city.
3. **RefreshToken Flow**: The app uses JWT tokens with 7-day expiration. Implementing HTTP-only refresh token rotation would enhance security further.
