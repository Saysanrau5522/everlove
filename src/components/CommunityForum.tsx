import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { MessageSquare, Heart, ArrowUp, ArrowDown, Share2, BookmarkPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample forum posts
const forumPosts = [
  {
    id: 1,
    title: "How do you keep the spark in a long-term relationship?",
    author: "RomanticSoul",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    content: "We've been together for 5 years, and while I still love my partner deeply, I feel like we've fallen into a routine. What are your tips for keeping the relationship exciting and fresh?",
    score: 42,
    comments: 18,
    tags: ["Long-term", "Advice"],
    timeAgo: "2 hours ago",
    community: "RelationshipAdvice"
  },
  {
    id: 2,
    title: "Reconnecting after a period of distance",
    author: "HopefulHeart",
    authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    content: "My partner and I have been physically separated due to work for the past 3 months. We're finally reuniting next week. Any advice on how to reconnect emotionally after being apart for so long?",
    score: 36,
    comments: 24,
    tags: ["Long-distance", "Reunion"],
    timeAgo: "5 hours ago",
    community: "LongDistance"
  },
  {
    id: 3,
    title: "The beauty of handwritten letters in the digital age",
    author: "OldSoulLover",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    content: "I recently started exchanging handwritten letters with my partner even though we live together. The anticipation and the effort put into each letter has added a beautiful dimension to our relationship. Has anyone else tried this?",
    score: 67,
    comments: 31,
    tags: ["Letters", "Tradition"],
    timeAgo: "1 day ago",
    community: "LoveLanguages"
  }
];

const CommunityForum = () => {
  const [posts, setPosts] = useState(forumPosts);
  const [votedPosts, setVotedPosts] = useState<{[key: number]: 'up' | 'down' | null}>({});
  
  const handleVote = (id: number, direction: 'up' | 'down') => {
    // Update the UI state for votes
    setVotedPosts(prev => {
      const currentVote = prev[id];
      
      // If same vote type, remove the vote
      if (currentVote === direction) {
        const newVotes = {...prev};
        delete newVotes[id];
        return newVotes;
      }
      
      // Otherwise set the new vote
      return {...prev, [id]: direction};
    });
    
    // Update post scores
    setPosts(posts.map(post => {
      if (post.id === id) {
        const currentVote = votedPosts[id];
        let scoreChange = 0;
        
        if (currentVote === 'up' && direction === 'down') {
          scoreChange = -2; // From upvote to downvote
        } else if (currentVote === 'down' && direction === 'up') {
          scoreChange = 2; // From downvote to upvote
        } else if (currentVote === null) {
          scoreChange = direction === 'up' ? 1 : -1;
        } else if (currentVote === direction) {
          scoreChange = direction === 'up' ? -1 : 1; // Removing vote
        }
        
        return {...post, score: post.score + scoreChange};
      }
      return post;
    }));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif">Popular Discussions</h2>
        <Badge className="bg-love-medium hover:bg-love-deep px-3 py-1 flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>Communities</span>
        </Badge>
      </div>
      
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border border-gray-100 hover:border-gray-200 bg-white">
              {/* Top section with community and author info */}
              <div className="px-3 pt-3 pb-1 flex items-center text-xs text-gray-500">
                <Badge variant="outline" className="mr-2 font-normal bg-gray-50">
                  r/{post.community}
                </Badge>
                <div className="flex items-center">
                  <span>Posted by u/{post.author}</span>
                  <span className="mx-1">•</span>
                  <span>{post.timeAgo}</span>
                </div>
              </div>
              
              {/* Post title and content */}
              <div className="px-3 py-2">
                <h3 className="text-base font-medium mb-2">{post.title}</h3>
                <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                  {post.content}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-1">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Post actions */}
              <div className="flex items-center px-2 py-1 border-t border-gray-100 bg-gray-50/50 text-xs">
                {/* Voting */}
                <div className="flex items-center mr-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => handleVote(post.id, 'up')}
                  >
                    <ArrowUp className={`h-4 w-4 ${votedPosts[post.id] === 'up' ? 'text-love-deep fill-love-deep' : 'text-gray-500'}`} />
                  </Button>
                  
                  <span className="mx-1 font-medium">{post.score}</span>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => handleVote(post.id, 'down')}
                  >
                    <ArrowDown className={`h-4 w-4 ${votedPosts[post.id] === 'down' ? 'text-gray-700 fill-gray-700' : 'text-gray-500'}`} />
                  </Button>
                </div>
                
                {/* Comments */}
                <Button variant="ghost" size="sm" className="text-gray-600 h-7 px-2">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{post.comments} comments</span>
                </Button>
                
                {/* Share */}
                <Button variant="ghost" size="sm" className="text-gray-600 h-7 px-2 ml-1">
                  <Share2 className="h-4 w-4 mr-1" />
                  <span>Share</span>
                </Button>
                
                {/* Save */}
                <Button variant="ghost" size="sm" className="text-gray-600 h-7 px-2 ml-auto">
                  <BookmarkPlus className="h-4 w-4 mr-1" />
                  <span>Save</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-center pt-4">
        <Button variant="outline" size="sm" className="text-sm">
          View more posts
        </Button>
      </div>
    </div>
  );
};

export default CommunityForum;
