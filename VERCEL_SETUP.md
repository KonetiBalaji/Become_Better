# Vercel Setup Guide for Become Better

This guide will help you deploy your application to Vercel with Vercel Postgres.

## 🗄️ Database: Vercel Postgres

Your project is already configured to use **PostgreSQL** (which is what Vercel Postgres uses), so you're all set!

## 📋 Setup Steps

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Set Up Vercel Postgres

1. In your Vercel project dashboard, go to **"Storage"** tab
2. Click **"Create Database"** → Select **"Postgres"**
3. Choose a name for your database (e.g., `become-better-db`)
4. Select a region closest to your users
5. Click **"Create"**

### 4. Configure Environment Variables

In your Vercel project **Settings** → **Environment Variables**, add:

#### Required Variables:

```
DATABASE_URL=<your-direct-postgres-connection-string>
PRISMA_ACCELERATE_URL=<your-prisma-accelerate-connection-string>
```

**For Prisma Accelerate (Recommended):**
- If you're using Prisma Accelerate, use the `prisma+postgres://` connection string
- The app will automatically use Accelerate for better performance

**For Vercel Postgres:**
- Go to your Postgres database in Vercel
- Click **".env.local"** tab
- Copy the `POSTGRES_URL` value
- Use it as `DATABASE_URL` in environment variables

#### Additional Variables (if needed):

```
NEXTAUTH_SECRET=<generate-a-random-secret>
NEXTAUTH_URL=https://your-app.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Run Database Migrations

After setting up the database, you need to create the tables:

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run Prisma migrations
npx prisma migrate deploy
```

#### Option B: Using Prisma Studio (Local)

1. Set `DATABASE_URL` in your local `.env.local` file
2. Run migrations:
```bash
npx prisma migrate dev --name init
```

#### Option C: Using Vercel's Build Command

Add to your `package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Then in Vercel project settings:
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `.next`

### 6. Deploy

1. Push any changes to trigger a new deployment
2. Or manually deploy from Vercel dashboard
3. Wait for build to complete

## 🔧 Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] Environment variables set correctly
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Verify database connection

## 🐛 Troubleshooting

### Database Connection Issues

If you see connection errors:
1. Verify `DATABASE_URL` is set correctly
2. Check that the database is in the same region as your app
3. Ensure Prisma migrations ran successfully

### Migration Issues

If migrations fail:
```bash
# Reset and re-run (⚠️ WARNING: This deletes all data)
npx prisma migrate reset

# Or create a new migration
npx prisma migrate dev --name fix-schema
```

### Prisma Client Not Found

Make sure `prisma generate` runs during build:
```bash
npx prisma generate
```

## 📚 Additional Resources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

## 🎯 Quick Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration-name

# Deploy migrations (production)
npx prisma migrate deploy

# View database in Prisma Studio
npx prisma studio

# Push schema changes (development only)
npx prisma db push
```

---

**Note:** After updating the schema to make fields optional, you'll need to create and run a migration:

```bash
npx prisma migrate dev --name make-user-fields-optional
```

This will update your database schema to match the new Prisma schema.

