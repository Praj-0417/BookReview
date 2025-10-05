# LogikSutra Book Review Platform

A full-stack MERN application for discovering, reviewing, and curating books with a mindful, community-first experience. Readers can browse curated titles, filter by genre, compare ratings, and maintain a personal library of contributions and reviews.

## Architecture at a Glance

- **Backend (`backend/`)** – Node.js/Express API, MongoDB (via Mongoose), JWT auth, image upload with Multer, and seed scripts for sample data.
- **Frontend (`frontend/`)** – React (CRA) single-page app with React Router, Auth/Theme context providers, Axios-based API client, Tailwind-style utility classes.
- **Media uploads** – Stored locally under `backend/uploads/` and exposed via `/uploads` static route (configure persistent storage for production).
- **Key flows**
  - Auth: registration/login handled in `backend/controllers/auth.js`, tokens stored in `localStorage` and attached via Axios interceptor (`frontend/src/api/index.js`).
  - Books: list/search/filter/paginate (`HomePage.js`), CRUD with ownership checks (`books.js` controller + `protect` middleware).
  - Reviews: nested resource per book (`reviews.js` controller) with uniqueness guard per user.

## Prerequisites

- Node.js 18+
- npm 8+
- MongoDB cluster or local instance
- Optional: Cloudinary/S3 or similar for production-ready image storage

## Environment Variables

Create `backend/.env` with:

```
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<random string>
```

Frontend currently points to `http://localhost:5000/api` in `frontend/src/api/index.js`. Update this file (or refactor to use `process.env.REACT_APP_API_BASE_URL`) when deploying to a different domain.

## Local Development

1. **Install dependencies**
   ```powershell
   cd backend
   npm install

   cd ..\frontend
   npm install
   ```
2. **Start the backend (Express + MongoDB)**
   ```powershell
   cd backend
   npm run dev
   ```
   Runs on `http://localhost:5000`. Static uploads live at `http://localhost:5000/uploads/<filename>`.
3. **Start the frontend (React)**
   ```powershell
   cd frontend
   npm start
   ```
   Opens `http://localhost:3000` with HMR.
4. **Populate sample data (optional)**
   ```powershell
   cd backend
   npm run seed        # import sample users/books/reviews
   npm run seed:destroy # remove all seeded data
   ```

### Useful NPM Scripts

| Location | Script | Purpose |
|----------|--------|---------|
| `backend/` | `npm run dev` | Nodemon-powered API server |
| `backend/` | `npm run seed` | Import curated dummy data |
| `frontend/` | `npm start` | CRA dev server |
| `frontend/` | `npm run build` | Production-ready bundle |
| `frontend/` | `npm test` | React Testing Library/Jest runner |

## Testing & Linting

- Frontend: `npm test` (watch mode). No custom backend tests included yet.
- Keep controller responses consistent with the existing `{ success, data }` pattern to avoid UI regressions.

## Deployment Overview

### Backend (Express API)

1. Provision a Node-compatible host (Render, Railway, Heroku, etc.).
2. Set environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`).
3. Deploy contents of `backend/` (install via `npm install`, start with `node server.js`).
4. Configure persistent storage or adapt `middleware/upload.js` to a cloud storage provider for book cover uploads.

### Frontend (React SPA)

1. Update API base URL in `frontend/src/api/index.js` to your deployed backend URL.
2. Run `npm run build` inside `frontend/`.
3. Deploy the `frontend/build` output to Netlify, Vercel, GitHub Pages, or any static host.

### CORS & HTTPS

- Backend enables permissive CORS by default. For production, consider configuring allowed origins explicitly (e.g., via the `cors` package options in `backend/server.js`).
- When serving over HTTPS, ensure the API base URL also uses HTTPS to avoid mixed-content issues in the browser.

## Git & GitHub Workflow

1. **Initialize the repo**
   ```powershell
   cd C:\Users\Asus\OneDrive\Desktop\Projects_intern\LogikSutra
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. **Connect to GitHub**
   ```powershell
   git remote add origin https://github.com/<your-username>/logiksutra.git
   git branch -M main
   git push -u origin main
   ```
3. **Ongoing development**
   - Use feature branches (`git checkout -b feature/<name>`).
   - Ensure `node_modules/`, `.env`, and `backend/uploads/` remain untracked via the provided `.gitignore`.

## Troubleshooting

- **MongoDB connection failures** – check `MONGO_URI`, IP whitelist, and network policies; `connectDB` logs full errors to the console.
- **401 Unauthorized from API** – ensure JWT token is stored in `localStorage`; you can force logout via the avatar dropdown in the UI.
- **Images missing after redeploy** – local uploads are ephemeral; configure `upload.js` to stream to a bucket or pre-populate sample covers.

## Future Enhancements

- Externalize API base URL via environment variables in the frontend.
- Add automated tests for backend controllers and React components.
- Introduce role-based access for admin moderation.
