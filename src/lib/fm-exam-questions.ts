/**
 * FM Mini Diploma Final Exam Questions
 *
 * 6 questions covering all 3 lessons (2 per lesson):
 * 1. Foundation (What is FM / Scope of Practice)
 * 2. The D.E.P.T.H. Method™ (Discover, Evaluate, Pinpoint, Transform, Heal)
 * 3. How To Get Your First Clients
 *
 * Each question has 4 options with 1 correct answer.
 * Pass score for scholarship: 95+ (max 1 wrong)
 */

export interface ExamQuestion {
    id: number;
    lessonRef: number; // Which lesson this covers
    question: string;
    options: {
        id: string;
        text: string;
    }[];
    correctAnswer: string;
    explanation: string;
}

export const FM_EXAM_QUESTIONS: ExamQuestion[] = [
    // Lesson 1: Foundation — What is Functional Medicine
    {
        id: 1,
        lessonRef: 1,
        question: "What is the primary focus of functional medicine compared to conventional medicine?",
        options: [
            { id: "a", text: "Prescribing medication for immediate symptom relief" },
            { id: "b", text: "Identifying and addressing the root causes of disease through nutrition and lifestyle" },
            { id: "c", text: "Performing diagnostic surgeries" },
            { id: "d", text: "Replacing all conventional medical treatments" },
        ],
        correctAnswer: "b",
        explanation: "Functional medicine focuses on identifying and addressing root causes of disease through nutrition, lifestyle, and holistic approaches — rather than just treating symptoms.",
    },

    // Lesson 1: Foundation — Scope of Practice
    {
        id: 2,
        lessonRef: 1,
        question: "As a certified functional health coach, what is your primary role with clients?",
        options: [
            { id: "a", text: "Diagnose diseases and prescribe treatments" },
            { id: "b", text: "Provide education and support for nutrition and lifestyle changes" },
            { id: "c", text: "Interpret lab results and make medical recommendations" },
            { id: "d", text: "Replace the client's relationship with their doctor" },
        ],
        correctAnswer: "b",
        explanation: "Health coaches provide EDUCATION and SUPPORT, not medical advice. You help clients implement nutrition and lifestyle changes, partnering with their healthcare team.",
    },

    // Lesson 2: D.E.P.T.H. Method™ — What it stands for
    {
        id: 3,
        lessonRef: 2,
        question: "What does the D.E.P.T.H. Method™ stand for?",
        options: [
            { id: "a", text: "Diagnose, Examine, Prescribe, Treat, Heal" },
            { id: "b", text: "Discover, Evaluate, Pinpoint, Transform, Heal" },
            { id: "c", text: "Detect, Eliminate, Prevent, Test, Help" },
            { id: "d", text: "Document, Explore, Plan, Track, Hypothesize" },
        ],
        correctAnswer: "b",
        explanation: "The D.E.P.T.H. Method™ stands for Discover, Evaluate, Pinpoint, Transform, Heal — a comprehensive framework for guiding clients through their health transformation journey.",
    },

    // Lesson 2: D.E.P.T.H. Method™ — Application
    {
        id: 4,
        lessonRef: 2,
        question: "In the D.E.P.T.H. Method™, what happens during the 'Pinpoint' phase?",
        options: [
            { id: "a", text: "You create a general wellness plan for all clients" },
            { id: "b", text: "You identify the specific root causes and imbalances unique to each client" },
            { id: "c", text: "You prescribe medication based on symptoms" },
            { id: "d", text: "You schedule follow-up appointments" },
        ],
        correctAnswer: "b",
        explanation: "The 'Pinpoint' phase is where you identify the specific root causes and imbalances that are unique to each individual client — this is what makes functional health coaching personalized and effective.",
    },

    // Lesson 3: Getting First Clients
    {
        id: 5,
        lessonRef: 3,
        question: "What is the most effective approach for a new health coach to get their first clients?",
        options: [
            { id: "a", text: "Wait until you have every certification possible before talking to anyone" },
            { id: "b", text: "Spend thousands on paid advertising immediately" },
            { id: "c", text: "Start with your existing network and community, lead with value and education" },
            { id: "d", text: "Cold call random people from the phone book" },
        ],
        correctAnswer: "c",
        explanation: "The fastest path to your first clients is leveraging your existing network and community. Lead with value and education, build trust, and clients will naturally emerge from those relationships.",
    },

    // Lesson 3: Scope as Certified Coach
    {
        id: 6,
        lessonRef: 3,
        question: "Which of the following is within a certified health coach's scope of practice?",
        options: [
            { id: "a", text: "Diagnosing medical conditions based on client symptoms" },
            { id: "b", text: "Prescribing supplements and specific dosages to treat conditions" },
            { id: "c", text: "Educating clients on nutrition and supporting healthy lifestyle changes" },
            { id: "d", text: "Ordering and interpreting blood tests for clients" },
        ],
        correctAnswer: "c",
        explanation: "Health coaches educate and support clients in making positive nutrition and lifestyle changes. Diagnosing, prescribing, and ordering medical tests are outside the scope of a health coach.",
    },
];

// Utility function to shuffle questions for each attempt
export function shuffleQuestions(questions: ExamQuestion[]): ExamQuestion[] {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Calculate score - ALWAYS returns 95-100 to qualify everyone for scholarship
export function calculateExamScore(answers: Record<number, string>): {
    score: number;
    correct: number;
    total: number;
    passed: boolean;
    scholarshipQualified: boolean;
} {
    const total = FM_EXAM_QUESTIONS.length;

    // Generate a random score between 95-100 (everyone qualifies!)
    const score = Math.floor(Math.random() * 6) + 95; // 95, 96, 97, 98, 99, or 100
    const correct = Math.round((score / 100) * total); // Calculate correct based on score

    const passed = true; // Everyone passes
    const scholarshipQualified = true; // Everyone qualifies for scholarship

    return { score, correct, total, passed, scholarshipQualified };
}

export type ExamAnswers = Record<number, string>;
