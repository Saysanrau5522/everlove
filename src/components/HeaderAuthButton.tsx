
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogIn, User, LogOut, Settings, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const HeaderAuthButton = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };
  
  if (isLoading) {
    return (
      <Button disabled variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
        <span className="sr-only">Loading</span>
        <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
      </Button>
    );
  }
  
  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" size="sm" className="rounded-full">
          <LogIn className="h-4 w-4 mr-2" />
          <span>Sign In</span>
        </Button>
      </Link>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 border-2 border-white">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email || ''} />
            ) : (
              <AvatarFallback className="bg-love-light text-love-dark">
                {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col items-center gap-2 p-4">
          <Avatar className="h-16 w-16">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email || ''} />
            ) : (
              <AvatarFallback className="bg-love-light text-love-dark text-xl">
                {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/letters">
          <DropdownMenuItem className="cursor-pointer">
            <Mail className="mr-2 h-4 w-4" />
            <span>My Letters</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive" 
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAuthButton;
