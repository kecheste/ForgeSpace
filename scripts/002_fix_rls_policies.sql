-- Drop existing RLS policies that are causing issues
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view workspaces they're members of" ON workspaces;
DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can view ideas in their workspaces" ON ideas;
DROP POLICY IF EXISTS "Users can view idea phases" ON idea_phases;
DROP POLICY IF EXISTS "Users can view comments" ON comments;

-- Temporarily disable RLS to allow user profile creation
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE ideas DISABLE ROW LEVEL SECURITY;
ALTER TABLE idea_phases DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Create a function to get current user ID from clerk_user_id
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- This will be set by the application when making requests
  SELECT id INTO user_id 
  FROM user_profiles 
  WHERE clerk_user_id = current_setting('app.current_user_id', true);
  
  RETURN user_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable RLS with simpler policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create simpler RLS policies
-- User profiles: Allow all operations for now (we'll handle security in the app layer)
CREATE POLICY "Allow all operations on user_profiles" ON user_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Workspaces: Allow users to see workspaces they're members of
CREATE POLICY "Users can view their workspaces" ON workspaces
  FOR SELECT USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = get_current_user_id()
    )
  );

CREATE POLICY "Users can create workspaces" ON workspaces
  FOR INSERT WITH CHECK (owner_id = get_current_user_id());

CREATE POLICY "Workspace owners can update" ON workspaces
  FOR UPDATE USING (owner_id = get_current_user_id());

-- Workspace members: Allow viewing members of workspaces user belongs to
CREATE POLICY "Users can view workspace members" ON workspace_members
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = get_current_user_id()
    )
  );

-- Ideas: Allow users to see ideas in their workspaces
CREATE POLICY "Users can view ideas in their workspaces" ON ideas
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = get_current_user_id()
    )
  );

CREATE POLICY "Users can create ideas" ON ideas
  FOR INSERT WITH CHECK (
    creator_id = get_current_user_id() AND
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = get_current_user_id()
    )
  );

CREATE POLICY "Users can update their ideas" ON ideas
  FOR UPDATE USING (
    creator_id = get_current_user_id() OR
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = get_current_user_id() AND role IN ('owner', 'admin')
    )
  );

-- Idea phases: Allow access to phases of ideas user can see
CREATE POLICY "Users can view idea phases" ON idea_phases
  FOR ALL USING (
    idea_id IN (
      SELECT id FROM ideas WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = get_current_user_id()
      )
    )
  );

-- Comments: Allow access to comments on ideas user can see
CREATE POLICY "Users can view comments" ON comments
  FOR SELECT USING (
    idea_id IN (
      SELECT id FROM ideas WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = get_current_user_id()
      )
    )
  );

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (
    user_id = get_current_user_id() AND
    idea_id IN (
      SELECT id FROM ideas WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = get_current_user_id()
      )
    )
  );
