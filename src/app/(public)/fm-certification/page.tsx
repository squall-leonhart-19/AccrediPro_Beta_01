"use client";

import { useEffect } from "react";

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="description" content="Get certified as an Integrative Health & Functional Medicine Coach in 30 days. Transform from basic wellness coaching to clinical mastery with the DEPTH Method™. Work from home, earn $75-200/hour helping clients heal at the root cause level." />
  <title>Integrative Health & Functional Medicine Coach Certification | AccrediPro</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
</head>
<body></body>
</html>`;

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
