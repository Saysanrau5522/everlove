
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, AtSign, FileText, Loader2, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

type ProfileFormValues = {
  username: string;
  full_name: string;
  bio: string;
};

const ProfileEdit = ({ onClose }: { onClose: () => void }) => {
  const { profile, updateProfile, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
    }
  });

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await updateProfile({
        username: data.username,
        full_name: data.full_name,
        bio: data.bio,
      });
      
      if (error) throw error;
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-lg border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Edit Profile</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              className="pl-10 bg-gray-50"
              disabled
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <AtSign size={18} />
            </div>
            <Input
              id="username"
              {...register("username", { required: "Username is required" })}
              className="pl-10"
              placeholder="yourname"
            />
          </div>
          {errors.username && (
            <p className="text-destructive text-xs mt-1">{errors.username.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <Input
              id="full_name"
              {...register("full_name", { required: "Full name is required" })}
              className="pl-10"
              placeholder="Your Full Name"
            />
          </div>
          {errors.full_name && (
            <p className="text-destructive text-xs mt-1">{errors.full_name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
              <FileText size={18} />
            </div>
            <Textarea
              id="bio"
              {...register("bio")}
              className="pl-10 min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
        
        <div className="flex gap-3 justify-end pt-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-love-medium hover:bg-love-deep"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileEdit;
