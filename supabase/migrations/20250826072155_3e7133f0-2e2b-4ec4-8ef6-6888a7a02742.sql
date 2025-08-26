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