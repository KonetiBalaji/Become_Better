# Password Reset Setup Guide

## ✅ Implementation Complete

The password reset functionality is fully implemented and ready to use!

## 🔧 Setup Required

### 1. Environment Variables

Make sure these are set in your `.env.local` and Vercel:

```env
# Required for sending reset emails
RESEND_API_KEY="your-resend-api-key"

# Optional - customize sender email
RESEND_FROM_EMAIL="Become Better <noreply@yourdomain.com>"

# Required for generating reset links
NEXTAUTH_URL="http://localhost:3000"  # or your production URL
```

### 2. Restart Dev Server

**Important:** After adding the `PasswordResetToken` model, you need to:

1. **Stop your dev server** (Ctrl+C)
2. **Restart it:**
   ```bash
   npm run dev
   ```

This ensures the new Prisma Client with `passwordResetToken` model is loaded.

### 3. Database Migration

The migration has been created and applied. The `password_reset_tokens` table should exist in your database.

## 🚀 How It Works

### User Flow

1. **User clicks "Forgot password?"** on login page
2. **Enters email** → System sends reset link via email
3. **Clicks link in email** → Goes to `/reset-password?token=...`
4. **Enters new password** → Password is updated
5. **Redirects to login** → User can sign in with new password

### Security Features

- ✅ Tokens expire after 1 hour
- ✅ One-time use (deleted after reset)
- ✅ Secure token generation (crypto.randomBytes)
- ✅ Email privacy (same message whether email exists)
- ✅ Token validation before allowing reset
- ✅ Password hashing with bcrypt

## 📧 Email Configuration

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add it to environment variables
4. Verify your domain (for production)

### Email Template

The reset email includes:
- Clean, branded design
- Clear reset button
- Fallback link if button doesn't work
- Security messaging
- 1-hour expiration notice

## 🐛 Troubleshooting

### "Cannot read properties of undefined (reading 'deleteMany')"

**Solution:** Restart your dev server. The Prisma Client needs to reload with the new model.

```bash
# Stop server (Ctrl+C)
npm run dev
```

### "Internal server error" when sending email

**Check:**
1. `RESEND_API_KEY` is set correctly
2. Resend account is active
3. Domain is verified (for production)

### Email not received

**Check:**
1. Spam/junk folder
2. Email address is correct
3. Resend dashboard for delivery status
4. `RESEND_FROM_EMAIL` is configured (if using custom domain)

### Token expired

Tokens expire after 1 hour. User needs to request a new reset link.

## ✅ Testing

1. **Request reset:**
   - Go to login page
   - Click "Forgot password?"
   - Enter email
   - Check email inbox

2. **Reset password:**
   - Click link in email
   - Enter new password
   - Confirm password
   - Should redirect to login

3. **Sign in:**
   - Use new password
   - Should work successfully

## 📝 Notes

- All tokens are automatically cleaned up after use or expiration
- Multiple reset requests invalidate previous tokens
- Email sending is graceful - if Resend fails, user gets appropriate error
- Works in both development and production

