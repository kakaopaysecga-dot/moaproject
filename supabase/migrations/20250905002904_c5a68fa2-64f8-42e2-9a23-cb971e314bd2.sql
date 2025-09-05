-- Enable realtime for requests table
ALTER TABLE public.requests REPLICA IDENTITY FULL;

-- Add requests table to realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.requests;