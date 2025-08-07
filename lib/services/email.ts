import { render } from '@react-email/render';
import { Resend } from 'resend';
import { WorkspaceInvitationEmail } from '@/emails/workspace-invitation';
import { IdeaNotificationEmail } from '@/emails/idea-notification';
import { WelcomeEmail } from '@/emails/welcome';
import { WeeklyDigestEmail } from '@/emails/weekly-digest';

let resend: Resend | null = null;

const getResend = () => {
  if (typeof window !== 'undefined') {
    return null;
  }

  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return null;
    }

    resend = new Resend(apiKey);
  }

  return resend;
};

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: Promise<string> | string;
  from?: string;
  replyTo?: string;
}

export interface WorkspaceInviteData {
  recipientEmail: string;
  recipientName?: string;
  inviterName: string;
  inviterEmail: string;
  workspaceName: string;
  workspaceDescription?: string;
  role: string;
  inviteUrl: string;
}

export interface IdeaNotificationData {
  recipientEmail: string;
  recipientName: string;
  actorName: string;
  actorEmail: string;
  ideaTitle: string;
  ideaDescription: string;
  workspaceName: string;
  actionType: 'created' | 'updated' | 'commented' | 'phase_changed';
  actionDetails?: string;
  ideaUrl: string;
  phase?: string;
  comment?: string;
}

export interface WelcomeData {
  recipientEmail: string;
  userName: string;
}

export interface WeeklyDigestData {
  recipientEmail: string;
  userName: string;
  weekStart: string;
  weekEnd: string;
  stats: {
    ideasCreated: number;
    ideasUpdated: number;
    commentsAdded: number;
    workspacesActive: number;
  };
  recentIdeas: Array<{
    title: string;
    workspace: string;
    phase: string;
    url: string;
  }>;
  topWorkspaces: Array<{
    name: string;
    activity: number;
    url: string;
  }>;
}

class EmailService {
  private defaultFrom =
    process.env.EMAIL_FROM || 'ForgeSpace <noreply@ForgeSpace.com>';
  private replyTo = process.env.EMAIL_REPLY_TO || 'abenidevworking@gmail.com';

  async sendEmail(
    options: EmailOptions
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const resendInstance = getResend();
      if (!resendInstance) {
        console.warn(
          'RESEND_API_KEY not configured or running on client-side, email not sent'
        );
        return { success: false, error: 'Email service not configured' };
      }

      const html =
        options.html instanceof Promise ? await options.html : options.html;

      const result = await resendInstance.emails.send({
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html,
        reply_to: options.replyTo || this.replyTo,
      });

      if (result.error) {
        console.error('Email send error:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('Email sent successfully:', result.data?.id);
      return { success: true };
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendWorkspaceInvitation(
    data: WorkspaceInviteData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const html = await render(
        WorkspaceInvitationEmail({
          recipientName: data.recipientName,
          inviterName: data.inviterName,
          inviterEmail: data.inviterEmail,
          workspaceName: data.workspaceName,
          workspaceDescription: data.workspaceDescription,
          role: data.role,
          inviteUrl: data.inviteUrl,
        })
      );

      return await this.sendEmail({
        to: data.recipientEmail,
        subject: `${data.inviterName} invited you to join ${data.workspaceName} on ForgeSpace`,
        html,
      });
    } catch (error) {
      console.error('Error sending workspace invitation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendIdeaNotification(
    data: IdeaNotificationData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const html = await render(
        IdeaNotificationEmail({
          recipientName: data.recipientName,
          actorName: data.actorName,
          actorEmail: data.actorEmail,
          ideaTitle: data.ideaTitle,
          ideaDescription: data.ideaDescription,
          workspaceName: data.workspaceName,
          actionType: data.actionType,
          actionDetails: data.actionDetails,
          ideaUrl: data.ideaUrl,
          phase: data.phase,
          comment: data.comment,
        })
      );

      const getSubjectText = () => {
        switch (data.actionType) {
          case 'created':
            return `New idea: ${data.ideaTitle}`;
          case 'updated':
            return `Idea updated: ${data.ideaTitle}`;
          case 'commented':
            return `New comment on: ${data.ideaTitle}`;
          case 'phase_changed':
            return `Idea moved to ${data.phase}: ${data.ideaTitle}`;
          default:
            return `Update on: ${data.ideaTitle}`;
        }
      };

      return await this.sendEmail({
        to: data.recipientEmail,
        subject: getSubjectText(),
        html,
      });
    } catch (error) {
      console.error('Error sending idea notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendWelcomeEmail(
    data: WelcomeData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const html = await render(
        WelcomeEmail({
          userName: data.userName,
          userEmail: data.recipientEmail,
        })
      );

      return await this.sendEmail({
        to: data.recipientEmail,
        subject: 'Welcome to ForgeSpace! 🚀',
        html,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendWeeklyDigest(
    data: WeeklyDigestData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const html = await render(
        WeeklyDigestEmail({
          userName: data.userName,
          weekStart: data.weekStart,
          weekEnd: data.weekEnd,
          stats: data.stats,
          recentIdeas: data.recentIdeas,
          topWorkspaces: data.topWorkspaces,
        })
      );

      return await this.sendEmail({
        to: data.recipientEmail,
        subject: `Your ForgeSpace weekly digest: ${data.stats.ideasCreated} new ideas, ${data.stats.commentsAdded} comments`,
        html,
      });
    } catch (error) {
      console.error('Error sending weekly digest:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendBulkNotifications(
    notifications: Array<{
      type: 'idea_notification';
      data: IdeaNotificationData;
    }>
  ): Promise<{
    success: boolean;
    results: Array<{ success: boolean; error?: string }>;
  }> {
    const results = await Promise.all(
      notifications.map(async (notification) => {
        switch (notification.type) {
          case 'idea_notification':
            return await this.sendIdeaNotification(notification.data);
          default:
            return { success: false, error: 'Unknown notification type' };
        }
      })
    );

    const allSuccessful = results.every((result) => result.success);
    return { success: allSuccessful, results };
  }

  async sendImportantEmail(
    options: EmailOptions
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const resendInstance = getResend();
      if (!resendInstance) {
        return { success: false, error: 'Email service not configured' };
      }

      const html =
        options.html instanceof Promise ? await options.html : options.html;

      const { data, error } = await resendInstance.emails.send({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html,
        reply_to: options.replyTo || this.replyTo,
      });

      if (data) {
        console.log('Email sent successfully:', data);
      }

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendWorkspaceInvitationDirect(
    data: WorkspaceInviteData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const resendInstance = getResend();
      if (!resendInstance) {
        return { success: false, error: 'Email service not configured' };
      }

      if (!data.recipientEmail) {
        return { success: false, error: 'Missing recipient email' };
      }

      if (!data.workspaceName) {
        return { success: false, error: 'Missing workspace name' };
      }

      if (!data.inviteUrl) {
        return { success: false, error: 'Missing invite URL' };
      }

      const { render } = await import('@react-email/render');
      const { WorkspaceInvitationEmail } = await import(
        '@/emails/workspace-invitation'
      );

      const emailData = {
        inviterName: data.inviterName || 'A team member',
        inviterEmail: data.inviterEmail || 'team@forgespace.com',
        workspaceName: data.workspaceName,
        workspaceDescription: data.workspaceDescription,
        role: data.role || 'member',
        inviteUrl: data.inviteUrl,
        recipientName: data.recipientName,
      };

      const emailHtml = await render(WorkspaceInvitationEmail(emailData));

      const { data: emailResult, error } = await resendInstance.emails.send({
        from: this.defaultFrom,
        to: data.recipientEmail,
        subject: `${emailData.inviterName} invited you to join ${emailData.workspaceName} on ForgeSpace`,
        html: emailHtml,
        reply_to: this.replyTo,
      });

      if (error) {
        console.error('Send workspace invitation error:', error);
        return { success: false, error: error.message };
      }

      console.log('Workspace invitation sent successfully:', emailResult);
      return { success: true };
    } catch (error) {
      console.error('Error in sendWorkspaceInvitationDirect:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const emailService = new EmailService();
