
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Add relationship advice topics for quick access
const ADVICE_TOPICS = [
  "Communication tips",
  "Love languages",
  "Handle conflict",
  "Build trust"
];

const AIChatLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{type: 'ai' | 'user', content: string}[]>([
    {type: 'ai', content: 'Hello! How can I help with your relationship journey today?'}
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {type: 'user' as const, content: input};
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-companion', {
        body: { messages: [...messages, userMessage] }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      if (!data || !data.response) {
        throw new Error('Invalid response from AI service');
      }
      
      // Add AI response
      setMessages(prev => [...prev, {
        type: 'ai', 
        content: data.response
      }]);
    } catch (error) {
      console.error('AI Companion error:', error);
      toast({
        title: "Connection issue",
        description: "Couldn't connect to AI companion. Please try again.",
        variant: "destructive"
      });
      
      // Add fallback response
      setMessages(prev => [...prev, {
        type: 'ai', 
        content: "I'm having trouble connecting right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickTopic = (topic: string) => {
    setInput(`Can you give me advice about ${topic.toLowerCase()}?`);
  };
  
  return (
    <div className={`fixed right-0 top-20 bottom-0 z-40 w-full max-w-md transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <Card className="h-full border-l shadow-xl rounded-l-xl rounded-r-none overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-love-light/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Heart className="text-love-deep h-5 w-5" fill="currentColor" />
              <motion.div 
                className="absolute -inset-1 rounded-full border border-love-medium opacity-60"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h3 className="font-medium flex items-center gap-1">
              Relationship Guide
              <Sparkles className="h-3 w-3 text-love-medium" />
            </h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full hover:bg-love-light/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, i) => (
            <div 
              key={i} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-love-medium text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                {message.content}
              </motion.div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-100 text-gray-800 max-w-[80%] p-3 rounded-2xl rounded-tl-none"
              >
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder={isLoading ? "AI is thinking..." : "Ask for advice..."}
              className="flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="bg-love-medium hover:bg-love-deep"
              disabled={isLoading || !input.trim()}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </form>
          
          {/* Quick topic buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            {ADVICE_TOPICS.map(topic => (
              <Button 
                key={topic} 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickTopic(topic)}
                className="text-xs border-love-light hover:bg-love-light/20 text-gray-700"
                disabled={isLoading}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 h-12 w-12 rounded-l-xl rounded-r-none bg-love-medium hover:bg-love-deep shadow-md"
      >
        <Heart className={`h-5 w-5 text-white transition-transform ${isOpen ? 'rotate-0' : 'rotate-0'}`} />
      </Button>
    </div>
  );
};

export default AIChatLayout;
