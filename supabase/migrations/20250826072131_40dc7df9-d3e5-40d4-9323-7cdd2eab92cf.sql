-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email text NOT NULL,
  name text NOT NULL,
  dept text NOT NULL,
  building text NOT NULL CHECK (building IN ('판교오피스', '여의도오피스')),
  work_area text,
  phone text,
  car_number text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create work areas table
CREATE TABLE public.work_areas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  building text NOT NULL CHECK (building IN ('판교오피스', '여의도오피스')),
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert initial work areas
INSERT INTO public.work_areas (name, building, description) VALUES
('1층 개발팀', '판교오피스', '1층 개발팀 구역'),
('2층 기획팀', '판교오피스', '2층 기획팀 구역'),
('3층 임원진', '판교오피스', '3층 임원진 구역'),
('4층 회의실', '판교오피스', '4층 회의실 구역'),
('B1 카페테리아', '판교오피스', '지하1층 카페테리아'),
('1층 로비', '여의도오피스', '1층 로비 구역'),
('2층 영업팀', '여의도오피스', '2층 영업팀 구역'),
('3층 마케팅팀', '여의도오피스', '3층 마케팅팀 구역'),
('4층 총무팀', '여의도오피스', '4층 총무팀 구역'),
('5층 임원진', '여의도오피스', '5층 임원진 구역');

-- Enable RLS for work_areas (read-only for all authenticated users)
ALTER TABLE public.work_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view work areas"
ON public.work_areas
FOR SELECT
TO authenticated
USING (true);