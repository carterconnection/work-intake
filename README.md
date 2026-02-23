# Work Intake App

Production-ready intake and admin dashboard for Carter Connection.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development

## 1) Install
```bash
npm install
```

## 2) Configure environment variables
Copy `.env.example` to `.env` and set values:

- `DATABASE_URL` (required)
  - Local SQLite: `file:./dev.db`
  - Postgres example: `postgresql://USER:PASSWORD@HOST:5432/DB?schema=public`
- `ADMIN_PASSWORD` (required)

## 3) Run Prisma migration
```bash
npx prisma migrate dev --name init
```

## 4) Run development server
```bash
npm run dev
```

Open:
- Public form: `http://localhost:3000/`
- Admin login: `http://localhost:3000/admin/login`

## Scripts
```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
```

## Deployment notes
This app is deployment-ready for Vercel, Render, or a VPS.

### Environment variables on your host
Set:
- `DATABASE_URL`
- `ADMIN_PASSWORD`

### Prisma for production
- For Postgres, update `prisma/schema.prisma` datasource provider from `sqlite` to `postgresql`.
- Set Postgres `DATABASE_URL`.
- Run:
```bash
npx prisma migrate deploy
```

### Security and spam prevention
- Admin pages are guarded by an HTTP-only signed cookie session.
- Public form includes a hidden honeypot (`website`).
- Basic in-memory IP rate limiting is applied server-side (best effort).
- Email cooldown is enforced server-side using recent submissions.
