'use client';

import { useSupabase } from '@/components/providers/supabase-provider';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface Idea {
  id: string;
  [key: string]: unknown;
}

interface Comment {
  id: string;
  idea_id: string;
  [key: string]: unknown;
}

interface Phase {
  id: string;
  idea_id: string;
  [key: string]: unknown;
}

interface ActiveUser {
  user_id: string;
  user_name: string;
  user_avatar?: string;
  online_at: string;
}

export function useRealtimeIdea(ideaId: string) {
  const { supabase } = useSupabase();
  const { user } = useUser();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    if (!ideaId || !user) return;

    const ideaChannel = supabase
      .channel(`idea-${ideaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
          filter: `id=eq.${ideaId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setIdea(payload.new as Idea);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `idea_id=eq.${ideaId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prev) => [...prev, payload.new as Comment]);
          } else if (payload.eventType === 'UPDATE') {
            setComments((prev) =>
              prev.map((comment) =>
                comment.id === payload.new.id
                  ? (payload.new as Comment)
                  : comment
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setComments((prev) =>
              prev.filter((comment) => comment.id !== payload.old.id)
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'idea_phases',
          filter: `idea_id=eq.${ideaId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setPhases((prev) =>
              prev.map((phase) =>
                phase.id === payload.new.id ? (payload.new as Phase) : phase
              )
            );
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const newState = ideaChannel.presenceState();
        const users = Object.values(newState).flat() as unknown as ActiveUser[];
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        setActiveUsers((prev) => [
          ...prev,
          ...(newPresences as unknown as ActiveUser[]),
        ]);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        setActiveUsers((prev) =>
          prev.filter(
            (user) =>
              !(leftPresences as unknown as ActiveUser[]).find(
                (left) => left.user_id === user.user_id
              )
          )
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await ideaChannel.track({
            user_id: user.id,
            user_name:
              user.fullName ||
              user.emailAddresses[0]?.emailAddress ||
              'Unknown User',
            user_avatar: user.imageUrl,
            online_at: new Date().toISOString(),
          } as ActiveUser);
        }
      });

    return () => {
      supabase.removeChannel(ideaChannel);
    };
  }, [ideaId, user, supabase]);

  return { idea, comments, phases, activeUsers };
}

export function useRealtimeWorkspace(workspaceId: string) {
  const { supabase } = useSupabase();
  const { user } = useUser();
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    if (!workspaceId || !user) return;

    const channel = supabase
      .channel(`workspace-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setIdeas((prev) => [...prev, payload.new as Idea]);
          } else if (payload.eventType === 'UPDATE') {
            setIdeas((prev) =>
              prev.map((idea) =>
                idea.id === payload.new.id ? (payload.new as Idea) : idea
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setIdeas((prev) =>
              prev.filter((idea) => idea.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, user, supabase]);

  return { ideas };
}
