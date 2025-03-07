
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Clock, Heart, Search, FilterIcon, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import LetterBox from "@/components/LetterBox";
import LetterTemplate from "@/components/LetterTemplate";
import AICompanion from "@/components/AICompanion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Initial sample received letters
const initialLetters = [
  {
    id: 1,
    sender: "Sarah",
    content: "My dearest, I found myself thinking about you today as the rain fell outside my window. There's something about the gentle patter that reminds me of the rhythm of your voice—steady, comforting, and full of warmth. I miss our conversations that stretch into the night, where time seems to stand still...",
    date: new Date(Date.now() - 86400000), // yesterday
    read: true
  },
  {
    id: 2,
    sender: "Sarah",
    content: "As the morning sun filtered through my curtains today, I was reminded of the light you bring into my life. Every day with you feels like a new beginning, a fresh chance to create beautiful memories together. I'm counting the moments until I see you again...",
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    read: false
  },
  {
    id: 3,
    sender: "Sarah",
    content: "I visited that little bookshop we discovered together last summer. The owner asked about you—it seems you left quite an impression with your passionate discussion about classic literature. I picked up a copy of that poetry book you've been wanting. Consider it an early surprise for our anniversary next month...",
    date: new Date(Date.now() - 86400000 * 7), // a week ago
    read: true
  }
];

const Letters = () => {
  const [recipient] = useState("Sarah");
  const [activeTab, setActiveTab] = useState("write");
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);
  const [letters, setLetters] = useState(initialLetters);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Filter letters based on search query
  const filteredLetters = letters.filter(letter => 
    letter.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle letter refresh
  const refreshLetters = () => {
    setIsLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      setLetters(initialLetters);
      setIsLoading(false);
      toast({
        title: "Inbox Refreshed",
        description: "Your letters have been updated",
      });
    }, 1000);
  };

  // Function to mark letter as read when opened
  const handleOpenLetter = (id: number) => {
    setSelectedLetter(id);
    setLetters(letters.map(letter => 
      letter.id === id ? { ...letter, read: true } : letter
    ));
  };

  // Handle letter sent event
  const handleLetterSent = () => {
    // In a real app, we would refresh the inbox data from the server
    toast({
      title: "Letter Delivered",
      description: "Your letter has been sent successfully!",
    });
    
    // If we're in the inbox tab, refresh the letters
    if (activeTab === "inbox") {
      refreshLetters();
    }
  };
  
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
              <h1 className="text-3xl md:text-4xl font-serif mb-3">Your Letters</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Express your deepest feelings through thoughtfully crafted letters.
              </p>
            </motion.div>
          </div>
          
          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 rounded-full border bg-gray-50/80 backdrop-blur-sm">
              {[
                { id: "write", label: "Write a Letter" },
                { id: "inbox", label: "Your Inbox" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedLetter(null);
                  }}
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id 
                      ? "text-love-dark" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content based on active tab */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="min-h-[60vh]"
          >
            {activeTab === "write" ? (
              <LetterBox recipient={recipient} onLetterSent={handleLetterSent} />
            ) : (
              <div className="max-w-5xl mx-auto">
                {/* Search and filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search letters..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={refreshLetters}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FilterIcon className="h-4 w-4" />
                      <span>Filters</span>
                    </Button>
                  </div>
                </div>
                
                {/* Letters inbox */}
                {selectedLetter === null ? (
                  filteredLetters.length > 0 ? (
                    <div className="space-y-4">
                      {filteredLetters.map((letter) => (
                        <motion.div
                          key={letter.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => handleOpenLetter(letter.id)}
                          className={`p-4 rounded-lg border ${
                            letter.read ? 'bg-white' : 'bg-parchment-light'
                          } cursor-pointer hover:shadow-md transition-all duration-300`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-love-light flex items-center justify-center">
                                <Heart size={18} className="text-love-dark" />
                              </div>
                              <div>
                                <h3 className="font-medium">{letter.sender}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(letter.date).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {!letter.read && (
                              <Badge className="bg-love-medium">New</Badge>
                            )}
                          </div>
                          
                          <p className="mt-3 text-gray-600 line-clamp-2">
                            {letter.content}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <Mail className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium">No letters found</h3>
                      <p className="text-gray-500 mt-1">
                        {searchQuery ? 'Try a different search term' : 'Your inbox is empty'}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLetter(null)}
                      className="absolute left-0 -top-12 text-gray-500"
                    >
                      ← Back to inbox
                    </Button>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {letters.filter(l => l.id === selectedLetter).map(letter => (
                        <LetterTemplate 
                          key={letter.id}
                          recipient="Me"
                          sender={letter.sender}
                          date={letter.date}
                        >
                          <div className="whitespace-pre-line">
                            {letter.content}
                          </div>
                        </LetterTemplate>
                      ))}
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      {/* AI Companion */}
      <AICompanion />
    </div>
  );
};

export default Letters;
