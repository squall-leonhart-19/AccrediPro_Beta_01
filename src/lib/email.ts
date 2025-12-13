import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "AccrediPro <noreply@accredipro-certificate.com>";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Email send error:", error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string, firstName?: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #722F37; margin: 0;">AccrediPro</h1>
          <p style="color: #666; margin: 5px 0;">Educational Excellence</p>
        </div>

        <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p>Hi${firstName ? ` ${firstName}` : ""},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #722F37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>

          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>

        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>AccrediPro - Veritas Et Excellentia</p>
          <p>Truth and Excellence in Education</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your AccrediPro Password",
    html,
  });
}

interface WelcomeEmailOptions {
  to: string;
  firstName: string;
  courseName?: string;
  courseSlug?: string;
}

export async function sendWelcomeEmail({ to, firstName, courseName, courseSlug }: WelcomeEmailOptions) {
  const courseUrl = courseSlug
    ? `${process.env.NEXTAUTH_URL}/courses/${courseSlug}`
    : `${process.env.NEXTAUTH_URL}/dashboard`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AccrediPro${courseName ? ` - ${courseName}` : ""}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">AccrediPro</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0; font-size: 14px;">Educational Excellence</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome${firstName ? `, ${firstName}` : ""}!</h2>

            ${courseName ? `
              <div style="background: linear-gradient(135deg, #FDF5E6 0%, #FFF8DC 100%); border: 1px solid #D4AF37; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #8B7355;">You've been enrolled in:</p>
                <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${courseName}</p>
              </div>
            ` : ""}

            <p style="color: #555; font-size: 16px;">Thank you for joining AccrediPro! We're excited to have you on your journey to educational excellence.</p>

            <p style="color: #555; font-size: 16px;">Here's what awaits you:</p>
            <ul style="color: #555; font-size: 15px; padding-left: 20px;">
              <li style="margin: 10px 0;">Premium video lessons with expert instructors</li>
              <li style="margin: 10px 0;">1:1 coaching support throughout your journey</li>
              <li style="margin: 10px 0;">Downloadable resources and materials</li>
              <li style="margin: 10px 0;">Professional certificate upon completion</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${courseUrl}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(114,47,55,0.3);">Start Learning Now</a>
            </div>

            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
              <p style="margin: 0; font-size: 14px; color: #666;"><strong>Need help?</strong> Your dedicated coach is available to support you throughout your learning journey. Simply visit the "My Coach" section in your dashboard.</p>
            </div>
          </div>

          <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #999; font-size: 12px;">AccrediPro Academy - Veritas Et Excellentia</p>
            <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">Truth and Excellence in Education</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: courseName
      ? `Welcome to ${courseName} - AccrediPro Academy`
      : "Welcome to AccrediPro Academy - Your Learning Journey Begins!",
    html,
  });
}

export async function sendLessonCompleteEmail(
  email: string,
  firstName: string | null,
  lessonTitle: string,
  courseTitle: string,
  progress: number
) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lesson Complete!</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #722F37; margin: 0;">AccrediPro</h1>
          <p style="color: #666; margin: 5px 0;">Educational Excellence</p>
        </div>

        <div style="background: linear-gradient(135deg, #722F37 0%, #8B4513 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px; color: white; text-align: center;">
          <h2 style="margin-top: 0;">Congratulations!</h2>
          <p style="font-size: 18px;">You've completed a lesson!</p>
        </div>

        <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
          <p>Hi${firstName ? ` ${firstName}` : ""},</p>
          <p>Great work completing <strong>"${lessonTitle}"</strong> in <strong>${courseTitle}</strong>!</p>

          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Your Progress</p>
            <div style="background: #e0e0e0; border-radius: 10px; height: 20px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #722F37, #8B4513); height: 100%; width: ${progress}%; transition: width 0.5s;"></div>
            </div>
            <p style="margin: 10px 0 0 0; text-align: center; font-weight: bold; color: #722F37;">${progress}% Complete</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background: #722F37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Continue Learning</a>
          </div>
        </div>

        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>AccrediPro - Veritas Et Excellentia</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Lesson Complete: ${lessonTitle} - AccrediPro`,
    html,
  });
}

export async function sendCertificateEmail(
  email: string,
  firstName: string | null,
  courseTitle: string,
  certificateNumber: string,
  verificationUrl: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Certificate is Ready!</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #722F37; margin: 0;">AccrediPro</h1>
          <p style="color: #666; margin: 5px 0;">Educational Excellence</p>
        </div>

        <div style="background: linear-gradient(135deg, #C9A227 0%, #D4AF37 100%); border-radius: 10px; padding: 40px; margin-bottom: 20px; color: #333; text-align: center;">
          <h2 style="margin-top: 0; color: #333;">Certificate Earned!</h2>
          <p style="font-size: 20px; font-weight: bold; margin: 20px 0;">${courseTitle}</p>
          <p style="font-size: 14px; color: #555;">Certificate #${certificateNumber}</p>
        </div>

        <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
          <p>Congratulations${firstName ? ` ${firstName}` : ""}!</p>
          <p>You've successfully completed <strong>${courseTitle}</strong> and earned your certificate!</p>
          <p>Your certificate is now available in your dashboard. You can also share your achievement with a verified link.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: #722F37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Certificate</a>
          </div>
        </div>

        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>AccrediPro - Veritas Et Excellentia</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Certificate Earned: ${courseTitle} - AccrediPro`,
    html,
  });
}

// Lead capture welcome email
interface LeadWelcomeEmailOptions {
  to: string;
  firstName: string;
  specialization: string;
  isNewUser: boolean;
}

export async function sendLeadWelcomeEmail({ to, firstName, specialization, isNewUser }: LeadWelcomeEmailOptions) {
  const loginUrl = `${process.env.NEXTAUTH_URL}/login`;
  const roadmapUrl = `${process.env.NEXTAUTH_URL}/roadmap`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Your ${specialization} Journey - AccrediPro</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">AccrediPro</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0; font-size: 14px;">Your ${specialization} Journey Begins</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Welcome, ${firstName}!</h2>

            <p style="color: #555; font-size: 16px;">You've taken the first step toward becoming a certified ${specialization} practitioner. We're thrilled to have you here!</p>

            <div style="background: linear-gradient(135deg, #FDF5E6 0%, #FFF8DC 100%); border: 1px solid #D4AF37; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #8B7355;">Your personalized roadmap is ready:</p>
              <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${specialization} Career Path</p>
            </div>

            ${isNewUser ? `
            <div style="background: #f0f7ff; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #1e40af; font-weight: bold;">Your Login Credentials:</p>
              <p style="margin: 0; font-size: 14px; color: #1e40af;">Email: <strong>${to}</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #1e40af;">Password: <strong>accredipro123</strong></p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">(We recommend changing your password after first login)</p>
            </div>
            ` : `
            <p style="color: #555; font-size: 14px; background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #22c55e;">
              We noticed you already have an account. Log in with your existing credentials to see your updated roadmap!
            </p>
            `}

            <p style="color: #555; font-size: 16px;">Here's what you'll discover in your roadmap:</p>
            <ul style="color: #555; font-size: 15px; padding-left: 20px;">
              <li style="margin: 10px 0;">Your personalized 4-step career path</li>
              <li style="margin: 10px 0;">Income potential at each step</li>
              <li style="margin: 10px 0;">Free mini diploma to get started</li>
              <li style="margin: 10px 0;">Direct access to your mentor</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(114,47,55,0.3);">Login & View My Roadmap</a>
            </div>

            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
              <p style="margin: 0; font-size: 14px; color: #666;"><strong>Questions?</strong> Once logged in, you can message your mentor directly from your dashboard. We're here to support you every step of the way.</p>
            </div>
          </div>

          <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #999; font-size: 12px;">AccrediPro Academy - Veritas Et Excellentia</p>
            <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">Truth and Excellence in Education</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Welcome to Your ${specialization} Journey - AccrediPro`,
    html,
  });
}

// Bulk email function
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
