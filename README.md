# Modern Portfolio Website

A production-ready, full‑stack portfolio platform built with React (Vite) + TypeScript on the frontend and Express + MongoDB + Cloudinary on the backend. It features a modern UI, dark/light themes, content management (Projects, Blog, About, Skills, Experience, Home content), authentication, file uploads, and performance‑oriented bundling.

<p align="left">
  <a href="https://vitejs.dev" target="_blank"><img alt="Vite" src="https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white"></a>
  <a href="https://react.dev" target="_blank"><img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=061a23"></a>
  <a href="https://expressjs.com" target="_blank"><img alt="Express" src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white"></a>
  <a href="https://www.mongodb.com" target="_blank"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white"></a>
  <a href="https://vercel.com" target="_blank"><img alt="Vercel" src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white"></a>
</p>

---

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Monorepo structure](#monorepo-structure)
- [Quick start (local dev)](#quick-start-local-dev)
- [Environment variables](#environment-variables)
- [API overview](#api-overview)
- [Build and production](#build-and-production)
- [Deployment](#deployment)
  - [Frontend on Vercel](#frontend-on-vercel)
  - [Backend on Render (recommended)](#backend-on-render-recommended)
  - [Alternative: Backend on Vercel serverless](#alternative-backend-on-vercel-serverless)
- [Security and production notes](#security-and-production-notes)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features
- Modern, responsive portfolio with sections: Home, Projects, About, Blog, Contact, and an Admin Dashboard
- React Router SPA with SPA fallbacks configured for Vercel
- Theming and UI
  - Dark/light themes via `next-themes`
  - Shadcn/Radix‑powered, accessible UI primitives
  - Smooth animations with Framer Motion
- Content Management
  - CRUD endpoints for Projects, Blog posts, About, Skills, Experience, Contact, and Home content
  - Image/file uploads with Multer → Cloudinary
- AuthN/AuthZ
  - JWT issuance on login (stored as httpOnly cookie by backend and token stored in localStorage by frontend)
  - Protected dashboard route on the frontend; dashboard menu only when admin logged in
- Performance
  - Vite code‑splitting, vendor chunking, gzip/brotli pre‑compression
  - Helmet + rate limiting in API

## Tech stack
- Frontend: React 18, Vite 5, TypeScript, Tailwind CSS, Radix UI, Shadcn UI patterns, Framer Motion
- Backend: Node.js 18+, Express 5, Mongoose 8, Cloudinary, Multer, Helmet, express‑rate‑limit, CORS, JWT, Joi
- Infra: Vercel (frontend), Render/Railway/Atlas (backend + DB)

## Monorepo structure
```
PortifolioWebsite/
├─ Backend/
│  ├─ app.js
│  ├─ server.js
│  ├─ Routes/                      # All REST endpoints
│  ├─ Controllers/                 # Business logic
│  ├─ Models/                      # Mongoose models
│  ├─ Configs/                     # DB, Cloudinary, Multer
│  ├─ Public/Uploads/              # Local upload temp (Cloudinary used)
│  ├─ .env                         # Backend env (not committed)
│  └─ package.json
├─ frontend/                       # Canonical frontend (Vercel builds this)
│  ├─ src/
│  ├─ index.html
│  ├─ vite.config.ts               # base: "/" for Vercel
│  └─ package.json
├─ Frontend/                       # Duplicate; safe to delete after migration
├─ vercel.json                     # Builds frontend/ and SPA rewrites
└─ README.md
```

> Important: The canonical frontend is the `frontend/` directory. The root `vercel.json` is configured to build from `frontend/package.json`. You can remove the duplicated `Frontend/` folder once you confirm everything is working.

## Quick start (local dev)
### Prerequisites
- Node.js ≥ 18
- MongoDB connection string (Atlas or local)
- Cloudinary account (for image uploads)

### 1) Backend
```bash
# from project root
cd Backend
npm ci
# create .env (see below) then:
npm run dev   # or: npm start
# server runs on http://localhost:3000 (PORT is configurable)
```

### 2) Frontend
```bash
# from project root
cd frontend
npm ci
# create .env (optional for local)
# VITE_BACKEND_URL=http://localhost:3000
npm run dev   # Vite dev server at http://localhost:5000
```

Login flow (dev): open http://localhost:5000 → navigate to Login → use credentials from your DB/seed. Dashboard appears in the navbar only for admin users.

## Environment variables
### Backend (.env in `Backend/`)
- MONGODB_URL=... (required)
- JWT_SECRET=... (required)
- CLOUD_NAME=... (required)
- CLOUDINARY_API_KEY=... (required)
- CLOUDINARY_API_SECRET=... (required)
- NODE_ENV=development|production (optional)
- PORT=3000 (optional; defaults to 4000 in code if not set)

### Frontend (.env in `frontend/`)
- VITE_BACKEND_URL=https://your-backend.example.com (required in production for login/dashboard)

## API overview
Base URL examples:
- Local: `http://localhost:3000/api`
- Prod: `https://your-backend.example.com/api`

Auth
- POST /login
- GET /logout (auth)
- GET /getuser (auth)
- GET /getalluser (auth, admin)
- PUT /updateuser (auth, multipart file `profile_pic`)
- DELETE /deleteuser/:id (auth, admin)

Projects
- POST /createproject (auth, multipart file `image`)
- GET /getallproject
- GET /getproject/:id (auth)
- PUT /updateproject/:id (auth, multipart file `image`)
- DELETE /deleteproject/:id (auth)

About
- POST /createabout (auth, multipart file `profile_pic`)
- GET /getabout
- PUT /updateabout/:id (auth, multipart file `profile_pic`)
- DELETE /deleteabout/:id (auth)

Home Content
- POST /createhomecontent (auth, multipart file `profile_pic`)
- GET /gethomecontent
- PUT /updatehomecontent/:id (auth)
- DELETE /deletehomecontent/:id (auth)

Blogs
- POST /createblog (auth, multipart file `image`)
- GET /getblogs
- PUT /updateblog/:id (auth, multipart file `image`)
- DELETE /deleteblog/:id (auth)

Contact, Skills, Experience also exposed similarly.

Auth header/cookie note:
- Backend sets a `token` cookie (httpOnly in production) and also returns `token` in JSON. Middleware currently checks the `Authorization: Bearer <token>` header. The frontend stores `token` and `role` in localStorage; the dashboard route guard relies on `isLoggedIn` + `role`.

## Build and production
### Frontend
```bash
cd frontend
npm run build     # outputs to dist/
npm run preview
```
- Vite `base` is set to `/` to work with Vercel static hosting.
- SPA rewrite is configured in root `vercel.json`.

### Backend
Typical Node server. For container or PaaS deploys, ensure environment variables are set and `npm start` runs `server.js`.

## Deployment
### Frontend on Vercel
- The root `vercel.json` builds `frontend/` using `@vercel/static-build` and publishes `dist/`.
- SPA rewrites are configured so deep links (e.g., `/projects`) don’t 404 on refresh.
- In Vercel Project → Settings → Environment Variables, set `VITE_BACKEND_URL` to your backend’s public URL.

### Backend on Render (recommended)
- There is a `Backend/render.yaml`. Ensure the environment variable names match your code:
  - Use: `MONGODB_URL`, `JWT_SECRET`, `CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Build Command: `cd Backend && npm ci`
- Start Command: `cd Backend && npm start`
- Health check path: `/` (the root path returns "Backend is running")

### Alternative: Backend on Vercel serverless
- Requires refactoring `server.js` to export a handler and mapping `/api/*` in root `vercel.json` to `Backend/server.js` with `@vercel/node`.
- If you want this path, see the suggested handler pattern in issues/PRs or ask for the refactor.

## Security and production notes
- CORS: For cookie auth, set `cors({ origin: ["https://your-frontend-domain"], credentials: true })` and `app.set('trust proxy', 1)` in production; ensure cookies use `secure: true, sameSite: 'none'`.
- Rate limiting: Enabled on `/api/*`.
- Helmet: Enabled.
- File uploads: Currently using Multer disk storage before Cloudinary upload; consider switching to `memoryStorage` for purely ephemeral processing.

## Screenshots
Add your screenshots here:
- Home Page
- Projects Grid
- Dashboard

```
./docs/screenshots/home.png
./docs/screenshots/projects.png
./docs/screenshots/dashboard.png
```

## Roadmap
- [ ] Switch Multer to memory storage
- [ ] Unify auth to cookie‑only or header‑only across FE/BE
- [ ] Add E2E tests for critical flows (login, CRUD)
- [ ] CI workflow (lint/typecheck/build/smoke) on PRs
- [ ] Migrate entirely to `frontend/` and delete `Frontend/`

## Contributing
PRs are welcome! Please:
- Create a feature branch
- Keep changes focused
- Describe the change and any breaking behavior

## License
MIT

## Acknowledgements
- [Vite](https://vitejs.dev/) • [React](https://react.dev/) • [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) & shadcn/ui patterns
- [Express](https://expressjs.com/), [Mongoose](https://mongoosejs.com/), [Cloudinary](https://cloudinary.com/)
