import { PrismaClient, EmailCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Reusable email components
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
    <p style="margin: 0 0 15px 0; color: #999; font-size: 11px;">United States</p>
    <p style="margin: 0; color: #bbb; font-size: 10px; font-style: italic;">Veritas Et Excellentia - Truth and Excellence in Education</p>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="margin: 0; color: #bbb; font-size: 10px;">
        This is a transactional email from AccrediPro Academy.<br/>
        You're receiving this because of your account activity.
      </p>
      <p style="margin: 10px 0 0 0;">
        <a href="{{unsubscribeUrl}}" style="color: #999; font-size: 10px; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
`;

function wrapTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="description" content="{{preheader}}">
    <!--[if mso]>
    <style type="text/css">
      body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="display:none;font-size:1px;color:#f5f5f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">{{preheader}}</div>
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
</html>`;
}

const primaryButton = (text: string, urlPlaceholder: string) => `
<div style="text-align: center; margin: 30px 0;">
  <a href="${urlPlaceholder}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(114,47,55,0.3);">
    ${text}
  </a>
</div>
`;

const highlightBox = (content: string, type: 'cream' | 'green' | 'gold' | 'blue' = 'cream') => {
  const styles: Record<string, string> = {
    cream: 'background: linear-gradient(135deg, #FFFEF5 0%, #FFF9E6 100%); border: 1px solid #E8DCC8;',
    green: 'background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #22c55e;',
    gold: 'background: linear-gradient(135deg, #FDF5E6 0%, #FFF8DC 100%); border: 1px solid #D4AF37;',
    blue: 'background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #3b82f6;',
  };
  return `<div style="${styles[type]} border-radius: 12px; padding: 20px; margin: 20px 0;">${content}</div>`;
};

const progressBar = (placeholder: string) => `
<div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
  <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Your Progress</p>
  <div style="background: #e0e0e0; border-radius: 10px; height: 20px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #722F37, #D4AF37); height: 100%; width: ${placeholder};"></div>
  </div>
  <p style="margin: 10px 0 0 0; text-align: center; font-weight: bold; color: #722F37;">${placeholder} Complete</p>
</div>
`;

// Email templates data - IMPROVED FOR MAX TRUST & ENGAGEMENT
const emailTemplates = [
  // ==================== ACCOUNT EMAILS ====================
  {
    slug: 'welcome',
    name: 'Welcome Email',
    description: 'Sent when a new user registers - includes login credentials',
    category: EmailCategory.ACCOUNT,
    subject: 'Welcome to AccrediPro, {{firstName}}! Your journey starts now',
    preheader: 'Your login credentials are inside. Start your transformation today.',
    placeholders: ['firstName', 'email', 'loginUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome, {{firstName}}!</h2>

      <p style="color: #555; font-size: 16px;">We're honored you've chosen to invest in yourself.</p>

      <p style="color: #555; font-size: 16px;">You've just joined thousands of women who are transforming their lives through Functional Medicine — and we're here to support you every step of the way.</p>

      ${highlightBox(`
        <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">Your Login Credentials:</p>
        <p style="margin: 0; font-size: 14px; color: #333;"><strong>Email:</strong> {{email}}</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Password:</strong> Accredipro1234</p>
        <p style="margin: 12px 0 0 0; font-size: 12px; color: #666; font-style: italic;">For security, please change your password in account settings after your first login.</p>
      `, 'cream')}

      <p style="color: #555; font-size: 16px;">Inside your personalized dashboard, you'll discover:</p>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        <li style="margin: 10px 0;"><strong>Your Learning Path</strong> — tailored to your goals</li>
        <li style="margin: 10px 0;"><strong>Direct Coach Access</strong> — real support when you need it</li>
        <li style="margin: 10px 0;"><strong>Downloadable Resources</strong> — tools to accelerate your success</li>
      </ul>

      <p style="color: #555; font-size: 16px;">Take your time, move at your own pace, and remember: <strong>progress over perfection</strong>.</p>

      ${primaryButton('Login to My Dashboard', '{{loginUrl}}')}

      ${highlightBox(`
        <p style="margin: 0; font-size: 14px; color: #666;"><strong style="color: #722F37;">Questions?</strong> Reply to this email or message your coach directly from your dashboard. We typically respond within 24 hours.</p>
      `, 'cream')}

      <p style="color: #555; font-size: 16px; margin-top: 30px;">Here's to your success,<br/><strong>The AccrediPro Team</strong></p>
    `),
  },
  {
    slug: 'password-reset',
    name: 'Password Reset',
    description: 'Sent when user requests password reset',
    category: EmailCategory.ACCOUNT,
    subject: 'Reset Your Password - AccrediPro Academy',
    preheader: 'Click to reset your AccrediPro password. Link expires in 1 hour.',
    placeholders: ['firstName', 'resetUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Reset Your Password</h2>

      <p style="color: #555; font-size: 16px;">Hi{{firstName}},</p>
      <p style="color: #555; font-size: 16px;">We received a request to reset your password. Click the button below to create a new password:</p>

      ${primaryButton('Reset Password', '{{resetUrl}}')}

      ${highlightBox(`
        <p style="margin: 0; font-size: 13px; color: #722F37;">
          <strong>Security Notice:</strong> This link expires in 1 hour. If you didn't request this reset, please ignore this email — your password will remain unchanged.
        </p>
      `, 'cream')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
        <p style="margin: 0; font-size: 14px; color: #666;">If you're having trouble clicking the button, copy and paste this link into your browser:</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #722F37; word-break: break-all;">{{resetUrl}}</p>
      </div>
    `),
  },

  // ==================== MINI DIPLOMA EMAILS ====================
  {
    slug: 'mini-diploma-enrollment',
    name: 'Mini Diploma Enrollment',
    description: 'Sent when user enrolls in a free Mini Diploma',
    category: EmailCategory.MINI_DIPLOMA,
    subject: "You're In! Start Your {{category}} Mini Diploma",
    preheader: 'Your free Mini Diploma is ready. Start learning immediately!',
    placeholders: ['firstName', 'category', 'startUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">You're In, {{firstName}}!</h2>

      <p style="color: #555; font-size: 16px;">Congratulations on taking this step! Your <strong>{{category}} Mini Diploma</strong> is now unlocked and ready.</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">Your Free Training</p>
          <p style="margin: 8px 0 0 0; font-size: 22px; font-weight: bold; color: #722F37;">{{category}} Mini Diploma</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Complete all modules to unlock the Graduate Training</p>
        </div>
      `, 'gold')}

      <p style="color: #555; font-size: 16px;">Here's what you'll discover:</p>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        <li style="margin: 8px 0;">Core {{category}} principles every practitioner needs</li>
        <li style="margin: 8px 0;">Assessment techniques you can use immediately</li>
        <li style="margin: 8px 0;">Introduction to client-ready protocols</li>
      </ul>

      ${primaryButton('Start Learning Now', '{{startUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          <strong>100% Free.</strong> Complete at your own pace.<br/>
          Most students finish in 2-3 days!
        </p>
      </div>
    `),
  },
  {
    slug: 'module-unlocked',
    name: 'Module Unlocked',
    description: 'Sent when a new module becomes available',
    category: EmailCategory.MINI_DIPLOMA,
    subject: 'New Module Ready: {{moduleTitle}}',
    preheader: 'Your next lesson is waiting! Continue your momentum.',
    placeholders: ['firstName', 'moduleTitle', 'courseTitle', 'moduleUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Module Unlocked!</h2>

      <p style="color: #555; font-size: 16px;">Hi {{firstName}},</p>
      <p style="color: #555; font-size: 16px;">Great progress! Your next module is now available:</p>

      ${highlightBox(`
        <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">Now Available</p>
        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">{{moduleTitle}}</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Part of: {{courseTitle}}</p>
      `, 'cream')}

      ${primaryButton('Start This Module', '{{moduleUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          <strong style="color: #722F37;">Pro Tip:</strong> Consistency beats intensity.<br/>
          Even 15 minutes today moves you forward!
        </p>
      </div>
    `),
  },
  {
    slug: 'module-completed',
    name: 'Module Completed',
    description: 'Sent when user completes a module',
    category: EmailCategory.MINI_DIPLOMA,
    subject: 'Module Complete! {{progress}}% Done',
    preheader: 'Amazing work! You just completed {{moduleTitle}}.',
    placeholders: ['firstName', 'moduleTitle', 'courseTitle', 'progress', 'nextModuleUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Module Complete!</h2>

      <p style="color: #555; font-size: 16px;">Amazing work, {{firstName}}!</p>
      <p style="color: #555; font-size: 16px;">You've successfully completed:</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #166534;">{{moduleTitle}}</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Part of: {{courseTitle}}</p>
        </div>
      `, 'green')}

      ${progressBar('{{progress}}%')}

      <p style="color: #555; font-size: 16px;">You're building real expertise. Keep that momentum going!</p>

      ${primaryButton('Continue to Next Module', '{{nextModuleUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          Each module you complete brings you closer to your certification. You've got this!
        </p>
      </div>
    `),
  },
  {
    slug: 'mini-diploma-completed',
    name: 'Mini Diploma Completed',
    description: 'Sent when user completes their free Mini Diploma',
    category: EmailCategory.MINI_DIPLOMA,
    subject: 'Congratulations! Your Mini Diploma is Complete',
    preheader: 'You did it! Graduate Training is now unlocked.',
    placeholders: ['firstName', 'category', 'trainingUrl'],
    htmlContent: wrapTemplate(`
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #722F37; margin: 0; font-size: 28px;">Mini Diploma Complete!</h2>
      </div>

      <p style="color: #555; font-size: 16px; text-align: center;">Incredible work, {{firstName}}!</p>
      <p style="color: #555; font-size: 16px; text-align: center;">You've officially completed your <strong>{{category}} Mini Diploma</strong>!</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #22c55e; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Achievement Unlocked</p>
          <p style="margin: 12px 0 0 0; font-size: 22px; font-weight: bold; color: #722F37;">Graduate Orientation Training</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Discover how to build a $5,000+/month practice</p>
        </div>
      `, 'green')}

      <p style="color: #555; font-size: 16px;">Your next step: Watch the exclusive Graduate Orientation Training where you'll learn:</p>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        <li style="margin: 8px 0;">Your complete certification roadmap</li>
        <li style="margin: 8px 0;">How to get your first paying clients</li>
        <li style="margin: 8px 0;">Real income potential at each certification level</li>
      </ul>

      ${primaryButton('Watch Graduate Training', '{{trainingUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          <strong>What's next?</strong> The training unlocks your 7-Day Activation Challenge!
        </p>
      </div>
    `),
  },

  // ==================== GRADUATE JOURNEY EMAILS ====================
  {
    slug: 'training-unlocked',
    name: 'Graduate Training Unlocked',
    description: 'Sent when Graduate Orientation Training becomes available',
    category: EmailCategory.GRADUATE,
    subject: 'Your Training is Ready: Build a $5K+/Month Practice',
    preheader: 'The Graduate Orientation Training is now unlocked for you!',
    placeholders: ['firstName', 'trainingUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your Training is Ready!</h2>

      <p style="color: #555; font-size: 16px;">Hi {{firstName}},</p>
      <p style="color: #555; font-size: 16px;">The exclusive <strong>Graduate Orientation Training</strong> is now unlocked!</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">Now Available</p>
          <p style="margin: 8px 0 0 0; font-size: 22px; font-weight: bold; color: #722F37;">Graduate Orientation Training</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; color: #555;">Build Your $5,000+/Month Practice</p>
        </div>
      `, 'gold')}

      <p style="color: #555; font-size: 16px;">In this comprehensive 45-minute session, you'll discover:</p>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        <li style="margin: 8px 0;">Your step-by-step certification path (no guesswork)</li>
        <li style="margin: 8px 0;">How to attract your first clients from day one</li>
        <li style="margin: 8px 0;">Real income potential: $5K-$15K/month is achievable</li>
        <li style="margin: 8px 0;">The exact framework our most successful students use</li>
      </ul>

      ${primaryButton('Watch Training Now', '{{trainingUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          <strong>Bonus:</strong> Complete this training to unlock your free 7-Day Activation Challenge!
        </p>
      </div>
    `),
  },
  {
    slug: 'challenge-unlocked',
    name: 'Challenge Unlocked',
    description: 'Sent when 7-Day Activation Challenge becomes available',
    category: EmailCategory.GRADUATE,
    subject: 'Your 7-Day Challenge Awaits!',
    preheader: 'Launch your practice in just 7 days. Start Day 1 now!',
    placeholders: ['firstName', 'challengeUrl'],
    htmlContent: wrapTemplate(`
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #722F37; margin: 0; font-size: 28px;">7-Day Challenge Unlocked!</h2>
      </div>

      <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, {{firstName}}!</p>
      <p style="color: #555; font-size: 16px; text-align: center;">You've earned access to the <strong>7-Day Activation Challenge</strong> — your free graduate gift!</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">Your Graduate Gift</p>
          <p style="margin: 8px 0 0 0; font-size: 22px; font-weight: bold; color: #722F37;">7-Day Activation Challenge</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Launch your practice in just 7 days</p>
        </div>
      `, 'gold')}

      <p style="color: #555; font-size: 16px;">Each day, you'll complete one focused action step:</p>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        <li style="margin: 8px 0;"><strong>Day 1-2:</strong> Define your ideal client and niche</li>
        <li style="margin: 8px 0;"><strong>Day 3-4:</strong> Create your signature offer</li>
        <li style="margin: 8px 0;"><strong>Day 5-6:</strong> Build your online presence</li>
        <li style="margin: 8px 0;"><strong>Day 7:</strong> Get your first client!</li>
      </ul>

      ${primaryButton('Start Day 1 Now', '{{challengeUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          Complete all 7 days to earn your <strong>Challenge Champion Badge</strong> + bonus resources!
        </p>
      </div>
    `),
  },
  {
    slug: 'challenge-day-unlocked',
    name: 'Challenge Day Unlocked',
    description: 'Sent when a new challenge day is available',
    category: EmailCategory.GRADUATE,
    subject: 'Day {{dayNumber}} is Ready: {{dayTitle}}',
    preheader: 'Your next challenge day is unlocked. Keep the momentum!',
    placeholders: ['firstName', 'dayNumber', 'dayTitle', 'progress', 'challengeUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Day {{dayNumber}} is Ready!</h2>

      <p style="color: #555; font-size: 16px;">Hi {{firstName}},</p>
      <p style="color: #555; font-size: 16px;">Your next challenge day is now unlocked:</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">DAY {{dayNumber}}</p>
          <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">{{dayTitle}}</p>
        </div>
      `, 'cream')}

      ${primaryButton('Start Day {{dayNumber}}', '{{challengeUrl}}')}

      ${progressBar('{{progress}}%')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          You're doing amazing! Each day brings you closer to launching your practice.
        </p>
      </div>
    `),
  },
  {
    slug: 'challenge-completed',
    name: 'Challenge Completed',
    description: 'Sent when user completes the 7-Day Activation Challenge',
    category: EmailCategory.GRADUATE,
    subject: 'Challenge Complete! You Did It, {{firstName}}!',
    preheader: 'Congratulations! You completed the 7-Day Challenge. Badge earned!',
    placeholders: ['firstName', 'badgeUrl', 'certificationUrl'],
    htmlContent: wrapTemplate(`
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #722F37; margin: 0; font-size: 28px;">Challenge Complete!</h2>
      </div>

      <p style="color: #555; font-size: 16px; text-align: center;">Incredible work, {{firstName}}!</p>
      <p style="color: #555; font-size: 16px; text-align: center;">You've successfully completed the <strong>7-Day Activation Challenge</strong>!</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #22c55e; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Achievement Unlocked</p>
          <p style="margin: 12px 0 0 0; font-size: 24px; font-weight: bold; color: #722F37;">Challenge Champion Badge</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">+ Exclusive Bonus Resources</p>
        </div>
      `, 'green')}

      <p style="color: #555; font-size: 16px;">What you've accomplished in just 7 days:</p>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        <li style="margin: 8px 0;">Defined your ideal client avatar</li>
        <li style="margin: 8px 0;">Created your signature offer</li>
        <li style="margin: 8px 0;">Built your professional presence</li>
        <li style="margin: 8px 0;">You're ready to welcome your first clients!</li>
      </ul>

      <p style="color: #555; font-size: 16px; font-weight: bold;">Ready for the full transformation?</p>
      <p style="color: #555; font-size: 16px;">The Full Certification gives you everything you need to become a confident, high-earning practitioner.</p>

      ${primaryButton('View Full Certification', '{{certificationUrl}}')}

      <div style="text-align: center; margin: 20px 0;">
        <a href="{{badgeUrl}}" style="background: #f8f9fa; color: #722F37; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 14px; border: 2px solid #722F37;">
          View My Badge
        </a>
      </div>
    `),
  },

  // ==================== CERTIFICATION & BILLING ====================
  {
    slug: 'certificate-issued',
    name: 'Certificate Issued',
    description: 'Sent when a certificate is generated for the user',
    category: EmailCategory.CERTIFICATION,
    subject: 'Your Certificate is Ready: {{courseTitle}}',
    preheader: 'Congratulations! Download your certificate now.',
    placeholders: ['firstName', 'courseTitle', 'certificateNumber', 'downloadUrl', 'verificationUrl'],
    htmlContent: wrapTemplate(`
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #722F37; margin: 0; font-size: 28px;">Your Certificate is Ready!</h2>
      </div>

      <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, {{firstName}}!</p>
      <p style="color: #555; font-size: 16px; text-align: center;">You've earned your certificate for:</p>

      <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); border-radius: 12px; padding: 30px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">Certificate of Completion</p>
        <p style="margin: 15px 0; font-size: 22px; font-weight: bold; color: white;">{{courseTitle}}</p>
        <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8);">Certificate #{{certificateNumber}}</p>
      </div>

      ${primaryButton('Download Certificate', '{{downloadUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #722F37; font-weight: bold;">Share Your Achievement</p>
        <p style="margin: 0; font-size: 13px; color: #666;">Your certificate can be verified by employers and clients at:</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #722F37; word-break: break-all;">{{verificationUrl}}</p>
      </div>

      <p style="color: #555; font-size: 16px; margin-top: 30px;">We're so proud of you. This is just the beginning of your journey!</p>
    `),
  },
  {
    slug: 'payment-receipt',
    name: 'Payment Receipt',
    description: 'Sent after successful payment',
    category: EmailCategory.CERTIFICATION,
    subject: 'Payment Confirmed: {{productName}}',
    preheader: 'Thank you for your purchase! Your access is now active.',
    placeholders: ['firstName', 'productName', 'amount', 'transactionId', 'purchaseDate', 'courseUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Payment Confirmation</h2>

      <p style="color: #555; font-size: 16px;">Hi {{firstName}},</p>
      <p style="color: #555; font-size: 16px;">Thank you for your investment in yourself! Here's your receipt:</p>

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Product</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #333;">{{productName}}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Amount</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #166534;">{{amount}}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Transaction ID</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 12px; color: #888;">{{transactionId}}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Date</td>
            <td style="padding: 10px 0; text-align: right; color: #333;">{{purchaseDate}}</td>
          </tr>
        </table>
      </div>

      ${highlightBox(`
        <p style="margin: 0; font-size: 14px; color: #166534;"><strong>Your access is now active!</strong> You can start learning immediately.</p>
      `, 'green')}

      ${primaryButton('Access My Course', '{{courseUrl}}')}

      <p style="color: #888; font-size: 13px; text-align: center;">Questions about your purchase? Reply to this email — we're here to help.</p>
    `),
  },
  {
    slug: 'course-enrollment',
    name: 'Course Enrollment',
    description: 'Sent when user enrolls in a paid course',
    category: EmailCategory.CERTIFICATION,
    subject: "You're Enrolled: {{courseName}}",
    preheader: 'Welcome to {{courseName}}! Your learning journey begins now.',
    placeholders: ['firstName', 'courseName', 'courseUrl'],
    htmlContent: wrapTemplate(`
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #722F37; margin: 0; font-size: 28px;">You're Enrolled!</h2>
      </div>

      <p style="color: #555; font-size: 16px; text-align: center;">Hi {{firstName}},</p>
      <p style="color: #555; font-size: 16px; text-align: center;">You now have full access to:</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 22px; font-weight: bold; color: #722F37;">{{courseName}}</p>
        </div>
      `, 'gold')}

      <p style="color: #555; font-size: 16px;">Your course includes:</p>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        <li style="margin: 8px 0;">Premium video lessons with downloadable notes</li>
        <li style="margin: 8px 0;">Practical resources and templates</li>
        <li style="margin: 8px 0;">Direct 1:1 coaching support</li>
        <li style="margin: 8px 0;">Professional certification upon completion</li>
      </ul>

      ${primaryButton('Start Learning', '{{courseUrl}}')}

      ${highlightBox(`
        <p style="margin: 0; font-size: 14px; color: #666;"><strong style="color: #722F37;">Pro Tip:</strong> Set aside dedicated time each day for learning. Even 30 minutes of focused study will help you progress quickly!</p>
      `, 'cream')}
    `),
  },

  // ==================== ENGAGEMENT EMAILS ====================
  {
    slug: 'coach-replied',
    name: 'Coach Replied',
    description: 'Sent when coach sends a message to the user',
    category: EmailCategory.ENGAGEMENT,
    subject: '{{coachName}} sent you a message',
    preheader: 'You have a new message from your coach. Check it now!',
    placeholders: ['firstName', 'coachName', 'messagePreview', 'messageUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">You Have a New Message!</h2>

      <p style="color: #555; font-size: 16px;">Hi {{firstName}},</p>
      <p style="color: #555; font-size: 16px;"><strong style="color: #722F37;">{{coachName}}</strong> has replied to your message:</p>

      <div style="background: #f8f9fa; border-left: 4px solid #722F37; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #333; font-style: italic;">"{{messagePreview}}"</p>
      </div>

      ${primaryButton('View Full Message', '{{messageUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          Your coach is here to support you every step of the way.<br/>
          Don't hesitate to ask questions!
        </p>
      </div>
    `),
  },
  {
    slug: 'inactive-reminder',
    name: 'Inactive Reminder',
    description: 'Sent when user has been inactive for several days',
    category: EmailCategory.ENGAGEMENT,
    subject: 'We miss you, {{firstName}}! Continue your journey',
    preheader: "Your learning progress is waiting. Don't lose momentum!",
    placeholders: ['firstName', 'daysSinceActive', 'progress', 'courseUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">We Miss You, {{firstName}}!</h2>

      <p style="color: #555; font-size: 16px;">It's been <strong style="color: #722F37;">{{daysSinceActive}} days</strong> since your last visit. Your learning journey is waiting!</p>

      ${progressBar('{{progress}}%')}

      <p style="color: #555; font-size: 16px;">Don't let your progress go to waste. Even <strong>15 minutes today</strong> can make a difference!</p>

      ${highlightBox(`
        <p style="margin: 0; font-size: 14px; color: #722F37;"><strong>Quick win:</strong> Complete just one lesson today and keep your momentum going!</p>
      `, 'cream')}

      ${primaryButton('Continue Learning', '{{courseUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          <strong style="color: #722F37;">Stuck or need help?</strong><br/>
          Your coach is always available if you have questions. Just visit the Messages section in your dashboard.
        </p>
      </div>
    `),
  },

  // ==================== RESOURCES & ACHIEVEMENTS ====================
  {
    slug: 'ebook-download',
    name: 'eBook Download',
    description: 'Sent when user unlocks or downloads an eBook',
    category: EmailCategory.RESOURCES,
    subject: 'Your eBook is Ready: {{ebookTitle}}',
    preheader: 'Download your copy of {{ebookTitle}} now!',
    placeholders: ['firstName', 'ebookTitle', 'downloadUrl', 'libraryUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your eBook is Ready!</h2>

      <p style="color: #555; font-size: 16px;">Hi {{firstName}},</p>
      <p style="color: #555; font-size: 16px;">Great news! Your eBook is now available for download:</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">Your eBook</p>
          <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">{{ebookTitle}}</p>
        </div>
      `, 'cream')}

      ${primaryButton('Download eBook', '{{downloadUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          You can also access all your eBooks anytime from your <a href="{{libraryUrl}}" style="color: #722F37; text-decoration: underline;">My Library</a> page.
        </p>
      </div>
    `),
  },
  {
    slug: 'badge-earned',
    name: 'Badge Earned',
    description: 'Sent when user earns a new badge or achievement',
    category: EmailCategory.RESOURCES,
    subject: 'Badge Earned: {{badgeName}}',
    preheader: 'You unlocked a new achievement! View your badge now.',
    placeholders: ['firstName', 'badgeName', 'badgeDescription', 'badgeUrl'],
    htmlContent: wrapTemplate(`
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #722F37; margin: 0; font-size: 28px;">You Earned a Badge!</h2>
      </div>

      <p style="color: #555; font-size: 16px; text-align: center;">Congratulations, {{firstName}}!</p>
      <p style="color: #555; font-size: 16px; text-align: center;">You've unlocked a new achievement:</p>

      ${highlightBox(`
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #D4AF37; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Achievement Unlocked</p>
          <p style="margin: 12px 0 0 0; font-size: 24px; font-weight: bold; color: #722F37;">{{badgeName}}</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">{{badgeDescription}}</p>
        </div>
      `, 'gold')}

      <p style="color: #555; font-size: 16px; text-align: center;">This badge is now displayed on your profile and in your Library. Keep up the great work!</p>

      ${primaryButton('View My Badges', '{{badgeUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          Share your achievement with your network and inspire others on their journey!
        </p>
      </div>
    `),
  },

  // ==================== MARKETING EMAILS ====================
  {
    slug: 'course-update',
    name: 'Course Update',
    description: 'Sent when new content is added to a course',
    category: EmailCategory.MARKETING,
    subject: 'New Content: {{updateTitle}} - {{courseName}}',
    preheader: "We've added new content to your course. Check it out!",
    placeholders: ['firstName', 'courseName', 'updateTitle', 'updateDescription', 'courseUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">New Content Added!</h2>

      <p style="color: #555; font-size: 16px;">Hi {{firstName}},</p>
      <p style="color: #555; font-size: 16px;">We've just added new content to your course:</p>

      ${highlightBox(`
        <p style="margin: 0; font-size: 12px; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px;">Course Update</p>
        <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #722F37;">{{updateTitle}}</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">In: {{courseName}}</p>
      `, 'blue')}

      <p style="color: #555; font-size: 16px;">{{updateDescription}}</p>

      ${primaryButton('View New Content', '{{courseUrl}}')}

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          We're constantly improving our courses to bring you the latest knowledge and best practices.
        </p>
      </div>
    `),
  },
  {
    slug: 'announcement',
    name: 'Announcement',
    description: 'General announcement email for news and updates',
    category: EmailCategory.MARKETING,
    subject: '{{announcementTitle}}',
    preheader: 'Important update from AccrediPro Academy',
    placeholders: ['firstName', 'announcementTitle', 'announcementContent', 'ctaText', 'ctaUrl'],
    htmlContent: wrapTemplate(`
      <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">{{announcementTitle}}</h2>

      <p style="color: #555; font-size: 16px;">Hi {{firstName}},</p>

      <div style="color: #555; font-size: 16px; line-height: 1.7;">
        {{announcementContent}}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ctaUrl}}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(114,47,55,0.3);">
          {{ctaText}}
        </a>
      </div>

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
        <p style="margin: 0; font-size: 14px; color: #666;">Questions? Reply to this email or message your coach in the app.</p>
      </div>

      <p style="color: #555; font-size: 16px; margin-top: 30px;">Warmly,<br/><strong>The AccrediPro Team</strong></p>
    `),
  },
];

async function seedEmailTemplates() {
  console.log("Seeding email templates...");

  for (const template of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { slug: template.slug },
      update: {
        name: template.name,
        description: template.description,
        category: template.category,
        subject: template.subject,
        preheader: template.preheader,
        htmlContent: template.htmlContent,
        placeholders: template.placeholders,
        isSystem: true,
      },
      create: {
        slug: template.slug,
        name: template.name,
        description: template.description,
        category: template.category,
        subject: template.subject,
        preheader: template.preheader,
        htmlContent: template.htmlContent,
        placeholders: template.placeholders,
        isActive: true,
        isSystem: true,
      },
    });
    console.log(`  ✓ ${template.name}`);
  }

  console.log(`\nSeeded ${emailTemplates.length} email templates successfully!`);
}

seedEmailTemplates()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
