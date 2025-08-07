'use client';

import { createClient } from '@/lib/supabase/client';
import { useUser } from '@clerk/nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface SupabaseContextType {
  supabase: SupabaseClient;
  isConnected: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  // const [supabase] = useState(() => createClient());
  const supabase = createClient();

  useEffect(() => {
    if (user && supabase) {
      const channel = supabase.channel('user-presence');

      type ChannelStatus = 'SUBSCRIBED' | 'CLOSED' | string;

      channel
        .on('presence', { event: 'sync' }, () => {
          setIsConnected(true);
        })
        .on('presence', { event: 'join' }, () => {
          setIsConnected(true);
        })
        .on('presence', { event: 'leave' }, () => {
          // Keep connected even if others leave
        })
        .subscribe((status: ChannelStatus) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CLOSED') {
            setIsConnected(false);
          }
        });

      return () => {
        supabase.removeChannel(channel);
        setIsConnected(false);
      };
    }
  }, [user, supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, isConnected }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
