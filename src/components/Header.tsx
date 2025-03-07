
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, MessageSquare, User } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", icon: <Heart size={20} />, label: "Home" },
    { path: "/letters", icon: <Mail size={20} />, label: "Letters" },
    { path: "/community", icon: <MessageSquare size={20} />, label: "Community" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? "py-3 bg-white/80 backdrop-blur-md shadow-sm" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            className="relative w-8 h-8 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          <h1 className="font-serif text-2xl font-medium text-love-dark tracking-tight">
            Everlove
          </h1>
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                    location.pathname === item.path
                      ? "text-love-dark font-medium"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {location.pathname === item.path && (
                    <motion.div
                      className="absolute inset-0 bg-love-light/50 rounded-full -z-10"
                      layoutId="navBackground"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-md border-t z-40">
          <ul className="flex items-center justify-around">
            {navItems.map((item) => (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  className={`relative py-3 flex flex-col items-center gap-1 transition-all ${
                    location.pathname === item.path
                      ? "text-love-dark"
                      : "text-foreground/70"
                  }`}
                >
                  {location.pathname === item.path && (
                    <motion.div
                      className="absolute inset-x-0 top-0 h-0.5 bg-love-medium"
                      layoutId="mobileNavIndicator"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
