
import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIConversation } from '@/hooks/use-ai-conversation';
import { useAuth } from '@/context/AuthContext';

const AICompanion = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useAIConversation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="w-full max-w-md flex flex-col h-full border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <span className="flex h-6 w-6 rounded-full bg-love-light items-center justify-center mr-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-love-deep opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-love-medium"></span>
            </span>
          </span>
          Lovable AI
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto pb-2 pt-2">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>Ask me anything about love and relationships.</p>
              <p className="text-xs mt-2">I'm your supportive companion for matters of the heart.</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-lg ${
                      message.is_user
                        ? 'bg-wisdom-light text-wisdom-dark'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!user || loading}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || !user || loading}
            className="bg-love-medium hover:bg-love-deep text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AICompanion;
