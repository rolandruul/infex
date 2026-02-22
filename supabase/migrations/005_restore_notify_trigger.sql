-- Re-create trigger so when global_identities.conditions is updated (by client or Edge Function),
-- all users linked to that profile get a notification. The function runs as SECURITY DEFINER;
-- ensure the function owner (postgres) has BYPASSRLS so it can insert notifications for any user.

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

  for c in select jsonb_array_elements_text(new_conds)
  loop
    if c is not null and c <> '' and not (prev_conds @> jsonb_build_array(c)) then
      added := array_append(added, c);
    end if;
  end loop;

  if added is null or array_length(added, 1) is null then
    return NEW;
  end if;

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
