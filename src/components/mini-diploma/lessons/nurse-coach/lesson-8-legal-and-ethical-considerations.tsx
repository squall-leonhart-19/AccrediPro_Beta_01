"use client";

import { LessonBase, Message } from "../shared/lesson-base";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function LessonLegalAndEthicalConsiderations({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const messages: Message[] = [
        {
            id: 1,
            type: 'coach',
            content: `Hey {name}! Welcome to Lesson 8 - this is a crucial one! 🏛️ Today we're diving into the legal and ethical considerations that will keep you practicing safely and confidently as a nurse life coach. Think of this as your professional safety net!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Understanding Your Scope of Practice**
• As a nurse life coach, you operate in TWO professional realms
• Your nursing license governs medical/clinical activities
• Life coaching involves non-clinical wellness and goal achievement
• You must clearly distinguish between these roles in practice
• Never provide medical advice or diagnosis in your coaching capacity`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `This dual identity can feel tricky at first, but once you understand the boundaries, it becomes your superpower! You have clinical knowledge that informs your coaching, but you're not practicing nursing when you coach.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `A coaching client asks you about medication side effects they're experiencing. What's your best response?`,
            choices: ["Explain the side effects based on your nursing knowledge", "Refer them to speak with their prescribing physician", "Suggest they stop the medication and try natural alternatives"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Key Ethical Boundaries in Nurse Life Coaching**
• Maintain clear role definition with each client
• Avoid dual relationships (don't coach patients from your nursing job)
• Respect client autonomy and self-determination
• Practice cultural competence and avoid bias
• Maintain strict confidentiality in both roles
• Stay within your competence level`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `Boundaries aren't walls - they're bridges to better relationships! When clients understand what you can and can't do, they trust you more because you're being honest and professional.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Legal Protections and Requirements**
• Obtain professional liability insurance for coaching activities
• Use clear coaching agreements/contracts with all clients
• Document coaching sessions appropriately (not medical records)
• Follow HIPAA guidelines when applicable
• Understand mandatory reporting requirements in your state
• Keep nursing and coaching practices legally separate`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `What's the most important document to have before starting with any coaching client?`,
            choices: ["Their medical history and current medications", "A signed coaching agreement outlining scope and boundaries", "Permission from their primary care physician"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `I know this might feel overwhelming, but remember - these guidelines protect both you AND your clients. They create a safe space for transformation to happen!`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Red Flags: When to Refer Out**
• Client requests medical advice or wants to change medications
• Signs of serious mental health crisis or suicidal ideation
• Substance abuse issues beyond your coaching scope
• Complex medical conditions requiring clinical management
• Client wants you to communicate with their healthcare team
• Any situation where you feel uncomfortable or unqualified`,
            systemStyle: 'takeaway',
        },
        {
            id: 11,
            type: 'coach',
            content: `Knowing when to refer is actually a sign of expertise, not weakness. The best coaches have a network of trusted professionals they can connect clients with when needed.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Professional Development & Continuing Education**
• Join professional coaching organizations (ICF, AIHC)
• Maintain continuing education in both nursing and coaching
• Stay updated on legal requirements in your practice location
• Consider additional certifications in specialized coaching areas
• Build relationships with other healthcare professionals for referrals
• Regular supervision or mentoring with experienced coaches`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'coach',
            content: `{name}, you're almost at the finish line! 🎉 Next up is our final lesson where we'll put it all together and talk about launching your practice. You're going to do amazing things as a nurse life coach!`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Coming Up in Lesson 9**
• Building your nurse life coaching practice
• Marketing strategies that highlight your unique value
• Setting up systems and processes
• Your certification requirements and next steps
• Celebrating your transformation journey!`,
            systemStyle: 'takeaway',
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Legal & Ethical Considerations"
            lessonSubtitle="Scope of practice and boundaries"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
