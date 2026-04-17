# Taza App

Taza App is a full-stack mobile news platform built with an Expo React Native frontend and a Node.js + Express backend. It supports category-based news browsing, location-aware feed filtering, live and archived video content, citizen-journalist submissions, simple auth flows, admin upload tools, and a PostgreSQL-backed content store.

This repository is organized as a two-part application:

- `frontend/`: Expo + React Native mobile client
- `backend/`: Express API + Prisma + PostgreSQL + Redis

## Highlights

- Mobile news feed with category filtering and search
- Location-aware feed personalization
- Live video and archived video sections
- Citizen journalist submissions with optional image upload
- Admin content upload flows for news and video
- Prisma ORM with PostgreSQL
- Redis-backed caching with graceful fallback
- Socket.IO events for realtime updates
- Local Android build support for APK generation

## Tech Stack

### Frontend

- Expo
- React Native
- TypeScript
- React Navigation
- Zustand
- Axios
- Expo Location
- Reanimated
- Lottie

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Redis
- Zod
- Socket.IO
- Multer

## Repository Structure

```text
taza-app/
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   |-- schema.prisma
|   |   `-- seed.ts
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   |-- utils/
|   |   |-- app.ts
|   |   `-- server.ts
|   |-- .env.example
|   |-- package.json
|   `-- tsconfig.json
|-- frontend/
|   |-- android/
|   |-- assets/
|   |-- src/
|   |   |-- components/
|   |   |-- constants/
|   |   |-- hooks/
|   |   |-- navigation/
|   |   |-- screens/
|   |   |-- services/
|   |   |-- store/
|   |   `-- types/
|   |-- App.tsx
|   |-- app.json
|   |-- babel.config.js
|   |-- package.json
|   `-- tsconfig.json
|-- docker-compose.yml
|-- .gitignore
`-- README.md
```

## Architecture Overview

### Frontend flow

The mobile app is centered around a set of screens inside `frontend/src/screens`, backed by service clients in `frontend/src/services` and Zustand stores in `frontend/src/store`.

Key pieces:

- `App.tsx`: app bootstrap, theme wiring, location bootstrap
- `navigation/RootNavigator.tsx`: screen and tab navigation
- `services/api.ts`: shared Axios client
- `store/authStore.ts`: auth/profile persistence
- `store/newsStore.ts`: feed loading, categories, and refresh state

### Backend flow

The backend follows a layered approach:

- `routes/`: route registration
- `controllers/`: request/response handling
- `services/`: business logic and Prisma access
- `middlewares/`: validation, upload handling, access checks, location context
- `config/`: env, Prisma, Redis setup
- `utils/`: caching, pagination, socket setup, shared helpers

### Data model

Prisma models currently cover:

- `User`
- `News`
- `Video`
- `CitizenNews`
- `Like`

See [schema.prisma](backend/prisma/schema.prisma) for the exact schema.

## Local Development

### Requirements

- Node.js 20+
- npm
- Docker Desktop
- Android Studio or an Android device

## Environment Variables

The backend expects a `.env` file in `backend/`.

Start from:

```bash
cd backend
copy .env.example .env
```

Default example values:

```env
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://taza_user:taza_password@localhost:5432/taza_news
REDIS_URL=redis://localhost:6379/0
CORS_ORIGIN=http://localhost:8081
NEWS_PAGE_SIZE=10
SCROLL_FREEZE_LIMIT=12
UPLOAD_DIR=uploads
```

Notes:

- `DATABASE_URL` must match your actual PostgreSQL credentials.
- `CORS_ORIGIN=*` is convenient for local testing, but should be tightened for production.
- `UPLOAD_DIR` is used for local file storage and matters if you deploy the backend.

## Database and Redis

The repository includes a local Docker setup for PostgreSQL and Redis:

```bash
docker compose up -d
```

This starts:

- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

Services defined in [docker-compose.yml](docker-compose.yml):

- `postgres`
- `redis`

## Backend Setup

```bash
cd backend
npm install
npm run prisma:generate
npx prisma db push
npm run prisma:seed
npm run dev
```

Useful backend scripts:

- `npm run dev`: run backend in watch mode
- `npm run build`: compile TypeScript
- `npm run start`: run compiled backend
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: run Prisma development migration flow
- `npm run prisma:seed`: seed demo data

Health check:

```text
GET http://localhost:8000/health
```

## Frontend Setup

```bash
cd frontend
npm install
npm run start
```

Useful frontend scripts:

- `npm run start`: start Expo dev server
- `npm run android`: run Android build/dev flow
- `npm run ios`: run iOS build/dev flow
- `npm run web`: run Expo web
- `npm run lint`: lint frontend files if ESLint is configured

## Running the App on a Real Phone

If the backend is running on your laptop during development, your phone must be able to reach it over the same network.

### Step 1: find your laptop IP

On Windows:

```powershell
ipconfig
```

Use the IPv4 address from your active Wi-Fi adapter, for example:

```text
192.168.0.138
```

### Step 2: point the frontend to that backend

Update the base URL in [frontend/src/services/api.ts](frontend/src/services/api.ts) to:

```ts
baseURL: "http://192.168.0.138:8000",
```

### Step 3: make sure the phone can reach the backend

- phone and laptop must be on the same Wi-Fi
- backend must be running
- PostgreSQL and Redis must be running
- Windows firewall must allow inbound access to port `8000`

### Step 4: test connectivity

Open this in the phone browser:

```text
http://YOUR_LAPTOP_IP:8000/health
```

If that works, the app can usually reach the API too.

## Building an APK

Because this repository already contains `frontend/android`, you can build a release APK locally with Gradle.

```bash
cd frontend
npm install
cd android
./gradlew assembleRelease
```

On Windows PowerShell:

```powershell
cd frontend
npm install
cd android
.\gradlew.bat assembleRelease
```

Expected output path:

```text
frontend/android/app/build/outputs/apk/release/app-release.apk
```

After generating the APK:

- transfer it to your Android device
- allow installation from unknown sources if prompted
- install and test against your backend

## App Icon

The Expo app config points to the logo file in:

- `frontend/src/logo.png`

Configured in [frontend/app.json](frontend/app.json):

- `expo.icon`
- `expo.android.adaptiveIcon`

Note:

- Since this project also has a native `android/` folder, final installed icon behavior may also depend on native Android resource files if you later customize them manually.

## Cloud Deployment

For permanent availability, you should deploy the backend and database to the cloud instead of relying on your laptop.

Recommended hosting shape:

- Backend: Render or Railway
- PostgreSQL: Render Postgres, Railway Postgres, Neon, or Supabase
- Redis: Render Key Value, Railway Redis-like service, Upstash, or Redis Cloud
- File storage: persistent disk or object storage if uploads must survive redeploys

### Important deployment note

This backend stores uploaded files locally under:

- `backend/uploads/`

That means:

- local development works fine
- cloud platforms with ephemeral disks may lose uploaded files after restart or redeploy

For production, prefer one of these:

- a platform with persistent volume support
- object storage such as S3-compatible storage for uploads

### Cloud deployment checklist

1. Push the code to GitHub
2. Create a backend service
3. Provision PostgreSQL
4. Provision Redis if desired
5. Set environment variables from `backend/.env.example`
6. Run Prisma client generation and schema sync or migrations
7. Replace the frontend API base URL with the public backend URL
8. Rebuild the APK

## API Overview

### Public/core endpoints

- `GET /health`
- `GET /news`
- `GET /news/:id`
- `GET /categories`
- `GET /videos`
- `GET /videos/archive`
- `GET /live`
- `POST /users/location`
- `POST /citizen-news`
- `POST /like`

### Auth/profile endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `GET /users/profile/:id`
- `PATCH /users/profile/:id`
- `PATCH /users/password/:id`

### Admin endpoints

- `GET /admin/users`
- `POST /admin/news`
- `PATCH /admin/news/:id`
- `DELETE /admin/news/:id`
- `POST /admin/videos`
- `PATCH /admin/videos/:id`
- `DELETE /admin/videos/:id`

## Example Requests

### Save location

```http
POST /users/location
Content-Type: application/json
```

```json
{
  "name": "Guest Reader",
  "city": "Mumbai",
  "state": "Maharashtra",
  "isGuest": true
}
```

### Toggle like

```http
POST /like
Content-Type: application/json
```

```json
{
  "userId": "user_id_here",
  "newsId": "news_id_here"
}
```

### Citizen news submission

Use `multipart/form-data` with:

- `title`
- `content`
- `state`
- `language`
- optional `image`

## Realtime Events

Socket events currently emitted by the backend include:

- `connection:ready`
- `citizen-news:created`
- `news:liked`

## Data Seeding

The seed script inserts:

- one admin user
- one demo user
- one guest user
- sample news articles
- sample videos
- a sample citizen-news entry
- a sample like relation

Run:

```bash
cd backend
npm run prisma:seed
```

## Development Notes

- Redis is optional at runtime. If Redis is unavailable, the backend still serves requests without cache hits.
- News listing supports pagination, category filtering, text search, and location-aware state filtering.
- Anonymous users may receive a `freezeFeed` flag after repeated feed requests based on `SCROLL_FREEZE_LIMIT`.
- The frontend currently depends on a reachable backend URL. If the backend is deployed to the cloud, internet connectivity is required for content operations.

## Type Checking and Build Verification

Backend:

```bash
cd backend
npm run build
```

Frontend TypeScript check:

```bash
cd frontend
npx tsc --noEmit
```

## GitHub and Repo Hygiene

Before pushing to GitHub:

- do not commit `backend/.env`
- do not commit `frontend/.env`
- do not commit `node_modules`
- do not commit generated Android build artifacts
- do not commit local logs or temporary files

The root `.gitignore` already includes the main local/build outputs for this repository.

## Known Operational Considerations

- If the backend runs on your laptop, the app works only while the laptop is on and reachable on the same network.
- If deployed to the cloud, the phone must have internet access to fetch data.
- Uploaded files currently live on local disk, so production deployment should account for persistent storage.
- The mobile client uses a shared Axios base URL and should be updated whenever backend hosting changes.

## Suggested Next Steps

- Move the frontend API base URL to environment-based configuration
- Add a consistent no-internet user-facing error message
- Move file uploads to persistent cloud storage for production
- Add automated tests for backend service and route behavior
- Add CI for typecheck/build validation

## License

No license file is currently included in this repository. Add one before publishing publicly if needed.
