
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Book, Music, Quote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LikedContentProps {
  isDarkMode?: boolean;
}

const LikedContent: React.FC<LikedContentProps> = ({ isDarkMode = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLikedContent();
    }
  }, [user]);

  const fetchLikedContent = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with actual API call to fetch reactions with type "like"
      // For demo purposes, we're just setting an empty array
      setLikedItems([]);
    } catch (error) {
      console.error("Error fetching liked content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter items based on active tab
  const filteredItems = likedItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-love-medium border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
        <TabsList className={`inline-flex border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} rounded-lg p-1`}>
          <TabsTrigger 
            value="all" 
            className={`py-1.5 px-3 text-sm rounded-md ${
              isDarkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white data-[state=active]:shadow-sm'
            }`}
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="letter" 
            className={`py-1.5 px-3 text-sm rounded-md ${
              isDarkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white data-[state=active]:shadow-sm'
            }`}
          >
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Letters
          </TabsTrigger>
          <TabsTrigger 
            value="book" 
            className={`py-1.5 px-3 text-sm rounded-md ${
              isDarkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white data-[state=active]:shadow-sm'
            }`}
          >
            <Book className="h-3.5 w-3.5 mr-1.5" />
            Books
          </TabsTrigger>
          <TabsTrigger 
            value="quote" 
            className={`py-1.5 px-3 text-sm rounded-md ${
              isDarkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white data-[state=active]:shadow-sm'
            }`}
          >
            <Quote className="h-3.5 w-3.5 mr-1.5" />
            Quotes
          </TabsTrigger>
          <TabsTrigger 
            value="song" 
            className={`py-1.5 px-3 text-sm rounded-md ${
              isDarkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white data-[state=active]:shadow-sm'
            }`}
          >
            <Music className="h-3.5 w-3.5 mr-1.5" />
            Songs
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <Card 
              key={item.id} 
              className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
            >
              {/* Content varies based on item.type */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {item.type === 'letter' && <Mail className="h-4 w-4 text-love-medium" />}
                  {item.type === 'book' && <Book className="h-4 w-4 text-wisdom-dark" />}
                  {item.type === 'quote' && <Quote className="h-4 w-4 text-trust-medium" />}
                  {item.type === 'song' && <Music className="h-4 w-4 text-blue-500" />}
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <Button size="sm" variant="ghost" className="p-1 h-7 w-7">
                  <Heart className="h-4 w-4 fill-love-medium text-love-medium" />
                </Button>
              </div>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                {item.description || item.content}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <div className={`bg-white ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''} rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 text-center`}>
          <Heart className={`mx-auto h-10 w-10 ${isDarkMode ? 'text-love-medium/70' : 'text-love-medium/50'} mb-4`} />
          <h3 className="text-lg md:text-xl font-medium mb-3">Your Liked Collection</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base`}>
            You haven't liked any content yet. Heart the content you love to find it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default LikedContent;
