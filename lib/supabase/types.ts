export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: 'personal' | 'team';
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          type: 'personal' | 'team';
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          type?: 'personal' | 'team';
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          joined_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          joined_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          joined_at?: string;
        };
      };
      ideas: {
        Row: {
          id: string;
          title: string;
          description: string;
          phase: 'inception' | 'refinement' | 'planning' | 'execution_ready';
          workspace_id: string;
          creator_id: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          phase?: 'inception' | 'refinement' | 'planning' | 'execution_ready';
          workspace_id: string;
          creator_id: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          phase?: 'inception' | 'refinement' | 'planning' | 'execution_ready';
          workspace_id?: string;
          creator_id?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      idea_phases: {
        Row: {
          id: string;
          idea_id: string;
          phase: 'inception' | 'refinement' | 'planning' | 'execution_ready';
          content: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idea_id: string;
          phase: 'inception' | 'refinement' | 'planning' | 'execution_ready';
          content?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          idea_id?: string;
          phase?: 'inception' | 'refinement' | 'planning' | 'execution_ready';
          content?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          idea_id: string;
          phase:
            | 'inception'
            | 'refinement'
            | 'planning'
            | 'execution_ready'
            | null;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idea_id: string;
          phase?:
            | 'inception'
            | 'refinement'
            | 'planning'
            | 'execution_ready'
            | null;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          idea_id?: string;
          phase?:
            | 'inception'
            | 'refinement'
            | 'planning'
            | 'execution_ready'
            | null;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          clerk_user_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      whiteboard_canvases: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: 'mindmap' | 'flowchart' | 'timeline' | 'freeform';
          workspace_id: string;
          idea_id: string | null;
          created_by: string;
          canvas_data: CanvasData;
          thumbnail_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          type?: 'mindmap' | 'flowchart' | 'timeline' | 'freeform';
          workspace_id: string;
          idea_id?: string | null;
          created_by: string;
          canvas_data?: CanvasData;
          thumbnail_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          type?: 'mindmap' | 'flowchart' | 'timeline' | 'freeform';
          workspace_id?: string;
          idea_id?: string | null;
          created_by?: string;
          canvas_data?: CanvasData;
          thumbnail_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      whiteboard_collaborators: {
        Row: {
          id: string;
          canvas_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          joined_at: string;
        };
        Insert: {
          id?: string;
          canvas_id: string;
          user_id: string;
          role?: 'owner' | 'editor' | 'viewer';
          joined_at?: string;
        };
        Update: {
          id?: string;
          canvas_id?: string;
          user_id?: string;
          role?: 'owner' | 'editor' | 'viewer';
          joined_at?: string;
        };
      };
      whiteboard_versions: {
        Row: {
          id: string;
          canvas_id: string;
          version_number: number;
          canvas_data: CanvasData;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          canvas_id: string;
          version_number: number;
          canvas_data: CanvasData;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          canvas_id?: string;
          version_number?: number;
          canvas_data?: CanvasData;
          created_by?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

type CanvasData = {
  id: string;
  name: string;
};
