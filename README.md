# OncoAI Portal

A secure healthcare MVP prototype for a Breast Cancer Second Opinion Portal extending the Socialgoodai platform.

## Features

- **Role-Based Access Control**: Patient, Doctor, and Admin roles.
- **Patient Dashboard**: Manage consent, upload medical records, submit queries, and receive doctor responses.
- **Doctor Dashboard**: View assigned patients, review encrypted medical documents, respond to queries, and view AI recommendations (placeholder).
- **Admin Dashboard**: Manage platform users and view comprehensive audit logs.
- **Security**: JWT Authentication, bcrypt password hashing, AES-256 data encryption for sensitive fields, robust Audit Logging, and Next.js Edge Middleware for route protection.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT via `jose` and `jsonwebtoken`
- **Infrastructure**: Docker Compose

## Getting Started

### 1. Prerequisites

- Node.js (v18+)
- Docker and Docker Compose (or a local PostgreSQL instance)

### 2. Environment Variables

Create a `.env` file in the root directory (or use the one already provided):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/oncoai?schema=public"
JWT_SECRET="super-secret-jwt-key-replace-in-production"
ENCRYPTION_KEY="12345678901234567890123456789012" # 32 bytes for AES-256
```

### 3. Start PostgreSQL Database

If you have Docker installed, you can spin up the database using:

```bash
docker compose up -d
```

*Note: If you don't use Docker, ensure you have a running PostgreSQL database matching the `DATABASE_URL` credentials.*

### 4. Install Dependencies

```bash
npm install
```

### 5. Setup Database and Seed

Run Prisma db push to create the tables, and seed the database with demo users:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Users

The seed script creates the following users for testing:

- **Admin**: `admin@oncoai.com` / `admin123`
- **Doctor**: `doctor@oncoai.com` / `doctor123`
- **Patient**: `patient@example.com` / `patient123`
