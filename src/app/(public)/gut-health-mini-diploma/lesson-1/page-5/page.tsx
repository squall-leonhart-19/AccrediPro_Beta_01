'use client';

import LessonLayout from '../../lesson-layout';

export default function Page5() {
    return (
        <LessonLayout currentPage={5} totalPages={5} lessonNumber={1} lessonTitle="Welcome to Your Gut Health Journey">
            {/* Badge & Title */}
            <span className="lesson-badge">Module 1 • Lesson 1</span>
            <h1 className="lesson-title">Your Journey Starts Now</h1>
            <p className="lesson-subtitle">What comes next in your Mini-Diploma and how to get the most out of it.</p>

            {/* Coach Insert */}
            <div className="coach-box">
                <div className="coach-avatar">S</div>
                <div className="coach-content">
                    <h3>I'm so proud of you for getting here! 🌟</h3>
                    <p>
                        You've just completed the first lesson of your Mini-Diploma. You now understand why gut health
                        matters, how it affects every aspect of wellness, and the incredible opportunity ahead of you.
                        Let me share what's coming next.
                    </p>
                </div>
            </div>

            {/* Lesson Recap */}
            <div className="content-section">
                <h2>What You've Learned So Far</h2>
                <p>Take a moment to acknowledge what you've already accomplished. In this lesson, you discovered:</p>

                <ul className="checklist">
                    <li>
                        <span className="check-icon">✓</span>
                        <span><strong>The gut health crisis:</strong> 70+ million Americans suffer from digestive issues</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span><strong>The second brain:</strong> Your gut contains 500 million neurons and produces 95% of serotonin</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span><strong>The microbiome:</strong> Trillions of organisms that control immunity, mood, and metabolism</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span><strong>The opportunity:</strong> Certified practitioners earn $5K-$15K/month helping people heal</span>
                    </li>
                </ul>
            </div>

            {/* What's Coming */}
            <div className="highlight-box">
                <h3>📚 Your Mini-Diploma Roadmap</h3>
                <p>
                    In your next lessons, you'll dive into <strong>The 5 Pillars of Gut Health</strong>—the exact
                    framework I use with every client. You'll learn practical strategies, real protocols, and how
                    to apply everything you're learning. By the end, you'll earn your <strong>Gut Health Mini-Diploma
                        Certificate!</strong>
                </p>
            </div>

            {/* Coming Up */}
            <div className="content-section">
                <h2>What's Coming in Module 1</h2>

                <div className="card-grid">
                    <div className="info-card">
                        <div className="card-icon" style={{ background: '#E8E4E0', color: '#722F37' }}>✓</div>
                        <div className="card-content">
                            <h4>Lesson 1: Welcome (Completed!)</h4>
                            <p>Introduction to gut health and the practitioner opportunity</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">2</div>
                        <div className="card-content">
                            <h4>Lesson 2: What Is Gut Health?</h4>
                            <p>Deep dive into the science and core principles</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">3</div>
                        <div className="card-content">
                            <h4>Lesson 3: Why Gut Health Matters Now</h4>
                            <p>The modern factors destroying gut health and what to do about it</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips for Success */}
            <div className="content-section">
                <h2>Tips for Getting the Most Out of This Program</h2>

                <div className="card-grid">
                    <div className="info-card">
                        <div className="card-icon">📝</div>
                        <div className="card-content">
                            <h4>Take Notes</h4>
                            <p>Write down insights that resonate with you—they'll become invaluable</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🎯</div>
                        <div className="card-content">
                            <h4>Apply to Yourself First</h4>
                            <p>The best practitioners embody what they teach</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🏆</div>
                        <div className="card-content">
                            <h4>Complete Every Lesson</h4>
                            <p>Each lesson builds on the last—don't skip ahead</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🎉</div>
                        <div className="card-content">
                            <h4>Celebrate Progress</h4>
                            <p>Every lesson brings you closer to your certification</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Closing */}
            <div className="quote-box" style={{ background: 'linear-gradient(135deg, #722F37, #8B4049)', border: 'none' }}>
                <p style={{ color: 'white', fontStyle: 'normal' }}>
                    <strong>You're doing something incredible.</strong> By investing in this knowledge, you're not
                    just changing your own life—you're preparing to change countless others. I'm honored to be on
                    this journey with you.
                </p>
                <div className="quote-author" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    — Sarah, Your Coach 💕
                </div>
            </div>

            {/* Key Takeaways */}
            <div className="content-section" style={{ marginTop: '40px' }}>
                <h2>🎯 Key Takeaways from Lesson 1</h2>

                <ul className="checklist">
                    <li>
                        <span className="check-icon">💡</span>
                        <span>Gut health is the foundation of total wellness—physical, mental, and emotional</span>
                    </li>
                    <li>
                        <span className="check-icon">💡</span>
                        <span>70+ million people are searching for practitioners who understand gut health</span>
                    </li>
                    <li>
                        <span className="check-icon">💡</span>
                        <span>You don't need a medical degree to make a profound difference</span>
                    </li>
                    <li>
                        <span className="check-icon">💡</span>
                        <span>This certification prepares you to earn $5K-$15K/month helping people heal</span>
                    </li>
                </ul>
            </div>
        </LessonLayout>
    );
}
