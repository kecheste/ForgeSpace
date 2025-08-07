import { createClient } from '@/lib/supabase/client';
import {
  emailService,
  type IdeaNotificationData,
  type WorkspaceInviteData,
} from './email';

export interface NotificationJob {
  id?: string;
  type:
    | 'workspace_invite'
    | 'created'
    | 'updated'
    | 'commented'
    | 'phase_changed'
    | 'welcome';
  recipient_email: string;
  data:
    | WorkspaceInviteData
    | IdeaNotificationData
    | { recipientEmail: string; userName: string };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  max_attempts: number;
  scheduled_for: string;
  created_at?: string;
  updated_at?: string;
  error_message?: string;
}

class NotificationQueue {
  private supabase = createClient();
  private maxAttempts = 3;
  private retryDelay = 5 * 60 * 1000;

  async addJob(
    job: Omit<
      NotificationJob,
      | 'id'
      | 'status'
      | 'attempts'
      | 'max_attempts'
      | 'created_at'
      | 'updated_at'
    >
  ): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('notification_queue')
        .insert({
          ...job,
          status: 'pending',
          attempts: 0,
          max_attempts: this.maxAttempts,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error adding notification job:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error adding notification job:', error);
      return null;
    }
  }

  async processJob(job: NotificationJob): Promise<boolean> {
    try {
      await this.supabase
        .from('notification_queue')
        .update({
          status: 'processing',
          updated_at: new Date().toISOString(),
        })
        .eq('id', job.id);

      let result: { success: boolean; error?: string };

      switch (job.type) {
        case 'workspace_invite':
          const { render } = await import('@react-email/render');
          const { WorkspaceInvitationEmail } = await import(
            '@/emails/workspace-invitation'
          );

          const workspaceData = job.data as WorkspaceInviteData;
          const emailHtml = render(
            WorkspaceInvitationEmail({
              inviterName: workspaceData.inviterName,
              inviterEmail: workspaceData.inviterEmail,
              workspaceName: workspaceData.workspaceName,
              workspaceDescription: workspaceData.workspaceDescription,
              role: workspaceData.role,
              inviteUrl: workspaceData.inviteUrl,
              recipientName: workspaceData.recipientName,
            })
          );

          result = await emailService.sendImportantEmail({
            to: workspaceData.recipientEmail,
            subject: `${workspaceData.inviterName} invited you to join ${workspaceData.workspaceName} on ForgeSpace`,
            html: emailHtml,
          });
          break;
        case 'created':
        case 'updated':
        case 'commented':
        case 'phase_changed':
          result = await emailService.sendIdeaNotification(
            job.data as unknown as IdeaNotificationData
          );
          break;
        case 'welcome':
          const welcomeData = job.data as {
            recipientEmail: string;
            userName: string;
          };
          result = await emailService.sendWelcomeEmail(welcomeData);
          break;
        default:
          result = { success: false, error: 'Unknown job type' };
      }

      if (result.success) {
        await this.supabase
          .from('notification_queue')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', job.id);
        return true;
      } else {
        const newAttempts = job.attempts + 1;
        const shouldRetry = newAttempts < job.max_attempts;

        if (shouldRetry) {
          const nextAttempt = new Date(Date.now() + this.retryDelay);
          await this.supabase
            .from('notification_queue')
            .update({
              status: 'pending',
              attempts: newAttempts,
              scheduled_for: nextAttempt.toISOString(),
              error_message: result.error,
              updated_at: new Date().toISOString(),
            })
            .eq('id', job.id);
        } else {
          await this.supabase
            .from('notification_queue')
            .update({
              status: 'failed',
              attempts: newAttempts,
              error_message: result.error,
              updated_at: new Date().toISOString(),
            })
            .eq('id', job.id);
        }
        return false;
      }
    } catch (error) {
      console.error('Error processing notification job:', error);

      // Update job with error
      await this.supabase
        .from('notification_queue')
        .update({
          status: 'failed',
          attempts: job.attempts + 1,
          error_message:
            error instanceof Error ? error.message : 'Unknown error',
          updated_at: new Date().toISOString(),
        })
        .eq('id', job.id);

      return false;
    }
  }

  async processPendingJobs(): Promise<void> {
    try {
      const { data: jobs, error } = await this.supabase
        .from('notification_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching pending jobs:', error);
        return;
      }

      if (!jobs || jobs.length === 0) {
        return;
      }

      console.log(`Processing ${jobs.length} notification jobs`);

      // Process jobs in parallel with limited concurrency
      const promises = jobs.map((job: NotificationJob) => this.processJob(job));
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error processing pending jobs:', error);
    }
  }

  // Helper methods for common notification types
  async queueWorkspaceInvite(
    data: WorkspaceInviteData
  ): Promise<string | null> {
    return await this.addJob({
      type: 'workspace_invite',
      recipient_email: data.recipientEmail,
      data,
      scheduled_for: new Date().toISOString(),
    });
  }

  async queueIdeaNotification(
    type: 'created' | 'updated' | 'commented' | 'phase_changed',
    data: IdeaNotificationData
  ): Promise<string | null> {
    return await this.addJob({
      type,
      recipient_email: data.recipientEmail,
      data,
      scheduled_for: new Date().toISOString(),
    });
  }

  async queueWelcomeEmail(
    recipientEmail: string,
    userName: string
  ): Promise<string | null> {
    return await this.addJob({
      type: 'welcome',
      recipient_email: recipientEmail,
      data: { recipientEmail, userName },
      scheduled_for: new Date().toISOString(),
    });
  }
}

export const notificationQueue = new NotificationQueue();
