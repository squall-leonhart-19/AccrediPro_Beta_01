'use client';

import { useState } from 'react';
import Link from 'next/link';

// STYLE 1: Clean Classic White with Progress + Interactive Elements
// Professional, readable, with subtle interactivity

export default function Style1Page() {
    const [expandedSections, setExpandedSections] = useState<number[]>([]);
    const [completedSections, setCompletedSections] = useState<number[]>([]);

    const toggleSection = (id: number) => {
        if (expandedSections.includes(id)) {
            setExpandedSections(expandedSections.filter(s => s !== id));
        } else {
            setExpandedSections([...expandedSections, id]);
            if (!completedSections.includes(id)) {
                setCompletedSections([...completedSections, id]);
            }
        }
    };

    const totalSections = 4;
    const progress = (completedSections.length / totalSections) * 100;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
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
                        Lesson 1 • {completedSections.length} of {totalSections} sections completed
                    </div>
                </div>

                <Link href="/gut-health-mini-diploma/style-2" style={{
                    padding: '10px 20px',
                    background: '#722F37',
                    color: 'white',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                }}>
                    Try Style 2 →
                </Link>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

                {/* Lesson Title */}
                <div style={{ marginBottom: 40 }}>
                    <span style={{
                        display: 'inline-block',
                        background: '#f8f4f0',
                        color: '#722F37',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 16,
                    }}>
                        MODULE 1 • LESSON 1
                    </span>
                    <h1 style={{ fontSize: 36, lineHeight: 1.3, marginBottom: 16, color: '#1a1a1a' }}>
                        Welcome to Your Gut Health Journey
                    </h1>
                    <p style={{ fontSize: 18, color: '#666', lineHeight: 1.6 }}>
                        Your path to becoming a certified Gut Health practitioner starts right here.
                    </p>
                </div>

                {/* Coach Welcome */}
                <div style={{
                    display: 'flex',
                    gap: 16,
                    padding: 24,
                    background: '#fdfbf7',
                    borderLeft: '4px solid #722F37',
                    borderRadius: '0 12px 12px 0',
                    marginBottom: 40,
                }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #722F37, #8B4049)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 24,
                        flexShrink: 0,
                    }}>S</div>
                    <div>
                        <p style={{ fontSize: 16, lineHeight: 1.7 }}>
                            <strong style={{ color: '#722F37' }}>Hey there! 👋</strong> I'm Sarah, and I'm SO excited you're here.
                            Whether you're looking to help others, start a new career, or deepen your own understanding
                            of gut health—you've made an amazing decision.
                        </p>
                    </div>
                </div>

                {/* Section 1 */}
                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, marginBottom: 16, color: '#1a1a1a' }}>
                        Why You're Here Matters
                    </h2>
                    <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
                        The fact that you're here says something beautiful about you. It tells me you care.
                        You care about your own health, about helping others, and about making a real difference in this world.
                    </p>
                    <p style={{ fontSize: 17, lineHeight: 1.8 }}>
                        Maybe you've struggled with digestive issues yourself and finally found answers. Maybe you've
                        watched someone you love suffer and wished you could help. Whatever brought you here—
                        <strong style={{ color: '#722F37' }}>you're in exactly the right place.</strong>
                    </p>
                </section>

                {/* Interactive Expandable - Section 2 */}
                <div
                    onClick={() => toggleSection(1)}
                    style={{
                        background: '#f9f9f9',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 16,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: completedSections.includes(1) ? '#722F37' : '#ddd',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                            }}>
                                {completedSections.includes(1) ? '✓' : '1'}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: 17 }}>The Gut Health Crisis</span>
                        </div>
                        <span style={{ fontSize: 20, color: '#888' }}>
                            {expandedSections.includes(1) ? '−' : '+'}
                        </span>
                    </div>

                    {expandedSections.includes(1) && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8e8e8' }}>
                            <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 12 }}>
                                <strong>Over 70 million Americans</strong> suffer from digestive issues. That's more than
                                California and Texas combined. Many have been told their symptoms are "normal" or "just stress."
                            </p>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 12,
                                marginTop: 16,
                            }}>
                                {[
                                    { value: '70M+', label: 'Affected' },
                                    { value: '80%', label: 'Immunity in Gut' },
                                    { value: '95%', label: 'Serotonin Made' },
                                ].map((stat) => (
                                    <div key={stat.label} style={{
                                        background: '#fff',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: 8,
                                        padding: 16,
                                        textAlign: 'center',
                                    }}>
                                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722F37' }}>{stat.value}</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Interactive Expandable - Section 3 */}
                <div
                    onClick={() => toggleSection(2)}
                    style={{
                        background: '#f9f9f9',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 16,
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: completedSections.includes(2) ? '#722F37' : '#ddd',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                            }}>
                                {completedSections.includes(2) ? '✓' : '2'}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: 17 }}>Your "Second Brain"</span>
                        </div>
                        <span style={{ fontSize: 20, color: '#888' }}>
                            {expandedSections.includes(2) ? '−' : '+'}
                        </span>
                    </div>

                    {expandedSections.includes(2) && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8e8e8' }}>
                            <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 12 }}>
                                Your gut contains <strong>500 million neurons</strong>—more than your spinal cord!
                                It produces 95% of your serotonin and houses 80% of your immune system.
                            </p>
                            <div style={{
                                background: '#722F37',
                                color: 'white',
                                padding: 20,
                                borderRadius: 8,
                                marginTop: 12,
                            }}>
                                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
                                    💡 <strong>Key Insight:</strong> When you heal the gut, you're also healing mood,
                                    energy, immunity, and mental clarity.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Interactive Expandable - Section 4 */}
                <div
                    onClick={() => toggleSection(3)}
                    style={{
                        background: '#f9f9f9',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 16,
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: completedSections.includes(3) ? '#722F37' : '#ddd',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                            }}>
                                {completedSections.includes(3) ? '✓' : '3'}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: 17 }}>The Practitioner Opportunity</span>
                        </div>
                        <span style={{ fontSize: 20, color: '#888' }}>
                            {expandedSections.includes(3) ? '−' : '+'}
                        </span>
                    </div>

                    {expandedSections.includes(3) && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8e8e8' }}>
                            <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 12 }}>
                                Certified gut health practitioners earn <strong>$5K-$15K/month</strong> working from home,
                                with flexible hours, doing work they love.
                            </p>
                            <ul style={{ margin: '16px 0', paddingLeft: 20, fontSize: 16, lineHeight: 2 }}>
                                <li>No medical degree required</li>
                                <li>$100-200 per session</li>
                                <li>$500-2,500 per program</li>
                                <li>Work from anywhere</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Interactive Expandable - Section 5 */}
                <div
                    onClick={() => toggleSection(4)}
                    style={{
                        background: '#f9f9f9',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 40,
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: completedSections.includes(4) ? '#722F37' : '#ddd',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                            }}>
                                {completedSections.includes(4) ? '✓' : '4'}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: 17 }}>Your Journey Ahead</span>
                        </div>
                        <span style={{ fontSize: 20, color: '#888' }}>
                            {expandedSections.includes(4) ? '−' : '+'}
                        </span>
                    </div>

                    {expandedSections.includes(4) && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8e8e8' }}>
                            <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 12 }}>
                                In this mini-diploma, you'll learn the foundations of gut health, core healing principles,
                                and practical strategies you can apply immediately.
                            </p>
                            <div style={{
                                background: '#fdfbf7',
                                padding: 16,
                                borderRadius: 8,
                                marginTop: 12,
                            }}>
                                <p style={{ margin: 0, fontSize: 15, color: '#722F37', fontStyle: 'italic' }}>
                                    "By investing in this knowledge, you're not just changing your own life—you're preparing
                                    to change countless others." — Sarah
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Continue Button */}
                <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
                    {completedSections.length >= 3 ? (
                        <Link href="/gut-health-mini-diploma/style-2" style={{
                            display: 'inline-block',
                            padding: '16px 40px',
                            background: '#722F37',
                            color: 'white',
                            borderRadius: 8,
                            textDecoration: 'none',
                            fontSize: 17,
                            fontWeight: 600,
                        }}>
                            Continue to Next Lesson →
                        </Link>
                    ) : (
                        <p style={{ color: '#888', fontSize: 15 }}>
                            👆 Complete at least 3 sections above to continue
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
