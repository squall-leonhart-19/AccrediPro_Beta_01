#!/usr/bin/env python3
"""
AccrediPro Lesson Transformer - COMPLETE WORKFLOW
=================================================

This script transforms FM lessons to Gold Standard format using Claude API.

WORKFLOW:
1. TRANSFORM: Convert lessons with Claude API (4 parallel workers)
2. REVIEW: Check transformed files in FM-Transformed/
3. APPLY: Copy approved files to FM-Update/ (or use --live)
4. IMPORT: Push to database

USAGE EXAMPLES:
---------------

# Step 1: Transform Module 6 (dry run - saves to FM-Transformed/)
python scripts/transform-parallel.py --modules Module_06

# Step 2: Transform ALL modules 2-20 (dry run)
python scripts/transform-parallel.py

# Step 3: After review, apply to originals
python scripts/transform-parallel.py --apply

# Step 4: Import to database
python scripts/transform-parallel.py --import-db

# Or do everything at once (transform + apply + import)
python scripts/transform-parallel.py --live --import-db

# Check status of transformed files
python scripts/transform-parallel.py --status

API KEYS:
---------
4 API keys are embedded in the script for parallel processing.

OUTPUT FOLDERS:
---------------
- Dry run: FM/FM-Transformed/Module_XX/
- Live/Apply: FM/FM-Update/Module_XX/
- Database: PostgreSQL via Prisma
"""

import os
import re
import sys
import time
import shutil
import argparse
import subprocess
import concurrent.futures
from pathlib import Path
from anthropic import Anthropic

# =============================================================================
# CONFIGURATION
# =============================================================================

BASE_DIR = Path(__file__).parent.parent
FM_UPDATE_DIR = BASE_DIR / "FM" / "FM-Update"
TRANSFORMED_DIR = BASE_DIR / "FM" / "FM-Transformed"
MODEL = "claude-sonnet-4-5-20250929"
MAX_TOKENS = 16000

# API Keys for parallel processing (4 workers)
# Set these as environment variables or pass via --api-keys argument
API_KEYS = [
    os.environ.get("ANTHROPIC_API_KEY_1", ""),
    os.environ.get("ANTHROPIC_API_KEY_2", ""),
    os.environ.get("ANTHROPIC_API_KEY_3", ""),
    os.environ.get("ANTHROPIC_API_KEY_4", ""),
]

# Modules to skip (already done)
SKIP_MODULES = [0, 1, 5]  # Module 0, 1, 5 already transformed

# =============================================================================
# GOLD STANDARD CSS v5.0
# =============================================================================

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

# =============================================================================
# TOGGLE SCRIPT FOR QUIZ ANSWERS
# =============================================================================

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

# =============================================================================
# GOLD STANDARD HTML REFERENCE (from Lesson 5.1)
# =============================================================================

GOLD_STANDARD_HTML_REFERENCE = '''
    <div class="lesson-wrapper">
        <!-- Module Header -->
        <div class="module-header-card">
            <span class="module-label">Module 5: Functional Nutrition</span>
            <h1 class="lesson-title">Lesson 5.1: Introduction to Functional Nutrition</h1>
            <div class="lesson-meta">
                <span class="meta-badge"><span class="icon">⏱️</span> 12 min read</span>
                <span class="meta-badge"><span class="icon">💡</span> Core Concept</span>
            </div>
        </div>

        <!-- ASI Credential Strip -->
        <div class="asi-credential-strip">
            <div class="asi-logo">🏅</div>
            <div class="asi-text">
                <p class="label">ASI Accredited Content</p>
                <p class="title">Functional Medicine Health Coach Certification</p>
            </div>
        </div>

        <!-- Table of Contents -->
        <nav class="toc-box">
            <span class="toc-label">In This Lesson</span>
            <ul class="toc-list">
                <li><a href="#food-information"><span class="section-num">01</span>Food as Information</a></li>
                <li><a href="#core-principles"><span class="section-num">02</span>Core Principles</a></li>
                <li><a href="#systems"><span class="section-num">03</span>Nutrition & FM Systems</a></li>
                <li><a href="#nutrient-density"><span class="section-num">04</span>Nutrient Density</a></li>
                <li><a href="#coaching"><span class="section-num">05</span>Coaching Conversations</a></li>
                <li><a href="#quiz"><span class="section-num">06</span>Check Your Understanding</a></li>
            </ul>
        </nav>

        <!-- Module Connection -->
        <div class="module-connection">
            <div class="connection-icon">🔗</div>
            <div class="connection-text">
                <p><strong>Connection to Your Journey:</strong> You've completed four foundational modules—understanding functional medicine principles, mastering coaching skills, developing clinical assessment abilities, and navigating professional ethics. Now we enter the realm that arguably matters most to your clients' daily lives: <strong>nutrition</strong>.</p>
            </div>
        </div>

        <!-- Welcome Box -->
        <div class="welcome-box">
            <p>This module will transform your understanding of food from simple calories and nutrients to a <span class="highlight">powerful therapeutic tool</span> that communicates with every cell, organ, and system in the body. You'll learn why personalized nutrition succeeds where one-size-fits-all diets fail.</p>
        </div>

        <!-- Learning Objectives -->
        <div class="objectives-box">
            <span class="box-label">What You'll Learn</span>
            <ul>
                <li>Distinguish functional nutrition from conventional dietary approaches</li>
                <li>Understand the concept of <span class="highlight">food as information</span> and medicine</li>
                <li>Recognize how nutrition influences the seven functional medicine systems</li>
                <li>Identify the core principles that guide therapeutic nutrition</li>
                <li>Apply foundational concepts to support client health transformations</li>
            </ul>
        </div>

        <!-- Case Study -->
        <div class="case-study">
            <div class="case-study-header">
                <div class="case-study-icon">📋</div>
                <div>
                    <p class="title">Case Study: Karen's Diet Frustration</p>
                    <p class="subtitle">When Willpower Isn't the Problem</p>
                </div>
            </div>
            <div class="case-study-content">
                <div class="patient-profile">
                    <div class="patient-avatar">👩</div>
                    <div class="patient-info">
                        <h4>Karen, Age 48</h4>
                        <p>Decades of yo-yo dieting • Progressively worsening fatigue • Brain fog • Joint pain</p>
                    </div>
                </div>
                <p><em>"I've tried every diet you can imagine—keto, low-fat, Weight Watchers, Whole30. I lose some weight, feel okay for a while, then end up right back where I started. I'm beginning to think there's something fundamentally wrong with me."</em></p>
                <p>Her doctor had run basic labs—all "normal"—and suggested she simply needed more willpower around food. But Karen wasn't lacking willpower. She had followed each program meticulously. What she was lacking was an approach that treated her as an individual—one that addressed <strong>why</strong> she was struggling, not just <strong>what</strong> she should eat.</p>
            </div>
        </div>

        <p>Karen's story echoes through countless client conversations. The conventional approach to nutrition—counting calories, following standardized meal plans, eliminating entire food groups without understanding why—has left millions frustrated and often worse off than when they started.</p>

        <!-- Main Content Section with H2 -->
        <h2 id="food-information">Beyond Calories: Food as Information</h2>

        <p>The conventional nutrition paradigm treats the body like a combustion engine—put fuel in, burn energy out. This reductionist view ignores the remarkable complexity of human biology. Your body isn't a car engine; it's a living, adaptive, constantly communicating ecosystem.</p>

        <p><span class="highlight">Functional nutrition</span> takes a radically different view. It recognizes that every bite of food you eat carries far more than calories—it carries <strong>information</strong>. That information interacts with your unique biochemistry, your gut microbiome, your hormonal systems, your genetic expression, your immune function, and your mental health.</p>

        <!-- Comparison Grid -->
        <div class="comparison-grid">
            <div class="comparison-card conventional">
                <span class="card-label">Conventional Approach</span>
                <ul>
                    <li>Food = Calories (fuel)</li>
                    <li>One-size-fits-all recommendations</li>
                    <li>Focus on weight as primary outcome</li>
                </ul>
            </div>
            <div class="comparison-card functional">
                <span class="card-label">Functional Approach</span>
                <ul>
                    <li>Food = Information (signaling)</li>
                    <li>Personalized to individual biology</li>
                    <li>Focus on function and vitality</li>
                </ul>
            </div>
        </div>

        <!-- Coach Tip -->
        <div class="coach-tip">
            <span class="tip-label">Coach Tip</span>
            <p>When explaining this to clients, try: <em>"Think of food as a language your body understands. Every meal sends thousands of messages to your cells—telling them to heal or inflame, to store fat or burn it, to feel energized or exhausted. We're going to learn which messages support YOUR body best."</em></p>
        </div>

        <h2 id="core-principles">Core Principles of Functional Nutrition</h2>

        <!-- Principle Cards -->
        <div class="principles-grid">
            <div class="principle-card">
                <div class="principle-number">1</div>
                <div class="principle-content">
                    <p class="principle-title">Biochemical Individuality</p>
                    <p class="principle-text">No two people have identical nutritional needs. <span class="highlight">Personalization isn't optional—it's essential.</span></p>
                </div>
            </div>
            <div class="principle-card">
                <div class="principle-number">2</div>
                <div class="principle-content">
                    <p class="principle-title">Food Quality Matters</p>
                    <p class="principle-text">A calorie is not just a calorie. 200 calories from wild salmon provides omega-3 fatty acids. 200 calories from candy provides sugar and artificial additives.</p>
                </div>
            </div>
        </div>

        <!-- Systems Box -->
        <h2 id="systems">Nutrition Across the Functional Medicine Systems</h2>

        <div class="systems-box">
            <h3>How Nutrition Influences Each System</h3>
            <div class="systems-grid">
                <div class="system-item">
                    <h4>🍽️ Assimilation</h4>
                    <p>Food choices directly affect stomach acid, enzyme production, intestinal motility, and microbiome composition.</p>
                </div>
                <div class="system-item">
                    <h4>🛡️ Defense & Repair</h4>
                    <p>70% of the immune system resides in the gut. Nutrients like vitamin D, zinc, vitamin C modulate immune response.</p>
                </div>
            </div>
        </div>

        <!-- Alert Box -->
        <div class="alert-box warning">
            <span class="alert-label">Key Insight</span>
            <p>This systems-wide impact explains why clients often report improvements in multiple areas when they adopt therapeutic nutrition changes.</p>
        </div>

        <h2 id="nutrient-density">The Nutrient Density Priority</h2>

        <!-- Nutrient Box Positive -->
        <div class="nutrient-box positive">
            <h3>🌟 Nutrient Powerhouses</h3>
            <div class="nutrient-grid">
                <div class="nutrient-item">
                    <h4>Vegetables</h4>
                    <p>Leafy greens, cruciferous vegetables—the foundation of nutrient density.</p>
                </div>
                <div class="nutrient-item">
                    <h4>Quality Proteins</h4>
                    <p>Pasture-raised eggs, wild fish, grass-fed meats—providing amino acids, B vitamins.</p>
                </div>
            </div>
        </div>

        <!-- Another Coach Tip -->
        <div class="coach-tip">
            <span class="tip-label">Coach Tip</span>
            <p><strong>Focus on additions first.</strong> Rather than starting with restrictions, begin by adding nutrient-dense foods.</p>
        </div>

        <h2 id="coaching">Starting the Nutrition Conversation with Clients</h2>

        <div class="alert-box reflect">
            <span class="alert-label">Pause & Reflect</span>
            <p>Think about your own relationship with food. What dietary changes have made the biggest difference in how you feel?</p>
        </div>

        <!-- Check Your Understanding - EXACT STRUCTURE REQUIRED -->
        <h2 id="quiz">Check Your Understanding</h2>

        <div class="check-understanding">
            <span class="box-label">Test Your Knowledge</span>

            <div class="question-item">
                <div class="question-header">
                    <span class="question-number">1</span>
                    <p class="question-text">What does "food as information" mean in functional nutrition?</p>
                </div>
                <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
                <div class="answer-text">
                    <p><strong>Answer:</strong> "Food as information" means that every bite of food carries signals that communicate with your cells beyond just calories.</p>
                </div>
            </div>

            <div class="question-item">
                <div class="question-header">
                    <span class="question-number">2</span>
                    <p class="question-text">Why might two people eating identical diets have completely different health outcomes?</p>
                </div>
                <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
                <div class="answer-text">
                    <p><strong>Answer:</strong> This is due to <strong>biochemical individuality</strong>—no two people have identical nutritional needs.</p>
                </div>
            </div>

            <div class="question-item">
                <div class="question-header">
                    <span class="question-number">3</span>
                    <p class="question-text">What are the six core principles of functional nutrition covered in this lesson?</p>
                </div>
                <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
                <div class="answer-text">
                    <p><strong>Answer:</strong> The six core principles are: (1) Biochemical Individuality, (2) Food Quality Matters, (3) The Gut-Centric View, (4) Remove/Replace/Reinoculate/Repair, (5) Anti-Inflammatory Foundation, (6) Blood Sugar Balance.</p>
                </div>
            </div>

            <div class="question-item">
                <div class="question-header">
                    <span class="question-number">4</span>
                    <p class="question-text">As a health coach, what's an effective way to start nutrition conversations with clients?</p>
                </div>
                <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
                <div class="answer-text">
                    <p><strong>Answer:</strong> <strong>Focus on additions first</strong>, rather than restrictions.</p>
                </div>
            </div>
        </div>

        <!-- Key Takeaways -->
        <div class="takeaways-box">
            <span class="box-label">Key Takeaways</span>
            <ul>
                <li><span class="highlight">Food is information</span> — every bite sends signals that influence gene expression, hormones, immunity</li>
                <li><span class="highlight">Biochemical individuality</span> means nutrition must be personalized, not standardized</li>
                <li><span class="highlight">Nutrient density</span> — prioritize foods that deliver maximum nutrition per bite</li>
                <li>Nutrition influences all <span class="highlight">seven functional medicine systems</span> simultaneously</li>
                <li>As a coach, focus on <span class="highlight">additions before restrictions</span></li>
            </ul>
        </div>

        <!-- References -->
        <div class="references-box">
            <span class="box-label">References</span>
            <ol>
                <li>Institute for Functional Medicine. (2023). <em>Functional nutrition: Food as medicine</em>. The Institute for Functional Medicine.</li>
                <li>Bland, J. (2014). <em>The disease delusion: Conquering the causes of chronic illness</em>. HarperOne.</li>
                <li>Hyman, M. (2018). <em>Food: What the heck should I eat?</em> Little, Brown Spark.</li>
                <li>Mayer, E. (2016). <em>The mind-gut connection</em>. Harper Wave.</li>
                <li>Kresser, C. (2017). <em>Unconventional medicine</em>. Lioncrest Publishing.</li>
                <li>Pizzorno, J. E., & Murray, M. T. (2020). <em>Textbook of natural medicine</em> (5th ed.). Elsevier.</li>
            </ol>
        </div>

    </div>
'''

# =============================================================================
# SYSTEM PROMPT FOR CLAUDE
# =============================================================================

SYSTEM_PROMPT = """You are an expert HTML lesson formatter for AccrediPro's Functional Medicine certification program.

## YOUR TASK
Transform the provided lesson content into the EXACT Gold Standard HTML format shown in the reference example below.

## CRITICAL INSTRUCTION
You MUST copy the HTML structure EXACTLY from the reference. Do NOT improvise or create your own HTML classes/structure.
The reference below is the PERFECT example - replicate its structure precisely for the new lesson content.

## GOLD STANDARD HTML REFERENCE EXAMPLE (COPY THIS STRUCTURE EXACTLY):
""" + GOLD_STANDARD_HTML_REFERENCE + """

## STRUCTURE REQUIREMENTS (in exact order):
1. **Module Header Card** - with .module-header-card, .module-label, .lesson-title, .lesson-meta, .meta-badge
2. **ASI Credential Strip** - EXACTLY as shown: "ASI Accredited Content" + "Functional Medicine Health Coach Certification"
3. **Table of Contents** - .toc-box with .toc-label "In This Lesson", .toc-list with .section-num (01, 02, etc.)
4. **Module Connection** - .module-connection with .connection-icon 🔗 and .connection-text
5. **Welcome Box** - .welcome-box with intro paragraph
6. **Learning Objectives** - .objectives-box with .box-label "What You'll Learn" and ul/li items
7. **Case Study** - .case-study with .case-study-header, .case-study-icon, .patient-profile, .patient-avatar, .patient-info
8. **Main Content** - H2 sections with content, comparison grids, principle cards, systems boxes as needed
9. **Coach Tips** - MINIMUM 4x .coach-tip boxes spread throughout (with .tip-label and practical advice)
10. **Check Understanding** - .check-understanding with EXACTLY 4 .question-item divs using toggleAnswer(this)
11. **Key Takeaways** - .takeaways-box with .box-label and ul/li items
12. **References** - .references-box with .box-label and ol/li academic citations

## CRITICAL HTML CLASSES TO USE (DO NOT INVENT NEW ONES):
- .lesson-wrapper, .module-header-card, .module-label, .lesson-title, .lesson-meta, .meta-badge
- .asi-credential-strip, .asi-logo, .asi-text (with child p.label and p.title)
- .toc-box, .toc-label, .toc-list, .section-num
- .module-connection, .connection-icon, .connection-text
- .welcome-box
- .objectives-box, .box-label
- .case-study, .case-study-header, .case-study-icon, .case-study-content, .patient-profile, .patient-avatar, .patient-info
- .comparison-grid, .comparison-card.conventional, .comparison-card.functional, .card-label
- .principles-grid, .principle-card, .principle-number, .principle-content, .principle-title, .principle-text
- .systems-box, .systems-grid, .system-item
- .nutrient-box.positive, .nutrient-box.negative, .nutrient-grid, .nutrient-item
- .alert-box.warning, .alert-box.success, .alert-box.reflect, .alert-label
- .coach-tip, .tip-label
- .check-understanding, .question-item, .question-header, .question-number, .question-text, .reveal-btn, .answer-text
- .takeaways-box
- .references-box
- .highlight (for key terms)

## OUTPUT RULES:
1. Output ONLY the HTML from <div class="lesson-wrapper"> to </div>
2. Do NOT include CSS, JavaScript, <!DOCTYPE>, <html>, <head>, or <body> tags
3. Do NOT wrap in markdown code fences (no ```html)
4. PRESERVE all educational content from the original
5. PRESERVE all existing quiz questions
6. ADD 4+ coach tips with practical health coaching advice
7. Use <span class="highlight">term</span> for key concepts
8. ASI Strip MUST say "ASI Accredited Content" and "Functional Medicine Health Coach Certification" - NOT anything else"""

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def extract_module_info(filepath: Path) -> dict:
    """Extract module number and lesson info from filepath"""
    parts = filepath.parts
    module_num = "XX"
    for part in parts:
        if part.startswith("Module_"):
            module_num = part.replace("Module_", "")
            break

    filename = filepath.stem
    # Try Lesson_X.Y_Title pattern
    match = re.match(r"Lesson_(\d+)\.(\d+)_(.+)", filename)
    if match:
        lesson_num = f"{match.group(1)}.{match.group(2)}"
        title = match.group(3).replace("_", " ")
    else:
        # Try X.Y_Title pattern (Module 13+)
        match2 = re.match(r"(\d+)\.(\d+)_(.+)", filename)
        if match2:
            lesson_num = f"{match2.group(1)}.{match2.group(2)}"
            title = match2.group(3).replace("_", " ")
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
    """Extract the main content from existing HTML"""
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if body_match:
        content = body_match.group(1)
    else:
        content = html

    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)

    return content.strip()


def transform_lesson(filepath: Path, api_key: str, dry_run: bool = True) -> tuple[bool, str]:
    """Transform a single lesson file using Claude API"""
    info = extract_module_info(filepath)
    lesson_id = f"{info['module_num']}-{info['lesson_num']}"

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_html = f.read()

        content = extract_content(original_html)

        user_prompt = f"""Transform this lesson to Gold Standard format, copying the EXACT HTML structure from the reference example.

## LESSON INFO:
- Module: {info['module_num']}
- Lesson: {info['lesson_num']}
- Title: {info['title']}

## ORIGINAL CONTENT TO TRANSFORM:
{content}

## CRITICAL INSTRUCTIONS:
1. Copy the HTML structure EXACTLY like the Gold Standard reference example in the system prompt
2. Change ONLY the text content to match this lesson's topic
3. Keep the EXACT same HTML classes, structure, and formatting
4. ASI Strip MUST say: "ASI Accredited Content" and "Functional Medicine Health Coach Certification"
5. TOC must use .toc-box, .toc-label, .toc-list with .section-num spans (01, 02, etc.)
6. Include MINIMUM 4 coach-tip boxes spread throughout
7. Quiz section must use .check-understanding with .question-item, .reveal-btn onclick="toggleAnswer(this)"
8. PRESERVE all educational content and quiz questions from the original
9. Output ONLY <div class="lesson-wrapper">...</div> - no CSS, no JS, no markdown fences"""

        client = Anthropic(api_key=api_key)
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}]
        )

        transformed_content = response.content[0].text

        # Clean up markdown code fences
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
            output_dir = TRANSFORMED_DIR / filepath.parent.name
            output_dir.mkdir(parents=True, exist_ok=True)
            output_path = output_dir / filepath.name
        else:
            output_path = filepath

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(complete_html)

        return True, f"✅ {lesson_id}: {info['title']}"

    except Exception as e:
        return False, f"❌ {lesson_id}: {str(e)[:80]}"


def get_lessons_to_process(modules: list[str] = None) -> list[Path]:
    """Get list of lesson files to process"""
    lessons = []

    if modules is None:
        # Default: Modules 2-20 (skip configured modules)
        module_nums = [i for i in range(2, 21) if i not in SKIP_MODULES]
        modules = [f"Module_{i:02d}" for i in module_nums]
        # Also check non-padded names for Module 13+
        modules += [f"Module_{i}" for i in range(13, 21) if i not in SKIP_MODULES]

    for module in modules:
        module_dir = FM_UPDATE_DIR / module
        if module_dir.exists():
            for lesson_file in sorted(module_dir.glob("*.html")):
                if lesson_file not in lessons:
                    lessons.append(lesson_file)

    return lessons


def show_status():
    """Show status of transformed vs original files"""
    print("=" * 60)
    print("TRANSFORMATION STATUS")
    print("=" * 60)

    # Get all modules
    original_modules = sorted([d for d in FM_UPDATE_DIR.iterdir() if d.is_dir()])
    transformed_modules = sorted([d for d in TRANSFORMED_DIR.iterdir() if d.is_dir()]) if TRANSFORMED_DIR.exists() else []

    print(f"\n📁 Original files: {FM_UPDATE_DIR}")
    print(f"📁 Transformed files: {TRANSFORMED_DIR}")
    print()

    total_original = 0
    total_transformed = 0

    for mod_dir in original_modules:
        mod_name = mod_dir.name
        original_count = len(list(mod_dir.glob("*.html")))
        total_original += original_count

        transformed_dir = TRANSFORMED_DIR / mod_name
        if transformed_dir.exists():
            transformed_count = len(list(transformed_dir.glob("*.html")))
            total_transformed += transformed_count
            status = "✅" if transformed_count >= original_count else f"⏳ {transformed_count}/{original_count}"
        else:
            transformed_count = 0
            status = "❌ Not started"

        print(f"  {mod_name}: {original_count} lessons → {status}")

    print()
    print(f"Total: {total_transformed}/{total_original} lessons transformed")
    print()


def apply_transformed():
    """Copy transformed files to FM-Update folder"""
    print("=" * 60)
    print("APPLYING TRANSFORMED FILES")
    print("=" * 60)

    if not TRANSFORMED_DIR.exists():
        print("❌ No transformed files found!")
        return False

    copied = 0
    for module_dir in TRANSFORMED_DIR.iterdir():
        if module_dir.is_dir():
            target_dir = FM_UPDATE_DIR / module_dir.name
            if target_dir.exists():
                for html_file in module_dir.glob("*.html"):
                    target_file = target_dir / html_file.name
                    shutil.copy2(html_file, target_file)
                    print(f"  ✅ {module_dir.name}/{html_file.name}")
                    copied += 1

    print()
    print(f"Copied {copied} files to FM-Update/")
    return True


def import_to_database():
    """Run the import script to push lessons to database"""
    print("=" * 60)
    print("IMPORTING TO DATABASE")
    print("=" * 60)

    import_script = BASE_DIR / "scripts" / "import-all-fm-lessons.ts"

    if not import_script.exists():
        print(f"❌ Import script not found: {import_script}")
        return False

    print(f"Running: npx tsx {import_script}")
    print()

    try:
        result = subprocess.run(
            ["npx", "tsx", str(import_script)],
            cwd=str(BASE_DIR),
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running import: {e}")
        return False


# =============================================================================
# MAIN FUNCTION
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="AccrediPro Lesson Transformer - Complete Workflow",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
EXAMPLES:
  # Transform Module 6 only (dry run)
  python scripts/transform-parallel.py --modules Module_06

  # Transform ALL modules 2-20 (dry run)
  python scripts/transform-parallel.py

  # Check transformation status
  python scripts/transform-parallel.py --status

  # Apply transformed files to FM-Update
  python scripts/transform-parallel.py --apply

  # Import to database
  python scripts/transform-parallel.py --import-db

  # Full workflow: transform + apply + import
  python scripts/transform-parallel.py --live --import-db
        """
    )

    # Transform options
    parser.add_argument("--modules", type=str,
                        help="Comma-separated modules (e.g., Module_06,Module_07)")
    parser.add_argument("--workers", type=int, default=4,
                        help="Number of parallel workers (default: 4)")
    parser.add_argument("--live", action="store_true",
                        help="Write directly to FM-Update (skip dry run)")

    # Workflow options
    parser.add_argument("--status", action="store_true",
                        help="Show transformation status")
    parser.add_argument("--apply", action="store_true",
                        help="Copy FM-Transformed to FM-Update")
    parser.add_argument("--import-db", action="store_true",
                        help="Import lessons to database")

    args = parser.parse_args()

    # Handle status check
    if args.status:
        show_status()
        return

    # Handle apply only
    if args.apply and not args.modules:
        apply_transformed()
        if args.import_db:
            import_to_database()
        return

    # Handle import only
    if args.import_db and not args.modules and not args.apply:
        import_to_database()
        return

    # Transform workflow
    dry_run = not args.live

    print("=" * 60)
    print("ACCREDIPRO LESSON TRANSFORMER")
    print("=" * 60)
    print(f"Mode: {'🔴 LIVE (FM-Update)' if not dry_run else '🟢 DRY RUN (FM-Transformed)'}")
    print(f"Workers: {args.workers}")
    print(f"API Keys: {len(API_KEYS)}")
    print()

    # Get lessons
    if args.modules:
        modules = args.modules.split(",")
    else:
        modules = None

    lessons = get_lessons_to_process(modules)
    print(f"Found {len(lessons)} lessons to process")
    print()

    if not lessons:
        print("No lessons found!")
        return

    # Process in parallel
    success = 0
    failed = 0
    start_time = time.time()

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {}
        for i, lesson in enumerate(lessons):
            api_key = API_KEYS[i % len(API_KEYS)]
            future = executor.submit(transform_lesson, lesson, api_key, dry_run)
            futures[future] = lesson

        for future in concurrent.futures.as_completed(futures):
            ok, msg = future.result()
            print(msg)
            if ok:
                success += 1
            else:
                failed += 1

    elapsed = time.time() - start_time

    print()
    print("=" * 60)
    print("TRANSFORMATION COMPLETE")
    print("=" * 60)
    print(f"✅ Success: {success}")
    print(f"❌ Failed: {failed}")
    print(f"⏱️  Time: {elapsed:.1f}s ({elapsed/max(1,success+failed):.1f}s per lesson)")
    print(f"📁 Output: {'FM-Update/' if not dry_run else 'FM-Transformed/'}")
    print()

    # If dry run, show next steps
    if dry_run and success > 0:
        print("NEXT STEPS:")
        print("  1. Review files in FM-Transformed/")
        print("  2. Run: python scripts/transform-parallel.py --apply")
        print("  3. Run: python scripts/transform-parallel.py --import-db")
        print()

    # Auto-import if requested
    if args.import_db and success > 0:
        print()
        import_to_database()


if __name__ == "__main__":
    main()
