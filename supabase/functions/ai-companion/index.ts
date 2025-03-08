
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
    
    // Convert chat format to a text prompt
    let prompt = "You are a helpful relationship and love advisor. Respond thoughtfully to the following message:\n\n"
    
    // Add the most recent user message
    const userMessage = messages.filter(m => m.type === 'user').pop()
    if (userMessage) {
      prompt += userMessage.content
    } else {
      prompt = "Hello! I'm your relationship companion. How can I help you today with your love journey?"
    }

    console.log('Sending request to Hugging Face with prompt:', prompt.slice(0, 100) + '...')

    // Use a text generation model from Hugging Face
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2
      }
    })

    console.log('Received response from Hugging Face')

    return new Response(
      JSON.stringify({ 
        response: response.generated_text 
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
