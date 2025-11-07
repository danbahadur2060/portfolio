Deployment guide — Frontend (Vercel) + Backend (Render or Railway)

Overview

- This repository contains two apps:
  - `Frontend/` — Vite + React app (static site)
  - `Backend/` — Express API server (Node)

Why Vercel alone won't run the Backend

- Vercel is optimized for static sites and serverless functions. Your Backend is an Express server that expects to run continuously on a host. Deploying it "as-is" on Vercel won't work unless you convert each route into Vercel Serverless Functions.

Recommended approach (simple, reliable)

1. Deploy Backend to Render (or Railway / Heroku / Fly)
   - Render supports long-running Node web services and has a free tier.
   - Use the included `Backend/render.yaml` as a starting point (fill in repo URL and env vars).

Render quick steps

- Go to https://dashboard.render.com/new
- Choose "Deploy from Git" and connect your GitHub repo
- If you prefer YAML, choose "Use Render YAML" and add `Backend/render.yaml` (update placeholders)
- Ensure Build Command: `cd Backend && npm ci`
- Start Command: `cd Backend && npm start`
- Set environment variables on Render (MONGO_URI, JWT_SECRET, Cloudinary keys etc.)
- Deploy. The backend will be available at a public URL (e.g. https://portfolio-backend.onrender.com)

2. Deploy Frontend to Vercel

- In Vercel, create a new project and point to this repository.
- When prompted, set the Project Root to `Frontend` (or keep root and rely on `vercel.json` already in repo).
- Build Command: `npm ci && npm run build`
- Output Directory: `dist`
- Add an Environment Variable in Vercel: `VITE_BACKEND_URL` = `https://<your-backend-domain>` (the URL Render gives you)
- Deploy. Vercel will build the static assets and host the frontend.

## Docker / container-based option (production-ready)

If you prefer to run both apps as containers (useful for VPS, cloud VMs, ECS, GCP Run, or pushing images to a registry):

1. Build and run locally with docker-compose (requires Docker installed):

```powershell
# from repo root
docker-compose build
docker-compose up -d
```

2. The frontend will be available at http://localhost:3000 and will proxy to the backend at http://localhost:4000 (you can change the mapping in `docker-compose.yml`).

3. To publish images to a registry (Docker Hub / GitHub Container Registry / GitLab), build and push the `Backend` and `Frontend` images using the provided Dockerfiles, then deploy those images to your cloud provider.

## Notes on production readiness

- Ensure secrets (MONGO_URI, JWT_SECRET, Cloudinary keys, etc.) are stored securely in your host/cloud secret manager and not committed to the repo.
- Configure monitoring, logging, and backup for your MongoDB instance.
- Use HTTPS in front of both services (Render and Vercel provide HTTPS automatically; if self-hosting consider using a reverse proxy with TLS like Traefik or Nginx).

If you'd like, I can:

- Create a GitHub Action workflow that builds the frontend, pushes a production-ready artifact, and optionally builds/pushes Docker images to a registry.
- Create a sample Nginx config for SPA routing if you plan to host the frontend on a custom server.

Notes and tips

- CORS: backend uses `cors({ origin: '*' })` in `Backend/app.js`, so no additional CORS configuration is necessary. For security you may later restrict origins to your Vercel domain.
- Local testing: set `VITE_BACKEND_URL` in `Frontend/.env` or in your shell when running `npm run dev`.

Optional: Convert Backend to Vercel Serverless API

- If you want a single Vercel project for both frontend and backend, you'll need to convert Express endpoints into serverless functions placed under `Frontend/api/` or use Vercel's Serverless Function conventions. This is non-trivial and involves refactoring controllers to function handlers and replacing long-running features (like file uploads) with Vercel-compatible patterns.

If you'd like, I can:

- Fill `Backend/render.yaml` with your repo URL and create a Render deployment automatically (if you provide repo details or give me permission to push). Or,
- Convert the backend endpoints into Vercel Serverless Functions (I can do a few endpoints as a demo), or
- Add `@types/node` to `Frontend` if Vercel build still complains about `process` after the earlier fixes.

Tell me which path you prefer and I will implement the next steps and verify a local build.
