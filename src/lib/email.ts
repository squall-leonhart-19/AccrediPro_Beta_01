import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Transactional emails (password reset, course enrollment, etc.)
const FROM_EMAIL_TRANSACTIONAL = process.env.FROM_EMAIL || "AccrediPro Academy <info@accredipro-certificate.com>";
// Marketing/sequence emails - PERSONAL NAME to reach primary inbox
// Format: "Sarah <email>" looks like a personal email, not marketing
const FROM_EMAIL_MARKETING = process.env.FROM_EMAIL_MARKETING || "Sarah <info@accredipro-certificate.com>";

const BASE_URL = process.env.NEXTAUTH_URL || "https://learn.accredipro.academy";
const LOGO_URL = "https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png";
const UNSUBSCRIBE_URL = `${BASE_URL}/unsubscribe`;

// ============================================
// REUSABLE EMAIL TEMPLATE COMPONENTS
// ============================================

const emailHeader = `
  <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
    <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-family: Georgia, serif;">AccrediPro Academy</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Functional Medicine Excellence</p>
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

  // Convert any fancy HTML to simple text-like HTML
  const simplifiedContent = noEmojis
    // Remove any inline styles
    .replace(/style="[^"]*"/gi, '')
    // Simple paragraph spacing
    .replace(/<p>/gi, '<p style="margin:0 0 14px 0;">')
    // Simple links - no color styling
    .replace(/<a\s+href=/gi, '<a href=');

  // Ultra minimal - like Gmail compose
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#222;">
${simplifiedContent}
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

// Main send function for transactional emails (default)
export async function sendEmail({ to, subject, html, text, replyTo, type = 'transactional' }: SendEmailOptions) {
  try {
    // Skip if no email address provided (fake profiles have null email)
    if (!to || (Array.isArray(to) && to.length === 0)) {
      console.log(`📧 SKIPPING EMAIL - No recipient address provided`);
      return { success: false, error: 'No recipient email' };
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

    <p style="color: #555; font-size: 16px;">You've just taken an important step toward building a meaningful career in Functional Medicine — and we're honored to be part of your journey.</p>

    ${highlightBox(`
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">Your Login Credentials:</p>
      <p style="margin: 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${to}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Password:</strong> Futurecoach2025</p>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #666; font-style: italic;">You can change your password anytime from your account settings.</p>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">Inside your dashboard, you'll find everything you need to get started:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 10px 0;">Direct access to your dedicated coach</li>
      <li style="margin: 10px 0;">Resources to support you every step of the way</li>
    </ul>

    <p style="color: #555; font-size: 16px;">Take your time, explore at your own pace, and know that we're here whenever you need us.</p>

    ${primaryButton('Login to My Dashboard', `${BASE_URL}/login`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Questions? Just reply to this email or message your coach directly from your dashboard. We're always happy to help.</p>
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

    <p style="color: #555; font-size: 16px;">Your course includes:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Premium video lessons</li>
      <li style="margin: 8px 0;">Downloadable resources</li>
      <li style="margin: 8px 0;">1:1 coaching support</li>
      <li style="margin: 8px 0;">Professional certification</li>
    </ul>

    ${primaryButton('Start Learning', courseUrl)}

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
}

export async function sendFreebieWelcomeEmail({ to, firstName, isExistingUser }: FreebieWelcomeEmailOptions) {
  const content = isExistingUser ? `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome Back, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">Great news! Your free Mini Diploma in Functional Medicine is now ready.</p>

    <p style="color: #555; font-size: 16px;">Since you already have an account, simply log in with your existing credentials to access:</p>

    ${highlightBox(`
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">What's Waiting For You:</p>
      <ul style="margin: 0; padding-left: 20px; color: #555;">
        <li style="margin: 5px 0;">Complete video training on functional medicine essentials</li>
        <li style="margin: 5px 0;">Mini Diploma certificate upon completion</li>
        <li style="margin: 5px 0;">Personal audio welcome from Sarah</li>
        <li style="margin: 5px 0;">Lifetime access to all materials</li>
      </ul>
    `, 'cream')}

    ${primaryButton('Login to My Dashboard', `${BASE_URL}/login`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Forgot your password? No problem! Use the "Forgot Password" link on the login page.</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">See you inside!<br/><strong>Sarah</strong><br/>AccrediPro Academy</p>
  ` : `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome, ${firstName}!</h2>

    <p style="color: #555; font-size: 16px;">Your free Mini Diploma in Functional Medicine is ready and waiting for you.</p>

    <p style="color: #555; font-size: 16px;">Here are your login details:</p>

    ${highlightBox(`
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">Your Login Credentials:</p>
      <p style="margin: 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${to}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Password:</strong> Futurecoach2025</p>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #666; font-style: italic;">You can change your password anytime from your account settings.</p>
    `, 'cream')}

    <p style="color: #555; font-size: 16px;">Once you log in, you'll find:</p>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      <li style="margin: 8px 0;">Your Mini Diploma course ready to start</li>
      <li style="margin: 8px 0;">A personal audio welcome from me</li>
      <li style="margin: 8px 0;">Step-by-step video lessons</li>
      <li style="margin: 8px 0;">Your certificate upon completion</li>
    </ul>

    ${primaryButton('Login Now', `${BASE_URL}/login`)}

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Questions? Just reply to this email. I personally read every message.</p>
    </div>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">Looking forward to seeing you inside!<br/><strong>Sarah</strong><br/>AccrediPro Academy</p>
  `;

  return sendEmail({
    to,
    subject: isExistingUser
      ? `${firstName}, your Mini Diploma is ready!`
      : `Welcome ${firstName}! Your Mini Diploma awaits`,
    html: emailWrapper(content, `Your free Mini Diploma in Functional Medicine is ready!`),
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
    replyTo: `ticket-${ticketNumber}@accredipro-certificate.com`
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
