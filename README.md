## KodBank

KodBank is a minimal banking-style demo focused on **users** and **tokens** only.  
It is built with **Next.js App Router**, **Prisma**, and **MySQL on Aiven**, and is ready to deploy on **Vercel**.

### Tech stack

- **Frontend + API**: Next.js (App Router, TypeScript)
- **ORM / DB**: Prisma 7, MySQL
- **Auth**: Stateless token lookup in `user_tokens` table
- **Styling**: Tailwind CSS 4 (utility-first)

### Database schema (exactly two tables)

- **users**
  - `id` (UUID, PK)
  - `email` (unique, not null)
  - `password_hash` (hashed with bcrypt, not null)
  - `full_name` (nullable)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- **user_tokens**
  - `id` (UUID, PK)
  - `user_id` (FK → users.id)
  - `token` (string, unique)
  - `type` (e.g. `"AUTH"`)
  - `expires_at` (timestamp)
  - `created_at` (timestamp)
  - `revoked` (boolean, default `false`)

### ERD (text)

```text
users (id PK) 1 ──── * user_tokens (id PK)
```

### Environment variables

- **DATABASE_URL** – MySQL connection string from Aiven, e.g.

```bash
# Example: your current Aiven MySQL URI
DATABASE_URL="mysql://avnadmin:YOUR_PASSWORD@kod01-rajeevbrar69-d91c.i.aivencloud.com:15046/defaultdb?ssl-mode=REQUIRED"
```

Create a `.env` (or `.env.local` for Next.js) in the project root:

```bash
cp .env .env.local
```

Then edit `.env.local` and replace the sample connection string with your Aiven credentials.

### Running locally

1. **Install dependencies**

```bash
npm install
```

2. **Set your database URL**

Edit `.env.local` and set `DATABASE_URL` to your Aiven MySQL URL (for you, use the `mysql://...` Service URI from Aiven).

3. **Run Prisma migrations**

```bash
npx prisma migrate dev --name init_kodbank
```

This will create the `users` and `user_tokens` tables in your Aiven database.

4. **Start the dev server**

```bash
npm run dev
```

App will be available at `http://localhost:3000`.

### API endpoints

- **POST `/api/auth/register`**
  - Request JSON: `{ email, password, confirmPassword, fullName? }`
  - Response: created user (without password) or error.

- **POST `/api/auth/login`**
  - Request JSON: `{ email, password }`
  - On success:
    - Creates a new `user_tokens` row.
    - Sets a `kodbank_token` **HTTP-only cookie**.
    - Returns `{ token, expiresAt, user }` in JSON.

- **POST `/api/auth/logout`**
  - Revokes the current token (marks `revoked = true`) and clears the cookie.

- **POST `/api/auth/logout-all`**
  - Revokes all tokens for the current user and clears the cookie.

- **GET `/api/me`**
  - Protected; reads token from `Authorization: Bearer <token>` or `kodbank_token` cookie.
  - Returns `{ id, email, fullName }` for the current user.

All endpoints are **stateless**: there is no server-side session; each request validates the token against `user_tokens` (checking expiry and `revoked`).

### Frontend routes

- **`/`** – Landing page with CTAs to register or log in.
- **`/register`** – Registration form wired to `POST /api/auth/register`.
- **`/login`** – Login form wired to `POST /api/auth/login`. Also stores the returned token in `localStorage` for optional client-side calls.
- **`/dashboard`** – Protected dashboard:
  - Server-side check using the `kodbank_token` cookie.
  - If unauthenticated/invalid token → redirects to `/login`.
  - Displays a friendly “KodBank” dashboard with simulated balance and user info.

### Security & statelessness

- Passwords are hashed with **bcryptjs**; plain passwords are never stored.
- Each login issues a new random token (48-byte hex string) stored in `user_tokens`.
- Tokens are validated on every protected request via DB lookup:
  - Token exists
  - Not expired
  - Not revoked
- Basic rate limiting is **not** implemented, but you could add it in API handlers (e.g., by IP + timestamp) or using Vercel Edge Middleware.

### Deploying to Vercel

1. Commit this project to a GitHub repository.
2. In Vercel, create a new project and import the repo.
3. Set environment variables in the Vercel dashboard:

   - `DATABASE_URL` – your Aiven PostgreSQL URL.

4. Keep the default build and output settings:

   - Build command: `npm run build`
   - Install command: `npm install`
   - Output directory: `.next`

5. Deploy. Vercel will:

   - Install dependencies.
   - Build the Next.js app.
   - Host API route handlers as serverless functions.

After deploy, run Prisma migrations against the same `DATABASE_URL` (from your machine or a CI step):

```bash
npx prisma migrate deploy
```

This keeps the schema in sync with your Aiven database.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
