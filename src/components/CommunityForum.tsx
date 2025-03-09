
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Heart, ThumbsUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

const CommunityForum = () => {
  const [activeTab, setActiveTab] = useState("popular");
  const { user } = useAuth();
  
  // Sample forum posts data
  const forumPosts = [
    {
      id: 1,
      author: "Alex",
      avatar: "/placeholder.svg",
      title: "Maintaining connection in a long-distance relationship",
      content: "My partner and I will be apart for 6 months due to work. Any advice on how to keep our connection strong despite the distance?",
      tags: ["Long Distance", "Communication"],
      likes: 42,
      comments: 15,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      author: "Jamie",
      avatar: "/placeholder.svg",
      title: "How to express love to someone with a different love language?",
      content: "I recently discovered that my partner's primary love language is acts of service, while mine is words of affirmation. I'm looking for creative ways to show love in their language.",
      tags: ["Love Languages", "Relationship Growth"],
      likes: 36,
      comments: 22,
      timeAgo: "5 hours ago"
    },
    {
      id: 3,
      author: "Taylor",
      avatar: "/placeholder.svg",
      title: "Rekindling romance after many years together",
      content: "We've been together for 12 years, and while our relationship is strong, we'd like to bring back some of the romance and excitement. Any suggestions?",
      tags: ["Long Term", "Romance"],
      likes: 89,
      comments: 41,
      timeAgo: "1 day ago"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-serif mb-4">Community Forum</h2>
        <p className="text-gray-600 mb-6">
          Connect with others on their journey of love and share experiences.
        </p>
        
        {/* Tabs */}
        <Tabs defaultValue="popular" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter size={14} />
                <span>Filter</span>
              </Button>
              
              <Button className="bg-love-medium hover:bg-love-deep">
                Create Post
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <Input placeholder="Search discussions..." className="w-full" />
          </div>
          
          {/* Content for tabs */}
          <TabsContent value="popular" className="space-y-6">
            {forumPosts.map(post => (
              <ForumPost key={post.id} post={post} />
            ))}
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-6">
            {/* Recent posts would be loaded here */}
            <p className="text-center py-10 text-gray-500">Loading recent discussions...</p>
          </TabsContent>
          
          <TabsContent value="unanswered" className="space-y-6">
            {/* Unanswered posts would be loaded here */}
            <p className="text-center py-10 text-gray-500">Loading unanswered discussions...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Forum post component
const ForumPost = ({ post }) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border">
          <img src={post.avatar} alt={post.author} />
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg mb-1">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-1">
                Posted by {post.author} • {post.timeAgo}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 my-3">{post.content}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" className="bg-gray-50">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-4 text-gray-500">
            <button className="flex items-center gap-1 hover:text-love-deep transition-colors">
              <ThumbsUp size={16} />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-love-deep transition-colors">
              <MessageSquare size={16} />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-love-deep transition-colors">
              <Heart size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommunityForum;
