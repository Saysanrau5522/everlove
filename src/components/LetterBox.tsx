
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Clock, Heart, Save } from 'lucide-react';
import { useLetters } from '@/hooks/use-letters';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import LetterTemplate from './LetterTemplate';
import { addHours } from 'date-fns';

const LetterBox = () => {
  const [recipient, setRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const { createLetter } = useLetters();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handleBack = () => {
    if (isPreview) {
      setIsPreview(false);
    } else {
      setIsWriting(false);
    }
  };

  const handlePreview = () => {
    if (!recipient) {
      toast({
        variant: 'destructive',
        title: 'Recipient required',
        description: 'Please enter a recipient for your letter.',
      });
      return;
    }
    
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Content required',
        description: 'Please write some content for your letter.',
      });
      return;
    }

    setIsPreview(true);
  };

  const handleSendLetter = async (isDraft = false) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to send letters.',
      });
      return;
    }
    
    if (!recipient) {
      toast({
        variant: 'destructive',
        title: 'Recipient required',
        description: 'Please enter a recipient for your letter.',
      });
      return;
    }
    
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Content required',
        description: 'Please write some content for your letter.',
      });
      return;
    }

    try {
      // Auto-schedule for 10 hours later
      const scheduledTime = addHours(new Date(), 10);
      
      const letterData = {
        title: title || 'Untitled Letter',
        content,
        recipient,
        is_draft: isDraft,
        scheduled_for: isDraft ? null : scheduledTime.toISOString(),
      };

      const success = await createLetter(letterData);

      if (success) {
        setRecipient('');
        setTitle('');
        setContent('');
        setIsWriting(false);
        setIsPreview(false);

        toast({
          title: isDraft ? 'Draft saved' : 'Letter scheduled',
          description: isDraft 
            ? 'Your letter has been saved as a draft.' 
            : `Your letter has been scheduled to be delivered in 10 hours.`,
        });
      }
    } catch (error) {
      console.error('Error sending letter:', error);
      toast({
        variant: 'destructive',
        title: 'Error sending letter',
        description: 'There was a problem sending your letter. Please try again.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="border-none shadow-lg bg-white">
        <CardContent className="p-6">
          {!isWriting ? (
            // Letter starting view
            <div className="text-center">
              <h3 className="text-2xl font-serif mb-4">Write a Love Letter</h3>
              <p className="text-gray-600 mb-6">
                Express your feelings in a thoughtful way to someone special in your life.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={handleStartWriting}
                  className="bg-love-medium hover:bg-love-deep text-white px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Start Writing
                </Button>
              </div>
            </div>
          ) : isPreview ? (
            // Letter preview
            <div>
              <div className="flex items-center mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="text-gray-500"
                >
                  <ArrowLeft size={20} />
                </Button>
                <h3 className="text-xl font-serif ml-2">Preview Your Letter</h3>
              </div>

              <div className="my-6">
                <LetterTemplate recipient={recipient} sender={user?.user_metadata?.full_name || 'Me'}>
                  {content}
                </LetterTemplate>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => handleSendLetter(true)}>
                  <Save size={16} className="mr-2" />
                  Save as Draft
                </Button>
                <Button 
                  onClick={() => handleSendLetter(false)} 
                  className="bg-love-medium hover:bg-love-deep text-white"
                >
                  <Send size={16} className="mr-2" />
                  Send Letter
                </Button>
              </div>
            </div>
          ) : (
            // Letter writing view
            <div>
              <div className="flex items-center mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="text-gray-500"
                >
                  <ArrowLeft size={20} />
                </Button>
                <h3 className="text-xl font-serif ml-2">Write Your Letter</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <Input
                    id="recipient"
                    placeholder="Recipient's Name"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Optional)
                  </label>
                  <Input
                    id="title"
                    placeholder="Letter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <Textarea
                    id="content"
                    placeholder="My dearest..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[300px] p-4 font-serif"
                    style={{ 
                      backgroundImage: "linear-gradient(transparent, transparent 29px, #ddd 30px)",
                      backgroundSize: "30px 30px", 
                      lineHeight: "30px"
                    }}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => handleSendLetter(true)}>
                    <Save size={16} className="mr-2" />
                    Save as Draft
                  </Button>
                  <Button 
                    onClick={handlePreview} 
                    className="bg-love-medium hover:bg-love-deep text-white"
                  >
                    <Heart size={16} className="mr-2" />
                    Preview Letter
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LetterBox;
