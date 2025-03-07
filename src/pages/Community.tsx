
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, TrendingUp, Users, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import CommunityForum from "@/components/CommunityForum";
import AICompanion from "@/components/AICompanion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Sample community categories
const categories = [
  { id: "long-term", name: "Long-term Love", count: 124 },
  { id: "communication", name: "Communication", count: 98 },
  { id: "long-distance", name: "Long Distance", count: 76 },
  { id: "self-love", name: "Self-Love", count: 65 },
  { id: "conflict", name: "Resolving Conflicts", count: 54 },
  { id: "philosophy", name: "Love Philosophy", count: 47 },
  { id: "traditions", name: "Romantic Traditions", count: 42 },
  { id: "healing", name: "Healing Together", count: 38 }
];

const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      {/* Main content */}
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-serif mb-3">Everlove Community</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Connect with others on the journey of authentic love.
              </p>
            </motion.div>
          </div>
          
          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search discussions, questions, and advice..."
                className="pl-12 py-6 pr-4 h-auto text-lg rounded-full border-gray-200 shadow-sm"
              />
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-love-dark" />
                  <span>Communities</span>
                </h3>
                
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
                
                <Button className="w-full mt-4 gap-1 bg-love-medium hover:bg-love-deep">
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </Button>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-love-dark" />
                  <span>Trending Topics</span>
                </h3>
                
                <div className="space-y-2">
                  {[
                    "Nurturing love languages",
                    "Mental health in relationships",
                    "Rebuilding trust after conflict",
                    "Digital-free date ideas",
                    "Finding balance in love"
                  ].map((topic, i) => (
                    <div key={i} className="text-sm px-3 py-2 rounded-lg bg-gray-50 text-gray-700">
                      #{topic.toLowerCase().replace(/\s+/g, '')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              <Tabs defaultValue="discussions" className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-gray-100/80">
                    <TabsTrigger value="discussions" className="data-[state=active]:bg-white">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Discussions
                    </TabsTrigger>
                    <TabsTrigger value="advice" className="data-[state=active]:bg-white">
                      <Users className="h-4 w-4 mr-2" />
                      Advice
                    </TabsTrigger>
                  </TabsList>
                  
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
                
                <TabsContent value="discussions" className="mt-0">
                  <CommunityForum />
                </TabsContent>
                
                <TabsContent value="advice" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                    <h3 className="text-xl font-medium mb-3">Advice Section Coming Soon</h3>
                    <p className="text-gray-600">
                      Our dedicated advice section with relationship experts is currently under development.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      {/* AI Companion */}
      <AICompanion />
    </div>
  );
};

export default Community;
