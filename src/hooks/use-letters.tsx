
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
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setLetters(data || []);
      console.log('Fetched letters:', data);
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

      console.log('Creating letter with data:', { ...letterData, author_id: user.id });
      
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
        description: letterData.is_draft 
          ? 'Your letter has been saved as a draft' 
          : 'Your letter has been scheduled for delivery',
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
        .eq('author_id', user?.id)
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
        .eq('id', id)
        .eq('author_id', user?.id);

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

  // This function will fetch user's received letters
  const fetchReceivedLetters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('letters')
        .select(`
          *,
          profiles:author_id (full_name, avatar_url)
        `)
        .eq('recipient', user?.user_metadata?.full_name || '')
        .eq('is_draft', false)
        .lte('scheduled_for', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Received letters:', data);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching received letters:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching received letters',
        description: error.message,
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    letters,
    loading,
    fetchLetters,
    createLetter,
    updateLetter,
    deleteLetter,
    fetchReceivedLetters,
  };
}
