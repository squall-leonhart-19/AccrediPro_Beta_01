'use client';

import Link from 'next/link';
import './styles.css';

interface LessonLayoutProps {
    children: React.ReactNode;
    currentPage: number;
    totalPages: number;
    lessonNumber: number;
    lessonTitle: string;
}

export default function LessonLayout({
    children,
    currentPage,
    totalPages,
    lessonNumber,
    lessonTitle,
}: LessonLayoutProps) {
    const progress = (currentPage / totalPages) * 100;
    const prevPage = currentPage > 1 ? `/gut-health-mini-diploma/lesson-1/page-${currentPage - 1}` : null;
    const nextPage = currentPage < totalPages ? `/gut-health-mini-diploma/lesson-1/page-${currentPage + 1}` : '/gut-health-mini-diploma/lesson-2';

    return (
        <div className="lesson-page">
            {/* Header */}
            <header className="lesson-header">
                <img src="/newlogo.webp" alt="AccrediPro Academy" className="lesson-logo" />

                <div className="lesson-progress-bar">
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="progress-text">
                        Lesson {lessonNumber} • Page {currentPage} of {totalPages}
                    </div>
                </div>

                <Link href="/dashboard" className="lesson-nav-btn outline">
                    Save & Exit
                </Link>
            </header>

            {/* Main Content */}
            <main className="lesson-main">
                {children}
            </main>

            {/* Footer Navigation */}
            <footer className="lesson-footer">
                <div className="nav-buttons">
                    {prevPage ? (
                        <Link href={prevPage} className="lesson-nav-btn outline">
                            ← Previous
                        </Link>
                    ) : (
                        <div />
                    )}

                    <Link href={nextPage} className="lesson-nav-btn">
                        {currentPage === totalPages ? 'Complete Lesson →' : 'Continue →'}
                    </Link>
                </div>

                <div className="page-dots">
                    {[1, 2, 3, 4, 5].map((page) => (
                        <Link
                            key={page}
                            href={`/gut-health-mini-diploma/lesson-1/page-${page}`}
                            className={`page-dot ${page === currentPage ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </footer>
        </div>
    );
}
