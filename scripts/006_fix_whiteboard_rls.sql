-- Fix Whiteboard RLS Policies
-- This allows creating canvases without requiring a workspace

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view canvases in their workspaces" ON whiteboard_canvases;
DROP POLICY IF EXISTS "Users can create canvases in their workspaces" ON whiteboard_canvases;
DROP POLICY IF EXISTS "Canvas owners and editors can update" ON whiteboard_canvases;

-- Create new policies that allow canvases without workspaces
CREATE POLICY "Users can view their own canvases" ON whiteboard_canvases
  FOR SELECT USING (
    created_by = get_current_user_id() OR
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = get_current_user_id()
    )
  );

CREATE POLICY "Users can create canvases" ON whiteboard_canvases
  FOR INSERT WITH CHECK (
    created_by = get_current_user_id()
  );

CREATE POLICY "Canvas owners and editors can update" ON whiteboard_canvases
  FOR UPDATE USING (
    created_by = get_current_user_id() OR
    id IN (
      SELECT canvas_id FROM whiteboard_collaborators 
      WHERE user_id = get_current_user_id() AND role IN ('owner', 'editor')
    )
  );

-- Also allow users to view canvases they collaborate on
CREATE POLICY "Collaborators can view canvases" ON whiteboard_canvases
  FOR SELECT USING (
    id IN (
      SELECT canvas_id FROM whiteboard_collaborators 
      WHERE user_id = get_current_user_id()
    )
  ); 