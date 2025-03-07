
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";

// Auth Provider
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

// Lazy loaded pages for better performance
const Letters = lazy(() => import("./pages/Letters"));
const Community = lazy(() => import("./pages/Community"));
const Profile = lazy(() => import("./pages/Profile"));

// Animation components
import AnimatedTransition from "./components/AnimatedTransition";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/letters" 
                element={
                  <Suspense fallback={<AnimatedTransition />}>
                    <Letters />
                  </Suspense>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <Suspense fallback={<AnimatedTransition />}>
                    <Community />
                  </Suspense>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <Suspense fallback={<AnimatedTransition />}>
                    <Profile />
                  </Suspense>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
