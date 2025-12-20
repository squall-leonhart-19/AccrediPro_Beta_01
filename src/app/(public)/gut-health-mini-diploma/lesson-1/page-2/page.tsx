'use client';

import LessonLayout from '../../lesson-layout';

export default function Page2() {
    return (
        <LessonLayout currentPage={2} totalPages={5} lessonNumber={1} lessonTitle="Welcome to Your Gut Health Journey">
            {/* Badge & Title */}
            <span className="lesson-badge">Module 1 • Lesson 1</span>
            <h1 className="lesson-title">Why Gut Health Matters More Than Ever</h1>
            <p className="lesson-subtitle">Understanding the epidemic that's affecting millions—and how you can help.</p>

            {/* Coach Insert */}
            <div className="coach-box">
                <div className="coach-avatar">S</div>
                <div className="coach-content">
                    <h3>Let me share something eye-opening...</h3>
                    <p>
                        The statistics I'm about to share might surprise you. But don't let them overwhelm you—
                        let them <strong>inspire</strong> you. Because these numbers represent real people who need
                        practitioners like you.
                    </p>
                </div>
            </div>

            {/* The Problem */}
            <div className="content-section">
                <h2>The Gut Health Crisis</h2>
                <p>
                    Here's the reality: <strong>Over 70 million Americans suffer from digestive issues.</strong>
                    That's not a typo. 70 million people—mothers, sisters, friends, colleagues—are struggling with
                    bloating, IBS, acid reflux, constipation, and countless other symptoms that are silently
                    destroying their quality of life.
                </p>
                <p>
                    And here's what breaks my heart most: Many of them have been told their symptoms are "normal"
                    or "just stress" or even "all in their head." They've been dismissed, ignored, and left feeling
                    hopeless.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="card-grid">
                <div className="info-card">
                    <div className="card-icon" style={{ background: '#722F37', color: 'white' }}>70M</div>
                    <div className="card-content">
                        <h4>Americans Affected</h4>
                        <p>Struggling with digestive issues daily</p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="card-icon" style={{ background: '#722F37', color: 'white' }}>80%</div>
                    <div className="card-content">
                        <h4>Immune System</h4>
                        <p>Located in your gut—the body's command center</p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="card-icon" style={{ background: '#722F37', color: 'white' }}>95%</div>
                    <div className="card-content">
                        <h4>Serotonin Production</h4>
                        <p>Made in the gut—your "second brain"</p>
                    </div>
                </div>
            </div>

            {/* The Good News */}
            <div className="highlight-box">
                <h3>✨ But Here's the Beautiful Truth...</h3>
                <p>
                    Gut health issues are almost always addressable. When you understand the root causes and know
                    how to address them systematically, you can help people experience transformations that seemed
                    impossible. I've seen it happen hundreds of times.
                </p>
            </div>

            {/* Why Women 40+ */}
            <div className="content-section">
                <h2>Why This Affects Women Over 40 Most</h2>
                <p>
                    If you're a woman over 40 (like many of our students), you might have noticed your digestion
                    isn't what it used to be. There's a reason for that.
                </p>

                <ul className="checklist">
                    <li>
                        <span className="check-icon">✓</span>
                        <span><strong>Hormonal shifts</strong> directly impact gut motility and microbiome balance</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span><strong>Decades of stress</strong> have accumulated, affecting the gut-brain axis</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span><strong>Lifestyle factors</strong> like antibiotics, processed foods, and toxins have taken their toll</span>
                    </li>
                    <li>
                        <span className="check-icon">✓</span>
                        <span><strong>The medical system</strong> often overlooks or dismisses these symptoms</span>
                    </li>
                </ul>

                <p>
                    This is exactly why there's such a <strong>tremendous need</strong> for educated gut health
                    practitioners. People are searching for answers—and you can be the one who provides them.
                </p>
            </div>

            {/* Quote */}
            <div className="quote-box">
                <p>
                    "I spent 15 years being told my bloating was 'just part of getting older.'
                    After learning about gut health, I finally understood what was happening—and I was able to
                    heal myself AND start helping other women like me."
                </p>
                <div className="quote-author">— Maria R., Certified Gut Health Coach, Texas</div>
            </div>
        </LessonLayout>
    );
}
