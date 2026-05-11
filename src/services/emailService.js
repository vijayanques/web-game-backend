// Using Resend instead of Gmail (no 2FA needed!)
require('dotenv').config();
const { Resend } = require('resend');

// Initialize Resend with API key - handle missing key gracefully
// Fallback to hardcoded key if env var not available (temporary fix for Railway)
const apiKey = process.env.RESEND_API_KEY || 're_jJyCqRVi_HXfcJJwfUFy5SWY9VFYui9RU';

console.log('🔍 Checking RESEND_API_KEY...');
console.log('API Key exists:', !!apiKey);
console.log('API Key length:', apiKey ? apiKey.length : 0);
console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) : 'N/A');
console.log('Using env var:', !!process.env.RESEND_API_KEY);

let resend = null;

if (apiKey && apiKey.trim()) {
  try {
    resend = new Resend(apiKey.trim());
    console.log('✅ Resend email service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Resend:', error.message);
    resend = null;
  }
} else {
  console.warn('⚠️  RESEND_API_KEY not set or empty - email sending will be disabled');
  console.warn('Available env vars:', Object.keys(process.env).filter(k => k.includes('RESEND') || k.includes('EMAIL')));
}

/**
 * Send password reset email with secure token
 * @param {string} email - User's email address
 * @param {string} resetLink - Complete reset link with token
 * @param {string} username - User's username (optional)
 */
exports.sendPasswordResetEmail = async (email, resetLink, username = '') => {
  try {
    if (!resend) {
      console.warn('⚠️  Email service not configured - email not sent but password reset link is: ' + resetLink);
      // Return true so password reset still works
      return true;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎮 Theplayfree</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Password Reset Request</h2>
              ${username ? `<p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.5;">Hi ${username},</p>` : ''}
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.5;">We received a request to reset your password for your Theplayfree account. Click the button below to create a new password:</p>
              <table role="presentation" style="margin: 32px 0;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);">
                    <a href="${resetLink}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">Reset Your Password</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.5;">Or copy and paste this link into your browser:</p>
              <p style="margin: 0 0 24px; padding: 12px; background-color: #f3f4f6; border-radius: 4px; word-break: break-all; font-size: 13px; color: #6b7280;">${resetLink}</p>
              <div style="margin: 24px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;"><strong>⚠️ Important:</strong> This link will expire in 30 minutes for security reasons.</p>
              </div>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.5;">If you didn't request a password reset, please ignore this email or contact support if you have concerns. Your password will remain unchanged.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; line-height: 1.5; text-align: center;">This is an automated message, please do not reply to this email.</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Theplayfree. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const text = `Password Reset Request - Theplayfree\n\n${username ? `Hi ${username},` : 'Hi,'}\n\nWe received a request to reset your password for your Theplayfree account.\n\nTo reset your password, click the link below or copy and paste it into your browser:\n${resetLink}\n\nThis link will expire in 30 minutes for security reasons.\n\nIf you didn't request a password reset, please ignore this email. Your password will remain unchanged.\n\n© ${new Date().getFullYear()} Theplayfree. All rights reserved.`;

    // Send email using Resend
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Theplayfree <onboarding@resend.dev>',
      to: email,
      subject: 'Password Reset Request - Theplayfree',
      html: html,
      text: text,
      reply_to: 'support@theplayfree.com', // Add reply-to for better deliverability
    });
    
    console.log(`✅ Password reset email sent to: ${email}`);
    console.log(`📧 Resend Response:`, response);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    // Don't throw - let password reset continue even if email fails
    return true;
  }
};

exports.sendWelcomeEmail = async (email, username) => {
  try {
    if (!resend) {
      console.warn('⚠️  Email service not configured - skipping email send');
      return true; // Return true to not break the flow
    }

    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #f97316;">Welcome to Theplayfree, ${username}!</h2><p>Your account has been created successfully.</p><p>Start playing amazing games now!</p><hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;"><p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Theplayfree. All rights reserved.</p></div>`;
    
    const text = `Welcome to Theplayfree, ${username}!\n\nYour account has been created successfully.\n\nStart playing amazing games now!\n\n© ${new Date().getFullYear()} Theplayfree. All rights reserved.`;

    // Send email using Resend
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to Theplayfree!',
      html: html,
      text: text,
    });
    
    console.log(`✅ Welcome email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    throw error;
  }
};
 