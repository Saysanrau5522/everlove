
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Send, X, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import LetterTemplate from './LetterTemplate';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LetterBoxProps {
  recipient?: string;
}

const LetterBox = ({ recipient = "Your beloved" }: LetterBoxProps) => {
  const [isWriting, setIsWriting] = useState(false);
  const [letterContent, setLetterContent] = useState("");
  const [letterTitle, setLetterTitle] = useState("");
  const [customRecipient, setCustomRecipient] = useState(recipient);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSendLetter = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send letters",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!letterContent.trim()) {
      toast({
        title: "Empty letter",
        description: "Please write something in your letter before sending",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      const { error } = await supabase
        .from('letters')
        .insert({
          author_id: user.id,
          recipient: customRecipient,
          title: letterTitle || null,
          content: letterContent,
          is_draft: false
        });
      
      if (error) throw error;
      
      toast({
        title: "Letter sent",
        description: `Your letter to ${customRecipient} has been sent successfully.`,
      });
      
      setLetterContent("");
      setLetterTitle("");
      setIsWriting(false);
    } catch (error: any) {
      toast({
        title: "Error sending letter",
        description: error.message || "There was an error sending your letter",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSaveDraft = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save drafts",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!letterContent.trim()) {
      toast({
        title: "Empty draft",
        description: "Please write something in your letter before saving",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('letters')
        .insert({
          author_id: user.id,
          recipient: customRecipient,
          title: letterTitle || null,
          content: letterContent,
          is_draft: true
        });
      
      if (error) throw error;
      
      toast({
        title: "Draft saved",
        description: "Your draft has been saved successfully. You can find it in your letters.",
      });
      
      setLetterContent("");
      setLetterTitle("");
      setIsWriting(false);
    } catch (error: any) {
      toast({
        title: "Error saving draft",
        description: error.message || "There was an error saving your draft",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
            
            <LetterTemplate recipient={customRecipient} sender={profile?.full_name || user?.email || "Me"}>
              <div className="space-y-6">
                <div className="flex flex-col space-y-3">
                  <Input
                    placeholder="Letter title (optional)"
                    className="border-none text-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
                    value={letterTitle}
                    onChange={(e) => setLetterTitle(e.target.value)}
                  />
                  
                  <Input
                    placeholder="Dear..."
                    className="border-none font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
                    value={customRecipient}
                    onChange={(e) => setCustomRecipient(e.target.value)}
                  />
                </div>
                
                <Textarea
                  placeholder="Pour your heart out..."
                  className="resize-none min-h-[200px] font-serif text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between mt-6">
                <Button
                  onClick={handleSaveDraft}
                  disabled={isSaving || isSending || !letterContent.trim()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Draft</span>
                </Button>
                
                <Button
                  onClick={handleSendLetter}
                  disabled={isSending || isSaving || !letterContent.trim()}
                  className="bg-love-medium hover:bg-love-deep text-white font-medium px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Send Letter</span>
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
