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
    console.log('Request data:', { action, hasCode: !!code, hasTokens: !!tokens });
    
    // Get credentials from environment secrets
    const clientId = '759409896984-a43f1m1d98aht31rmcmogud1ev7lvk6l.apps.googleusercontent.com';
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    console.log('Credentials check:', {
      clientId: clientId.substring(0, 10) + '...',
      clientSecretExists: !!clientSecret,
      clientSecretLength: clientSecret?.length || 0
    });
    
    if (!clientId || !clientSecret) {
      console.error('Google credentials missing - clientId:', !!clientId, 'clientSecret:', !!clientSecret);
      throw new Error('Google credentials not configured');
    }

    if (action === 'exchange') {
      console.log('Exchanging authorization code for tokens');
      
      const redirectUri = `${req.headers.get('referer')?.split('?')[0] || req.headers.get('origin')}/auth/google/callback`;
      console.log('OAuth exchange details:', {
        code: code?.substring(0, 10) + '...',
        redirectUri,
        referer: req.headers.get('referer'),
        origin: req.headers.get('origin')
      });
      
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
          redirect_uri: redirectUri,
        }),
      });

      console.log('Token response status:', tokenResponse.status);
      const tokenData = await tokenResponse.json();
      console.log('Token data received:', {
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token,
        error: tokenData.error,
        errorDescription: tokenData.error_description
      });
      
      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', tokenData);
        const errorMsg = tokenData.error_description || tokenData.error || 'Unknown token exchange error';
        throw new Error(`Token exchange failed (${tokenResponse.status}): ${errorMsg}`);
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
    
    // 에러 타입별 상세 로깅
    if (error.message?.includes('403')) {
      console.error('403 에러 - OAuth 설정 문제 또는 권한 부족');
    } else if (error.message?.includes('400')) {
      console.error('400 에러 - 잘못된 요청 파라미터');
    } else if (error.message?.includes('Token exchange failed')) {
      console.error('토큰 교환 실패 - OAuth 설정 확인 필요');
    }
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error',
      details: error.toString(),
      timestamp: new Date().toISOString()
    }), {
      status: error.message?.includes('403') ? 403 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});