import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Google Calendar function called with method:', req.method);

  try {
    const { action, code, tokens, event, timeMin, timeMax } = await req.json();
    console.log('Action requested:', action);
    
    // Use hardcoded values for demo - in production these would come from secrets
    const clientId = '1051442977730-v89g77dk2fh98t9t41rnj8b9q2u8emep.apps.googleusercontent.com';
    const clientSecret = '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';
    
    if (!clientId || !clientSecret) {
      console.error('Google credentials missing');
      throw new Error('Google credentials not configured');
    }

    if (action === 'exchange') {
      console.log('Exchanging authorization code for tokens');
      // Exchange authorization code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: `${req.headers.get('origin')}/auth/google/callback`,
        }),
      });

      console.log('Token response status:', tokenResponse.status);
      const tokenData = await tokenResponse.json();
      console.log('Token data received:', tokenData);
      
      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', tokenData);
        throw new Error(`Token exchange failed: ${tokenData.error_description}`);
      }

      console.log('Token exchange successful');
      return new Response(JSON.stringify({ tokens: tokenData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create') {
      // Create calendar event
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const eventData = await response.json();
      
      if (!response.ok) {
        throw new Error(`Event creation failed: ${eventData.error?.message}`);
      }

      return new Response(JSON.stringify({ 
        eventId: eventData.id,
        htmlLink: eventData.htmlLink 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'list') {
      // List calendar events
      const params = new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${data.error?.message}`);
      }

      return new Response(JSON.stringify({ events: data.items || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
    
  } catch (error) {
    console.error('Google Calendar API error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});