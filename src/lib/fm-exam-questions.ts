/**
 * FM Mini Diploma Final Exam Questions
 *
 * 10 questions covering all 9 lessons:
 * 1. Root Cause Thinking
 * 2. Gut Health
 * 3. Inflammation
 * 4. Toxins
 * 5. Stress & HPA Axis
 * 6. Nutrient Status
 * 7. Lab Interpretation
 * 8. Client Acquisition
 * 9. Income Potential / Next Steps
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
    // Lesson 1: Root Cause Thinking
    {
        id: 1,
        lessonRef: 1,
        question: "What does the 'O' in the R.O.O.T Method stand for?",
        options: [
            { id: "a", text: "Optimize (create personalized protocols)" },
            { id: "b", text: "Observe (watch and wait)" },
            { id: "c", text: "Origins (trace to root causes) + Optimize (create protocols)" },
            { id: "d", text: "Operate (perform procedures)" },
        ],
        correctAnswer: "c",
        explanation: "The R.O.O.T Method has two 'O's: Origins (trace symptoms to root causes) and Optimize (create personalized protocols). This is the core of functional medicine - find the cause, then address it.",
    },

    // Lesson 2: Gut Health
    {
        id: 2,
        lessonRef: 2,
        question: "What percentage of the immune system is located in the gut?",
        options: [
            { id: "a", text: "About 30%" },
            { id: "b", text: "About 50%" },
            { id: "c", text: "About 70-80%" },
            { id: "d", text: "About 95%" },
        ],
        correctAnswer: "c",
        explanation: "Approximately 70-80% of the immune system resides in the gut, making gut health absolutely crucial for overall immune function and disease prevention.",
    },

    // Lesson 3: Inflammation
    {
        id: 3,
        lessonRef: 3,
        question: "Which of the following is TRUE about chronic inflammation?",
        options: [
            { id: "a", text: "Chronic inflammation is always visible with obvious symptoms like redness and swelling" },
            { id: "b", text: "Chronic inflammation is often 'silent' and can persist for years without obvious symptoms" },
            { id: "c", text: "Chronic inflammation only affects one organ system at a time" },
            { id: "d", text: "Chronic inflammation always causes fever and acute pain" },
        ],
        correctAnswer: "b",
        explanation: "Chronic inflammation is often called the 'silent killer' because it can persist for years without obvious symptoms, slowly contributing to conditions like heart disease, diabetes, and autoimmune disorders.",
    },

    // Lesson 4: Toxins
    {
        id: 4,
        lessonRef: 4,
        question: "What is the primary concern with the accumulation of environmental toxins in the body?",
        options: [
            { id: "a", text: "They only cause temporary discomfort" },
            { id: "b", text: "They can disrupt hormones, damage cells, and contribute to chronic disease over time" },
            { id: "c", text: "The body naturally eliminates all toxins within 24 hours" },
            { id: "d", text: "Toxins only affect people with genetic predispositions" },
        ],
        correctAnswer: "b",
        explanation: "Environmental toxins can accumulate in the body and disrupt hormonal balance, damage cellular function, and contribute to the development of chronic diseases over time.",
    },

    // Lesson 5: Stress & HPA Axis
    {
        id: 5,
        lessonRef: 5,
        question: "What is the HPA axis and why is it important in functional medicine?",
        options: [
            { id: "a", text: "It's a digestive system pathway that processes nutrients" },
            { id: "b", text: "It's the Hypothalamic-Pituitary-Adrenal axis that regulates the body's stress response and affects hormones, energy, and immunity" },
            { id: "c", text: "It's a measurement tool for blood pressure levels" },
            { id: "d", text: "It's a type of exercise technique for stress relief" },
        ],
        correctAnswer: "b",
        explanation: "The HPA (Hypothalamic-Pituitary-Adrenal) axis is the body's central stress response system. Chronic HPA axis dysfunction from prolonged stress can lead to hormonal imbalances, fatigue, weight gain, and weakened immunity.",
    },

    // Lesson 6: Nutrient Status
    {
        id: 6,
        lessonRef: 6,
        question: "Why are conventional 'normal' ranges for nutrient levels often insufficient for optimal health?",
        options: [
            { id: "a", text: "Conventional ranges are designed for elite athletes only" },
            { id: "b", text: "Conventional ranges indicate absence of severe deficiency, not optimal function; functional ranges aim for optimal health" },
            { id: "c", text: "Conventional ranges are always too strict and conservative" },
            { id: "d", text: "There is no difference between conventional and functional ranges" },
        ],
        correctAnswer: "b",
        explanation: "Conventional 'normal' ranges are based on avoiding severe deficiency disease, while functional ranges aim for optimal cellular function and health. Someone can be 'normal' conventionally but sub-optimal functionally.",
    },

    // Lesson 7: Lab Interpretation
    {
        id: 7,
        lessonRef: 7,
        question: "When interpreting lab results from a functional medicine perspective, which approach is most accurate?",
        options: [
            { id: "a", text: "Only look at values flagged as 'high' or 'low' by the lab" },
            { id: "b", text: "Use optimal/functional ranges and look for patterns across multiple markers rather than isolated values" },
            { id: "c", text: "Ignore all labs and rely solely on symptoms" },
            { id: "d", text: "Only consider labs taken in a hospital setting" },
        ],
        correctAnswer: "b",
        explanation: "Functional medicine practitioners use optimal ranges (narrower than conventional) and look for patterns across multiple markers to identify dysfunction before it becomes disease.",
    },

    // Lesson 8: Client Acquisition
    {
        id: 8,
        lessonRef: 8,
        question: "What is the most effective approach for a new functional medicine practitioner to get their first clients?",
        options: [
            { id: "a", text: "Wait until you have every certification possible before talking to anyone" },
            { id: "b", text: "Spend thousands on paid advertising immediately" },
            { id: "c", text: "Start with your existing network (friends, family, community) and offer value through education before pitching services" },
            { id: "d", text: "Cold call random people from the phone book" },
        ],
        correctAnswer: "c",
        explanation: "The fastest path to your first clients is leveraging your existing network and community. Lead with value and education, build trust, and clients will naturally emerge from those relationships.",
    },

    // Lesson 9: Scope of Practice
    {
        id: 9,
        lessonRef: 9,
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

    // Overall/Comprehensive Question - 5 Root Causes
    {
        id: 10,
        lessonRef: 1,
        question: "Which of these is NOT one of the 5 root causes of chronic disease?",
        options: [
            { id: "a", text: "Gut dysfunction" },
            { id: "b", text: "Genetic mutations" },
            { id: "c", text: "Chronic inflammation" },
            { id: "d", text: "HPA axis dysfunction" },
        ],
        correctAnswer: "b",
        explanation: "While genetics can play a role, they're not one of the 5 root causes. The 5 are: Gut, Inflammation, Toxins, Nutrients, and HPA Axis (stress). Most chronic disease is lifestyle-driven, not genetic.",
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
