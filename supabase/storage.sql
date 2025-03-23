
-- Create a bucket for profile images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a bucket for event images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a bucket for banner images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('banner-images', 'banner-images', true)
ON CONFLICT (id) DO NOTHING;

-- Make sure the buckets are public
UPDATE storage.buckets
SET public = true
WHERE id IN ('profile-images', 'event-images', 'banner-images');

-- Allow public read access to all objects in the profile-images bucket
CREATE POLICY "Public Read Access for profile-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images')
ON CONFLICT DO NOTHING;

-- Allow public read access to all objects in the event-images bucket
CREATE POLICY "Public Read Access for event-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event-images')
ON CONFLICT DO NOTHING;

-- Allow public read access to all objects in the banner-images bucket
CREATE POLICY "Public Read Access for banner-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'banner-images')
ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload to profile-images bucket
CREATE POLICY "Authenticated Users Can Upload to profile-images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload to event-images bucket
CREATE POLICY "Authenticated Users Can Upload to event-images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'event-images' AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload to banner-images bucket
CREATE POLICY "Authenticated Users Can Upload to banner-images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'banner-images' AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;

-- Allow users to update their own objects
CREATE POLICY "Users Can Update Their Own Objects in profile-images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images' AND
  auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid() = owner
)
ON CONFLICT DO NOTHING;

-- Allow users to update their own objects in event-images bucket
CREATE POLICY "Users Can Update Their Own Objects in event-images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'event-images' AND
  auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'event-images' AND
  auth.uid() = owner
)
ON CONFLICT DO NOTHING;

-- Allow users to update their own objects in banner-images bucket
CREATE POLICY "Users Can Update Their Own Objects in banner-images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'banner-images' AND
  auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'banner-images' AND
  auth.uid() = owner
)
ON CONFLICT DO NOTHING;
