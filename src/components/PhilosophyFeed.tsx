
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Music, Quote, Heart, Bookmark, Share2, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

// Sample content for the library
const quotes = [
  {
    id: 1,
    text: "Love is composed of a single soul inhabiting two bodies.",
    author: "Aristotle",
    category: "Philosophy",
    likes: 342,
  },
  {
    id: 2,
    text: "The best thing to hold onto in life is each other.",
    author: "Audrey Hepburn",
    category: "Wisdom",
    likes: 289,
  },
  {
    id: 3,
    text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
    author: "Lao Tzu",
    category: "Philosophy",
    likes: 412,
  },
  {
    id: 4,
    text: "Love isn't something you find. Love is something that finds you.",
    author: "Loretta Young",
    category: "Wisdom",
    likes: 256,
  },
];

const books = [
  {
    id: 1,
    title: "The 5 Love Languages",
    author: "Gary Chapman",
    description: "How to express heartfelt commitment to your mate.",
    coverUrl: "https://m.media-amazon.com/images/I/71JL+1vv0uL._AC_UF1000,1000_QL80_.jpg",
    category: "Relationships",
    rating: 4.8,
  },
  {
    id: 2,
    title: "All About Love",
    author: "bell hooks",
    description: "New visions on the nature of love and what it means to be fully alive.",
    coverUrl: "https://m.media-amazon.com/images/I/71bXMIwxy5L._AC_UF1000,1000_QL80_.jpg",
    category: "Philosophy",
    rating: 4.7,
  },
  {
    id: 3,
    title: "Attached",
    author: "Amir Levine & Rachel Heller",
    description: "The science of adult attachment and how it can help you find and keep love.",
    coverUrl: "https://m.media-amazon.com/images/I/41+BlKVyFvL._AC_UF1000,1000_QL80_.jpg",
    category: "Psychology",
    rating: 4.6,
  },
];

const songs = [
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

const PhilosophyFeed = () => {
  const [activeTab, setActiveTab] = useState("quotes");
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleSave = (id: number) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(itemId => itemId !== id));
    } else {
      setSavedItems([...savedItems, id]);
    }
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Wisdom Library</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
          <TabsTrigger value="quotes" className="flex items-center">
            <Quote size={16} className="mr-2" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center">
            <Book size={16} className="mr-2" />
            Books
          </TabsTrigger>
          <TabsTrigger value="songs" className="flex items-center">
            <Music size={16} className="mr-2" />
            Songs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotes" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {quotes.map((quote) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <Quote className="text-wisdom-medium mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                      <div>
                        <p className="text-lg italic mb-2">{quote.text}</p>
                        <p className="text-sm text-gray-600">— {quote.author}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <span className="text-xs text-gray-500">{quote.category}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="h-4 w-4 text-love-medium" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => toggleSave(quote.id)}
                      >
                        <Bookmark 
                          className={`h-4 w-4 ${savedItems.includes(quote.id) ? 'text-wisdom-medium fill-wisdom-medium' : 'text-gray-500'}`} 
                        />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="books" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {books.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col overflow-hidden">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img 
                      src={book.coverUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardContent className="pt-4 flex-grow">
                    <h3 className="font-medium text-lg">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <p className="text-sm text-gray-700">{book.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <span className="text-xs text-gray-500">{book.category}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium">{book.rating}</span>
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="songs" className="mt-6">
          <div className="relative h-[500px] overflow-hidden rounded-xl mx-auto max-w-md">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhilosophyFeed;
