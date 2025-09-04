import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, emotion } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get the user from the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    console.log('Processing emotional care request for user:', user.id);

    // Get conversation history for context
    let conversationHistory = [];
    if (conversationId) {
      const { data: messages } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10);
      
      conversationHistory = messages || [];
    }

    // Create emotional care AI system prompt
    const systemPrompt = `당신은 따뜻하고 공감적인 감정케어 AI 상담사입니다. 
    
역할:
- 사용자의 감정을 이해하고 공감하며 지지적인 대화를 제공합니다
- 스트레스, 우울, 불안 등의 감정을 다루는 실용적인 조언을 제공합니다
- 긍정적이고 희망적인 메시지를 전달합니다
- 간단한 명상, 호흡법, 스트레스 해소 방법을 제안할 수 있습니다

대화 스타일:
- 한국어로 자연스럽고 친근하게 대화합니다
- 짧고 이해하기 쉬운 문장을 사용합니다
- 공감과 이해를 표현하는 따뜻한 톤을 유지합니다
- 필요시 구체적이고 실행 가능한 조언을 제공합니다

제한사항:
- 전문적인 의료 진단이나 치료를 제공하지 않습니다
- 심각한 정신건강 문제가 의심되면 전문가 상담을 권합니다
- 항상 긍정적이고 지지적인 방향으로 대화를 이끕니다

${emotion ? `현재 사용자의 감정 상태: ${emotion}` : ''}`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Received response from OpenAI');

    // Create or get conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        })
        .select('id')
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        throw new Error('Failed to create conversation');
      }

      currentConversationId = newConversation.id;
    }

    // Save user message
    const { error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: message,
        emotion_detected: emotion
      });

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
    }

    // Save AI response
    const { error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: aiResponse
      });

    if (aiMsgError) {
      console.error('Error saving AI message:', aiMsgError);
    }

    // Log emotion if provided
    if (emotion) {
      const { error: emotionError } = await supabase
        .from('emotion_logs')
        .insert({
          user_id: user.id,
          emotion: emotion,
          notes: message.substring(0, 100)
        });

      if (emotionError) {
        console.error('Error logging emotion:', emotionError);
      }
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: currentConversationId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in emotional-care-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});