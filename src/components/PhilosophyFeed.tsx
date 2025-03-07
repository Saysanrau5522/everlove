
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Heart, ArrowRight, Quote, Coffee, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample philosophy quotes
const quotes = [
  {
    quote: "Love is not about possession. It's about appreciation.",
    author: "Osho",
    type: "philosophy",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    quote: "The greatest happiness of life is the conviction that we are loved; loved for ourselves, or rather, loved in spite of ourselves.",
    author: "Victor Hugo",
    type: "classic",
    imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    quote: "Love is a choice you make from moment to moment.",
    author: "Barbara De Angelis",
    type: "advice",
    imageUrl: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const PhilosophyFeed = () => {
  return (
    <div className="space-y-12 mb-20">
      <h2 className="text-2xl md:text-3xl font-serif text-center">Wisdom & Reflections</h2>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden h-full flex flex-col bg-white border border-gray-100 shadow-paper group hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                <img 
                  src={item.imageUrl} 
                  alt={item.author} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm text-gray-800">
                    {item.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4 text-love-dark">
                  <Quote className="h-6 w-6 mb-2 opacity-40" />
                  <p className="font-serif text-lg italic leading-relaxed">
                    {item.quote}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <p className="text-right font-medium text-gray-700">— {item.author}</p>
                </div>
              </div>
              
              <div className="p-4 border-t flex justify-between items-center bg-gray-50/50">
                <Button variant="ghost" size="sm" className="text-love-dark flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>Reflect</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="text-gray-600 flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>More</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button className="bg-transparent hover:bg-love-light/50 text-love-dark border border-love-medium/30 px-6 flex items-center gap-2 group">
          <span>Explore more wisdom</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default PhilosophyFeed;
