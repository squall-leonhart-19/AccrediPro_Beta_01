import {
  sendWHReminderDay1Email,
  sendWHReminderDay3Email,
  sendWHReminderDay5Email,
  sendWHReminderDay6Email,
} from "../src/lib/email";

const TEST_EMAIL = "at.seed019@gmail.com";
const FIRST_NAME = "Alessio";

async function main() {
  console.log("Sending all Women's Health reminder emails to:", TEST_EMAIL);
  console.log("");

  // Day 1 - Not started
  console.log("1. Sending Day 1 reminder (not started)...");
  const day1 = await sendWHReminderDay1Email(TEST_EMAIL, FIRST_NAME);
  console.log(day1.success ? "   ✅ Day 1 sent!" : `   ❌ Failed: ${day1.error}`);

  // Day 3 - Progress (simulate 3 lessons completed)
  console.log("2. Sending Day 3 reminder (3 lessons done)...");
  const day3 = await sendWHReminderDay3Email(TEST_EMAIL, FIRST_NAME, 3);
  console.log(day3.success ? "   ✅ Day 3 sent!" : `   ❌ Failed: ${day3.error}`);

  // Day 5 - Urgency (simulate 5 lessons completed)
  console.log("3. Sending Day 5 reminder (5 lessons done)...");
  const day5 = await sendWHReminderDay5Email(TEST_EMAIL, FIRST_NAME, 5);
  console.log(day5.success ? "   ✅ Day 5 sent!" : `   ❌ Failed: ${day5.error}`);

  // Day 6 - Final (simulate 8 lessons - so close!)
  console.log("4. Sending Day 6 reminder (8 lessons done - so close!)...");
  const day6 = await sendWHReminderDay6Email(TEST_EMAIL, FIRST_NAME, 8);
  console.log(day6.success ? "   ✅ Day 6 sent!" : `   ❌ Failed: ${day6.error}`);

  console.log("\n✅ All emails sent! Check inbox at:", TEST_EMAIL);
}

main().catch(console.error);
