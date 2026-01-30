import { Resend } from "resend";
import prisma from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

// Suppression tag slugs - emails with these tags will be skipped
const SUPPRESSION_TAGS = [
  "suppress_bounced",
  "suppress_complained",
  "suppress_unsubscribed",
  "suppress_do_not_contact",
];

// Transactional emails (password reset, course enrollment, etc.)
const FROM_EMAIL_TRANSACTIONAL = process.env.FROM_EMAIL || "AccrediPro Academy <support@accredipro-certificate.com>";
// Marketing/sequence emails - PERSONAL NAME to reach primary inbox
// Format: "Sarah <email>" looks like a personal email, not marketing
const FROM_EMAIL_MARKETING = process.env.FROM_EMAIL_MARKETING || "Sarah <info@accredipro-certificate.com>";
// Personal emails for login credentials - plain, personal, lands in Primary
const FROM_EMAIL_PERSONAL = "Sarah Mitchell <sarah@accredipro-certificate.com>";

// Use SITE_URL for emails, NOT NEXTAUTH_URL (which can be localhost for auth)
const BASE_URL = process.env.SITE_URL || "https://learn.accredipro.academy";
const LOGO_URL = "https://assets.accredipro.academy/fm-certification/Senza-titolo-Logo-1.png";
const UNSUBSCRIBE_URL = `${BASE_URL}/unsubscribe`;

// ============================================
// REUSABLE EMAIL TEMPLATE COMPONENTS
// ============================================

const emailHeader = `
  <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
    <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-family: Georgia, serif;">AccrediPro Academy</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Professional Certification Excellence</p>
  </div>
`;

const emailFooter = `
  <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
    <img src="${LOGO_URL}" alt="AccrediPro Academy" style="width: 50px; height: 50px; margin-bottom: 15px;" />
    <p style="margin: 0 0 5px 0; color: #722F37; font-size: 13px; font-weight: bold;">AccrediPro LLC</p>
    <p style="margin: 0; color: #999; font-size: 11px;">(At Rockefeller Center)</p>
    <p style="margin: 0; color: #999; font-size: 11px;">1270 Ave of the Americas, 7th Fl -1182</p>
    <p style="margin: 0; color: #999; font-size: 11px;">New York, NY 10020</p>
    <p style="margin: 0 0 15px 0; color: #999; font-size: 11px;">United States</p>
    <p style="margin: 0; color: #bbb; font-size: 10px; font-style: italic;">Veritas Et Excellentia - Truth and Excellence in Education</p>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="margin: 0;">
        <a href="${UNSUBSCRIBE_URL}" style="color: #999; font-size: 10px; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
`;

// Export branded wrapper for transactional emails (password reset, course enrollment, etc.)
export function emailWrapper(content: string, preheader?: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        ${preheader ? `<meta name="description" content="${preheader}">` : ''}
        <!--[if mso]>
        <style type="text/css">
          body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
        </style>
        <![endif]-->
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
        ${preheader ? `<div style="display:none;font-size:1px;color:#f5f5f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ''}
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${emailHeader}
            <div style="padding: 40px 30px;">
              ${content}
            </div>
            ${emailFooter}
          </div>
        </div>
      </body>
    </html>
  `;
}

// Personal-style wrapper for marketing sequences - MAXIMUM INBOX DELIVERY
// This mimics how a real person would send an email from Gmail/Outlook
// NO: logos, images, fancy formatting, multiple links, colored text, emojis
// YES: plain text appearance, single link if needed, simple signature
export function personalEmailWrapper(content: string): string {
  // Remove ALL emojis from content
  const noEmojis = content.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '');

  // Convert newlines to <br> tags for proper line breaks
  const withLineBreaks = noEmojis
    .split('\n\n')
    .map(paragraph => paragraph.replace(/\n/g, '<br>'))
    .join('</p><p style="margin:0 0 14px 0;">');

  // Ultra minimal - like Gmail compose
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#222;">
<p style="margin:0 0 14px 0;">${withLineBreaks}</p>
</body>
</html>`;
}


// Branded wrapper for nurture sequence emails - AccrediPro burgundy header styling
// This matches the inbox-test route's HTML output with full branding
export function brandedEmailWrapper(content: string): string {
  // Format content into paragraphs if not already wrapped
  const formattedContent = content
    .split('\n\n')
    .map(p => `<p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if mso]>
    <style type="text/css">
      body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="display:none;font-size:1px;color:#f5f5f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Your functional medicine journey continues...</div>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-family: Georgia, serif;">AccrediPro Academy</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Functional Medicine Excellence</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          ${formattedContent}
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0 0 5px 0; color: #722F37; font-size: 13px; font-weight: bold;">AccrediPro LLC</p>
          <p style="margin: 0; color: #999; font-size: 11px;">(At Rockefeller Center)</p>
          <p style="margin: 0; color: #999; font-size: 11px;">1270 Ave of the Americas, 7th Fl -1182</p>
          <p style="margin: 0; color: #999; font-size: 11px;">New York, NY 10020</p>
          <p style="margin: 0 0 15px 0; color: #999; font-size: 11px;">United States</p>
          <p style="margin: 0; color: #bbb; font-size: 10px; font-style: italic;">Veritas Et Excellentia - Truth and Excellence in Education</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #bbb; font-size: 10px;">
              This email is from AccrediPro Academy.<br/>
              You're receiving this because of your account activity.
            </p>
            <p style="margin: 10px 0 0 0;">
              <a href="${UNSUBSCRIBE_URL}" style="color: #999; font-size: 10px; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  </body>
</html>`;
}


// Alternative: Pure plain text email (no HTML at all) - best for inbox
export function plainTextEmail(content: string): string {
  // Strip HTML and return plain text
  return content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<strong>([^<]+)<\/strong>/gi, '$1')
    .replace(/<em>([^<]+)<\/em>/gi, '$1')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function primaryButton(text: string, url: string): string {
  return `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(114,47,55,0.3);">
        ${text}
      </a>
    </div>
  `;
}

function secondaryButton(text: string, url: string): string {
  return `
    <div style="text-align: center; margin: 20px 0;">
      <a href="${url}" style="background: #f8f9fa; color: #722F37; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 14px; border: 2px solid #722F37;">
        ${text}
      </a>
    </div>
  `;
}

function highlightBox(content: string, type: 'gold' | 'green' | 'blue' | 'cream' | 'burgundy' = 'gold'): string {
  const styles = {
    gold: 'background: linear-gradient(135deg, #FDF5E6 0%, #FFF8DC 100%); border: 1px solid #D4AF37;',
    green: 'background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #22c55e;',
    blue: 'background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #3b82f6;',
    cream: 'background: linear-gradient(135deg, #FFFEF5 0%, #FFF9E6 100%); border: 1px solid #E8DCC8;',
    burgundy: 'background: linear-gradient(135deg, #FDF5F6 0%, #FCEEF0 100%); border: 1px solid #722F37;'
  };
  return `
    <div style="${styles[type]} border-radius: 12px; padding: 20px; margin: 20px 0;">
      ${content}
    </div>
  `;
}

function progressBar(percentage: number): string {
  return `
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Your Progress</p>
      <div style="background: #e0e0e0; border-radius: 10px; height: 20px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #722F37, #D4AF37); height: 100%; width: ${percentage}%;"></div>
      </div>
      <p style="margin: 10px 0 0 0; text-align: center; font-weight: bold; color: #722F37;">${percentage}% Complete</p>
    </div>
  `;
}

// ============================================
// CORE EMAIL SEND FUNCTION
// ============================================

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  type?: 'transactional' | 'marketing'; // Default: transactional
}

// Generate plain text from HTML for multipart MIME
function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<strong>([^<]+)<\/strong>/gi, '$1')
    .replace(/<em>([^<]+)<\/em>/gi, '$1')
    .replace(/<b>([^<]+)<\/b>/gi, '$1')
    .replace(/<i>([^<]+)<\/i>/gi, '$1')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Check if an email should be suppressed (bounced, complained, unsubscribed)
 * Returns true if email should NOT be sent
 */
async function isEmailSuppressed(email: string): Promise<{ suppressed: boolean; reason?: string }> {
  try {
    // Use select to avoid P2022 errors from missing columns
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        marketingTags: {
          some: {
            tag: {
              slug: { in: SUPPRESSION_TAGS }
            }
          }
        }
      },
      select: {
        id: true,
        marketingTags: {
          where: {
            tag: { slug: { in: SUPPRESSION_TAGS } }
          },
          include: { tag: true }
        }
      }
    });

    if (user && user.marketingTags.length > 0) {
      const reasons = user.marketingTags.map(t => t.tag.slug).join(', ');
      return { suppressed: true, reason: reasons };
    }

    return { suppressed: false };
  } catch (error) {
    // On error, allow the email (don't block due to DB issues)
    console.error("[EMAIL] Suppression check failed:", error);
    return { suppressed: false };
  }
}

// Main send function for transactional emails (default)
export async function sendEmail({ to, subject, html, text, replyTo, type = 'transactional' }: SendEmailOptions) {
  try {
    // Skip if no email address provided (fake profiles have null email)
    if (!to || (Array.isArray(to) && to.length === 0)) {
      console.log(`📧 SKIPPING EMAIL - No recipient address provided`);
      return { success: false, error: 'No recipient email' };
    }

    // Get the primary email address for suppression check
    const primaryEmail = Array.isArray(to) ? to[0] : to;

    // Check if email is suppressed (bounced, complained, unsubscribed)
    const suppression = await isEmailSuppressed(primaryEmail);
    if (suppression.suppressed) {
      console.log(`📧 SUPPRESSED - Not sending to ${primaryEmail} (${suppression.reason})`);
      return { success: false, error: `Email suppressed: ${suppression.reason}` };
    }

    const fromEmail = type === 'marketing' ? FROM_EMAIL_MARKETING : FROM_EMAIL_TRANSACTIONAL;

    // Debug log to verify subject being sent
    console.log(`📧 SENDING EMAIL - Subject: "${subject}" | To: ${to}`);

    // ALWAYS include plain text version for better deliverability (multipart MIME)
    const plainText = text || htmlToPlainText(html);

    // For marketing emails, use a reply-to that looks personal
    const effectiveReplyTo = replyTo || (type === 'marketing' ? 'info@accredipro-certificate.com' : undefined);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: plainText,
      replyTo: effectiveReplyTo,
      // For marketing: minimal headers to avoid spam triggers
      headers: type === 'marketing' ? {
        'List-Unsubscribe': `<${UNSUBSCRIBE_URL}>`,
      } : undefined,
    });

    if (error) {
      console.error("Email send error:", error);
      throw error;
    }

    console.log(`Email sent successfully to ${to}: ${subject} (${type})`);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

// Convenience function for marketing sequence emails
export async function sendMarketingEmail({ to, subject, html, text, replyTo }: Omit<SendEmailOptions, 'type'>) {
  return sendEmail({ to, subject, html, text, replyTo, type: 'marketing' });
}

// ============================================
// ACCOUNT & ACCESS EMAILS
// ============================================

// 1. Welcome Email (Account Created) - includes login credentials
export async function sendWelcomeEmail(to: string, firstName: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">We're so glad you're here.</p>

    <p style="color: #555; font-size: 16px;">You've just taken an important step toward building a meaningful new career — and we're honored to be part of your journey.</p>

    ${highlightBox(`
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">Your Login Credentials:</p>
      <p style="margin: 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${to}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Password:</strong> Futurecoach2025</p>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #666; font-style: italic;">You can change your password anytime from your account settings.</p>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">Inside your dashboard, you'll find:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 10px 0;">Your enrolled courses</li>
      <li style="margin: 10px 0;">Direct access to your dedicated coach</li>
      <li style="margin: 10px 0;">Resources to support your certification journey</li>
    </ul>

    <p style="color: #555; font-size: 16px;">Take your time, explore at your own pace, and know that we're here whenever you need us.</p>

    ${primaryButton('Login to My Dashboard', `${BASE_URL}/login`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Questions? Just reply to this email or message your coach directly from your dashboard.</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Warmly,<br/><strong>The AccrediPro Team</strong></p>
  `;

  return sendEmail({
    to,
    subject: `Welcome to AccrediPro, ${firstName}!`,
    html: emailWrapper(content, `Welcome ${firstName}! Your login credentials are inside.`),
  });
}

// 2. Password Reset
export async function sendPasswordResetEmail(to: string, token: string, firstName?: string) {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Reset Your Password</h2>

    <p style="color: #555; font-size: 16px;">Hi${firstName ? ` ${firstName}` : ''},</p>
    <p style="color: #555; font-size: 16px;">We received a request to reset your password. Click the button below to create a new password:</p>

    ${primaryButton('Reset Password', resetUrl)}

    ${highlightBox(`
      <p style="margin: 0; font-size: 13px; color: #722F37;">
        <strong>Important:</strong> This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email or contact support if you're concerned.
      </p>
    `, 'cream')}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">If you're having trouble clicking the button, copy and paste this link into your browser:</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #722F37; word-break: break-all;">${resetUrl}</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: "Reset Your Password - AccrediPro Academy",
    html: emailWrapper(content, "Reset your AccrediPro Academy password"),
  });
}

// ============================================
// COURSE / LMS EVENT EMAILS
// ============================================

// 4. Mini Diploma Enrollment
export async function sendMiniDiplomaEnrollmentEmail(to: string, firstName: string, category: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">You're Enrolled!</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;">Congratulations! You've started your <strong>${category}</strong> Mini Diploma.</p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">Your Free Mini Diploma:</p>
      <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${category} Fundamentals</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Complete all modules to unlock the Graduate Training</p>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">What you'll learn:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Core ${category} principles</li>
      <li style="margin: 8px 0;">Essential assessment techniques</li>
      <li style="margin: 8px 0;">Introduction to client protocols</li>
    </ul>

    ${primaryButton('Start Learning Now', `${BASE_URL}/my-mini-diploma`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">This is 100% free. Complete it at your own pace.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `You're Enrolled: ${category} Mini Diploma - AccrediPro Academy`,
    html: emailWrapper(content, `Start your free ${category} Mini Diploma now!`),
  });
}

// 7. Module Unlocked
export async function sendModuleUnlockedEmail(to: string, firstName: string, moduleTitle: string, courseTitle: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Module Unlocked!</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;">A new module is now available for you:</p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">Now Available:</p>
      <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${moduleTitle}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Part of: ${courseTitle}</p>
    `, 'cream')}

    ${primaryButton('Start This Module', `${BASE_URL}/my-courses`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">Keep up the great work! You're making excellent progress.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Module Unlocked: ${moduleTitle} - AccrediPro Academy`,
    html: emailWrapper(content, `${moduleTitle} is now available in your course!`),
  });
}

// 8. Module Completed
export async function sendModuleCompletedEmail(to: string, firstName: string, moduleTitle: string, courseTitle: string, progress: number) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Module Complete!</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;">Congratulations! You've completed:</p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #722F37;">${moduleTitle}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Part of: ${courseTitle}</p>
    `, 'green')}

    ${progressBar(progress)}

    ${primaryButton('Continue to Next Module', `${BASE_URL}/my-courses`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">You're doing amazing! Keep that momentum going.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Module Complete: ${moduleTitle} - AccrediPro Academy`,
    html: emailWrapper(content, `You completed ${moduleTitle}! ${progress}% done.`),
  });
}

// 9. Mini Diploma Completed
export async function sendMiniDiplomaCompletedEmail(to: string, firstName: string, category: string) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #722F37; margin: 0; font-size: 28px;">Mini Diploma Complete!</h2>
    </div>

    <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, ${firstName}!</p>
    <p style="color: #555; font-size: 16px; text-align: center;">You've successfully completed your <strong>${category} Mini Diploma</strong>!</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">UNLOCKED</p>
        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">Graduate Orientation Training</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Learn how to build a $5,000+/month practice</p>
      </div>
    `, 'green')}

    <p style="color: #555; font-size: 16px;">Your next step is to watch the Graduate Orientation Training. This exclusive session reveals:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Your complete certification roadmap</li>
      <li style="margin: 8px 0;">How to get your first clients</li>
      <li style="margin: 8px 0;">Income potential at each stage</li>
    </ul>

    ${primaryButton('Watch Graduate Training', `${BASE_URL}/training`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">This training unlocks the 7-Day Challenge!</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Congratulations! Mini Diploma Complete - AccrediPro Academy`,
    html: emailWrapper(content, `You did it, ${firstName}! Your Mini Diploma is complete.`),
  });
}

// 10. Graduate Training Unlocked
export async function sendTrainingUnlockedEmail(to: string, firstName: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your Training is Ready!</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;">The exclusive Graduate Orientation Training is now unlocked for you!</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">NOW AVAILABLE</p>
        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">Graduate Orientation Training</p>
        <p style="margin: 8px 0 0 0; font-size: 16px; color: #666;">Start Earning $5,000+ Monthly</p>
      </div>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">In this 45-minute training, you'll discover:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Your step-by-step certification path</li>
      <li style="margin: 8px 0;">How to build your practice from day one</li>
      <li style="margin: 8px 0;">Real income potential: $5K-$10K/month</li>
    </ul>

    ${primaryButton('Watch Training Now', `${BASE_URL}/training`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">Complete this training to unlock your 7-Day Challenge!</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Training Unlocked: Your Path to $5K+/Month - AccrediPro Academy`,
    html: emailWrapper(content, `${firstName}, your Graduate Training is ready!`),
  });
}

// 11. Challenge Unlocked
export async function sendChallengeUnlockedEmail(to: string, firstName: string) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #722F37; margin: 0; font-size: 28px;">7-Day Challenge Unlocked!</h2>
    </div>

    <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, ${firstName}!</p>
    <p style="color: #555; font-size: 16px; text-align: center;">You've earned access to the <strong>7-Day Activation Challenge</strong> – your free graduate gift!</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">YOUR GRADUATE GIFT</p>
        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">7-Day Activation Challenge</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Launch your practice in just 7 days</p>
      </div>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">Each day, you'll complete one action step to:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Define your ideal client</li>
      <li style="margin: 8px 0;">Create your signature offer</li>
      <li style="margin: 8px 0;">Build your online presence</li>
      <li style="margin: 8px 0;">Get your first client</li>
    </ul>

    ${primaryButton('Start Day 1 Now', `${BASE_URL}/challenges`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">Complete all 7 days to earn your badge and bonus resources!</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Challenge Unlocked: Start Your 7-Day Journey - AccrediPro Academy`,
    html: emailWrapper(content, `${firstName}, your 7-Day Challenge awaits!`),
  });
}

// 12. Challenge Day Unlocked
export async function sendChallengeDayUnlockedEmail(to: string, firstName: string, dayNumber: number, dayTitle: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Day ${dayNumber} is Ready!</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;">Your next challenge day is now unlocked:</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">DAY ${dayNumber}</p>
        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${dayTitle}</p>
      </div>
    `, 'cream')}

    ${primaryButton(`Start Day ${dayNumber}`, `${BASE_URL}/challenges`)}

    ${progressBar(Math.round((dayNumber / 7) * 100))}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">You're making great progress! Keep going!</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Day ${dayNumber} Unlocked: ${dayTitle} - AccrediPro Academy`,
    html: emailWrapper(content, `Day ${dayNumber} of your 7-Day Challenge is ready!`),
  });
}

// 13. Challenge Completed
export async function sendChallengeCompletedEmail(to: string, firstName: string) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #722F37; margin: 0; font-size: 28px;">Challenge Complete!</h2>
    </div>

    <p style="color: #555; font-size: 16px; text-align: center;">Incredible work, ${firstName}!</p>
    <p style="color: #555; font-size: 16px; text-align: center;">You've successfully completed the <strong>7-Day Activation Challenge</strong>!</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">ACHIEVEMENT UNLOCKED</p>
        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">Challenge Champion Badge</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">+ Exclusive Bonus Resources</p>
      </div>
    `, 'green')}

    <p style="color: #555; font-size: 16px;">What you've accomplished:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Defined your ideal client avatar</li>
      <li style="margin: 8px 0;">Created your signature offer</li>
      <li style="margin: 8px 0;">Built your professional presence</li>
      <li style="margin: 8px 0;">Ready to welcome your first clients</li>
    </ul>

    <p style="color: #555; font-size: 16px; font-weight: bold;">Ready for the next step?</p>
    <p style="color: #555; font-size: 16px;">The Full Certification gives you everything you need to become a confident, high-earning practitioner.</p>

    ${primaryButton('View Full Certification', `${BASE_URL}/courses/functional-medicine-complete-certification`)}

    ${secondaryButton('View My Badge', `${BASE_URL}/my-library`)}
  `;

  return sendEmail({
    to,
    subject: `Challenge Complete! You Did It, ${firstName}! - AccrediPro Academy`,
    html: emailWrapper(content, `Congratulations ${firstName}! You completed the 7-Day Challenge!`),
  });
}

// ============================================
// CERTIFICATES & CREDENTIALS
// ============================================

// 14. Certificate Issued
export async function sendCertificateIssuedEmail(
  to: string,
  firstName: string,
  courseTitle: string,
  certificateNumber: string,
  downloadUrl: string,
  verificationUrl: string
) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #722F37; margin: 0; font-size: 28px;">Your Certificate is Ready!</h2>
    </div>

    <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, ${firstName}!</p>
    <p style="color: #555; font-size: 16px; text-align: center;">You've earned your certificate for:</p>

    <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); border-radius: 12px; padding: 30px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">Certificate of Completion</p>
      <p style="margin: 15px 0; font-size: 22px; font-weight: bold; color: white;">${courseTitle}</p>
      <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8);">Certificate #${certificateNumber}</p>
    </div>

    ${primaryButton('Download Certificate', downloadUrl)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #722F37; font-weight: bold;">Share Your Achievement</p>
      <p style="margin: 0; font-size: 13px; color: #666;">Your certificate can be verified by employers and clients at:</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #722F37; word-break: break-all;">${verificationUrl}</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Certificate Earned: ${courseTitle} - AccrediPro Academy`,
    html: emailWrapper(content, `Your ${courseTitle} certificate is ready to download!`),
  });
}

// ============================================
// PAYMENTS & BILLING
// ============================================

// 15. Payment Receipt
export async function sendPaymentReceiptEmail(
  to: string,
  firstName: string,
  productName: string,
  amount: number,
  transactionId: string,
  purchaseDate: Date
) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Payment Confirmation</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;">Thank you for your purchase! Here's your receipt:</p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Product</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #333;">${productName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Amount</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #166534;">$${amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Transaction ID</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 12px; color: #888;">${transactionId}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666;">Date</td>
          <td style="padding: 10px 0; text-align: right; color: #333;">${purchaseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
      </table>
    </div>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #166534;"><strong>Your access is now active!</strong> You can start learning immediately.</p>
    `, 'green')}

    ${primaryButton('Access My Course', `${BASE_URL}/my-courses`)}

    <p style="color: #888; font-size: 13px; text-align: center;">Questions? Reply to this email or chat with your mentor in the app.</p>
  `;

  return sendEmail({
    to,
    subject: `Payment Confirmed: ${productName} - AccrediPro Academy`,
    html: emailWrapper(content, `Thank you for your purchase of ${productName}!`),
  });
}

// 16. Course Enrollment Confirmation
export async function sendCourseEnrollmentEmail(to: string, firstName: string, courseName: string, courseSlug: string) {
  const courseUrl = `${BASE_URL}/courses/${courseSlug}`;

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #722F37; margin: 0; font-size: 28px;">You're Enrolled!</h2>
    </div>

    <p style="color: #555; font-size: 16px; text-align: center;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px; text-align: center;">You now have full access to:</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 20px; font-weight: bold; color: #722F37;">${courseName}</p>
      </div>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">Your certification includes:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Comprehensive lesson modules</li>
      <li style="margin: 8px 0;">Quizzes and assessments</li>
      <li style="margin: 8px 0;">1:1 coaching support</li>
      <li style="margin: 8px 0;">Professional certification upon completion</li>
    </ul>

    ${primaryButton('Access My Course', courseUrl)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;"><strong style="color: #722F37;">Pro Tip:</strong> Set aside dedicated time each day for learning. Even 30 minutes of focused study will help you progress quickly!</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `You're Enrolled: ${courseName} - AccrediPro Academy`,
    html: emailWrapper(content, `Welcome to ${courseName}! Your learning journey begins.`),
  });
}

// 16b. Pro Accelerator VIP Enrollment - Premium/Exclusive Email
// niche: "FM" (Functional Medicine), "HN" (Holistic Nutrition), etc.
export async function sendProAcceleratorEnrollmentEmail(to: string, firstName: string, niche: string = "FM") {
  const nicheNames: Record<string, string> = {
    "FM": "Functional Medicine",
    "HN": "Holistic Nutrition",
    "SB": "Stress & Burnout",
    "HH": "Hormone Health",
  };
  const nicheName = nicheNames[niche] || niche;

  const dashboardUrl = `${BASE_URL}/my-courses`;

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background: linear-gradient(135deg, #D4AF37 0%, #F5D76E 100%); color: #722F37; padding: 8px 20px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">
        VIP ACCESS UNLOCKED
      </div>
      <h2 style="color: #722F37; margin: 0; font-size: 32px;">Welcome to the Inner Circle, ${firstName}!</h2>
    </div>

    <p style="color: #555; font-size: 16px; text-align: center;">You've just upgraded to our <strong style="color: #722F37;">Pro Accelerator™</strong> — and you now have access to <em>everything</em> we offer.</p>

    <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); border-radius: 16px; padding: 30px; margin: 25px 0; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">YOU'VE UNLOCKED</p>
      <p style="margin: 15px 0 5px 0; font-size: 24px; font-weight: bold; color: white;">${nicheName} Pro Accelerator™</p>
      <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8);">Advanced + Master + Practice Path</p>
    </div>

    ${highlightBox(`
      <p style="margin: 0 0 15px 0; font-size: 15px; color: #722F37; font-weight: bold;">Your Login Credentials:</p>
      <p style="margin: 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${to}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Password:</strong> Futurecoach2025</p>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #666; font-style: italic;">You can change your password anytime from your account settings.</p>
    `, 'gold')}

    <p style="color: #555; font-size: 16px; margin-top: 25px;"><strong>What's waiting for you inside:</strong></p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 10px 0;"><strong>Advanced Clinical Training</strong> — Deep-dive specializations</li>
      <li style="margin: 10px 0;"><strong>Master-Level Protocols</strong> — Complex case mastery</li>
      <li style="margin: 10px 0;"><strong>Practice & Income Path</strong> — Build your $10K/month business</li>
      <li style="margin: 10px 0;"><strong>1:1 Coach Access</strong> — Direct support whenever you need it</li>
    </ul>

    ${primaryButton('Access My Pro Dashboard', dashboardUrl)}

    <div style="background: linear-gradient(135deg, #FDF5E6 0%, #FFF8DC 100%); border: 2px solid #D4AF37; border-radius: 12px; padding: 20px; margin-top: 25px; text-align: center;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #722F37; font-weight: bold;">Pro Tip from Sarah</p>
      <p style="margin: 0; font-size: 14px; color: #555;">Start with the Advanced tracks that excite you most. Passion + expertise = premium clients.</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">You've made an incredible investment in yourself. I'm here to make sure it pays off.</p>

    <p style="color: #555; font-size: 16px; margin-top: 20px;">To your success,<br/><strong style="color: #722F37;">Sarah M.</strong><br/><span style="color: #888; font-size: 13px;">Lead Coach, AccrediPro Academy</span></p>
  `;

  return sendEmail({
    to,
    subject: `VIP Access Unlocked: Welcome to the ${nicheName} Pro Accelerator, ${firstName}!`,
    html: emailWrapper(content, `${firstName}, you're in! Your ${nicheName} Pro Accelerator access is ready.`),
  });
}

// ============================================
// SUPPORT & SERVICE
// ============================================

// 17. Coach Replied
export async function sendCoachRepliedEmail(to: string, firstName: string, coachName: string, messagePreview: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">You Have a New Message!</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;"><strong style="color: #722F37;">${coachName}</strong> has replied to your message:</p>

    <div style="background: #f8f9fa; border-left: 4px solid #722F37; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #333; font-style: italic;">"${messagePreview.substring(0, 200)}${messagePreview.length > 200 ? '...' : ''}"</p>
    </div>

    ${primaryButton('View Full Message', `${BASE_URL}/messages`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">Your coach is here to support you every step of the way.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `${coachName} replied to your message - AccrediPro Academy`,
    html: emailWrapper(content, `${coachName} sent you a message on AccrediPro`),
  });
}

// 18. Inactive User Reminder
export async function sendInactiveReminderEmail(to: string, firstName: string, lastActivity: Date, currentProgress: number) {
  const daysSinceActive = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">We Miss You, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">It's been <strong style="color: #722F37;">${daysSinceActive} days</strong> since your last visit. Your learning journey is waiting!</p>

    ${progressBar(currentProgress)}

    <p style="color: #555; font-size: 16px;">Don't let your progress go to waste. Even 15 minutes today can make a difference!</p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #722F37;"><strong>Quick win:</strong> Complete just one lesson today and keep your momentum going!</p>
    `, 'cream')}

    ${primaryButton('Continue Learning', `${BASE_URL}/my-courses`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;"><strong style="color: #722F37;">Need help?</strong> Your coach is always available if you're stuck or have questions. Just visit the Messages section.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `We miss you, ${firstName}! Continue your learning journey`,
    html: emailWrapper(content, `${firstName}, your learning journey awaits!`),
  });
}

// ============================================
// RESOURCES & ACHIEVEMENTS
// ============================================

// 19. eBook Download
export async function sendEbookDownloadEmail(to: string, firstName: string, ebookTitle: string, downloadUrl: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your eBook is Ready!</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;">Great news! Your eBook is now available for download:</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">YOUR EBOOK</p>
        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${ebookTitle}</p>
      </div>
    `, 'cream')}

    ${primaryButton('Download eBook', downloadUrl)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">You can also access all your eBooks anytime from your <a href="${BASE_URL}/my-library" style="color: #722F37; text-decoration: underline;">My Library</a> page.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Your eBook is Ready: ${ebookTitle} - AccrediPro Academy`,
    html: emailWrapper(content, `Download your copy of ${ebookTitle}!`),
  });
}

// 20. Badge Earned
export async function sendBadgeEarnedEmail(to: string, firstName: string, badgeName: string, badgeDescription: string) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #722F37; margin: 0; font-size: 28px;">You Earned a Badge!</h2>
    </div>

    <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, ${firstName}!</p>
    <p style="color: #555; font-size: 16px; text-align: center;">You've unlocked a new achievement:</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #D4AF37; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">ACHIEVEMENT UNLOCKED</p>
        <p style="margin: 12px 0 0 0; font-size: 24px; font-weight: bold; color: #722F37;">${badgeName}</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">${badgeDescription}</p>
      </div>
    `, 'gold')}

    <p style="color: #555; font-size: 16px; text-align: center;">This badge is now displayed on your profile and in your Library. Keep up the great work!</p>

    ${primaryButton('View My Badges', `${BASE_URL}/my-library`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">Share your achievement with your network and inspire others!</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Badge Earned: ${badgeName} - AccrediPro Academy`,
    html: emailWrapper(content, `You earned the ${badgeName} badge! View it now.`),
  });
}

// 21. Course Update Notification
export async function sendCourseUpdateEmail(to: string, firstName: string, courseName: string, updateTitle: string, updateDescription: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Content Added!</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #555; font-size: 16px;">We've just added new content to your course:</p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">Course Update</p>
      <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #722F37;">${updateTitle}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">In: ${courseName}</p>
    `, 'blue')}

    <p style="color: #555; font-size: 16px;">${updateDescription}</p>

    ${primaryButton('View New Content', `${BASE_URL}/my-courses`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">We're constantly improving our courses to bring you the latest knowledge and best practices.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `New Content: ${updateTitle} - ${courseName}`,
    html: emailWrapper(content, `New content added to ${courseName}!`),
  });
}

// 22. Announcement Email
export async function sendAnnouncementEmail(to: string, firstName: string, announcementTitle: string, announcementContent: string, ctaText?: string, ctaUrl?: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">${announcementTitle}</h2>

    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>

    <div style="color: #555; font-size: 16px; line-height: 1.7;">
      ${announcementContent}
    </div>

    ${ctaText && ctaUrl ? primaryButton(ctaText, ctaUrl) : ''}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Questions? Reply to this email or message your coach in the app.</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Warmly,<br/><strong>The AccrediPro Team</strong></p>
  `;

  return sendEmail({
    to,
    subject: `${announcementTitle} - AccrediPro Academy`,
    html: emailWrapper(content, `Important update from AccrediPro Academy`),
  });
}

// ============================================
// FREEBIE WELCOME EMAIL (Mini Diploma Optin)
// ============================================

interface FreebieWelcomeEmailOptions {
  to: string;
  firstName: string;
  isExistingUser: boolean;
  nicheName?: string;
  password?: string;
  diplomaSlug?: string;
}

export async function sendFreebieWelcomeEmail({ to, firstName, isExistingUser, nicheName = "Functional Medicine", password = "coach2026", diplomaSlug = "functional-medicine-diploma" }: FreebieWelcomeEmailOptions) {
  // Direct link to Lesson 1 (use login page for new users to ensure they're logged in first)
  const lesson1Url = `${BASE_URL}/${diplomaSlug}/lesson/1`;
  const loginUrl = `${BASE_URL}/login`;

  // Plain text email for better deliverability (lands in Gmail Primary, not Promotions)
  // NO HTML buttons, minimal formatting, looks like a personal email
  const plainText = isExistingUser
    ? `Hey ${firstName}!

Great news - your free ${nicheName} Mini Diploma is ready!

Since you already have an account, just log in to start your 9 interactive lessons with me.

Link: ${loginUrl}

You have 7 days to complete all lessons and earn your certificate.

I'll be chatting with you inside the lessons!

Sarah
AccrediPro Academy`
    : `Hey ${firstName}!

I'm so excited you're here! Your ${nicheName} Mini Diploma is ready.

Here's how to log in:

Email: ${to}
Password: ${password}

Link: ${loginUrl}

You have 7 days to complete all 9 lessons and earn your certificate.

I'll be chatting with you inside the lessons!

Sarah
AccrediPro Academy`;

  // Minimal HTML version (just for basic formatting in clients that prefer HTML)
  // NO styled buttons, NO fancy elements, NO footer with unsubscribe
  const minimalHtml = isExistingUser
    ? `<p>Hey ${firstName}!</p>
<p>Great news - your free <b>${nicheName} Mini Diploma</b> is ready!</p>
<p>Since you already have an account, just log in to start your 9 interactive lessons with me.</p>
<p>Link: <a href="${loginUrl}">${loginUrl}</a></p>
<p>You have 7 days to complete all lessons and earn your certificate.</p>
<p>I'll be chatting with you inside the lessons!</p>
<p>Sarah<br/>AccrediPro Academy</p>`
    : `<p>Hey ${firstName}!</p>
<p>I'm so excited you're here! Your <b>${nicheName} Mini Diploma</b> is ready.</p>
<p>Here's how to log in:</p>
<p>
<b>Email:</b> ${to}<br/>
<b>Password:</b> ${password}
</p>
<p>Link: <a href="${loginUrl}">${loginUrl}</a></p>
<p>You have 7 days to complete all 9 lessons and earn your certificate.</p>
<p>I'll be chatting with you inside the lessons!</p>
<p>Sarah<br/>AccrediPro Academy</p>`;

  // Use Resend directly with personal sender for better deliverability
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL_PERSONAL,
      to: [to],
      subject: isExistingUser
        ? `${firstName}, your ${nicheName} Mini Diploma is ready!`
        : `${firstName}, here's your login for AccrediPro`,
      text: plainText,
      html: minimalHtml,
      replyTo: "sarah@accredipro-certificate.com",
    });

    if (error) {
      console.error("Email send error:", error);
      throw error;
    }

    console.log(`[FREEBIE] Plain text welcome email sent to ${to}`);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send freebie welcome email:", error);
    return { success: false, error };
  }
}

// ============================================
// WOMEN'S HEALTH MINI DIPLOMA EMAILS
// ============================================

interface WomensHealthWelcomeEmailOptions {
  to: string;
  firstName: string;
  isExistingUser: boolean;
  password?: string;
}

// Women's Health Mini Diploma Welcome Email
export async function sendWomensHealthWelcomeEmail({ to, firstName, isExistingUser, password = 'coach2026' }: WomensHealthWelcomeEmailOptions) {
  const content = isExistingUser ? `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome Back, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">Your <strong>Women's Health & Hormones Mini Diploma</strong> is ready and waiting!</p>

    <p style="color: #555; font-size: 16px;">Since you already have an account, just log in to access your 9 interactive lessons with me.</p>

    ${highlightBox(`
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">What's Waiting For You:</p>
      <ul style="margin: 0; padding-left: 20px; color: #555;">
        <li style="margin: 5px 0;">9 chat-style lessons (~60 min total)</li>
        <li style="margin: 5px 0;">Women's Health certificate upon completion</li>
        <li style="margin: 5px 0;">Personal voice message from me</li>
        <li style="margin: 5px 0;">7 days to complete</li>
      </ul>
    `, 'cream')}

    ${primaryButton('Login & Start Learning', `${BASE_URL}/womens-health-diploma`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Can't wait to teach you about hormones!<br/><strong>Sarah</strong></p>
  ` : `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Hey ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">I'm SO excited you're here! Your <strong>Women's Health & Hormones Mini Diploma</strong> is ready.</p>

    <p style="color: #555; font-size: 16px;">Here's how to access your lessons:</p>

    ${highlightBox(`
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">Your Login Details:</p>
      <p style="margin: 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${to}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Password:</strong> ${password}</p>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #666; font-style: italic;">Save these! You can change your password anytime.</p>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">What you'll learn with me:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">The 5 key female hormones</li>
      <li style="margin: 8px 0;">The 4 phases of your cycle</li>
      <li style="margin: 8px 0;">Signs of hormonal imbalance</li>
      <li style="margin: 8px 0;">The gut-hormone connection</li>
      <li style="margin: 8px 0;">Nutrition for balance</li>
    </ul>

    ${primaryButton('Start Your First Lesson', `${BASE_URL}/womens-health-diploma`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;"><strong>Important:</strong> You have 7 days to complete your mini diploma. Complete all 9 lessons to earn your certificate!</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">I'll be chatting with you inside the lessons!<br/><strong>Sarah</strong></p>
  `;

  return sendEmail({
    to,
    subject: `Your login details of AccrediPro Academy`,
    html: emailWrapper(content, `Your free Women's Health Mini Diploma with Sarah is ready!`),
  });
}

// Women's Health Reminder Email - Day 1 (not started)
export async function sendWHReminderDay1Email(to: string, firstName: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Hey ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">I noticed you haven't started your Women's Health Mini Diploma yet.</p>

    <p style="color: #555; font-size: 16px;">I get it - life gets busy! But here's the thing: <strong>Lesson 1 only takes about 6 minutes</strong> and it's the foundation for everything else.</p>

    ${highlightBox(`
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #722F37; font-weight: bold;">Lesson 1: Meet Your Hormones</p>
      <p style="margin: 0; font-size: 14px; color: #555;">I'll introduce you to the 5 key hormones that run the show in your body. It's eye-opening stuff!</p>
    `, 'cream')}

    ${primaryButton('Start Lesson 1 Now', `${BASE_URL}/womens-health-diploma/lesson/1`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">You've got 6 days left to complete all 9 lessons and earn your certificate.</p>

    <p style="color: #555; font-size: 16px;">Talk soon!<br/><strong>Sarah</strong></p>
  `;

  return sendEmail({
    to,
    subject: `${firstName}, ready for your first lesson?`,
    html: emailWrapper(content, `Your Women's Health journey is waiting!`),
  });
}

// Women's Health Reminder Email - Day 2 (soft nudge)
export async function sendWHReminderDay2Email(to: string, firstName: string, completedLessons: number) {
  const nextLesson = completedLessons + 1;
  const lessonTitles: Record<number, string> = {
    1: "Meet Your Hormones",
    2: "The Menstrual Cycle Phases",
    3: "Signs of Hormonal Imbalance",
    4: "The Gut-Hormone Connection",
    5: "Nutrition for Hormone Balance",
    6: "Stress & Your Hormones",
    7: "Sleep & Hormonal Health",
    8: "Exercise & Hormones",
    9: "Putting It All Together",
  };

  const content = completedLessons === 0 ? `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Quick tip, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">I wanted to share something that might help...</p>

    <p style="color: #555; font-size: 16px;">A lot of women tell me they're "too busy" to start. But here's the secret: <strong>Lesson 1 takes just 6 minutes</strong>. That's less time than scrolling Instagram!</p>

    <p style="color: #555; font-size: 16px;">And once you start, you'll understand WHY you've been feeling the way you have. It's like finally getting the owner's manual for your body.</p>

    ${primaryButton('Start Lesson 1 (6 mins)', `${BASE_URL}/womens-health-diploma/lesson/1`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Just try one lesson. I promise it'll be worth it!<br/><strong>Sarah</strong></p>
  ` : `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Great start, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">You've completed ${completedLessons} lesson${completedLessons > 1 ? 's' : ''} already - that's awesome!</p>

    <p style="color: #555; font-size: 16px;">Up next is <strong>Lesson ${nextLesson}: ${lessonTitles[nextLesson] || 'Your Next Lesson'}</strong>. This one builds perfectly on what you just learned.</p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #555;">Pro tip: Try to do 2-3 lessons in a row when you have 20 minutes. The concepts connect beautifully!</p>
    `, 'cream')}

    ${primaryButton(`Continue to Lesson ${nextLesson}`, `${BASE_URL}/womens-health-diploma/lesson/${nextLesson}`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Keep the momentum going!<br/><strong>Sarah</strong></p>
  `;

  return sendEmail({
    to,
    subject: completedLessons === 0
      ? `${firstName}, a quick tip from Sarah`
      : `Great start ${firstName}! Ready for Lesson ${nextLesson}?`,
    html: emailWrapper(content, `A quick message about your Women's Health Mini Diploma`),
  });
}

// Women's Health Reminder Email - Day 3 (in progress)
export async function sendWHReminderDay3Email(to: string, firstName: string, completedLessons: number) {
  const remaining = 9 - completedLessons;
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">You're doing great, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">You've completed <strong>${completedLessons} of 9 lessons</strong> - that's real progress!</p>

    <p style="color: #555; font-size: 16px;">Just <strong>${remaining} more lessons</strong> to go before you earn your Women's Health certificate.</p>

    ${highlightBox(`
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #2D6A4F; font-weight: bold;">Your Progress:</p>
      <div style="background: #e0e0e0; border-radius: 10px; height: 20px; margin: 10px 0;">
        <div style="background: linear-gradient(90deg, #2D6A4F 0%, #3D8B6A 100%); height: 100%; border-radius: 10px; width: ${Math.round((completedLessons / 9) * 100)}%;"></div>
      </div>
      <p style="margin: 0; font-size: 14px; color: #555;">${completedLessons}/9 complete</p>
    `, 'green')}

    <p style="color: #555; font-size: 16px;">Keep the momentum going! Each lesson is like a chat with me.</p>

    ${primaryButton('Continue Learning', `${BASE_URL}/womens-health-diploma`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">You've got this!<br/><strong>Sarah</strong></p>
  `;

  return sendEmail({
    to,
    subject: `Keep going ${firstName}! ${remaining} lessons to your certificate`,
    html: emailWrapper(content, `You're making progress on your Women's Health Mini Diploma!`),
  });
}

// Women's Health Reminder Email - Day 5 (urgency)
export async function sendWHReminderDay5Email(to: string, firstName: string, completedLessons: number) {
  const remaining = 9 - completedLessons;
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">${firstName}, 2 days left!</h2>

    <p style="color: #555; font-size: 16px;">Your access to the Women's Health Mini Diploma expires in <strong>2 days</strong>.</p>

    ${completedLessons > 0 ? `
      <p style="color: #555; font-size: 16px;">You've completed ${completedLessons} lessons - just <strong>${remaining} more to go</strong>!</p>
    ` : `
      <p style="color: #555; font-size: 16px;">You haven't started yet, but there's still time! Each lesson is only ~6 minutes.</p>
    `}

    ${highlightBox(`
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #C08938; font-weight: bold;">Don't Miss Out!</p>
      <p style="margin: 0; font-size: 14px; color: #555;">Complete all 9 lessons to earn your official Women's Health & Hormones Mini Diploma certificate.</p>
    `, 'gold')}

    ${primaryButton('Continue Now', `${BASE_URL}/womens-health-diploma`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">I don't want you to miss this!<br/><strong>Sarah</strong></p>
  `;

  return sendEmail({
    to,
    subject: `${firstName}, only 2 days left to complete!`,
    html: emailWrapper(content, `Your Women's Health Mini Diploma access expires soon!`),
  });
}

// Women's Health Reminder Email - Day 6 (final day)
export async function sendWHReminderDay6Email(to: string, firstName: string, completedLessons: number) {
  const remaining = 9 - completedLessons;
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Last Day, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">Your access expires <strong>tomorrow</strong>.</p>

    ${completedLessons === 8 ? `
      <p style="color: #555; font-size: 16px;">You're SO close - just <strong>1 lesson left</strong>! Finish today and claim your certificate!</p>
    ` : completedLessons > 0 ? `
      <p style="color: #555; font-size: 16px;">You've done ${completedLessons} lessons. <strong>${remaining} more</strong> and you'll have your certificate!</p>
    ` : `
      <p style="color: #555; font-size: 16px;">It's not too late! Each lesson is only ~6 minutes. You can finish today if you start now.</p>
    `}

    ${highlightBox(`
      <p style="margin: 0; font-size: 15px; color: #B91C1C; font-weight: bold;">Access expires tomorrow at midnight</p>
    `, 'cream')}

    ${primaryButton('Finish Today', `${BASE_URL}/womens-health-diploma`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">You can do this!<br/><strong>Sarah</strong></p>
  `;

  return sendEmail({
    to,
    subject: `FINAL DAY ${firstName}! Your access expires tomorrow`,
    html: emailWrapper(content, `Last chance to complete your Women's Health Mini Diploma!`),
  });
}

// Women's Health Reminder Email - Day 7 (access expired)
export async function sendWHExpiredEmail(to: string, firstName: string, completedLessons: number) {
  const content = completedLessons === 0 ? `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">${firstName}, your access has ended</h2>

    <p style="color: #555; font-size: 16px;">Your 7-day access to the Women's Health Mini Diploma has expired.</p>

    <p style="color: #555; font-size: 16px;">I know life gets busy, and sometimes timing just isn't right. But I don't want you to miss out on understanding your hormones and health.</p>

    ${highlightBox(`
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #722F37; font-weight: bold;">Ready to try again?</p>
      <p style="margin: 0; font-size: 14px; color: #555;">Reply to this email and I'll give you another chance to complete your mini diploma.</p>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">Or if you're ready to go deeper, check out our full Women's Health Certification - it includes everything in the mini diploma plus so much more.</p>

    ${primaryButton('View Full Certification', `${BASE_URL}/catalog`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">I'm here when you're ready!<br/><strong>Sarah</strong></p>
  ` : `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">${firstName}, you were so close!</h2>

    <p style="color: #555; font-size: 16px;">Your 7-day access has expired, and you completed <strong>${completedLessons} of 9 lessons</strong>.</p>

    <p style="color: #555; font-size: 16px;">You were making great progress! I'd hate to see all that learning go to waste.</p>

    ${highlightBox(`
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #2D6A4F; font-weight: bold;">Want to finish?</p>
      <p style="margin: 0; font-size: 14px; color: #555;">Reply to this email and I'll extend your access so you can complete your certificate. Just ${9 - completedLessons} more lessons!</p>
    `, 'green')}

    <p style="color: #555; font-size: 16px; margin-top: 20px;">Or upgrade to our full certification and get unlimited access plus advanced modules.</p>

    ${primaryButton('View Full Certification', `${BASE_URL}/catalog`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Let me know what works for you!<br/><strong>Sarah</strong></p>
  `;

  return sendEmail({
    to,
    subject: completedLessons > 0
      ? `${firstName}, you were ${9 - completedLessons} lessons away!`
      : `${firstName}, your mini diploma access has ended`,
    html: emailWrapper(content, `Your Women's Health Mini Diploma access has expired`),
  });
}

// Women's Health Graduate Welcome Email (after certificate issued)
export async function sendWHGraduateWelcomeEmail(to: string, firstName: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">You did it, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">Your Women's Health & Hormones Mini Diploma certificate is on its way to your inbox!</p>

    <p style="color: #555; font-size: 16px;">I'm so proud of you for completing all 9 lessons. You now understand more about women's health than most people ever will.</p>

    ${highlightBox(`
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #2D6A4F; font-weight: bold;">Your Graduate Benefits:</p>
      <ul style="margin: 0; padding-left: 20px; color: #555;">
        <li style="margin: 5px 0;"><strong>30 days</strong> continued access to your lessons</li>
        <li style="margin: 5px 0;"><strong>20% OFF</strong> our full certification program</li>
        <li style="margin: 5px 0;">Your official certificate to share</li>
      </ul>
    `, 'green')}

    <p style="color: #555; font-size: 16px;">Want to go deeper? Our full Women's Health Certification covers advanced topics, client protocols, and how to build a practice helping other women.</p>

    ${primaryButton('Explore Full Certification (20% OFF)', `${BASE_URL}/catalog`)}

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Congratulations again! You should be proud of yourself.<br/><strong>Sarah</strong></p>
  `;

  return sendEmail({
    to,
    subject: `Congratulations ${firstName}! Your certificate is ready`,
    html: emailWrapper(content, `You've earned your Women's Health Mini Diploma!`),
  });
}

// ============================================
// LIVE CHAT NOTIFICATIONS (for instructor/admin)
// ============================================

export async function sendNewChatNotificationEmail(
  visitorName: string,
  visitorEmail: string | null,
  firstMessage: string,
  page: string
) {
  const BASE_URL = process.env.NEXTAUTH_URL || "https://learn.accredipro.academy";
  const INSTRUCTOR_EMAIL = process.env.INSTRUCTOR_EMAIL || "sarah@accredipro-certificate.com";

  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Live Chat Started!</h2>

    <p style="color: #555; font-size: 16px;">A potential student just started a conversation on the sales page.</p>

    ${highlightBox(`
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">Visitor Details:</p>
      <p style="margin: 0; font-size: 14px; color: #333;"><strong>Name:</strong> ${visitorName}</p>
      ${visitorEmail ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${visitorEmail}</p>` : ''}
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Page:</strong> ${page}</p>
    `, 'cream')}

    <div style="background: #f8f9fa; border-left: 4px solid #722F37; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; text-transform: uppercase;">First Message:</p>
      <p style="margin: 0; color: #333; font-style: italic;">"${firstMessage.substring(0, 300)}${firstMessage.length > 300 ? '...' : ''}"</p>
    </div>

    ${primaryButton('View Conversation', `${BASE_URL}/admin/live-chat`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">The AI is handling the conversation. Check the admin panel to monitor and respond if needed.</p>
    </div>
  `;

  return sendEmail({
    to: INSTRUCTOR_EMAIL,
    subject: `New Chat: ${visitorName} started a conversation`,
    html: emailWrapper(content, `${visitorName} started a live chat on ${page}`),
  });
}

// ============================================
// LEAD CAPTURE & MARKETING (kept for backwards compatibility)
// ============================================

interface LeadWelcomeEmailOptions {
  to: string;
  firstName: string;
  specialization: string;
  isNewUser: boolean;
}

export async function sendLeadWelcomeEmail({ to, firstName, specialization, isNewUser }: LeadWelcomeEmailOptions) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">You've taken the first step toward becoming a certified ${specialization} practitioner!</p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">Your personalized roadmap is ready:</p>
      <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${specialization} Career Path</p>
    `, 'cream')}

    ${isNewUser ? `
      ${highlightBox(`
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #722F37; font-weight: bold;">Your Login Credentials:</p>
        <p style="margin: 0; font-size: 14px; color: #333;">Email: <strong>${to}</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #333;">Password: <strong>Accredipro1234</strong></p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666; font-style: italic;">You can change your password anytime from your account settings.</p>
      `, 'cream')}
    ` : `
      ${highlightBox(`
        <p style="margin: 0; font-size: 14px; color: #722F37;">You already have an account. Log in with your existing credentials!</p>
      `, 'green')}
    `}

    ${primaryButton('Login & View My Roadmap', `${BASE_URL}/login`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Questions? Just reply to this email or message your coach directly from your dashboard.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Welcome to Your ${specialization} Journey - AccrediPro Academy`,
    html: emailWrapper(content, `Start your ${specialization} journey with AccrediPro!`),
  });
}

// ============================================
// BULK EMAIL UTILITY
// ============================================

export async function sendBulkEmails(
  recipients: { email: string; firstName?: string }[],
  subject: string,
  htmlTemplate: (firstName?: string) => string
) {
  const results = await Promise.allSettled(
    recipients.map((recipient) =>
      sendEmail({
        to: recipient.email,
        subject,
        html: htmlTemplate(recipient.firstName),
      })
    )
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { succeeded, failed, total: recipients.length };
}

// ============================================
// EMAIL TYPE EXPORTS (for type safety)
// ============================================

export type EmailType =
  | 'welcome'
  | 'password-reset'
  | 'mini-diploma-enrollment'
  | 'module-unlocked'
  | 'module-completed'
  | 'mini-diploma-completed'
  | 'training-unlocked'
  | 'challenge-unlocked'
  | 'challenge-day-unlocked'
  | 'challenge-completed'
  | 'certificate-issued'
  | 'payment-receipt'
  | 'course-enrollment'
  | 'coach-replied'
  | 'inactive-reminder'
  | 'ebook-download'
  | 'badge-earned'
  | 'course-update'
  | 'announcement';

// ============================================
// EMAIL PREVIEW GENERATOR (for admin panel)
// ============================================

export function generateEmailPreview(emailType: EmailType): string {
  const BASE_URL = process.env.NEXTAUTH_URL || "https://learn.accredipro.academy";

  // Sample data for previews
  const sampleData = {
    firstName: "John",
    email: "john@example.com",
    courseName: "Functional Medicine Certification",
    moduleTitle: "Module 3: Advanced Protocols",
    category: "Functional Medicine",
    badgeName: "Challenge Champion",
    ebookTitle: "The Complete FM Practitioner Guide",
  };

  const emailHeader = `
    <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-family: Georgia, serif;">AccrediPro Academy</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Functional Medicine Excellence</p>
    </div>
  `;

  const emailFooter = `
    <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
      <p style="margin: 0 0 5px 0; color: #722F37; font-size: 13px; font-weight: bold;">AccrediPro LLC</p>
      <p style="margin: 0; color: #999; font-size: 11px;">(At Rockefeller Center)</p>
      <p style="margin: 0; color: #999; font-size: 11px;">1270 Ave of the Americas, 7th Fl -1182</p>
      <p style="margin: 0; color: #999; font-size: 11px;">New York, NY 10020</p>
    </div>
  `;

  const wrapContent = (content: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${emailHeader}
            <div style="padding: 40px 30px;">
              ${content}
            </div>
            ${emailFooter}
          </div>
        </div>
      </body>
    </html>
  `;

  const primaryBtn = (text: string, url: string) => `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
        ${text}
      </a>
    </div>
  `;

  const highlightBoxPreview = (content: string, bgColor: string = '#FFF9E6') => `
    <div style="background: ${bgColor}; border: 1px solid #E8DCC8; border-radius: 12px; padding: 20px; margin: 20px 0;">
      ${content}
    </div>
  `;

  // Generate preview based on email type
  switch (emailType) {
    case 'welcome':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome, ${sampleData.firstName}!</h2>
        <p style="color: #555; font-size: 16px;">We're so glad you're here.</p>
        <p style="color: #555; font-size: 16px;">You've just taken an important step toward building a meaningful career in Functional Medicine.</p>
        ${highlightBoxPreview(`
          <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">Your Login Credentials:</p>
          <p style="margin: 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${sampleData.email}</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Password:</strong> Accredipro1234</p>
        `)}
        ${primaryBtn('Login to My Dashboard', `${BASE_URL}/login`)}
      `);

    case 'password-reset':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">We received a request to reset your password. Click the button below to create a new password:</p>
        ${primaryBtn('Reset Password', `${BASE_URL}/reset-password?token=sample`)}
        ${highlightBoxPreview(`
          <p style="margin: 0; font-size: 13px; color: #722F37;"><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
        `)}
      `);

    case 'mini-diploma-enrollment':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">You're Enrolled!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">Congratulations! You've started your <strong>${sampleData.category}</strong> Mini Diploma.</p>
        ${highlightBoxPreview(`
          <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">Your Free Mini Diploma:</p>
          <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${sampleData.category} Fundamentals</p>
        `)}
        ${primaryBtn('Start Learning Now', `${BASE_URL}/my-mini-diploma`)}
      `);

    case 'module-unlocked':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Module Unlocked!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">A new module is now available for you:</p>
        ${highlightBoxPreview(`
          <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">Now Available:</p>
          <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${sampleData.moduleTitle}</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Part of: ${sampleData.courseName}</p>
        `)}
        ${primaryBtn('Start This Module', `${BASE_URL}/my-courses`)}
      `);

    case 'module-completed':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Module Complete!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">Congratulations! You've completed:</p>
        ${highlightBoxPreview(`
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #722F37;">${sampleData.moduleTitle}</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Part of: ${sampleData.courseName}</p>
        `, '#dcfce7')}
        ${primaryBtn('Continue to Next Module', `${BASE_URL}/my-courses`)}
      `);

    case 'mini-diploma-completed':
      return wrapContent(`
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #722F37; margin: 0; font-size: 28px;">Mini Diploma Complete!</h2>
        </div>
        <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, ${sampleData.firstName}!</p>
        <p style="color: #555; font-size: 16px; text-align: center;">You've successfully completed your <strong>${sampleData.category} Mini Diploma</strong>!</p>
        ${highlightBoxPreview(`
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">UNLOCKED</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">Graduate Orientation Training</p>
          </div>
        `, '#dcfce7')}
        ${primaryBtn('Watch Graduate Training', `${BASE_URL}/training`)}
      `);

    case 'training-unlocked':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your Training is Ready!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">The exclusive Graduate Orientation Training is now unlocked for you!</p>
        ${highlightBoxPreview(`
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">NOW AVAILABLE</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">Graduate Orientation Training</p>
          </div>
        `)}
        ${primaryBtn('Watch Training Now', `${BASE_URL}/training`)}
      `);

    case 'challenge-unlocked':
      return wrapContent(`
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #722F37; margin: 0; font-size: 28px;">7-Day Challenge Unlocked!</h2>
        </div>
        <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, ${sampleData.firstName}!</p>
        <p style="color: #555; font-size: 16px; text-align: center;">You've earned access to the <strong>7-Day Activation Challenge</strong>!</p>
        ${highlightBoxPreview(`
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">YOUR GRADUATE GIFT</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">7-Day Activation Challenge</p>
          </div>
        `)}
        ${primaryBtn('Start Day 1 Now', `${BASE_URL}/challenges`)}
      `);

    case 'challenge-day-unlocked':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Day 3 is Ready!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">Your next challenge day is now unlocked:</p>
        ${highlightBoxPreview(`
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">DAY 3</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">Build Your Online Presence</p>
          </div>
        `)}
        ${primaryBtn('Start Day 3', `${BASE_URL}/challenges`)}
      `);

    case 'challenge-completed':
      return wrapContent(`
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #722F37; margin: 0; font-size: 28px;">Challenge Complete!</h2>
        </div>
        <p style="color: #555; font-size: 16px; text-align: center;">Incredible work, ${sampleData.firstName}!</p>
        <p style="color: #555; font-size: 16px; text-align: center;">You've successfully completed the <strong>7-Day Activation Challenge</strong>!</p>
        ${highlightBoxPreview(`
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">ACHIEVEMENT UNLOCKED</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">Challenge Champion Badge</p>
          </div>
        `, '#dcfce7')}
        ${primaryBtn('View Full Certification', `${BASE_URL}/courses/functional-medicine-complete-certification`)}
      `);

    case 'certificate-issued':
      return wrapContent(`
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #722F37; margin: 0; font-size: 28px;">Your Certificate is Ready!</h2>
        </div>
        <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, ${sampleData.firstName}!</p>
        <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); border-radius: 12px; padding: 30px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">Certificate of Completion</p>
          <p style="margin: 15px 0; font-size: 22px; font-weight: bold; color: white;">${sampleData.courseName}</p>
          <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8);">Certificate #AP-2024-12345</p>
        </div>
        ${primaryBtn('Download Certificate', `${BASE_URL}/certificates`)}
      `);

    case 'payment-receipt':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Payment Confirmation</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">Thank you for your purchase! Here's your receipt:</p>
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Product</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #333;">${sampleData.courseName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Amount</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #166534;">$2,997.00</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Date</td>
              <td style="padding: 10px 0; text-align: right; color: #333;">December 13, 2024</td>
            </tr>
          </table>
        </div>
        ${primaryBtn('Access My Course', `${BASE_URL}/my-courses`)}
      `);

    case 'course-enrollment':
      return wrapContent(`
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #722F37; margin: 0; font-size: 28px;">You're Enrolled!</h2>
        </div>
        <p style="color: #555; font-size: 16px; text-align: center;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px; text-align: center;">You now have full access to:</p>
        ${highlightBoxPreview(`
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #722F37;">${sampleData.courseName}</p>
          </div>
        `)}
        ${primaryBtn('Start Learning', `${BASE_URL}/my-courses`)}
      `);

    case 'coach-replied':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">You Have a New Message!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;"><strong style="color: #722F37;">Coach Sarah</strong> has replied to your message:</p>
        <div style="background: #f8f9fa; border-left: 4px solid #722F37; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #333; font-style: italic;">"Great question! Let me explain how the assessment protocol works..."</p>
        </div>
        ${primaryBtn('View Full Message', `${BASE_URL}/messages`)}
      `);

    case 'inactive-reminder':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">We Miss You, ${sampleData.firstName}!</h2>
        <p style="color: #555; font-size: 16px;">It's been <strong style="color: #722F37;">5 days</strong> since your last visit. Your learning journey is waiting!</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Your Progress</p>
          <div style="background: #e0e0e0; border-radius: 10px; height: 20px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #722F37, #D4AF37); height: 100%; width: 45%;"></div>
          </div>
          <p style="margin: 10px 0 0 0; text-align: center; font-weight: bold; color: #722F37;">45% Complete</p>
        </div>
        ${primaryBtn('Continue Learning', `${BASE_URL}/my-courses`)}
      `);

    case 'ebook-download':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your eBook is Ready!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">Great news! Your eBook is now available for download:</p>
        ${highlightBoxPreview(`
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">YOUR EBOOK</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${sampleData.ebookTitle}</p>
          </div>
        `)}
        ${primaryBtn('Download eBook', `${BASE_URL}/my-library`)}
      `);

    case 'badge-earned':
      return wrapContent(`
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #722F37; margin: 0; font-size: 28px;">You Earned a Badge!</h2>
        </div>
        <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, ${sampleData.firstName}!</p>
        <p style="color: #555; font-size: 16px; text-align: center;">You've unlocked a new achievement:</p>
        ${highlightBoxPreview(`
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #D4AF37; font-weight: bold; text-transform: uppercase;">ACHIEVEMENT UNLOCKED</p>
            <p style="margin: 12px 0 0 0; font-size: 24px; font-weight: bold; color: #722F37;">${sampleData.badgeName}</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Completed the 7-Day Activation Challenge</p>
          </div>
        `, 'linear-gradient(135deg, #FDF5E6 0%, #FFF8DC 100%)')}
        ${primaryBtn('View My Badges', `${BASE_URL}/my-library`)}
      `);

    case 'course-update':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Content Added!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">We've just added new content to your course:</p>
        ${highlightBoxPreview(`
          <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">Course Update</p>
          <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #722F37;">Advanced Lab Interpretation Guide</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">In: ${sampleData.courseName}</p>
        `, '#dbeafe')}
        <p style="color: #555; font-size: 16px;">This comprehensive guide covers the latest lab markers and interpretation techniques used by top practitioners.</p>
        ${primaryBtn('View New Content', `${BASE_URL}/my-courses`)}
      `);

    case 'announcement':
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Exciting News from AccrediPro!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${sampleData.firstName},</p>
        <p style="color: #555; font-size: 16px;">We're thrilled to announce the launch of our new Advanced Certification Program! This program includes:</p>
        <ul style="color: #555; font-size: 15px; padding-left: 20px;">
          <li style="margin: 8px 0;">20+ hours of advanced content</li>
          <li style="margin: 8px 0;">Live Q&A sessions with experts</li>
          <li style="margin: 8px 0;">Exclusive practitioner resources</li>
        </ul>
        ${primaryBtn('Learn More', `${BASE_URL}/courses`)}
        <p style="color: #555; font-size: 16px; margin-top: 30px;">Warmly,<br/><strong>The AccrediPro Team</strong></p>
      `);

    default:
      return wrapContent(`
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Email Preview</h2>
        <p style="color: #555; font-size: 16px;">Preview not available for this email type.</p>
      `);
  }
}

// ============================================
// SUPPORT TICKET EMAILS
// ============================================

// 17. Ticket Reply (Admin -> Customer)
export async function sendTicketReplyEmail(
  to: string,
  customerName: string,
  ticketNumber: number,
  subject: string,
  message: string,
  staffName: string = "AccrediPro Support"
) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Reply to Ticket #${ticketNumber}</h2>

    <p style="color: #555; font-size: 16px;">Hi ${customerName},</p>
    <p style="color: #555; font-size: 16px;">${staffName} has replied to your ticket:</p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #722F37;">
      <p style="margin: 0; font-size: 14px; color: #888; margin-bottom: 8px;">Subject: ${subject}</p>
      <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
    </div>

    ${primaryButton('View Ticket & Reply', `${BASE_URL}/dashboard/support`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">You can also reply directly to this email.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Re: Ticket #${ticketNumber} - ${subject}`,
    html: emailWrapper(content, `New reply from ${staffName} on Ticket #${ticketNumber}`),
    replyTo: `ticket-${ticketNumber}@tickets.accredipro-certificate.com`
  });
}

// 18. Rating Request (Auto or Manual Resolve)
export async function sendTicketRatingRequestEmail(
  to: string,
  customerName: string,
  ticketNumber: number
) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">How did we do?</h2>

    <p style="color: #555; font-size: 16px;">Hi ${customerName},</p>
    <p style="color: #555; font-size: 16px;">Your ticket <strong>#${ticketNumber}</strong> has been resolved. We'd love to hear about your experience.</p>

    <div style="text-align: center; margin: 40px 0;">
      <p style="color: #555; font-size: 16px; margin-bottom: 20px;">How would you rate the support you received?</p>
      
      <div style="display: flex; justify-content: center; gap: 10px;">
        <a href="${BASE_URL}/ticket-feedback/${ticketNumber}?rating=5" style="text-decoration: none; font-size: 32px;" title="Excellent">⭐⭐⭐⭐⭐</a>
      </div>
      <div style="margin-top: 10px;">
        <a href="${BASE_URL}/ticket-feedback/${ticketNumber}" style="color: #722F37; font-size: 14px; text-decoration: underline;">Rate your experience</a>
      </div>
    </div>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">If your issue isn't resolved, you can simply reply to this email to reopen the ticket.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `How was our support? (Ticket #${ticketNumber})`,
    html: emailWrapper(content, `Rate your support experience for Ticket #${ticketNumber}`),
  });
}

// 19. Staff Notification (Customer Reply)
export async function sendStaffNotificationEmail(
  staffEmail: string,
  ticketNumber: number,
  customerName: string,
  message: string,
  ticketId: string
) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Customer Reply</h2>

    <p style="color: #555; font-size: 16px;"><strong>${customerName}</strong> replied to Ticket #${ticketNumber}:</p>

    <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
    </div>

    ${primaryButton('View in Admin', `${BASE_URL}/admin/tickets`)}
  `;

  return sendEmail({
    to: staffEmail,
    subject: `[Ticket #${ticketNumber}] New reply from ${customerName}`,
    html: emailWrapper(content, `${customerName} replied to their support ticket.`),
  });
}

// ============================================
// SARAH NUDGE EMAILS (Proactive Re-engagement)
// ============================================

/**
 * Send a Sarah nudge email - personal style to feel like a real mentor
 * Used by the sarah-nudges CRON job for 5d+ inactive users
 */
export async function sendSarahNudgeEmail({
  to,
  firstName,
  subject,
  message,
  loginUrl,
}: {
  to: string;
  firstName: string;
  subject: string;
  message: string;
  loginUrl?: string;
}) {
  // Personal-style content (like a real mentor would write)
  const content = `
Hey ${firstName},

${message}

${loginUrl ? `When you're ready: ${loginUrl}` : ''}

Talk soon,
Sarah

P.S. Just reply to this email if you want to chat — I read everything personally.
  `.trim();

  const html = personalEmailWrapper(`
    <p style="margin: 0 0 16px 0; color: #333;">Hey ${firstName},</p>
    <p style="margin: 0 0 16px 0; color: #333;">${message.replace(/\n/g, '</p><p style="margin: 0 0 16px 0; color: #333;">')}</p>
    ${loginUrl ? `<p style="margin: 0 0 16px 0; color: #333;">When you're ready: <a href="${loginUrl}" style="color: #722F37;">${loginUrl}</a></p>` : ''}
    <p style="margin: 24px 0 0 0; color: #333;">Talk soon,<br/>Sarah</p>
    <p style="margin: 16px 0 0 0; color: #666; font-size: 13px; font-style: italic;">P.S. Just reply to this email if you want to chat — I read everything personally.</p>
  `);

  // Fill in firstName in subject if template includes it
  const filledSubject = subject.replace(/\{\{firstName\}\}/g, firstName);

  return sendEmail({
    to,
    subject: filledSubject,
    html,
    text: content,
    replyTo: 'info@accredipro-certificate.com',
    type: 'marketing', // Use marketing sender (Sarah)
  });
}

// ============================================
// DFY PURCHASE EMAILS
// ============================================

/**
 * Send DFY welcome email from Jessica Parker - notifies customer of purchase and intake form
 */
export async function sendDFYWelcomeEmail({
  to,
  firstName,
  productName,
  intakeUrl,
}: {
  to: string;
  firstName: string;
  productName: string;
  intakeUrl: string;
}) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your Done-For-You Package is Confirmed! 🎉</h2>

    <p style="color: #555; font-size: 16px;">Hey ${firstName}!</p>

    <p style="color: #555; font-size: 16px;">I'm <strong>Jessica</strong>, your DFY fulfillment specialist at AccrediPro. I just saw your order come through — and I'm excited to start working on your website!</p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">YOUR PACKAGE</p>
      <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${productName}</p>
    `, 'green')}

    <p style="color: #555; font-size: 16px;"><strong>What happens next:</strong></p>
    <ol style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 10px 0;">Fill out the quick intake form below (takes ~15 mins)</li>
      <li style="margin: 10px 0;">I'll start working on your website right away</li>
      <li style="margin: 10px 0;">You'll receive your completed website within 7 days</li>
    </ol>

    ${primaryButton('Fill Out Intake Form →', intakeUrl)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Have questions? Just reply to this email or message me directly in your dashboard.</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Talk soon,<br/><strong>Jessica Parker</strong><br/><span style="color: #888; font-size: 13px;">DFY Fulfillment Specialist, AccrediPro Academy</span></p>
  `;

  return sendEmail({
    to,
    subject: `Your ${productName} is Confirmed! Next Steps Inside`,
    html: emailWrapper(content, `Hey ${firstName}! Your DFY package is confirmed. Fill out the intake form to get started.`),
  });
}

/**
 * Send DFY intake form reminder email - nudges customer to complete the form
 */
export async function sendDFYIntakeReminderEmail({
  to,
  firstName,
  productName,
  intakeUrl,
}: {
  to: string;
  firstName: string;
  productName: string;
  intakeUrl: string;
}) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Quick Reminder! 👋</h2>

    <p style="color: #555; font-size: 16px;">Hey ${firstName}!</p>

    <p style="color: #555; font-size: 16px;">I noticed you haven't filled out your intake form yet — <strong>I'm ready and waiting to start on your ${productName}!</strong></p>

    ${highlightBox(`
      <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">⏰ ACTION NEEDED</p>
      <p style="margin: 8px 0 0 0; font-size: 15px; color: #555;">Complete your intake form so I can get started!</p>
    `, 'amber')}

    <p style="color: #555; font-size: 16px;">The intake form only takes about <strong>15 minutes</strong> and includes questions about your:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Brand colors and style preferences</li>
      <li style="margin: 8px 0;">Your story and what makes you unique</li>
      <li style="margin: 8px 0;">Your ideal clients</li>
      <li style="margin: 8px 0;">Program details and pricing</li>
    </ul>

    ${primaryButton('Complete My Intake Form →', intakeUrl)}

    <p style="color: #555; font-size: 16px;">Once I have this, I'll start working on your website right away and have it ready within 7 days!</p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Questions? Just hit reply — I'm here to help!</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Excited to get started!<br/><strong>Jessica Parker</strong><br/><span style="color: #888; font-size: 13px;">DFY Fulfillment Specialist, AccrediPro Academy</span></p>
  `;

  return sendEmail({
    to,
    subject: `Reminder: Fill Out Your ${productName} Intake Form 📝`,
    html: emailWrapper(content, `Hey ${firstName}! Quick reminder to complete your intake form so I can start on your DFY package.`),
  });
}

/**
 * Send DFY delivery complete email - notifies customer that their package is ready
 */
export async function sendDFYDeliveryEmail({
  to,
  firstName,
  productName,
  dashboardUrl,
}: {
  to: string;
  firstName: string;
  productName: string;
  dashboardUrl: string;
}) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #722F37; margin: 0; font-size: 28px;">Your Package is Ready! 🎁</h2>
    </div>

    <p style="color: #555; font-size: 16px; text-align: center;">Hey ${firstName}!</p>

    <p style="color: #555; font-size: 16px; text-align: center;">Great news — your <strong>${productName}</strong> is complete and waiting for you in your dashboard!</p>

    ${highlightBox(`
      <div style="text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #166534; font-weight: bold;">DELIVERED</p>
        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${productName}</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Ready to use</p>
      </div>
    `, 'green')}

    <p style="color: #555; font-size: 16px;">Everything has been customized based on your intake form and is ready to use with your clients.</p>

    ${primaryButton('Access My Package', dashboardUrl)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Need any tweaks or have questions? Just reply to this email — I'm here to help!</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Cheers,<br/><strong>Jessica Parker</strong></p>
  `;

  return sendEmail({
    to,
    subject: `Your ${productName} is Ready! 🎁`,
    html: emailWrapper(content, `${firstName}, your DFY package is ready and waiting in your dashboard!`),
  });
}

/**
 * Send internal email to Jessica when a customer submits DFY intake form
 */
export async function sendDFYIntakeReceivedEmail({
  customerName,
  customerEmail,
  productName,
  intakeData,
  adminDashboardUrl,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
  intakeData: Record<string, any>;
  adminDashboardUrl: string;
}) {
  // Format intake data into readable sections
  const formatField = (key: string, value: any): string => {
    if (!value) return "";
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
    const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
    return `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600; color: #555; width: 30%; vertical-align: top;">${label}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #333;">${displayValue}</td>
      </tr>
    `;
  };

  const contactFields = ["firstName", "lastName", "email", "phone"];
  const programFields = ["coachingTitle", "certifications", "programName", "programDetails", "price"];
  const brandingFields = ["websiteFeel", "colors", "howToStart", "schedulingTool", "socialMedia"];
  const storyFields = ["story", "idealClient", "differentiation", "successStories", "websiteGoal", "anythingElse"];

  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">🎉 New DFY Intake Received!</h2>

    <p style="color: #555; font-size: 16px;"><strong>${customerName}</strong> (${customerEmail}) just submitted their intake form for <strong>${productName}</strong>.</p>

    ${primaryButton('View in Dashboard →', adminDashboardUrl)}

    <div style="margin-top: 30px;">
      <h3 style="color: #722F37; font-size: 18px; margin-bottom: 10px;">📋 Contact Info</h3>
      <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 8px; overflow: hidden;">
        ${contactFields.map(f => formatField(f, intakeData[f])).join("")}
      </table>
    </div>

    <div style="margin-top: 25px;">
      <h3 style="color: #722F37; font-size: 18px; margin-bottom: 10px;">📦 Program Details</h3>
      <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 8px; overflow: hidden;">
        ${programFields.map(f => formatField(f, intakeData[f])).join("")}
      </table>
    </div>

    <div style="margin-top: 25px;">
      <h3 style="color: #722F37; font-size: 18px; margin-bottom: 10px;">🎨 Branding Preferences</h3>
      <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 8px; overflow: hidden;">
        ${brandingFields.map(f => formatField(f, intakeData[f])).join("")}
      </table>
    </div>

    <div style="margin-top: 25px;">
      <h3 style="color: #722F37; font-size: 18px; margin-bottom: 10px;">📖 Story & Goals</h3>
      <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 8px; overflow: hidden;">
        ${storyFields.map(f => formatField(f, intakeData[f])).join("")}
      </table>
    </div>

    ${intakeData.photoUrls?.length ? `
      <div style="margin-top: 25px;">
        <h3 style="color: #722F37; font-size: 18px; margin-bottom: 10px;">📸 Uploaded Photos</h3>
        <p style="color: #555; font-size: 14px;">${intakeData.photoUrls.length} photo(s) uploaded - view in dashboard</p>
      </div>
    ` : ""}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Remember: Target delivery within 7 days. Reply to this email if you need help!</p>
    </div>
  `;

  // Send to Jessica's email
  return sendEmail({
    to: "jessica@accredipro-certificate.com",
    subject: `🎉 New DFY Intake: ${customerName} - ${productName}`,
    html: emailWrapper(content, `New DFY intake received from ${customerName}`),
  });
}

