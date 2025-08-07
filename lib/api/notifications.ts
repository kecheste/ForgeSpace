import { createClient } from '@/lib/supabase/client';

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  idea_notifications: boolean;
  comment_notifications: boolean;
  mention_notifications: boolean;
  weekly_digest: boolean;
  workspace_invites: boolean;
}

class NotificationsAPI {
  private supabase = createClient();

  async getPreferences(
    userId: string
  ): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting notification preferences:', error);
        throw error;
      }

      // Return default preferences if none exist
      if (!data) {
        return {
          email_notifications: true,
          push_notifications: true,
          idea_notifications: true,
          comment_notifications: true,
          mention_notifications: true,
          weekly_digest: false,
          workspace_invites: true,
        };
      }

      return {
        email_notifications: data.email_notifications,
        push_notifications: data.push_notifications,
        idea_notifications: data.idea_notifications,
        comment_notifications: data.comment_notifications,
        mention_notifications: data.mention_notifications,
        weekly_digest: data.weekly_digest,
        workspace_invites: data.workspace_invites,
      };
    } catch (error) {
      console.error('Error in getPreferences:', error);
      throw error;
    }
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    try {
      const { data, error } = await this.supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating notification preferences:', error);
        throw error;
      }

      return {
        email_notifications: data.email_notifications,
        push_notifications: data.push_notifications,
        idea_notifications: data.idea_notifications,
        comment_notifications: data.comment_notifications,
        mention_notifications: data.mention_notifications,
        weekly_digest: data.weekly_digest,
        workspace_invites: data.workspace_invites,
      };
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      throw error;
    }
  }

  async shouldSendNotification(
    userId: string,
    notificationType: keyof NotificationPreferences
  ): Promise<boolean> {
    try {
      const preferences = await this.getPreferences(userId);
      if (!preferences) return false;

      // Check if email notifications are enabled globally
      if (!preferences.email_notifications) return false;

      // Check specific notification type
      return preferences[notificationType] || false;
    } catch (error) {
      console.error('Error checking notification preferences:', error);
      return false;
    }
  }

  async logNotification(data: {
    user_id: string;
    type: string;
    subject?: string;
    recipient_email: string;
    status: 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked';
    provider_id?: string;
    metadata?: unknown;
  }): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('notification_log')
        .insert(data);

      if (error) {
        console.error('Error logging notification:', error);
      }
    } catch (error) {
      console.error('Error in logNotification:', error);
    }
  }
}

export const notificationsAPI = new NotificationsAPI();
