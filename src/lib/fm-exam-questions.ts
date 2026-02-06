/**
 * FM Mini Diploma Final Exam — 5 Questions
 *
 * 1 per core concept across 3 lessons:
 *   L1 → Root causes vs symptoms
 *   L1 → Scope of practice (educate & support)
 *   L2 → D.E.P.T.H. Method™ — what "D" stands for
 *   L3 → Warm market strategy (first step)
 *   L3 → Recommended starter package
 *
 * Everyone passes (score always 95-100).
 */

export interface ExamQuestion {
    id: number;
    lessonRef: number;
    question: string;
    options: {
        id: string;
        text: string;
    }[];
    correctAnswer: string;
    explanation: string;
}

export const FM_EXAM_QUESTIONS: ExamQuestion[] = [
    // L1 — Root causes
    {
        id: 1,
        lessonRef: 1,
        question: "What does functional medicine primarily focus on?",
        options: [
            { id: "a", text: "Masking symptoms with medication" },
            { id: "b", text: "Identifying root causes through nutrition and lifestyle" },
            { id: "c", text: "Replacing conventional medicine entirely" },
            { id: "d", text: "Performing clinical lab diagnostics" },
        ],
        correctAnswer: "b",
        explanation: "Functional medicine looks beyond symptoms to identify and address root causes — using nutrition, lifestyle changes, and a whole-person approach.",
    },

    // L1 — Scope of practice
    {
        id: 2,
        lessonRef: 1,
        question: "As a certified health coach, your role is to:",
        options: [
            { id: "a", text: "Diagnose conditions and recommend supplements" },
            { id: "b", text: "Educate and support clients on nutrition and lifestyle changes" },
            { id: "c", text: "Interpret blood tests and prescribe protocols" },
            { id: "d", text: "Replace the client's doctor" },
        ],
        correctAnswer: "b",
        explanation: "Health coaches educate and support — they don't diagnose, prescribe, or interpret medical tests. You partner with the client's healthcare team.",
    },

    // L2 — D.E.P.T.H. Method™
    {
        id: 3,
        lessonRef: 2,
        question: "In the D.E.P.T.H. Method™, what does the \"D\" stand for?",
        options: [
            { id: "a", text: "Diagnose" },
            { id: "b", text: "Discover" },
            { id: "c", text: "Document" },
            { id: "d", text: "Detect" },
        ],
        correctAnswer: "b",
        explanation: "D stands for Discover — the first step where you explore the client's full health history, environment, and personal goals before anything else.",
    },

    // L3 — Warm market strategy
    {
        id: 4,
        lessonRef: 3,
        question: "What is the first step of the Warm Market Strategy to find your initial clients?",
        options: [
            { id: "a", text: "Run Facebook and Instagram ads" },
            { id: "b", text: "Build a professional website first" },
            { id: "c", text: "List 20 people who have mentioned health struggles" },
            { id: "d", text: "Cold-message strangers on social media" },
        ],
        correctAnswer: "c",
        explanation: "Start with people you already know! List 20 people who've mentioned health struggles — no ads or website needed. Warm connections convert fastest.",
    },

    // L3 — Starter package
    {
        id: 5,
        lessonRef: 3,
        question: "What is the recommended starting package for new coaches?",
        options: [
            { id: "a", text: "Free sessions until you feel confident" },
            { id: "b", text: "VIP Package at $997/month" },
            { id: "c", text: "Discovery Package at $297/month" },
            { id: "d", text: "One-time consultation at $50" },
        ],
        correctAnswer: "c",
        explanation: "The Discovery Package at $297/month is the perfect starting point — it's accessible for clients and valuable enough to build your confidence and income.",
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
