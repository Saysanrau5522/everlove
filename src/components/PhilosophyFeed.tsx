
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Heart, BookmarkPlus, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';

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
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
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
    imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
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
    imageUrl: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const PhilosophyFeed = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  
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
    <div className="space-y-6 mb-20 max-w-lg mx-auto">
      <h2 className="text-2xl font-serif text-center mb-6">Wisdom & Reflections</h2>
      
      <div className="space-y-6">
        {quotes.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border border-gray-100 bg-white">
              {/* Post header */}
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-gray-100">
                    <img src={post.authorImage} alt={post.author} className="object-cover" />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
              
              {/* Post image */}
              <div className="relative aspect-square bg-gray-100">
                <img 
                  src={post.imageUrl} 
                  alt={post.quote} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="p-6 md:p-10 text-center">
                    <p className="text-white font-serif text-lg md:text-xl italic leading-relaxed drop-shadow-md">
                      "{post.quote}"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Post actions */}
              <div className="p-3">
                <div className="flex justify-between mb-2">
                  <div className="flex gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9" 
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart 
                        className={`h-6 w-6 ${likedPosts.includes(post.id) ? 'text-love-deep fill-love-deep' : 'text-gray-700'}`} 
                      />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MessageCircle className="h-6 w-6 text-gray-700" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Share2 className="h-6 w-6 text-gray-700" />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9" 
                    onClick={() => handleSave(post.id)}
                  >
                    <BookmarkPlus 
                      className={`h-6 w-6 ${savedPosts.includes(post.id) ? 'text-love-dark fill-love-dark' : 'text-gray-700'}`} 
                    />
                  </Button>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)} likes</p>
                  <p className="text-gray-500 mt-1">View all {post.comments} comments</p>
                </div>
                
                <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-full mr-2">
                    #{post.type}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button className="bg-transparent hover:bg-love-light/20 text-love-dark border border-love-medium/30 rounded-full px-6">
          Explore more wisdom
        </Button>
      </div>
    </div>
  );
};

export default PhilosophyFeed;
