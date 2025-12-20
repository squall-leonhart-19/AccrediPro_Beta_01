import { sendWelcomeEmail } from '../src/lib/email';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const email = 'judysmason@gmail.com';
  const firstName = 'Judy';

  console.log(`Sending welcome email to ${firstName} (${email})...`);

  try {
    const result = await sendWelcomeEmail(email, firstName);

    if (result.success) {
      console.log('Welcome email sent successfully!');
      console.log('Result:', result.data);
    } else {
      console.error('Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
