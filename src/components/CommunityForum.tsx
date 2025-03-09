
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Heart, ArrowUp, ArrowDown, Share2, BookmarkPlus, Users, Plus, Filter, Sparkles, Star, TrendingUp, Clock, Search } from 'lucide-react';

// Sample forum posts
const initialForumPosts = [
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

// Sample communities
const communities = [
  { id: 1, name: "RelationshipAdvice", memberCount: 15432 },
  { id: 2, name: "LongDistance", memberCount: 8761 },
  { id: 3, name: "LoveLanguages", memberCount: 12089 },
  { id: 4, name: "Dating", memberCount: 23567 },
  { id: 5, name: "Marriage", memberCount: 9823 }
];

const CommunityForum = () => {
  const [posts, setPosts] = useState(initialForumPosts);
  const [votedPosts, setVotedPosts] = useState<{[key: number]: 'up' | 'down' | null}>({});
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('trending');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCommunity, setNewPostCommunity] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  
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
  
  const handleSavePost = (id: number) => {
    setSavedPosts(prev => 
      prev.includes(id) 
        ? prev.filter(postId => postId !== id) 
        : [...prev, id]
    );
  };
  
  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCommunity) return;
    
    const newPost = {
      id: posts.length + 1,
      title: newPostTitle,
      author: "CurrentUser", // In a real app, this would be the logged-in user
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: newPostContent,
      score: 1,
      comments: 0,
      tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      timeAgo: "Just now",
      community: newPostCommunity
    };
    
    setPosts([newPost, ...posts]);
    
    // Reset form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags('');
    setNewPostCommunity('');
  };
  
  // Filter posts based on search query and selected community
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery 
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCommunity = selectedCommunity 
      ? post.community === selectedCommunity
      : true;
      
    return matchesSearch && matchesCommunity;
  });
  
  // Sort posts based on active filter
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeFilter === 'trending') return b.score - a.score;
    if (activeFilter === 'new') {
      return a.timeAgo.includes('Just now') ? -1 : 
             b.timeAgo.includes('Just now') ? 1 :
             a.timeAgo.includes('hour') && b.timeAgo.includes('day') ? -1 :
             b.timeAgo.includes('hour') && a.timeAgo.includes('day') ? 1 :
             0;
    }
    return 0;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        <div className="w-full md:w-3/4 space-y-4">
          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search discussions..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-love-medium hover:bg-love-deep gap-2">
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new post</DialogTitle>
                  <DialogDescription>
                    Share your thoughts, questions, or experiences with the community.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Title" 
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="What's on your mind?" 
                      className="min-h-[120px]"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Select value={newPostCommunity} onValueChange={setNewPostCommunity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a community" />
                      </SelectTrigger>
                      <SelectContent>
                        {communities.map(community => (
                          <SelectItem key={community.id} value={community.name}>
                            r/{community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Tags (comma separated)" 
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreatePost}>Post</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Filter tabs */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="trending" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>New</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>Saved</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="space-y-4 mt-4">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    index={index}
                    votedPosts={votedPosts}
                    savedPosts={savedPosts}
                    onVote={handleVote}
                    onSave={handleSavePost}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="new" className="space-y-4 mt-4">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    index={index}
                    votedPosts={votedPosts}
                    savedPosts={savedPosts}
                    onVote={handleVote}
                    onSave={handleSavePost}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4 mt-4">
              {posts.filter(post => savedPosts.includes(post.id)).length > 0 ? (
                posts
                  .filter(post => savedPosts.includes(post.id))
                  .map((post, index) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      index={index}
                      votedPosts={votedPosts}
                      savedPosts={savedPosts}
                      onVote={handleVote}
                      onSave={handleSavePost}
                    />
                  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't saved any posts yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center pt-4">
            <Button variant="outline" size="sm" className="text-sm">
              Load more
            </Button>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-4">
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-love-light/20">
              <h3 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Communities</span>
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`w-full justify-start text-left ${selectedCommunity === null ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedCommunity(null)}
              >
                All Communities
              </Button>
              {communities.map(community => (
                <Button 
                  key={community.id} 
                  variant="ghost" 
                  size="sm" 
                  className={`w-full justify-start text-left ${selectedCommunity === community.name ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedCommunity(community.name)}
                >
                  <span>r/{community.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{community.memberCount.toLocaleString()}</span>
                </Button>
              ))}
            </div>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-love-light/20">
              <h3 className="font-medium">About</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">
                A supportive community for discussions about relationships, love, and personal growth.
              </p>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Create Community
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Post card component
const PostCard = ({ 
  post, 
  index, 
  votedPosts, 
  savedPosts,
  onVote, 
  onSave 
}: { 
  post: any, 
  index: number,
  votedPosts: {[key: number]: 'up' | 'down' | null},
  savedPosts: number[],
  onVote: (id: number, direction: 'up' | 'down') => void,
  onSave: (id: number) => void
}) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
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
            <Avatar className="h-5 w-5 mr-1">
              <img src={post.authorAvatar} alt={post.author} />
            </Avatar>
            <span>Posted by u/{post.author}</span>
            <span className="mx-1">•</span>
            <span>{post.timeAgo}</span>
          </div>
        </div>
        
        {/* Post title and content */}
        <div className="px-3 py-2">
          <h3 className="text-base font-medium mb-2">{post.title}</h3>
          <p className={`text-gray-700 text-sm mb-2 ${expanded ? '' : 'line-clamp-3'}`}>
            {post.content}
          </p>
          
          {post.content.length > 150 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs p-0 h-auto text-gray-500"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Read less' : 'Read more'}
            </Button>
          )}
          
          <div className="flex flex-wrap gap-1 mb-1">
            {post.tags.map((tag: string) => (
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
              onClick={() => onVote(post.id, 'up')}
            >
              <ArrowUp className={`h-4 w-4 ${votedPosts[post.id] === 'up' ? 'text-love-deep fill-love-deep' : 'text-gray-500'}`} />
            </Button>
            
            <span className="mx-1 font-medium">{post.score}</span>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => onVote(post.id, 'down')}
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 h-7 px-2 ml-auto"
            onClick={() => onSave(post.id)}
          >
            <BookmarkPlus className={`h-4 w-4 mr-1 ${savedPosts.includes(post.id) ? 'text-love-deep fill-love-deep' : ''}`} />
            <span>{savedPosts.includes(post.id) ? 'Saved' : 'Save'}</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CommunityForum;
