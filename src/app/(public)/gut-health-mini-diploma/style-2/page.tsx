'use client';

import { useState } from 'react';
import Link from 'next/link';

// STYLE 2: Clean White with Tabs Navigation
// Professional tabs interface with smooth transitions

export default function Style2Page() {
    const [activeTab, setActiveTab] = useState(0);
    const [visitedTabs, setVisitedTabs] = useState<number[]>([0]);

    const tabs = [
        { title: 'Welcome', icon: '👋' },
        { title: 'The Problem', icon: '🎯' },
        { title: 'The Science', icon: '🧬' },
        { title: 'Your Opportunity', icon: '💰' },
    ];

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        if (!visitedTabs.includes(index)) {
            setVisitedTabs([...visitedTabs, index]);
        }
    };

    const progress = (visitedTabs.length / tabs.length) * 100;

    const tabContents = [
        // Welcome
        (
            <div key="0">
                <h2 style={{ fontSize: 28, marginBottom: 20, color: '#1a1a1a' }}>
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
                            <strong style={{ color: '#722F37' }}>Hey there, beautiful! 👋</strong> I'm Sarah,
                            and I'm SO excited you're here. You've made an amazing decision to start this journey.
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
                <h2 style={{ fontSize: 28, marginBottom: 20, color: '#1a1a1a' }}>
                    The Gut Health Crisis
                </h2>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444', marginBottom: 24 }}>
                    Here's the reality that most people don't know about:
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    marginBottom: 24,
                }}>
                    {[
                        { value: '70M+', label: 'Americans with gut issues', desc: 'More than CA + TX combined' },
                        { value: '80%', label: 'Immune system in gut', desc: 'Your body\'s first defense' },
                        { value: '95%', label: 'Serotonin production', desc: 'The happiness hormone' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            background: '#f9f9f9',
                            border: '1px solid #e8e8e8',
                            borderRadius: 12,
                            padding: 20,
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#722F37' }}>{stat.value}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>{stat.label}</div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{stat.desc}</div>
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444' }}>
                    Many people have been told their symptoms are "normal" or "all in their head."
                    They've been dismissed and left feeling hopeless. <strong style={{ color: '#722F37' }}>
                        This is exactly why there's such a tremendous need for educated practitioners.</strong>
                </p>
            </div>
        ),
        // The Science
        (
            <div key="2">
                <h2 style={{ fontSize: 28, marginBottom: 20, color: '#1a1a1a' }}>
                    Your Gut: The "Second Brain"
                </h2>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444', marginBottom: 24 }}>
                    Scientists call the gut the "second brain" for good reason. Your gut contains
                    <strong> over 500 million neurons</strong>—more than your spinal cord—and has its own
                    nervous system that can function independently.
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
                        When your microbiome is balanced, you experience: boundless energy, stable mood,
                        strong immunity, and clear skin. When it's imbalanced, everything suffers.
                    </p>
                </div>
                <ul style={{ fontSize: 17, lineHeight: 2, color: '#444', paddingLeft: 20 }}>
                    <li>Bloating, gas, constipation, or diarrhea</li>
                    <li>Brain fog, anxiety, and mood swings</li>
                    <li>Skin issues like acne, eczema, rosacea</li>
                    <li>Fatigue that sleep doesn't fix</li>
                    <li>Autoimmune conditions and inflammation</li>
                </ul>
            </div>
        ),
        // Your Opportunity
        (
            <div key="3">
                <h2 style={{ fontSize: 28, marginBottom: 20, color: '#1a1a1a' }}>
                    The Practitioner Opportunity
                </h2>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444', marginBottom: 24 }}>
                    You don't need a medical degree to make a profound difference. What you DO need is
                    the right training—and that's exactly what this certification provides.
                </p>
                <div style={{
                    background: 'linear-gradient(135deg, #fdfbf7 0%, #fff 100%)',
                    border: '2px solid #722F37',
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 24,
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: 42, fontWeight: 'bold', color: '#722F37' }}>$5K - $15K</div>
                    <div style={{ fontSize: 18, color: '#666', marginTop: 8 }}>Monthly Earning Potential</div>
                    <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>
                        Working from home with flexible hours
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                        { label: 'Per Session', value: '$100-200' },
                        { label: 'Per Program', value: '$500-2,500' },
                        { label: 'Clients/Month', value: '5-15' },
                        { label: 'Work Hours', value: 'Flexible' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: '#f9f9f9',
                            padding: 16,
                            borderRadius: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <span style={{ color: '#666' }}>{item.label}</span>
                            <strong style={{ color: '#722F37' }}>{item.value}</strong>
                        </div>
                    ))}
                </div>
            </div>
        ),
    ];

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
                        {visitedTabs.length} of {tabs.length} sections viewed
                    </div>
                </div>

                <Link href="/gut-health-mini-diploma/style-3" style={{
                    padding: '10px 20px',
                    background: '#722F37',
                    color: 'white',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                }}>
                    Try Style 3 →
                </Link>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

                {/* Lesson Title */}
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-block',
                        background: '#f8f4f0',
                        color: '#722F37',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600,
                    }}>
                        MODULE 1 • LESSON 1
                    </span>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: 8,
                    marginBottom: 32,
                    borderBottom: '2px solid #f0f0f0',
                    paddingBottom: 0,
                }}>
                    {tabs.map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => handleTabChange(i)}
                            style={{
                                flex: 1,
                                padding: '16px 12px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === i ? '3px solid #722F37' : '3px solid transparent',
                                cursor: 'pointer',
                                fontSize: 15,
                                fontWeight: activeTab === i ? 600 : 400,
                                color: activeTab === i ? '#722F37' : '#888',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <span style={{ fontSize: 24 }}>{tab.icon}</span>
                            <span>{tab.title}</span>
                            {visitedTabs.includes(i) && i !== activeTab && (
                                <span style={{ color: '#4ade80', fontSize: 12 }}>✓</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{
                    background: '#fff',
                    minHeight: 400,
                }}>
                    {tabContents[activeTab]}
                </div>

                {/* Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 40,
                    paddingTop: 24,
                    borderTop: '1px solid #e8e8e8',
                }}>
                    <button
                        onClick={() => activeTab > 0 && handleTabChange(activeTab - 1)}
                        disabled={activeTab === 0}
                        style={{
                            padding: '12px 24px',
                            background: activeTab === 0 ? '#f0f0f0' : '#fff',
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            cursor: activeTab === 0 ? 'default' : 'pointer',
                            color: activeTab === 0 ? '#aaa' : '#333',
                        }}
                    >
                        ← Previous
                    </button>

                    {activeTab < tabs.length - 1 ? (
                        <button
                            onClick={() => handleTabChange(activeTab + 1)}
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
                            Next →
                        </button>
                    ) : (
                        <Link href="/gut-health-mini-diploma/style-3" style={{
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
    );
}
