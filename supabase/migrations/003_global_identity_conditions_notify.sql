-- Add conditions to global_identities and notify all linked users when a condition is added.

-- 1. Conditions on global identities
alter table public.global_identities
  add column if not exists conditions jsonb default '[]'::jsonb;

-- 2. Allow authenticated users to update global_identities (e.g. add conditions)
create policy "global_identities_update_authenticated"
  on public.global_identities for update
  to authenticated
  using (true)
  with check (true);

-- 3. Optional: link notification to global identity for navigation
alter table public.notifications
  add column if not exists profile_global_id uuid references public.global_identities(id) on delete set null;

create index if not exists notifications_profile_global_id_idx on public.notifications(profile_global_id);

-- 4. Trigger: when global_identities.conditions is updated, notify every user who has this identity saved
create or replace function public.notify_global_identity_condition()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  prev_conds jsonb;
  new_conds jsonb;
  c text;
  rec record;
  added text[];
begin
  prev_conds := coalesce(OLD.conditions, '[]'::jsonb);
  new_conds := coalesce(NEW.conditions, '[]'::jsonb);
  added := array[]::text[];

  -- Collect newly added condition labels
  for c in select jsonb_array_elements_text(new_conds)
  loop
    if c is not null and c <> '' and not (prev_conds @> jsonb_build_array(c)) then
      added := array_append(added, c);
    end if;
  end loop;

  if added is null or array_length(added, 1) is null then
    return NEW;
  end if;

  -- For each user who has this global identity saved, insert a notification per added condition
  for rec in
    select user_id from user_saved_profiles where global_id = NEW.id
  loop
    for i in 1 .. array_length(added, 1) loop
      insert into public.notifications (user_id, profile_id, profile_global_id, profile_name, message, read)
      values (rec.user_id, null, NEW.id, NEW.name, 'New condition reported: ' || added[i], false);
    end loop;
  end loop;

  return NEW;
end;
$$;

drop trigger if exists trigger_notify_global_identity_condition on public.global_identities;
create trigger trigger_notify_global_identity_condition
  after update of conditions on public.global_identities
  for each row
  when (old.conditions is distinct from new.conditions)
  execute function public.notify_global_identity_condition();
