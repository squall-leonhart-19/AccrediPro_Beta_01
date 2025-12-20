'use client';

import LessonLayout from '../../lesson-layout';

export default function Page1() {
    return (
        <LessonLayout currentPage={1} totalPages={5} lessonNumber={1} lessonTitle="Welcome to Your Gut Health Journey">
            {/* Badge & Title */}
            <span className="lesson-badge">Module 1 • Lesson 1</span>
            <h1 className="lesson-title">Welcome to Your Gut Health Journey</h1>
            <p className="lesson-subtitle">Your path to becoming a certified Gut Health practitioner starts right here, right now.</p>

            {/* Coach Welcome */}
            <div className="coach-box">
                <div className="coach-avatar">S</div>
                <div className="coach-content">
                    <h3>Hey there, beautiful! 👋</h3>
                    <p>
                        I'm Sarah, and I'm SO incredibly excited that you're here. Whether you're looking to help others,
                        start a new career, or simply deepen your own understanding of gut health—you've made an amazing decision.
                        I've helped hundreds of practitioners just like you build thriving practices that transform lives.
                        And I can't wait to see what you'll accomplish!
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-section">
                <h2>Why You're Here Matters</h2>
                <p>
                    Let me share something with you: <strong>The fact that you're here says something beautiful about you.</strong>
                    It tells me you care. You care about your own health, about helping others, and about making a real difference
                    in this world.
                </p>
                <p>
                    Maybe you've struggled with digestive issues yourself and finally found answers. Maybe you've watched
                    someone you love suffer and wished you could help. Or maybe you're simply fascinated by the incredible
                    connection between gut health and overall wellness.
                </p>
                <p>
                    Whatever brought you here—<strong>you're in exactly the right place.</strong>
                </p>
            </div>

            {/* Highlight Box */}
            <div className="highlight-box">
                <h3>💡 Here's What's Possible For You</h3>
                <p>
                    Over the next few lessons, you're going to discover why gut health is called the "gateway to wellness"
                    and how understanding it can help you transform not just your own life, but the lives of countless others
                    who are desperately searching for answers.
                </p>
            </div>

            {/* What You'll Learn */}
            <div className="content-section">
                <h2>What We'll Cover Together</h2>
                <p>In this mini-diploma, you'll learn:</p>

                <div className="card-grid">
                    <div className="info-card">
                        <div className="card-icon">📚</div>
                        <div className="card-content">
                            <h4>The Foundations of Gut Health</h4>
                            <p>What the gut microbiome is and why it controls so much of our health</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🎯</div>
                        <div className="card-content">
                            <h4>Core Healing Principles</h4>
                            <p>The 5 pillars every gut health practitioner needs to master</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🚀</div>
                        <div className="card-content">
                            <h4>Your Path Forward</h4>
                            <p>How to turn this knowledge into a fulfilling career or practice</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quote */}
            <div className="quote-box">
                <p>
                    "When I started this program, I had no idea it would completely change my life. Within 3 months,
                    I went from feeling lost and unfulfilled to helping real clients heal their gut issues.
                    Sarah's guidance made all the difference."
                </p>
                <div className="quote-author">— Jennifer M., Certified Gut Health Coach, California</div>
            </div>
        </LessonLayout>
    );
}
