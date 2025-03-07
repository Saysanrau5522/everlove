
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Heart, Mail, Settings, Clock, Image, Edit, ArrowLeft, Grid, Bookmark } from "lucide-react";
import AICompanion from "@/components/AICompanion";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("letters");
  
  // Sample user data
  const user = {
    name: "Jessica Chen",
    username: "jessc",
    bio: "Exploring the depths of authentic connection. Lover of poetry, autumn walks, and meaningful conversations.",
    joined: "March 2023",
    lettersSent: 47,
    lettersReceived: 52,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
  };

  return (
    <div className="min-h-screen bg-white md:bg-gradient-to-b md:from-white md:to-gray-50">
      <Header />
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-30 pt-safe-top border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-medium">Profile</h1>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <main className="pt-14 md:pt-24 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-0 md:px-4">
          {/* Profile header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-8"
          >
            <Card className="p-4 md:p-8 border-0 md:border-gray-100 rounded-none md:rounded-lg bg-white shadow-none md:shadow-sm">              
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-md">
                  <img src={user.avatar} alt={user.name} className="object-cover" />
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-xl md:text-2xl font-serif mb-1">{user.name}</h1>
                      <p className="text-gray-500 text-sm">@{user.username}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex justify-center md:justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1 rounded-lg">
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </Button>
                    </div>
                  </div>
                  
                  <p className="my-4 text-sm md:text-base text-gray-700">{user.bio}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                      <span>Joined {user.joined}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 md:h-4 md:w-4 text-love-dark" />
                      <span>{user.lettersSent} letters sent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 md:h-4 md:w-4 text-love-dark" />
                      <span>{user.lettersReceived} letters received</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Profile content */}
          <Tabs defaultValue="letters" className="mb-8">
            <TabsList className="w-full justify-around md:justify-start border-b border-gray-200 bg-transparent h-12 p-0 rounded-none">
              <TabsTrigger 
                value="letters" 
                className="flex-1 md:flex-initial data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-love-dark rounded-none"
              >
                <Mail className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">Letters</span>
              </TabsTrigger>
              <TabsTrigger 
                value="moments" 
                className="flex-1 md:flex-initial data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-love-dark rounded-none"
              >
                <Grid className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">Moments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex-1 md:flex-initial data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-love-dark rounded-none"
              >
                <Bookmark className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">Saved</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="letters" className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="border-gray-100 p-4 md:p-6 bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-love-medium" />
                          <span className="text-xs md:text-sm text-gray-500">March {i + 10}, 2023</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <h3 className="font-serif text-base md:text-lg mb-2">
                        {["Thoughts on our journey", "Remember when", "A moment of gratitude", "Looking forward"][i-1]}
                      </h3>
                      
                      <p className="text-gray-600 text-xs md:text-sm line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. 
                        Cras porttitor metus justo, vitae fringilla nibh blandit id...
                      </p>
                      
                      <Button variant="ghost" size="sm" className="mt-3 text-love-dark text-xs md:text-sm px-0 h-8">
                        Read letter
                      </Button>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="border-love-medium/30 text-love-dark text-sm rounded-full">
                    Load more letters
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="moments" className="mt-4">
              <div className="grid grid-cols-3 gap-1 md:gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                  <div key={i} className="aspect-square bg-gray-100 relative rounded-sm md:rounded-md overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-152933316${i}437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`} 
                      alt={`Moment ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="border-love-medium/30 text-love-dark text-sm rounded-full">
                  Load more moments
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 text-center">
                <h3 className="text-lg md:text-xl font-medium mb-3">Your Saved Collection</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  You haven't saved any letters or wisdom yet. Heart the content you love to find it here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white flex items-center justify-around px-6 pb-safe-bottom">
        <Button variant="ghost" size="sm" className="flex-col h-auto py-1">
          <Grid className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-col h-auto py-1">
          <Mail className="h-5 w-5" />
          <span className="text-xs mt-1">Letters</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-col h-auto py-1 text-love-dark">
          <Avatar className="h-7 w-7 border border-love-medium">
            <img src={user.avatar} alt={user.name} />
          </Avatar>
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </div>
      
      {/* AI Companion - Only visible on desktop */}
      <div className="hidden md:block">
        <AICompanion />
      </div>
    </div>
  );
};

export default Profile;
