
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, conversation_history = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // Create Supabase client to log conversations if user is authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    // Define the AI personality - Lovable, a relationship advisor
    const systemPrompt = 
      `You are Lovable, a warm and compassionate relationship advisor who gives straightforward advice with a touch of emotion. 
      Your responses should be emotionally resonant and supportive. 
      You speak like a caring friend who gets right to the heart of relationship matters. 
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

    console.log("Sending request to Hugging Face API with prompt:", JSON.stringify(fullPrompt));

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
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log("Response from Hugging Face API:", JSON.stringify(result));
    
    // Clean up the response
    let aiResponse = result.generated_text || "";
    
    // Clean up common prefixes
    aiResponse = aiResponse
      .replace(/^(assistant:|Assistant:|ASSISTANT:)/i, "")
      .trim();
    
    // Log conversation to Supabase if user is authenticated
    if (userId) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // First check if there's an existing conversation for this user
      const { data: existingConversations } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      let conversationId;
      
      if (existingConversations && existingConversations.length > 0) {
        conversationId = existingConversations[0].id;
      } else {
        // Create a new conversation
        const { data: newConversation, error: conversationError } = await supabase
          .from('ai_conversations')
          .insert({ user_id: userId })
          .select();
        
        if (conversationError) {
          console.error("Error creating conversation:", conversationError);
        } else if (newConversation) {
          conversationId = newConversation[0].id;
        }
      }
      
      if (conversationId) {
        // Log user message
        await supabase
          .from('ai_messages')
          .insert({
            conversation_id: conversationId,
            content: message,
            is_user: true
          });
        
        // Log AI response
        await supabase
          .from('ai_messages')
          .insert({
            conversation_id: conversationId,
            content: aiResponse,
            is_user: false
          });
      }
    }
    
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
