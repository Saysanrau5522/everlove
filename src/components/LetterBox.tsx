
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import LetterTemplate from './LetterTemplate';

interface LetterBoxProps {
  recipient?: string;
  onLetterSent?: () => void;
}

const LetterBox = ({ recipient = "Your beloved", onLetterSent }: LetterBoxProps) => {
  const [isWriting, setIsWriting] = useState(false);
  const [letterContent, setLetterContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const handleSendLetter = () => {
    if (!letterContent.trim()) return;
    
    setIsSending(true);
    
    // Simulate sending a letter with a small delay
    setTimeout(() => {
      // In a real app, this would send the letter to the API
      console.log("Sending letter to:", recipient, "Content:", letterContent);
      
      // Show success toast
      toast({
        title: "Letter Sent",
        description: `Your letter to ${recipient} has been delivered.`,
        variant: "default",
      });
      
      setLetterContent("");
      setIsWriting(false);
      setIsSending(false);
      
      // Call the callback if provided
      if (onLetterSent) {
        onLetterSent();
      }
    }, 1000);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isWriting ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            key="letter-closed"
          >
            <Card className="p-8 border border-amber-100 bg-parchment-light shadow-paper">
              <div className="text-center space-y-6">
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <motion.div 
                    className="w-full h-full rounded-full bg-love-light flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="text-love-dark h-7 w-7" />
                  </motion.div>
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-love-medium opacity-20"
                    animate={{ 
                      scale: [1, 1.15, 1],
                      opacity: [0.2, 0.1, 0.2]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-love-dark">Write a Letter</h3>
                  <p className="text-muted-foreground">
                    Compose a meaningful message for {recipient}
                  </p>
                </div>
                
                <Button
                  onClick={() => setIsWriting(true)}
                  className="bg-love-medium hover:bg-love-deep text-white font-medium px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Heart className="h-4 w-4" />
                  <span>Compose a Letter</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            key="letter-open"
            className="relative"
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-4 z-10 rounded-full w-8 h-8 bg-white/80 backdrop-blur-sm shadow-sm"
              onClick={() => setIsWriting(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <LetterTemplate recipient={recipient}>
              <Textarea
                placeholder="Pour your heart out..."
                className="resize-none min-h-[200px] font-serif text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
              />
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSendLetter}
                  disabled={!letterContent.trim() || isSending}
                  className="bg-love-medium hover:bg-love-deep text-white font-medium px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Letter</span>
                    </>
                  )}
                </Button>
              </div>
            </LetterTemplate>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LetterBox;
