# Database Setup Guide

## Prisma Accelerate Configuration

You're using **Prisma Accelerate** for better performance. Here's how to set it up:

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Direct connection for migrations and Prisma Studio
DATABASE_URL="postgres://3476197804c1566f9c9570a6998d15e719063f2d313911b221df93041999d51a:sk_Dr6WAcvww_ImoLTopXsKR@db.prisma.io:5432/postgres?sslmode=require"

# Prisma Accelerate connection (for production queries - better performance)
PRISMA_ACCELERATE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19EcjZXQWN2d3dfSW1vTFRvcFhzS1IiLCJhcGlfa2V5IjoiMDFLREdQOTIwSjAzVFJBMFAzWUJTUzBHMUciLCJ0ZW5hbnRfaWQiOiIzNDc2MTk3ODA0YzE1NjZmOWM5NTcwYTY5OThkMTVlNzE5MDYzZjJkMzEzOTExYjIyMWRmOTMwNDE5OTlkNTFhIiwiaW50ZXJuYWxfc2VjcmV0IjoiMTEwN2QwNzYtN2NlMi00YzUxLTkwOGQtYTUyZjdlNzIzZGFhIn0.DaeCr3VdokZEPjvDx120JjzanQ9Pn-wdiLutJICqFfA"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## How It Works

- **`DATABASE_URL`**: Used for migrations (`prisma migrate`) and Prisma Studio
- **`PRISMA_ACCELERATE_URL`**: Used automatically for all queries in production (faster, connection pooling)

The Prisma client will automatically use Accelerate if `PRISMA_ACCELERATE_URL` is set, otherwise it falls back to `DATABASE_URL`.

## Setup Steps

1. **Create `.env.local` file** (already created for you)

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```
   If you get a file lock error on Windows, close any running processes and try again.

3. **Run migrations to create tables:**
   ```bash
   npx prisma migrate dev --name init
   ```
   Or if you want to push schema without migrations:
   ```bash
   npx prisma db push
   ```

4. **Verify connection:**
   ```bash
   npx prisma studio
   ```
   This opens Prisma Studio where you can view and edit your database.

## For Vercel Deployment

When deploying to Vercel, set these environment variables in your project settings:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - `DATABASE_URL` (direct connection)
   - `PRISMA_ACCELERATE_URL` (Accelerate connection)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your production URL, e.g., `https://your-app.vercel.app`)

## Troubleshooting

### File Lock Error on Windows
If `prisma generate` fails with a file lock error:
- Close any running Node processes
- Close VS Code or your IDE
- Try again

### Connection Issues
- Verify your connection strings are correct
- Check that the database is accessible
- Ensure SSL mode is set correctly (`?sslmode=require`)

### Migration Issues
If migrations fail:
```bash
# Reset database (⚠️ WARNING: Deletes all data)
npx prisma migrate reset

# Or create a new migration
npx prisma migrate dev --name fix-schema
```

## Next Steps

After setting up the database:
1. ✅ Environment variables configured
2. ✅ Prisma client generated
3. ✅ Database schema migrated
4. 🚀 Start your app: `npm run dev`

