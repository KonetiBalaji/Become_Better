# Become Better - Goal Tracking Application

A minimalistic, AI-powered goal tracking application that helps users achieve their goals through daily tracking, streak visualization, and personalized insights.

## Features

- **Goal Management**: Create, update, and track multiple goals with categories and difficulty levels
- **Daily Updates**: Track daily progress with timezone-aware date handling
- **Streak Tracking**: Visualize streaks with color-coded status (green/purple/red)
- **AI Insights**: Get personalized insights after 7 days of data (rate-limited to 1 per day)
- **Reminders**: Daily email reminders based on user's timezone and preferences
- **Clean UI**: Minimalistic, responsive design that works on any device
- **Privacy-Focused**: No social features, completely private goal tracking

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with HTTP-only cookies
- **AI**: OpenAI API for generating insights
- **Styling**: Tailwind CSS
- **Cron Jobs**: Vercel Cron
- **Notifications**: Email (Resend) + Browser Push

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- Resend API key (for email notifications)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd goal-tracking-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/goal_tracking?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key-here"

# Vercel Cron Secret
CRON_SECRET="your-cron-secret-here"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── app/
│   ├── api/              # API routes
│   ├── goals/            # Goal pages
│   ├── login/            # Authentication pages
│   ├── register/
│   ├── settings/         # Settings page
│   └── page.tsx          # Dashboard
├── components/           # React components
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## Key Features Implementation

### Authentication
- NextAuth.js with credentials provider
- HTTP-only secure cookies
- Account creation and deletion

### Goal Tracking
- Create goals with category, difficulty, and success criteria
- Daily progress updates with timezone support
- Streak calculation with visual indicators

### AI Insights
- Requires minimum 7 days of data
- Rate limited to 1 insight per goal per day
- Cached for 24 hours
- Includes verified sources based on goal category

### Reminders
- Vercel Cron job runs hourly
- Respects user timezone and reminder preferences
- Email notifications for pending goals

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The cron job is configured in `vercel.json` and will run automatically on Vercel.

## Database Schema

- **User**: User accounts with basic info
- **Goal**: Goals with category, difficulty, and success criteria
- **GoalUpdate**: Daily progress updates
- **Insight**: AI-generated insights with caching
- **UserSettings**: User preferences (timezone, reminders, etc.)

## Security

- Password hashing with bcrypt
- Input validation with Zod
- SQL injection prevention (Prisma)
- CSRF protection (NextAuth)
- Rate limiting on AI endpoints

## License

MIT

