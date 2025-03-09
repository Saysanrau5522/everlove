
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface Letter {
  id: string;
  title: string;
  content: string;
  recipient: string;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  scheduled_for: string | null;
  author_id: string;
}

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchLetters();
    }
  }, [user]);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setLetters(data || []);
    } catch (error: any) {
      console.error('Error fetching letters:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching letters',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createLetter = async (letterData: Omit<Letter, 'id' | 'created_at' | 'updated_at' | 'author_id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('letters')
        .insert({
          ...letterData,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setLetters((prev) => [data, ...prev]);
      
      toast({
        title: 'Letter created',
        description: 'Your letter has been saved successfully',
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating letter:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error creating letter',
        description: error.message,
      });
      return null;
    }
  };

  const updateLetter = async (id: string, updates: Partial<Omit<Letter, 'id' | 'created_at' | 'author_id'>>) => {
    try {
      const { data, error } = await supabase
        .from('letters')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setLetters((prev) => prev.map((letter) => (letter.id === id ? data : letter)));
      
      toast({
        title: 'Letter updated',
        description: 'Your letter has been updated successfully',
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating letter:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error updating letter',
        description: error.message,
      });
      return null;
    }
  };

  const deleteLetter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('letters')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setLetters((prev) => prev.filter((letter) => letter.id !== id));
      
      toast({
        title: 'Letter deleted',
        description: 'Your letter has been deleted successfully',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting letter:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error deleting letter',
        description: error.message,
      });
      return false;
    }
  };

  return {
    letters,
    loading,
    fetchLetters,
    createLetter,
    updateLetter,
    deleteLetter,
  };
}
