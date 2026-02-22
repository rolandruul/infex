-- Add optional Instagram handle to global_identities (for ProfileGlobal socials)
alter table public.global_identities
  add column if not exists instagram text default '';
