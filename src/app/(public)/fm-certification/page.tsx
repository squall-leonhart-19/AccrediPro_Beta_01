"use client";

import { useEffect } from "react";

export default function FMCertificationPage() {
    useEffect(() => {
        // Load the full HTML page
        fetch('/winning_sp.html')
            .then(res => res.text())
            .then(html => {
                document.open();
                document.write(html);
                document.close();
            });
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#FAF8F3'
        }}>
            <p>Loading...</p>
        </div>
    );
}
