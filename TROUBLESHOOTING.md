# Troubleshooting Guide

## Server-Side Error: "a server-side exception has occurred"

This error typically occurs due to one of the following issues:

### 1. Database Connection Issues

**Symptoms:**
- Application error on page load
- Server logs show database connection errors

**Solutions:**

1. **Verify Environment Variables in Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Ensure these are set:
     - `DATABASE_URL` (required)
     - `PRISMA_ACCELERATE_URL` (optional, but recommended)
     - `NEXTAUTH_SECRET` (required)
     - `NEXTAUTH_URL` (required - your Vercel app URL)

2. **Check Connection String Format:**
   - Direct connection: `postgres://user:password@host:5432/database?sslmode=require`
   - Prisma Accelerate: `prisma+postgres://accelerate.prisma-data.net/?api_key=...`

3. **Test Database Connection:**
   ```bash
   # Locally, test with:
   npx prisma db push
   ```

### 2. Prisma Client Not Generated

**Symptoms:**
- Build succeeds but runtime errors occur
- "Cannot find module '@prisma/client'" errors

**Solutions:**

1. **Verify Build Process:**
   - Check that `postinstall` script runs: `"postinstall": "prisma generate"`
   - Check that build script includes: `"build": "prisma generate && next build"`

2. **Manually Generate Client:**
   ```bash
   npx prisma generate
   ```

3. **Clear Cache and Rebuild:**
   ```bash
   rm -rf .next node_modules/.prisma
   npm install
   npm run build
   ```

### 3. Missing Environment Variables

**Symptoms:**
- App works locally but fails on Vercel
- Database queries fail

**Solutions:**

1. **Set All Required Variables in Vercel:**
   - `DATABASE_URL` - Your database connection string
   - `PRISMA_ACCELERATE_URL` - Prisma Accelerate connection (optional)
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

2. **Redeploy After Setting Variables:**
   - Environment variables require a new deployment to take effect

### 4. Database Schema Not Synced

**Symptoms:**
- "Table does not exist" errors
- Prisma query errors

**Solutions:**

1. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

2. **Or Push Schema:**
   ```bash
   npx prisma db push
   ```

### 5. Prisma Accelerate Connection Issues

**Symptoms:**
- Works with direct connection but fails with Accelerate
- Timeout errors

**Solutions:**

1. **Verify Accelerate URL Format:**
   - Should start with `prisma+postgres://`
   - Should include valid API key

2. **Fallback to Direct Connection:**
   - If Accelerate fails, remove `PRISMA_ACCELERATE_URL`
   - App will automatically use `DATABASE_URL`

### 6. NextAuth Configuration Issues

**Symptoms:**
- Authentication errors
- Session not persisting

**Solutions:**

1. **Verify NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

2. **Check NEXTAUTH_URL:**
   - Must match your production domain exactly
   - Include `https://` protocol
   - No trailing slash

### Quick Debugging Steps

1. **Check Vercel Logs:**
   - Go to your Vercel project → Deployments → Click on deployment → View Function Logs

2. **Test Locally:**
   ```bash
   # Copy Vercel env vars to .env.local
   # Then test:
   npm run dev
   ```

3. **Verify Database:**
   ```bash
   npx prisma studio
   # Should open database viewer
   ```

4. **Check Prisma Client:**
   ```bash
   npx prisma generate
   ls node_modules/.prisma/client
   # Should see generated files
   ```

### Common Error Messages

**"Can't reach database server"**
- Database URL is incorrect
- Database is not accessible from Vercel
- Firewall blocking connection

**"Table does not exist"**
- Schema not migrated
- Run `npx prisma migrate deploy`

**"Prisma Client not generated"**
- Run `npx prisma generate`
- Check `postinstall` script in package.json

**"Invalid DATABASE_URL"**
- Connection string format is wrong
- Missing required parameters
- SSL mode not set correctly

### Getting Help

If issues persist:
1. Check Vercel function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test database connection locally with same credentials
4. Check Prisma documentation: https://www.prisma.io/docs

