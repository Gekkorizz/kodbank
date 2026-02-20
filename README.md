# KodBank

KodBank is a production-ready banking-style application featuring **user authentication**, **secure token management**, and a **modern dashboard** with responsive design. Built with **Next.js 16**, **Prisma 6**, **MySQL**, and a comprehensive UI/UX upgrade.

## ✨ Key Features

- **Secure Authentication**: Password policy enforcement, bcrypt hashing, httpOnly cookie-only auth
- **Modern Auth UI**: Floating label inputs, real-time password strength meter, form validation
- **Responsive Dashboard**: Desktop sidebar + mobile bottom navigation, account hero card, quick actions
- **Design System**: Custom CSS utilities, dark theme, semantic colors, smooth transitions
- **Production Ready**: Full test coverage (unit + E2E), TypeScript, form validation with Zod

## Tech Stack

- **Frontend + API**: Next.js 16 (App Router, TypeScript)
- **Database & ORM**: Prisma 6.13.0, MySQL
- **Authentication**: Stateless token lookup, httpOnly cookies, bcrypt password hashing
- **UI & Styling**: 
  - Tailwind CSS v4 (utility-first)
  - lucide-react (icons)
  - react-hook-form (form state)
  - zod (validation)
  - sonner (toasts)
  - recharts (charts)
- **Testing**: Vitest (unit), Playwright (E2E)

## Database Schema

### `users` table
- `id` (UUID, PK)
- `email` (unique, not null)
- `passwordHash` (bcrypt hashed, not null)
- `fullName` (nullable)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### `userTokens` table
- `id` (UUID, PK)
- `userId` (FK → users.id)
- `token` (string, unique)
- `type` (enum: AUTH)
- `expiresAt` (timestamp, 24hrs)
- `createdAt` (timestamp)
- `revoked` (boolean, default false)

## Password Policy

All passwords must contain:
- ✓ Minimum 8 characters
- ✓ At least one uppercase letter (A-Z)
- ✓ At least one lowercase letter (a-z)
- ✓ At least one number (0-9)
- ✓ At least one special character (!@#$%^&*)

Example valid password: `TestPass123!`

## Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Then set your MySQL connection string:

```env
DATABASE_URL="mysql://user:password@host:port/database?ssl-mode=REQUIRED"
```

## Setting Up Locally

1. **Install dependencies**
```bash
npm install
```

2. **Configure your `.env.local`**
Edit and set `DATABASE_URL` to your MySQL connection string

3. **Run Prisma migrations**
```bash
npx prisma migrate dev
```

4. **Start the dev server**
```bash
npm run dev
```

Server runs at `http://localhost:3000`

## Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- **POST `/api/auth/register`**
  - Request: `{ email, password, confirmPassword, fullName? }`
  - Response: User object (without password) or error
  - Password must meet policy requirements
  - Confirm password must match password field

- **POST `/api/auth/login`**
  - Request: `{ email, password }`
  - Response: User object (token NOT in response body)
  - Sets HTTP-only Secure cookie: `kodbank_token`
  - Token expires after 24 hours

- **POST `/api/auth/logout`**
  - Revokes current token, clears cookie

- **POST `/api/auth/logout-all`**
  - Revokes all user tokens, clears cookie

- **GET `/api/me`**
  - Protected endpoint (requires valid token cookie)
  - Returns: `{ id, email, fullName }`

## Frontend Pages

- **`/`** – Landing page (hero, features, CTAs)
- **`/register`** – Registration with password strength meter
- **`/login`** – Login with floating label inputs
- **`/dashboard`** – Protected dashboard with:
  - Responsive header + sidebar (desktop) / bottom nav (mobile)
  - Account hero card with balance display
  - Quick action buttons (Send, Request, Pay Bills, View History)
  - Summary cards (Balance, Pending Txns, Monthly Limit)
  - Recent transactions table
  - Logout button

## Testing

### Unit Tests (Vitest)

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Auth API tests
npm run test -- tests/api/auth/
```

Test files:
- `tests/api/auth/register.test.ts` – Registration endpoint validation, password policy, duplicate emails
- `tests/api/auth/login.test.ts` – Login endpoint, auth validation, cookie handling

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- auth.spec

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run in debug mode
npm run test:e2e -- --debug
```

Test files:
- `tests/e2e/auth.spec.ts` – Full registration, login, password validation, error handling
- `tests/e2e/dashboard.spec.ts` – Dashboard access, components, logout
- `tests/e2e/responsive.spec.ts` – Mobile (375px) and desktop (1920px) layouts

## Component Architecture

### UI Components (`src/components/ui/`)
- `floating-label-input.tsx` – Form input with floating label animation
- `password-strength-meter.tsx` – Visual password strength feedback
- `success-modal.tsx` – Success notification with auto-redirect
- `loading-spinner.tsx` – Loading state indicator
- `toast-provider.tsx` – Sonner toast wrapper
- `skeleton.tsx` – Skeleton loaders

### Dashboard Components (`src/components/dashboard/`)
- `header.tsx` – Sticky top navigation with user menu
- `sidebar.tsx` – Collapsible left menu (desktop only)
- `bottom-nav.tsx` – Mobile bottom tab navigation
- `hero-account-card.tsx` – Gradient card with account/balance display
- `quick-actions.tsx` – 4-button action grid
- `summary-cards.tsx` – 3-column metric cards with trends
- `recent-transactions.tsx` – Transaction history table

### Forms
- `src/app/register/page.tsx` – Registration page with validation
- `src/app/login/page.tsx` – Login page with password toggle
- `src/lib/validation.ts` – Zod schemas for register/login validation

## Design System

### Color Palette
- **Primary**: `#1D9E7F` (Teal)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)
- **Dark 900**: `#0F172A` (Almost black)
- **Dark 800**: `#1E293B` (Dark slate)
- **Dark 700**: `#334155` (Slate)

### CSS Utilities
- `.card` – Dark card with border and shadow
- `.card-hover` – Interactive card with hover effects
- `.btn-primary` / `.btn-secondary` / `.btn-danger` – Button variants
- `.input` – Form input with focus states
- `.label` – Form labels
- `.error-text` / `.success-text` – Validation feedback

## Security Notes

- Passwords are hashed with bcryptjs using salt rounds 10
- Tokens are cryptographically random 48-byte hex strings
- All tokens include expiry (24 hours) + revocation support
- Cookies are httpOnly (no JavaScript access) and Secure (HTTPS only)
- No password is ever logged or exposed in responses
- Password validation enforced server-side, not just frontend

## Deployment

### Vercel (Recommended)

1. Push repo to GitHub
2. Connect to Vercel and set `DATABASE_URL` environment variable
3. Deploy with: `npm run build`
4. Run migrations post-deploy: `npx prisma migrate deploy`

### Docker

```bash
docker build -t kodbank .
docker run -e DATABASE_URL="..." -p 3000:3000 kodbank
```

### Self-hosted

1. Build: `npm run build`
2. Start: `npm start`
3. Ensure MySQL is accessible at `DATABASE_URL`

## Project Structure

```
src/
├── app/
│   ├── api/auth/           # Auth endpoints
│   ├── dashboard/          # Protected dashboard
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── globals.css         # Design system & utilities
│   └── layout.tsx          # Root layout
├── lib/
│   ├── auth.ts             # Auth utilities
│   ├── db.ts               # Database client
│   └── validation.ts       # Zod schemas
└── components/
    ├── ui/                 # Reusable UI primitives
    └── dashboard/          # Dashboard-specific components

tests/
├── api/auth/               # API unit tests
├── e2e/                    # Playwright E2E tests
└── helpers/                # Test utilities
```

## Future Enhancements

- Transaction history with real data
- Settings page (account, security, notifications)
- Analytics dashboard with Recharts
- Forgot password flow
- Two-factor authentication
- Admin panel
- API rate limiting
- Email verification

---

**Last Updated**: February 2026  
**Status**: Production Ready v1.0
