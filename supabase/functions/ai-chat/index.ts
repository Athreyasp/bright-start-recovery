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
    const { message, userId } = await req.json();
    console.log('AI Chat request:', { message, userId });

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Message and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user context for personalized responses
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, recovery_start_date')
      .eq('user_id', userId)
      .single();

    // Get recent check-ins for context
    const { data: recentCheckIns } = await supabase
      .from('daily_check_ins')
      .select('mood, stress, cravings, notes')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    // Build context for the AI
    let context = "You are a compassionate AI recovery assistant helping someone on their journey to sobriety. ";
    
    if (profile?.full_name) {
      context += `The user's name is ${profile.full_name}. `;
    }
    
    if (profile?.recovery_start_date) {
      const startDate = new Date(profile.recovery_start_date);
      const daysSober = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      context += `They have been in recovery for ${daysSober} days. `;
    }

    if (recentCheckIns && recentCheckIns.length > 0) {
      const latestCheckIn = recentCheckIns[0];
      context += `Recent mood: ${latestCheckIn.mood}/10, stress: ${latestCheckIn.stress}/10, cravings: ${latestCheckIn.cravings}/10. `;
      if (latestCheckIn.notes) {
        context += `Recent notes: "${latestCheckIn.notes}". `;
      }
    }

    context += "Provide supportive, empathetic responses focused on recovery, mental health, and wellness. Keep responses concise but meaningful.";

    console.log('Calling OpenAI API with context:', context);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      console.error('No AI response received');
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save the conversation to the database
    try {
      await supabase.from('chat_messages').insert([
        { user_id: userId, message: message, is_user: true },
        { user_id: userId, message: aiResponse, is_user: false }
      ]);
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue with response even if save fails
    }

    console.log('AI Chat response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});