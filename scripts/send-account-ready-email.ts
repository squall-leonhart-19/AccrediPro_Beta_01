import { sendEmail, emailWrapper } from '../src/lib/email';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface Customer {
  email: string;
  firstName: string;
}

// Failed emails from rate limiting - need to resend
const customers: Customer[] = [
  { email: 'cecelia.fares@gmail.com', firstName: 'Cecelia' },
  { email: 'hollen82nd@proton.me', firstName: 'Therese' },
  { email: 'sherfaller@gmail.com', firstName: 'Sherrie' },
  { email: 'jodyjodymusic@gmail.com', firstName: 'Jody' },
  { email: 'elisa@southbayrnservices.org', firstName: 'Elisa' },
];

async function sendAccountReadyEmail(to: string, firstName: string) {
  const content = `
    <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your Account is Ready, ${firstName}! 🎓</h2>

    <p style="color: #555; font-size: 16px;">Hey ${firstName}!</p>

    <p style="color: #555; font-size: 16px;">I'm so excited to welcome you to AccrediPro Academy!</p>

    <p style="color: #555; font-size: 16px;"><strong>Your account is now set up and ready to go.</strong> I've been looking forward to having you join our community of practitioners who are transforming lives through functional health approaches.</p>

    <div style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%); border: 2px solid #D4AF37; border-radius: 12px; padding: 20px; margin: 25px 0;">
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #722F37; font-weight: bold;">🔐 Your Login Credentials:</p>
      <p style="margin: 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${to}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Password:</strong> Futurecoach2025</p>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #666; font-style: italic;">You can change your password anytime from your account settings.</p>
    </div>

    <p style="color: #555; font-size: 16px;">Once you're in, you'll find all your course materials, resources, and our supportive community waiting for you.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://learn.accredipro.academy/login" style="display: inline-block; background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(114, 47, 55, 0.3);">Access My Learning Portal</a>
    </div>

    <div style="background: #f0fdf4; border-left: 4px solid #10B981; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <p style="margin: 0 0 10px 0; font-size: 15px; color: #059669; font-weight: bold;">A few tips to get started:</p>
      <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px;">
        <li style="margin: 8px 0;">Set aside dedicated study time each day (even 20-30 minutes makes a difference)</li>
        <li style="margin: 8px 0;">Don't skip Module 0 – it sets you up for success</li>
        <li style="margin: 8px 0;">Reach out if you have any questions – I'm here for you!</li>
      </ul>
    </div>

    <p style="color: #555; font-size: 16px;">I can't wait to see you inside the portal. This is the beginning of something amazing for you, and I'm honored to be part of your journey.</p>

    <p style="color: #555; font-size: 16px;">Let's do this together!</p>

    <p style="color: #555; font-size: 16px; margin-top: 30px;">
      Warmly,<br/>
      <strong style="color: #722F37;">Sarah</strong><br/>
      <span style="font-size: 14px; color: #888;">Your Coach at AccrediPro Academy</span>
    </p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-top: 30px; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: #666; font-style: italic;">P.S. If you have any trouble logging in, just reply to this email and I'll get you sorted right away.</p>
    </div>
  `;

  const html = emailWrapper(content, "Your AccrediPro account is ready! Log in now to start your journey.");

  try {
    const result = await sendEmail({
      to,
      subject: "Your Account is Ready – Let's Begin! 🎓",
      html,
    });

    if (result.success) {
      return true;
    } else {
      console.error(`   ❌ Failed for ${firstName}: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Error for ${firstName}: ${error}`);
    return false;
  }
}

async function sendAllEmails() {
  console.log(`\n🔄 Resending failed emails (${customers.length} total)...\n`);

  let successCount = 0;

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    process.stdout.write(`📧 [${i + 1}/${customers.length}] ${customer.firstName} (${customer.email})... `);

    const success = await sendAccountReadyEmail(customer.email, customer.firstName);
    if (success) {
      console.log('✅');
      successCount++;
    } else {
      console.log('❌');
    }

    // Longer delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✅ Done! Sent ${successCount}/${customers.length} emails successfully.\n`);
}

sendAllEmails();
