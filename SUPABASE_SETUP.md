# Supabase CLI Setup Guide

This guide covers local Supabase development, database management, and deployment with the Supabase CLI.

## Table of Contents
1. [Installation](#installation)
2. [Starting Local Development](#starting-local-development)
3. [Database Management](#database-management)
4. [Migrations](#migrations)
5. [Common Commands](#common-commands)
6. [Troubleshooting](#troubleshooting)

---

## Installation

The Supabase CLI is already installed as a dev dependency. Verify installation:

```bash
npx supabase --version
```

---

## Starting Local Development

### Option 1: Start Supabase Only
```bash
npm run supabase:start
```

This starts all local Supabase services:
- **API**: http://127.0.0.1:54321
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Studio**: http://127.0.0.1:54323 ← **Open this in browser**
- **Inbucket (Email)**: http://127.0.0.1:54324

### Option 2: Start Supabase + Next.js App (Recommended)
```bash
npm run dev:local
```

This runs Supabase + Next.js development server in parallel:
- App: http://localhost:3000
- Supabase Studio: http://127.0.0.1:54323
- Database: 127.0.0.1:54322

### Stop Supabase
```bash
npm run supabase:stop
```

---

## Database Management

### Configuration
- **Config file**: `supabase/config.toml`
- **Migrations directory**: `supabase/migrations/`
- **Port**: 54322 (PostgreSQL)
- **User**: `postgres`
- **Password**: `postgres`

### Reset Database (Rerun Migrations + Seeds)
```bash
npm run supabase:reset
```

This will:
1. Drop all data and schema
2. Rerun all migrations from `supabase/migrations/`
3. Seed the database with `supabase/seed.sql`

### Push Database Changes to Remote
```bash
npm run db:push
```

Pushes local migrations to your Supabase cloud project (requires authentication).

### Pull Schema from Remote
```bash
npm run db:pull
```

Pulls the schema from your Supabase cloud project and creates a new migration.

### Generate Migration Diff
```bash
npm run db:diff
```

Compares your local schema with the shadow database and generates a migration.

---

## Migrations

### Understanding Migrations

The project uses **versioned SQL migrations** stored in `supabase/migrations/`:

```
supabase/migrations/
├── 001_initial_schema.sql    ← Creates tables, indexes, RLS policies
```

Each migration file:
- Is numbered sequentially (001, 002, 003, etc.)
- Contains SQL DDL statements
- Runs once per environment
- Is version-controlled in git

### Creating New Migrations

#### Method 1: Auto-Generate (Recommended)
```bash
npx supabase db diff --name <migration_name>
```

Example:
```bash
npx supabase db diff --name add_notifications_table
```

This:
1. Compares your local schema with shadow database
2. Generates a new numbered migration file
3. Saves to `supabase/migrations/`

#### Method 2: Manual SQL
Create a new file in `supabase/migrations/`:

```sql
-- supabase/migrations/002_add_notifications.sql

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX notifications_user_id_idx ON public.notifications(user_id);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own notifications
CREATE POLICY "users_read_own_notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Applying Migrations

Local:
```bash
npm run supabase:reset
```

Remote:
```bash
npm run db:push
```

---

## Common Commands

### Check Status
```bash
npm run supabase:status
```

Shows what services are running on which ports.

### View Database Logs
```bash
npx supabase logs --project-ref=zealous-newton
```

### Access Database Directly
```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

Then run SQL commands:
```sql
\dt                           -- List tables
SELECT * FROM public.users;   -- Query data
```

### Reset Everything
```bash
npm run supabase:stop
npm run supabase:start
npm run supabase:reset
```

---

## Configuration

### Important Settings in `supabase/config.toml`

**Database**
```toml
[db]
port = 54322                    # Database port
major_version = 17              # PostgreSQL version
```

**API & Studio**
```toml
[api]
port = 54321                    # API port
[studio]
port = 54323                    # Studio port
```

**Authentication**
```toml
[auth]
site_url = "http://127.0.0.1:3000"              # App URL
enable_signup = true                             # Allow registrations
jwt_expiry = 3600                                # Token expiry (1 hour)
```

**Storage**
```toml
[storage]
enabled = true
file_size_limit = "50MiB"
```

---

## Environment Variables

### Local Development (`.env.local`)

```env
# Local Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Production (`.env.production`)

```env
# Cloud Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_...
SUPABASE_SERVICE_ROLE_KEY=sbprvt_...
DATABASE_URL=postgresql://postgres:...@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

---

## Troubleshooting

### Supabase won't start
**Problem**: `docker` is not running or not installed

**Solution**:
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Start Docker
3. Run `npm run supabase:start` again

### Port already in use
**Problem**: Port 54321, 54322, 54323, or 54324 is already in use

**Solution**:
```bash
# Find what's using the port (example: 54321)
lsof -i :54321

# Kill the process
kill -9 <PID>

# Or change ports in supabase/config.toml
```

### Migrations not running
**Problem**: Migrations in `supabase/migrations/` aren't applying

**Solution**:
1. Check config.toml has migrations enabled:
   ```toml
   [db.migrations]
   enabled = true
   schema_paths = ["./migrations/*.sql"]
   ```

2. Verify migration files exist:
   ```bash
   ls -la supabase/migrations/
   ```

3. Reset database:
   ```bash
   npm run supabase:reset
   ```

### Cannot connect to database
**Problem**: Connection string doesn't work

**Solution**:
1. Verify Supabase is running:
   ```bash
   npm run supabase:status
   ```

2. Check DATABASE_URL in `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
   ```

3. Test connection:
   ```bash
   psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT NOW();"
   ```

### Data lost after restart
**Note**: By default, local Supabase stores data in a Docker container. If you delete the container, data is lost.

To persist data:
```toml
# In supabase/config.toml
[db]
postgres_config_append = """
  shared_preload_libraries = 'pg_stat_statements'
"""
```

---

## Next Steps

1. **Start local development**: `npm run dev:local`
2. **Open Studio**: http://127.0.0.1:54323
3. **Test authentication**: Sign up and log in via the app
4. **Create migrations**: Use `npx supabase db diff` for schema changes
5. **Deploy**: Use `npm run db:push` to deploy migrations to production

---

## Resources

- [Supabase CLI Docs](https://supabase.com/docs/reference/cli/usage)
- [Local Development Guide](https://supabase.com/docs/guides/local-development)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Policy Examples](https://supabase.com/docs/guides/auth/row-level-security)
