#!/usr/bin/env python3
"""
AccrediPro Lesson Transformer
Batch transforms FM lessons to Gold Standard template using Claude API

Usage:
    python scripts/transform-lessons.py --api-key YOUR_API_KEY --lesson "FM/FM-Update/Module_06/Lesson_6.2_..."

Or set ANTHROPIC_API_KEY environment variable:
    export ANTHROPIC_API_KEY=your_key
    python scripts/transform-lessons.py --lesson "..."
"""

import os
import re
import glob
import json
import time
import argparse
from pathlib import Path
from anthropic import Anthropic

# Configuration
BASE_DIR = Path(__file__).parent.parent
FM_UPDATE_DIR = BASE_DIR / "FM" / "FM-Update"
TRANSFORMED_DIR = BASE_DIR / "FM" / "FM-Transformed"  # Dry run output
MODEL = "claude-sonnet-4-5-20250929"
MAX_TOKENS = 16000

# Client initialized later with API key
client = None

# Gold Standard CSS v5.0 - complete CSS from Lesson 5.1
GOLD_STANDARD_CSS = '''/* ===========================================
   ACCREDIPRO GOLD STANDARD - UNIFIED LESSON CSS v5.0
   School-Quality • ASI Certified • Premium UX
   =========================================== */

/* Reset & Base */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.8;
    color: #1f2937;
    background: #ffffff;
    font-size: 17px;
}

/* MAIN WRAPPER */
.lesson-wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

/* HEADER CARD - Premium Gradient */
.module-header-card {
    background: linear-gradient(135deg, #722F37 0%, #8B3A42 50%, #5a252b 100%);
    padding: 48px 40px;
    margin-bottom: 40px;
    border-radius: 24px;
    box-shadow: 0 20px 60px -15px rgba(114, 47, 55, 0.4);
    border: none;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.module-header-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    pointer-events: none;
}

.module-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 12px;
    font-weight: 600;
    display: block;
}

.lesson-title {
    font-size: 38px;
    color: #ffffff;
    font-weight: 800;
    margin: 0 0 20px 0;
    line-height: 1.15;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* META BADGES */
.lesson-meta {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}

.meta-badge,
.meta-tag {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    padding: 8px 18px;
    border-radius: 24px;
    font-size: 13px;
    font-weight: 600;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 6px;
}

.meta-badge .icon {
    font-size: 14px;
}

/* ASI CREDENTIAL STRIP */
.asi-credential-strip {
    background: linear-gradient(90deg, #f8f5f0, #fffbeb, #f8f5f0);
    border: 1px solid #e5d9c3;
    border-radius: 12px;
    padding: 16px 24px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.asi-logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #B8860B, #D4A813);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(184, 134, 11, 0.25);
}

.asi-text {
    flex: 1;
}

.asi-text .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #92400e;
    font-weight: 700;
}

.asi-text .title {
    font-size: 15px;
    color: #78350f;
    font-weight: 600;
    margin-top: 2px;
}

/* TABLE OF CONTENTS */
.toc-box {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    margin-bottom: 40px;
}

.toc-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #6b7280;
    font-weight: 700;
    margin-bottom: 16px;
    display: block;
}

.toc-list {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
}

.toc-list li a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #f9fafb;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
}

.toc-list li a:hover {
    background: #f3f4f6;
    color: #722F37;
    transform: translateX(4px);
}

.section-num {
    background: #722F37;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
}

/* WELCOME BOX */
.welcome-box {
    background: linear-gradient(135deg, #fefbf3 0%, #f8f5f0 100%);
    padding: 28px;
    margin-bottom: 40px;
    border-radius: 16px;
    border-left: 5px solid #B8860B;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.welcome-box h3 {
    color: #92400e;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
}

.welcome-box p {
    margin: 0;
    font-size: 16px;
    color: #44403c;
    line-height: 1.7;
}

/* OBJECTIVES BOX */
.objectives-box {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 40px;
    border: 1px solid #e9d5ff;
}

.box-label {
    font-weight: 700;
    color: #7e22ce;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 12px;
    margin-bottom: 16px;
    display: block;
}

.objectives-box ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.objectives-box li {
    padding: 10px 0 10px 32px;
    position: relative;
    font-size: 16px;
    color: #4c1d95;
    border-bottom: 1px solid rgba(167, 139, 250, 0.2);
}

.objectives-box li:last-child {
    border-bottom: none;
}

.objectives-box li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #7c3aed;
    font-weight: 700;
}

/* HIGHLIGHT */
.highlight {
    background: linear-gradient(120deg, #fef3c7 0%, #fef3c7 100%);
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 600;
}

/* TYPOGRAPHY */
h2 {
    color: #722F37;
    font-size: 28px;
    margin: 56px 0 24px 0;
    font-weight: 800;
    position: relative;
    padding-bottom: 16px;
}

h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #B8860B, #D4A813);
    border-radius: 2px;
}

h3 {
    color: #722F37;
    font-size: 22px;
    margin: 36px 0 16px 0;
    font-weight: 700;
}

p {
    font-size: 17px;
    line-height: 1.85;
    color: #374151;
    margin-bottom: 20px;
}

ul, ol {
    margin: 20px 0;
    padding-left: 24px;
}

li {
    font-size: 16px;
    line-height: 1.7;
    color: #374151;
    margin-bottom: 10px;
}

li strong {
    color: #722F37;
}

/* CASE STUDY */
.case-study {
    background: white;
    border-radius: 20px;
    margin: 40px 0;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.case-study-header {
    background: linear-gradient(90deg, #722F37, #8B3A42);
    padding: 20px 28px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.case-study-icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.case-study-header .title {
    color: white;
    font-weight: 700;
    font-size: 16px;
    margin: 0;
}

.case-study-header .subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin: 4px 0 0 0;
}

.case-study-content {
    padding: 28px;
}

.patient-profile {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 12px;
    margin-bottom: 20px;
}

.patient-avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #fecaca, #fca5a5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
}

.patient-info h4 {
    margin: 0;
    color: #722F37;
    font-size: 16px;
    font-weight: 700;
}

.patient-info p {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: #6b7280;
}

/* COMPARISON GRID */
.comparison-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 32px 0;
}

.comparison-card {
    background: white;
    padding: 28px;
    border-radius: 16px;
    border: 2px solid #e5e7eb;
    transition: transform 0.2s, box-shadow 0.2s;
}

.comparison-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.comparison-card.conventional {
    border-top: 4px solid #ef4444;
}

.comparison-card.functional {
    border-top: 4px solid #22c55e;
}

.card-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    margin-bottom: 12px;
    display: block;
}

.conventional .card-label {
    color: #dc2626;
}

.functional .card-label {
    color: #16a34a;
}

.card-text {
    font-size: 18px;
    font-style: italic;
    line-height: 1.5;
    color: #1f2937;
    margin: 0;
}

/* CONTENT LIST */
.content-list {
    list-style: none;
    padding: 0;
    margin: 24px 0;
}

.content-list li {
    padding: 12px 0 12px 36px;
    position: relative;
    font-size: 16px;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
}

.content-list li:last-child {
    border-bottom: none;
}

.content-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: #722F37;
    font-weight: 700;
    font-size: 18px;
}

.content-list li strong {
    color: #722F37;
}

/* PRINCIPLE CARDS */
.principles-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 32px 0;
}

.principle-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    transition: all 0.2s;
}

.principle-card:hover {
    border-color: #722F37;
    box-shadow: 0 8px 24px rgba(114, 47, 55, 0.1);
}

.principle-number {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #722F37, #8B3A42);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 18px;
    flex-shrink: 0;
}

.principle-content {
    flex: 1;
}

.principle-title {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
}

.principle-text {
    font-size: 15px;
    color: #4b5563;
    margin: 0;
    line-height: 1.6;
}

/* SYSTEMS BOX */
.systems-box {
    background: #f8fafc;
    border-radius: 20px;
    padding: 32px;
    margin: 40px 0;
    border: 1px solid #e2e8f0;
}

.systems-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 24px;
}

.system-item {
    background: white;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
}

.system-item h4 {
    color: #722F37;
    font-size: 16px;
    margin-bottom: 8px;
}

.system-item p {
    font-size: 14px;
    color: #4b5563;
    margin: 0;
    line-height: 1.6;
}

/* NUTRIENT DENSITY BOX */
.nutrient-box {
    border-radius: 20px;
    padding: 32px;
    margin: 40px 0;
}

.nutrient-box.positive {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border: 1px solid #86efac;
}

.nutrient-box.positive h3 {
    color: #166534;
    margin-top: 0;
}

.nutrient-box.negative {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    border: 1px solid #fecaca;
}

.nutrient-box.negative h3 {
    color: #991b1b;
    margin-top: 0;
}

.nutrient-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 20px;
}

.nutrient-item {
    background: white;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(134, 239, 172, 0.5);
}

.nutrient-item h4 {
    color: #16a34a;
    font-size: 15px;
    margin-bottom: 8px;
}

.nutrient-item p {
    font-size: 14px;
    color: #4b5563;
    margin: 0;
    line-height: 1.5;
}

/* ALERT BOXES */
.alert-box {
    padding: 24px;
    border-radius: 16px;
    margin: 32px 0;
    border-left: 4px solid;
}

.alert-box .alert-label {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
    margin-bottom: 8px;
    display: block;
}

.alert-box p {
    margin: 0;
    font-size: 15px;
}

.alert-box.warning,
.alert-box.gold {
    background: #fffbeb;
    border-color: #f59e0b;
}

.alert-box.warning .alert-label,
.alert-box.gold .alert-label {
    color: #92400e;
}

.alert-box.success {
    background: #f0fdf4;
    border-color: #22c55e;
}

.alert-box.success .alert-label {
    color: #166534;
}

.alert-box.reflect,
.alert-box.info {
    background: #faf5ff;
    border-color: #a855f7;
}

.alert-box.reflect .alert-label,
.alert-box.info .alert-label {
    color: #7e22ce;
}

/* COACH TIP BOX */
.coach-tip {
    background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
    border: 1px solid #fde047;
    border-radius: 16px;
    padding: 24px 28px;
    margin: 32px 0;
    position: relative;
}

.coach-tip::before {
    content: '💡';
    position: absolute;
    top: -12px;
    left: 24px;
    background: white;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.coach-tip .tip-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #a16207;
    font-weight: 700;
    margin-bottom: 8px;
    display: block;
}

.coach-tip p {
    color: #713f12;
    font-size: 15px;
    margin: 0;
    line-height: 1.7;
}

/* MODULE CONNECTION BOX */
.module-connection {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1px solid #7dd3fc;
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.module-connection .connection-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
}

.module-connection .connection-text {
    flex: 1;
}

.module-connection .connection-text p {
    margin: 0;
    font-size: 15px;
    color: #0c4a6e;
    line-height: 1.5;
}

.module-connection .connection-text strong {
    color: #075985;
}

/* CHECK YOUR UNDERSTANDING */
.check-understanding {
    background: linear-gradient(135deg, #faf5ff, #f3e8ff);
    border: 1px solid #e9d5ff;
    border-radius: 20px;
    padding: 32px;
    margin: 48px 0;
}

.question-item {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 16px;
    border: 1px solid #e9d5ff;
}

.question-item:last-child {
    margin-bottom: 0;
}

.question-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.question-number {
    background: #a855f7;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
}

.question-text {
    font-weight: 600;
    color: #4b5563;
    font-size: 15px;
    margin: 0;
    flex: 1;
}

.reveal-btn {
    background: white;
    border: 2px solid #d8b4fe;
    color: #7e22ce;
    padding: 10px 20px;
    border-radius: 24px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 12px;
}

.reveal-btn:hover {
    background: #7e22ce;
    color: white;
    border-color: #7e22ce;
}

.answer-text {
    display: none;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e9d5ff;
    color: #4b5563;
    font-size: 15px;
    line-height: 1.6;
}

.answer-text.show {
    display: block;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* KEY TAKEAWAYS */
.takeaways-box {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border: 1px solid #86efac;
    border-radius: 20px;
    padding: 32px;
    margin: 48px 0;
}

.takeaways-box .box-label {
    color: #166534;
}

.takeaways-box ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.takeaways-box li {
    padding: 12px 0 12px 32px;
    position: relative;
    font-size: 16px;
    color: #166534;
    border-bottom: 1px solid rgba(34, 197, 94, 0.2);
}

.takeaways-box li:last-child {
    border-bottom: none;
}

.takeaways-box li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #22c55e;
    font-weight: 700;
    font-size: 16px;
}

/* REFERENCES - Premium Academic Style */
.references-box {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 28px 32px;
    margin-top: 48px;
}

.references-box .box-label {
    color: #64748b;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.references-box .box-label::before {
    content: '📚';
}

.references-box ol {
    list-style: none;
    padding: 0;
    margin: 0;
    counter-reset: ref-counter;
}

.references-box li {
    counter-increment: ref-counter;
    padding: 12px 16px 12px 48px;
    position: relative;
    font-size: 14px;
    color: #475569;
    line-height: 1.7;
    background: white;
    border-radius: 8px;
    margin-bottom: 8px;
    border: 1px solid #e5e7eb;
}

.references-box li:last-child {
    margin-bottom: 0;
}

.references-box li::before {
    content: counter(ref-counter);
    position: absolute;
    left: 16px;
    top: 12px;
    width: 22px;
    height: 22px;
    background: #722F37;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
}

.references-box li em {
    color: #722F37;
    font-weight: 500;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .lesson-wrapper {
        padding: 24px 16px 60px;
    }

    .module-header-card {
        padding: 32px 24px;
        border-radius: 20px;
    }

    .lesson-title {
        font-size: 28px;
    }

    .comparison-grid {
        grid-template-columns: 1fr;
    }

    .systems-grid {
        grid-template-columns: 1fr;
    }

    .nutrient-grid {
        grid-template-columns: 1fr;
    }

    .toc-list {
        grid-template-columns: 1fr;
    }

    .asi-credential-strip {
        flex-direction: column;
        text-align: center;
    }

    .module-connection {
        flex-direction: column;
        text-align: center;
    }
}
'''

# JavaScript for reveal answers
TOGGLE_SCRIPT = '''
<script>
function toggleAnswer(btn) {
    const answer = btn.nextElementSibling;
    const isShowing = answer.classList.contains('show');

    if (isShowing) {
        answer.classList.remove('show');
        btn.textContent = 'Reveal Answer';
    } else {
        answer.classList.add('show');
        btn.textContent = 'Hide Answer';
    }
}
</script>
'''

# System prompt for Claude
SYSTEM_PROMPT = """You are an expert at transforming educational content into beautifully structured HTML lessons.

Your task is to take existing lesson content and restructure it into the AccrediPro Gold Standard format.

## REQUIRED STRUCTURE (in order):
1. Module Header Card with:
   - Module label (e.g., "Module 6: Gut Health")
   - Lesson title
   - Meta badges (reading time, content type)

2. ASI Credential Strip (EXACTLY as shown)

3. Table of Contents (4-6 items matching H2 sections)

4. Module Connection box (1-2 sentences connecting to previous learning)

5. Welcome Box (brief intro paragraph)

6. Learning Objectives (4-6 with action verbs)

7. Opening Case Study (with patient profile and quote)

8. Main Content Sections (H2 headers matching TOC)

9. Coach Tips (MINIMUM 4 spread throughout) - These are CRITICAL and must be practical coaching advice

10. Check Your Understanding section with EXACTLY 4 questions using this structure:
```html
<div class="check-understanding">
    <span class="box-label">Test Your Knowledge</span>
    <div class="question-item">
        <div class="question-header">
            <span class="question-number">1</span>
            <p class="question-text">Question here?</p>
        </div>
        <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
        <div class="answer-text">
            <p><strong>Answer:</strong> Answer explanation here.</p>
        </div>
    </div>
    <!-- Repeat for questions 2, 3, 4 -->
</div>
```

11. Key Takeaways box (4-6 items)

12. References box (5-8 academic citations)

## IMPORTANT RULES:
- PRESERVE all existing quiz questions exactly as they are
- PRESERVE all educational content and factual information
- ADD 4 coach tips with practical coaching advice for health coaches
- Use <span class="highlight">term</span> for key terms
- All content goes inside <div class="lesson-wrapper">
- DO NOT include the CSS or JavaScript - I will add those separately
- Output ONLY the HTML from <div class="lesson-wrapper"> to </div>

## IMPROVE the content by:
- Adding practical coaching tips where appropriate
- Improving clarity and flow
- Adding highlight spans to key concepts
- Creating better visual hierarchy
- Making content more engaging and actionable"""


def extract_module_info(filepath: Path) -> dict:
    """Extract module number and lesson info from filepath"""
    parts = filepath.parts
    for part in parts:
        if part.startswith("Module_"):
            module_num = part.replace("Module_", "")
            break
    else:
        module_num = "XX"

    filename = filepath.stem
    match = re.match(r"Lesson_(\d+)\.(\d+)_(.+)", filename)
    if match:
        lesson_num = f"{match.group(1)}.{match.group(2)}"
        title = match.group(3).replace("_", " ")
    else:
        lesson_num = "X.X"
        title = filename.replace("_", " ")

    return {
        "module_num": module_num,
        "lesson_num": lesson_num,
        "title": title,
        "filename": filename
    }


def extract_content(html: str) -> str:
    """Extract the main content from existing HTML, removing boilerplate"""
    # Try to extract just the body content
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if body_match:
        content = body_match.group(1)
    else:
        content = html

    # Remove existing style and script tags
    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)

    return content.strip()


def transform_lesson(filepath: Path, dry_run: bool = True) -> bool:
    """Transform a single lesson file"""
    info = extract_module_info(filepath)
    print(f"\n{'='*60}")
    print(f"Processing: {info['filename']}")
    print(f"Module {info['module_num']}, Lesson {info['lesson_num']}: {info['title']}")
    print(f"{'='*60}")

    # Read existing content
    with open(filepath, 'r', encoding='utf-8') as f:
        original_html = f.read()

    content = extract_content(original_html)

    # Prepare the prompt
    user_prompt = f"""Transform this lesson to Gold Standard format:

Module: {info['module_num']}
Lesson: {info['lesson_num']}
Title: {info['title']}

EXISTING CONTENT:
{content}

Remember:
1. PRESERVE all quiz questions exactly
2. ADD 4 coach tips throughout
3. Follow the exact structure outlined
4. Output ONLY the HTML from <div class="lesson-wrapper"> to </div>
5. Do NOT include CSS or JavaScript"""

    try:
        print("Calling Claude API...")
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )

        transformed_content = response.content[0].text

        # Clean up any markdown code fences that Claude might include
        transformed_content = re.sub(r'^```html\s*', '', transformed_content, flags=re.MULTILINE)
        transformed_content = re.sub(r'^```\s*$', '', transformed_content, flags=re.MULTILINE)
        transformed_content = transformed_content.strip()

        # Build complete HTML
        complete_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lesson {info['lesson_num']}: {info['title']} | AccrediPro</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
{GOLD_STANDARD_CSS}
    </style>
</head>
<body>

{transformed_content}

{TOGGLE_SCRIPT}

</body>
</html>
'''

        # Determine output path
        if dry_run:
            # Save to transformed directory
            output_dir = TRANSFORMED_DIR / filepath.parent.name
            output_dir.mkdir(parents=True, exist_ok=True)
            output_path = output_dir / filepath.name
        else:
            # Overwrite original
            output_path = filepath

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(complete_html)

        print(f"✅ Saved to: {output_path}")
        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def get_lessons_to_process(modules: list[str] = None) -> list[Path]:
    """Get list of lesson files to process"""
    lessons = []

    if modules is None:
        # Default: Modules 2-20 (skip 0, 1, and 5 which are already done)
        modules = [f"Module_{i:02d}" for i in range(2, 21) if i not in [5]]

    for module in modules:
        module_dir = FM_UPDATE_DIR / module
        if module_dir.exists():
            for lesson_file in sorted(module_dir.glob("Lesson_*.html")):
                lessons.append(lesson_file)

    return lessons


def main():
    global client

    parser = argparse.ArgumentParser(description="Transform FM lessons to Gold Standard")
    parser.add_argument("--module", type=str, help="Specific module to process (e.g., Module_06)")
    parser.add_argument("--lesson", type=str, help="Specific lesson file to process")
    parser.add_argument("--dry-run", action="store_true", default=True,
                        help="Save to FM-Transformed instead of overwriting (default: True)")
    parser.add_argument("--live", action="store_true",
                        help="Overwrite original files (use with caution!)")
    parser.add_argument("--delay", type=float, default=2.0,
                        help="Delay between API calls in seconds (default: 2)")
    parser.add_argument("--api-key", type=str,
                        help="Anthropic API key (or set ANTHROPIC_API_KEY env var)")
    args = parser.parse_args()

    # Initialize client with API key
    api_key = args.api_key or os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ Error: No API key provided.")
        print("   Either set ANTHROPIC_API_KEY environment variable")
        print("   Or use --api-key YOUR_KEY argument")
        return

    client = Anthropic(api_key=api_key)

    dry_run = not args.live

    print("="*60)
    print("AccrediPro Lesson Transformer")
    print("="*60)
    print(f"Mode: {'DRY RUN (saving to FM-Transformed)' if dry_run else 'LIVE (overwriting originals)'}")
    print(f"Model: {MODEL}")
    print()

    # Get lessons to process
    if args.lesson:
        lessons = [Path(args.lesson)]
    elif args.module:
        lessons = get_lessons_to_process([args.module])
    else:
        lessons = get_lessons_to_process()

    print(f"Found {len(lessons)} lessons to process")

    if not lessons:
        print("No lessons found!")
        return

    # Confirm before proceeding
    if not dry_run:
        confirm = input("\n⚠️  LIVE MODE: This will overwrite original files. Continue? (yes/no): ")
        if confirm.lower() != "yes":
            print("Aborted.")
            return

    # Process lessons
    success = 0
    failed = 0

    for i, lesson in enumerate(lessons):
        print(f"\n[{i+1}/{len(lessons)}]", end="")

        if transform_lesson(lesson, dry_run=dry_run):
            success += 1
        else:
            failed += 1

        # Rate limiting
        if i < len(lessons) - 1:
            print(f"Waiting {args.delay}s before next request...")
            time.sleep(args.delay)

    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"✅ Success: {success}")
    print(f"❌ Failed: {failed}")
    print(f"📁 Output: {'FM-Transformed/' if dry_run else 'Original files overwritten'}")

    if dry_run and success > 0:
        print("\nTo apply changes, review the transformed files and then run with --live flag")


if __name__ == "__main__":
    main()
