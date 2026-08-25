-- PREPARED ONLY. Do not apply without Founder approval.
-- Expands private attachment bucket MIME allowlists and size ceilings to match
-- the application allowlist. Bucket visibility and storage RLS are unchanged.

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'
]::text[],
file_size_limit = 10485760
where id = 'vehicle-photos';

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
  'video/mp4', 'video/quicktime', 'video/x-m4v',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'application/rtf', 'text/rtf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv'
]::text[],
file_size_limit = 52428800
where id = 'vehicle-documents';
