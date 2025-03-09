
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Clock, Heart, Search, FilterIcon } from "lucide-react";
import Header from "@/components/Header";
import LetterBox from "@/components/LetterBox";
import LetterTemplate from "@/components/LetterTemplate";
import AICompanion from "@/components/AICompanion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLetters, Letter } from "@/hooks/use-letters";
import { useAuth } from "@/context/AuthContext";
import { format, parseISO } from "date-fns";

interface ReceivedLetter extends Letter {
  profiles: {
    full_name: string;
    avatar_url: string;
  }
}

const Letters = () => {
  const [activeTab, setActiveTab] = useState("write");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [receivedLetters, setReceivedLetters] = useState<ReceivedLetter[]>([]);
  const { letters, loading, fetchLetters, fetchReceivedLetters } = useLetters();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && activeTab === "inbox") {
      loadReceivedLetters();
    }
  }, [user, activeTab]);
  
  const loadReceivedLetters = async () => {
    const received = await fetchReceivedLetters();
    setReceivedLetters(received as ReceivedLetter[]);
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
                { id: "inbox", label: "Your Inbox" },
                { id: "sent", label: "Sent Letters" }
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
              <LetterBox />
            ) : activeTab === "inbox" ? (
              <div className="max-w-5xl mx-auto">
                {/* Search and filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search letters..."
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FilterIcon className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </div>
                
                {/* Letters inbox */}
                {selectedLetter === null ? (
                  loading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Loading your letters...</p>
                    </div>
                  ) : receivedLetters.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No letters in your inbox yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receivedLetters.map((letter) => (
                        <motion.div
                          key={letter.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => setSelectedLetter(letter.id)}
                          className="p-4 rounded-lg border bg-parchment-light cursor-pointer hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-love-light flex items-center justify-center">
                                <Heart size={18} className="text-love-dark" />
                              </div>
                              <div>
                                <h3 className="font-medium">{letter.profiles?.full_name || "Someone"}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {format(parseISO(letter.created_at), 'MMMM d, yyyy')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <Badge className="bg-love-medium">New</Badge>
                          </div>
                          
                          <p className="mt-3 text-gray-600 line-clamp-2">
                            {letter.content}
                          </p>
                        </motion.div>
                      ))}
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
                      {receivedLetters.filter(l => l.id === selectedLetter).map(letter => (
                        <LetterTemplate 
                          key={letter.id}
                          recipient={user?.user_metadata?.full_name || "Me"}
                          sender={letter.profiles?.full_name || "Someone"}
                          date={parseISO(letter.created_at)}
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
            ) : (
              // Sent letters tab
              <div className="max-w-5xl mx-auto">
                {/* Search and filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search sent letters..."
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={fetchLetters}>
                    <FilterIcon className="h-4 w-4" />
                    <span>Refresh</span>
                  </Button>
                </div>
                
                {/* Sent letters list */}
                {selectedLetter === null ? (
                  loading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Loading your sent letters...</p>
                    </div>
                  ) : letters.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">You haven't sent any letters yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {letters.map((letter) => (
                        <motion.div
                          key={letter.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => setSelectedLetter(letter.id)}
                          className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all duration-300 ${
                            letter.is_draft ? 'bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-love-light flex items-center justify-center">
                                <Heart size={18} className="text-love-dark" />
                              </div>
                              <div>
                                <h3 className="font-medium">To: {letter.recipient}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {format(parseISO(letter.created_at), 'MMMM d, yyyy')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {letter.is_draft ? (
                              <Badge variant="outline">Draft</Badge>
                            ) : letter.scheduled_for ? (
                              <Badge className="bg-amber-500">Scheduled</Badge>
                            ) : (
                              <Badge className="bg-green-500">Sent</Badge>
                            )}
                          </div>
                          
                          <p className="mt-3 text-gray-600 line-clamp-2">
                            {letter.content}
                          </p>
                        </motion.div>
                      ))}
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
                      ← Back to sent letters
                    </Button>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {letters.filter(l => l.id === selectedLetter).map(letter => (
                        <LetterTemplate 
                          key={letter.id}
                          recipient={letter.recipient}
                          sender={user?.user_metadata?.full_name || "Me"}
                          date={parseISO(letter.created_at)}
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
