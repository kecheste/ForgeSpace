import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import { TLStoreSnapshot } from 'tldraw';

type WhiteboardCanvasInsert =
  Database['public']['Tables']['whiteboard_canvases']['Insert'];
type WhiteboardCanvasUpdate =
  Database['public']['Tables']['whiteboard_canvases']['Update'];

export class WhiteboardsAPI {
  private supabase = createClient();

  async getCanvases(clerkUserId: string) {
    try {
      const { data: userProfile, error: userError } = await this.supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (userError) {
        return [];
      }

      // First, get the user's workspace IDs
      const { data: userWorkspaces, error: workspacesError } =
        await this.supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', userProfile.id);

      if (workspacesError) {
        console.error('Error fetching user workspaces:', workspacesError);
        return [];
      }

      if (!userWorkspaces || userWorkspaces.length === 0) {
        return [];
      }

      // Extract workspace IDs
      const workspaceIds = userWorkspaces.map(
        (w: { workspace_id: string }) => w.workspace_id
      );

      // Get canvases from workspaces where the user is a member
      const { data, error } = await this.supabase
        .from('whiteboard_canvases')
        .select(
          `
          *,
          workspace:workspaces(name, description),
          idea:ideas(title),
          created_by_profile:user_profiles(first_name, last_name, image_url),
          whiteboard_collaborators(
            user:user_profiles(first_name, last_name, image_url),
            role
          )
        `
        )
        .in('workspace_id', workspaceIds)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching canvases:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCanvases:', error);
      throw error;
    }
  }

  async getCanvas(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('whiteboard_canvases')
        .select(
          `
          *,
          workspace:workspaces(name, description),
          idea:ideas(title),
          created_by_profile:user_profiles(first_name, last_name, image_url),
          whiteboard_collaborators(
            user:user_profiles(first_name, last_name, image_url),
            role
          ),
          whiteboard_versions(
            version_number,
            created_at,
            created_by_profile:user_profiles(first_name, last_name)
          )
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

  async createCanvas(
    canvas: Omit<
      WhiteboardCanvasInsert,
      'id' | 'created_at' | 'updated_at' | 'workspace_id'
    > & { workspace_id?: string },
    clerkUserId: string
  ) {
    try {
      const { data: userProfile, error: userError } = await this.supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (userError) {
        throw new Error('User profile not found');
      }

      if (!canvas.workspace_id) {
        throw new Error('Workspace ID is required');
      }

      // Verify user has access to the workspace
      const { data: workspaceMember, error: memberError } = await this.supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', canvas.workspace_id)
        .eq('user_id', userProfile.id)
        .single();

      if (memberError || !workspaceMember) {
        throw new Error("You don't have access to this workspace");
      }

      const { data, error } = await this.supabase
        .from('whiteboard_canvases')
        .insert({
          ...canvas,
          workspace_id: canvas.workspace_id,
          created_by: userProfile.id,
        })
        .select(
          `
          *,
          workspace:workspaces(name, description),
          idea:ideas(title),
          created_by_profile:user_profiles(first_name, last_name, image_url),
          whiteboard_collaborators(
            user:user_profiles(first_name, last_name, image_url),
            role
          )
        `
        )
        .single();

      if (error) {
        console.error('Error creating canvas:', error);
        throw error;
      }

      // Add creator as owner collaborator
      const { error: collaboratorError } = await this.supabase
        .from('whiteboard_collaborators')
        .insert({
          canvas_id: data.id,
          user_id: userProfile.id,
          role: 'owner',
        });

      if (collaboratorError) {
        console.error('Error adding collaborator:', collaboratorError);
        // Don't throw here as the canvas was created successfully
      }

      return data;
    } catch (error) {
      console.error('Error in createCanvas:', error);
      throw error;
    }
  }

  async updateCanvas(id: string, updates: WhiteboardCanvasUpdate) {
    try {
      const { data, error } = await this.supabase
        .from('whiteboard_canvases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update canvas error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCanvas:', error);
      throw error;
    }
  }

  async saveCanvasData(
    id: string,
    canvasData: TLStoreSnapshot,
    clerkUserId: string
  ) {
    try {
      const { data: userProfile, error: userError } = await this.supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (userError) {
        console.error('User profile not found:', userError);
        throw new Error('User profile not found');
      }

      // Update canvas data
      const { data, error } = await this.supabase
        .from('whiteboard_canvases')
        .update({
          canvas_data: canvasData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Save canvas data error:', error);
        throw error;
      }

      // Get the next version number
      const { data: existingVersions, error: versionQueryError } =
        await this.supabase
          .from('whiteboard_versions')
          .select('version_number')
          .eq('canvas_id', id)
          .order('version_number', { ascending: false })
          .limit(1);

      if (versionQueryError) {
        console.error('Error querying versions:', versionQueryError);
        // Continue without versioning
      } else {
        // Calculate next version number
        const nextVersionNumber =
          existingVersions && existingVersions.length > 0
            ? Math.max(
                ...existingVersions.map(
                  (v: { version_number: number }) => v.version_number
                )
              ) + 1
            : 1;

        // Create version snapshot
        const { error: versionError } = await this.supabase
          .from('whiteboard_versions')
          .insert({
            canvas_id: id,
            version_number: nextVersionNumber,
            canvas_data: canvasData,
            created_by: userProfile.id,
          });

        if (versionError) {
          console.error('Create version error:', versionError);
          // Don't throw here, canvas was saved successfully
        }
      }

      return data;
    } catch (error) {
      console.error('Error in saveCanvasData:', error);
      throw error;
    }
  }

  async addCollaborator(
    canvasId: string,
    userEmail: string,
    role: 'editor' | 'viewer' = 'viewer'
  ) {
    try {
      // Find user by email
      const { data: user, error: userError } = await this.supabase
        .from('user_profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError) {
        throw new Error('User not found');
      }

      // Add collaborator
      const { data, error } = await this.supabase
        .from('whiteboard_collaborators')
        .insert({
          canvas_id: canvasId,
          user_id: user.id,
          role,
        })
        .select()
        .single();

      if (error) {
        console.error('Add collaborator error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in addCollaborator:', error);
      throw error;
    }
  }

  async removeCollaborator(canvasId: string, userId: string) {
    try {
      const { error } = await this.supabase
        .from('whiteboard_collaborators')
        .delete()
        .eq('canvas_id', canvasId)
        .eq('user_id', userId);

      if (error) {
        console.error('Remove collaborator error:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in removeCollaborator:', error);
      throw error;
    }
  }

  async updateCollaboratorRole(
    canvasId: string,
    userId: string,
    role: 'owner' | 'editor' | 'viewer'
  ) {
    try {
      const { data, error } = await this.supabase
        .from('whiteboard_collaborators')
        .update({ role })
        .eq('canvas_id', canvasId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update collaborator role error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCollaboratorRole:', error);
      throw error;
    }
  }

  async deleteCanvas(id: string) {
    try {
      const { error } = await this.supabase
        .from('whiteboard_canvases')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete canvas error:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCanvas:', error);
      throw error;
    }
  }

  async getCanvasVersions(canvasId: string) {
    try {
      const { data, error } = await this.supabase
        .from('whiteboard_versions')
        .select(
          `
          *,
          created_by_profile:user_profiles(first_name, last_name)
        `
        )
        .eq('canvas_id', canvasId)
        .order('version_number', { ascending: false });

      if (error) {
        console.error('Get canvas versions error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCanvasVersions:', error);
      throw error;
    }
  }

  async restoreVersion(canvasId: string, versionNumber: number) {
    try {
      // Get version data
      const { data: version, error: versionError } = await this.supabase
        .from('whiteboard_versions')
        .select('canvas_data')
        .eq('canvas_id', canvasId)
        .eq('version_number', versionNumber)
        .single();

      if (versionError) {
        console.error('Get version error:', versionError);
        throw versionError;
      }

      // Restore canvas data
      const { data, error } = await this.supabase
        .from('whiteboard_canvases')
        .update({
          canvas_data: version.canvas_data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', canvasId)
        .select()
        .single();

      if (error) {
        console.error('Restore version error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in restoreVersion:', error);
      throw error;
    }
  }
}

export const whiteboardsAPI = new WhiteboardsAPI();
