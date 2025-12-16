import { generateSarahVoice } from "../src/lib/elevenlabs";
import * as fs from "fs";
import * as path from "path";

async function generateFinalExamAudio() {
  console.log("Generating Sarah's Final Exam encouragement audio...");

  // Double line breaks create natural pauses in speech
  const script = `Hey! It's Sarah here.


You made it to the Final Exam! I'm so proud of you for completing all the modules.


This is just a quick 10-question quiz to wrap up everything you've learned. Don't stress - you've got this!


Take your time, trust yourself, and I'll see you on the other side with your certificate!


Good luck.`;

  try {
    const result = await generateSarahVoice(script);

    if (!result.success || !result.audioBase64) {
      console.error("Failed to generate audio:", result.error);
      return;
    }

    // Save to public/audio folder
    const audioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const audioPath = path.join(audioDir, "sarah-final-exam.mp3");
    const buffer = Buffer.from(result.audioBase64, "base64");
    fs.writeFileSync(audioPath, buffer);

    console.log(`Audio saved to: ${audioPath}`);
    console.log(`Duration: ${result.duration} seconds`);
  } catch (error) {
    console.error("Error generating audio:", error);
  }
}

generateFinalExamAudio();
