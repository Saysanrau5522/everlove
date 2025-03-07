
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'signin' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/');
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          toast({
            title: "Full name required",
            description: "Please enter your full name to sign up.",
            variant: "destructive",
          });
          return;
        }
        
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        // We stay on the page since the user needs to confirm their email
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        
        toast({
          title: "Password reset email sent",
          description: "Check your email for a password reset link.",
        });
        setMode('signin');
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 -left-24 w-64 h-64 bg-love-light/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-wisdom-light/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-love-light/20 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-4">
            <div className="relative w-10 h-10 mr-2">
              <motion.div 
                className="absolute inset-0 rounded-full bg-love-medium/30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div className="w-full h-full flex items-center justify-center relative z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-love-deep">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor" />
                </svg>
              </motion.div>
            </div>
            <h1 className="text-2xl font-serif font-medium text-gray-900">Everlove</h1>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-1">
            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create an account' : 'Reset your password'}
          </h2>
          <p className="text-gray-500">
            {mode === 'signin'
              ? 'Sign in to continue your love letter journey'
              : mode === 'signup'
              ? 'Join Everlove and connect more deeply'
              : 'We\'ll send you a link to reset your password'}
          </p>
        </div>

        <Card className="p-6 shadow-lg border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {mode !== 'forgot' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-medium text-love-deep hover:text-love-deep/80"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-love-medium hover:bg-love-deep text-white py-6 h-auto rounded-full shadow-md flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signin'
                      ? 'Sign In'
                      : mode === 'signup'
                      ? 'Create Account'
                      : 'Send Reset Link'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            {mode === 'signin' ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-medium text-love-deep hover:text-love-deep/80"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="font-medium text-love-deep hover:text-love-deep/80"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
