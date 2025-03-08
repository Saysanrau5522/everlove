
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
  "Communication skills",
  "Building trust",
  "Love languages",
  "Handling conflict",
  "Long distance tips",
  "Self-love practices"
];

const AICompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{type: 'ai' | 'user', content: string}[]>([
    {type: 'ai', content: 'Hello! I\'m your relationship companion. How can I help you today with your love journey?'}
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
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 md:bottom-6 right-6 z-30"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 rounded-full bg-love-medium hover:bg-love-deep shadow-md flex items-center justify-center p-0 group"
            >
              <MessageCircle className="text-white h-6 w-6" />
              <span className="absolute right-full mr-2 px-2 py-1 bg-white rounded-lg text-xs font-medium text-love-deep shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Love Advisor
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AI companion modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 md:bottom-6 right-6 z-30 w-full max-w-md"
          >
            <Card className="border shadow-xl overflow-hidden h-[500px] flex flex-col">
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
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {ADVICE_TOPICS.slice(0, 3).map(topic => (
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-500 gap-1"
                    onClick={() => setIsOpen(prev => !prev)}
                    disabled={isLoading}
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Love Library</span>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AICompanion;
