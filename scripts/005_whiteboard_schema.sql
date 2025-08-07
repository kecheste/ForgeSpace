-- Whiteboard Canvas Schema
-- This adds support for visual idea boards, mind maps, and collaborative whiteboards

-- Create whiteboard_canvases table
CREATE TABLE whiteboard_canvases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('mindmap', 'flowchart', 'timeline', 'freeform')) NOT NULL DEFAULT 'freeform',
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  created_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  canvas_data JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create whiteboard_collaborators table
CREATE TABLE whiteboard_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  canvas_id UUID REFERENCES whiteboard_canvases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) NOT NULL DEFAULT 'viewer',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(canvas_id, user_id)
);

-- Create whiteboard_versions table for version history
CREATE TABLE whiteboard_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  canvas_id UUID REFERENCES whiteboard_canvases(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  canvas_data JSONB NOT NULL,
  created_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(canvas_id, version_number)
);

-- Create indexes for better performance
CREATE INDEX idx_whiteboard_canvases_workspace_id ON whiteboard_canvases(workspace_id);
CREATE INDEX idx_whiteboard_canvases_idea_id ON whiteboard_canvases(idea_id);
CREATE INDEX idx_whiteboard_canvases_created_by ON whiteboard_canvases(created_by);
CREATE INDEX idx_whiteboard_canvases_type ON whiteboard_canvases(type);
CREATE INDEX idx_whiteboard_collaborators_canvas_id ON whiteboard_collaborators(canvas_id);
CREATE INDEX idx_whiteboard_collaborators_user_id ON whiteboard_collaborators(user_id);
CREATE INDEX idx_whiteboard_versions_canvas_id ON whiteboard_versions(canvas_id);

-- Enable Row Level Security
ALTER TABLE whiteboard_canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboard_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboard_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for whiteboard_canvases
CREATE POLICY "Users can view canvases in their workspaces" ON whiteboard_canvases
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = get_current_user_id()
    )
  );

CREATE POLICY "Users can create canvases in their workspaces" ON whiteboard_canvases
  FOR INSERT WITH CHECK (
    created_by = get_current_user_id() AND
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = get_current_user_id()
    )
  );

CREATE POLICY "Canvas owners and editors can update" ON whiteboard_canvases
  FOR UPDATE USING (
    id IN (
      SELECT canvas_id FROM whiteboard_collaborators 
      WHERE user_id = get_current_user_id() AND role IN ('owner', 'editor')
    )
  );

-- Create RLS policies for whiteboard_collaborators
CREATE POLICY "Users can view collaborators of their canvases" ON whiteboard_collaborators
  FOR SELECT USING (
    canvas_id IN (
      SELECT id FROM whiteboard_canvases 
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = get_current_user_id()
      )
    )
  );

CREATE POLICY "Canvas owners can manage collaborators" ON whiteboard_collaborators
  FOR ALL USING (
    canvas_id IN (
      SELECT id FROM whiteboard_canvases 
      WHERE created_by = get_current_user_id()
    )
  );

-- Create RLS policies for whiteboard_versions
CREATE POLICY "Users can view versions of their canvases" ON whiteboard_versions
  FOR SELECT USING (
    canvas_id IN (
      SELECT id FROM whiteboard_canvases 
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = get_current_user_id()
      )
    )
  );

CREATE POLICY "Canvas owners and editors can create versions" ON whiteboard_versions
  FOR INSERT WITH CHECK (
    canvas_id IN (
      SELECT canvas_id FROM whiteboard_collaborators 
      WHERE user_id = get_current_user_id() AND role IN ('owner', 'editor')
    )
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_whiteboard_canvas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_whiteboard_canvas_updated_at
  BEFORE UPDATE ON whiteboard_canvases
  FOR EACH ROW
  EXECUTE FUNCTION update_whiteboard_canvas_updated_at(); 