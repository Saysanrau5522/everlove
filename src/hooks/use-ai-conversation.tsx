
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  content: string;
  is_user: boolean;
  conversation_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
}

export function useAIConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const startConversation = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to chat with the AI companion.',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setConversation(data);
      setMessages([]);
      return data;
    } catch (error: any) {
      console.error('Error starting conversation:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error starting conversation',
        description: error.message,
      });
      return null;
    }
  };

  const fetchConversation = async (conversationId: string) => {
    try {
      setLoading(true);
      
      // Get the conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (conversationError) throw conversationError;
      
      setConversation(conversationData);
      
      // Get the messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      
      setMessages(messagesData || []);
    } catch (error: any) {
      console.error('Error fetching conversation:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching conversation',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, conversationId?: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to chat with the AI companion.',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Get or create a conversation
      let currentConversationId = conversationId;
      
      if (!currentConversationId) {
        if (!conversation) {
          const newConversation = await startConversation();
          if (!newConversation) return;
          currentConversationId = newConversation.id;
        } else {
          currentConversationId = conversation.id;
        }
      }
      
      // Store the user message
      const { data: userMessage, error: userMessageError } = await supabase
        .from('ai_messages')
        .insert({
          content,
          is_user: true,
          conversation_id: currentConversationId,
        })
        .select()
        .single();

      if (userMessageError) throw userMessageError;
      
      // Add the user message to the state
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Get AI response using edge function
      const { data: aiResponse, error: aiResponseError } = await supabase.functions.invoke(
        'ai-companion',
        {
          body: JSON.stringify({
            message: content,
            conversation_history: updatedMessages.map(msg => ({
              role: msg.is_user ? 'user' : 'assistant',
              content: msg.content
            })),
            concise: true // Flag to get shorter responses
          })
        }
      );

      if (aiResponseError) throw aiResponseError;
      
      // Store the AI response
      const { data: aiMessage, error: aiMessageError } = await supabase
        .from('ai_messages')
        .insert({
          content: aiResponse.message,
          is_user: false,
          conversation_id: currentConversationId,
        })
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;
      
      // Add the AI message to the state
      setMessages([...updatedMessages, aiMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error sending message',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    conversation,
    startConversation,
    fetchConversation,
    sendMessage,
  };
}
