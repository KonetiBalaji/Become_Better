import { User, Goal } from '@prisma/client'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Send email notification using Resend
 */
export async function sendEmailNotification(options: EmailOptions): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email notification')
    return false
  }

  try {
    // Use verified domain or Resend's default domain for development
    // For production, set RESEND_FROM_EMAIL to your verified domain
    // For development, Resend allows using onboarding@resend.dev
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      console.error('Resend API error:', errorData)
      
      // If domain not verified, provide helpful error message
      if (errorData.statusCode === 403 && errorData.message?.includes('domain is not verified')) {
        console.error('Domain verification required. Use onboarding@resend.dev for development or verify your domain in Resend.')
      }
      
      return false
    }

    return true
  } catch (error) {
    console.error('Email notification error:', error)
    return false
  }
}

/**
 * Send reminder email for pending goals
 */
export async function sendReminderEmail(
  user: User,
  pendingGoals: Goal[]
): Promise<boolean> {
  const goalsList = pendingGoals
    .map((goal) => `- ${goal.title}`)
    .join('<br>')

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Time to Update Your Goals, ${user.firstName}!</h1>
          </div>
          <div class="content">
            <p>Don't forget to update your progress on these goals today:</p>
            <p>${goalsList}</p>
            <p>Consistency is key to becoming better. Keep up the great work!</p>
            <a href="${process.env.NEXTAUTH_URL}/" class="button">Update Goals</a>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmailNotification({
    to: user.email,
    subject: `Reminder: Update Your Goals - ${pendingGoals.length} Pending`,
    html,
  })
}

/**
 * Send insight email notification
 */
export async function sendInsightEmail(
  user: User,
  goal: Goal,
  insightContent: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { padding: 20px; }
          .insight { background-color: #e7f3ff; padding: 15px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Insight for Your Goal: ${goal.title}</h1>
          </div>
          <div class="content">
            <div class="insight">
              ${insightContent.replace(/\n/g, '<br>')}
            </div>
            <a href="${process.env.NEXTAUTH_URL}/goals/${goal.id}">View Full Details</a>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmailNotification({
    to: user.email,
    subject: `New Insight: ${goal.title}`,
    html,
  })
}

