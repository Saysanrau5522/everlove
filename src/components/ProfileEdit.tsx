
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { UserCircle, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProfileEdit = ({ onClose }: { onClose?: () => void }) => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    relationship_mode: profile?.relationship_mode || 'solo',
    avatar_url: profile?.avatar_url || '',
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleModeChange = (value: string) => {
    setFormData({
      ...formData,
      relationship_mode: value as 'solo' | 'together',
    });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({
            ...formData,
            avatar_url: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !profile?.id) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${profile.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let avatarUrl = profile?.avatar_url;
      
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      const { error } = await updateProfile({
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        relationship_mode: formData.relationship_mode as 'solo' | 'together',
        avatar_url: avatarUrl,
      });
      
      if (error) {
        toast({
          title: 'Profile update failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully.',
        });
        
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      toast({
        title: 'Profile update failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-serif mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {formData.avatar_url ? (
              <img
                src={formData.avatar_url}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-24 h-24 text-gray-300" />
            )}
            
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-love-medium text-white p-2 rounded-full cursor-pointer"
            >
              <Camera className="h-4 w-4" />
            </label>
            
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter a unique username"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={handleInputChange}
            placeholder="Tell us a little about yourself..."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Relationship Mode</Label>
          <RadioGroup 
            value={formData.relationship_mode} 
            onValueChange={handleModeChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solo" id="solo" />
              <Label htmlFor="solo">Solo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="together" id="together" />
              <Label htmlFor="together">Together</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileEdit;
