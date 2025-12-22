# Quick Start - Make Your App Live in 10 Minutes

## Step 1: Get a Free Database (5 minutes)

### Using Supabase (Easiest):
1. Visit: https://supabase.com
2. Click "Start your project" → Sign up with GitHub
3. Click "New Project"
4. Fill in:
   - Name: `become-better-db`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Wait 2 minutes for setup
6. Go to **Settings** → **Database**
7. Find "Connection string" → Copy the **URI** format
   - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

### Using Neon (Alternative):
1. Visit: https://neon.tech
2. Sign up with GitHub
3. Click "Create a project"
4. Copy the connection string from the dashboard

## Step 2: Get API Keys (3 minutes)

### OpenAI API Key:
1. Visit: https://platform.openai.com/api-keys
2. Sign up/login
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Important**: Add $5 credit to your account (minimum)

### Resend API Key (Optional):
1. Visit: https://resend.com/api-keys
2. Sign up
3. Create API key
4. Copy the key

## Step 3: Deploy to Vercel (2 minutes)

### Option A: Via Vercel Dashboard (Recommended)
1. Visit: https://vercel.com
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import: `KonetiBalaji/Become_Better`
5. Click **"Deploy"** (use default settings)
6. After deployment, go to **Settings** → **Environment Variables**
7. Add these variables:

```
DATABASE_URL = [your-supabase-connection-string]
NEXTAUTH_URL = https://your-app-name.vercel.app
NEXTAUTH_SECRET = HKqEegETlaadzEbcM/ckLQ18rNiWmHqMCH6qGNBGarA=
OPENAI_API_KEY = [your-openai-key]
RESEND_API_KEY = [your-resend-key] (optional)
CRON_SECRET = HKqEegETlaadzEbcM/ckLQ18rNiWmHqMCH6qGNBGarA=
```

8. **Important**: Update `NEXTAUTH_URL` with your actual Vercel URL
9. Click **"Redeploy"** after adding variables

### Option B: Via Vercel CLI
```bash
# Login (opens browser)
vercel login

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add OPENAI_API_KEY
vercel env add CRON_SECRET

# Deploy to production
vercel --prod
```

## Step 4: Set Up Database Schema

After deployment, you need to push the database schema:

### Method 1: Using Vercel CLI
```bash
# Pull environment variables
vercel env pull .env.local

# Push schema
npx prisma db push
```

### Method 2: Using Supabase SQL Editor
1. Go to your Supabase project
2. Click **SQL Editor**
3. Run this to check if tables exist (they should be created automatically on first API call)
4. Or use Prisma Studio: `npx prisma studio` (connects to your database)

### Method 3: Direct Database Connection
```bash
# Set DATABASE_URL in your terminal
$env:DATABASE_URL="your-connection-string"

# Push schema
npx prisma db push
```

## Step 5: Test Your Live App

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Click **Register** to create an account
3. Create your first goal
4. Add daily updates
5. After 7 days, test AI insights!

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Verify database is running
- Check if connection string includes password

### "Authentication error"
- Verify NEXTAUTH_SECRET is set
- Update NEXTAUTH_URL to your Vercel URL
- Redeploy after changing environment variables

### "OpenAI API error"
- Check API key is correct
- Verify you have credits in OpenAI account
- Check API usage limits

## Your App is Now Live! 🎉

Your application URL: `https://your-app-name.vercel.app`

Share it with friends and start tracking your goals!

## Next Steps

- Customize the app design
- Add more features
- Set up custom domain (Vercel Pro)
- Monitor usage in Vercel dashboard

## Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Review Vercel deployment logs
- Check database connection in Supabase dashboard
- Verify all environment variables are set

