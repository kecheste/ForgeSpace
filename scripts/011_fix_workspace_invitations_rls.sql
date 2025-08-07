-- Fix RLS policies for workspace_invitations table
-- Apply simple allow-all policies like other tables

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view workspace invitations" ON workspace_invitations;
DROP POLICY IF EXISTS "Admins can create workspace invitations" ON workspace_invitations;
DROP POLICY IF EXISTS "Users can update their invitations" ON workspace_invitations;

-- Create simple allow-all policy for testing
CREATE POLICY "Allow all operations on workspace_invitations" ON workspace_invitations
  FOR ALL USING (true); 