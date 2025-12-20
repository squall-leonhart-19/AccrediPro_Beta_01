'use client';

import { useState } from 'react';
import Link from 'next/link';

// STYLE 2: Full-Screen Slides with Smooth Transitions
// Netflix-style immersive experience with horizontal navigation

export default function Style2Page() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 0,
            bg: 'linear-gradient(135deg, #722F37 0%, #4a1f24 100%)',
            emoji: '👋',
            title: 'Welcome, Future Healer',
            content: "I'm Sarah, and I've helped over 500 practitioners transform their careers through gut health coaching. Your journey starts RIGHT NOW.",
            button: 'Meet Your Coach',
        },
        {
            id: 1,
            bg: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
            emoji: '🌍',
            title: '70 Million People Need You',
            content: "That's how many Americans suffer from digestive issues. They're searching for answers—and you're about to become the solution.",
            stats: [
                { label: 'Affected Americans', value: '70M+' },
                { label: 'Market Growth', value: '12%/yr' },
            ],
            button: 'See the Opportunity',
        },
        {
            id: 2,
            bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
            emoji: '🧠',
            title: 'Your Gut is Your Second Brain',
            content: '95% of serotonin is made in your gut. 80% of your immune system lives there. When you heal the gut, you heal EVERYTHING.',
            highlights: ['95% Serotonin', '80% Immunity', '500M Neurons'],
            button: 'Understand the Science',
        },
        {
            id: 3,
            bg: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            emoji: '💰',
            title: '$5K - $15K Monthly',
            content: "That's what our certified practitioners earn working from home, choosing their own hours, doing work they LOVE.",
            stats: [
                { label: 'Per Session', value: '$100-200' },
                { label: 'Per Program', value: '$500-2.5K' },
            ],
            button: 'Start Earning',
        },
        {
            id: 4,
            bg: 'linear-gradient(135deg, #722F37 0%, #0f3460 100%)',
            emoji: '🚀',
            title: 'Your Transformation Begins',
            content: "Complete this mini-diploma and you'll have the foundation to start helping real clients. Let's make it happen.",
            button: 'Begin Lesson 2 →',
        },
    ];

    const slide = slides[currentSlide];

    return (
        <div style={{
            minHeight: '100vh',
            background: slide.bg,
            transition: 'background 0.8s ease-in-out',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Top Bar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 32px',
            }}>
                <img src="/newlogo.webp" alt="AccrediPro" style={{ height: 40 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ opacity: 0.7 }}>{currentSlide + 1} / {slides.length}</span>
                    <Link href="/gut-health-mini-diploma/style-3" style={{
                        padding: '10px 20px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: 14,
                    }}>
                        Try Style 3 →
                    </Link>
                </div>
            </nav>

            {/* Main Slide Content */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 24px',
                maxWidth: 800,
                margin: '0 auto',
            }}>
                <div style={{
                    fontSize: 80,
                    marginBottom: 24,
                    animation: 'bounce 1s ease-in-out',
                }}>
                    {slide.emoji}
                </div>

                <h1 style={{
                    fontSize: 'clamp(32px, 6vw, 56px)',
                    fontWeight: 'bold',
                    marginBottom: 24,
                    lineHeight: 1.1,
                }}>
                    {slide.title}
                </h1>

                <p style={{
                    fontSize: 'clamp(18px, 3vw, 24px)',
                    opacity: 0.9,
                    marginBottom: 32,
                    lineHeight: 1.6,
                }}>
                    {slide.content}
                </p>

                {/* Stats Grid */}
                {slide.stats && (
                    <div style={{
                        display: 'flex',
                        gap: 32,
                        marginBottom: 32,
                    }}>
                        {slide.stats.map((stat, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                padding: '20px 32px',
                                borderRadius: 16,
                            }}>
                                <div style={{ fontSize: 36, fontWeight: 'bold' }}>{stat.value}</div>
                                <div style={{ opacity: 0.8, fontSize: 14 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Highlights */}
                {slide.highlights && (
                    <div style={{
                        display: 'flex',
                        gap: 16,
                        marginBottom: 32,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}>
                        {slide.highlights.map((h, i) => (
                            <div key={i} style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '12px 24px',
                                borderRadius: 50,
                                fontSize: 18,
                                fontWeight: 'bold',
                            }}>
                                {h}
                            </div>
                        ))}
                    </div>
                )}

                {/* Navigation Button */}
                <button
                    onClick={() => setCurrentSlide(Math.min(currentSlide + 1, slides.length - 1))}
                    disabled={currentSlide === slides.length - 1}
                    style={{
                        padding: '18px 48px',
                        fontSize: 18,
                        fontWeight: 'bold',
                        background: 'white',
                        color: '#722F37',
                        border: 'none',
                        borderRadius: 50,
                        cursor: 'pointer',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s',
                        opacity: currentSlide === slides.length - 1 ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {slide.button}
                </button>
            </main>

            {/* Bottom Navigation Dots */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                padding: 32,
            }}>
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        style={{
                            width: currentSlide === i ? 40 : 12,
                            height: 12,
                            borderRadius: 6,
                            border: 'none',
                            background: currentSlide === i ? 'white' : 'rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                    />
                ))}
            </div>

            {/* Keyboard Hint */}
            <div style={{
                position: 'fixed',
                bottom: 20,
                left: 20,
                background: 'rgba(0,0,0,0.3)',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                opacity: 0.7,
            }}>
                ← → or click dots to navigate
            </div>

            {/* Side Arrows */}
            {currentSlide > 0 && (
                <button
                    onClick={() => setCurrentSlide(currentSlide - 1)}
                    style={{
                        position: 'fixed',
                        left: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        background: 'rgba(0,0,0,0.2)',
                        color: 'white',
                        fontSize: 24,
                        cursor: 'pointer',
                    }}
                >
                    ←
                </button>
            )}
            {currentSlide < slides.length - 1 && (
                <button
                    onClick={() => setCurrentSlide(currentSlide + 1)}
                    style={{
                        position: 'fixed',
                        right: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        background: 'rgba(0,0,0,0.2)',
                        color: 'white',
                        fontSize: 24,
                        cursor: 'pointer',
                    }}
                >
                    →
                </button>
            )}
        </div>
    );
}
