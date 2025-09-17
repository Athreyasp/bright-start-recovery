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
    
    // Retry logic for API overload
    let retryCount = 0;
    const maxRetries = 3;
    let response;
    
    while (retryCount < maxRetries) {
      try {
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

        if (resp.ok) {
          response = resp;
          break;
        } else if (resp.status === 503 || resp.status === 429) {
          // API overloaded or rate limited, wait and retry
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Gemini API overloaded, retrying (${retryCount}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000)); // Exponential backoff
            continue;
          }
        }
        
        // If we get here, there was an error that's not retryable
        const errorText = await resp.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${resp.status} - ${errorText}`);
        
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          throw error;
        }
        console.log(`Request failed, retrying (${retryCount}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    if (!response) {
      throw new Error('Failed to get response after all retries');
    }

    console.log('Gemini API response received');
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m here to help! Could you please rephrase your question?';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('ai-chat error', e);
    
    // Provide helpful fallback response for common recovery questions
    const userMessage = (await req.json())?.messages?.slice(-1)?.[0]?.content?.toLowerCase() || '';
    let fallbackResponse = "I'm experiencing technical difficulties right now, but I'm still here to support you. Please try again in a moment.";
    
    if (userMessage.includes('alcohol') || userMessage.includes('drink')) {
      fallbackResponse = "I understand you're asking about alcohol. While I'm having technical issues, I want you to know that any amount of alcohol can be risky during recovery. Please speak with your healthcare provider or counselor about safe practices. If you're feeling urges, try calling a support hotline or reach out to your sponsor or support group.";
    } else if (userMessage.includes('craving') || userMessage.includes('urge')) {
      fallbackResponse = "I'm having technical issues, but if you're experiencing cravings, please remember: this feeling will pass. Try deep breathing, call your support person, or use the coping strategies you've learned. You're stronger than this moment.";
    } else if (userMessage.includes('help') || userMessage.includes('support')) {
      fallbackResponse = "Even though I'm having technical difficulties, please know that help is always available. Contact your counselor, support group, or call a crisis line if you need immediate support. You're not alone in this journey.";
    }
    
    return new Response(JSON.stringify({ reply: fallbackResponse }), {
      status: 200, // Return 200 with helpful message instead of error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});