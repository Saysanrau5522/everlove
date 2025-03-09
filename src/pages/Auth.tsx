
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Mail, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { signIn, signUp } = useAuth();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(email, password, fullName);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Authentication */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <motion.div 
              className="relative w-10 h-10 mx-auto flex items-center justify-center mb-2"
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
            <h1 className="text-2xl font-serif font-medium text-gray-900">Everlove</h1>
            <p className="text-gray-600 mt-1">Connect authentically, love intentionally</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input 
                        id="signin-email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input 
                        id="signin-password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-love-medium hover:bg-love-deep">
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Create Your Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input 
                        id="signup-name" 
                        type="text" 
                        placeholder="Your Name" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-love-medium hover:bg-love-deep">
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Right side - Landing page content */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-pink-50 to-wisdom-light/20 p-8 flex items-center">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900">
                AI-Powered connection<br />
                Love letters in a<br />
                digital age
              </h2>
              <p className="text-gray-600 max-w-md">
                Experience a social platform that celebrates intentional communication, deeper connections, 
                and the timeless art of love with AI-powered insights.
              </p>
              <div className="pt-2 space-x-4">
                <Link to="/letters">
                  <Button className="bg-love-medium hover:bg-love-deep text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                    Start Writing Letters
                  </Button>
                </Link>
                <Link to="/community">
                  <Button variant="outline" className="border-love-medium/30 text-love-dark px-6 py-2 rounded-full hover:bg-love-light/20">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-serif mb-6">Redefining how we express love</h3>
              <p className="text-gray-600 mb-6">
                Everlove combines the nostalgia of handwritten letters with modern technology to create meaningful connections.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Mail className="text-love-medium mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">Thoughtful Letters</h4>
                    <p className="text-sm text-gray-600">Exchange meaningful letters with your beloved, carefully crafted to express your deepest feelings.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="text-wisdom-medium mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">Relationship Growth</h4>
                    <p className="text-sm text-gray-600">Engage in activities and reflections that strengthen your bond and deepen your understanding.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="text-trust-medium mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">Supportive Community</h4>
                    <p className="text-sm text-gray-600">Connect with others on the same journey, sharing wisdom and experiences about authentic love.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="text-love-medium mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">AI-Powered Love Insights</h4>
                    <p className="text-sm text-gray-600">Our AI companion helps you nurture more meaningful connections through personalized insights.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
