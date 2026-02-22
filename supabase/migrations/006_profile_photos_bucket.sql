-- Profile photos storage bucket (public read, authenticated upload).
-- Run this migration or create the bucket in Dashboard: Storage → New bucket → id: profile-photos, Public: on.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "profile_photos_authenticated_upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'profile-photos');

create policy "profile_photos_public_read"
on storage.objects for select
to public
using (bucket_id = 'profile-photos');
