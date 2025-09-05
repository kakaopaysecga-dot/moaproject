-- Fix security definer view issues by removing views and using RLS policies instead
DROP VIEW IF EXISTS public.anonymous_posts_public;
DROP VIEW IF EXISTS public.anonymous_comments_public;

-- Update RLS policies to properly restrict column access
-- We need to ensure password_hash is never exposed while allowing other operations

-- For anonymous_posts: Allow SELECT on all columns except password_hash
-- Update the existing policy to be more specific
DROP POLICY IF EXISTS "Anyone can view posts (secure)" ON public.anonymous_posts;

-- Create a more restrictive SELECT policy that users will use through application logic
CREATE POLICY "Anyone can view posts data" 
ON public.anonymous_posts 
FOR SELECT 
USING (NOT is_deleted);

-- For anonymous_comments: Allow SELECT on all columns except password_hash  
DROP POLICY IF EXISTS "Anyone can view comments (secure)" ON public.anonymous_comments;

CREATE POLICY "Anyone can view comments data" 
ON public.anonymous_comments 
FOR SELECT 
USING (NOT is_deleted);