'use client';

import { useState } from 'react';
import Link from 'next/link';

// STYLE 3: Clean White with Step-by-Step Cards
// Vertical card layout with checkmarks and smooth progression

export default function Style3Page() {
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: 'Welcome to Your Journey',
            content: (
                <>
                    <div style={{
                        display: 'flex',
                        gap: 16,
                        padding: 20,
                        background: '#fdfbf7',
                        borderRadius: 12,
                        marginBottom: 20,
                    }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #722F37, #8B4049)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 20,
                            flexShrink: 0,
                        }}>S</div>
                        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>
                            <strong style={{ color: '#722F37' }}>Hey there! 👋</strong> I'm Sarah, and I'm so excited
                            you're starting this journey. You've made an amazing decision!
                        </p>
                    </div>
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: '#444' }}>
                        Whether you're here to help others, start a new career, or deepen your own understanding
                        of gut health—you're in exactly the right place.
                    </p>
                </>
            ),
        },
        {
            title: 'The Gut Health Crisis',
            content: (
                <>
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: '#444', marginBottom: 20 }}>
                        <strong>Over 70 million Americans</strong> suffer from digestive issues—that's more than
                        California and Texas combined!
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {[
                            { value: '70M+', label: 'Affected' },
                            { value: '80%', label: 'Immunity' },
                            { value: '95%', label: 'Serotonin' },
                        ].map((s, i) => (
                            <div key={i} style={{
                                background: '#f9f9f9',
                                border: '1px solid #e8e8e8',
                                borderRadius: 8,
                                padding: 16,
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722F37' }}>{s.value}</div>
                                <div style={{ fontSize: 12, color: '#888' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            title: 'Your Second Brain',
            content: (
                <>
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: '#444', marginBottom: 16 }}>
                        Your gut contains <strong>500 million neurons</strong>—more than your spinal cord!
                        It produces 95% of your serotonin and houses 80% of your immune system.
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 20,
                        borderRadius: 12,
                    }}>
                        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                            💡 <strong>Key Insight:</strong> When you heal the gut, you heal mood, energy,
                            immunity, and mental clarity.
                        </p>
                    </div>
                </>
            ),
        },
        {
            title: 'The Practitioner Opportunity',
            content: (
                <>
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: '#444', marginBottom: 16 }}>
                        Certified practitioners earn <strong style={{ color: '#722F37' }}>$5K-$15K/month</strong> working
                        from home with flexible hours.
                    </p>
                    <ul style={{ fontSize: 16, lineHeight: 2, color: '#444', paddingLeft: 20 }}>
                        <li>No medical degree required</li>
                        <li>$100-200 per session</li>
                        <li>$500-2,500 per program</li>
                        <li>Work from anywhere</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Your Journey Ahead',
            content: (
                <>
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: '#444', marginBottom: 16 }}>
                        In this mini-diploma, you'll learn the foundations of gut health and practical
                        strategies you can apply immediately.
                    </p>
                    <div style={{
                        background: '#fdfbf7',
                        padding: 20,
                        borderRadius: 12,
                        borderLeft: '4px solid #722F37',
                    }}>
                        <p style={{ margin: 0, fontSize: 15, color: '#722F37', fontStyle: 'italic' }}>
                            "By investing in this knowledge, you're preparing to change countless lives." — Sarah
                        </p>
                    </div>
                </>
            ),
        },
    ];

    const markComplete = (index: number) => {
        if (!completedSteps.includes(index)) {
            setCompletedSteps([...completedSteps, index]);
        }
        if (index < steps.length - 1) {
            setCurrentStep(index + 1);
        }
    };

    const progress = (completedSteps.length / steps.length) * 100;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8f8f8',
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#2d2d2d',
        }}>
            {/* Header */}
            <header style={{
                background: '#fff',
                borderBottom: '1px solid #e5e5e5',
                padding: '16px 24px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <img src="/newlogo.webp" alt="AccrediPro" style={{ height: 36 }} />

                <div style={{ flex: 1, maxWidth: 400, margin: '0 24px' }}>
                    <div style={{
                        height: 8,
                        background: '#f0f0f0',
                        borderRadius: 4,
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #722F37, #8B4049)',
                            borderRadius: 4,
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4, textAlign: 'center' }}>
                        {completedSteps.length} of {steps.length} steps completed
                    </div>
                </div>

                <Link href="/gut-health-mini-diploma/style-4" style={{
                    padding: '10px 20px',
                    background: '#722F37',
                    color: 'white',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                }}>
                    Try Style 4 →
                </Link>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>

                {/* Lesson Title */}
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-block',
                        background: '#fff',
                        color: '#722F37',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600,
                        border: '1px solid #e8e8e8',
                    }}>
                        MODULE 1 • LESSON 1
                    </span>
                    <h1 style={{ fontSize: 32, marginTop: 16, color: '#1a1a1a' }}>
                        Welcome to Your Gut Health Journey
                    </h1>
                </div>

                {/* Steps */}
                {steps.map((step, i) => (
                    <div
                        key={i}
                        style={{
                            background: '#fff',
                            borderRadius: 16,
                            padding: 24,
                            marginBottom: 16,
                            border: currentStep === i ? '2px solid #722F37' : '1px solid #e8e8e8',
                            boxShadow: currentStep === i ? '0 4px 20px rgba(114, 47, 55, 0.1)' : 'none',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: completedSteps.includes(i) ? '#722F37' : '#f0f0f0',
                                color: completedSteps.includes(i) ? 'white' : '#888',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                                fontWeight: 'bold',
                            }}>
                                {completedSteps.includes(i) ? '✓' : i + 1}
                            </div>
                            <h3 style={{ margin: 0, fontSize: 18, color: '#1a1a1a' }}>{step.title}</h3>
                        </div>

                        {(currentStep === i || completedSteps.includes(i)) && (
                            <>
                                {step.content}
                                {!completedSteps.includes(i) && (
                                    <button
                                        onClick={() => markComplete(i)}
                                        style={{
                                            marginTop: 20,
                                            padding: '12px 24px',
                                            background: '#722F37',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            fontSize: 15,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Mark Complete & Continue →
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ))}

                {/* Complete Lesson */}
                {completedSteps.length === steps.length && (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                        <h2 style={{ marginBottom: 16 }}>Lesson Complete!</h2>
                        <Link href="/gut-health-mini-diploma/style-4" style={{
                            display: 'inline-block',
                            padding: '16px 40px',
                            background: '#722F37',
                            color: 'white',
                            borderRadius: 8,
                            textDecoration: 'none',
                            fontSize: 17,
                            fontWeight: 600,
                        }}>
                            Continue to Style 4 →
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
