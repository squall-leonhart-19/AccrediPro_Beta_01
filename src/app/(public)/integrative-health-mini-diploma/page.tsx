'use client';

import { useEffect } from 'react';

// Redirect to Lesson 1
export default function IntegrativeHealthMiniDiplomaPage() {
    useEffect(() => {
        window.location.href = '/integrative-health-mini-diploma/lesson-1';
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Georgia, serif',
            color: '#2D5A4A',
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🩺</div>
                <div>Loading Integrative Health Mini-Diploma...</div>
            </div>
        </div>
    );
}
