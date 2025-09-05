-- Create RPC functions for incrementing counts
CREATE OR REPLACE FUNCTION public.increment_view_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.anonymous_posts 
  SET view_count = view_count + 1,
      updated_at = now()
  WHERE id = post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_like_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.anonymous_posts 
  SET like_count = like_count + 1,
      updated_at = now()
  WHERE id = post_id;
END;
$$;