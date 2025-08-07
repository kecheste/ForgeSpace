-- Temporarily disable RLS on whiteboard tables for testing
-- This will help us identify if RLS is the issue

-- Disable RLS on whiteboard tables
ALTER TABLE whiteboard_canvases DISABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboard_collaborators DISABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboard_versions DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on related tables if needed
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY; 