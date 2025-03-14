
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
  console.log("AI companion function received request");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { message, conversation_history = [] } = requestData;

    if (!message) {
      console.error("No message provided in request");
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    console.log("Processing message:", message);
    console.log("With conversation history length:", conversation_history.length);

    // Create Supabase client to log conversations if user is authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
        console.log("User authenticated:", userId);
      } else {
        console.log("Auth error or no user:", error);
      }
    } else {
      console.log("No auth header or invalid format");
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

    console.log("Sending request to Hugging Face API");

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
      console.error("Response:", await response.text());
      
      // Fallback response when the API fails
      const fallbackResponse = "I'm having trouble connecting to my brain right now. Please try again in a moment. In the meantime, remember that communication is key in any relationship.";
      
      // Log the fallback response if user is authenticated
      if (userId) {
        try {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          
          // Check for existing conversation or create one
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
            const { data: newConversation } = await supabase
              .from('ai_conversations')
              .insert({ user_id: userId })
              .select();
            
            if (newConversation) {
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
            
            // Log fallback response
            await supabase
              .from('ai_messages')
              .insert({
                conversation_id: conversationId,
                content: fallbackResponse,
                is_user: false
              });
          }
        } catch (logError) {
          console.error("Error logging fallback message:", logError);
        }
      }
      
      return new Response(
        JSON.stringify({ message: fallbackResponse }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }

    const result = await response.json();
    console.log("Response received from Hugging Face API");
    
    // Clean up the response
    let aiResponse = result.generated_text || "";
    
    // Clean up common prefixes
    aiResponse = aiResponse
      .replace(/^(assistant:|Assistant:|ASSISTANT:)/i, "")
      .trim();
    
    console.log("Cleaned AI response:", aiResponse);
    
    // Log conversation to Supabase if user is authenticated
    if (userId) {
      try {
        console.log("Logging conversation to Supabase");
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
          console.log("Using existing conversation:", conversationId);
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
            console.log("Created new conversation:", conversationId);
          }
        }
        
        if (conversationId) {
          // Log user message
          const { error: userMsgError } = await supabase
            .from('ai_messages')
            .insert({
              conversation_id: conversationId,
              content: message,
              is_user: true
            });
            
          if (userMsgError) {
            console.error("Error logging user message:", userMsgError);
          } else {
            console.log("Logged user message");
          }
          
          // Log AI response
          const { error: aiMsgError } = await supabase
            .from('ai_messages')
            .insert({
              conversation_id: conversationId,
              content: aiResponse,
              is_user: false
            });
            
          if (aiMsgError) {
            console.error("Error logging AI response:", aiMsgError);
          } else {
            console.log("Logged AI response");
          }
        }
      } catch (logError) {
        console.error("Error in Supabase logging:", logError);
      }
    }
    
    console.log("Returning successful response");
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
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
