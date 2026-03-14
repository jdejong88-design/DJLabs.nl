-- Users table (Supabase Auth handles auth, we extend with profile data)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  billing_plan TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Teams/Workspaces
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  billing_plan TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members with roles
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Usage tracking
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_type TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  api_cost DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved AI Outputs
CREATE TABLE IF NOT EXISTS saved_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  tool_type TEXT NOT NULL,
  input_prompt TEXT NOT NULL,
  output_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Invites
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'editor',
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  used_at TIMESTAMP
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view teams they're members of" ON teams
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS(SELECT 1 FROM team_members WHERE team_members.team_id = teams.id AND team_members.user_id = auth.uid())
  );

CREATE POLICY "Users can view their team members" ON team_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS(SELECT 1 FROM team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid())
  );

CREATE POLICY "Users can view team projects" ON projects
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM team_members WHERE team_members.team_id = projects.team_id AND team_members.user_id = auth.uid())
  );

CREATE POLICY "Users can view own usage" ON ai_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own outputs" ON saved_outputs
  FOR SELECT USING (user_id = auth.uid());
