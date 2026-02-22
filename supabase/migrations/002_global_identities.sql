-- Global Registry (people from Tinder / shared identities)
create table if not exists public.global_identities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  city text not null,
  photo_hash text unique,
  original_photo_url text,
  extracted_notes text,
  created_at timestamptz default now()
);

-- User's saved links to global identities
create table if not exists public.user_saved_profiles (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  global_id uuid not null references public.global_identities(id) on delete cascade,
  added_at timestamptz default now(),
  unique(user_id, global_id)
);

-- RLS
alter table public.global_identities enable row level security;
alter table public.user_saved_profiles enable row level security;

-- Global identities: authenticated users can read (for dedupe) and insert (when creating new)
create policy "global_identities_select_authenticated"
  on public.global_identities for select
  to authenticated
  using (true);

create policy "global_identities_insert_authenticated"
  on public.global_identities for insert
  to authenticated
  with check (true);

-- User saved profiles: own rows only
create policy "user_saved_profiles_select_own"
  on public.user_saved_profiles for select
  using (auth.uid() = user_id);

create policy "user_saved_profiles_insert_own"
  on public.user_saved_profiles for insert
  with check (auth.uid() = user_id);

create policy "user_saved_profiles_delete_own"
  on public.user_saved_profiles for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists global_identities_photo_hash_idx on public.global_identities(photo_hash);
create index if not exists global_identities_name_city_idx on public.global_identities(name, city);
create index if not exists user_saved_profiles_user_id_idx on public.user_saved_profiles(user_id);
create index if not exists user_saved_profiles_global_id_idx on public.user_saved_profiles(global_id);
