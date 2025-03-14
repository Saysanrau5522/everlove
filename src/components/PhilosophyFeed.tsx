
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book as BookIcon, Music, Quote, Heart, Bookmark, Share2, ChevronLeft, ChevronRight, Send, Play, Pause, Tag, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getLoveSongs, SpotifySong, playPreview, pausePreview } from '@/services/songs-service';
import { getRelationshipBooks, BookInfo } from '@/services/books-service';
import { getQuotes, Quote as QuoteType, getQuoteCategories } from '@/services/quotes-service';
import BookSidebar from './BookSidebar';

const PhilosophyFeed = () => {
  const [activeTab, setActiveTab] = useState("quotes");
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [savedBooks, setSavedBooks] = useState<string[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [songs, setSongs] = useState<SpotifySong[]>([]);
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState({
    songs: false,
    books: false,
    quotes: false,
    moreSongs: false,
    moreBooks: false,
    moreQuotes: false
  });
  const [songOffset, setSongOffset] = useState(0);
  const [bookStartIndex, setBookStartIndex] = useState(0);
  const [quoteStartIndex, setQuoteStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState({
    books: true,
    songs: true,
    quotes: true
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quoteCategory, setQuoteCategory] = useState('all');
  const quoteCategories = getQuoteCategories();
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Refetch books when category changes
  useEffect(() => {
    setBooks([]);
    setBookStartIndex(0);
    setHasMore(prev => ({ ...prev, books: true }));
    fetchBooks(0, selectedCategory);
  }, [selectedCategory]);

  // Refetch quotes when category changes
  useEffect(() => {
    setQuotes([]);
    setQuoteStartIndex(0);
    setHasMore(prev => ({ ...prev, quotes: true }));
    fetchQuotes();
  }, [quoteCategory]);

  const fetchInitialData = async () => {
    // Fetch initial songs
    fetchSongs();
    
    // Fetch initial books
    fetchBooks();
    
    // Fetch initial quotes
    fetchQuotes();
  };

  const fetchSongs = async (offset = 0) => {
    setLoading(prev => ({ ...prev, songs: songs.length === 0, moreSongs: songs.length > 0 }));
    try {
      const songData = await getLoveSongs(5, offset);
      if (offset === 0) {
        setSongs(songData);
      } else {
        setSongs(prev => [...prev, ...songData]);
      }
      setSongOffset(offset + 5);
      if (songData.length === 0) {
        setHasMore(prev => ({ ...prev, songs: false }));
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      toast({
        title: "Couldn't load songs",
        description: "Using sample data instead",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, songs: false, moreSongs: false }));
    }
  };

  const fetchBooks = async (startIndex = bookStartIndex, category = selectedCategory) => {
    setLoading(prev => ({ ...prev, books: books.length === 0, moreBooks: books.length > 0 }));
    try {
      const bookData = await getRelationshipBooks(3, startIndex, category !== 'all' ? category : undefined);
      if (startIndex === 0) {
        setBooks(bookData);
      } else {
        setBooks(prevBooks => [...prevBooks, ...bookData]);
      }
      setBookStartIndex(startIndex + 3);
      if (bookData.length === 0) {
        setHasMore(prev => ({ ...prev, books: false }));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Couldn't load books",
        description: "Using sample data instead",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, books: false, moreBooks: false }));
    }
  };

  const fetchQuotes = async () => {
    setLoading(prev => ({ ...prev, quotes: quotes.length === 0, moreQuotes: quotes.length > 0 }));
    try {
      const newQuotes = getQuotes(
        quoteCategory !== 'all' ? quoteCategory : undefined, 
        quoteStartIndex, 
        4
      );
      if (quoteStartIndex === 0) {
        setQuotes(newQuotes);
      } else {
        setQuotes(prev => [...prev, ...newQuotes]);
      }
      setQuoteStartIndex(prev => prev + 4);
      if (newQuotes.length === 0) {
        setHasMore(prev => ({ ...prev, quotes: false }));
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(prev => ({ ...prev, quotes: false, moreQuotes: false }));
    }
  };

  const fetchMoreBooks = async () => {
    if (loading.moreBooks || !hasMore.books) return;
    fetchBooks(bookStartIndex);
  };

  const fetchMoreSongs = async () => {
    if (loading.moreSongs || !hasMore.songs) return;
    fetchSongs(songOffset);
  };

  const fetchMoreQuotes = async () => {
    if (loading.moreQuotes || !hasMore.quotes) return;
    fetchQuotes();
  };

  // Pause any playing audio when unmounting
  useEffect(() => {
    return () => {
      pausePreview();
    };
  }, []);

  const toggleSaveQuote = (id: number) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(itemId => itemId !== id));
      toast({
        title: "Quote unsaved",
        description: "Quote removed from your saved items",
      });
    } else {
      setSavedItems([...savedItems, id]);
      toast({
        title: "Quote saved",
        description: "Quote added to your saved items",
      });
    }
  };

  const toggleSaveBook = (id: string) => {
    if (savedBooks.includes(id)) {
      setSavedBooks(savedBooks.filter(bookId => bookId !== id));
      toast({
        title: "Book unsaved",
        description: "Book removed from your saved items",
      });
    } else {
      setSavedBooks([...savedBooks, id]);
      toast({
        title: "Book saved",
        description: "Book added to your saved items",
      });
    }
  };

  const handleLikeQuote = (id: number) => {
    setQuotes(prev => 
      prev.map(quote => 
        quote.id === id ? { ...quote, likes: quote.likes + 1 } : quote
      )
    );
    toast({
      title: "Quote liked",
      description: "Your appreciation has been recorded",
    });
  };

  const goToNextSong = () => {
    pausePreview();
    setDirection(1);
    
    if (currentSongIndex === songs.length - 2) {
      // We're approaching the end, fetch more songs
      fetchMoreSongs();
    }
    
    setCurrentSongIndex((prevIndex) => 
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
    
    // Reset isPlaying state for all songs
    updateSongPlayingState(-1);
  };

  const goToPreviousSong = () => {
    pausePreview();
    setDirection(-1);
    setCurrentSongIndex((prevIndex) => 
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
    
    // Reset isPlaying state for all songs
    updateSongPlayingState(-1);
  };

  const handleSendSong = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to send this song to your loved one.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Song shared",
      description: `"${songs[currentSongIndex].title}" has been sent to your loved one.`,
    });
  };

  const handleShareQuote = (quote: QuoteType) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to share this quote.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Quote shared",
      description: `Quote by ${quote.author} has been shared.`,
    });
  };

  const handleShareBook = (book: BookInfo) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to share this book.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Book shared",
      description: `"${book.title}" has been shared with your connections.`,
    });
  };

  const updateSongPlayingState = (playingIndex: number) => {
    setSongs(prevSongs => prevSongs.map((song, idx) => ({
      ...song,
      isPlaying: idx === playingIndex
    })));
  };

  const handlePlayToggle = () => {
    if (songs.length === 0) return;
    
    const currentSong = songs[currentSongIndex];
    
    if (currentSong.isPlaying) {
      pausePreview();
      updateSongPlayingState(-1);
    } else if (currentSong.previewUrl) {
      playPreview(currentSong);
      updateSongPlayingState(currentSongIndex);
      toast({
        title: "Playing preview",
        description: `Now playing "${currentSong.title}" by ${currentSong.artist}`,
      });
    } else {
      toast({
        title: "Preview unavailable",
        description: "Sorry, no preview is available for this song",
        variant: "destructive"
      });
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Intersection Observers for infinite loading
  const bookObserverRef = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading.moreBooks) return;
    if (bookObserverRef.current) bookObserverRef.current.disconnect();
    
    bookObserverRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.books) {
        fetchMoreBooks();
      }
    });
    
    if (node) bookObserverRef.current.observe(node);
  }, [loading.moreBooks, hasMore.books, fetchMoreBooks]);

  const quoteObserverRef = useRef<IntersectionObserver | null>(null);
  const lastQuoteElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading.moreQuotes) return;
    if (quoteObserverRef.current) quoteObserverRef.current.disconnect();
    
    quoteObserverRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.quotes) {
        fetchMoreQuotes();
      }
    });
    
    if (node) quoteObserverRef.current.observe(node);
  }, [loading.moreQuotes, hasMore.quotes, fetchMoreQuotes]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading.songs && songs.length === 0 && loading.books && books.length === 0 && loading.quotes && quotes.length === 0) {
    return <div className="h-[500px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love-medium"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Wisdom Library</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
          <TabsTrigger value="quotes" className="flex items-center">
            <Quote size={16} className="mr-2" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center">
            <BookIcon size={16} className="mr-2" />
            Books
          </TabsTrigger>
          <TabsTrigger value="songs" className="flex items-center">
            <Music size={16} className="mr-2" />
            Songs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotes" className="mt-6">
          {/* Quote Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quoteCategories.map((category) => (
              <Badge
                key={category}
                variant={quoteCategory === category.toLowerCase() ? "default" : "outline"}
                className={`cursor-pointer ${
                  quoteCategory === category.toLowerCase() ? "bg-love-medium hover:bg-love-deep" : ""
                }`}
                onClick={() => setQuoteCategory(category.toLowerCase())}
              >
                {category}
              </Badge>
            ))}
          </div>

          {loading.quotes && quotes.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love-medium"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {quotes.map((quote, index) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index % 2 * 0.1 }}
                  ref={index === quotes.length - 1 ? lastQuoteElementRef : null}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <Quote className="text-wisdom-medium mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                        <div>
                          <p className="text-lg italic mb-2">{quote.text}</p>
                          <p className="text-sm text-gray-600">— {quote.author}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <span className="text-xs text-gray-500">{quote.category}</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleLikeQuote(quote.id)}
                        >
                          <Heart className="h-4 w-4 text-love-medium" />
                          <span className="sr-only">Like</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => toggleSaveQuote(quote.id)}
                        >
                          <Bookmark 
                            className={`h-4 w-4 ${savedItems.includes(quote.id) ? 'text-wisdom-medium fill-wisdom-medium' : 'text-gray-500'}`} 
                          />
                          <span className="sr-only">Save</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleShareQuote(quote)}
                        >
                          <Share2 className="h-4 w-4 text-gray-500" />
                          <span className="sr-only">Share</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Loading indicator for more quotes */}
          {loading.moreQuotes && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-love-medium"></div>
            </div>
          )}
          
          {/* No more quotes message */}
          {!hasMore.quotes && quotes.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              No more quotes to load
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="books" className="mt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-64 flex-shrink-0">
              <BookSidebar 
                onSelectCategory={handleSelectCategory} 
                selectedCategory={selectedCategory}
              />
            </div>
            
            {/* Books grid */}
            <div className="flex-1">
              {loading.books && books.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love-medium"></div>
                </div>
              ) : books.length === 0 && !loading.books ? (
                <div className="text-center py-8 text-gray-500">
                  No books found in this category
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {books.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index % 3 * 0.1 }}
                      ref={index === books.length - 1 ? lastBookElementRef : null}
                    >
                      <Card className="h-full flex flex-col overflow-hidden">
                        <div className="aspect-[2/3] overflow-hidden">
                          <img 
                            src={book.coverUrl} 
                            alt={book.title} 
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            onError={(e) => {
                              // Fallback for broken image links
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <CardContent className="pt-4 flex-grow">
                          <h3 className="font-medium text-lg">{book.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                          <p className="text-sm text-gray-700">{book.description}</p>
                        </CardContent>
                        <CardFooter className="pt-0 flex flex-col gap-2">
                          <div className="flex justify-between w-full items-center">
                            <Badge variant="outline" className="text-xs">
                              {book.category}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs font-medium">{book.rating}</span>
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => window.open(book.amazonUrl, '_blank')}
                            >
                              Buy on Amazon
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => window.open(book.wattpadUrl, '_blank')}
                            >
                              Read Preview
                            </Button>
                          </div>
                          <div className="flex justify-between mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-love-medium"
                              onClick={() => toggleSaveBook(book.id)}
                            >
                              <Bookmark className={`h-4 w-4 mr-1 ${
                                savedBooks.includes(book.id) ? 'text-wisdom-medium fill-wisdom-medium' : ''
                              }`} />
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-love-medium"
                              onClick={() => handleShareBook(book)}
                            >
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Loading indicator for more books */}
              {loading.moreBooks && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-love-medium"></div>
                </div>
              )}
              
              {/* No more books message */}
              {!hasMore.books && books.length > 0 && (
                <div className="text-center py-6 text-gray-500">
                  No more books to load
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="songs" className="mt-6">
          <div className="relative h-[500px] overflow-hidden rounded-xl mx-auto max-w-md">
            <AnimatePresence initial={false} custom={direction}>
              {songs.length > 0 && (
                <motion.div
                  key={currentSongIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute w-full h-full"
                >
                  <Card className={`w-full h-full overflow-hidden bg-gradient-to-br ${songs[currentSongIndex]?.color || 'from-love-light to-love-deep'} p-6 flex flex-col justify-between text-white shadow-xl`}>
                    <div className="relative z-10">
                      <div className="text-sm opacity-80 mb-1">
                        {songs[currentSongIndex]?.artist || 'Artist'}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {songs[currentSongIndex]?.title || 'Song Title'}
                      </h3>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center z-10 relative">
                      <div className="text-center whitespace-pre-line text-lg font-medium italic">
                        "{songs[currentSongIndex]?.lyrics || 'No lyrics available'}"
                      </div>
                      
                      {songs[currentSongIndex]?.imageUrl && (
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 opacity-30 rounded-full overflow-hidden">
                          <img 
                            src={songs[currentSongIndex].imageUrl} 
                            alt={songs[currentSongIndex].title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback for broken image links
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center z-10">
                      <Button 
                        onClick={handlePlayToggle}
                        variant="secondary" 
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        disabled={!songs[currentSongIndex]?.previewUrl}
                      >
                        {songs[currentSongIndex]?.isPlaying ? 
                          <Pause size={16} className="mr-2" /> : 
                          <Play size={16} className="mr-2" />
                        }
                        <span>{songs[currentSongIndex]?.isPlaying ? 'Pause' : 'Play'} Preview</span>
                      </Button>
                      
                      <Button 
                        onClick={handleSendSong}
                        variant="secondary" 
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      >
                        <Send size={16} />
                        <span>Send to Loved One</span>
                      </Button>
                    </div>
                    
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -mr-32 -mt-32 blur-md"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 -ml-24 -mb-24 blur-md"></div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Navigation buttons */}
            <button
              onClick={goToPreviousSong}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full"
              aria-label="Previous song"
            >
              <ChevronLeft className="text-white" />
            </button>
            
            <button
              onClick={goToNextSong}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full"
              aria-label="Next song"
            >
              <ChevronRight className="text-white" />
            </button>
          </div>
          
          {/* Song indicators with loading state */}
          <div className="flex justify-center mt-4 gap-2 items-center">
            {songs.slice(0, Math.min(10, songs.length)).map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSongIndex % 10 ? "bg-love-deep w-4" : "bg-gray-300"
                }`}
              />
            ))}
            {songs.length > 10 && (
              <span className="text-xs text-gray-500 ml-2">+{songs.length - 10} more</span>
            )}
            {loading.moreSongs && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-love-medium ml-2"></div>
            )}
          </div>
          
          {/* Message when no more songs */}
          {!hasMore.songs && songs.length > 0 && (
            <div className="text-center mt-4 text-gray-500 text-sm">
              All available songs loaded
            </div>
          )}

          {/* Song playback instructions */}
          <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="font-medium mb-2">How to enjoy the music:</h4>
            <ol className="text-sm text-gray-600 text-left list-decimal pl-5 space-y-1">
              <li>Click the "Play Preview" button to listen to a 30-second preview</li>
              <li>If a song doesn't play, navigate to the next song using the arrow buttons</li>
              <li>Use the "Send to Loved One" button to share favorite songs</li>
              <li>For full songs, follow the links to music streaming services (coming soon)</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhilosophyFeed;
