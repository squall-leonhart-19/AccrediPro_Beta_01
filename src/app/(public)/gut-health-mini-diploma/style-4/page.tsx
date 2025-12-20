'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// STYLE 4: Vertical Scroll Story (Instagram/TikTok Stories)
// Full-screen sections that snap on scroll, progress bars, auto-advance option

export default function Style4Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const sections = [
        {
            bg: 'linear-gradient(180deg, #722F37 0%, #4a1f24 100%)',
            content: (
                <>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>👋</div>
                    <h1 style={{ fontSize: 36, marginBottom: 16 }}>Hey, I'm Sarah</h1>
                    <p style={{ fontSize: 20, opacity: 0.9, maxWidth: 300, margin: '0 auto' }}>
                        Your gut health coach and guide on this journey
                    </p>
                </>
            ),
        },
        {
            bg: 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)',
            content: (
                <>
                    <div style={{ fontSize: 80, fontWeight: 'bold', color: '#D4AF37' }}>70M+</div>
                    <p style={{ fontSize: 24, marginTop: 16 }}>Americans suffer from<br />gut issues</p>
                    <div style={{
                        marginTop: 24,
                        padding: '12px 24px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 8,
                    }}>
                        More than CA + TX combined
                    </div>
                </>
            ),
        },
        {
            bg: 'linear-gradient(180deg, #134e5e 0%, #71b280 100%)',
            content: (
                <>
                    <div style={{ fontSize: 48, marginBottom: 20 }}>🧠</div>
                    <h2 style={{ fontSize: 28 }}>Your "Second Brain"</h2>
                    <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { value: '500M', label: 'Neurons' },
                            { value: '95%', label: 'Serotonin' },
                            { value: '80%', label: 'Immunity' },
                        ].map((s, i) => (
                            <div key={i} style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '16px 24px',
                                borderRadius: 12,
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 28, fontWeight: 'bold' }}>{s.value}</div>
                                <div style={{ fontSize: 14, opacity: 0.8 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            bg: 'linear-gradient(180deg, #D4AF37 0%, #B8860B 100%)',
            content: (
                <>
                    <div style={{ fontSize: 48, marginBottom: 20 }}>💰</div>
                    <h2 style={{ fontSize: 32, color: '#1a1a2e' }}>$5K - $15K /month</h2>
                    <p style={{ fontSize: 18, color: '#1a1a2e', opacity: 0.8, marginTop: 12 }}>
                        What certified practitioners earn
                    </p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                        {['Remote Work', 'Flexible Hours', 'Impact Lives'].map((t, i) => (
                            <div key={i} style={{
                                background: 'rgba(0,0,0,0.2)',
                                padding: '8px 16px',
                                borderRadius: 20,
                                color: '#1a1a2e',
                                fontSize: 14,
                            }}>
                                {t}
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            bg: 'linear-gradient(180deg, #722F37 0%, #0f3460 100%)',
            content: (
                <>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>🚀</div>
                    <h2 style={{ fontSize: 32 }}>Ready to Begin?</h2>
                    <p style={{ fontSize: 18, opacity: 0.9, marginTop: 12, maxWidth: 280, margin: '12px auto 0' }}>
                        You've completed the intro! Continue to lesson 2
                    </p>
                    <Link href="/gut-health-mini-diploma/style-5" style={{
                        display: 'inline-block',
                        marginTop: 32,
                        padding: '16px 40px',
                        background: 'white',
                        color: '#722F37',
                        borderRadius: 50,
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: 18,
                    }}>
                        Try Style 5 →
                    </Link>
                </>
            ),
        },
    ];

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const sectionHeight = container.clientHeight;
            const newSection = Math.round(scrollTop / sectionHeight);
            setCurrentSection(Math.min(newSection, sections.length - 1));

            // Progress within current section
            const sectionProgress = ((scrollTop % sectionHeight) / sectionHeight) * 100;
            setProgress(sectionProgress);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto advance timer
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    // Auto-scroll to next section
                    const container = containerRef.current;
                    if (container && currentSection < sections.length - 1) {
                        container.scrollTo({
                            top: (currentSection + 1) * container.clientHeight,
                            behavior: 'smooth',
                        });
                    }
                    return 0;
                }
                return p + 2;
            });
        }, 100);
        return () => clearInterval(timer);
    }, [currentSection]);

    const goToSection = (index: number) => {
        containerRef.current?.scrollTo({
            top: index * (containerRef.current?.clientHeight || 0),
            behavior: 'smooth',
        });
    };

    return (
        <div style={{
            height: '100vh',
            background: '#0b141a',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
        }}>
            {/* Progress Bars */}
            <div style={{
                position: 'fixed',
                top: 16,
                left: 16,
                right: 16,
                display: 'flex',
                gap: 4,
                zIndex: 100,
            }}>
                {sections.map((_, i) => (
                    <div key={i} style={{
                        flex: 1,
                        height: 3,
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            background: 'white',
                            width: i < currentSection ? '100%' : i === currentSection ? `${progress}%` : '0%',
                            transition: 'width 0.1s',
                        }} />
                    </div>
                ))}
            </div>

            {/* Logo */}
            <div style={{
                position: 'fixed',
                top: 32,
                left: 16,
                zIndex: 100,
            }}>
                <img src="/newlogo.webp" alt="AccrediPro" style={{ height: 32 }} />
            </div>

            {/* Close Button */}
            <Link href="/dashboard" style={{
                position: 'fixed',
                top: 32,
                right: 16,
                zIndex: 100,
                color: 'white',
                textDecoration: 'none',
                fontSize: 24,
            }}>
                ✕
            </Link>

            {/* Scroll Container */}
            <div
                ref={containerRef}
                style={{
                    height: '100vh',
                    overflowY: 'auto',
                    scrollSnapType: 'y mandatory',
                }}
            >
                {sections.map((section, i) => (
                    <div
                        key={i}
                        style={{
                            height: '100vh',
                            background: section.bg,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: 'white',
                            padding: '80px 24px 24px',
                            scrollSnapAlign: 'start',
                        }}
                    >
                        {section.content}
                    </div>
                ))}
            </div>

            {/* Tap Zones */}
            <div
                onClick={() => currentSection > 0 && goToSection(currentSection - 1)}
                style={{
                    position: 'fixed',
                    top: 60,
                    bottom: 0,
                    left: 0,
                    width: '30%',
                    cursor: currentSection > 0 ? 'pointer' : 'default',
                }}
            />
            <div
                onClick={() => currentSection < sections.length - 1 && goToSection(currentSection + 1)}
                style={{
                    position: 'fixed',
                    top: 60,
                    bottom: 0,
                    right: 0,
                    width: '30%',
                    cursor: currentSection < sections.length - 1 ? 'pointer' : 'default',
                }}
            />

            {/* Scroll Hint */}
            {currentSection === 0 && (
                <div style={{
                    position: 'fixed',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    opacity: 0.7,
                    animation: 'bounce 2s infinite',
                    textAlign: 'center',
                }}>
                    <div>↓ Scroll or tap to continue</div>
                </div>
            )}

            <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
        </div>
    );
}
