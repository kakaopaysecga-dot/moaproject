-- Fix search_path for handle_google_calendar_auth function
CREATE OR REPLACE FUNCTION public.handle_google_calendar_auth(request_body json)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    action text;
    code text;
    client_id text;
    client_secret text;
    redirect_uri text;
    result json;
BEGIN
    -- Get action from request body
    action := request_body->>'action';
    
    -- Get secrets from vault
    client_id := vault.get_secret('GOOGLE_CLIENT_ID');
    client_secret := vault.get_secret('GOOGLE_CLIENT_SECRET');
    
    IF action = 'exchange' THEN
        code := request_body->>'code';
        redirect_uri := 'http://localhost:5173/auth/google/callback';
        
        result := json_build_object(
            'success', true,
            'message', 'Token exchange placeholder - implement with HTTP extension'
        );
    END IF;
    
    RETURN result;
END;
$function$;

-- Fix search_path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, dept, building)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'dept', '개발팀'),
    COALESCE(NEW.raw_user_meta_data->>'building', '판교오피스')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;

-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;