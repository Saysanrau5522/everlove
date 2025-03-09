
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Song {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  lyrics: string;
  color: string;
}

const songs: Song[] = [
  {
    id: 1,
    title: "Can't Help Falling in Love",
    artist: "Elvis Presley",
    imageUrl: "/placeholder.svg",
    lyrics: "Wise men say, only fools rush in\nBut I can't help falling in love with you\nShall I stay? Would it be a sin?\nIf I can't help falling in love with you",
    color: "from-love-light to-love-deep"
  },
  {
    id: 2,
    title: "At Last",
    artist: "Etta James",
    imageUrl: "/placeholder.svg",
    lyrics: "At last my love has come along\nMy lonely days are over\nAnd life is like a song\nOh yeah yeah, at last",
    color: "from-wisdom-light to-love-medium"
  },
  {
    id: 3,
    title: "Your Song",
    artist: "Elton John",
    imageUrl: "/placeholder.svg",
    lyrics: "It's a little bit funny, this feeling inside\nI'm not one of those who can easily hide\nI don't have much money, but boy if I did\nI'd buy a big house where we both could live",
    color: "from-blue-100 to-blue-400"
  },
  {
    id: 4,
    title: "La Vie En Rose",
    artist: "Édith Piaf",
    imageUrl: "/placeholder.svg",
    lyrics: "Hold me close and hold me fast\nThe magic spell you cast\nThis is la vie en rose\nWhen you kiss me, heaven sighs\nAnd though I close my eyes\nI see la vie en rose",
    color: "from-pink-100 to-pink-400"
  },
  {
    id: 5,
    title: "Eternal Flame",
    artist: "The Bangles",
    imageUrl: "/placeholder.svg",
    lyrics: "Close your eyes, give me your hand, darling\nDo you feel my heart beating?\nDo you understand?\nDo you feel the same?\nAm I only dreaming?\nIs this burning an eternal flame?",
    color: "from-amber-100 to-amber-400"
  }
];

const SongReels = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const goToNextSong = () => {
    setDirection(1);
    setCurrentSongIndex((prevIndex) => 
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousSong = () => {
    setDirection(-1);
    setCurrentSongIndex((prevIndex) => 
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  const handleSendSong = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to send this song to your loved one.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Song shared",
      description: `"${songs[currentSongIndex].title}" has been sent to your loved one.`,
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="w-full max-w-md mx-auto relative pb-4">
      <h2 className="text-2xl font-serif mb-4 text-center">Love Songs</h2>
      <p className="text-gray-600 mb-6 text-center">
        Swipe through beautiful songs to share with your loved one
      </p>
      
      <div className="relative h-[500px] overflow-hidden rounded-xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSongIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute w-full h-full"
          >
            <Card className={`w-full h-full overflow-hidden bg-gradient-to-br ${songs[currentSongIndex].color} p-6 flex flex-col justify-between text-white shadow-xl`}>
              <div className="relative z-10">
                <div className="text-sm opacity-80 mb-1">
                  {songs[currentSongIndex].artist}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {songs[currentSongIndex].title}
                </h3>
              </div>
              
              <div className="flex-1 flex items-center justify-center z-10">
                <div className="text-center whitespace-pre-line text-lg font-medium italic">
                  "{songs[currentSongIndex].lyrics}"
                </div>
              </div>
              
              <div className="flex justify-between items-center z-10">
                <div className="w-10"></div>
                <Button 
                  onClick={handleSendSong}
                  variant="secondary" 
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Send size={16} />
                  <span>Send to Loved One</span>
                </Button>
                <div className="w-10"></div>
              </div>
              
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -mr-32 -mt-32 blur-md"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 -ml-24 -mb-24 blur-md"></div>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <button
          onClick={goToPreviousSong}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full"
          aria-label="Previous song"
        >
          <ChevronLeft className="text-white" />
        </button>
        
        <button
          onClick={goToNextSong}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full"
          aria-label="Next song"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
      
      {/* Song indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {songs.map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSongIndex ? "bg-love-deep w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SongReels;
