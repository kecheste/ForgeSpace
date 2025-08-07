import type { IdeaNotificationData } from '@/lib/services/email';
import { notificationQueue } from '@/lib/services/notification-queue';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import { notificationsAPI } from './notifications';

type IdeaInsert = Database['public']['Tables']['ideas']['Insert'];
type IdeaUpdate = Database['public']['Tables']['ideas']['Update'];

export class IdeasAPI {
  private supabase = createClient();

  async getIdeas(workspaceId?: string, userId?: string) {
    try {
      let query = this.supabase
        .from('ideas')
        .select(
          `
          *,
          workspace:workspaces(name),
          creator:user_profiles(first_name, last_name, image_url)
        `
        )
        .order('updated_at', { ascending: false });

      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }

      // If userId is provided, filter by workspaces the user is a member of
      if (userId) {
        const { data: userWorkspaces, error: workspaceError } =
          await this.supabase
            .from('workspace_members')
            .select('workspace_id')
            .eq('user_id', userId);

        if (workspaceError) {
          console.error('Error getting user workspaces:', workspaceError);
          return [];
        }

        const workspaceIds = userWorkspaces.map(
          (w: { workspace_id: string }) => w.workspace_id
        );
        if (workspaceIds.length > 0) {
          query = query.in('workspace_id', workspaceIds);
        } else {
          // User has no workspaces, return empty array
          return [];
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Get ideas error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getIdeas:', error);
      throw error;
    }
  }

  async getIdea(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('ideas')
        .select(
          `
          *,
          workspace:workspaces(name, type),
          creator:user_profiles(first_name, last_name, image_url),
          idea_phases(*),
          comments(
            *,
            user:user_profiles(first_name, last_name, image_url)
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error('Get idea error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getIdea:', error);
      throw error;
    }
  }

  async createIdea(idea: IdeaInsert) {
    try {
      const { data, error } = await this.supabase
        .from('ideas')
        .insert(idea)
        .select()
        .single();

      if (error) {
        console.error('Create idea error:', error);
        throw error;
      }

      // Create initial phase records
      const phases = [
        'inception',
        'refinement',
        'planning',
        'execution_ready',
      ] as const;
      const phaseInserts = phases.map((phase) => ({
        idea_id: data.id,
        phase,
        content: '',
        completed: phase === 'inception', // Mark inception as completed by default
      }));

      const { error: phaseError } = await this.supabase
        .from('idea_phases')
        .insert(phaseInserts);

      if (phaseError) {
        console.error('Create phases error:', phaseError);
        // Don't throw here, idea was created successfully
      }

      // Send notifications to workspace members
      await this.notifyWorkspaceMembers(
        data.workspace_id,
        data.creator_id,
        'created',
        {
          ideaId: data.id,
          ideaTitle: data.title,
          ideaDescription: data.description,
          phase: data.phase,
        }
      );

      return data;
    } catch (error) {
      console.error('Error in createIdea:', error);
      throw error;
    }
  }

  async updateIdea(id: string, updates: IdeaUpdate, updaterUserId?: string) {
    try {
      const { data, error } = await this.supabase
        .from('ideas')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update idea error:', error);
        throw error;
      }

      // Send notifications if significant changes were made
      if (
        updaterUserId &&
        (updates.title || updates.description || updates.phase)
      ) {
        const actionType = updates.phase ? 'phase_changed' : 'updated';

        await this.notifyWorkspaceMembers(
          data.workspace_id,
          updaterUserId,
          actionType,
          {
            ideaId: data.id,
            ideaTitle: data.title,
            ideaDescription: data.description,
            phase: data.phase,
            actionDetails: updates.phase
              ? `Moved to ${updates.phase} phase`
              : undefined,
          }
        );
      }

      return data;
    } catch (error) {
      console.error('Error in updateIdea:', error);
      throw error;
    }
  }

  async deleteIdea(id: string) {
    try {
      const { error } = await this.supabase.from('ideas').delete().eq('id', id);

      if (error) {
        console.error('Delete idea error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteIdea:', error);
      throw error;
    }
  }

  async updatePhase(
    ideaId: string,
    phase: string,
    content: string,
    completed?: boolean
  ) {
    try {
      const updates: {
        content: string;
        updated_at: string;
        completed?: boolean;
      } = { content, updated_at: new Date().toISOString() };
      if (completed !== undefined) {
        updates.completed = completed;
      }

      const { data, error } = await this.supabase
        .from('idea_phases')
        .update(updates)
        .eq('idea_id', ideaId)
        .eq('phase', phase)
        .select()
        .single();

      if (error) {
        console.error('Update phase error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updatePhase:', error);
      throw error;
    }
  }

  async addComment(
    ideaId: string,
    content: string,
    phase?: string,
    userId?: string
  ) {
    try {
      const { data, error } = await this.supabase
        .from('comments')
        .insert({
          idea_id: ideaId,
          content,
          phase: phase || null,
          user_id: userId!,
        })
        .select(
          `
          *,
          user:user_profiles(first_name, last_name, image_url)
        `
        )
        .single();

      if (error) {
        console.error('Add comment error:', error);
        throw error;
      }

      // Get idea details for notifications
      const idea = await this.getIdea(ideaId);
      if (idea && userId) {
        await this.notifyWorkspaceMembers(
          idea.workspace_id,
          userId,
          'commented',
          {
            ideaId: idea.id,
            ideaTitle: idea.title,
            ideaDescription: idea.description,
            phase: phase || idea.phase,
            comment: content,
          }
        );
      }

      return data;
    } catch (error) {
      console.error('Error in addComment:', error);
      throw error;
    }
  }

  private async notifyWorkspaceMembers(
    workspaceId: string,
    actorUserId: string,
    actionType: 'created' | 'updated' | 'commented' | 'phase_changed',
    details: {
      ideaId: string;
      ideaTitle: string;
      ideaDescription: string;
      phase: string;
      comment?: string;
      actionDetails?: string;
    }
  ) {
    try {
      // Get workspace members (excluding the actor)
      const { data: members, error: membersError } = await this.supabase
        .from('workspace_members')
        .select(
          `
          user:user_profiles(id, first_name, last_name, email)
        `
        )
        .eq('workspace_id', workspaceId)
        .neq('user_id', actorUserId);

      if (membersError) {
        console.error('Error getting workspace members:', membersError);
        return;
      }

      // Get actor details
      const { data: actor, error: actorError } = await this.supabase
        .from('user_profiles')
        .select('first_name, last_name, email')
        .eq('id', actorUserId)
        .single();

      if (actorError) {
        console.error('Error getting actor details:', actorError);
        return;
      }

      // Get workspace details
      const { data: workspace, error: workspaceError } = await this.supabase
        .from('workspaces')
        .select('name')
        .eq('id', workspaceId)
        .single();

      if (workspaceError) {
        console.error('Error getting workspace details:', workspaceError);
        return;
      }

      const notifications = await Promise.all(
        members?.map(
          async (member: {
            user: {
              id: unknown;
              email: unknown;
              first_name: unknown;
              last_name: unknown;
            }[];
          }) => {
            if (!member.user || member.user.length === 0) return null;
            const user = member.user[0];

            const shouldNotify = await notificationsAPI.shouldSendNotification(
              user.id as string,
              actionType === 'commented'
                ? 'comment_notifications'
                : 'idea_notifications'
            );

            if (!shouldNotify) return null;

            const ideaUrl = `${process.env.NEXT_PUBLIC_APP_URL}/ideas/${details.ideaId}`;

            return notificationQueue.queueIdeaNotification(actionType, {
              recipientEmail: user.email as string,
              recipientName: (user.first_name as string)
                ? `${user.first_name as string} ${user.last_name as string}`.trim()
                : 'there',
              actorName: `${actor.first_name} ${actor.last_name}`.trim(),
              actorEmail: actor.email,
              ideaTitle: details.ideaTitle,
              ideaDescription: details.ideaDescription,
              workspaceName: workspace.name,
              actionType,
              actionDetails: details.actionDetails,
              ideaUrl,
              phase: details.phase,
              comment: details.comment,
            } as IdeaNotificationData);
          }
        ) || []
      );

      // Log successful notifications
      const successfulNotifications = notifications.filter(Boolean);
      console.log(
        `Queued ${successfulNotifications.length} notifications for ${actionType}`
      );
    } catch (error) {
      console.error('Error notifying workspace members:', error);
    }
  }
}

export const ideasAPI = new IdeasAPI();
