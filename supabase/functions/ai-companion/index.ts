
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('AI companion function called')
    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format')
    }

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not set')
    }

    const hf = new HfInference(hfToken)
    
    // Enhanced personalized prompt with instructions for shorter responses
    let prompt = `You are Lovable, a compassionate relationship advisor. Be concise and straightforward with a touch of empathy.

Your communication style:
- Keep responses brief and to-the-point (50-100 words)
- Be direct and clear without unnecessary elaboration
- Add a touch of warmth or emotion to show you care
- Focus on actionable advice rather than theory
- Use simple language and avoid jargon
- Always respond in first person ("I think..." rather than "Lovable thinks...")

When discussing love languages or relationship issues:
- Identify the core issue quickly
- Offer 1-2 practical suggestions
- Be supportive without being overly flowery
- Connect emotionally but remain efficient

Respond concisely to the following message:\n\n`
    
    // Add the most recent user message
    const userMessage = messages.filter(m => m.type === 'user').pop()
    
    // Build conversation history for context
    let conversationContext = ''
    if (messages.length > 1) {
      // Get the last few messages for context (excluding the most recent user message)
      const contextMessages = messages.slice(-4, -1)
      contextMessages.forEach(m => {
        conversationContext += `${m.type === 'user' ? 'User' : 'Lovable'}: ${m.content}\n`
      })
      prompt += `Previous conversation:\n${conversationContext}\n\nUser's new message: `
    }
    
    if (userMessage) {
      prompt += userMessage.content
    } else {
      prompt = "Hi! I'm Lovable, your relationship guide. How can I help with your love journey today?"
    }

    console.log('Sending request to Hugging Face with prompt:', prompt.slice(0, 100) + '...')

    // Use a text generation model from Hugging Face
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 150, // Reduced token limit for shorter responses
        temperature: 0.7,
        top_p: 0.92,
        repetition_penalty: 1.2
      }
    })

    console.log('Received response from Hugging Face')
    
    // Clean up the response to ensure it doesn't include the prompt or system message parts
    let cleanedResponse = response.generated_text
    
    // If the response contains the prompt, remove it
    if (cleanedResponse.includes(prompt)) {
      cleanedResponse = cleanedResponse.replace(prompt, '').trim()
    }
    
    // If the response still seems to include a system-like prefix, try to extract just the content
    if (cleanedResponse.includes('Lovable:')) {
      cleanedResponse = cleanedResponse.split('Lovable:').pop()?.trim() || cleanedResponse
    }

    return new Response(
      JSON.stringify({ 
        response: cleanedResponse 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('AI Companion Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
