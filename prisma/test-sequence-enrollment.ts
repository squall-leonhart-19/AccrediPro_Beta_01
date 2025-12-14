import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Resend } from 'resend';
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const testEmail = 'at.seed019@gmail.com';

  console.log('🚀 Testing sequence enrollment for:', testEmail);

  // 1. Get the user
  const user = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (!user) {
    console.error('❌ User not found:', testEmail);
    return;
  }

  console.log('✅ User found:', user.name || user.email);

  // 2. Get the sequence
  const sequence = await prisma.sequence.findUnique({
    where: { slug: 'welcome-mini-diploma-series' },
    include: {
      emails: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
      triggerTag: true,
    },
  });

  if (!sequence) {
    console.error('❌ Sequence not found');
    return;
  }

  console.log('✅ Sequence found:', sequence.name);
  console.log('   - Emails:', sequence.emails.length);
  console.log('   - Trigger tag:', sequence.triggerTag?.name);

  // 3. Add trigger tag to user (if not already added)
  if (sequence.triggerTagId) {
    const existingTag = await prisma.userMarketingTag.findUnique({
      where: {
        userId_tagId: {
          userId: user.id,
          tagId: sequence.triggerTagId,
        },
      },
    });

    if (!existingTag) {
      await prisma.userMarketingTag.create({
        data: {
          userId: user.id,
          tagId: sequence.triggerTagId,
          source: 'test_enrollment',
        },
      });
      console.log('✅ Added trigger tag to user');
    } else {
      console.log('ℹ️  User already has trigger tag');
    }
  }

  // 4. Check for existing enrollment
  const existingEnrollment = await prisma.sequenceEnrollment.findUnique({
    where: {
      userId_sequenceId: {
        userId: user.id,
        sequenceId: sequence.id,
      },
    },
  });

  let enrollment;
  const firstEmail = sequence.emails[0];
  const now = new Date();
  // For immediate send, set nextSendAt to 1 minute from now
  const nextSendAt = new Date(now.getTime() + 60 * 1000);

  if (existingEnrollment) {
    if (existingEnrollment.status === 'ACTIVE') {
      console.log('ℹ️  User already enrolled and active');
      enrollment = existingEnrollment;
    } else {
      // Re-enroll
      enrollment = await prisma.sequenceEnrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          status: 'ACTIVE',
          currentEmailIndex: 0,
          nextSendAt,
          enrolledAt: now,
          completedAt: null,
          exitedAt: null,
          exitReason: null,
          emailsReceived: 0,
          emailsOpened: 0,
          emailsClicked: 0,
        },
      });
      console.log('✅ Re-enrolled user in sequence');
    }
  } else {
    // New enrollment
    enrollment = await prisma.sequenceEnrollment.create({
      data: {
        userId: user.id,
        sequenceId: sequence.id,
        status: 'ACTIVE',
        currentEmailIndex: 0,
        nextSendAt,
      },
    });
    console.log('✅ Enrolled user in sequence');
  }

  // 5. Update sequence stats
  await prisma.sequence.update({
    where: { id: sequence.id },
    data: { totalEnrolled: { increment: 1 } },
  });

  console.log('\n📧 Sending first email...');
  console.log('   Subject:', firstEmail.customSubject);

  // Replace placeholders
  const firstName = user.name?.split(' ')[0] || 'there';
  const content = (firstEmail.customContent || '')
    .replace(/\{\{firstName\}\}/g, firstName)
    .replace(/\{\{email\}\}/g, user.email);

  // Wrap content in email template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    p { margin: 0 0 1em 0; }
    a { color: #0070f3; }
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: 'AccrediPro Academy <hello@accredipro.academy>',
      to: testEmail,
      subject: firstEmail.customSubject || 'Welcome!',
      html: htmlContent,
    });

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', result.data?.id);

    // Update enrollment (no lastSentAt field in schema)
    await prisma.sequenceEnrollment.update({
      where: { id: enrollment.id },
      data: {
        emailsReceived: { increment: 1 },
        currentEmailIndex: 1,
        // Set next email send time (if there's a second email)
        nextSendAt: sequence.emails[1]
          ? new Date(now.getTime() + (sequence.emails[1].delayDays * 24 * 60 * 60 * 1000) + (sequence.emails[1].delayHours * 60 * 60 * 1000))
          : null,
      },
    });

    // Create send log
    await prisma.sequenceEmailSend.create({
      data: {
        enrollmentId: enrollment.id,
        sequenceEmailId: firstEmail.id,
        sentAt: now,
        status: 'SENT',
        messageId: result.data?.id || undefined,
      },
    });

    console.log('\n✅ Enrollment updated with send record');

  } catch (error: any) {
    console.error('❌ Failed to send email:', error.message);
  }

  // Final status
  const finalEnrollment = await prisma.sequenceEnrollment.findUnique({
    where: { id: enrollment.id },
  });

  console.log('\n📊 Final Status:');
  console.log('   Enrollment ID:', finalEnrollment?.id);
  console.log('   Status:', finalEnrollment?.status);
  console.log('   Current Email Index:', finalEnrollment?.currentEmailIndex);
  console.log('   Emails Received:', finalEnrollment?.emailsReceived);
  console.log('   Next Send At:', finalEnrollment?.nextSendAt);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
