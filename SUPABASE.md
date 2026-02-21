# Supabase setup

InfeX uses Supabase for auth and data (profiles, notifications).

## 1. Create a project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In the dashboard: **Settings → API** copy the **Project URL** and **anon public** key.

## 2. Environment variables

Copy the example env and set your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Database schema (migrations)

Tables use **snake_case**, an **id bigint generated always as identity** primary key on each table, and **Row Level Security (RLS)** so each user only sees their own data.

### Option A: Supabase CLI (recommended)

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed:

```bash
cd /path/to/infex
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

`supabase db push` applies all files in `supabase/migrations/` to your linked project.

### Option B: SQL Editor in dashboard

1. In the Supabase dashboard open **SQL Editor**.
2. Copy the contents of `supabase/migrations/001_initial.sql`.
3. Paste and run it.

**If you already had the old schema (uuid ids):** drop the tables first, then run the migration:

```sql
drop table if exists public.notifications;
drop table if exists public.profiles;
```

Then run the full contents of `001_initial.sql`.

### Option C: Supabase MCP (apply_migration)

If you use a Supabase MCP server with an `apply_migration` tool, use:

- **version**: `001` (or e.g. `20240101120000`)
- **name**: `initial_infex_schema`
- **sql**: contents of `supabase/migrations/001_initial.sql`

## 4. Auth (optional)

- **Email confirmation**: In **Authentication → Providers → Email** you can disable “Confirm email” so users can sign in right after sign-up.
- **Password**: No extra config; sign-up and sign-in work with email + password.
