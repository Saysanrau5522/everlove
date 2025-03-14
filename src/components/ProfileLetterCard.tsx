
import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Letter } from '@/hooks/use-letters';
import { useNavigate } from 'react-router-dom';

interface ProfileLetterCardProps {
  letter: Letter;
  isDarkMode?: boolean;
}

const ProfileLetterCard: React.FC<ProfileLetterCardProps> = ({ letter, isDarkMode = false }) => {
  const navigate = useNavigate();
  
  const formattedDate = format(new Date(letter.created_at), 'MMMM d, yyyy');
  
  const handleViewLetter = () => {
    navigate(`/letters/${letter.id}`);
  };
  
  return (
    <Card 
      className={`border-gray-100 p-4 md:p-6 ${
        isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white hover:shadow-md'
      } transition-shadow`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-love-deep' : 'bg-love-medium'}`} />
          <span className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formattedDate}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <h3 className="font-serif text-base md:text-lg mb-2">
        {letter.title || 'Untitled Letter'}
      </h3>
      
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs md:text-sm line-clamp-3`}>
        {letter.content}
      </p>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={`mt-3 ${isDarkMode ? 'text-love-medium' : 'text-love-dark'} text-xs md:text-sm px-0 h-8`}
        onClick={handleViewLetter}
      >
        Read letter
      </Button>
    </Card>
  );
};

export default ProfileLetterCard;
