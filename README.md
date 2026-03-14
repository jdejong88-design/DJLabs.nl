# AI SaaS Platform

An AI-powered SaaS platform providing coding, web development, design, and marketing assistance.

## Tech Stack

- **Frontend**: Next.js 15+ with React 18
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **AI**: OpenAI API
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Features

- 5 AI-powered tools (Code Generator, Web Dev Helper, Design Advisor, Marketing Copy, AI Chat)
- User authentication with email/password
- Team management and invitations
- Usage analytics and tracking
- Stripe subscription billing
- Real-time collaboration with Supabase Realtime
- Responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-saas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   OPENAI_API_KEY=your_openai_key
   STRIPE_SECRET_KEY=your_stripe_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Prerequisites
- GitHub account with your repository pushed
- Vercel account

### Deployment Steps

1. **Connect GitHub**:
   - Push your code to a GitHub repository
   - Ensure `vercel.json` is included in your repository

2. **Deploy on Vercel**:
   - Go to [https://vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Select your GitHub repository from the list
   - Vercel will automatically detect this is a Next.js project

3. **Configure Environment Variables**:
   - In the Vercel dashboard, navigate to your project
   - Go to Settings → Environment Variables
   - Add all required variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `OPENAI_API_KEY`
     - `STRIPE_SECRET_KEY`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Ensure variables are available in Production, Preview, and Development environments as needed

4. **Deploy**:
   - Click "Deploy" button
   - Wait for the build to complete (typically 2-5 minutes)
   - Your application will be available at your Vercel project URL

5. **Test Your Deployment**:
   - Visit your deployed URL
   - Test user authentication (sign up / login)
   - Generate content with AI tools
   - Create and manage teams
   - View usage analytics
   - Test billing and subscription pages

### Automatic Deployments

After initial deployment:
- Every push to your main branch triggers automatic deployment
- Preview deployments are created for pull requests
- Rollback to previous deployments is available in the Vercel dashboard

## Project Structure

```
app/
  ├── (auth)/
  │   ├── login/
  │   ├── signup/
  ├── dashboard/
  │   ├── analytics/
  │   └── page.tsx
  ├── tools/
  │   ├── code-generator/
  │   ├── web-dev/
  │   ├── design/
  │   ├── marketing/
  │   └── chat/
  ├── team/
  ├── settings/
  │   └── billing/
  ├── api/
  │   ├── generate/
  │   └── stripe/
  └── layout.tsx
lib/
  ├── supabase.ts
  ├── ai.ts
  ├── team.ts
  ├── stripe.ts
  └── realtime.ts
components/
  ├── Navbar.tsx
  └── AuthProvider.tsx
```

## Available Scripts

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server locally
- `npm run lint` - Run ESLint to check code quality

## Database Schema

The app uses Supabase PostgreSQL with the following main tables:

- **users** - User profiles and account information
- **teams** - Team/workspace management
- **team_members** - Team membership and roles
- **projects** - Projects within teams
- **ai_usage** - Usage tracking and analytics
- **saved_outputs** - AI generation history and outputs
- **team_invites** - Pending team invitations

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### AI Tools
- `POST /api/generate/code` - Code generation
- `POST /api/generate/web-dev` - Web development assistance
- `POST /api/generate/design` - Design advice
- `POST /api/generate/marketing` - Marketing copy generation
- `POST /api/generate/chat` - AI chat endpoint

### Billing
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Stripe webhook handler

### Teams
- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create new team
- `POST /api/teams/:id/invite` - Invite team member

## Environment Variables Reference

### Public Variables (accessible in browser)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

### Secret Variables (server-only)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for admin operations
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing

## Performance Optimization

- SWC minification enabled for faster builds
- Next.js automatic code splitting
- Image optimization with next/image
- Tailwind CSS purging of unused styles
- React strict mode enabled for development

## Support

For issues and questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed information
3. Include environment details (Node version, browser, OS)

## License

MIT
