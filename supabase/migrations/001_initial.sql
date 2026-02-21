-- InfeX schema: profiles and notifications (snake_case, identity id, RLS)
-- Requires auth.users (Supabase Auth). Apply after project is created.

-- Profiles: contact/partner records, one per user
create table if not exists public.profiles (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  city text default '',
  photo text default '',
  conditions jsonb default '[]'::jsonb,
  notes text default '',
  created_at timestamptz default now()
);

-- Notifications: alerts when conditions are reported
create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id bigint references public.profiles(id) on delete set null,
  profile_name text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS: data protected by default; users only access their own rows
alter table public.profiles enable row level security;
alter table public.notifications enable row level security;

-- Policies: SELECT/INSERT/UPDATE/DELETE only where user_id = auth.uid()
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = user_id);

create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications_insert_own"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications_delete_own"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- Indexes for common queries
create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);
create index if not exists notifications_profile_id_idx on public.notifications(profile_id);
