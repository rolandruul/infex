-- Notifications for global identity conditions are now sent by the Edge Function
-- add-global-identity-condition (service role), so drop the trigger to avoid duplicate notifications.
drop trigger if exists trigger_notify_global_identity_condition on public.global_identities;
drop function if exists public.notify_global_identity_condition();
