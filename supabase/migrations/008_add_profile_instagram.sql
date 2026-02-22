-- Add optional Instagram handle to profiles (legacy profiles table)
alter table public.profiles
  add column if not exists instagram text default '';
