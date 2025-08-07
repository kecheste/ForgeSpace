-- Simple Whiteboard RLS Policies
-- This creates basic policies that allow users to manage their own canvases

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view canvases in their workspaces" ON whiteboard_canvases;
DROP POLICY IF EXISTS "Users can create canvases in their workspaces" ON whiteboard_canvases;
DROP POLICY IF EXISTS "Canvas owners and editors can update" ON whiteboard_canvases;
DROP POLICY IF EXISTS "Users can view collaborators of their canvases" ON whiteboard_collaborators;
DROP POLICY IF EXISTS "Canvas owners can manage collaborators" ON whiteboard_collaborators;

-- Create simple policies for whiteboard_canvases
CREATE POLICY "Users can view their own canvases" ON whiteboard_canvases
  FOR SELECT USING (created_by = get_current_user_id());

CREATE POLICY "Users can create their own canvases" ON whiteboard_canvases
  FOR INSERT WITH CHECK (created_by = get_current_user_id());

CREATE POLICY "Users can update their own canvases" ON whiteboard_canvases
  FOR UPDATE USING (created_by = get_current_user_id());

-- Create simple policies for whiteboard_collaborators
CREATE POLICY "Users can view collaborators of their canvases" ON whiteboard_collaborators
  FOR SELECT USING (
    canvas_id IN (
      SELECT id FROM whiteboard_canvases WHERE created_by = get_current_user_id()
    )
  );

CREATE POLICY "Canvas owners can manage collaborators" ON whiteboard_collaborators
  FOR ALL USING (
    canvas_id IN (
      SELECT id FROM whiteboard_canvases WHERE created_by = get_current_user_id()
    )
  );

-- Create simple policies for whiteboard_versions
CREATE POLICY "Users can view versions of their canvases" ON whiteboard_versions
  FOR SELECT USING (
    canvas_id IN (
      SELECT id FROM whiteboard_canvases WHERE created_by = get_current_user_id()
    )
  );

CREATE POLICY "Users can create versions for their canvases" ON whiteboard_versions
  FOR INSERT WITH CHECK (
    canvas_id IN (
      SELECT id FROM whiteboard_canvases WHERE created_by = get_current_user_id()
    )
  ); 