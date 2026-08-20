# Taskify – Full-Stack Task Management Application

Taskify is a secure, multi-user task management application built with **Next.js** and **NestJS**.

The application allows authenticated users to create, manage, filter, sort, and track their tasks. Each task is private to the authenticated user who created it.

## 🚀 Live Demo

### Frontend
https://taskify-ei2ph9pta-bhanuprasad-s-projects.vercel.app/

### Backend API
https://taskify-backend-map3.onrender.com

### GitHub Repository
https://github.com/Vigrahalabhanu3/taskify

---

## ✨ Features

### Authentication & Security

- User registration
- User login
- JWT-based authentication
- bcrypt password hashing
- Protected backend routes
- Protected frontend routes
- Logout
- Forgot password
- Password reset
- Secure password reset tokens
- Password reset token expiration
- Generic password-reset response to reduce account enumeration
- User-specific task authorization
- Cross-user task access protection
- DTO validation
- MongoDB ObjectId validation
- Environment-based secret management
- CORS configuration

### Task Management

Authenticated users can:

- Create tasks
- View their tasks
- View individual task details
- Update tasks
- Delete tasks
- Change task status
- Set task priority
- Set due dates
- Add descriptions
- Add task locations
- Upload attachments

### Task Status

- `TODO`
- `IN_PROGRESS`
- `DONE`

### Task Priority

- `LOW`
- `MEDIUM`
- `HIGH`

### Search, Filtering, Sorting & Pagination

- Search tasks
- Filter by status
- Filter by priority
- Filter by due-date range
- Sort by created date
- Sort by due date
- Sort by priority
- Sort by title
- Ascending and descending sorting
- Server-side pagination

### File Upload

Taskify uses **Cloudinary** for file storage.

- File upload
- Multiple attachments
- File metadata
- Cloudinary CDN URLs
- Attachment display
- File download/open
- Upload progress
- File size validation
- MIME type validation
- Maximum upload size: `5 MB`

### Weather Integration

Taskify integrates with **OpenWeatherMap**.

Weather information includes:

- Temperature
- Feels-like temperature
- Weather condition
- Humidity
- Wind speed
- Weather icon

The OpenWeatherMap API key is kept on the backend.

### Email Notifications

Taskify uses **Nodemailer with SMTP**.

Emails are sent for:

- Task creation
- Task completion
- Password reset

Task completion notification is triggered when a task changes to `DONE`.

### Responsive UI

- Desktop responsive layout
- Tablet support
- Mobile navigation
- Mobile task cards
- Responsive task filters
- Responsive forms
- Responsive task details
- Loading states
- Error states
- Empty states
- Form validation
- Delete confirmation

---

## 🛠️ Technology Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Zustand
- React Query
- Axios
- React Hook Form
- Zod

### Backend

- NestJS
- TypeScript
- REST API
- Passport
- JWT
- bcrypt
- class-validator
- class-transformer
- Nodemailer

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### Third-Party Services

- Cloudinary
- OpenWeatherMap
- Gmail SMTP
- Nodemailer

### Deployment

- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │     User / Browser      │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │       Next.js           │
                         │       Frontend          │
                         │                         │
                         │  Authentication         │
                         │  Dashboard              │
                         │  Task Management        │
                         │  Filtering              │
                         │  Sorting                │
                         │  Pagination             │
                         │  Zustand                │
                         │  React Query            │
                         └────────────┬────────────┘
                                      │
                               REST API + JWT
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │        NestJS           │
                         │        Backend          │
                         │                         │
                         │  Auth Module            │
                         │  Users Module           │
                         │  Tasks Module           │
                         │  Upload Module          │
                         │  Weather Module         │
                         │  Email Module           │
                         └──────┬─────────┬────────┘
                                │         │
                    ┌───────────┘         └─────────────┐
                    ▼                                   ▼
          ┌────────────────────┐              ┌──────────────────┐
          │    MongoDB Atlas   │              │    Cloudinary    │
          │                    │              │                  │
          │ Users              │              │ File Storage     │
          │ Tasks              │              │ CDN              │
          └────────────────────┘              └──────────────────┘
                                │
                     ┌──────────┴──────────┐
                     ▼                     ▼
          ┌──────────────────┐   ┌────────────────────┐
          │   OpenWeatherMap │   │   Nodemailer SMTP  │
          │                  │   │                    │
          │ Weather Service  │   │ Email Service      │
          └──────────────────┘   └────────────────────┘

taskify/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-auth.guard.ts
│   │   │
│   │   ├── users/
│   │   │   ├── schemas/
│   │   │   └── users.service.ts
│   │   │
│   │   ├── tasks/
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── tasks.controller.ts
│   │   │   └── tasks.service.ts
│   │   │
│   │   ├── upload/
│   │   ├── weather/
│   │   ├── email/
│   │   ├── common/
│   │   ├── config/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/
│   │   │   │
│   │   │   └── (dashboard)/
│   │   │       ├── dashboard/
│   │   │       ├── tasks/
│   │   │       ├── calendar/
│   │   │       ├── profile/
│   │   │       └── settings/
│   │   │
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   │
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore

🗄️ Database Design
User
User
├── _id
├── name
├── email
├── password
├── resetPasswordToken
├── resetPasswordExpires
├── createdAt
└── updatedAt
Task
Task
├── _id
├── title
├── description
├── status
├── priority
├── dueDate
├── location
├── attachments
├── userId
├── createdAt
└── updatedAt

Each task belongs to the authenticated user through:

Task.userId → User._id
🔐 User Isolation

Taskify enforces user-level authorization for task operations.

Authenticated User
        │
        ▼
    authenticated userId
        │
        ▼
┌──────────────────────────────┐
│        Task Query            │
│                              │
│  task ID + authenticated ID  │
└──────────────────────────────┘

A user cannot access, update, or delete another user's task by changing the task ID.

🔑 Authentication Flow
Registration
User
 │
 ▼
Register Request
 │
 ▼
DTO Validation
 │
 ▼
Check Existing Email
 │
 ▼
Hash Password with bcrypt
 │
 ▼
Save User
 │
 ▼
Generate JWT
 │
 ▼
Return Safe User Response
Login
User
 │
 ▼
Login Request
 │
 ▼
Validate Credentials
 │
 ▼
Compare Password using bcrypt
 │
 ▼
Generate JWT
 │
 ▼
Store Authentication State
 │
 ▼
Protected API Requests
🔄 Task Creation Flow
Task Form
    │
    ▼
Frontend Validation
    │
    ▼
NestJS REST API
    │
    ▼
JWT Authentication
    │
    ▼
DTO Validation
    │
    ▼
Task Service
    │
    ├──────────────► MongoDB
    │
    ├──────────────► Cloudinary
    │
    ├──────────────► OpenWeatherMap
    │
    └──────────────► Email Service

---


# 🔌 API Documentation


## Authentication APIs


### Register User


```http
POST /auth/register

Creates a new user account.

Login User
POST /auth/login

Authenticates the user and returns a JWT access token.

Forgot Password
POST /auth/forgot-password

Starts the password-reset process.

For security, the API returns a generic response whether or not the email exists.

Reset Password
POST /auth/reset-password

Resets the user's password using a valid reset token.

📋 Task APIs

All task endpoints require JWT authentication.

Get Tasks
GET /tasks

Supports:

Search
Status filtering
Priority filtering
Due-date filtering
Sorting
Pagination

Example:

GET /tasks?page=1&limit=10&status=TODO&priority=HIGH
Create Task
POST /tasks

Creates a task for the authenticated user.

Get Task
GET /tasks/:id

Returns a task only if it belongs to the authenticated user.

Update Task
PATCH /tasks/:id

Updates an existing task owned by the authenticated user.

Delete Task
DELETE /tasks/:id

Deletes an existing task owned by the authenticated user.

📎 Upload API
Upload Attachment
POST /upload

Uploads a file to Cloudinary.

Maximum upload size:

5 MB

Supported files are validated by MIME type before upload.

🌤️ Weather API
Get Weather
GET /weather

Retrieves current weather information based on the task location.

⚙️ Environment Variables
Backend

Create:

backend/.env

Example:

PORT=4000
NODE_ENV=development


MONGODB_URI=
JWT_SECRET=your_strong_random_jwt_secret
JWT_EXPIRES_IN=7d


FRONTEND_URL=http://localhost:3000


CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=


OPENWEATHER_API_KEY=


SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
Frontend

Create:

frontend/.env.local

Example:

NEXT_PUBLIC_API_URL=http://localhost:4000
Production Frontend

The deployed frontend uses:

NEXT_PUBLIC_API_URL=https://taskify-backend-map3.onrender.com
Security

Never commit:

.env
.env.local

Never expose the following credentials in frontend code or GitHub:

MongoDB connection string
JWT secret
Cloudinary API secret
OpenWeatherMap API key
SMTP password

Production credentials are configured through the deployment platform environment settings.

💻 Local Development
1. Clone the Repository
git clone https://github.com/Vigrahalabhanu3/taskify.git
cd taskify
2. Backend Setup
cd backend
npm install

Create:

.env

Configure the required backend environment variables.

Start the backend:

npm run start:dev

Backend runs on:

http://localhost:4000
3. Frontend Setup

Open another terminal:

cd frontend
npm install

Create:

.env.local

Add:

NEXT_PUBLIC_API_URL=http://localhost:4000

Start the frontend:

npm run dev

Frontend runs on:

http://localhost:3000
🧪 Testing
Backend Unit Tests
cd backend
npm test

Current verified result:

4 Test Suites
16 Tests Passed

The test suite covers important areas including:

Authentication
Password reset
Task operations
User isolation
Weather service
Backend Production Build
cd backend
npm run build

The production build completes successfully.

Frontend Production Build
cd frontend
npm run build

The production build completes successfully




# 🚀 Deployment

## Frontend – Vercel

The Next.js frontend is deployed using Vercel.

### Production URL

https://taskify-ei2ph9pta-bhanuprasad-s-projects.vercel.app/

### Production API Configuration

```env
NEXT_PUBLIC_API_URL=https://taskify-backend-map3.onrender.com
Backend – Render

The NestJS backend is deployed using Render.

Production URL

https://taskify-backend-map3.onrender.com

Backend credentials and secrets are configured through Render environment variables and are not committed to GitHub.

Database – MongoDB Atlas

MongoDB Atlas is used as the production database.

The database connection is configured through:

MONGODB_URI

The database credentials are stored securely in the deployment environment.

🔄 Complete Application Workflow
                    ┌──────────────┐
                    │   Register   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Login     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Dashboard   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Create Task  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         Cloudinary   OpenWeather   Nodemailer
         Attachment      Weather      Email
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Edit Task   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Mark as DONE │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Done Email   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Delete Task  │
                    └──────────────┘

### Now your README is complete

You should now have:

```text
README.md
│
├── Project Overview
├── Live Demo
├── Features
├── Technology Stack
├── System Architecture
├── Project Structure
├── Database Design
├── User Isolation
├── Authentication Flow
├── Task Creation Flow
├── API Documentation
├── Environment Variables
├── Local Development
├── Testing
├── Security Verification
├── Deployment
├── Application Workflow
├── Assessment Compliance
├── Technical Trade-offs
├── Future Improvements
├── Verification Summary
└── Author

👨‍💻 Author
Bhanu Prasad

GitHub:

https://github.com/Vigrahalabhanu3

Project Repository:

https://github.com/Vigrahalabhanu3/taskify

