# Smart Notes (Main)

## 📐 Architecture & Tech Stack

### 🧱 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React(Vite) + TypeScript + Tailwind CSS   |
| Backend      | Express.js + TypeScript             |
| Auth         | JWT-based authentication            |
| AI Service   | OpenRouter (Deepseek r1)             |
| ORM          | Prisma                              |
| Database     | PostgreSQL                          |
| Containerization | Docker + Docker Compose         |

---

## 🚀 Setup & Run Instructions

### ✅ Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [OpenRouter API Key](https://openrouter.ai/keys)
- [Email / Email Pass](for log in verification)

### 🐳 Run with Docker
From the root of the project:
docker-compose up --build

- Backend will be available at: http://localhost:3000
- Frontend will be available at: http://localhost:5173

### 🧪 Run Locally Without Docker
- Start PostgreSQL manually (or via Docker)

- Backend:
cd backend
npm install
npx prisma migrate dev
npm run dev

- Frontend:
cd frontend
npm install
npm run dev

## ✨ Features

User registration with email verification

CRUD operations on notes

AI-powered summarization via OpenRouter

Full-text search (PostgreSQL contains)

Responsive and minimal UI

## 🛠 Improvements for Production

Add CI/CD for Docker + GitHub Actions

Add server-side validation (Zod / Joi)

Integrate a real email service (SendGrid / Resend)

