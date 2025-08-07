import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type UserProfileInsert =
  Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate =
  Database['public']['Tables']['user_profiles']['Update'];

export class UsersAPI {
  private supabase = createClient();

  async createOrUpdateProfile(profile: UserProfileInsert) {
    try {
      const { data: existingProfile } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', profile.clerk_user_id)
        .single();

      if (existingProfile) {
        return await this.updateProfile(existingProfile.id, {
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          image_url: profile.image_url,
        });
      }

      const { data, error } = await this.supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) {
        if (error.message.includes('policy') || error.message.includes('RLS')) {
          throw error;
        }

        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileId: string, updates: UserProfileUpdate) {
    if (
      updates.first_name === '' ||
      updates.first_name === null ||
      updates.last_name === '' ||
      updates.last_name === null
    ) {
      updates = {
        clerk_user_id: updates.clerk_user_id,
        id: profileId,
        created_at: updates.created_at,
        email: updates.email,
        image_url: updates.image_url,
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId)
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

  async getProfile(clerkUserId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUserById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
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
}

export const usersAPI = new UsersAPI();
