'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// STYLE 1: Interactive Cards with Reveals + Video Player Simulation
// Modern, gamified learning experience with progress animations

export default function Style1Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [revealedCards, setRevealedCards] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    const sections = [
        { id: 0, title: 'Welcome', icon: '👋' },
        { id: 1, title: 'Why It Matters', icon: '🎯' },
        { id: 2, title: 'The Science', icon: '🧬' },
        { id: 3, title: 'Your Opportunity', icon: '💰' },
        { id: 4, title: 'Take Action', icon: '🚀' },
    ];

    const cards = [
        { stat: '70M+', label: 'Americans with gut issues', color: '#722F37' },
        { stat: '80%', label: 'Immune system in gut', color: '#8B4049' },
        { stat: '95%', label: 'Serotonin made in gut', color: '#A05060' },
        { stat: '$15K', label: 'Monthly earning potential', color: '#B86070' },
    ];

    useEffect(() => {
        if (isPlaying && progress < 100) {
            const timer = setInterval(() => {
                setProgress(p => Math.min(p + 1, 100));
            }, 50);
            return () => clearInterval(timer);
        }
    }, [isPlaying, progress]);

    const toggleCard = (index: number) => {
        if (revealedCards.includes(index)) return;
        setRevealedCards([...revealedCards, index]);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
            {/* Top Navigation */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <img src="/newlogo.webp" alt="AccrediPro" style={{ height: 36 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                    {sections.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => setCurrentSection(i)}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: 'none',
                                background: currentSection === i ? '#722F37' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontSize: 18,
                            }}
                        >
                            {s.icon}
                        </button>
                    ))}
                </div>
                <Link href="/dashboard" style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: 14,
                }}>
                    Save Progress
                </Link>
            </nav>

            {/* Main Content */}
            <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>

                {/* Video Section */}
                <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: 20,
                    overflow: 'hidden',
                    marginBottom: 40,
                }}>
                    <div style={{
                        aspectRatio: '16/9',
                        background: 'linear-gradient(135deg, #722F37, #0f3460)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}>
                        {!isPlaying ? (
                            <>
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: 'white',
                                        color: '#722F37',
                                        fontSize: 32,
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    ▶
                                </button>
                                <p style={{ marginTop: 20, opacity: 0.9, fontSize: 18 }}>
                                    Watch: Welcome to Your Gut Health Journey
                                </p>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 64, marginBottom: 16 }}>👩‍🏫</div>
                                <p style={{ fontSize: 24, marginBottom: 8 }}>Sarah is speaking...</p>
                                <p style={{ opacity: 0.8 }}>"Welcome to your certification journey!"</p>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{
                            height: 6,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: 3,
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #722F37, #D4AF37)',
                                borderRadius: 3,
                                transition: 'width 0.1s',
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                            <span>{Math.floor(progress * 0.1)}:00</span>
                            <span>10:00</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Stats Cards */}
                <h2 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>
                    🔓 Tap to Reveal Key Statistics
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 16,
                    marginBottom: 40,
                }}>
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => toggleCard(i)}
                            style={{
                                background: revealedCards.includes(i) ? card.color : 'rgba(255,255,255,0.1)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                borderRadius: 16,
                                padding: 24,
                                textAlign: 'center',
                                cursor: revealedCards.includes(i) ? 'default' : 'pointer',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: revealedCards.includes(i) ? 'rotateY(0)' : 'rotateY(0)',
                            }}
                        >
                            {revealedCards.includes(i) ? (
                                <>
                                    <div style={{ fontSize: 42, fontWeight: 'bold', marginBottom: 8 }}>{card.stat}</div>
                                    <div style={{ opacity: 0.9 }}>{card.label}</div>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: 42, marginBottom: 8 }}>❓</div>
                                    <div style={{ opacity: 0.7 }}>Tap to reveal</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress Counter */}
                <div style={{
                    textAlign: 'center',
                    padding: 24,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 16,
                    marginBottom: 40,
                }}>
                    <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>CARDS REVEALED</div>
                    <div style={{ fontSize: 48, fontWeight: 'bold', color: '#D4AF37' }}>
                        {revealedCards.length} / {cards.length}
                    </div>
                    {revealedCards.length === cards.length && (
                        <p style={{ marginTop: 16, color: '#4ade80' }}>✅ All stats unlocked! Continue to quiz →</p>
                    )}
                </div>

                {/* Quick Quiz */}
                {revealedCards.length >= 2 && (
                    <div style={{
                        background: 'linear-gradient(135deg, #722F37, #8B4049)',
                        borderRadius: 20,
                        padding: 32,
                        textAlign: 'center',
                    }}>
                        <h3 style={{ fontSize: 24, marginBottom: 16 }}>🎯 Quick Check</h3>
                        <p style={{ marginBottom: 24, opacity: 0.9 }}>What percentage of your immune system is located in your gut?</p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['50%', '80%', '65%', '90%'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setShowQuiz(true)}
                                    style={{
                                        padding: '16px 32px',
                                        borderRadius: 12,
                                        border: '2px solid white',
                                        background: showQuiz && opt === '80%' ? '#4ade80' : 'transparent',
                                        color: 'white',
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {showQuiz && (
                            <p style={{ marginTop: 20, color: '#4ade80', fontSize: 18 }}>
                                ✅ Correct! 80% of your immune system lives in your gut!
                            </p>
                        )}
                    </div>
                )}

                {/* Continue Button */}
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <Link
                        href="/gut-health-mini-diploma/style-2"
                        style={{
                            display: 'inline-block',
                            padding: '20px 48px',
                            background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
                            color: '#1a1a2e',
                            borderRadius: 12,
                            fontSize: 18,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
                        }}
                    >
                        Continue to Style 2 →
                    </Link>
                </div>
            </main>
        </div>
    );
}
