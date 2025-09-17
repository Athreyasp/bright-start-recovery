import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const { messages } = await req.json();

    // System prompt for recovery platform
    const systemMessage = {
      role: 'model',
      parts: [{ 
        text: `You are a compassionate AI assistant for a recovery and wellness platform. Your role is to:
        
        1. Provide supportive, non-judgmental responses about addiction recovery, mental health, and wellness
        2. Encourage users to seek professional help when appropriate
        3. Share general wellness tips and coping strategies
        4. Help users navigate the app features like appointments, risk assessments, and daily check-ins
        5. Always maintain a warm, understanding, and hopeful tone
        6. Never provide medical advice - always refer to healthcare professionals for medical concerns
        7. Focus on empowerment, self-care, and positive recovery steps
        
        Remember: You're here to support their wellness journey, not replace professional treatment.` 
      }]
    };

    // Convert messages to Gemini content format and add system message
    const contents = [
      systemMessage,
      ...(messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))
    ];

    console.log('Sending request to Gemini API...');
    
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: contents.slice(1), // Don't send system message in contents array
          systemInstruction: systemMessage, // Use systemInstruction instead
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!resp.ok) {
      const t = await resp.text();
      console.error('Gemini error:', t);
      return new Response(JSON.stringify({ error: 'Gemini request failed', detail: t }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log('Gemini API response received');
    const data = await resp.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m here to help! Could you please rephrase your question?';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('ai-chat error', e);
    return new Response(JSON.stringify({ error: e.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});