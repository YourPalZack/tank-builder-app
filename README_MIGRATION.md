# Migration to Neon + Drizzle + Clerk

This project has been migrated from Supabase to a stack using Neon (Postgres), Drizzle ORM, and Clerk (Authentication).

## Prerequisites

You need to set up the following environment variables in your `.env.local` file:

```dotenv
# Neon Database URL
DATABASE_URL="postgresql://neondb_owner:password@ep-cool-project-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Database Management

We use Drizzle ORM for database management.

- **Schema**: Defined in `lib/db/schema.ts`.
- **Push Schema**: Run `npx drizzle-kit push` to update the database schema.
- **Studio**: Run `npx drizzle-kit studio` to view and edit your data in a web interface.

## Authentication

Authentication is handled by Clerk.

- **Middleware**: `middleware.ts` protects routes.
- **Components**: `<SignInButton />`, `<UserButton />`, etc. are used in the UI.
- **Hooks**: `useUser()` and `useAuth()` are used in client components.
- **Server**: `auth()` helper is used in Server Actions.

## Data Fetching & Mutation

- **Reads**: We use `SWR` hooks in `hooks/` which call Server Actions in `lib/actions/`.
- **Writes**: We use Server Actions directly from UI components.

## Running the App

```bash
npm run dev
```
