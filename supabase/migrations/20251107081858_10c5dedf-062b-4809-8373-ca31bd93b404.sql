-- Fix 1: Add RLS policy to admin_users table
-- Only admins can view the admin list
CREATE POLICY "Only admins can view admin list"
ON admin_users FOR SELECT
USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- Ensure only admins can manage admin_users table
CREATE POLICY "Only admins can insert admin users"
ON admin_users FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Only admins can update admin users"
ON admin_users FOR UPDATE
USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Only admins can delete admin users"
ON admin_users FOR DELETE
USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- Fix 2: Add RLS policies to causes table
-- Allow anyone to read cause categories
CREATE POLICY "Anyone can view causes"
ON causes FOR SELECT
USING (true);

-- Restrict modifications to admins only
CREATE POLICY "Only admins can insert causes"
ON causes FOR INSERT
WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Only admins can update causes"
ON causes FOR UPDATE
USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Only admins can delete causes"
ON causes FOR DELETE
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Fix 3: Add RLS policies to nonprofit_causes table
-- Allow public to see nonprofit-cause relationships
CREATE POLICY "Anyone can view nonprofit causes"
ON nonprofit_causes FOR SELECT
USING (true);

-- Only allow nonprofits to manage their own cause associations
CREATE POLICY "Nonprofits can insert own causes"
ON nonprofit_causes FOR INSERT
WITH CHECK (auth.uid() = nonprofit_id);

CREATE POLICY "Nonprofits can delete own causes"
ON nonprofit_causes FOR DELETE
USING (auth.uid() = nonprofit_id);

-- Fix 4: Secure the reviews table by requiring authentication
-- Drop the insecure anonymous_id based policy
DROP POLICY IF EXISTS "Allow users to update their own reviews" ON reviews;

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "Allow anyone to insert reviews" ON reviews;

-- Add secure policies that require authentication
CREATE POLICY "Authenticated users can insert their own reviews"
ON reviews FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  auth.uid() = user_id
);

CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  auth.uid() = user_id
);

CREATE POLICY "Users can delete their own reviews"
ON reviews FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  auth.uid() = user_id
);