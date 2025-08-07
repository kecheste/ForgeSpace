'use client';

import { usersAPI } from '@/lib/api/users';
import { workspacesAPI } from '@/lib/api/workspaces';
import { useUser } from '@clerk/nextjs';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface WorkspaceMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface Workspace {
  id: string;
  name: string;
  type: string;
  description?: string;
  workspace_members?: WorkspaceMember[];
  created_at: string;
  updated_at: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  loading: boolean;
  userProfile: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  } | null;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  const loadUserData = async () => {
    try {
      setLoading(true);

      const profile = await usersAPI.createOrUpdateProfile({
        clerk_user_id: user!.id,
        email: user!.emailAddresses[0]?.emailAddress || '',
        first_name: user!.firstName || '',
        last_name: user!.lastName || '',
        image_url: user!.imageUrl || '',
      });
      setUserProfile(profile);

      try {
        const workspacesData = await workspacesAPI.getWorkspaces(user!.id);
        setWorkspaces(workspacesData || []);

        if (workspacesData && workspacesData.length > 0 && !hasInitialized) {
          const persistedWorkspace = localStorage.getItem(
            'forgeSpace_currentWorkspace'
          );
          if (persistedWorkspace) {
            try {
              const workspace = JSON.parse(persistedWorkspace);
              const workspaceExists = workspacesData.find(
                (w: Workspace) => w.id === workspace.id
              );
              if (workspaceExists) {
                setCurrentWorkspace(workspaceExists);
              } else {
                setCurrentWorkspace(workspacesData[0]);
              }
            } catch (error) {
              console.error('Error parsing persisted workspace:', error);
              setCurrentWorkspace(workspacesData[0]);
            }
          } else {
            setCurrentWorkspace(workspacesData[0]);
          }
          setHasInitialized(true);
        }
      } catch (workspaceError) {
        console.log('No workspaces found:', workspaceError);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshWorkspaces = async () => {
    if (user) {
      await loadUserData();
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      loadUserData();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  // Persist current workspace in localStorage
  useEffect(() => {
    if (currentWorkspace) {
      localStorage.setItem(
        'forgeSpace_currentWorkspace',
        JSON.stringify(currentWorkspace)
      );
    }
  }, [currentWorkspace]);

  const value: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading,
    userProfile,
    refreshWorkspaces,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
