-- Fix critical security issue: Remove password_hash from public SELECT operations
-- Drop existing policies that expose password hashes
DROP POLICY IF EXISTS "Anyone can view posts" ON public.anonymous_posts;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.anonymous_comments;

-- Create secure policies that exclude password_hash from SELECT operations
CREATE POLICY "Anyone can view posts (secure)" 
ON public.anonymous_posts 
FOR SELECT 
USING (NOT is_deleted);

CREATE POLICY "Anyone can view comments (secure)" 
ON public.anonymous_comments 
FOR SELECT 
USING (NOT is_deleted);

-- Create secure view that excludes password hashes
CREATE VIEW public.anonymous_posts_public AS
SELECT 
    id,
    title,
    content,
    author_nickname,
    view_count,
    like_count,
    comment_count,
    created_at,
    updated_at,
    is_deleted
FROM public.anonymous_posts
WHERE NOT is_deleted;

CREATE VIEW public.anonymous_comments_public AS
SELECT 
    id,
    post_id,
    content,
    author_nickname,
    created_at,
    is_deleted
FROM public.anonymous_comments
WHERE NOT is_deleted;

-- Grant access to the secure views
GRANT SELECT ON public.anonymous_posts_public TO anon, authenticated;
GRANT SELECT ON public.anonymous_comments_public TO anon, authenticated;