
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const AICompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{type: 'ai' | 'user', content: string}[]>([
    {type: 'ai', content: 'Hello! I\'m your relationship companion. How can I help you today with your love journey?'}
  ]);
  const [input, setInput] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    setMessages([...messages, {type: 'user', content: input}]);
    setInput('');
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      let response = '';
      if (input.toLowerCase().includes('advice')) {
        response = 'Communication is key in any relationship. Try setting aside dedicated time each week to talk openly about your feelings and needs.';
      } else if (input.toLowerCase().includes('love language')) {
        response = 'The five love languages are: Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, and Physical Touch. Understanding your partner\'s primary love language can strengthen your connection.';
      } else {
        response = 'That\'s an interesting point. Remember that authentic love is built on trust, respect, and open communication. Would you like advice on a specific aspect of your relationship?';
      }
      
      setMessages(prev => [...prev, {type: 'ai', content: response}]);
    }, 1000);
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
              className="w-12 h-12 rounded-full bg-love-medium hover:bg-love-deep shadow-md flex items-center justify-center p-0"
            >
              <MessageCircle className="text-white h-6 w-6" />
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
                  <h3 className="font-medium">Relationship Guide</h3>
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
              </div>
              
              {/* Input */}
              <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ask for advice..."
                    className="flex-1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button type="submit" className="bg-love-medium hover:bg-love-deep">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </form>
                <div className="mt-2 flex items-center justify-center">
                  <Button variant="ghost" size="sm" className="text-xs text-gray-500 gap-1">
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
