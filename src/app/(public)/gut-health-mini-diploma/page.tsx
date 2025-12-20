'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

// Redirect to Lesson 1
export default function GutHealthMiniDiplomaPage() {
    useEffect(() => {
        window.location.href = '/gut-health-mini-diploma/lesson-1';
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Georgia, serif',
            color: '#722F37',
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🎓</div>
                <div>Loading Gut Health Mini-Diploma...</div>
            </div>
        </div>
    );
}
