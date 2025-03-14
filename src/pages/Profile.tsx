
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { 
  Heart, Mail, Settings, Clock, Image, Edit, 
  ArrowLeft, Grid, Bookmark, Music, Book, Quote, Moon, Sun
} from "lucide-react";
import AICompanion from "@/components/AICompanion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useLetters } from "@/hooks/use-letters";
import ProfileLetterCard from "@/components/ProfileLetterCard";
import LikedContent from "@/components/LikedContent";
import SavedContent from "@/components/SavedContent";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("letters");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { letters, loading: lettersLoading } = useLetters();
  const [profileData, setProfileData] = useState({
    full_name: "",
    username: "",
    bio: "",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    joined: ""
  });

  const form = useForm({
    defaultValues: {
      full_name: profileData.full_name,
      username: profileData.username,
      bio: profileData.bio,
    }
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    } else {
      navigate('/auth');
    }
  }, [user]);

  useEffect(() => {
    // Update form default values when profileData changes
    form.reset({
      full_name: profileData.full_name,
      username: profileData.username,
      bio: profileData.bio,
    });
  }, [profileData]);

  useEffect(() => {
    // Apply dark mode class to the body element
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const fetchProfileData = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Format date from created_at in "Month Year" format
        const createdAt = new Date(data.created_at);
        const joinedDate = createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        setProfileData({
          full_name: data.full_name || "",
          username: data.username || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
          joined: joinedDate
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Failed to load profile",
        description: "Please try again later."
      });
    }
  };

  const handleSaveProfile = async (formData: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      setProfileData({
        ...profileData,
        full_name: formData.full_name,
        username: formData.username,
        bio: formData.bio
      });
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message || "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Store preference in localStorage
    localStorage.setItem("darkMode", !darkMode ? "true" : "false");
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white md:bg-gradient-to-b md:from-white md:to-gray-50'}`}>
      <Header />
      
      {/* Dark mode toggle */}
      <div className="fixed top-20 right-4 z-50">
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md">
          <Sun className={`h-4 w-4 ${!darkMode ? 'text-yellow-500' : 'text-gray-400'}`} />
          <Switch 
            checked={darkMode} 
            onCheckedChange={toggleDarkMode} 
            className={darkMode ? 'data-[state=checked]:bg-blue-600' : ''}
          />
          <Moon className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-30 pt-safe-top border-b dark:border-gray-800">
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-medium">Profile</h1>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsEditing(!isEditing)}>
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
            <Card className={`p-4 md:p-8 border-0 md:border-gray-100 rounded-none md:rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-none md:shadow-sm`}>
              {!isEditing ? (
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white dark:border-gray-700 shadow-md">
                    <img src={profileData.avatar_url} alt={profileData.full_name} className="object-cover" />
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-xl md:text-2xl font-serif mb-1">{profileData.full_name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">@{profileData.username}</p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex justify-center md:justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`gap-1 rounded-lg ${darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </Button>
                      </div>
                    </div>
                    
                    <p className={`my-4 text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{profileData.bio}</p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-400 dark:text-gray-500" />
                        <span>Joined {profileData.joined}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 md:h-4 md:w-4 text-love-dark dark:text-love-medium" />
                        <span>{letters?.length || 0} letters sent</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 md:h-4 md:w-4 text-love-dark dark:text-love-medium" />
                        <span>0 letters received</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                      <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white dark:border-gray-700 shadow-md mb-4">
                        <img src={profileData.avatar_url} alt={profileData.full_name} className="object-cover" />
                      </Avatar>
                      <Button variant="outline" size="sm" className="gap-1 rounded-lg">
                        <Image className="h-4 w-4" />
                        <span>Change Photo</span>
                      </Button>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="dark:bg-gray-700 dark:border-gray-600" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="dark:bg-gray-700 dark:border-gray-600" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600" 
                              placeholder="Tell us about yourself..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className={darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className={`${darkMode ? 'bg-love-dark hover:bg-love-deep' : 'bg-love-medium hover:bg-love-deep'}`}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </Card>
          </motion.div>
          
          {/* Profile content */}
          <Tabs defaultValue="letters" className="mb-8">
            <TabsList className={`w-full justify-around md:justify-start border-b ${darkMode ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-transparent'} h-12 p-0 rounded-none`}>
              <TabsTrigger 
                value="letters" 
                className={`flex-1 md:flex-initial data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-love-dark rounded-none ${darkMode ? 'text-gray-300' : ''}`}
              >
                <Mail className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">Letters</span>
              </TabsTrigger>
              <TabsTrigger 
                value="liked" 
                className={`flex-1 md:flex-initial data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-love-dark rounded-none ${darkMode ? 'text-gray-300' : ''}`}
              >
                <Heart className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">Liked</span>
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className={`flex-1 md:flex-initial data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-love-dark rounded-none ${darkMode ? 'text-gray-300' : ''}`}
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
                {lettersLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-2 border-love-medium border-t-transparent rounded-full"></div>
                  </div>
                ) : letters && letters.length > 0 ? (
                  <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                    {letters.map(letter => (
                      <ProfileLetterCard key={letter.id} letter={letter} isDarkMode={darkMode} />
                    ))}
                  </div>
                ) : (
                  <div className={`bg-white ${darkMode ? 'bg-gray-800 border-gray-700' : ''} rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 text-center`}>
                    <h3 className="text-lg md:text-xl font-medium mb-3">No Letters Yet</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base mb-4`}>
                      You haven't written any letters yet. Start writing and connecting with others.
                    </p>
                    <Button 
                      onClick={() => navigate('/letters')}
                      className={`${darkMode ? 'bg-love-dark hover:bg-love-deep' : 'bg-love-medium hover:bg-love-deep'} text-white`}
                    >
                      Write a Letter
                    </Button>
                  </div>
                )}
                
                {letters && letters.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      variant="outline" 
                      className={`${darkMode ? 'border-love-dark/50 text-love-medium' : 'border-love-medium/30 text-love-dark'} text-sm rounded-full`}
                    >
                      Load more letters
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="liked" className="mt-4">
              <LikedContent isDarkMode={darkMode} />
            </TabsContent>
            
            <TabsContent value="saved" className="mt-4">
              <SavedContent isDarkMode={darkMode} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Mobile bottom navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} flex items-center justify-around px-6 pb-safe-bottom`}>
        <Button variant="ghost" size="sm" className="flex-col h-auto py-1" onClick={() => navigate('/')}>
          <Grid className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-col h-auto py-1" onClick={() => navigate('/letters')}>
          <Mail className="h-5 w-5" />
          <span className="text-xs mt-1">Letters</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex-col h-auto py-1 ${darkMode ? 'text-love-medium' : 'text-love-dark'}`}
          onClick={() => navigate('/profile')}
        >
          <Avatar className="h-7 w-7 border border-love-medium">
            <img src={profileData.avatar_url} alt={profileData.full_name} />
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
