
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Heart, LogOut, Settings, User } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProfileEdit from './ProfileEdit';

const HeaderAuthButton = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  if (!user) {
    return (
      <Button
        onClick={() => navigate('/auth')}
        variant="ghost"
        className="text-love-dark"
      >
        Sign In
      </Button>
    );
  }
  
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-love-light text-love-dark">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => navigate('/profile')}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsProfileOpen(true)}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {profile?.relationship_mode === 'together' && (
            <DropdownMenuItem
              onClick={() => navigate('/relationship')}
              className="cursor-pointer"
            >
              <Heart className="mr-2 h-4 w-4" />
              <span>Relationship</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              signOut();
              navigate('/');
            }}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-md">
          <ProfileEdit onClose={() => setIsProfileOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeaderAuthButton;
