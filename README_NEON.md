# Neon + Drizzle + Clerk Migration

## 1. Database (Neon)
The database is hosted on Neon (Serverless Postgres).
- **Project ID**: `round-wind-73565700`
- **Connection String**: In `.env.local` as `DATABASE_URL`.

## 2. Authentication (Clerk)
Authentication is handled by Clerk.
- **Publishable Key**: In `.env.local` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- **Secret Key**: In `.env.local` as `CLERK_SECRET_KEY`.

## 3. ORM (Drizzle)
We use Drizzle ORM to interact with the database.
- **Schema**: `lib/db/schema.ts`
- **Client**: `lib/db/index.ts`
- **Config**: `drizzle.config.ts`
- **Migrations**: Run `npx drizzle-kit push` to update the DB schema.

## 4. Data Fetching
We use **Server Actions** (`lib/actions/`) to fetch data securely on the server.
- `useCatalog` hook uses `lib/actions/catalog.ts`.
- `useSavedBuilds` hook uses `lib/actions/builds.ts`.

## 5. Seeding
To reset/seed the database:
```bash
npx tsx scripts/seed-neon.ts
```

## Setup Steps
1. Ensure `.env.local` has the correct keys.
2. Run `npm install`.
3. Run `npx drizzle-kit push` to sync schema.
4. Run `npx tsx scripts/seed-neon.ts` to seed data.
5. Run `npm run dev` to start the app.
