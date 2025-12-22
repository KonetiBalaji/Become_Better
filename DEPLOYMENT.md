# Deployment Guide - Become Better App

## Quick Deployment Steps

### 1. Set Up Free PostgreSQL Database

Choose one of these free options:

#### Option A: Supabase (Recommended)
1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project
4. Go to Settings → Database
5. Copy the "Connection string" (URI format)
6. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

#### Option B: Neon
1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project
4. Copy the connection string from the dashboard
5. It will look like: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### 2. Get API Keys

#### OpenAI API Key (Required for AI Insights)
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

#### Resend API Key (Optional - for email notifications)
1. Go to https://resend.com/api-keys
2. Sign up for free account
3. Create an API key
4. Copy the key

### 3. Deploy to Vercel

#### Method 1: Using Vercel CLI (Current Method)
```bash
# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

#### Method 2: Using Vercel Dashboard
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your repository: `KonetiBalaji/Become_Better`
5. Configure environment variables (see below)
6. Click "Deploy"

### 4. Environment Variables for Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=HKqEegETlaadzEbcM/ckLQ18rNiWmHqMCH6qGNBGarA=
OPENAI_API_KEY=your-openai-api-key
RESEND_API_KEY=your-resend-api-key (optional)
CRON_SECRET=HKqEegETlaadzEbcM/ckLQ18rNiWmHqMCH6qGNBGarA=
```

**Important Notes:**
- Replace `NEXTAUTH_URL` with your actual Vercel deployment URL after first deployment
- The `NEXTAUTH_SECRET` and `CRON_SECRET` should be the same values (or generate new ones)
- After adding DATABASE_URL, you'll need to run database migrations

### 5. Set Up Database Schema

After deployment, you need to push the Prisma schema to your database:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.local
npx prisma db push

# Option 2: Using Prisma directly (if you have DATABASE_URL)
npx prisma db push
```

Or use Vercel's built-in terminal or connect to your database directly.

### 6. Verify Deployment

1. Visit your Vercel deployment URL
2. Register a new account
3. Create a test goal
4. Verify all features work

## Post-Deployment Checklist

- [ ] Database schema pushed successfully
- [ ] Environment variables set in Vercel
- [ ] NEXTAUTH_URL updated to production URL
- [ ] Test user registration
- [ ] Test goal creation
- [ ] Test goal updates
- [ ] Verify AI insights (requires 7 days of data)
- [ ] Test email notifications (if Resend is configured)

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is enabled for cloud databases

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Update NEXTAUTH_URL to match your deployment URL
- Clear browser cookies if needed

### Build Failures
- Check all environment variables are set
- Verify TypeScript compilation passes
- Check Vercel build logs for errors

## Free Tier Limits

### Supabase
- 500 MB database storage
- 2 GB bandwidth
- Perfect for small to medium apps

### Neon
- 0.5 GB storage
- Unlimited projects
- Great for development

### Vercel
- Unlimited personal projects
- 100 GB bandwidth
- Perfect for Next.js apps

### OpenAI
- Pay-as-you-go
- $5 minimum credit
- Check pricing at platform.openai.com

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check database connection
3. Verify all environment variables
4. Review application logs in Vercel dashboard

