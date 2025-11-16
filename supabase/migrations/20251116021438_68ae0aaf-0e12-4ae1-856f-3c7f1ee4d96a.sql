-- Clean up invalid URLs before adding constraints
UPDATE public.nonprofits
SET website = NULL
WHERE website IS NOT NULL 
  AND website != '' 
  AND NOT (website ~* '^https?://[^\s/$.?#].[^\s]*$');

UPDATE public.nonprofits
SET social_media = NULL
WHERE social_media IS NOT NULL 
  AND social_media != '' 
  AND NOT (social_media ~* '^https?://[^\s/$.?#].[^\s]*$');

-- Fix 1: Update is_admin function with proper security settings to prevent recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = $1
  );
$$;

-- Fix 2: Update can_manage_event function with proper security settings
CREATE OR REPLACE FUNCTION public.can_manage_event(user_id uuid, event_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  is_admin BOOLEAN;
  event_nonprofit_id UUID;
BEGIN
  -- Check if user is admin using the secure function
  is_admin := public.is_admin(user_id);
  
  IF is_admin THEN
    RETURN TRUE;
  END IF;
  
  -- Get the nonprofit_id (creator) of the event
  SELECT nonprofit_id INTO event_nonprofit_id
  FROM public.events
  WHERE id = event_id;
  
  -- Check if user is the creator
  RETURN (user_id = event_nonprofit_id);
END;
$$;

-- Fix 3: Replace recursive admin_users policies with secure versions
DROP POLICY IF EXISTS "Only admins can view admin list" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can insert admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can delete admin users" ON public.admin_users;

CREATE POLICY "Only admins can view admin list"
ON public.admin_users FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert admin users"
ON public.admin_users FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update admin users"
ON public.admin_users FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete admin users"
ON public.admin_users FOR DELETE
USING (public.is_admin(auth.uid()));

-- Fix 4: Add database constraints for input validation
-- Events table constraints
ALTER TABLE public.events 
  ADD CONSTRAINT title_length_min CHECK (length(title) >= 5),
  ADD CONSTRAINT title_length_max CHECK (length(title) <= 200),
  ADD CONSTRAINT description_length_min CHECK (length(description) >= 50),
  ADD CONSTRAINT description_length_max CHECK (length(description) <= 5000);

-- Nonprofits table constraints
ALTER TABLE public.nonprofits
  ADD CONSTRAINT organization_name_length CHECK (length(organization_name) >= 2 AND length(organization_name) <= 200),
  ADD CONSTRAINT description_length CHECK (length(description) >= 20 AND length(description) <= 5000),
  ADD CONSTRAINT mission_length CHECK (length(mission) >= 20 AND length(mission) <= 5000),
  ADD CONSTRAINT location_length CHECK (length(location) >= 2 AND length(location) <= 200),
  ADD CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add URL validation constraints (after cleaning data)
ALTER TABLE public.events
  ADD CONSTRAINT signup_url_format CHECK (
    signup_form_url IS NULL OR 
    signup_form_url = '' OR
    signup_form_url ~* '^https?://[^\s/$.?#].[^\s]*$'
  );

ALTER TABLE public.nonprofits
  ADD CONSTRAINT website_url_format CHECK (
    website IS NULL OR 
    website = '' OR
    website ~* '^https?://[^\s/$.?#].[^\s]*$'
  ),
  ADD CONSTRAINT social_media_url_format CHECK (
    social_media IS NULL OR 
    social_media = '' OR
    social_media ~* '^https?://[^\s/$.?#].[^\s]*$'
  );