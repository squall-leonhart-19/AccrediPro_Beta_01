/**
 * Enhanced Lesson Content Generator
 * Creates premium, detailed lesson content with Sarah's coaching voice
 * Optimized for 40+ US women, maximum engagement and completion
 */

export interface LessonContentConfig {
    lessonTitle: string;
    lessonDescription: string;
    nicheName: string;
    moduleNumber: number;
    lessonNumber: number;
    targetAudience: string;
    keyBenefit: string;
    primaryProblem: string;
    isFirstLesson?: boolean;
    isQuiz?: boolean;
}

/**
 * Generate comprehensive lesson content with Sarah's warm, professional voice
 */
export function generateEnhancedLessonContent(config: LessonContentConfig): string {
    const {
        lessonTitle,
        lessonDescription,
        nicheName,
        moduleNumber,
        lessonNumber,
        targetAudience,
        keyBenefit,
        primaryProblem,
        isFirstLesson = false,
        isQuiz = false,
    } = config;

    if (isQuiz) {
        return generateQuizContent(lessonTitle, nicheName);
    }

    if (isFirstLesson) {
        return generateWelcomeLesson(config);
    }

    // Regular lesson content
    return `
<div class="lesson-container" style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px 24px; line-height: 1.9; color: #2d2d2d; background: #fefefe;">
  
  <!-- Lesson Header -->
  <div style="border-bottom: 3px solid #722F37; padding-bottom: 24px; margin-bottom: 32px;">
    <p style="color: #722F37; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">Module ${moduleNumber} • Lesson ${lessonNumber}</p>
    <h1 style="color: #1a1a1a; font-size: 2.2em; margin: 0 0 12px 0; font-weight: 600; line-height: 1.3;">${lessonTitle}</h1>
    <p style="color: #666; font-size: 1.15em; margin: 0; font-style: italic;">${lessonDescription}</p>
  </div>

  <!-- Sarah's Welcome -->
  <div style="background: linear-gradient(135deg, #faf8f5 0%, #fff 100%); border-left: 4px solid #722F37; padding: 24px 28px; margin-bottom: 36px; border-radius: 0 12px 12px 0;">
    <p style="margin: 0; font-size: 1.1em; color: #333;">
      <strong style="color: #722F37;">Hey there, beautiful!</strong> 👋
    </p>
    <p style="margin: 16px 0 0 0; font-size: 1.05em; color: #444;">
      I'm so glad you're here for this lesson. What we're about to cover is truly transformative, and I've seen it change the lives of so many women just like you. Take a deep breath, grab your favorite drink, and let's dive in together.
    </p>
  </div>

  <!-- Learning Objectives -->
  <div style="background: #fff; border: 1px solid #e8e4e0; border-radius: 12px; padding: 28px; margin-bottom: 36px;">
    <h2 style="color: #722F37; font-size: 1.3em; margin: 0 0 16px 0; display: flex; align-items: center; gap: 10px;">
      🎯 What You'll Learn in This Lesson
    </h2>
    <ul style="margin: 0; padding: 0; list-style: none;">
      <li style="padding: 12px 0; border-bottom: 1px solid #f0ebe7; display: flex; align-items: flex-start; gap: 12px;">
        <span style="color: #722F37; font-size: 1.2em;">✓</span>
        <span>Understand the core principles behind ${lessonTitle.toLowerCase()} and why it matters for your ${nicheName} journey</span>
      </li>
      <li style="padding: 12px 0; border-bottom: 1px solid #f0ebe7; display: flex; align-items: flex-start; gap: 12px;">
        <span style="color: #722F37; font-size: 1.2em;">✓</span>
        <span>Discover practical strategies you can apply immediately with ${targetAudience}</span>
      </li>
      <li style="padding: 12px 0; border-bottom: 1px solid #f0ebe7; display: flex; align-items: flex-start; gap: 12px;">
        <span style="color: #722F37; font-size: 1.2em;">✓</span>
        <span>Learn how to help your future clients achieve ${keyBenefit}</span>
      </li>
      <li style="padding: 12px 0; display: flex; align-items: flex-start; gap: 12px;">
        <span style="color: #722F37; font-size: 1.2em;">✓</span>
        <span>Build confidence in explaining these concepts clearly and compassionately</span>
      </li>
    </ul>
  </div>

  <!-- Main Content Section 1 -->
  <section style="margin-bottom: 40px;">
    <h2 style="color: #1a1a1a; font-size: 1.5em; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #f0ebe7;">
      Understanding ${lessonTitle}
    </h2>
    
    <p style="font-size: 1.1em; margin-bottom: 20px;">
      Let me start by saying something important: <strong>${lessonDescription}</strong>. This isn't just theory—it's the foundation of how you'll transform lives as a certified ${nicheName} practitioner.
    </p>

    <p style="font-size: 1.1em; margin-bottom: 20px;">
      When I first learned about this concept years ago, it completely changed how I approached helping ${targetAudience}. I remember thinking, "Why didn't anyone teach me this sooner?" And that's exactly why I'm so passionate about sharing it with you now.
    </p>

    <p style="font-size: 1.1em; margin-bottom: 20px;">
      The reality is that most people suffering from ${primaryProblem} have never had anyone explain these principles to them in a way that makes sense. That's where you come in. As a certified practitioner, you'll have the knowledge and skills to bridge that gap.
    </p>
  </section>

  <!-- Key Insight Box -->
  <div style="background: linear-gradient(135deg, #722F37 0%, #8B4049 100%); color: white; padding: 28px 32px; border-radius: 12px; margin-bottom: 40px; box-shadow: 0 4px 15px rgba(114, 47, 55, 0.2);">
    <h3 style="margin: 0 0 12px 0; font-size: 1.2em; color: white; display: flex; align-items: center; gap: 10px;">
      💡 Key Insight
    </h3>
    <p style="margin: 0; font-size: 1.1em; line-height: 1.7; opacity: 0.95;">
      ${lessonDescription}. When you truly understand this, you'll be able to help your clients see their challenges in a completely new light—and that's when real transformation begins.
    </p>
  </div>

  <!-- Main Content Section 2 -->
  <section style="margin-bottom: 40px;">
    <h2 style="color: #1a1a1a; font-size: 1.5em; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #f0ebe7;">
      Why This Matters for Your Practice
    </h2>

    <p style="font-size: 1.1em; margin-bottom: 20px;">
      As you build your ${nicheName} practice, you'll encounter clients at all different stages of their journey. Some will come to you having already tried "everything" and feeling hopeless. Others will be just starting to understand that ${primaryProblem} doesn't have to be their permanent reality.
    </p>

    <p style="font-size: 1.1em; margin-bottom: 20px;">
      What sets exceptional practitioners apart is their ability to meet clients where they are and guide them forward with compassion, knowledge, and practical solutions. That's exactly what this certification is preparing you to do.
    </p>

    <div style="background: #f9f7f4; border-radius: 12px; padding: 24px; margin: 28px 0;">
      <h4 style="color: #722F37; margin: 0 0 16px 0; font-size: 1.1em;">📝 Practitioner Note</h4>
      <p style="margin: 0; font-size: 1.05em; color: #444;">
        One of the most powerful things you can do as a practitioner is <em>normalize</em> your client's experience while simultaneously showing them a path forward. Many women have been dismissed or told their symptoms are "all in their head." Your role is to validate their experience AND empower them with solutions.
      </p>
    </div>
  </section>

  <!-- Practical Application -->
  <section style="margin-bottom: 40px;">
    <h2 style="color: #1a1a1a; font-size: 1.5em; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #f0ebe7;">
      Putting This Into Practice
    </h2>

    <p style="font-size: 1.1em; margin-bottom: 20px;">
      Now let's talk about how you'll actually use this knowledge. Here are the key principles I want you to remember:
    </p>

    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
      <div style="background: #fff; border: 1px solid #e8e4e0; border-radius: 10px; padding: 20px;">
        <h4 style="margin: 0 0 8px 0; color: #722F37; font-size: 1.05em;">1. Start With Understanding</h4>
        <p style="margin: 0; color: #555; font-size: 1em;">Before jumping to solutions, truly understand your client's unique situation. Every woman's journey is different.</p>
      </div>
      <div style="background: #fff; border: 1px solid #e8e4e0; border-radius: 10px; padding: 20px;">
        <h4 style="margin: 0 0 8px 0; color: #722F37; font-size: 1.05em;">2. Educate With Compassion</h4>
        <p style="margin: 0; color: #555; font-size: 1em;">Share knowledge in a way that empowers rather than overwhelms. Small, actionable steps create lasting change.</p>
      </div>
      <div style="background: #fff; border: 1px solid #e8e4e0; border-radius: 10px; padding: 20px;">
        <h4 style="margin: 0 0 8px 0; color: #722F37; font-size: 1.05em;">3. Celebrate Progress</h4>
        <p style="margin: 0; color: #555; font-size: 1em;">Acknowledge every step forward, no matter how small. Transformation is a journey, not a destination.</p>
      </div>
    </div>
  </section>

  <!-- Sarah's Story/Example -->
  <div style="background: #fdf9f6; border-radius: 12px; padding: 28px; margin-bottom: 40px; border: 1px solid #f0ebe7;">
    <h3 style="color: #722F37; margin: 0 0 16px 0; font-size: 1.2em;">
      💬 From My Practice
    </h3>
    <p style="font-size: 1.05em; color: #444; margin: 0 0 16px 0;">
      I remember working with a client—let's call her Lisa—who had struggled with ${primaryProblem} for over 15 years. She'd seen countless doctors and tried dozens of approaches, and she was honestly on the verge of giving up.
    </p>
    <p style="font-size: 1.05em; color: #444; margin: 0 0 16px 0;">
      When I explained these concepts to her—the ones you're learning right now—something shifted. For the first time, she understood <em>why</em> she was experiencing what she was experiencing. That understanding alone reduced her anxiety by half.
    </p>
    <p style="font-size: 1.05em; color: #444; margin: 0;">
      Three months later, she sent me a message saying, "I finally feel like myself again." <strong>That's the power of what you're learning.</strong>
    </p>
  </div>

  <!-- Summary & Key Takeaways -->
  <section style="margin-bottom: 40px;">
    <h2 style="color: #1a1a1a; font-size: 1.5em; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #f0ebe7;">
      Key Takeaways
    </h2>
    
    <div style="background: #fff; border: 2px solid #722F37; border-radius: 12px; padding: 24px;">
      <ul style="margin: 0; padding: 0 0 0 24px;">
        <li style="padding: 8px 0; font-size: 1.05em; color: #333;">
          <strong>${lessonTitle}</strong> is foundational to understanding ${nicheName}
        </li>
        <li style="padding: 8px 0; font-size: 1.05em; color: #333;">
          Your role as a practitioner is to educate and empower, not just treat
        </li>
        <li style="padding: 8px 0; font-size: 1.05em; color: #333;">
          Understanding leads to transformation—help clients see their situation clearly
        </li>
        <li style="padding: 8px 0; font-size: 1.05em; color: #333;">
          Meet clients where they are and guide them forward with compassion
        </li>
      </ul>
    </div>
  </section>

  <!-- Closing & Next Steps -->
  <div style="background: linear-gradient(135deg, #faf8f5 0%, #fff 100%); border: 1px solid #e8e4e0; border-radius: 12px; padding: 28px; margin-bottom: 24px;">
    <h3 style="color: #722F37; margin: 0 0 16px 0; font-size: 1.2em;">
      ✨ You're Doing Amazing
    </h3>
    <p style="font-size: 1.05em; color: #444; margin: 0 0 16px 0;">
      Take a moment to acknowledge yourself for investing in this knowledge. Every lesson you complete brings you one step closer to being able to help ${targetAudience} achieve ${keyBenefit}.
    </p>
    <p style="font-size: 1.05em; color: #444; margin: 0;">
      When you're ready, click "Complete & Continue" to move on to the next lesson. I'll be waiting for you there! 💕
    </p>
  </div>

  <!-- Progress Indicator -->
  <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e8e4e0;">
    <p style="color: #999; font-size: 0.9em; margin: 0;">
      Module ${moduleNumber} • Lesson ${lessonNumber} • ${nicheName} Certification
    </p>
  </div>

</div>
  `.trim();
}

/**
 * Generate welcome/first lesson content
 */
function generateWelcomeLesson(config: LessonContentConfig): string {
    const { nicheName, targetAudience, keyBenefit, primaryProblem } = config;

    return `
<div class="lesson-container" style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px 24px; line-height: 1.9; color: #2d2d2d; background: #fefefe;">
  
  <!-- Hero Welcome -->
  <div style="text-align: center; padding: 40px 20px; margin-bottom: 36px; background: linear-gradient(135deg, #722F37 0%, #8B4049 100%); border-radius: 16px; color: white;">
    <p style="font-size: 1.1em; margin: 0 0 8px 0; opacity: 0.9;">Welcome to Your</p>
    <h1 style="font-size: 2.4em; margin: 0 0 16px 0; font-weight: 600; color: white;">${nicheName} Certification</h1>
    <p style="font-size: 1.15em; margin: 0; opacity: 0.95; max-width: 500px; margin: 0 auto;">
      Your journey to becoming a certified practitioner starts right here, right now.
    </p>
  </div>

  <!-- Sarah's Personal Welcome -->
  <div style="display: flex; gap: 24px; align-items: flex-start; margin-bottom: 40px; background: #fdf9f6; padding: 28px; border-radius: 12px;">
    <div style="flex-shrink: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #722F37, #8B4049); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2em;">
      S
    </div>
    <div>
      <h2 style="margin: 0 0 12px 0; color: #722F37; font-size: 1.3em;">Hey there, I'm Sarah! 👋</h2>
      <p style="margin: 0 0 16px 0; font-size: 1.1em; color: #444;">
        I'm so incredibly excited that you're here. Whether you're looking to help others, start a new career, or simply deepen your own understanding of ${nicheName}—you've made an amazing decision.
      </p>
      <p style="margin: 0; font-size: 1.1em; color: #444;">
        I've helped hundreds of practitioners just like you build thriving practices that transform lives. And I can't wait to see what you'll accomplish.
      </p>
    </div>
  </div>

  <!-- What to Expect -->
  <section style="margin-bottom: 40px;">
    <h2 style="color: #1a1a1a; font-size: 1.5em; margin: 0 0 24px 0; padding-bottom: 8px; border-bottom: 2px solid #f0ebe7;">
      What You'll Achieve in This Program
    </h2>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #fff; border: 1px solid #e8e4e0; border-radius: 12px;">
        <div style="flex-shrink: 0; width: 48px; height: 48px; background: #f0ebe7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4em;">
          📚
        </div>
        <div>
          <h4 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 1.1em;">Master the Fundamentals</h4>
          <p style="margin: 0; color: #666; font-size: 1em;">Build a rock-solid foundation in ${nicheName} that will set you apart from others in the field.</p>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #fff; border: 1px solid #e8e4e0; border-radius: 12px;">
        <div style="flex-shrink: 0; width: 48px; height: 48px; background: #f0ebe7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4em;">
          🎯
        </div>
        <div>
          <h4 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 1.1em;">Help ${targetAudience}</h4>
          <p style="margin: 0; color: #666; font-size: 1em;">Learn proven approaches to help your future clients overcome ${primaryProblem} and achieve ${keyBenefit}.</p>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #fff; border: 1px solid #e8e4e0; border-radius: 12px;">
        <div style="flex-shrink: 0; width: 48px; height: 48px; background: #f0ebe7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4em;">
          🏆
        </div>
        <div>
          <h4 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 1.1em;">Earn Your Certification</h4>
          <p style="margin: 0; color: #666; font-size: 1em;">Complete the program and receive your official ${nicheName} certification—a credential you can proudly display.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Why This Matters -->
  <div style="background: linear-gradient(135deg, #722F37 0%, #8B4049 100%); color: white; padding: 32px; border-radius: 12px; margin-bottom: 40px; box-shadow: 0 4px 15px rgba(114, 47, 55, 0.2);">
    <h3 style="margin: 0 0 16px 0; font-size: 1.3em; color: white;">
      💡 Why This Certification Matters
    </h3>
    <p style="margin: 0 0 16px 0; font-size: 1.1em; line-height: 1.7; opacity: 0.95;">
      Right now, there are millions of people—especially women over 40—struggling with ${primaryProblem}. They're looking for someone who truly understands what they're going through and can guide them toward healing.
    </p>
    <p style="margin: 0; font-size: 1.1em; line-height: 1.7; opacity: 0.95;">
      <strong>That someone is about to be you.</strong>
    </p>
  </div>

  <!-- How to Get the Most Out of This -->
  <section style="margin-bottom: 40px;">
    <h2 style="color: #1a1a1a; font-size: 1.5em; margin: 0 0 24px 0; padding-bottom: 8px; border-bottom: 2px solid #f0ebe7;">
      How to Get the Most Out of This Program
    </h2>

    <div style="background: #fff; border: 1px solid #e8e4e0; border-radius: 12px; padding: 28px;">
      <ul style="margin: 0; padding: 0; list-style: none;">
        <li style="padding: 16px 0; border-bottom: 1px solid #f0ebe7; display: flex; align-items: flex-start; gap: 16px;">
          <span style="background: #722F37; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9em; flex-shrink: 0;">1</span>
          <div>
            <strong style="color: #1a1a1a;">Take notes as you go</strong>
            <p style="margin: 6px 0 0 0; color: #666; font-size: 0.95em;">Write down insights that resonate with you. These will become invaluable in your practice.</p>
          </div>
        </li>
        <li style="padding: 16px 0; border-bottom: 1px solid #f0ebe7; display: flex; align-items: flex-start; gap: 16px;">
          <span style="background: #722F37; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9em; flex-shrink: 0;">2</span>
          <div>
            <strong style="color: #1a1a1a;">Complete each lesson before moving on</strong>
            <p style="margin: 6px 0 0 0; color: #666; font-size: 0.95em;">The concepts build on each other. Taking your time will deepen your understanding.</p>
          </div>
        </li>
        <li style="padding: 16px 0; border-bottom: 1px solid #f0ebe7; display: flex; align-items: flex-start; gap: 16px;">
          <span style="background: #722F37; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9em; flex-shrink: 0;">3</span>
          <div>
            <strong style="color: #1a1a1a;">Apply what you learn to your own life first</strong>
            <p style="margin: 6px 0 0 0; color: #666; font-size: 0.95em;">The best practitioners embody the principles they teach. Start with yourself.</p>
          </div>
        </li>
        <li style="padding: 16px 0; display: flex; align-items: flex-start; gap: 16px;">
          <span style="background: #722F37; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9em; flex-shrink: 0;">4</span>
          <div>
            <strong style="color: #1a1a1a;">Celebrate your progress!</strong>
            <p style="margin: 6px 0 0 0; color: #666; font-size: 0.95em;">Each lesson completed is a step toward your certification. You're doing something amazing.</p>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <!-- Let's Begin -->
  <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #faf8f5 0%, #fff 100%); border: 2px solid #722F37; border-radius: 12px;">
    <h3 style="color: #722F37; font-size: 1.4em; margin: 0 0 16px 0;">
      Ready to Begin? 🌟
    </h3>
    <p style="font-size: 1.1em; color: #444; margin: 0 0 8px 0; max-width: 500px; margin: 0 auto 20px;">
      I'm so honored to be on this journey with you. Click "Complete & Continue" to start your first real lesson—I'll see you there!
    </p>
    <p style="margin: 0; font-size: 1.2em; color: #722F37;">
      With excitement and support,<br>
      <strong>Sarah</strong> 💕
    </p>
  </div>

</div>
  `.trim();
}

/**
 * Generate quiz content placeholder
 */
function generateQuizContent(title: string, nicheName: string): string {
    return `
<div class="quiz-container" style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px 24px; text-align: center;">
  
  <div style="background: linear-gradient(135deg, #722F37 0%, #8B4049 100%); color: white; padding: 40px; border-radius: 16px; margin-bottom: 32px;">
    <h1 style="font-size: 2em; margin: 0 0 16px 0; color: white;">🎓 ${title}</h1>
    <p style="font-size: 1.15em; margin: 0; opacity: 0.95;">
      Time to put your knowledge to the test!
    </p>
  </div>

  <div style="background: #fdf9f6; padding: 32px; border-radius: 12px; border: 1px solid #e8e4e0;">
    <p style="font-size: 1.2em; color: #333; margin: 0 0 24px 0;">
      You've done an amazing job completing this module! The quiz below will help reinforce what you've learned.
    </p>
    <p style="font-size: 1.1em; color: #666; margin: 0;">
      Don't worry about getting every answer perfect—this is a learning experience. You can retake quizzes as many times as you need.
    </p>
  </div>

  <p style="margin-top: 32px; color: #999; font-size: 0.95em;">
    ${nicheName} Certification • Module Assessment
  </p>

</div>
  `.trim();
}
