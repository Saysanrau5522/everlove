
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, BookmarkPlus, MessageCircle, Share2, BookOpen, Search, Quote, Music, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Sample philosophy quotes
const quotes = [
  {
    id: 1,
    quote: "Love is not about possession. It's about appreciation.",
    author: "Osho",
    type: "philosophy",
    likes: 342,
    comments: 18,
    timestamp: "2h ago",
    authorImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    source: "The Art of Living and Loving"
  },
  {
    id: 2,
    quote: "The greatest happiness of life is the conviction that we are loved; loved for ourselves, or rather, loved in spite of ourselves.",
    author: "Victor Hugo",
    type: "classic",
    likes: 278,
    comments: 24,
    timestamp: "5h ago",
    authorImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    source: "Les Misérables"
  },
  {
    id: 3,
    quote: "Love is a choice you make from moment to moment.",
    author: "Barbara De Angelis",
    type: "advice",
    likes: 195,
    comments: 11,
    timestamp: "1d ago",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    imageUrl: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    source: "Real Moments"
  }
];

// Sample books
const books = [
  {
    id: 1,
    title: "The 5 Love Languages",
    author: "Gary Chapman",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "How to express heartfelt commitment to your mate.",
    tags: ["Relationship", "Communication"],
    likes: 423
  },
  {
    id: 2,
    title: "Attached",
    author: "Amir Levine & Rachel Heller",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "The science of adult attachment and how it can help you find and keep love.",
    tags: ["Psychology", "Attachment"],
    likes: 387
  },
  {
    id: 3,
    title: "All About Love",
    author: "bell hooks",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "New visions on the meaning of love in today's world.",
    tags: ["Cultural", "Philosophy"],
    likes: 312
  }
];

// Sample songs
const songs = [
  {
    id: 1,
    title: "Can't Help Falling in Love",
    artist: "Elvis Presley",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    year: "1961",
    tags: ["Classic", "Romantic"],
    likes: 512
  },
  {
    id: 2,
    title: "At Last",
    artist: "Etta James",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    year: "1960",
    tags: ["Jazz", "Soul"],
    likes: 478
  },
  {
    id: 3,
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    year: "2014",
    tags: ["Pop", "Contemporary"],
    likes: 423
  }
];

const PhilosophyFeed = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('quotes');
  
  const handleLike = (id: number) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };
  
  const handleSave = (id: number) => {
    if (savedPosts.includes(id)) {
      setSavedPosts(savedPosts.filter(postId => postId !== id));
    } else {
      setSavedPosts([...savedPosts, id]);
    }
  };
  
  return (
    <div className="space-y-6 mb-20 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif">Wisdom & Reflections</h2>
        <Badge className="bg-love-light text-love-dark px-3 py-1 flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          <span>Library</span>
        </Badge>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search the library..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="quotes" className="flex items-center gap-1">
            <Quote className="h-4 w-4" />
            <span>Quotes</span>
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Books</span>
          </TabsTrigger>
          <TabsTrigger value="songs" className="flex items-center gap-1">
            <Music className="h-4 w-4" />
            <span>Songs</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Quotes Tab */}
        <TabsContent value="quotes" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border border-gray-100 bg-white h-full flex flex-col">
                  {/* Quote image with overlay */}
                  <div className="relative aspect-square bg-gray-100">
                    <img 
                      src={post.imageUrl} 
                      alt={post.quote} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="p-6 md:p-8 text-center">
                        <p className="text-white font-serif text-lg md:text-xl italic leading-relaxed drop-shadow-md">
                          "{post.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote details */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-sm text-gray-500">{post.source}</p>
                      </div>
                      <Badge variant="outline" className="text-xs font-normal">
                        #{post.type}
                      </Badge>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart 
                            className={`h-5 w-5 ${likedPosts.includes(post.id) ? 'text-love-deep fill-love-deep' : 'text-gray-700'}`} 
                          />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-5 w-5 text-gray-700" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleSave(post.id)}
                      >
                        <BookmarkPlus 
                          className={`h-5 w-5 ${savedPosts.includes(post.id) ? 'text-love-dark fill-love-dark' : 'text-gray-700'}`} 
                        />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        {/* Books Tab */}
        <TabsContent value="books" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border border-gray-100 bg-white h-full flex flex-col">
                  <div className="flex p-4 gap-4">
                    <div className="w-24 h-32 flex-shrink-0 rounded overflow-hidden shadow-md">
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{book.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {book.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto p-4 pt-2 border-t flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleLike(book.id)}
                      >
                        <Heart 
                          className={`h-5 w-5 ${likedPosts.includes(book.id) ? 'text-love-deep fill-love-deep' : 'text-gray-700'}`} 
                        />
                      </Button>
                      <span className="text-sm text-gray-500 self-center">{book.likes + (likedPosts.includes(book.id) ? 1 : 0)}</span>
                    </div>
                    
                    <Button variant="outline" size="sm" className="text-xs px-3">
                      Read More
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        {/* Songs Tab */}
        <TabsContent value="songs" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border border-gray-100 bg-white h-full flex flex-col">
                  <div className="relative aspect-video">
                    <img 
                      src={song.image} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h3 className="font-medium text-lg">{song.title}</h3>
                        <p className="text-gray-200">{song.artist} · {song.year}</p>
                      </div>
                    </div>
                    <Button 
                      className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 h-9 w-9 p-0"
                    >
                      <Music className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {song.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleLike(song.id)}
                      >
                        <Heart 
                          className={`h-5 w-5 ${likedPosts.includes(song.id) ? 'text-love-deep fill-love-deep' : 'text-gray-700'}`} 
                        />
                      </Button>
                      <span className="text-sm text-gray-500 self-center">{song.likes + (likedPosts.includes(song.id) ? 1 : 0)}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button className="bg-transparent hover:bg-love-light/20 text-love-dark border border-love-medium/30 rounded-full px-6 gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Discover more wisdom</span>
        </Button>
      </div>
    </div>
  );
};

export default PhilosophyFeed;
