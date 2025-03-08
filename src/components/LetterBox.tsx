
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Send, X, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import LetterTemplate from './LetterTemplate';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';

interface LetterBoxProps {
  recipient?: string;
}

const LetterBox = ({ recipient = "" }: LetterBoxProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isWriting, setIsWriting] = useState(false);
  const [letterContent, setLetterContent] = useState("");
  const [letterTitle, setLetterTitle] = useState("");
  const [letterRecipient, setLetterRecipient] = useState(recipient);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch letter templates
  const { data: templates } = useQuery({
    queryKey: ['letterTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('letter_templates')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: isWriting,
  });
  
  // Reset states when recipient changes
  useEffect(() => {
    setLetterRecipient(recipient);
  }, [recipient]);
  
  const handleSaveDraft = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('letters')
        .insert({
          author_id: user.id,
          recipient: letterRecipient,
          title: letterTitle,
          content: letterContent,
          is_draft: true,
          scheduled_for: scheduledDate ? scheduledDate.toISOString() : null,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Draft saved',
        description: 'Your letter has been saved as a draft.',
      });
      
      resetForm();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Failed to save draft',
        description: 'There was an error saving your draft.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendLetter = async () => {
    if (!user) return;
    if (!letterRecipient.trim()) {
      toast({
        title: 'Cannot send letter',
        description: 'Please specify a recipient for your letter.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('letters')
        .insert({
          author_id: user.id,
          recipient: letterRecipient,
          title: letterTitle,
          content: letterContent,
          is_draft: false,
          scheduled_for: scheduledDate ? scheduledDate.toISOString() : null,
        });
      
      if (error) throw error;
      
      const message = scheduledDate
        ? `Your letter has been scheduled for ${format(scheduledDate, 'PPP')}.`
        : 'Your letter has been sent.';
      
      toast({
        title: 'Letter sent',
        description: message,
      });
      
      resetForm();
    } catch (error) {
      console.error('Error sending letter:', error);
      toast({
        title: 'Failed to send letter',
        description: 'There was an error sending your letter.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setLetterContent("");
    setLetterTitle("");
    setScheduledDate(undefined);
    setIsScheduling(false);
    setIsWriting(false);
  };
  
  const useTemplate = (templateContent: string) => {
    setLetterContent(templateContent);
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
                    Compose a meaningful message for someone special
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
            
            <LetterTemplate recipient={letterRecipient}>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Letter Title (Optional)"
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  className="font-serif text-xl border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              
              {!recipient && (
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Recipient's Name"
                    value={letterRecipient}
                    onChange={(e) => setLetterRecipient(e.target.value)}
                    className="font-serif text-lg border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              )}
              
              <Textarea
                placeholder="Pour your heart out..."
                className="resize-none min-h-[200px] font-serif text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
              />
              
              <div className="flex justify-between mt-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={!letterContent.trim() || isLoading}
                    className="bg-white/80 backdrop-blur-sm flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                  </Button>
                  
                  <Popover open={isScheduling} onOpenChange={setIsScheduling}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>{scheduledDate ? 'Scheduled' : 'Schedule'}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button
                  onClick={handleSendLetter}
                  disabled={!letterContent.trim() || isLoading}
                  className="bg-love-medium hover:bg-love-deep text-white font-medium rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Letter</span>
                </Button>
              </div>
              
              {templates && templates.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-200/50">
                  <h4 className="text-sm font-medium mb-2">Templates</h4>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        onClick={() => useTemplate(template.content)}
                        className="text-xs bg-white/50"
                      >
                        {template.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </LetterTemplate>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LetterBox;
