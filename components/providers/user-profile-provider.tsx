'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useUser } from '@clerk/nextjs';
import { usersAPI } from '@/lib/api/users';

interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  displayName: string;
  avatarInitials: string;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profile = await usersAPI.createOrUpdateProfile({
        clerk_user_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        image_url: user.imageUrl || '',
      });
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await loadUserProfile();
  };

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  // Helper function to get display name
  const getDisplayName = () => {
    const firstName = userProfile?.first_name || user?.firstName;
    const lastName = userProfile?.last_name || user?.lastName;

    if (firstName || lastName) {
      return `${firstName || ''} ${lastName || ''}`.trim();
    }

    return user?.emailAddresses[0]?.emailAddress || 'User';
  };

  // Helper function to get avatar initials
  const getAvatarInitials = () => {
    const firstName = userProfile?.first_name || user?.firstName;
    const lastName = userProfile?.last_name || user?.lastName;

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else if (lastName) {
      return lastName[0];
    } else {
      // Use email initials if no name
      const email = user?.emailAddresses[0]?.emailAddress || '';
      return email.substring(0, 2).toUpperCase();
    }
  };

  const value = {
    userProfile,
    displayName: getDisplayName(),
    avatarInitials: getAvatarInitials(),
    loading,
    refreshProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
