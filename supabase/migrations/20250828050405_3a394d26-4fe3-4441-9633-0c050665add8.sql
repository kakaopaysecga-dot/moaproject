-- Create a basic requests table to generate Supabase types
CREATE TABLE public.requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('environment', 'temperature', 'business_card', 'parking', 'events')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to manage their own requests
CREATE POLICY "Users can view their own requests" 
ON public.requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" 
ON public.requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" 
ON public.requests 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_requests_user_id ON public.requests(user_id);
CREATE INDEX idx_requests_type ON public.requests(type);
CREATE INDEX idx_requests_status ON public.requests(status);
CREATE INDEX idx_requests_created_at ON public.requests(created_at DESC);