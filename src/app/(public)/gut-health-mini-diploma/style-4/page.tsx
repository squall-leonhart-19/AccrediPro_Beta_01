'use client';

import { useState } from 'react';
import Link from 'next/link';

// STYLE 4: Clean White with Sidebar Navigation
// Two-column layout with sidebar progress and main content

export default function Style4Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);

    const sections = [
        { id: 0, title: 'Welcome', short: '👋 Welcome' },
        { id: 1, title: 'The Problem', short: '🎯 Crisis' },
        { id: 2, title: 'The Science', short: '🧬 Science' },
        { id: 3, title: 'Opportunity', short: '💰 Income' },
        { id: 4, title: 'Next Steps', short: '🚀 Action' },
    ];

    const goToSection = (index: number) => {
        if (!completedSections.includes(currentSection)) {
            setCompletedSections([...completedSections, currentSection]);
        }
        setCurrentSection(index);
    };

    const progress = ((completedSections.length + 1) / sections.length) * 100;

    const sectionContents = [
        // Welcome
        (
            <div key="0">
                <h2 style={{ fontSize: 28, marginBottom: 24, color: '#1a1a1a' }}>
                    Welcome to Your Gut Health Journey
                </h2>
                <div style={{
                    display: 'flex',
                    gap: 16,
                    padding: 24,
                    background: '#fdfbf7',
                    borderLeft: '4px solid #722F37',
                    borderRadius: '0 12px 12px 0',
                    marginBottom: 24,
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
                        <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                            <strong style={{ color: '#722F37' }}>Hey there, beautiful! 👋</strong> I'm Sarah, and I'm
                            SO excited you're here. You've made an incredible decision to start this journey!
                        </p>
                    </div>
                </div>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444' }}>
                    Whether you're looking to help others, start a new career, or deepen your own understanding
                    of gut health—you're in exactly the right place. I've helped hundreds of practitioners
                    build thriving practices, and I can't wait to help you too.
                </p>
            </div>
        ),
        // The Problem
        (
            <div key="1">
                <h2 style={{ fontSize: 28, marginBottom: 24, color: '#1a1a1a' }}>
                    The Gut Health Crisis
                </h2>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444', marginBottom: 24 }}>
                    <strong>Over 70 million Americans</strong> suffer from digestive issues. That's more than
                    the population of California and Texas combined.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    marginBottom: 24,
                }}>
                    {[
                        { value: '70M+', label: 'Affected', color: '#722F37' },
                        { value: '80%', label: 'Immunity in Gut', color: '#8B4049' },
                        { value: '95%', label: 'Serotonin Made', color: '#A05060' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            background: '#f9f9f9',
                            border: '1px solid #e8e8e8',
                            borderRadius: 12,
                            padding: 24,
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444' }}>
                    Many have been told their symptoms are "normal" or "all in their head." This is exactly
                    why there's such a tremendous need for educated practitioners.
                </p>
            </div>
        ),
        // The Science
        (
            <div key="2">
                <h2 style={{ fontSize: 28, marginBottom: 24, color: '#1a1a1a' }}>
                    Your Gut: The "Second Brain"
                </h2>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444', marginBottom: 24 }}>
                    Your gut contains <strong>over 500 million neurons</strong>—more than your spinal cord.
                    It produces 95% of your serotonin and houses 80% of your immune system.
                </p>
                <div style={{
                    background: '#722F37',
                    color: 'white',
                    padding: 24,
                    borderRadius: 12,
                    marginBottom: 24,
                }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 18 }}>💡 Key Insight</h3>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, opacity: 0.95 }}>
                        When your microbiome is balanced, you experience boundless energy, stable mood, strong
                        immunity, and clear skin. When it's imbalanced, everything suffers.
                    </p>
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>Signs of Gut Imbalance:</h3>
                <ul style={{ fontSize: 16, lineHeight: 2, color: '#444', paddingLeft: 20 }}>
                    <li>Bloating, gas, constipation, or diarrhea</li>
                    <li>Brain fog, anxiety, and mood swings</li>
                    <li>Skin issues like acne, eczema, rosacea</li>
                    <li>Fatigue that sleep doesn't fix</li>
                </ul>
            </div>
        ),
        // Opportunity
        (
            <div key="3">
                <h2 style={{ fontSize: 28, marginBottom: 24, color: '#1a1a1a' }}>
                    The Practitioner Opportunity
                </h2>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444', marginBottom: 24 }}>
                    You don't need a medical degree to make a profound difference in people's health.
                </p>
                <div style={{
                    background: 'linear-gradient(135deg, #fdfbf7 0%, #fff 100%)',
                    border: '2px solid #722F37',
                    borderRadius: 16,
                    padding: 32,
                    textAlign: 'center',
                    marginBottom: 24,
                }}>
                    <div style={{ fontSize: 48, fontWeight: 'bold', color: '#722F37' }}>$5K - $15K</div>
                    <div style={{ fontSize: 18, color: '#666', marginTop: 8 }}>Monthly Earning Potential</div>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                }}>
                    {[
                        { label: 'Per Session', value: '$100-200' },
                        { label: 'Per Program', value: '$500-2,500' },
                        { label: 'Clients Needed', value: '5-15/mo' },
                        { label: 'Work Location', value: 'Anywhere' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: '#f9f9f9',
                            padding: 20,
                            borderRadius: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <span style={{ color: '#666' }}>{item.label}</span>
                            <strong style={{ color: '#722F37' }}>{item.value}</strong>
                        </div>
                    ))}
                </div>
            </div>
        ),
        // Next Steps
        (
            <div key="4">
                <h2 style={{ fontSize: 28, marginBottom: 24, color: '#1a1a1a' }}>
                    Your Journey Ahead
                </h2>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444', marginBottom: 24 }}>
                    In this mini-diploma, you'll learn:
                </p>
                <div style={{ marginBottom: 24 }}>
                    {[
                        'The foundations of gut health science',
                        'Core healing principles and protocols',
                        'Practical strategies for client success',
                        'How to build a thriving practice',
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 0',
                            borderBottom: '1px solid #f0f0f0',
                        }}>
                            <span style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: '#722F37',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                            }}>✓</span>
                            <span style={{ fontSize: 16 }}>{item}</span>
                        </div>
                    ))}
                </div>
                <div style={{
                    background: '#fdfbf7',
                    padding: 24,
                    borderRadius: 12,
                    borderLeft: '4px solid #722F37',
                }}>
                    <p style={{ margin: 0, fontSize: 16, color: '#722F37', fontStyle: 'italic' }}>
                        "By investing in this knowledge, you're not just changing your own life—you're
                        preparing to change countless others." — Sarah
                    </p>
                </div>
            </div>
        ),
    ];

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

                <div style={{ fontSize: 14, color: '#888' }}>
                    MODULE 1 • LESSON 1
                </div>

                <Link href="/gut-health-mini-diploma/style-5" style={{
                    padding: '10px 20px',
                    background: '#722F37',
                    color: 'white',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                }}>
                    Try Style 5 →
                </Link>
            </header>

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 69px)' }}>
                {/* Sidebar */}
                <aside style={{
                    width: 280,
                    background: '#fff',
                    borderRight: '1px solid #e5e5e5',
                    padding: 24,
                    flexShrink: 0,
                }}>
                    <h3 style={{ fontSize: 14, color: '#888', marginBottom: 16, textTransform: 'uppercase' }}>
                        Lesson Progress
                    </h3>

                    {/* Progress Circle */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: `conic-gradient(#722F37 ${progress}%, #f0f0f0 0)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                        }}>
                            <div style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#722F37',
                            }}>
                                {Math.round(progress)}%
                            </div>
                        </div>
                    </div>

                    {/* Section List */}
                    {sections.map((section, i) => (
                        <button
                            key={section.id}
                            onClick={() => goToSection(i)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 16px',
                                marginBottom: 8,
                                background: currentSection === i ? '#f8f4f0' : 'transparent',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <span style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: completedSections.includes(i) ? '#722F37' : currentSection === i ? '#722F37' : '#e8e8e8',
                                color: (completedSections.includes(i) || currentSection === i) ? 'white' : '#888',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                            }}>
                                {completedSections.includes(i) ? '✓' : i + 1}
                            </span>
                            <span style={{
                                fontSize: 14,
                                color: currentSection === i ? '#722F37' : '#444',
                                fontWeight: currentSection === i ? 600 : 400,
                            }}>
                                {section.title}
                            </span>
                        </button>
                    ))}
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: 48, background: '#fff', margin: 24, borderRadius: 16 }}>
                    {sectionContents[currentSection]}

                    {/* Navigation */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 48,
                        paddingTop: 24,
                        borderTop: '1px solid #e8e8e8',
                    }}>
                        <button
                            onClick={() => currentSection > 0 && goToSection(currentSection - 1)}
                            disabled={currentSection === 0}
                            style={{
                                padding: '12px 24px',
                                background: currentSection === 0 ? '#f0f0f0' : '#fff',
                                border: '1px solid #ddd',
                                borderRadius: 8,
                                cursor: currentSection === 0 ? 'default' : 'pointer',
                                color: currentSection === 0 ? '#aaa' : '#333',
                            }}
                        >
                            ← Previous
                        </button>

                        {currentSection < sections.length - 1 ? (
                            <button
                                onClick={() => goToSection(currentSection + 1)}
                                style={{
                                    padding: '12px 32px',
                                    background: '#722F37',
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: 600,
                                }}
                            >
                                Next Section →
                            </button>
                        ) : (
                            <Link href="/gut-health-mini-diploma/style-5" style={{
                                padding: '12px 32px',
                                background: '#722F37',
                                borderRadius: 8,
                                color: 'white',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}>
                                Complete Lesson →
                            </Link>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
