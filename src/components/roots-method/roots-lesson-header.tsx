'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RootsLessonHeaderProps {
    lessonNumber: number;
    totalLessons?: number;
    readTime?: string;
}

const BRAND_COLOR = '#722F37';
const ACCENT_COLOR = '#D4AF37';
const COURSE_NAME = 'R.O.O.T.S. Method™ — Clinical Foundations Mini Course';

const ALL_LESSONS = [
    { num: 1, title: 'From Burnout to Purpose' },
    { num: 2, title: 'Your Clinical Advantage Assessment' },
    { num: 3, title: 'The R.O.O.T.S. Framework Overview' },
    { num: 4, title: 'R — Recognize the Pattern' },
    { num: 5, title: 'O — Find the Origin' },
    { num: 6, title: 'O — Optimize the Foundations' },
    { num: 7, title: 'T — Transform with Coaching' },
    { num: 8, title: 'S — Scale Your Practice' },
    { num: 9, title: 'Case Study + 90-Day Roadmap' },
];

export function RootsLessonHeader({ lessonNumber, totalLessons = 9, readTime }: RootsLessonHeaderProps) {
    const [showLessonNav, setShowLessonNav] = useState(false);
    const moduleProgress = Math.round((lessonNumber / totalLessons) * 100);

    return (
        <header style={{
            background: `linear-gradient(135deg, ${BRAND_COLOR} 0%, #4a1c22 100%)`,
            padding: '16px 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Image
                        src="/newlogo.webp"
                        alt="AccrediPro"
                        width={44}
                        height={44}
                        style={{ borderRadius: 8 }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'white', fontWeight: 600, marginBottom: 4 }}>
                            {COURSE_NAME}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
                                <div style={{
                                    height: '100%',
                                    width: `${moduleProgress}%`,
                                    background: ACCENT_COLOR,
                                    borderRadius: 3,
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                                {lessonNumber}/{totalLessons}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowLessonNav(!showLessonNav)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: 8,
                            color: 'white',
                            fontSize: 14
                        }}
                    >
                        📋
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, color: 'white' }}>Lesson {lessonNumber}</div>
                    {readTime && (
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{readTime}</div>
                    )}
                </div>

                {showLessonNav && (
                    <div style={{
                        position: 'absolute',
                        right: 24,
                        top: 80,
                        background: 'white',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        padding: 8,
                        zIndex: 200,
                        width: 320
                    }}>
                        <div style={{
                            padding: '8px 12px',
                            fontSize: 12,
                            color: '#888',
                            fontWeight: 600,
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            {COURSE_NAME}
                        </div>
                        {ALL_LESSONS.map((l) => {
                            const isCurrent = l.num === lessonNumber;
                            const isCompleted = l.num < lessonNumber;
                            return (
                                <Link
                                    key={l.num}
                                    href={`/roots-method/lesson-${l.num}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '10px 12px',
                                        borderRadius: 8,
                                        textDecoration: 'none',
                                        background: isCurrent ? '#f8f9fa' : 'transparent'
                                    }}
                                >
                                    <span style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '50%',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        background: isCompleted ? BRAND_COLOR : 'transparent',
                                        border: isCompleted ? 'none' : '2px solid #ddd',
                                        color: isCompleted ? 'white' : '#999',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {isCompleted ? '✓' : l.num}
                                    </span>
                                    <span style={{
                                        fontSize: 13,
                                        color: isCurrent ? BRAND_COLOR : '#555',
                                        fontWeight: isCurrent ? 600 : 400
                                    }}>
                                        {l.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </header>
    );
}

export { BRAND_COLOR, ACCENT_COLOR, COURSE_NAME, ALL_LESSONS };
