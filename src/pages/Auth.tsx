
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, ArrowRight, Mail, MessageSquare, Award, Sparkles, User, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import AIPoweredFeatures from "@/components/AIPoweredFeatures";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again with a different email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 -left-24 w-64 h-64 bg-love-light/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-wisdom-light/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-love-light/20 rounded-full blur-3xl" />
      </div>
      
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Auth form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <Card className="w-full max-w-md p-6 shadow-xl border-0">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
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
              <h1 className="text-2xl font-serif font-medium">Welcome</h1>
              <p className="text-gray-600 mt-2">Sign in to continue to your journey</p>
            </div>
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Link to="#" className="text-sm text-love-medium hover:text-love-deep">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-love-medium hover:bg-love-deep"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-love-medium hover:bg-love-deep"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Right side - Hero content */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3 max-w-lg"
          >
            <div className="inline-flex px-4 py-1.5 bg-love-light/50 rounded-full text-love-dark text-sm font-medium mb-4 items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-Powered connection</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-tight text-gray-900 leading-tight">
              Love letters in a<br />
              <span className="text-love-dark">digital age</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto">
              Experience a social platform that celebrates intentional communication, 
              deeper connections, and the timeless art of love with AI-powered insights.
            </p>
          </motion.div>
          
          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-2xl">
            {[
              {
                icon: <Mail className="h-8 w-8 text-love-dark" />,
                title: "Thoughtful Letters",
                description: "Exchange meaningful letters, carefully crafted to express your deepest feelings."
              },
              {
                icon: <Award className="h-8 w-8 text-love-dark" />,
                title: "Relationship Growth",
                description: "Engage in activities that strengthen your bond and deepen understanding."
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-love-dark" />,
                title: "Supportive Community",
                description: "Connect with others sharing wisdom and experiences about authentic love."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-love-light/30 flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-base font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Preview of AI features */}
          <div className="mt-10 w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <Sparkles className="h-4 w-4 text-love-medium" />
              <h3 className="text-lg font-serif">
                AI-Powered Love Insights
              </h3>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {[
                "Relationship Insights",
                "Love Conversation Guide",
                "Emotion Recognition"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-full px-4 py-2 text-sm border border-love-light/30 text-love-dark shadow-sm"
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-10">
            <Link to="/">
              <Button className="bg-love-medium hover:bg-love-deep text-white px-6 py-2 rounded-full flex items-center gap-2">
                <span>Explore Everlove</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
