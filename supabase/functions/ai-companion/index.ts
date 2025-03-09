
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const HUGGING_FACE_API_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, conversation_history = [], concise = true } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // Define the AI personality - Lovable, a relationship advisor with shorter, more heartfelt responses
    const systemPrompt = 
      `You are Lovable, a warm and compassionate relationship advisor who gives brief, straightforward advice with a touch of emotion. 
      Your responses should be concise (2-3 sentences maximum) but still emotionally resonant and supportive. 
      You speak like a caring friend who gets right to the heart of relationship matters without lengthy explanations. 
      Focus on practical guidance for building healthy, authentic connections. 
      Keep your tone warm and uplifting, but always honest and direct.`;

    // Structure the conversation history for the model
    let fullPrompt = [
      { role: "system", content: systemPrompt }
    ];

    // Add conversation history
    if (conversation_history && conversation_history.length > 0) {
      const formattedHistory = conversation_history.map(msg => ({
        role: msg.role || (msg.is_user ? "user" : "assistant"),
        content: msg.content
      }));
      fullPrompt = [...fullPrompt, ...formattedHistory];
    }

    // Add the current message
    fullPrompt.push({ role: "user", content: message });

    // Generate a response from the AI model
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 120, // Reduced token limit for shorter responses
          temperature: 0.75,  // Slightly increased for more emotional language
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Clean up the response
    let aiResponse = result.generated_text || "";
    
    // Clean up common prefixes
    aiResponse = aiResponse
      .replace(/^(assistant:|Assistant:|ASSISTANT:)/i, "")
      .trim();
    
    return new Response(
      JSON.stringify({ message: aiResponse }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
