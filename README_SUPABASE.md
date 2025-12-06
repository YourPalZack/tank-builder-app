# Supabase Setup Instructions

## 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Note your `Project URL` and `anon public key`.

## 2. Environment Variables
Create a `.env.local` file in the root of your project and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
*Note: `SUPABASE_SERVICE_ROLE_KEY` is only needed for the seeding script. Do not expose it in client-side code.*

## 3. Database Schema
Run the SQL commands in `supabase/schema.sql` in the Supabase SQL Editor to create the tables and policies.

## 4. Seed Data
To populate the database with the initial common parts (Tanks, Fish, Plants, etc.), run the seeding script:

```bash
npx tsx scripts/seed-data.ts
```

## 5. Authentication
- Go to Authentication > Providers in Supabase dashboard.
- Enable Email/Password provider.
- (Optional) Disable "Confirm email" if you want to test without email verification.

## Features Implemented
- **User Accounts**: Sign up and Sign in via the Header.
- **Saved Builds**: Builds are saved to the `builds` table for logged-in users. Guest users use Local Storage.
- **Part Catalog**: Parts are fetched from Supabase tables (`tanks`, `species`, etc.).
- **Amazon Integration**: Adding a custom Amazon item saves it to your private collection in Supabase.
