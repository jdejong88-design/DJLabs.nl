# AI SaaS Platform Design

**Date:** March 14, 2026
**Status:** Approved
**Timeline:** 1-2 months MVP

## Product Overview

An AI-powered SaaS platform that provides coding, web development, web design, and marketing assistance to freelancers, solo developers, and agencies. Full-featured launch with initial focus on developer and designer professionals.

## Architecture & Technology Stack

**Frontend:** Next.js App Router with React and TypeScript, deployed on Vercel
**Backend:** Next.js API routes (monolithic approach)
**Database:** Supabase PostgreSQL
**Authentication:** Supabase Auth (email/password + social logins)
**Real-time:** Supabase Realtime for live team collaboration
**AI Integration:** OpenAI API (or Claude API)
**Styling:** Tailwind CSS

Single Next.js monolith for fastest MVP development — frontend and backend together eliminate deployment complexity.

## Core Features & Modules

### 1. Authentication & User Management
- Email/password signup and login via Supabase Auth
- User profiles with workspace/team setup
- Team invite system (for agencies)
- Role-based access control (Owner, Editor, Viewer)

### 2. AI Assistance Tools
- **Code Generator:** Write code from prompts (multiple languages)
- **Web Development Helper:** HTML/CSS/JS assistance, debugging
- **Design Advisor:** UI/UX recommendations, design system help
- **Marketing Copy Writer:** Ad copy, landing page text, social media content
- **AI Chat Interface:** General assistant accessible from all tools

### 3. Dashboard & Workspace
- Project/workspace management
- Tool library (access all AI tools from one place)
- Usage analytics (API calls, tokens used)
- History/saved outputs

### 4. Team Collaboration (for agencies)
- Team members management
- Shared projects
- Real-time cursors/updates (Supabase Realtime)
- Comments on generated content
- Permission levels per project

### 5. Billing & Subscription
- Free tier (limited API calls, e.g., 10 requests/day)
- Pro tier ($29/month, higher limits)
- Stripe integration for payments

## Database Schema

```sql
-- Users table (Supabase Auth handles passwords)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP
);

-- Teams/Workspaces
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  name TEXT,
  billing_plan TEXT DEFAULT 'free',
  created_at TIMESTAMP
);

-- Team Members with roles
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  role TEXT (owner, editor, viewer),
  created_at TIMESTAMP
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  name TEXT,
  description TEXT,
  created_at TIMESTAMP
);

-- AI Usage tracking
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tool_type TEXT,
  tokens_used INTEGER,
  api_cost DECIMAL,
  created_at TIMESTAMP
);

-- Saved AI Outputs
CREATE TABLE saved_outputs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  tool_type TEXT,
  input_prompt TEXT,
  output_text TEXT,
  created_at TIMESTAMP
);

-- Team Invites
CREATE TABLE team_invites (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  invited_email TEXT,
  role TEXT,
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  used_at TIMESTAMP
);
```

## User Flows

### Onboarding (New User)
1. Sign up with email/password
2. Create workspace name
3. Land on dashboard
4. See prompt to start using tools

### Using an AI Tool
1. Select tool from dashboard (e.g., Code Generator)
2. Enter prompt + optional context
3. Click "Generate"
4. AI API call processes request
5. Result displays with options: Copy, Save, Regenerate, Share

### Team Collaboration
1. Owner invites team members via email
2. Members accept and join workspace
3. View/comment on shared projects
4. Real-time updates via Supabase Realtime

## AI Integration

- **API Provider:** OpenAI (GPT-4) or Claude API
- **Streaming Responses:** For long outputs (code, writing)
- **Token Tracking:** Per-request for billing accuracy
- **Rate Limiting:**
  - Free tier: 10 requests/day
  - Pro tier: Unlimited

## Error Handling & Security

### Error Handling
- API failures: User-friendly messages, retry prompts
- Rate limiting: Show remaining requests, offer upgrade
- Auth errors: Redirect to login, session timeout messages
- Input validation: Client-side validation (10-5000 char prompts)

### Security
- Supabase Auth: Password hashing, session management
- API Routes: Authentication checks before processing
- RLS (Row Level Security): Users only see their own data
- Environment variables: API keys never exposed to client

## Success Criteria for MVP

- ✅ Users can sign up and create workspaces
- ✅ All 5 AI tools functional and returning quality responses
- ✅ Dashboard displays projects and usage analytics
- ✅ Team invites work and members can collaborate
- ✅ Free and Pro tiers with rate limiting
- ✅ Smooth, responsive UI (Tailwind CSS)
- ✅ Deployable to Vercel (no server infrastructure needed)

## Known Constraints

- **Timeline:** 1-2 months (scope is tight)
- **Team Size:** Single developer expected
- **Billing:** Basic Stripe integration only (no complex invoicing)
- **Real-time:** Supabase Realtime covers basic presence, not advanced conflict resolution

## Next Steps

1. ✅ Design approved
2. → Create implementation plan (invoke writing-plans skill)
3. → Set up Next.js project structure
4. → Build authentication flow
5. → Implement dashboard and tool interfaces
6. → Integrate AI APIs
7. → Add team collaboration and billing
8. → Deploy to Vercel
