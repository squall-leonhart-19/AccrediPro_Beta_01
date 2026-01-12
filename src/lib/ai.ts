import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatContext {
  userName?: string;
  userRole?: string;
  currentCourse?: string;
  currentLesson?: string;
}

const SYSTEM_PROMPT = `You are AccrediPro AI Assistant, a helpful and knowledgeable support agent for AccrediPro LMS - a professional learning management system focused on healthcare accreditation and continuing education.

Your responsibilities:
1. Help users navigate the platform and find courses
2. Answer questions about course content and accreditation requirements
3. Provide technical support for common issues
4. Guide users through the enrollment and certification process
5. Explain compliance requirements and deadlines

Guidelines:
- Be professional, friendly, and concise
- Provide accurate information about healthcare accreditation (CEU, CME, etc.)
- If you don't know something specific about the platform, suggest contacting support
- Never provide medical advice - redirect such questions to appropriate professionals
- Keep responses focused and helpful
- Use bullet points or numbered lists for step-by-step instructions

Platform features you can help with:
- Course catalog and enrollment
- Progress tracking and certificates
- Community forums and discussions
- Account settings and profile management
- Technical issues (login, video playback, etc.)
- Accreditation and compliance questions`;

export async function streamChatResponse(
  messages: ChatMessage[],
  context?: ChatContext
) {
  let contextInfo = "";
  if (context) {
    const parts: string[] = [];
    if (context.userName) parts.push(`User: ${context.userName}`);
    if (context.userRole) parts.push(`Role: ${context.userRole}`);
    if (context.currentCourse) parts.push(`Viewing course: ${context.currentCourse}`);
    if (context.currentLesson) parts.push(`Current lesson: ${context.currentLesson}`);
    if (parts.length > 0) {
      contextInfo = `\n\nCurrent context:\n${parts.join("\n")}`;
    }
  }

  const stream = await anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT + contextInfo,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return stream;
}

export async function getChatResponse(
  messages: ChatMessage[],
  context?: ChatContext
): Promise<string> {
  let contextInfo = "";
  if (context) {
    const parts: string[] = [];
    if (context.userName) parts.push(`User: ${context.userName}`);
    if (context.userRole) parts.push(`Role: ${context.userRole}`);
    if (context.currentCourse) parts.push(`Viewing course: ${context.currentCourse}`);
    if (context.currentLesson) parts.push(`Current lesson: ${context.currentLesson}`);
    if (parts.length > 0) {
      contextInfo = `\n\nCurrent context:\n${parts.join("\n")}`;
    }
  }

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT + contextInfo,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "I apologize, but I couldn't generate a response.";
}
