import { getCurrentUser } from '@/lib/auth-helpers'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/Dashboard'

export default async function HomePage() {
  const user = await getCurrentUser()

  // Show landing page for new users, dashboard for logged-in users
  if (!user) {
    return <LandingPage />
  }

  return <Dashboard userId={user.id} />
}
