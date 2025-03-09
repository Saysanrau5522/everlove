
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Clock, Heart } from 'lucide-react';
import { useLetters } from '@/hooks/use-letters';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LetterBox = () => {
  const [recipient, setRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const { createLetter } = useLetters();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handleBack = () => {
    setIsWriting(false);
    setIsScheduling(false);
  };

  const handleSchedule = () => {
    setIsScheduling(true);
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
      const letterData = {
        title: title || 'Untitled Letter',
        content,
        recipient,
        is_draft: isDraft,
        scheduled_for: isScheduling ? new Date(scheduledDate).toISOString() : null,
      };

      const success = await createLetter(letterData);

      if (success) {
        setRecipient('');
        setTitle('');
        setContent('');
        setIsWriting(false);
        setIsScheduling(false);
        setScheduledDate('');

        toast({
          title: isDraft ? 'Draft saved' : 'Letter sent',
          description: isDraft 
            ? 'Your letter has been saved as a draft.' 
            : isScheduling 
              ? 'Your letter has been scheduled.' 
              : 'Your letter has been sent.',
        });
      }
    } catch (error) {
      console.error('Error sending letter:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
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
                <h3 className="text-xl font-serif ml-2">
                  {isScheduling ? 'Schedule Your Letter' : 'Write Your Letter'}
                </h3>
              </div>

              {isScheduling ? (
                // Scheduling view
                <div className="space-y-6">
                  <div>
                    <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date and Time to Send
                    </label>
                    <Input
                      id="schedule-date"
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsScheduling(false)}>
                      Back to Writing
                    </Button>
                    <Button 
                      onClick={() => handleSendLetter(false)} 
                      disabled={!scheduledDate}
                      className="bg-love-medium hover:bg-love-deep text-white"
                    >
                      Schedule Letter
                    </Button>
                  </div>
                </div>
              ) : (
                // Writing view
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
                      placeholder="Write your heartfelt message here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full min-h-[200px] p-3"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={() => handleSendLetter(true)}>
                      Save as Draft
                    </Button>
                    <Button variant="outline" onClick={handleSchedule}>
                      <Clock size={16} className="mr-2" />
                      Schedule
                    </Button>
                    <Button 
                      onClick={() => handleSendLetter(false)} 
                      className="bg-love-medium hover:bg-love-deep text-white"
                    >
                      <Send size={16} className="mr-2" />
                      Send Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LetterBox;
