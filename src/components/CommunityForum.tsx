
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Share2, BookmarkPlus, Users } from 'lucide-react';

// Sample forum posts
const forumPosts = [
  {
    id: 1,
    title: "How do you keep the spark in a long-term relationship?",
    author: "RomanticSoul",
    content: "We've been together for 5 years, and while I still love my partner deeply, I feel like we've fallen into a routine. What are your tips for keeping the relationship exciting and fresh?",
    likes: 42,
    comments: 18,
    tags: ["Long-term", "Advice"],
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    title: "Reconnecting after a period of distance",
    author: "HopefulHeart",
    content: "My partner and I have been physically separated due to work for the past 3 months. We're finally reuniting next week. Any advice on how to reconnect emotionally after being apart for so long?",
    likes: 36,
    comments: 24,
    tags: ["Long-distance", "Reunion"],
    timeAgo: "5 hours ago"
  },
  {
    id: 3,
    title: "The beauty of handwritten letters in the digital age",
    author: "OldSoulLover",
    content: "I recently started exchanging handwritten letters with my partner even though we live together. The anticipation and the effort put into each letter has added a beautiful dimension to our relationship. Has anyone else tried this?",
    likes: 67,
    comments: 31,
    tags: ["Letters", "Tradition"],
    timeAgo: "1 day ago"
  }
];

const CommunityForum = () => {
  const [posts, setPosts] = useState(forumPosts);
  
  const handleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? {...post, likes: post.likes + 1} : post
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif">Community Discussions</h2>
        <Badge className="bg-love-medium hover:bg-love-deep px-3 py-1 flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>Active Communities</span>
        </Badge>
      </div>
      
      <div className="space-y-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-medium">{post.title}</h3>
                  <div className="flex space-x-1">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium text-gray-700">{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.timeAgo}</span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {post.content}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-love-dark transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments} comments</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <BookmarkPlus className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;
