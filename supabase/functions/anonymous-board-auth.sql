-- Create secure password functions for anonymous posts
CREATE OR REPLACE FUNCTION public.create_anonymous_post(
  post_title TEXT,
  post_content TEXT,
  author_nickname TEXT DEFAULT '익명',
  password_plain TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_id UUID;
  password_hash TEXT;
BEGIN
  -- Hash password using pgcrypto
  password_hash := crypt(password_plain, gen_salt('bf', 10));
  
  -- Insert post
  INSERT INTO public.anonymous_posts (title, content, author_nickname, password_hash)
  VALUES (post_title, post_content, author_nickname, password_hash)
  RETURNING id INTO post_id;
  
  RETURN post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_anonymous_comment(
  post_id_param UUID,
  comment_content TEXT,
  author_nickname TEXT DEFAULT '익명',
  password_plain TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  comment_id UUID;
  password_hash TEXT;
BEGIN
  -- Hash password using pgcrypto
  password_hash := crypt(password_plain, gen_salt('bf', 10));
  
  -- Insert comment
  INSERT INTO public.anonymous_comments (post_id, content, author_nickname, password_hash)
  VALUES (post_id_param, comment_content, author_nickname, password_hash)
  RETURNING id INTO comment_id;
  
  RETURN comment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_post_password(
  post_id_param UUID,
  password_plain TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM public.anonymous_posts
  WHERE id = post_id_param;
  
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN (stored_hash = crypt(password_plain, stored_hash));
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_comment_password(
  comment_id_param UUID,
  password_plain TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM public.anonymous_comments
  WHERE id = comment_id_param;
  
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN (stored_hash = crypt(password_plain, stored_hash));
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_anonymous_post(
  post_id_param UUID,
  password_plain TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify password first
  IF NOT public.verify_post_password(post_id_param, password_plain) THEN
    RETURN FALSE;
  END IF;
  
  -- Mark as deleted
  UPDATE public.anonymous_posts
  SET is_deleted = TRUE
  WHERE id = post_id_param;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_anonymous_comment(
  comment_id_param UUID,
  password_plain TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify password first
  IF NOT public.verify_comment_password(comment_id_param, password_plain) THEN
    RETURN FALSE;
  END IF;
  
  -- Mark as deleted
  UPDATE public.anonymous_comments
  SET is_deleted = TRUE
  WHERE id = comment_id_param;
  
  RETURN TRUE;
END;
$$;