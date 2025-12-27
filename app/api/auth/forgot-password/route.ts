import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmailNotification } from '@/lib/notifications'
import { z } from 'zod'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = forgotPasswordSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    // Always return success (security best practice - don't reveal if email exists)
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Generate reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    // Send email
    const emailSent = await sendEmailNotification({
      to: user.email,
      subject: 'Reset your password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1c1c1e; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e8e8ed;">
              <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: #1c1c1e;">Reset your password</h1>
              <p style="font-size: 16px; color: #636366; margin: 0 0 24px 0;">
                You requested to reset your password. Click the button below to create a new password.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background-color: #007aff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 500; font-size: 16px; margin: 0 0 24px 0;">
                Reset password
              </a>
              <p style="font-size: 14px; color: #8e8e93; margin: 24px 0 0 0;">
                This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
              </p>
              <p style="font-size: 14px; color: #8e8e93; margin: 8px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #007aff; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            <p style="font-size: 12px; color: #8e8e93; text-align: center; margin-top: 24px;">
              © ${new Date().getFullYear()} Become Better. A quiet system for building consistency.
            </p>
          </body>
        </html>
      `,
    })

    if (!emailSent) {
      console.error('Failed to send password reset email')
      // Still return success to user (security best practice)
      // Log the error for admin review
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: 'If an account exists with this email, a password reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

