-- Create anonymous posts table
CREATE TABLE public.anonymous_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_nickname TEXT DEFAULT '익명',
  password_hash TEXT NOT NULL, -- For post management
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

-- Create anonymous comments table  
CREATE TABLE public.anonymous_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.anonymous_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_nickname TEXT DEFAULT '익명',
  password_hash TEXT NOT NULL, -- For comment management
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.anonymous_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous posts (public access for reading)
CREATE POLICY "Anyone can view posts"
ON public.anonymous_posts
FOR SELECT
USING (NOT is_deleted);

CREATE POLICY "Anyone can create posts"
ON public.anonymous_posts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update view count"
ON public.anonymous_posts
FOR UPDATE
USING (true);

-- Create policies for anonymous comments (public access for reading)
CREATE POLICY "Anyone can view comments"
ON public.anonymous_comments
FOR SELECT
USING (NOT is_deleted);

CREATE POLICY "Anyone can create comments"
ON public.anonymous_comments
FOR INSERT
WITH CHECK (true);

-- Create function to update comment count
CREATE OR REPLACE FUNCTION public.update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.anonymous_posts 
    SET comment_count = comment_count + 1,
        updated_at = now()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.anonymous_posts 
    SET comment_count = comment_count - 1,
        updated_at = now()
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for comment count
CREATE TRIGGER update_anonymous_posts_comment_count
  AFTER INSERT OR DELETE ON public.anonymous_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_count();

-- Create trigger for updated_at
CREATE TRIGGER update_anonymous_posts_updated_at
  BEFORE UPDATE ON public.anonymous_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_anonymous_posts_created_at ON public.anonymous_posts(created_at DESC);
CREATE INDEX idx_anonymous_posts_view_count ON public.anonymous_posts(view_count DESC);
CREATE INDEX idx_anonymous_posts_like_count ON public.anonymous_posts(like_count DESC);
CREATE INDEX idx_anonymous_comments_post_id ON public.anonymous_comments(post_id);
CREATE INDEX idx_anonymous_comments_created_at ON public.anonymous_comments(created_at ASC);