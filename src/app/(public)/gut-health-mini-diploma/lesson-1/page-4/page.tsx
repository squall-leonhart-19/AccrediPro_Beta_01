'use client';

import LessonLayout from '../../lesson-layout';

export default function Page4() {
    return (
        <LessonLayout currentPage={4} totalPages={5} lessonNumber={1} lessonTitle="Welcome to Your Gut Health Journey">
            {/* Badge & Title */}
            <span className="lesson-badge">Module 1 • Lesson 1</span>
            <h1 className="lesson-title">The Practitioner Opportunity</h1>
            <p className="lesson-subtitle">How becoming a certified Gut Health Coach can transform your career—and your income.</p>

            {/* Coach Insert */}
            <div className="coach-box">
                <div className="coach-avatar">S</div>
                <div className="coach-content">
                    <h3>Let's talk about YOU now... 💕</h3>
                    <p>
                        You've just learned why gut health matters. Now let me show you what's possible when you turn
                        this knowledge into a career. The opportunity is bigger than you might realize.
                    </p>
                </div>
            </div>

            {/* The Opportunity */}
            <div className="content-section">
                <h2>A Career That Actually Matters</h2>
                <p>
                    Here's something I wish someone had told me years ago: <strong>You don't need a medical degree
                        to make a profound difference in people's health.</strong> You don't need to go back to school
                    for 8 years. You don't need to take on $200,000 in student debt.
                </p>
                <p>
                    What you DO need is the right training, the right knowledge, and the right support. And that's
                    exactly what this certification provides.
                </p>
            </div>

            {/* Income Potential */}
            <div className="highlight-box">
                <h3>💰 What Certified Gut Health Coaches Earn</h3>
                <p>
                    Our graduates typically charge <strong>$100-$200 per session</strong> or
                    <strong>$500-$2,500 per program</strong>. With just 5-10 clients per month, you can build a
                    meaningful income doing work that actually transforms lives.
                </p>
            </div>

            {/* Success Stories */}
            <div className="content-section">
                <h2>Real Results from Real Practitioners</h2>

                <div className="card-grid">
                    <div className="info-card">
                        <div className="card-icon">👩‍⚕️</div>
                        <div className="card-content">
                            <h4>Former Nurse → $8K/month</h4>
                            <p>"Left my hospital job, now I work from home helping people actually heal"</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">👩‍🍳</div>
                        <div className="card-content">
                            <h4>Stay-at-Home Mom → $5K/month</h4>
                            <p>"I work during school hours and make more than my old corporate salary"</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🧘‍♀️</div>
                        <div className="card-content">
                            <h4>Yoga Teacher → $12K/month</h4>
                            <p>"Added gut health coaching to my services—income tripled in 6 months"</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">💼</div>
                        <div className="card-content">
                            <h4>Career Changer → $6K/month</h4>
                            <p>"No health background. Had my first paying client in week 4 of the program"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Who This Is For */}
            <div className="content-section">
                <h2>This Path Is Perfect For You If...</h2>

                <ul className="checklist">
                    <li>
                        <span className="check-icon">✓</span>
                        <span>You're passionate about health and wellness</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span>You want to help people in a meaningful way</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span>You're looking for flexible, work-from-anywhere income</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span>You've dealt with your own gut issues and want to help others</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span>You want to add gut health expertise to an existing practice</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span>You're ready for a career that aligns with your values</span>
                    </li>
                </ul>
            </div>

            {/* Quote */}
            <div className="quote-box">
                <p>
                    "I was skeptical at first—could I really build a business around gut health? Within 6 months,
                    I had replaced my corporate income and was doing work I actually loved. Best decision I ever made."
                </p>
                <div className="quote-author">— Amanda S., Certified Gut Health Coach, Colorado</div>
            </div>
        </LessonLayout>
    );
}
