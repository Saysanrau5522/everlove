
import { motion } from "framer-motion";
import { Book, Music, Quote, Heart, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

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
    title: "All of Me",
    artist: "John Legend",
    album: "Love in the Future",
    duration: "4:30",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/b/b5/John_Legend_-_Love_in_the_Future.png",
    genre: "R&B/Soul",
  },
  {
    id: 2,
    title: "At Last",
    artist: "Etta James",
    album: "At Last!",
    duration: "3:02",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/3/35/At_Last%21_%28Etta_James_album%29.jpg",
    genre: "Blues",
  },
  {
    id: 3,
    title: "Make You Feel My Love",
    artist: "Adele",
    album: "19",
    duration: "3:32",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/1/1d/Adele_-_19.png",
    genre: "Soul",
  },
];

const PhilosophyFeed = () => {
  const [activeTab, setActiveTab] = useState("quotes");
  const [savedItems, setSavedItems] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(itemId => itemId !== id));
    } else {
      setSavedItems([...savedItems, id]);
    }
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
          <div className="grid gap-4 md:grid-cols-2">
            {songs.map((song) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={song.coverUrl} 
                        alt={song.album} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col p-4">
                      <div className="flex-grow">
                        <h3 className="font-medium">{song.title}</h3>
                        <p className="text-sm text-gray-600">{song.artist}</p>
                        <p className="text-xs text-gray-500 mt-1">{song.album}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{song.genre}</span>
                        <span className="text-xs text-gray-500">{song.duration}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhilosophyFeed;
