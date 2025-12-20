'use client';

import LessonLayout from '../../lesson-layout';

export default function Page3() {
    return (
        <LessonLayout currentPage={3} totalPages={5} lessonNumber={1} lessonTitle="Welcome to Your Gut Health Journey">
            {/* Badge & Title */}
            <span className="lesson-badge">Module 1 • Lesson 1</span>
            <h1 className="lesson-title">The Gut: Your Body's Command Center</h1>
            <p className="lesson-subtitle">Discover why healing the gut heals everything else.</p>

            {/* Coach Insert */}
            <div className="coach-box">
                <div className="coach-avatar">S</div>
                <div className="coach-content">
                    <h3>This is where it gets exciting! 🌟</h3>
                    <p>
                        I remember when I first learned about the gut-body connection—it was like someone turned on
                        a light in a dark room. Suddenly, everything made sense. I'm about to share that same "aha"
                        moment with you.
                    </p>
                </div>
            </div>

            {/* The Second Brain */}
            <div className="content-section">
                <h2>Your Gut: The "Second Brain"</h2>
                <p>
                    Scientists call the gut the <strong>"second brain"</strong>—and for good reason. Your gut contains
                    over 500 million neurons, more than your spinal cord. It has its own nervous system called the
                    Enteric Nervous System (ENS), which can function completely independently from your brain.
                </p>
                <p>
                    But here's what's truly remarkable: <strong>Your gut and brain are in constant communication.</strong>
                    This is called the gut-brain axis, and it's a two-way street. When your gut is unhappy, your brain
                    knows. When your brain is stressed, your gut feels it.
                </p>
            </div>

            {/* Key Facts */}
            <div className="highlight-box">
                <h3>🧠 Mind-Blowing Gut Facts</h3>
                <p>
                    Your gut produces <strong>95% of your body's serotonin</strong> (the "happiness hormone"),
                    houses <strong>80% of your immune system</strong>, and contains <strong>trillions of bacteria</strong>
                    that directly influence everything from your mood to your metabolism.
                </p>
            </div>

            {/* The Microbiome */}
            <div className="content-section">
                <h2>Meet Your Microbiome</h2>
                <p>
                    Inside your gut lives a universe of microorganisms called the <strong>microbiome</strong>.
                    We're talking about trillions of bacteria, viruses, fungi, and other microscopic life forms
                    that collectively weigh about 4-5 pounds.
                </p>
                <p>
                    Here's the beautiful thing: When your microbiome is balanced and thriving, you experience:
                </p>

                <div className="card-grid">
                    <div className="info-card">
                        <div className="card-icon">⚡</div>
                        <div className="card-content">
                            <h4>Boundless Energy</h4>
                            <p>Efficient nutrient absorption means more fuel for your cells</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">😊</div>
                        <div className="card-content">
                            <h4>Stable Mood</h4>
                            <p>Optimal serotonin production supports mental wellness</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🛡️</div>
                        <div className="card-content">
                            <h4>Strong Immunity</h4>
                            <p>A healthy gut means fewer sick days and faster recovery</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">✨</div>
                        <div className="card-content">
                            <h4>Clear Skin</h4>
                            <p>The gut-skin axis is real—inner health shows on the outside</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* When Things Go Wrong */}
            <div className="content-section">
                <h2>When the Gut Is Out of Balance</h2>
                <p>
                    Unfortunately, modern life is incredibly hard on our guts. <strong>Stress, processed foods,
                        antibiotics, environmental toxins, lack of sleep</strong>—all of these disrupt the delicate
                    balance of our microbiome.
                </p>
                <p>
                    When the gut becomes imbalanced (a state we call <strong>dysbiosis</strong>), the effects
                    ripple throughout the entire body:
                </p>

                <ul className="checklist">
                    <li>
                        <span className="check-icon">→</span>
                        <span>Bloating, gas, constipation, or diarrhea</span>
                    </li>
                    <li>
                        <span className="check-icon">→</span>
                        <span>Brain fog, anxiety, and mood swings</span>
                    </li>
                    <li>
                        <span className="check-icon">→</span>
                        <span>Skin issues like acne, eczema, and rosacea</span>
                    </li>
                    <li>
                        <span className="check-icon">→</span>
                        <span>Fatigue that sleep doesn't fix</span>
                    </li>
                    <li>
                        <span className="check-icon">→</span>
                        <span>Weight gain or difficulty losing weight</span>
                    </li>
                    <li>
                        <span className="check-icon">→</span>
                        <span>Autoimmune conditions and chronic inflammation</span>
                    </li>
                </ul>
            </div>

            {/* Quote */}
            <div className="quote-box">
                <p>
                    "Understanding that my anxiety and brain fog were connected to my gut—not 'all in my head'—was
                    life-changing. As a practitioner now, I help other women make this same connection every day."
                </p>
                <div className="quote-author">— Lisa K., Certified Gut Health Coach, New York</div>
            </div>
        </LessonLayout>
    );
}
