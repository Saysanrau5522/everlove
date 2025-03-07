
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Heart, Mail, Settings, Clock, Image, Edit } from "lucide-react";
import AICompanion from "@/components/AICompanion";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Sample user data
  const user = {
    name: "Jessica Chen",
    username: "jessc",
    bio: "Exploring the depths of authentic connection. Lover of poetry, autumn walks, and meaningful conversations.",
    joined: "March 2025",
    lettersSent: 47,
    lettersReceived: 52,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      {/* Main content */}
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="p-6 md:p-8 border-gray-100 overflow-hidden relative bg-white/70 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-love-light/50 to-love-medium/30" />
              
              <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <img src={user.avatar} alt={user.name} className="object-cover" />
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl font-serif mb-1">{user.name}</h1>
                      <p className="text-gray-500 text-sm">@{user.username}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex justify-center md:justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </Button>
                      <Button size="sm" className="gap-1 bg-love-medium hover:bg-love-deep">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="my-4 text-gray-700">{user.bio}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Joined {user.joined}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-love-dark" />
                      <span>{user.lettersSent} letters sent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-love-dark" />
                      <span>{user.lettersReceived} letters received</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Profile content */}
          <Tabs defaultValue="letters" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="letters">
                <Mail className="h-4 w-4 mr-2" />
                <span>Letters</span>
              </TabsTrigger>
              <TabsTrigger value="moments">
                <Image className="h-4 w-4 mr-2" />
                <span>Moments</span>
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Heart className="h-4 w-4 mr-2" />
                <span>Saved</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="letters" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="border-gray-100 p-6 bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-love-medium" />
                          <span className="text-sm text-gray-500">March {i + 10}, 2025</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <h3 className="font-serif text-lg mb-2">
                        {["Thoughts on our journey", "Remember when", "A moment of gratitude", "Looking forward"][i-1]}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. 
                        Cras porttitor metus justo, vitae fringilla nibh blandit id...
                      </p>
                      
                      <Button variant="ghost" size="sm" className="mt-4 text-love-dark">
                        Read letter
                      </Button>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" className="border-love-medium/30 text-love-dark">
                    Load more letters
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="moments" className="mt-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <h3 className="text-xl font-medium mb-3">Memories Coming Soon</h3>
                <p className="text-gray-600">
                  We're working on a beautiful way to capture your relationship memories and milestones.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <h3 className="text-xl font-medium mb-3">Your Saved Collection</h3>
                <p className="text-gray-600">
                  You haven't saved any letters or wisdom yet. Heart the content you love to find it here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* AI Companion */}
      <AICompanion />
    </div>
  );
};

export default Profile;
