import { emailService } from '@/lib/services/email';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import { notificationsAPI } from './notifications';

type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert'];

export class WorkspacesAPI {
  private supabase = createClient();

  async getWorkspaces(clerkUserId: string) {
    try {
      const { data: userProfile, error: userError } = await this.supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (userError) {
        return [];
      }

      const { data: memberships, error: membershipError } = await this.supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', userProfile.id);

      if (membershipError) {
        return [];
      }

      if (!memberships || memberships.length === 0) {
        return [];
      }

      const workspaceIds = memberships.map(
        (membership: { workspace_id: string }) => membership.workspace_id
      );

      const { data, error } = await this.supabase
        .from('workspaces')
        .select(
          `
          *,
          owner:user_profiles!workspaces_owner_id_fkey(first_name, last_name, image_url),
          workspace_members(
            user:user_profiles(id, first_name, last_name, image_url, clerk_user_id),
            role
          ),
          ideas(id, title, phase)
        `
        )
        .in('id', workspaceIds)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  }

  async getWorkspace(id: string, clerkUserId?: string) {
    try {
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          throw new Error('User not found');
        }

        const { data: membership, error: membershipError } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', id)
          .eq('user_id', userProfile.id)
          .single();

        if (membershipError || !membership) {
          throw new Error('Access denied');
        }
      }

      const { data, error } = await this.supabase
        .from('workspaces')
        .select(
          `
          *,
          owner:user_profiles!workspaces_owner_id_fkey(first_name, last_name, image_url),
          workspace_members(
            user:user_profiles(id, first_name, last_name, image_url, clerk_user_id),
            role
          ),
          ideas(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async createWorkspace(workspace: WorkspaceInsert, userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('workspaces')
        .insert(workspace)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const { error: memberError } = await this.supabase
        .from('workspace_members')
        .insert({
          workspace_id: data.id,
          user_id: userId,
          role: 'owner',
        });

      if (memberError) {
        return;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async inviteMember(
    workspaceId: string,
    userEmail: string,
    role: 'admin' | 'member' | 'viewer' = 'member',
    inviterUserId?: string
  ) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        throw new Error('Invalid email format');
      }

      const { data: existingUser } = await this.supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email')
        .eq('email', userEmail)
        .single();

      if (existingUser) {
        const { data: existingMembership } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', workspaceId)
          .eq('user_id', existingUser.id)
          .single();

        if (existingMembership) {
          throw new Error('User is already a member of this workspace');
        }
      }

      const { data: existingInvitation } = await this.supabase
        .from('workspace_invitations')
        .select('id, role, expires_at')
        .eq('workspace_id', workspaceId)
        .eq('email', userEmail)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (existingInvitation) {
        throw new Error(
          `User already has a pending invitation to this workspace as ${existingInvitation.role}. Expires on ${new Date(existingInvitation.expires_at).toLocaleDateString()}`
        );
      }

      const workspace = await this.getWorkspace(workspaceId);
      if (!workspace) {
        throw new Error('Workspace not found');
      }

      let inviter = null;
      if (inviterUserId) {
        const { data: inviterData } = await this.supabase
          .from('user_profiles')
          .select('first_name, last_name, email')
          .eq('id', inviterUserId)
          .single();
        inviter = inviterData;
      }

      if (!inviter) {
        const { data: ownerData } = await this.supabase
          .from('user_profiles')
          .select('first_name, last_name, email')
          .eq('id', workspace.owner_id)
          .single();
        inviter = ownerData;
      }

      const { data: invitation, error: invitationError } = await this.supabase
        .from('workspace_invitations')
        .insert({
          workspace_id: workspaceId,
          email: userEmail,
          role,
          invited_by: inviterUserId,
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days
        })
        .select()
        .single();

      if (invitationError) {
        console.error('Create invitation error:', invitationError);
        throw invitationError;
      }

      const inviterName = inviter
        ? `${inviter.first_name || ''} ${inviter.last_name || ''}`.trim() ||
          inviter.email
        : 'A team member';
      const inviterEmail = inviter?.email || 'abenidevworking@gmail.com';

      console.log('Invitation created:', invitation);

      await this.sendInvitationEmail({
        recipientEmail: userEmail,
        recipientName: existingUser
          ? `${existingUser.first_name || ''} ${existingUser.last_name || ''}`.trim()
          : undefined,
        inviterName,
        inviterEmail,
        workspaceName: workspace.name,
        workspaceDescription: workspace.description || undefined,
        role,
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://forgespace.com'}/invite/${invitation.id}`,
        isExistingUser: !!existingUser,
      });

      console.log('Invitation email sent');

      return {
        success: true,
        invitation,
        isExistingUser: !!existingUser,
        user: existingUser || null,
      };
    } catch (error) {
      throw error;
    }
  }

  private async sendInvitationEmail(data: {
    recipientEmail: string;
    recipientName?: string;
    inviterName: string;
    inviterEmail: string;
    workspaceName: string;
    workspaceDescription?: string;
    role: string;
    inviteUrl: string;
    isExistingUser: boolean;
  }) {
    try {
      const result = await emailService.sendWorkspaceInvitationDirect({
        recipientEmail: data.recipientEmail,
        recipientName: data.recipientName,
        inviterName: data.inviterName,
        inviterEmail: data.inviterEmail,
        workspaceName: data.workspaceName,
        workspaceDescription: data.workspaceDescription,
        role: data.role,
        inviteUrl: data.inviteUrl,
      });

      if (!result.success) {
        return;
      }

      if (data.isExistingUser) {
        try {
          const { data: userProfile } = await this.supabase
            .from('user_profiles')
            .select('id')
            .eq('email', data.recipientEmail)
            .single();

          if (userProfile) {
            await notificationsAPI.logNotification({
              user_id: userProfile.id,
              type: 'workspace_invite',
              subject: `${data.inviterName} invited you to join ${data.workspaceName} on ForgeSpace`,
              recipient_email: data.recipientEmail,
              status: 'sent',
            });
            console.log('Notification logged for existing user');
          }
        } catch (notificationError) {
          console.log(notificationError);
          return;
        }
      }
    } catch (emailError) {
      console.log(emailError);
      return;
    }
  }

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    role: 'owner' | 'admin' | 'member' | 'viewer',
    clerkUserId?: string
  ) {
    try {
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          throw new Error('User not found');
        }

        const { data: membership, error: membershipError } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', workspaceId)
          .eq('user_id', userProfile.id)
          .in('role', ['owner', 'admin'])
          .single();

        if (membershipError || !membership) {
          throw new Error('Access denied - requires owner or admin role');
        }

        if (role === 'owner') {
          throw new Error('Cannot change user to owner role');
        }
      }

      const { data, error } = await this.supabase
        .from('workspace_members')
        .update({ role })
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async removeMember(
    workspaceId: string,
    userId: string,
    clerkUserId?: string
  ) {
    try {
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          throw new Error('User not found');
        }

        const { data: membership, error: membershipError } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', workspaceId)
          .eq('user_id', userProfile.id)
          .in('role', ['owner', 'admin'])
          .single();

        if (membershipError || !membership) {
          throw new Error('Access denied - requires owner or admin role');
        }

        const { data: targetMember } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', workspaceId)
          .eq('user_id', userId)
          .single();

        if (targetMember?.role === 'owner') {
          throw new Error('Cannot remove workspace owner');
        }
      }

      const { error } = await this.supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateWorkspace(
    id: string,
    updates: {
      name?: string;
      description?: string;
      type?: 'personal' | 'team';
    },
    clerkUserId?: string
  ) {
    try {
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          throw new Error('User not found');
        }

        const { data: membership, error: membershipError } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', id)
          .eq('user_id', userProfile.id)
          .in('role', ['owner', 'admin'])
          .single();

        if (membershipError || !membership) {
          throw new Error('Access denied - requires owner or admin role');
        }
      }

      const { data, error } = await this.supabase
        .from('workspaces')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkspace(id: string, clerkUserId?: string) {
    try {
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          console.error('User profile not found:', userError);
          throw new Error('User not found');
        }

        // Check if user has owner role in this workspace
        const { data: membership, error: membershipError } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', id)
          .eq('user_id', userProfile.id)
          .eq('role', 'owner')
          .single();

        if (membershipError || !membership) {
          console.error(
            'User not authorized to delete workspace:',
            membershipError
          );
          throw new Error('Access denied - requires owner role');
        }
      }

      const { error } = await this.supabase
        .from('workspaces')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete workspace error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteWorkspace:', error);
      throw error;
    }
  }

  async acceptInvitation(
    invitationId: string,
    userEmail: string,
    userProfile: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    }
  ) {
    try {
      const { data: invitation, error: invitationError } = await this.supabase
        .from('workspace_invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('email', userEmail)
        .single();

      if (invitationError || !invitation) {
        throw new Error('Invitation not found or invalid');
      }

      // Check if invitation is expired
      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }

      // Check if invitation is already accepted
      if (invitation.accepted_at) {
        throw new Error('Invitation has already been accepted');
      }

      // Add user to workspace
      const { data: membership, error: membershipError } = await this.supabase
        .from('workspace_members')
        .insert({
          workspace_id: invitation.workspace_id,
          user_id: userProfile.id,
          role: invitation.role,
        })
        .select()
        .single();

      if (membershipError) {
        console.error('Add user to workspace error:', membershipError);
        throw membershipError;
      }

      // Mark invitation as accepted
      const { error: updateError } = await this.supabase
        .from('workspace_invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitationId);

      if (updateError) {
        console.error('Update invitation error:', updateError);
        // Don't throw here, the user was successfully added to workspace
      }

      return { success: true, membership };
    } catch (error) {
      console.error('Error in acceptInvitation:', error);
      throw error;
    }
  }

  async getInvitations(workspaceId: string, clerkUserId?: string) {
    try {
      // If clerkUserId is provided, verify user has access to this workspace
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          console.error('User profile not found:', userError);
          throw new Error('User not found');
        }

        // Check if user has admin/owner role in this workspace
        const { data: membership, error: membershipError } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', workspaceId)
          .eq('user_id', userProfile.id)
          .in('role', ['owner', 'admin'])
          .single();

        if (membershipError || !membership) {
          console.error(
            'User not authorized to view invitations:',
            membershipError
          );
          throw new Error('Access denied - requires owner or admin role');
        }
      }

      const { data, error } = await this.supabase
        .from('workspace_invitations')
        .select(
          `
          *,
          workspace:workspaces(name),
          inviter:user_profiles!workspace_invitations_invited_by_fkey(first_name, last_name, email)
        `
        )
        .eq('workspace_id', workspaceId)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get invitations error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getInvitations:', error);
      throw error;
    }
  }

  async getInvitation(invitationId: string, userEmail?: string) {
    try {
      let query = this.supabase
        .from('workspace_invitations')
        .select(
          `
          *,
          workspace:workspaces(name, description),
          inviter:user_profiles!workspace_invitations_invited_by_fkey(first_name, last_name, email)
        `
        )
        .eq('id', invitationId);

      // Only filter by email if provided (for authenticated users)
      if (userEmail) {
        query = query.eq('email', userEmail);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Get invitation error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getInvitation:', error);
      throw error;
    }
  }

  async cancelInvitation(invitationId: string, clerkUserId?: string) {
    try {
      // If clerkUserId is provided, verify user has access to cancel this invitation
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          console.error('User profile not found:', userError);
          throw new Error('User not found');
        }

        // Check if user is the one who sent the invitation or has admin/owner role
        const { data: invitation } = await this.supabase
          .from('workspace_invitations')
          .select('invited_by, workspace_id')
          .eq('id', invitationId)
          .single();

        if (invitation) {
          if (invitation.invited_by !== userProfile.id) {
            // Check if user has admin/owner role in the workspace
            const { data: membership } = await this.supabase
              .from('workspace_members')
              .select('role')
              .eq('workspace_id', invitation.workspace_id)
              .eq('user_id', userProfile.id)
              .in('role', ['owner', 'admin'])
              .single();

            if (!membership) {
              throw new Error(
                'Access denied - can only cancel your own invitations or requires admin/owner role'
              );
            }
          }
        }
      }

      const { error } = await this.supabase
        .from('workspace_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        console.error('Cancel invitation error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in cancelInvitation:', error);
      throw error;
    }
  }

  async resendInvitation(invitationId: string, clerkUserId?: string) {
    try {
      // Get the invitation
      const { data: invitation, error: invitationError } = await this.supabase
        .from('workspace_invitations')
        .select(
          `
          *,
          workspace:workspaces(name, description),
          inviter:user_profiles!workspace_invitations_invited_by_fkey(first_name, last_name, email)
        `
        )
        .eq('id', invitationId)
        .single();

      if (invitationError || !invitation) {
        throw new Error('Invitation not found');
      }

      // If clerkUserId is provided, verify user has access to resend this invitation
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          console.error('User profile not found:', userError);
          throw new Error('User not found');
        }

        if (invitation.invited_by !== userProfile.id) {
          // Check if user has admin/owner role in the workspace
          const { data: membership } = await this.supabase
            .from('workspace_members')
            .select('role')
            .eq('workspace_id', invitation.workspace_id)
            .eq('user_id', userProfile.id)
            .in('role', ['owner', 'admin'])
            .single();

          if (!membership) {
            throw new Error(
              'Access denied - can only resend your own invitations or requires admin/owner role'
            );
          }
        }
      }

      // Update expiration to 7 days from now
      const newExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      const { error: updateError } = await this.supabase
        .from('workspace_invitations')
        .update({
          expires_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', invitationId);

      if (updateError) {
        console.error('Update invitation error:', updateError);
        throw updateError;
      }

      // Resend invitation email
      await this.sendInvitationEmail({
        recipientEmail: invitation.email,
        recipientName: undefined,
        inviterName: invitation.inviter
          ? `${invitation.inviter.first_name} ${invitation.inviter.last_name}`.trim()
          : 'A team member',
        inviterEmail: invitation.inviter?.email || '',
        workspaceName: invitation.workspace.name,
        workspaceDescription: invitation.workspace.description || undefined,
        role: invitation.role,
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationId}`,
        isExistingUser: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Error in resendInvitation:', error);
      throw error;
    }
  }

  async getPendingInvitations(workspaceId: string, clerkUserId?: string) {
    try {
      // If clerkUserId is provided, verify user has access to this workspace
      if (clerkUserId) {
        const { data: userProfile, error: userError } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (userError) {
          console.error('User profile not found:', userError);
          throw new Error('User not found');
        }

        // Check if user is a member of this workspace (any role can view invitations)
        const { data: membership, error: membershipError } = await this.supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', workspaceId)
          .eq('user_id', userProfile.id)
          .single();

        if (membershipError || !membership) {
          console.error(
            'User not authorized to view workspace:',
            membershipError
          );
          throw new Error('Access denied - must be a workspace member');
        }
      }

      const { data, error } = await this.supabase
        .from('workspace_invitations')
        .select(
          `
          *,
          workspace:workspaces(name),
          inviter:user_profiles!workspace_invitations_invited_by_fkey(first_name, last_name, email)
        `
        )
        .eq('workspace_id', workspaceId)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get pending invitations error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingInvitations:', error);
      throw error;
    }
  }
}

export const workspacesAPI = new WorkspacesAPI();
