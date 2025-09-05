-- Create smart office bookings table
CREATE TABLE public.smart_office_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  seat_number INTEGER NOT NULL,
  building TEXT NOT NULL CHECK (building IN ('판교오피스', '여의도오피스')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '8 hours'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.smart_office_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for smart office bookings
CREATE POLICY "Users can view all active bookings" 
ON public.smart_office_bookings 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create their own bookings" 
ON public.smart_office_bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.smart_office_bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to automatically end bookings at 6 PM
CREATE OR REPLACE FUNCTION public.auto_end_bookings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.smart_office_bookings 
  SET status = 'completed', 
      updated_at = now()
  WHERE status = 'active' 
    AND end_time <= now();
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_smart_office_bookings_updated_at
BEFORE UPDATE ON public.smart_office_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_smart_office_bookings_active ON public.smart_office_bookings (building, seat_number, status) WHERE status = 'active';
CREATE INDEX idx_smart_office_bookings_user ON public.smart_office_bookings (user_id, status);

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE smart_office_bookings;