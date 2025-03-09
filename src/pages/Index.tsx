
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Mail, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PhilosophyFeed from "@/components/PhilosophyFeed";
import CommunityForum from "@/components/CommunityForum";
import AIChatLayout from "@/components/AIChatLayout";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      <AIChatLayout />
      
      {/* Main content */}
      <main className="pt-24 pb-20">
        {/* Library Feed section */}
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <PhilosophyFeed />
          </div>
        </section>
        
        {/* Community Forum section */}
        <section className="py-10 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-serif mb-8">Community Discussions</h2>
            <CommunityForum />
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-love-light/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-wisdom-light/30 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-serif">
                Begin your journey to authentic love
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Whether you're in a relationship or seeking to understand love more deeply, 
                Everlove provides the space for genuine connection.
              </p>
              <div className="pt-4 flex flex-wrap gap-4 justify-center">
                <Link to="/auth">
                  <Button className="bg-love-medium hover:bg-love-deep text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/letters">
                  <Button variant="outline" className="border-love-medium/30 text-love-dark px-6 py-2 rounded-full hover:bg-love-light/20">
                    Start Writing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-6">
            <motion.div 
              className="relative w-10 h-10 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="absolute inset-0 rounded-full bg-love-medium/30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Heart className="text-love-deep relative z-10" fill="currentColor" size={22} />
            </motion.div>
            <h3 className="font-serif text-xl font-medium text-love-dark ml-2">
              Everlove
            </h3>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            Celebrating authentic love through intentional communication and thoughtful connection.
          </p>
          <div className="mt-8 text-sm text-gray-400">
            © {new Date().getFullYear()} Everlove. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
