# Setup Instructions

## Prerequisites

1. **Node.js 18+** and npm installed
2. **PostgreSQL database** running
3. **OpenAI API key** (for AI insights feature)
4. **Resend API key** (for email notifications - optional)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/goal_tracking?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

   # OpenAI (required for AI insights)
   OPENAI_API_KEY="your-openai-api-key-here"

   # Email (Resend - optional, for email notifications)
   RESEND_API_KEY="your-resend-api-key-here"

   # Vercel Cron Secret (for protecting cron endpoints)
   CRON_SECRET="your-cron-secret-here"
   ```

3. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Generating NEXTAUTH_SECRET

You can generate a secure secret using:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Database Setup

If you don't have PostgreSQL installed locally, you can use:

1. **Docker:**
   ```bash
   docker run --name goal-tracking-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=goal_tracking -p 5432:5432 -d postgres
   ```

2. **Cloud services:**
   - [Supabase](https://supabase.com) (free tier available)
   - [Neon](https://neon.tech) (free tier available)
   - [Railway](https://railway.app) (free tier available)

## Troubleshooting

### Build Errors
- Make sure all environment variables are set
- Run `npm run build` to check for TypeScript errors
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists: `createdb goal_tracking`

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your deployment URL
- Clear browser cookies if experiencing session issues

### AI Insights Not Working
- Verify OPENAI_API_KEY is set correctly
- Check OpenAI API quota/limits
- Ensure goal has at least 7 days of data

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma Client

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The cron job is automatically configured via `vercel.json`.

### Other Platforms

- **Railway:** Connect GitHub repo, add environment variables
- **Render:** Connect GitHub repo, set build command to `npm run build`
- **Self-hosted:** Use PM2 or similar process manager

## Notes

- The app requires at least 7 days of goal tracking data before AI insights can be generated
- Email notifications require Resend API key (optional feature)
- Push notifications require additional setup (service worker registration)
- All dates are stored in UTC and converted to user's timezone

