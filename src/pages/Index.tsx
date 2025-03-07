
import { motion } from "framer-motion";
import { Heart, ArrowDown, Mail, MessageSquare, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import AICompanion from "@/components/AICompanion";
import PhilosophyFeed from "@/components/PhilosophyFeed";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      {/* Main content */}
      <main className="pt-24 pb-20">
        {/* Hero section */}
        <section className="min-h-[85vh] relative flex flex-col items-center justify-center px-4 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/3 -left-24 w-64 h-64 bg-love-light/30 rounded-full blur-3xl" />
            <div className="absolute top-1/4 -right-32 w-80 h-80 bg-wisdom-light/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-love-light/20 rounded-full blur-3xl" />
          </div>
          
          {/* Hero content */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-3"
            >
              <div className="inline-block px-4 py-1.5 bg-love-light/50 rounded-full text-love-dark text-sm font-medium mb-4">
                Rediscover authentic connection
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-gray-900 leading-tight">
                Love letters in a<br />
                <span className="text-love-dark">digital age</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                Experience a social platform that celebrates intentional communication, 
                deeper connections, and the timeless art of love.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <Link to="/letters">
                <Button className="bg-love-medium hover:bg-love-deep text-white px-8 py-6 h-auto rounded-full text-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                  <Heart className="w-5 h-5" />
                  <span>Start Writing Letters</span>
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="outline" className="border-love-medium/50 text-love-dark px-8 py-6 h-auto rounded-full text-lg hover:bg-love-light/20 transition-all duration-300">
                  <span>Join Community</span>
                </Button>
              </Link>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="h-6 w-6 text-gray-400" />
            </motion.div>
          </motion.div>
        </section>
        
        {/* Features section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                Redefining how we express love
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everlove combines the nostalgia of handwritten letters with modern 
                technology to create meaningful connections.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: <Mail className="h-8 w-8 text-love-dark" />,
                  title: "Thoughtful Letters",
                  description: "Exchange meaningful letters with your beloved, carefully crafted to express your deepest feelings."
                },
                {
                  icon: <Award className="h-8 w-8 text-love-dark" />,
                  title: "Relationship Growth",
                  description: "Engage in activities and reflections that strengthen your bond and deepen your understanding."
                },
                {
                  icon: <MessageSquare className="h-8 w-8 text-love-dark" />,
                  title: "Supportive Community",
                  description: "Connect with others on the same journey, sharing wisdom and experiences about authentic love."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 border border-gray-100 shadow-paper hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-love-light/30 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Philosophy feed section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto">
            <PhilosophyFeed />
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20 px-4 relative overflow-hidden">
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
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-serif">
                Begin your journey to authentic love
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Whether you're in a relationship or seeking to understand love more deeply, 
                Everlove provides the space for genuine connection.
              </p>
              <div className="pt-4">
                <Link to="/letters">
                  <Button className="bg-love-medium hover:bg-love-deep text-white px-8 py-6 h-auto rounded-full text-lg shadow-md hover:shadow-lg transition-all duration-300">
                    Start Now
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
      
      {/* AI Companion */}
      <AICompanion />
    </div>
  );
};

export default Index;
