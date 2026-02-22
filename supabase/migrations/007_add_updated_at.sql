-- Add updated_at to global_identities and profiles for "last condition added" display.
alter table public.global_identities
  add column if not exists updated_at timestamptz default now();

alter table public.profiles
  add column if not exists updated_at timestamptz default now();

-- Set updated_at = now() on every update (so conditions change is reflected).
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_global_identities_updated_at on public.global_identities;
create trigger set_global_identities_updated_at
  before update on public.global_identities
  for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
