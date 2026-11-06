# LearnHub – Online Learning & Course Enrollment Platform

LearnHub is a full-stack, production-style **Online Learning & Course Enrollment System** built with **Next.js App Router (Fullstack Architecture with React, TypeScript, and Node.js REST API)**, **Prisma ORM**, **SQLite Database**, **Tailwind CSS**, and **JWT Authentication**.

---

## 🌟 Key Features & User Roles

### 👨‍🎓 Student Role
- **Course Catalog & Filtering**: Search courses by keyword, category, level, instructor, and price/popularity sorting.
- **Instant Course Enrollment**: Enroll with 1-click confirmation, preventing duplicate enrollments.
- **Lesson Player & Completion**: Stream video lessons and mark progress in real time.
- **Interactive Quizzes**: Attempt multiple-choice quizzes with timer, automatic scoring, and detailed answer breakdowns.
- **Assignments Submission**: View course assignments, submit text explanations and GitHub repository links, view instructor grades & feedback.
- **Student Dashboard**: Live statistical breakdown of active enrollments, completed courses, average quiz scores, and visual progress bars (`75% Completed`).

### 👩‍🏫 Instructor Role
- **Course Management**: Full CRUD operations for creating, updating, and deleting courses.
- **Curriculum Builder**: Add video lessons with embed URLs, custom ordering, and durations.
- **Quiz Creator**: Design multiple-choice quizzes with custom question options and correct answer keys.
- **Assignment Grading**: View student submissions, award marks, and provide feedback.
- **Instructor Dashboard**: Overview of total courses, active student enrollments, and average course ratings.

### 🛡️ Admin Role
- **Platform Analytics**: Monitor overall platform users, students, instructors, total courses, and enrollments.
- **User Control & RBAC**: Activate/deactivate student or instructor accounts instantly.
- **Course Moderation**: Audit and delete inappropriate course listings.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Next.js App Router REST API Handlers (`app/api/...`), Node.js, JWT (`jsonwebtoken`), BCrypt (`bcryptjs`).
- **Database**: SQLite (via Prisma ORM 5.22).
- **API Documentation**: OpenAPI 3.0 / Swagger JSON (`/api/docs` & `/api-docs`).
- **Postman Testing**: Exported Postman Collection (`postman_collection.json`).

---

## 🏗️ Application Architecture

```
LearnHub Application Architecture
│
├── Next.js App Router Frontend (Client Components)
│     ↓ REST APIs (JSON)
├── Next.js Route Handlers (Server Components / Node.js)
│     ↓ Security & JWT Guard
├── Prisma ORM Data Layer
│     ↓ SQL Queries
└── SQLite Database (dev.db)
```

### Directory Structure
```
online-learning-platform/
├── app/
│   ├── api/             # REST API Route Handlers
│   │   ├── admin/       # Admin statistics & user control
│   │   ├── assignments/ # Assignment & submission APIs
│   │   ├── auth/        # Register, Login, Logout, Me APIs
│   │   ├── courses/     # Course CRUD, filtering, & lessons
│   │   ├── enrollments/ # Enrollment & student course APIs
│   │   ├── lessons/     # Lesson CRUD & completion APIs
│   │   ├── progress/    # Detailed progress calculation API
│   │   ├── quizzes/     # Quiz creation, submit, & grading APIs
│   │   └── docs/        # OpenAPI Swagger JSON spec API
│   ├── api-docs/        # Interactive API Documentation page
│   ├── courses/         # Course listing & detail pages
│   ├── dashboard/       # Student, Instructor, & Admin Dashboards
│   ├── my-courses/      # Enrolled learning page
│   ├── quiz/            # Interactive quiz taking page
│   ├── assignments/     # Assignments submission page
│   ├── login/           # Login page with quick demo buttons
│   ├── register/        # Registration page
│   └── page.tsx         # Modern landing page
├── components/          # Navbar, Footer, CourseCard, ProgressBar
├── context/             # AuthContext state manager
├── lib/                 # Prisma singleton & JWT security utils
├── prisma/              # schema.prisma & SQLite dev.db
├── scripts/             # seed.mjs script
└── postman_collection.json # Postman collection for API testing
```

---

## 🔑 Demo Login Credentials

For demonstration and testing, use the following pre-configured demo accounts (Password for all: `password123`):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@learnhub.com` | `password123` |
| **Instructor** | `instructor@learnhub.com` | `password123` |
| **Admin** | `admin@learnhub.com` | `password123` |

*(Note: The login page includes 1-click **Quick Demo Login** buttons for instant testing!)*

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="learnhub_jwt_super_secret_key_2026_antigravity_master_key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## 🚀 How to Run the Project

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Sync Database Schema & Seed Sample Data**:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 REST API Documentation

The OpenAPI specification is available dynamically at:
- **Interactive Web Page**: `http://localhost:3000/api-docs`
- **JSON Specification**: `http://localhost:3000/api/docs`

### Primary Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login & JWT issuance
- `GET /api/auth/me` - Authenticated user details
- `GET /api/courses` - Search & filter courses
- `POST /api/enrollments` - Enroll student in course
- `POST /api/lessons/[id]/complete` - Mark lesson progress
- `POST /api/quizzes/[id]/submit` - Auto-grade quiz submission
- `POST /api/assignments/[id]/submit` - Submit project solution

---

## 🧪 Postman Collection

Import `postman_collection.json` into Postman to execute pre-configured requests for Authentication, Courses, Enrollments, Progress, and Quizzes.
