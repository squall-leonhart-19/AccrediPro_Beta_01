#!/usr/bin/env python3
"""
AccrediPro TURBO Generator v6.0 - PARALLEL BLUEPRINT SYSTEM
Maximum speed WITH reliability:
- Pass 1: Generate module outlines IN PARALLEL (37 parallel calls, ~5 sec)
- Pass 2: Generate full lessons with hybrid parallelism (4 modules at once)
- Pass 3: Verify completeness and identify gaps
"""

import sys
import os
import json
import asyncio
import csv
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import re

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core import APIKeyPool, CourseDatabase, GeminiGenerator, QualityChecker
from prompts import (
    SYSTEM_INSTRUCTION, QUIZ_PROMPT, FINAL_EXAM_PROMPT, 
    CAREER_EARNINGS_CONTENT, MODULE_15_ENDING_CONTENT
)

from dotenv import load_dotenv
# Load environment variables from Desktop/config.env for security
# This file is outside the repo and easier for user to access
load_dotenv(os.path.expanduser('~/Desktop/config.env'))

# Optional: Thumbnail generation (requires Claude + WaveSpeed API keys)
try:
    from generate_ai_thumbnails import generate_thumbnail, LEVEL_CONFIG, ANTHROPIC_API_KEYS, WAVESPEED_API_KEYS
    THUMBNAILS_AVAILABLE = True
except ImportError:
    THUMBNAILS_AVAILABLE = False


# ============================================================================
# CATEGORY COLOR THEMES - Each category has a unique color palette
# ============================================================================
CATEGORY_THEMES = {
    # FUNCTIONAL MEDICINE & HEALTH
    "FUNCTIONAL MEDICINE": {
        "primary": "#047857",
        "gradient": "linear-gradient(135deg, #047857 0%, #059669 100%)",
        "highlight": "#ecfdf5",
        "accent": "#B8860B"
    },
    
    # WOMEN'S HEALTH
    "WOMEN'S HEALTH & HORMONES": {
        "primary": "#9f1239",
        "gradient": "linear-gradient(135deg, #9f1239 0%, #be123c 100%)",
        "highlight": "#fff1f2",
        "accent": "#B8860B"
    },
    
    # MENTAL HEALTH
    "MENTAL HEALTH & NERVOUS SYSTEM": {
        "primary": "#6d28d9",
        "gradient": "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
        "highlight": "#f5f3ff",
        "accent": "#B8860B"
    },
    
    # GRIEF & BEREAVEMENT
    "GRIEF & BEREAVEMENT": {
        "primary": "#7c3aed",
        "gradient": "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
        "highlight": "#f5f3ff",
        "accent": "#B8860B"
    },
    
    # NARCISSISTIC ABUSE
    "NARCISSISTIC ABUSE & RELATIONSHIP TRAUMA": {
        "primary": "#881337",
        "gradient": "linear-gradient(135deg, #881337 0%, #be123c 100%)",
        "highlight": "#fdf2f8",
        "accent": "#B8860B"
    },
    
    # FAITH-BASED
    "FAITH-BASED COACHING": {
        "primary": "#1e3a5f",
        "gradient": "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
        "highlight": "#eff6ff",
        "accent": "#B8860B"
    },
    
    # SPIRITUAL & ENERGY
    "SPIRITUAL HEALING & ENERGY WORK": {
        "primary": "#4338ca",
        "gradient": "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
        "highlight": "#eef2ff",
        "accent": "#B8860B"
    },
    "SPIRITUAL & ENERGY": {
        "primary": "#4338ca",
        "gradient": "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
        "highlight": "#eef2ff",
        "accent": "#B8860B"
    },
    
    # HERBALISM
    "HERBALISM & PLANT MEDICINE": {
        "primary": "#166534",
        "gradient": "linear-gradient(135deg, #166534 0%, #22c55e 100%)",
        "highlight": "#f0fdf4",
        "accent": "#B8860B"
    },
    
    # NUTRITION
    "NUTRITION & LIFESTYLE": {
        "primary": "#059669",
        "gradient": "linear-gradient(135deg, #059669 0%, #10b981 100%)",
        "highlight": "#ecfdf5",
        "accent": "#B8860B"
    },
    "DIET & NUTRITION APPROACHES": {
        "primary": "#059669",
        "gradient": "linear-gradient(135deg, #059669 0%, #10b981 100%)",
        "highlight": "#ecfdf5",
        "accent": "#B8860B"
    },
    
    # GUT HEALTH
    "GUT HEALTH": {
        "primary": "#0f766e",
        "gradient": "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
        "highlight": "#f0fdfa",
        "accent": "#B8860B"
    },
    
    # HORMONES & METABOLISM
    "HORMONES & METABOLISM": {
        "primary": "#be185d",
        "gradient": "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
        "highlight": "#fdf2f8",
        "accent": "#B8860B"
    },
    
    # AUTOIMMUNE
    "AUTOIMMUNE & INFLAMMATION": {
        "primary": "#0891b2",
        "gradient": "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)",
        "highlight": "#ecfeff",
        "accent": "#B8860B"
    },
    
    # LIFE COACHING
    "LIFE COACHING & PERSONAL DEVELOPMENT": {
        "primary": "#059669",
        "gradient": "linear-gradient(135deg, #059669 0%, #10b981 100%)",
        "highlight": "#ecfdf5",
        "accent": "#B8860B"
    },
    
    # YOGA & MOVEMENT
    "YOGA & MOVEMENT": {
        "primary": "#7c3aed",
        "gradient": "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
        "highlight": "#f5f3ff",
        "accent": "#B8860B"
    },
    
    # PET WELLNESS
    "PET WELLNESS & ANIMAL CARE": {
        "primary": "#c2410c",
        "gradient": "linear-gradient(135deg, #c2410c 0%, #f97316 100%)",
        "highlight": "#fff7ed",
        "accent": "#B8860B"
    },
    
    # BUSINESS
    "BUSINESS & PRACTICE BUILDING": {
        "primary": "#1d4ed8",
        "gradient": "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
        "highlight": "#eff6ff",
        "accent": "#B8860B"
    },
    
    # EMOTIONAL & HOLISTIC
    "EMOTIONAL & HOLISTIC WELLNESS": {
        "primary": "#7c3aed",
        "gradient": "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
        "highlight": "#f5f3ff",
        "accent": "#B8860B"
    },
    
    # PARENTING
    "PARENTING": {
        "primary": "#0284c7",
        "gradient": "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
        "highlight": "#f0f9ff",
        "accent": "#B8860B"
    },
    
    # NEURODIVERSITY
    "NEURODIVERSITY": {
        "primary": "#7c3aed",
        "gradient": "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
        "highlight": "#f5f3ff",
        "accent": "#B8860B"
    },
    
    # FERTILITY & BIRTH
    "FERTILITY, BIRTH & POSTPARTUM": {
        "primary": "#db2777",
        "gradient": "linear-gradient(135deg, #db2777 0%, #f472b6 100%)",
        "highlight": "#fdf2f8",
        "accent": "#B8860B"
    },
    
    # MEN'S HEALTH
    "MEN'S HEALTH": {
        "primary": "#1e40af",
        "gradient": "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
        "highlight": "#eff6ff",
        "accent": "#B8860B"
    },
    
    # FITNESS
    "FITNESS & ATHLETIC PERFORMANCE": {
        "primary": "#dc2626",
        "gradient": "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
        "highlight": "#fef2f2",
        "accent": "#B8860B"
    },
    
    # AYURVEDA
    "AYURVEDA & TRADITIONAL MEDICINE": {
        "primary": "#b45309",
        "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
        "highlight": "#fffbeb",
        "accent": "#B8860B"
    },
    
    # BODYWORK
    "BODYWORK & MASSAGE THERAPY": {
        "primary": "#0d9488",
        "gradient": "linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)",
        "highlight": "#f0fdfa",
        "accent": "#B8860B"
    },
    
    # BIOHACKING
    "BIOHACKING & LONGEVITY": {
        "primary": "#4f46e5",
        "gradient": "linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)",
        "highlight": "#eef2ff",
        "accent": "#B8860B"
    },
    
    # ADDICTION
    "ADDICTION & RECOVERY": {
        "primary": "#0369a1",
        "gradient": "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
        "highlight": "#f0f9ff",
        "accent": "#B8860B"
    },
    
    # SEXUAL WELLNESS
    "SEXUAL WELLNESS & INTIMACY": {
        "primary": "#be185d",
        "gradient": "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
        "highlight": "#fdf2f8",
        "accent": "#B8860B"
    },
    
    # LGBTQ+
    "LGBTQ+ & INCLUSIVE WELLNESS": {
        "primary": "#7c3aed",
        "gradient": "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
        "highlight": "#f5f3ff",
        "accent": "#B8860B"
    },
    
    # SENIOR
    "SENIOR & END-OF-LIFE": {
        "primary": "#475569",
        "gradient": "linear-gradient(135deg, #475569 0%, #64748b 100%)",
        "highlight": "#f8fafc",
        "accent": "#B8860B"
    },
    
    # ADVANCED FUNCTIONAL MEDICINE
    "ADVANCED FUNCTIONAL MEDICINE": {
        "primary": "#065f46",
        "gradient": "linear-gradient(135deg, #065f46 0%, #047857 100%)",
        "highlight": "#ecfdf5",
        "accent": "#B8860B"
    },
    
    # HEALTHCARE PROFESSIONALS
    "HEALTHCARE PROFESSIONAL TRACKS": {
        "primary": "#0f766e",
        "gradient": "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
        "highlight": "#f0fdfa",
        "accent": "#B8860B"
    },
    
    # CLINICAL
    "CLINICAL & CONDITION-SPECIFIC": {
        "primary": "#0891b2",
        "gradient": "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)",
        "highlight": "#ecfeff",
        "accent": "#B8860B"
    },
    
    # DEFAULT FALLBACK
    "DEFAULT": {
        "primary": "#047857",
        "gradient": "linear-gradient(135deg, #047857 0%, #059669 100%)",
        "highlight": "#ecfdf5",
        "accent": "#B8860B"
    }
}


# ============================================================================
# PREDEFINED METHODOLOGIES - 8-Pixel Launch
# ============================================================================
PREDEFINED_METHODOLOGIES = {
    "Narcissistic Abuse Recovery Coach": {
        "acronym": "NARC",
        "full_name": "The N.A.R.C. Recovery Method™",
        "letters": [
            {"letter": "N", "meaning": "Navigate the Reality", "description": "Recognize narcissistic abuse patterns, understand manipulation tactics, validate experiences, and break through denial."},
            {"letter": "A", "meaning": "Acknowledge the Wounds", "description": "Understand trauma bonds, process complex emotions, identify C-PTSD symptoms, and reduce shame."},
            {"letter": "R", "meaning": "Rebuild Identity", "description": "Rediscover authentic self, establish healthy boundaries, reclaim personal power."},
            {"letter": "C", "meaning": "Claim Your Power", "description": "Build resilience, develop healthy relationship skills, create a fulfilling post-recovery life."}
        ]
    },
    "Energy Healing Practitioner": {
        "acronym": "BALANCE",
        "full_name": "The B.A.L.A.N.C.E. Protocol™",
        "letters": [
            {"letter": "B", "meaning": "Biofield Assessment", "description": "Evaluate the client's energy field and overall vitality."},
            {"letter": "A", "meaning": "Align Chakras", "description": "Balance and harmonize the seven major energy centers."},
            {"letter": "L", "meaning": "Lifeforce Activation", "description": "Stimulate the flow of vital life energy (prana/chi)."},
            {"letter": "A", "meaning": "Activate Healing", "description": "Facilitate the body's natural healing mechanisms."},
            {"letter": "N", "meaning": "Neutralize Blocks", "description": "Clear energetic blockages and stagnant patterns."},
            {"letter": "C", "meaning": "Clear Energy Field", "description": "Purify and protect the aura from external influences."},
            {"letter": "E", "meaning": "Empower Client", "description": "Teach self-care practices for ongoing energy maintenance."}
        ]
    },
    "Life Coach": {
        "acronym": "LIFE",
        "full_name": "The L.I.F.E. Blueprint Method™",
        "letters": [
            {"letter": "L", "meaning": "Listen", "description": "Deep, active listening to understand client's full story."},
            {"letter": "I", "meaning": "Identify", "description": "Clarify goals, uncover blocks, map the gap."},
            {"letter": "F", "meaning": "Focus", "description": "Develop strategy, prioritize, create clear roadmaps."},
            {"letter": "E", "meaning": "Execute", "description": "Build accountability, take action, maintain momentum."}
        ]
    },
    "Conscious Parenting Coach": {
        "acronym": "RAISE",
        "full_name": "The R.A.I.S.E. Framework™",
        "letters": [
            {"letter": "R", "meaning": "Respond", "description": "Replace reactive parenting with thoughtful responses."},
            {"letter": "A", "meaning": "Attune", "description": "Develop deep emotional attunement and secure attachment."},
            {"letter": "I", "meaning": "Intentional", "description": "Practice purpose-driven parenting aligned with values."},
            {"letter": "S", "meaning": "Support", "description": "Nurture each child's unique developmental needs."},
            {"letter": "E", "meaning": "Empower", "description": "Build independence, confidence, and self-regulation."}
        ]
    },
    "Grief & Loss Coach": {
        "acronym": "GRACE",
        "full_name": "The G.R.A.C.E. Method™",
        "letters": [
            {"letter": "G", "meaning": "Grounded", "description": "Stabilize in the immediate aftermath of loss."},
            {"letter": "R", "meaning": "Recognize", "description": "Acknowledge the reality and depth of the loss."},
            {"letter": "A", "meaning": "Accept", "description": "Process emotions without judgment or timelines."},
            {"letter": "C", "meaning": "Continue", "description": "Maintain continuing bonds while adapting."},
            {"letter": "E", "meaning": "Emerge", "description": "Create a new identity that honors the past."}
        ]
    },
    "LGBTQ+ Affirming Life Coach": {
        "acronym": "PRIDE",
        "full_name": "The P.R.I.D.E. Coaching Framework™",
        "letters": [
            {"letter": "P", "meaning": "Present", "description": "Create safe, affirming, judgment-free space."},
            {"letter": "R", "meaning": "Reflect", "description": "Explore identity and internalized narratives."},
            {"letter": "I", "meaning": "Identity", "description": "Clarify and celebrate authentic self-expression."},
            {"letter": "D", "meaning": "Develop", "description": "Build resilience and supportive networks."},
            {"letter": "E", "meaning": "Empower", "description": "Thrive authentically in all life areas."}
        ]
    },
    "Pet Wellness Coach": {
        "acronym": "PAWS",
        "full_name": "The P.A.W.S. Method™",
        "letters": [
            {"letter": "P", "meaning": "Prevent", "description": "Proactive nutrition, exercise, and preventive care."},
            {"letter": "A", "meaning": "Assess", "description": "Holistic evaluation of physical and emotional health."},
            {"letter": "W", "meaning": "Wellness", "description": "Customized wellness plans for nutrition and enrichment."},
            {"letter": "S", "meaning": "Sustain", "description": "Long-term health maintenance and aging support."}
        ]
    },
    "Christian Life Coach": {
        "acronym": "FAITH",
        "full_name": "The F.A.I.T.H. Coaching Method™",
        "letters": [
            {"letter": "F", "meaning": "Foundation", "description": "Build on biblical principles and scripture."},
            {"letter": "A", "meaning": "Align", "description": "Align life with God's purpose and calling."},
            {"letter": "I", "meaning": "Inspire", "description": "Encourage spiritual growth and deeper faith."},
            {"letter": "T", "meaning": "Transform", "description": "Renewal of mind and heart through Christ."},
            {"letter": "H", "meaning": "Hope", "description": "Cultivate hope and trust in God's faithfulness."}
        ]
    },
    # ========================================================================
    # NEW FLAGSHIP COURSES - 15-Pixel Architecture Completion
    # ========================================================================
    "Birth & Postpartum Doula": {
        "acronym": "BIRTH",
        "full_name": "The B.I.R.T.H. Support Method™",
        "letters": [
            {"letter": "B", "meaning": "Breathe & Center", "description": "Ground the mother with breath work, calm techniques, and presence during labor."},
            {"letter": "I", "meaning": "Inform & Educate", "description": "Empower with evidence-based information for informed decisions."},
            {"letter": "R", "meaning": "Reassure & Comfort", "description": "Provide physical comfort measures, emotional support, and continuous reassurance."},
            {"letter": "T", "meaning": "Transform the Experience", "description": "Help create a positive, empowering birth memory regardless of how labor unfolds."},
            {"letter": "H", "meaning": "Honor & Heal", "description": "Support postpartum recovery, bonding, and the sacred transition to motherhood."}
        ]
    },
    "Sex & Intimacy Coach": {
        "acronym": "INTIMATE",
        "full_name": "The I.N.T.I.M.A.T.E. Connection Method™",
        "letters": [
            {"letter": "I", "meaning": "Investigate", "description": "Explore sexual history, beliefs, and patterns without judgment."},
            {"letter": "N", "meaning": "Normalize", "description": "Reduce shame by normalizing desires, concerns, and variations in sexuality."},
            {"letter": "T", "meaning": "Trust", "description": "Build emotional safety and trust as the foundation for intimacy."},
            {"letter": "I", "meaning": "Ignite", "description": "Rekindle desire and passion through mindful practices."},
            {"letter": "M", "meaning": "Mindful Presence", "description": "Cultivate embodied awareness and present-moment connection."},
            {"letter": "A", "meaning": "Attune", "description": "Develop attunement to self and partner's needs and desires."},
            {"letter": "T", "meaning": "Transform", "description": "Heal sexual wounds, trauma, and limiting beliefs."},
            {"letter": "E", "meaning": "Expand", "description": "Expand capacity for pleasure, connection, and intimacy."}
        ]
    },
    "EFT Tapping Practitioner": {
        "acronym": "TAPPING",
        "full_name": "The T.A.P.P.I.N.G. Protocol™",
        "letters": [
            {"letter": "T", "meaning": "Target the Issue", "description": "Identify the specific emotion, memory, or belief to address."},
            {"letter": "A", "meaning": "Assess Intensity", "description": "Rate the emotional intensity on the 0-10 SUDS scale."},
            {"letter": "P", "meaning": "Prepare with Setup", "description": "Create the setup statement with acceptance and acknowledgment."},
            {"letter": "P", "meaning": "Point Sequence", "description": "Tap through the meridian points while voicing the issue."},
            {"letter": "I", "meaning": "Investigate Changes", "description": "Check in with body sensations and emotional shifts."},
            {"letter": "N", "meaning": "Navigate Aspects", "description": "Address different aspects and layers that emerge."},
            {"letter": "G", "meaning": "Ground & Integrate", "description": "Complete the session with positive statements and integration."}
        ]
    },
    "Integrative Medicine Practitioner": {
        "acronym": "BRIDGE",
        "full_name": "The B.R.I.D.G.E. Method™",
        "letters": [
            {"letter": "B", "meaning": "Blend Approaches", "description": "Integrate conventional medicine with evidence-based natural therapies."},
            {"letter": "R", "meaning": "Root Cause Analysis", "description": "Look beyond symptoms to identify underlying imbalances."},
            {"letter": "I", "meaning": "Individualize Care", "description": "Create personalized protocols based on genetics, lifestyle, and preferences."},
            {"letter": "D", "meaning": "Data-Driven Decisions", "description": "Use functional lab testing and biomarkers to guide treatment."},
            {"letter": "G", "meaning": "Guide the Journey", "description": "Educate and empower patients to take ownership of their health."},
            {"letter": "E", "meaning": "Evolve & Optimize", "description": "Continuously refine approach based on outcomes and new research."}
        ]
    },
    # ========================================================================
    # WOMEN'S HEALTH & HORMONES - Priority Launch
    # ========================================================================
    "Women's Hormone Health Coach": {
        "acronym": "HARMONY",
        "full_name": "The H.A.R.M.O.N.Y. Method™",
        "letters": [
            {"letter": "H", "meaning": "Hormone Assessment", "description": "Comprehensive evaluation of hormone levels, symptoms, and menstrual patterns."},
            {"letter": "A", "meaning": "Address Root Causes", "description": "Identify underlying triggers: stress, toxins, nutrition, gut health."},
            {"letter": "R", "meaning": "Restore Balance", "description": "Implement targeted protocols to rebalance the HPO axis."},
            {"letter": "M", "meaning": "Metabolic Optimization", "description": "Support insulin sensitivity, thyroid function, and adrenal health."},
            {"letter": "O", "meaning": "Optimize Lifestyle", "description": "Sleep, stress management, circadian rhythm, and exercise programming."},
            {"letter": "N", "meaning": "Nourish & Replenish", "description": "Evidence-based nutrition, supplementation, and detoxification."},
            {"letter": "Y", "meaning": "Your Sustainable Plan", "description": "Long-term maintenance and hormonal resilience building."}
        ]
    },
    "Certified Women's Hormone Health Coach": {
        "acronym": "HARMONY",
        "full_name": "The H.A.R.M.O.N.Y. Method™",
        "letters": [
            {"letter": "H", "meaning": "Hormone Assessment", "description": "Comprehensive evaluation of hormone levels, symptoms, and menstrual patterns."},
            {"letter": "A", "meaning": "Address Root Causes", "description": "Identify underlying triggers: stress, toxins, nutrition, gut health."},
            {"letter": "R", "meaning": "Restore Balance", "description": "Implement targeted protocols to rebalance the HPO axis."},
            {"letter": "M", "meaning": "Metabolic Optimization", "description": "Support insulin sensitivity, thyroid function, and adrenal health."},
            {"letter": "O", "meaning": "Optimize Lifestyle", "description": "Sleep, stress management, circadian rhythm, and exercise programming."},
            {"letter": "N", "meaning": "Nourish & Replenish", "description": "Evidence-based nutrition, supplementation, and detoxification."},
            {"letter": "Y", "meaning": "Your Sustainable Plan", "description": "Long-term maintenance and hormonal resilience building."}
        ]
    },
    "Menopause Support Coach": {
        "acronym": "THRIVE",
        "full_name": "The T.H.R.I.V.E. Menopause Method™",
        "letters": [
            {"letter": "T", "meaning": "Transition Understanding", "description": "Understand the perimenopause-menopause continuum and what's happening."},
            {"letter": "H", "meaning": "Hormone Literacy", "description": "Education on estrogen, progesterone, and their declining patterns."},
            {"letter": "R", "meaning": "Relief Strategies", "description": "Evidence-based approaches for hot flashes, sleep, and mood."},
            {"letter": "I", "meaning": "Integrate Support", "description": "Nutrition, botanicals, and lifestyle modifications."},
            {"letter": "V", "meaning": "Vitality Restoration", "description": "Reclaim energy, libido, and cognitive clarity."},
            {"letter": "E", "meaning": "Embrace the Next Chapter", "description": "Reframe menopause as a powerful life transition."}
        ]
    },
    "Fertility & Prenatal Coach": {
        "acronym": "BLOOM",
        "full_name": "The B.L.O.O.M. Fertility Method™",
        "letters": [
            {"letter": "B", "meaning": "Body Preparation", "description": "Optimize preconception health, detoxification, and nutrient status."},
            {"letter": "L", "meaning": "Learn Your Cycle", "description": "Cycle tracking, ovulation awareness, and fertile window identification."},
            {"letter": "O", "meaning": "Optimize Hormones", "description": "Support progesterone, estrogen balance, and ovarian function."},
            {"letter": "O", "meaning": "Overcome Obstacles", "description": "Address PCOS, endometriosis, thyroid issues, and fertility blockers."},
            {"letter": "M", "meaning": "Mindset & Support", "description": "Emotional resilience, stress reduction, and the fertility journey."}
        ]
    },
    # ========================================================================
    # GENERAL HEALTH & WELLNESS
    # ========================================================================
    "Holistic Nutrition Coach": {
        "acronym": "NOURISH",
        "full_name": "The N.O.U.R.I.S.H. Framework™",
        "letters": [
            {"letter": "N", "meaning": "Needs Assessment", "description": "Evaluate dietary history, symptoms, and nutritional status."},
            {"letter": "O", "meaning": "Optimize Macros", "description": "Balance protein, fats, and carbohydrates for individual needs."},
            {"letter": "U", "meaning": "Uncover Sensitivities", "description": "Identify food intolerances, allergies, and inflammatory triggers."},
            {"letter": "R", "meaning": "Repair the Gut", "description": "Support microbiome, digestion, and intestinal integrity."},
            {"letter": "I", "meaning": "Implement Changes", "description": "Practical meal planning, shopping, and preparation strategies."},
            {"letter": "S", "meaning": "Supplement Wisely", "description": "Evidence-based supplementation to fill gaps."},
            {"letter": "H", "meaning": "Habits for Life", "description": "Build sustainable eating patterns and mindful eating practices."}
        ]
    },
    "Functional Medicine Practitioner": {
        "acronym": "ROOT",
        "full_name": "The R.O.O.T. Cause Method™",
        "letters": [
            {"letter": "R", "meaning": "Review & Assess", "description": "Comprehensive health history and functional lab analysis."},
            {"letter": "O", "meaning": "Organize the Data", "description": "Create a functional medicine matrix connecting symptoms to systems."},
            {"letter": "O", "meaning": "Optimize Systems", "description": "Address gut, hormones, detox, immune, and mitochondrial function."},
            {"letter": "T", "meaning": "Transform & Maintain", "description": "Long-term protocols and lifestyle medicine for lasting health."}
        ]
    }
}


# ============================================================================
# NOMENCLATURE LOOKUP - Load metadata from CSV for database integration
# ============================================================================
NOMENCLATURE_CSV_PATH = Path(__file__).parent.parent.parent / "docs" / "technical" / "course-nomenclature-full.csv"

def get_nomenclature(course_name: str) -> Optional[Dict]:
    """
    Lookup course metadata from nomenclature CSV.
    Returns dict with slug, category, coach, tags, SKUs, page slugs, etc.
    """
    if not NOMENCLATURE_CSV_PATH.exists():
        print(f"⚠️ Nomenclature CSV not found: {NOMENCLATURE_CSV_PATH}")
        return None
    
    try:
        with open(NOMENCLATURE_CSV_PATH, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Match by course name (case-insensitive, flexible)
                csv_name = row.get('Course Name', '').strip()
                if not csv_name:
                    continue
                
                # Try exact match first
                if csv_name.lower() == course_name.lower():
                    return _parse_nomenclature_row(row)
                
                # Try partial match (e.g., "Narcissistic Abuse Recovery Coach" matches "Certified Narcissistic Abuse Recovery Coach™")
                if course_name.lower() in csv_name.lower() or csv_name.lower() in course_name.lower():
                    return _parse_nomenclature_row(row)
    except Exception as e:
        print(f"⚠️ Error reading nomenclature CSV: {e}")
    
    return None

def _parse_nomenclature_row(row: Dict) -> Dict:
    """Parse a CSV row into structured nomenclature dict"""
    return {
        "slug": row.get('L1 Slug', '').strip(),
        "category": row.get('Category', '').strip(),
        "coach": row.get('Coach', 'Sarah').strip(),
        "pixelId": row.get('Pixel ID', '').strip(),
        "courseCode": row.get('Course Code', '').strip(),
        "courseName": row.get('Course Name', '').strip(),
        "tags": {
            "l1": row.get('L1 Tag', '').strip(),
            "pro": row.get('PRO Tag', '').strip()
        },
        "slugs": {
            "l1": row.get('L1 Slug', '').strip(),
            "l2": row.get('L2 Slug', '').strip(),
            "l3": row.get('L3 Slug', '').strip(),
            "l4": row.get('L4 Slug', '').strip()
        },
        "skus": {
            "l1": row.get('CF L1 SKU', '').strip(),
            "pro": row.get('CF PRO SKU', '').strip()
        },
        "pages": {
            "sales": row.get('Sales Page Slug', '').strip(),
            "checkout": row.get('Checkout Slug', '').strip(),
            "oto": row.get('OTO 1 Slug', '').strip(),
            "thankYou": row.get('Thank You Page Slug', '').strip()
        },
        "pricing": {
            "l1": row.get('L1 Price', '97').strip() or '97',
            "pro": row.get('PRO Price', '497').strip() or '497'
        },
        "status": row.get('Status', 'NOT LAUNCHED').strip()
    }


def get_category_theme(category: str) -> Dict:
    """
    Get the color theme for a category.
    Returns the theme dict with primary, gradient, highlight, accent colors.
    Falls back to DEFAULT if category not found.
    """
    # Try exact match first
    if category in CATEGORY_THEMES:
        return CATEGORY_THEMES[category]
    
    # Try partial match (category may be a subset or superset of the key)
    category_upper = category.upper().strip()
    for key, theme in CATEGORY_THEMES.items():
        if key in category_upper or category_upper in key:
            return theme
    
    # Fallback to default
    return CATEGORY_THEMES["DEFAULT"]


def build_color_theme_instruction(theme: Dict) -> str:
    """Build the color theme instruction for injection into prompts."""
    return f"""
=== MANDATORY COLOR THEME (USE THESE EXACT COLORS) ===
PRIMARY COLOR: {theme['primary']}
HEADER GRADIENT: {theme['gradient']}
HIGHLIGHT/BOX BACKGROUND: {theme['highlight']}
ACCENT COLOR (GOLD): {theme['accent']}

You MUST use these exact colors in your CSS:
- .module-header background: {theme['gradient']}
- .box-label, .module-label color: {theme['primary']}
- .toc-box .section-num background: {theme['primary']}
- .highlight, .stat-highlight color: {theme['primary']}
- .objectives-box, .case-study border-left color: {theme['primary']}
- Links hover color: {theme['primary']}
- Footer branding color: {theme['primary']}
- Gold accent (borders, underlines): {theme['accent']}

=== MANDATORY INTERACTIVE COMPONENTS (COPY EXACTLY) ===

For "Check Your Understanding" section, use this EXACT CSS and HTML structure:

CSS:
.check-understanding {{
    background: #fdfbf7;
    border: 2px solid {theme['accent']};
    border-radius: 16px;
    padding: 35px;
    margin: 50px 0;
}}
.check-understanding .box-label {{
    font-weight: 700;
    color: #8B6914;
    margin-bottom: 25px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
}}
.question-item {{
    background: white;
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 20px;
    border: 1px solid #e5e7eb;
}}
.reveal-btn {{
    background: {theme['primary']};
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 15px;
}}
.answer-text {{
    display: none;
    margin-top: 20px;
    padding: 20px;
    background: #f0fdf4;
    border-radius: 8px;
    color: #166534;
    font-size: 16px;
    border-left: 4px solid #22c55e;
}}

HTML STRUCTURE:
<div class="check-understanding">
    <p class="box-label">Check Your Understanding</p>
    <div class="question-item">
        <p class="question-text"><strong>1. Question here?</strong></p>
        <button class="reveal-btn" onclick="toggleAnswer('ans1')">Show Answer</button>
        <div id="ans1" class="answer-text">Answer here...</div>
    </div>
</div>

JAVASCRIPT (at end of body):
<script>
function toggleAnswer(id) {{
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
}}
</script>

=== KEY TAKEAWAYS BOX (USE THEME COLOR - NOT BLACK) ===
.takeaways-box {{
    background: {theme['primary']};
    color: #ffffff;
    padding: 35px;
    border-radius: 16px;
    margin-top: 60px;
}}
.takeaways-box .box-label {{
    color: {theme['accent']};
    font-weight: 700;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 14px;
}}
.takeaways-box ul {{
    margin: 0;
    padding-left: 20px;
}}
.takeaways-box li {{
    margin-bottom: 12px;
    color: #ffffff;
}}

DO NOT modify these interactive component styles. They must work identically in every lesson.
"""


# ============================================================================
# OUTLINE PROMPT - PASS 1: Generate course blueprint
# ============================================================================
OUTLINE_BLUEPRINT_PROMPT = """Create a COMPLETE course blueprint for "{course_name}" certification.

This is a FULL CERTIFICATION with 37 modules. Generate detailed OUTLINES for every lesson.

=== COURSE STRUCTURE ===
L1 FOUNDATION (Modules 0-15): 124 lessons
L2 ADVANCED (Modules 22-29): 64 lessons  
L3 MASTER (Modules 30-35): 48 lessons
L4 PRACTICE (Modules 36-42): 56 lessons
TOTAL: 292 lessons

Methodology: {methodology}

Generate a JSON blueprint with DETAILED lesson outlines (not just titles):

{{
  "course_name": "{course_name}",
  "total_lessons": 292,
  "modules": [
    {{
      "number": 0,
      "title": "Introduction & Career Vision",
      "tier": "L1",
      "has_quiz": false,
      "lessons": [
        {{
          "number": 1,
          "title": "Welcome to AccrediPro",
          "outline": [
            "Course overview and learning journey map",
            "The {methodology_name} framework introduction",
            "Career opportunities overview",
            "Certification credentials and recognition",
            "How to succeed in this program"
          ]
        }},
        ...4 lessons for Module 0
      ]
    }},
    ...all 37 modules with 8 lessons each (except Module 0 with 4)
  ]
}}

Each lesson outline should have 4-6 specific bullet points describing what will be covered.
This blueprint ensures NO repetition and perfect continuity across all 292 lessons.

Return ONLY valid JSON."""


# ============================================================================
# SINGLE MODULE OUTLINE PROMPT - For parallel blueprint generation
# ============================================================================
SINGLE_MODULE_OUTLINE_PROMPT = """Generate a detailed module outline for:
Course: {course_name}
Module {module_num}: {module_title}
Tier: {tier}

Methodology: {methodology}

Context - Previous modules covered:
{previous_modules}

Generate EXACTLY {lesson_count} lessons for this module with detailed outlines.

Return JSON:
{{
  "number": {module_num},
  "title": "{module_title}",
  "tier": "{tier}",
  "has_quiz": {has_quiz},
  "lessons": [
    {{
      "number": 1,
      "title": "First Lesson Title Here",
      "outline": [
        "Point 1: Specific content to cover",
        "Point 2: Specific content to cover",
        "Point 3: Specific content to cover",
        "Point 4: Specific content to cover"
      ]
    }},
    {{
      "number": 2,
      "title": "Second Lesson Title Here",
      "outline": [...]  
    }},
    ... continue to lesson {lesson_count}
  ]
}}

IMPORTANT:
- Lesson numbers start from 1 and go up to {lesson_count} WITHIN this module
- Example: Module 3 has lessons 3.1, 3.2, 3.3... 3.8
- Each outline should have 4-6 specific bullet points
- Build on previous modules, don't repeat content
- Stay focused on {module_title}

Return ONLY valid JSON for this single module."""


# ============================================================================
# LEARNER PERSONA (Inject in all lessons)
# ============================================================================
LEARNER_PERSONA = """
TARGET LEARNER:
- 40-55 year old woman, United States
- Career changer (nurse, teacher, wellness enthusiast, stay-at-home mom pivoting)
- Mindset: Ambitious but may have imposter syndrome
- Desires: Financial freedom, meaningful work, legitimacy, flexibility
- Values: Professional credentials, practical skills, community support
- Tone: Warm, encouraging, professional, empowering
- Include: Income examples from practitioners like her, case studies featuring 40+ women
"""


# ============================================================================
# CATEGORY TO THEME MAPPING (for CSS file selection)
# ============================================================================
CATEGORY_TO_THEME = {
    "WOMEN'S HEALTH & HORMONES": "womens-health",
    "FUNCTIONAL MEDICINE": "functional-medicine",
    "MENTAL HEALTH & NERVOUS SYSTEM": "mental-health",
    "GRIEF & BEREAVEMENT": "grief-bereavement",
    "NARCISSISTIC ABUSE & RELATIONSHIP TRAUMA": "narcissistic-abuse",
    "FAITH-BASED COACHING": "faith-based",
    "SPIRITUAL HEALING & ENERGY WORK": "spiritual-energy",
    "SPIRITUAL & ENERGY": "spiritual-energy",
    "HERBALISM & PLANT MEDICINE": "herbalism",
    "PET WELLNESS & ANIMAL CARE": "pet-wellness",
    "BUSINESS & PRACTICE BUILDING": "business",
    "NUTRITION & LIFESTYLE": "functional-medicine",
    "GUT HEALTH": "functional-medicine",
    "HORMONES & METABOLISM": "womens-health",
    "AUTOIMMUNE & INFLAMMATION": "functional-medicine",
    "LIFE COACHING & PERSONAL DEVELOPMENT": "functional-medicine",
    "YOGA & MOVEMENT": "spiritual-energy",
    "EMOTIONAL & HOLISTIC WELLNESS": "mental-health",
    "PARENTING": "functional-medicine",
    "NEURODIVERSITY": "mental-health",
    "ADVANCED FUNCTIONAL MEDICINE": "functional-medicine",
    "DEFAULT": "functional-medicine"
}


def get_theme_slug(category: str) -> str:
    """Get the CSS theme file slug for a category."""
    if category in CATEGORY_TO_THEME:
        return CATEGORY_TO_THEME[category]
    # Try partial match
    category_upper = category.upper().strip()
    for key, theme in CATEGORY_TO_THEME.items():
        if key in category_upper or category_upper in key:
            return theme
    return CATEGORY_TO_THEME["DEFAULT"]


# ============================================================================
# HTML TEMPLATE (Wraps body-only content)
# ============================================================================
# Path structure: courses/[course-slug]/[tier]/[module]/Lesson.html
# Relative CSS path: ../../../../css/themes/... (4 levels up to courses/)
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{lesson_title}</title>
    <link rel="stylesheet" href="../../../../css/themes/{theme_slug}.css">
    <link rel="stylesheet" href="../../../../css/lesson-base.css">
</head>
<body>
{body_content}
    <script src="../../../../css/lesson-interactivity.js"></script>
</body>
</html>'''


# ============================================================================
# BODY-ONLY GENERATION INSTRUCTION
# ============================================================================
BODY_ONLY_INSTRUCTION = """
=== CRITICAL: BODY-ONLY OUTPUT ===
Generate ONLY the <body> content (the div.lesson-container and everything inside it).
DO NOT include: <!DOCTYPE>, <html>, <head>, <style>, or <body> tags.
The CSS is handled separately - just use these standardized class names:

REQUIRED COMPONENTS (use these exact class names):
- div.lesson-container - Main wrapper
- header.module-header - Header with .module-label, h1.lesson-title, .lesson-meta
- div.toc-box - Table of contents with .toc-list
- div.objectives-box - Learning objectives
- h2 (with id="section1", etc.) - Section headings
- div.case-study - Case study boxes
- div.data-table-container - For tables
- div.check-understanding - Quiz section with .question-item, button.reveal-btn, div.answer-text
- div.takeaways-box - Key takeaways (dark background)
- div.references-box - References list
- footer.lesson-footer - Footer branding

INTERACTIVE ELEMENTS (use onclick="showAnswer(this)"):
<button class="reveal-btn" onclick="showAnswer(this)">Show Answer</button>
<div class="answer-text">The answer here...</div>

OUTPUT FORMAT:
Start with: <div class="lesson-container">
End with: </div> (closing lesson-container)
"""


# ============================================================================
# LESSON PROMPT WITH FULL CONTEXT - PASS 2 (BODY-ONLY)
# ============================================================================
CONTEXTUAL_LESSON_PROMPT = """Generate a PREMIUM QUALITY HTML lesson for:
Course: {course_name}
Module {module_num}: {module_title}
Lesson {lesson_num}: {lesson_title}

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COURSE BLUEPRINT (Your context for continuity) ===
{course_blueprint}

=== PREVIOUS LESSONS IN THIS MODULE ===
{previous_lessons}

=== PREVIOUS MODULE SUMMARIES ===
{module_summaries}

=== THIS LESSON'S OUTLINE ===
{lesson_outline}

=== SAMPLE HTML STRUCTURE ===
{sample_html}

REQUIREMENTS:
1. Generate a COMPLETE HTML document with <!DOCTYPE html>, <head>, <style>, and <body>
2. Follow the EXACT HTML structure from sample
3. Cover ALL points in the lesson outline above
4. Bridge from previous lessons (avoid repetition)
5. Set up for upcoming lessons (use foreshadowing)
6. Reference the {methodology_name} framework throughout
7. Include: objectives-box, case studies, statistics, takeaways, references
8. Target 25-35KB of content
9. NO navigation CTAs
10. Use encouraging, empowering language for 40+ women career changers
11. Include realistic income examples and success stories

Return ONLY the complete HTML document."""


# ============================================================================
# PRACTICE LAB PROMPTS (Tier-specific for Lesson X.8)
# ============================================================================

PRACTICE_LAB_PROMPT_L1 = """Generate a COACHING PRACTICE LAB lesson (Lesson {lesson_num}) for:
Course: {course_name}
Module {module_num}: {module_title}

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COACH VOICE ===
Write as {coach_name}, a warm and experienced practitioner.
Use first-person occasionally: "In my practice, I've seen..."

=== MODULE CONTEXT ===
{module_summaries}

=== SAMPLE PRACTICE LAB HTML ===
{sample_html}

CREATE A BASIC COACHING SCENARIO that includes:
1. CLIENT PROFILE: A realistic 40-55 year old client with straightforward concerns
2. BACKGROUND: Health history, symptoms, goals (relatable to the module topic)
3. COACHING SCRIPT: Word-for-word dialogue the student can practice out loud
4. PRACTICE EXERCISE: "Say this out loud" prompts with recording suggestions
5. COMMON MISTAKES: 4-5 things new coaches typically do wrong
6. SUCCESS MARKERS: How to know the coaching session went well
7. ENCOURAGEMENT: "You're becoming a real coach!" energy

This is a PRACTICE LAB, not a content lesson. Focus on APPLICATION, not theory.
Target 20-25KB of content.

Return ONLY the complete HTML document."""


PRACTICE_LAB_PROMPT_L2 = """Generate an ADVANCED CLINICAL PRACTICE LAB lesson (Lesson {lesson_num}) for:
Course: {course_name}
Module {module_num}: {module_title}

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COACH VOICE ===
Write as {coach_name}, an experienced clinical mentor.

=== MODULE CONTEXT ===
{module_summaries}

=== SAMPLE PRACTICE LAB HTML ===
{sample_html}

CREATE A COMPLEX CLINICAL CASE that includes:
1. COMPLEX CLIENT PROFILE: Multiple overlapping conditions, medications, complications
2. CLINICAL REASONING PROCESS: Step-by-step thinking through the case
3. DIFFERENTIAL CONSIDERATIONS: What else could be going on? Priority ranking.
4. REFERRAL TRIGGERS: Red flags that require MD referral (scope of practice)
5. PHASED PROTOCOL PLAN: 3-phase intervention approach
6. TEACHING POINTS: Key clinical insights from this case

This is for ADVANCED practitioners. Include clinical depth and complexity.
Target 25-30KB of content.

Return ONLY the complete HTML document."""


PRACTICE_LAB_PROMPT_L3 = """Generate a SUPERVISION & MENTORING PRACTICE LAB lesson (Lesson {lesson_num}) for:
Course: {course_name}
Module {module_num}: {module_title}

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COACH VOICE ===
Write as {coach_name}, a master practitioner and mentor.

=== MODULE CONTEXT ===
{module_summaries}

=== SAMPLE PRACTICE LAB HTML ===
{sample_html}

CREATE A SUPERVISION SCENARIO where the student is MENTORING A NEW PRACTITIONER:
1. MENTEE PROFILE: A new L1 graduate who is eager but nervous
2. CASE THEY PRESENT: A client case they're unsure about
3. TEACHING APPROACH: Key points to cover with the mentee
4. FEEDBACK DIALOGUE: How to deliver constructive, encouraging feedback
5. SUPERVISION BEST PRACTICES: Do's and don'ts of mentoring
6. LEADERSHIP ENCOURAGEMENT: "You're becoming a leader in this field!"

Focus on TRAINING OTHERS, not direct client work.
Target 20-25KB of content.

Return ONLY the complete HTML document."""


PRACTICE_LAB_PROMPT_L4 = """Generate a BUSINESS PRACTICE LAB lesson (Lesson {lesson_num}) for:
Course: {course_name}
Module {module_num}: {module_title}

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COACH VOICE ===
Write as {coach_name}, a successful practitioner who has built a thriving practice.

=== MODULE CONTEXT ===
{module_summaries}

=== SAMPLE PRACTICE LAB HTML ===
{sample_html}

CREATE A BUSINESS SCENARIO that includes:
1. PROSPECT PROFILE: Someone interested in working with the student
2. DISCOVERY CALL SCRIPT: Full 30-minute call structure with exact dialogue
3. OBJECTION HANDLING: 3-4 common objections and confident responses
4. PRICING PRESENTATION: How to confidently state prices
5. CALL-TO-ACTION PRACTICE: Closing lines to practice out loud
6. INCOME POTENTIAL: Realistic monthly income scenarios (2, 5, 10 clients)

Focus on CLIENT ACQUISITION and SALES, not clinical work.
Include real income numbers that feel achievable.
Target 25-30KB of content.

Return ONLY the complete HTML document."""


# Dictionary for tier-specific Practice Lab prompts
PRACTICE_LAB_PROMPTS = {
    'L1': PRACTICE_LAB_PROMPT_L1,
    'L2': PRACTICE_LAB_PROMPT_L2,
    'L3': PRACTICE_LAB_PROMPT_L3,
    'L4': PRACTICE_LAB_PROMPT_L4
}


# ============================================================================
# MODULE RESOURCES PROMPT (Generate worksheets, templates, checklists)
# ============================================================================

MODULE_RESOURCE_PROMPT = """Generate a PROFESSIONAL RESOURCE DOCUMENT for:
Course: {course_name}
Module {module_num}: {module_title}

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== MODULE LESSONS COVERED ===
{module_lessons}

=== RESOURCE TYPE: {resource_type} ===

Generate an HTML document that serves as a practical {resource_type} for this module.
The document should be printable, professional, and immediately usable by practitioners.

STYLING REQUIREMENTS:
- Use clean, professional styling (burgundy #9f1239, gold #B8860B accents)
- Printable format (no excessive background colors)
- Clear sections with checkboxes or fillable spaces
- Professional branding with AccrediPro Academy header
- Mobile-responsive design

CONTENT REQUIREMENTS for {resource_type}:

IF "Client Intake Form":
- Personal information section
- Health history questions specific to module topic
- Current symptoms checklist
- Goals and expectations section
- Consent/agreement area

IF "Assessment Worksheet":
- Scoring rubrics or assessment criteria
- Client observation checklist
- Symptom tracking grid
- Progress indicators
- Space for notes

IF "Coaching Session Checklist":
- Pre-session preparation steps
- Key points to cover from module lessons
- Questions to ask client
- Documentation reminders
- Post-session action items

IF "Protocol Template":
- Step-by-step intervention guide
- Dosing/timing recommendations (scope-appropriate)
- Follow-up schedule
- Client handout section
- Red flag indicators

IF "Quick Reference Guide":
- Key concepts from module in bullet form
- Decision trees or flowcharts
- Common scenarios and responses
- Resource links

Return ONLY the complete HTML document with embedded CSS.
"""

RESOURCE_TYPES_BY_TIER = {
    'L1': ['Client Intake Form', 'Assessment Worksheet', 'Coaching Session Checklist'],
    'L2': ['Assessment Worksheet', 'Protocol Template', 'Quick Reference Guide'],
    'L3': ['Supervision Checklist', 'Case Review Template', 'Advanced Protocol Template'],
    'L4': ['Business Planning Worksheet', 'Client Contract Template', 'Pricing Calculator']
}


# ============================================================================
# MODULE 0: ONBOARDING LESSON PROMPTS (Warm Welcome & Career Vision)
# ============================================================================

MODULE_0_LESSON_1_PROMPT = """Generate a WARM WELCOME & INTRODUCTION lesson for:
Course: {course_name}
Lesson 0.1: Welcome to Your New Career

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COACH INTRODUCTION ===
You are {coach_name}, the lead coach and creator of this certification program.
Write in FIRST PERSON throughout. This is a personal letter from you to the student.
Be warm, welcoming, excited to have them, and EMOTIONAL.

=== SAMPLE HTML STRUCTURE ===
{sample_html}

=== LESSON STRUCTURE ===
Create a lesson that includes:

1. PERSONAL WELCOME FROM COACH (First 30% of lesson)
   - "Hi, I'm {coach_name}, and I am SO excited you're here..."
   - Your personal story of becoming a practitioner
   - Why you created this program
   - A heartfelt message about transformation
   - "I believe in you" energy

2. YOU BELONG HERE (The "Am I Too Old?" Section)
   - Address imposter syndrome directly
   - "If you're in your 40s, 50s, or beyond - you're EXACTLY who we need"
   - Why life experience is your superpower
   - Case studies of career changers just like them

3. WHAT YOU'LL LEARN & BECOME
   - The transformation journey ahead
   - From "interested in health" to "certified professional"
   - Skills you'll master
   - The credential you'll earn

4. YOUR COHORT & COMMUNITY
   - You're not alone on this journey
   - Join your Private Practice Group (POD)
   - Meet fellow students just like you
   - Support system overview

5. FIRST STEPS
   - What to do right now to get started
   - How to get the most from this program
   - Encouragement to continue to Lesson 0.2

TONE: Warm, personal, encouraging, like a mentor welcoming you with open arms.
NO CLINICAL CONTENT in this lesson. Pure welcome and connection.
Target 25-30KB of content.

Return ONLY the complete HTML document."""


MODULE_0_LESSON_2_PROMPT = """Generate a CAREER VISION & EARNINGS lesson for:
Course: {course_name}
Lesson 0.2: Your Career Path & Earning Potential

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COACH VOICE ===
Write as {coach_name}, sharing real success stories and income possibilities.
Be inspiring but realistic. Use specific dollar amounts.

=== SAMPLE HTML STRUCTURE ===
{sample_html}

=== LESSON STRUCTURE ===
Create a lesson that includes:

1. THE "CAN I ACTUALLY MAKE MONEY?" CONVERSATION
   - Address the fear directly: "I know you're wondering..."
   - Validate their concerns
   - Transition to proof and possibilities

2. 8 CAREER PATHS (With Income Ranges)
   Present each with specific examples:
   - Private Practice (1-on-1): $5,000 - $20,000/month
   - Group Programs: $3,000 - $50,000/launch
   - Corporate Wellness: $2,000 - $10,000/month retainer
   - Integrative Clinic Teams: $60,000 - $150,000/year
   - Online Courses: Passive income $1,000 - $15,000/month
   - Speaking & Workshops: $500 - $5,000/event
   - Writing & Content: Books, blogs, brand partnerships
   - Hybrid Model: Combining multiple paths

3. REALISTIC TIMELINE TO INCOME
   - Month 1-3: Learning, first practice clients
   - Month 4-6: First paying clients, $1,000-3,000/month
   - Month 7-12: Building momentum, $5,000-10,000/month
   - Year 2+: Scaling, $10,000-25,000+/month

4. SUCCESS STORIES (3-4 Real Examples)
   Feature 40+ women career changers:
   - Former nurse now earning $12K/month
   - Teacher who transitioned to $8K/month part-time
   - Stay-at-home mom building $6K/month practice
   Include quotes, timelines, specific numbers

5. THE MATH THAT MAKES SENSE
   - Show the numbers: 5 clients x $400/month = $2,000
   - 15 clients x $600/month = $9,000
   - Group program: 20 people x $500 = $10,000/launch
   - Make it feel ACHIEVABLE

6. YOUR 90-DAY VISION EXERCISE
   - Interactive prompt: "Close your eyes and imagine..."
   - What does your practice look like?
   - Who are your clients?
   - What's your monthly income goal?

TONE: Inspiring, specific, realistic, with social proof from women like them.
Target 25-30KB of content.

Return ONLY the complete HTML document."""


MODULE_0_LESSON_3_PROMPT = """Generate a PROGRAM OVERVIEW & WHAT TO EXPECT lesson for:
Course: {course_name}
Lesson 0.3: Your Journey Through Certification

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COACH VOICE ===
Write as {coach_name}, walking them through exactly what's ahead.

=== SAMPLE HTML STRUCTURE ===
{sample_html}

=== LESSON STRUCTURE ===
Create a lesson that includes:

1. THE 4-TIER TRANSFORMATION
   Explain the learning journey:
   - L1 FOUNDATION (Modules 1-15): Core methodology, fundamentals
   - L2 ADVANCED (Modules 16-23): Complex cases, clinical depth
   - L3 MASTER (Modules 24-29): Train others, supervision skills
   - L4 PRACTICE (Modules 30-36): Build your business, get clients

2. WHAT MAKES THIS DIFFERENT
   - Not just theory - practical coaching skills
   - Practice Labs in every module - real scenarios
   - You'll learn to COACH, not just know information
   - By Module 5, you'll feel like a real practitioner

3. THE METHODOLOGY FRAMEWORK
   - Introduce the {methodology_name} briefly
   - "This is the backbone of everything you'll learn"
   - Promise of what it will do for their clients

4. TIME COMMITMENT & PACING
   - Recommended pace: X lessons per week
   - "Life happens" flexibility
   - How to stay on track
   - Support when you fall behind

5. RESOURCES INCLUDED
   - PDF downloads in every module
   - Client templates ready to use
   - Assessment tools
   - Scripts and protocols

6. CERTIFICATION REQUIREMENTS
   - Complete all 4 tiers
   - Pass assessments
   - Your professional certificate
   - What it means for your career

TONE: Organized, clear, exciting about the journey ahead.
Target 20-25KB of content.

Return ONLY the complete HTML document."""


MODULE_0_LESSON_4_PROMPT = """Generate a SCOPE OF PRACTICE & GETTING STARTED lesson for:
Course: {course_name}
Lesson 0.4: Scope of Practice & Your Next Step

=== TARGET AUDIENCE ===
""" + LEARNER_PERSONA + """

=== COACH VOICE ===
Write as {coach_name}, being clear about professional boundaries while staying encouraging.

=== SAMPLE HTML STRUCTURE ===
{sample_html}

=== LESSON STRUCTURE ===
Create a lesson that includes:

1. WHAT YOU CAN AND CANNOT DO
   - Clarity on scope of practice
   - "We educate, we don't diagnose"
   - Working alongside (not replacing) medical professionals
   - The power and boundaries of coaching

2. LEGAL CONSIDERATIONS
   - Brief overview of health coaching legality
   - Insurance and liability basics
   - Staying in your lane professionally

3. ETHICS & PROFESSIONALISM
   - Client confidentiality
   - Professional conduct
   - When to refer out
   - Building trust and credibility

4. YOUR FIRST ACTION STEPS
   - Join your POD (Private Practice Group)
   - Introduce yourself to the community
   - Set your study schedule
   - Download Module 1 resources

5. A PERSONAL MESSAGE TO CLOSE
   - {coach_name}'s final welcome words
   - "I'm honored to be on this journey with you"
   - "See you in Module 1!"
   - Motivational send-off

TONE: Professional but warm, clear but encouraging.
Target 20-25KB of content.

Return ONLY the complete HTML document."""


# Dictionary for Module 0 onboarding prompts
MODULE_0_PROMPTS = {
    1: MODULE_0_LESSON_1_PROMPT,
    2: MODULE_0_LESSON_2_PROMPT,
    3: MODULE_0_LESSON_3_PROMPT,
    4: MODULE_0_LESSON_4_PROMPT
}


# ============================================================================
# AI METHODOLOGY GENERATION PROMPT
# ============================================================================
METHODOLOGY_PROMPT = """Create a unique coaching methodology/framework for the following certification program.

Course Name: {course_name}

The methodology should be a memorable ACRONYM (4-8 letters) that spells something meaningful related to the topic.

Examples:
- "Narcissistic Abuse Recovery Coach" → N.A.R.C. Recovery Method™
- "Grief & Loss Coach" → G.R.A.C.E. Method™  
- "Life Coach" → L.I.F.E. Blueprint Method™
- "Women's Hormone Health Coach" → H.A.R.M.O.N.Y. Method™

Return ONLY a JSON object with this exact structure:
{{
    "acronym": "WORD",
    "full_name": "The W.O.R.D. Framework™",
    "letters": [
        {{"letter": "W", "meaning": "First Step", "description": "Brief description of this step."}},
        {{"letter": "O", "meaning": "Second Step", "description": "Brief description of this step."}},
        {{"letter": "R", "meaning": "Third Step", "description": "Brief description of this step."}},
        {{"letter": "D", "meaning": "Fourth Step", "description": "Brief description of this step."}}
    ]
}}"

Requirements:
1. The acronym should be a real word or meaningful combination related to the niche
2. Each letter represents a step in the coaching process
3. Steps should flow logically from assessment to transformation
4. Keep descriptions concise but clinically meaningful
5. Return ONLY valid JSON, no markdown or explanation"""


# Continuation prompt
CONTINUE_PROMPT = """Continue generating from where you stopped.

Partial content:
{partial_content}

Continue EXACTLY from where this ends. Output ONLY remaining HTML with closing tags."""


class TurboGenerator:
    """Two-Pass Generator: Outlines first, then full content with context"""
    
    def __init__(self, course_name: str, fill_gaps: bool = False, generate_thumbnails: bool = False):
        self.course_name = course_name
        self.fill_gaps = fill_gaps
        self.generate_thumbnails = generate_thumbnails
        self.config = self._load_config()
        self.db = CourseDatabase()
        self.key_pool = APIKeyPool(self.config['api_keys'])
        self.generator = GeminiGenerator(self.key_pool, self.config['model'])
        self.quality_checker = QualityChecker()
        self.full_sample = self._load_full_sample()
        
        self.course_id = None
        self.methodology = None
        self.blueprint = None  # Full course blueprint with outlines
        self.module_summaries = {}  # Generated summaries for context
        self.nomenclature = None  # Metadata from nomenclature CSV
        
    def _load_config(self) -> Dict:
        keys_str = os.getenv('GEMINI_API_KEYS', '')
        keys = [k.strip() for k in keys_str.split(',') if k.strip()]
        
        return {
            'api_keys': keys,
            'model': os.getenv('GEMINI_MODEL', 'gemini-2.0-flash'),
            'output_dir': Path(os.getenv('OUTPUT_DIR', '../../courses')),
            'reference_dir': Path(os.getenv('REFERENCE_DIR', './reference')),
            'max_retries': int(os.getenv('MAX_RETRIES', 4)),  # Fewer retries, faster
            'parallel_lessons': int(os.getenv('PARALLEL_LESSONS', 4)),  # Parallel within module
            'max_continue_attempts': int(os.getenv('MAX_CONTINUE_ATTEMPTS', 2)),
        }
    
    def _load_full_sample(self) -> str:
        """Load sample lesson for template"""
        paths_to_try = [
            self.config['reference_dir'],
            Path(__file__).parent.parent.parent / "newcourses/FM-Update/Module_01",
            Path(__file__).parent.parent.parent / "courses/holistic-nutrition-practitioner/Module_01",
        ]
        
        for path in paths_to_try:
            if path.exists():
                for html_file in sorted(path.glob('*.html'))[:1]:
                    try:
                        content = html_file.read_text()
                        if len(content) > 15000:
                            print(f"📄 Loaded sample: {html_file.name} ({len(content)//1000}KB)")
                            return content[:25000]  # Truncate for prompt size
                    except:
                        pass
        
        print("⚠️ No sample lesson found")
        return ""
    
    def _load_practice_lab_sample(self, tier: str) -> str:
        """Load tier-specific Practice Lab sample template"""
        # Map tiers to their Practice Lab sample files
        practice_lab_files = {
            'L1': 'practice_lab_l1_basic.html',
            'L2': 'practice_lab_l2_clinical.html',
            'L3': 'practice_lab_l3_supervision.html',
            'L4': 'practice_lab_l4_business.html'
        }
        
        filename = practice_lab_files.get(tier, 'practice_lab_l1_basic.html')
        sample_path = self.config['reference_dir'] / filename
        
        if sample_path.exists():
            try:
                content = sample_path.read_text()
                print(f"📄 Loaded Practice Lab sample: {filename} ({len(content)//1000}KB)")
                return content[:25000]  # Truncate for prompt size
            except Exception as e:
                print(f"⚠️ Error loading Practice Lab sample: {e}")
        
        # Fallback to regular sample if Practice Lab sample not found
        print(f"⚠️ Practice Lab sample not found: {filename}, using regular sample")
        return self.full_sample
    
    def _get_course_slug(self) -> str:
        return re.sub(r'[^a-z0-9]+', '-', self.course_name.lower()).strip('-')
    
    def _get_output_path(self) -> Path:
        return Path(__file__).parent / self.config['output_dir'] / self._get_course_slug()
    
    def _is_html_complete(self, html: str) -> bool:
        html_lower = html.lower()
        return '</html>' in html_lower and '</body>' in html_lower
    
    def _check_lesson_quality(self, html: str) -> Dict:
        size = len(html.encode('utf-8'))
        issues = []
        if not self._is_html_complete(html): issues.append("Incomplete HTML")
        if size < 5000: issues.append(f"Too short: {size}b")
        if '<html' not in html.lower(): issues.append("Missing HTML tag")
        return {'valid': len(issues) == 0, 'size': size, 'issues': issues}
    
    def _get_predefined_methodology(self) -> Optional[Dict]:
        return PREDEFINED_METHODOLOGIES.get(self.course_name)
    
    def _get_course_structure(self) -> List[Dict]:
        """Define the 37-module course structure"""
        methodology = self.methodology or {}
        acronym = methodology.get('acronym', 'METHOD')
        letters = methodology.get('letters', [])
        
        # Build structure based on methodology letters
        structure = []
        
        # Module 0: Introduction (4 lessons) - lessons numbered 1-4
        structure.append({
            'number': 0, 'title': 'Introduction & Career Vision', 'tier': 'L1',
            'has_quiz': False, 'lesson_count': 4
        })
        
        # L1 FOUNDATION: Modules 1-15 (8 lessons each)
        # Map methodology letters to modules
        for i, letter_info in enumerate(letters):
            structure.append({
                'number': i + 1,
                'title': f"{letter_info['letter']}: {letter_info['meaning']}",
                'tier': 'L1', 'has_quiz': True, 'lesson_count': 8
            })
        
        # Fill remaining L1 modules if methodology has fewer letters
        for m in range(len(letters) + 1, 16):
            structure.append({
                'number': m,
                'title': f"L1 Deep Dive Module {m}",
                'tier': 'L1', 'has_quiz': True, 'lesson_count': 8
            })
        
        # L2 ADVANCED: Modules 16-23 (8 lessons each)
        l2_topics = [
            "Advanced Case Studies", "Complex Client Scenarios", "Integration & Synthesis",
            "Research & Evidence", "Assessment Tools", "Treatment Planning",
            "Ethical Considerations", "Advanced Techniques"
        ]
        for i, topic in enumerate(l2_topics):
            structure.append({
                'number': 16 + i,
                'title': f"L2: {topic}",
                'tier': 'L2', 'has_quiz': True, 'lesson_count': 8
            })
        
        # L3 MASTER: Modules 24-29 (8 lessons each)
        l3_topics = [
            "Master Practitioner Skills", "Supervision & Mentoring",
            "Program Development", "Specialty Applications",
            "Crisis & Complex Cases", "Master Integration"
        ]
        for i, topic in enumerate(l3_topics):
            structure.append({
                'number': 24 + i,
                'title': f"L3: {topic}",
                'tier': 'L3', 'has_quiz': True, 'lesson_count': 8
            })
        
        # L4 PRACTICE: Modules 30-36 (8 lessons each)
        l4_topics = [
            "Building Your Practice", "Marketing & Client Acquisition",
            "Business Operations", "Legal & Compliance",
            "Group Programs & Workshops", "Scaling & Growth",
            "Certification & Final Review"
        ]
        for i, topic in enumerate(l4_topics):
            structure.append({
                'number': 30 + i,
                'title': f"L4: {topic}",
                'tier': 'L4', 'has_quiz': i < 6, 'lesson_count': 8
            })
        
        return structure
    
    # ========================================================================
    # PASS 1: PARALLEL Blueprint Generation (NEW - 37 parallel calls)
    # ========================================================================
    async def generate_single_module_outline(self, module_info: Dict, previous_modules: str) -> Optional[Dict]:
        """Generate outline for a single module"""
        methodology_str = json.dumps(self.methodology, indent=2) if self.methodology else "None"
        
        prompt = SINGLE_MODULE_OUTLINE_PROMPT.format(
            course_name=self.course_name,
            module_num=module_info['number'],
            module_title=module_info['title'],
            tier=module_info['tier'],
            methodology=methodology_str,
            previous_modules=previous_modules,
            lesson_count=module_info['lesson_count'],
            has_quiz='true' if module_info['has_quiz'] else 'false'
        )
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            try:
                text = result['text']
                json_match = re.search(r'\{[\s\S]*\}', text)
                if json_match:
                    module_data = json.loads(json_match.group())
                    return module_data
            except json.JSONDecodeError:
                pass
        
        return None
    
    async def generate_blueprint(self) -> Dict:
        """PASS 1: Generate course blueprint with PARALLEL module outline generation"""
        print(f"\n🗺️  PASS 1: Generating course blueprint (PARALLEL - 37 modules)...")
        
        structure = self._get_course_structure()
        print(f"📋 Course structure: {len(structure)} modules")
        
        # Generate all module outlines in parallel batches
        modules = []
        batch_size = min(10, len(self.config['api_keys']) // 2)  # Parallel batch size
        batch_size = max(4, batch_size)
        
        for i in range(0, len(structure), batch_size):
            batch = structure[i:i + batch_size]
            print(f"  🔄 Blueprint batch {i//batch_size + 1}/{(len(structure) + batch_size - 1)//batch_size}...")
            
            # Build previous modules context from already-generated modules
            prev_context = "\n".join([
                f"Module {m['number']}: {m['title']}" 
                for m in modules[-5:]  # Last 5 modules for context
            ]) if modules else "This is the first module"
            
            # Generate batch in parallel
            tasks = [
                self.generate_single_module_outline(mod_info, prev_context)
                for mod_info in batch
            ]
            batch_results = await asyncio.gather(*tasks)
            
            # Collect successful results
            for j, result in enumerate(batch_results):
                if result:
                    modules.append(result)
                    print(f"    ✅ Module {batch[j]['number']}: {len(result.get('lessons', []))} lessons")
                else:
                    # Fallback: create placeholder
                    print(f"    ⚠️ Module {batch[j]['number']}: Using fallback")
                    modules.append({
                        'number': batch[j]['number'],
                        'title': batch[j]['title'],
                        'tier': batch[j]['tier'],
                        'has_quiz': batch[j]['has_quiz'],
                        'lessons': self._generate_fallback_lessons(batch[j])
                    })
        
        # Sort by module number
        modules.sort(key=lambda m: m['number'])
        
        total_lessons = sum(len(m.get('lessons', [])) for m in modules)
        print(f"\n✅ Blueprint complete: {len(modules)} modules, {total_lessons} lessons outlined")
        
        # Build blueprint with nomenclature metadata for import
        blueprint = {
            'course_name': self.course_name,
            'total_lessons': total_lessons,
            'modules': modules
        }
        
        # Add nomenclature if available (for database import)
        if self.nomenclature:
            blueprint['nomenclature'] = self.nomenclature
            print(f"📋 Nomenclature embedded: {self.nomenclature['slug']}")
        
        return blueprint
    
    def _generate_fallback_lessons(self, module_info: Dict) -> List[Dict]:
        """Generate fallback lesson structure if API fails"""
        lessons = []
        for i in range(module_info['lesson_count']):
            lessons.append({
                'number': i + 1,  # Module-local numbering: 1, 2, 3, 4...
                'title': f"{module_info['title']} - Part {i + 1}",
                'outline': [
                    f"Key concepts for {module_info['title']}",
                    "Practical applications and examples",
                    "Case studies and real-world scenarios",
                    "Summary and key takeaways"
                ]
            })
        return lessons

    
    def _get_blueprint_context(self, current_module: int) -> str:
        """Get blueprint context string for a module"""
        if not self.blueprint:
            return "No blueprint available"
        
        lines = []
        for module in self.blueprint.get('modules', []):
            m_num = module['number']
            m_title = module['title']
            if m_num <= current_module + 2:  # Show current + 2 ahead
                lines.append(f"\nModule {m_num}: {m_title}")
                for lesson in module.get('lessons', [])[:4]:  # First 4 lessons
                    lines.append(f"  L{lesson['number']}: {lesson['title']}")
        
        return "\n".join(lines[:50])  # Limit size
    
    def _get_lesson_outline(self, module_num: int, lesson_num: int) -> str:
        """Get specific lesson outline from blueprint"""
        if not self.blueprint:
            return "No outline available"
        
        for module in self.blueprint.get('modules', []):
            if module['number'] == module_num:
                for lesson in module.get('lessons', []):
                    if lesson['number'] == lesson_num:
                        outline = lesson.get('outline', [])
                        return "\n".join(f"• {point}" for point in outline)
        
        return "No specific outline"
    
    # ========================================================================
    # PASS 2: Generate Full Lessons Sequentially with Context
    # ========================================================================
    async def generate_lesson(self, module: Dict, lesson: Dict, prev_lessons: List[str]) -> Optional[str]:
        """PASS 2: Generate a lesson with full context"""
        module_num = module['number']
        lesson_num = lesson['number']
        tier = module.get('tier', 'L1')
        
        # Build context
        blueprint_context = self._get_blueprint_context(module_num)
        lesson_outline = self._get_lesson_outline(module_num, lesson_num)
        module_summary_text = "\n".join(
            f"Module {k}: {v}" for k, v in sorted(self.module_summaries.items()) if k < module_num
        )[:2000]
        
        methodology_name = self.methodology.get('full_name', 'The Method') if self.methodology else "The Method"
        
        # Get coach name from nomenclature (default to "Sarah" if not available)
        coach_name = "Sarah"
        if self.nomenclature and self.nomenclature.get('coach'):
            coach_name = self.nomenclature['coach']
        
        # ====================================================================
        # LESSON TYPE DETECTION (Priority order: Module 0 → Practice Lab → Standard)
        # ====================================================================
        
        # 1. MODULE 0: Use dedicated onboarding prompts (warm welcome, career vision)
        if module_num == 0 and lesson_num in MODULE_0_PROMPTS:
            module_0_prompt = MODULE_0_PROMPTS[lesson_num]
            prompt = module_0_prompt.format(
                course_name=self.course_name,
                coach_name=coach_name,
                sample_html=self.full_sample,
                methodology_name=methodology_name
            )
        
        # 2. PRACTICE LAB: Lesson 8 of each module (except Module 0)
        elif lesson_num == 8 and module_num > 0:
            practice_lab_prompt = PRACTICE_LAB_PROMPTS.get(tier, PRACTICE_LAB_PROMPT_L1)
            practice_lab_sample = self._load_practice_lab_sample(tier)
            
            prompt = practice_lab_prompt.format(
                course_name=self.course_name,
                module_num=module_num,
                module_title=module['title'],
                lesson_num=lesson_num,
                coach_name=coach_name,
                module_summaries=module_summary_text if module_summary_text else "This is the first module",
                sample_html=practice_lab_sample
            )
        
        # 3. STANDARD CONTENT LESSON
        else:
            prompt = CONTEXTUAL_LESSON_PROMPT.format(
                course_name=self.course_name,
                module_num=module_num,
                module_title=module['title'],
                lesson_num=lesson_num,
                lesson_title=lesson['title'],
                course_blueprint=blueprint_context,
                previous_lessons="\n".join(prev_lessons[-5:]) if prev_lessons else "None",
                module_summaries=module_summary_text if module_summary_text else "This is the first module",
                lesson_outline=lesson_outline,
                sample_html=self.full_sample,
                methodology_name=methodology_name
            )
        
        # Add special celebration content for L1 graduation (Module 15.8)
        if module_num == 15 and lesson_num == 8:
            prompt += "\n\nCELEBRATORY FINAL LESSON:\n" + MODULE_15_ENDING_CONTENT
        
        # ====================================================================
        # INJECT COLOR THEME (Category-Based Branding)
        # ====================================================================
        category = ""
        if self.nomenclature and self.nomenclature.get('category'):
            category = self.nomenclature['category']
        
        theme = get_category_theme(category)
        color_instruction = build_color_theme_instruction(theme)
        prompt += "\n\n" + color_instruction
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if not result['success']:
            return None
        
        html = result['text']
        if html.startswith('```'):
            html = re.sub(r'^```html?\n?', '', html)
            html = re.sub(r'\n?```$', '', html)
        
        # Continue if incomplete
        attempts = 0
        while not self._is_html_complete(html) and attempts < self.config['max_continue_attempts']:
            attempts += 1
            print("↪", end="", flush=True)
            cont_prompt = CONTINUE_PROMPT.format(partial_content=html[-8000:])
            cont_result = await self.generator.generate(cont_prompt, SYSTEM_INSTRUCTION)
            if cont_result['success']:
                cont = cont_result['text']
                if cont.startswith('```'):
                    cont = re.sub(r'^```html?\n?', '', cont)
                    cont = re.sub(r'\n?```$', '', cont)
                html += cont
            await asyncio.sleep(0.2)
        
        return html
    
    async def generate_module(self, module: Dict) -> Dict:
        """Generate all lessons in a module SEQUENTIALLY for quality"""
        module_num = module['number']
        module_title = module['title']
        lessons = module.get('lessons', [])
        tier = module.get('tier', 'L1')
        
        output_path = self._get_output_path()
        
        # Organize by tier - standardized naming across all courses
        tier_dirs = {
            'L1': 'L1_Main',
            'L2': 'L2_Advanced', 
            'L3': 'L3_Master', 
            'L4': 'L4_Practice'
        }
        module_dir = output_path / tier_dirs.get(tier, 'L1_Main') / f"Module_{module_num:02d}"
        
        module_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\n📦 [{tier}] Module {module_num}: {module_title}")
        
        prev_lessons = []
        success_count = 0
        skipped_count = 0
        
        # Generate lessons SEQUENTIALLY for context
        for lesson in lessons:
            lesson_num = lesson['number']
            lesson_title = lesson['title']
            
            # Build filename to check if exists
            safe_title = lesson_title.replace(' ', '_').replace('/', '_').replace(':', '').replace('?', '').replace("'", '')[:50]
            filename = f"Lesson_{module_num}.{lesson_num}_{safe_title}.html"
            filepath = module_dir / filename
            
            # SKIP if file already exists (resume support)
            if filepath.exists():
                file_size = filepath.stat().st_size
                if file_size > 5000:  # Valid file is > 5KB
                    print(f"  ⏭️ M{module_num}.L{lesson_num}: {lesson_title[:30]}... (exists, {file_size//1000}KB)")
                    prev_lessons.append(f"L{lesson_num}: {lesson_title} - covered key topics")
                    success_count += 1
                    skipped_count += 1
                    continue
            
            print(f"  📝 M{module_num}.L{lesson_num}: {lesson_title[:30]}...", end=" ", flush=True)
            
            # Retry logic with exponential backoff
            for attempt in range(self.config['max_retries']):
                try:
                    html = await self.generate_lesson(module, lesson, prev_lessons)
                    
                    if html:
                        quality = self._check_lesson_quality(html)
                        if quality['valid']:
                            filepath.write_text(html)
                            print(f"✅ ({quality['size']//1000}KB)")
                            prev_lessons.append(f"L{lesson_num}: {lesson_title} - covered key topics")
                            success_count += 1
                            break
                        else:
                            print("⚠️", end=" ", flush=True)
                    else:
                        print("❌", end=" ", flush=True)
                except Exception as e:
                    print(f"⚠️ Error: {str(e)[:30]}", end=" ", flush=True)
                
                # Exponential backoff on retry
                await asyncio.sleep(0.5 * (attempt + 1))
            else:
                print("❌ Failed after retries")
        
        if skipped_count > 0:
            print(f"  ℹ️ Skipped {skipped_count} existing lessons")
        
        # Save module summary for next modules' context
        self.module_summaries[module_num] = f"{module_title} - {len(lessons)} lessons on {lessons[0]['title'] if lessons else 'various topics'}"
        
        # Generate quiz
        if module.get('has_quiz', True) and module_num > 0:
            quiz_path = module_dir / f"quiz_module_{module_num:02d}.json"
            print(f"  📋 Quiz...", end=" ", flush=True)
            quiz_prompt = QUIZ_PROMPT.format(
                course_name=self.course_name,
                module_number=module_num,
                module_title=module_title,
                lesson_summaries="\n".join(prev_lessons)
            )
            quiz_result = await self.generator.generate(quiz_prompt, SYSTEM_INSTRUCTION)
            if quiz_result['success']:
                quiz = quiz_result['text']
                if quiz.startswith('```'):
                    quiz = re.sub(r'^```json?\n?', '', quiz)
                    quiz = re.sub(r'\n?```$', '', quiz)
                quiz_path.write_text(quiz)
                print("✅")
            else:
                print("❌")
        
        return {
            'module_number': module_num,
            'module_title': module_title,
            'tier': tier,
            'lessons_created': success_count,
            'total_lessons': len(lessons)
        }
    
    async def generate_module_resources(self, module: Dict, module_dir: Path) -> int:
        """Generate resources for a module (worksheets, templates, checklists)"""
        module_num = module['number']
        module_title = module['title']
        tier = module.get('tier', 'L1')  # L1, L2, L3, or L4
        lessons = module.get('lessons', [])
        
        # Create Resources directory
        resources_dir = module_dir / "Resources"
        resources_dir.mkdir(exist_ok=True)
        
        # Get resource types for this tier
        resource_types = RESOURCE_TYPES_BY_TIER.get(tier, ['Coaching Session Checklist'])
        
        # Format lesson list for prompt
        module_lessons = "\n".join([f"- Lesson {l['number']}: {l['title']}" for l in lessons])
        
        # Get color theme
        category = self.nomenclature.get('category', '') if self.nomenclature else ''
        theme = get_category_theme(category)
        color_instruction = build_color_theme_instruction(theme)
        
        resources_created = 0
        
        for resource_type in resource_types:
            filename = resource_type.lower().replace(' ', '_').replace('/', '_') + '.html'
            filepath = resources_dir / filename
            
            # Skip if already exists
            if filepath.exists():
                continue
            
            prompt = MODULE_RESOURCE_PROMPT.format(
                course_name=self.course_name,
                module_num=module_num,
                module_title=module_title,
                module_lessons=module_lessons,
                resource_type=resource_type
            )
            prompt += "\n\n" + color_instruction
            
            result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
            
            if result['success']:
                html = result['text']
                if html.startswith('```'):
                    html = re.sub(r'^```html?\n?', '', html)
                    html = re.sub(r'\n?```$', '', html)
                
                filepath.write_text(html)
                resources_created += 1
        
        return resources_created
    
    async def run(self):
        """Main two-pass generation"""
        start_time = datetime.now()
        
        print("=" * 70)
        print(f"🚀 AccrediPro TURBO Generator v6.0 - PARALLEL BLUEPRINT")
        print(f"📚 Course: {self.course_name}")
        print(f"🔑 API Keys: {len(self.config['api_keys'])}")
        print(f"📄 Sample: {'✅' if self.full_sample else '❌'}")
        print(f"📋 Methodology: {'✅ PREDEFINED' if self._get_predefined_methodology() else '⚡ AI'}")
        print("=" * 70)
        
        output_path = self._get_output_path()
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Get methodology
        self.methodology = self._get_predefined_methodology()
        if not self.methodology:
            print("\n⚡ No predefined methodology, generating with AI...")
            # Generate methodology using AI
            prompt = METHODOLOGY_PROMPT.format(course_name=self.course_name)
            result = await self.generator.generate(prompt, "You are a curriculum designer creating coaching methodologies. Return ONLY valid JSON.")
            
            if result['success']:
                try:
                    # Parse the JSON response
                    text = result['text'].strip()
                    # Remove markdown code blocks if present
                    if text.startswith('```'):
                        text = re.sub(r'^```json?\n?', '', text)
                        text = re.sub(r'\n?```$', '', text)
                    self.methodology = json.loads(text)
                    print(f"   ✅ Created: {self.methodology.get('full_name', 'Unknown')}")
                except json.JSONDecodeError as e:
                    print(f"   ⚠️ Failed to parse AI methodology: {e}")
                    # Create a fallback generic methodology
                    self.methodology = {
                        "acronym": "COACH",
                        "full_name": "The C.O.A.C.H. Framework™",
                        "letters": [
                            {"letter": "C", "meaning": "Connect", "description": "Build rapport and understand the client's story."},
                            {"letter": "O", "meaning": "Observe", "description": "Assess symptoms, patterns, and root causes."},
                            {"letter": "A", "meaning": "Act", "description": "Implement targeted intervention strategies."},
                            {"letter": "C", "meaning": "Coach", "description": "Guide behavior change and skill development."},
                            {"letter": "H", "meaning": "Heal", "description": "Support long-term transformation and resilience."}
                        ]
                    }
            else:
                print(f"   ⚠️ AI generation failed, using fallback")
                self.methodology = {
                    "acronym": "COACH",
                    "full_name": "The C.O.A.C.H. Framework™",
                    "letters": [
                        {"letter": "C", "meaning": "Connect", "description": "Build rapport and understand the client's story."},
                        {"letter": "O", "meaning": "Observe", "description": "Assess symptoms, patterns, and root causes."},
                        {"letter": "A", "meaning": "Act", "description": "Implement targeted intervention strategies."},
                        {"letter": "C", "meaning": "Coach", "description": "Guide behavior change and skill development."},
                        {"letter": "H", "meaning": "Heal", "description": "Support long-term transformation and resilience."}
                    ]
                }
        else:
            print(f"\n✅ Using: {self.methodology['full_name']}")
        
        # Save methodology
        (output_path / "methodology.json").write_text(json.dumps(self.methodology, indent=2))
        
        # Load nomenclature metadata from CSV
        self.nomenclature = get_nomenclature(self.course_name)
        if self.nomenclature:
            print(f"📋 Nomenclature: {self.nomenclature['slug']} ({self.nomenclature['category']})")
            # Save nomenclature for import script
            (output_path / "nomenclature.json").write_text(json.dumps(self.nomenclature, indent=2))
        else:
            print("⚠️ No nomenclature found for this course")
        
        # PASS 1: Generate Blueprint
        blueprint_path = output_path / "course_blueprint.json"
        if blueprint_path.exists() and not self.fill_gaps:
            print(f"\n📋 Loading existing blueprint...")
            self.blueprint = json.loads(blueprint_path.read_text())
        else:
            self.blueprint = await self.generate_blueprint()
            if not self.blueprint:
                print("❌ Blueprint generation failed")
                return
            blueprint_path.write_text(json.dumps(self.blueprint, indent=2))
        
        # PASS 2: Generate Full Lessons - HYBRID: Parallel Modules, Sequential Lessons
        print(f"\n📝 PASS 2: Generating lessons (HYBRID: {min(4, len(self.config['api_keys']))} parallel modules)...")
        
        modules = self.blueprint.get('modules', [])
        results = []
        
        # Process modules in parallel batches (Use all keys for maximum speed)
        # With 19+ keys, we can do 18+ modules in parallel
        # Reserve 1 key for safety/overheads
        batch_size = max(4, len(self.config['api_keys']) - 1)
        
        for i in range(0, len(modules), batch_size):
            batch = modules[i:i + batch_size]
            print(f"\n🔄 Module Batch {i//batch_size + 1}/{(len(modules) + batch_size - 1)//batch_size} ({len(batch)} modules in parallel)...")
            
            # Generate batch in parallel
            batch_results = await asyncio.gather(*[
                self.generate_module(module) for module in batch
            ])
            
            results.extend(batch_results)
            
            # Update module summaries for context in next batch
            for result in batch_results:
                self.module_summaries[result['module_number']] = f"{result['module_title']} - {result['lessons_created']} lessons"
        
        # Generate final exam
        exam_path = output_path / "Final_Exam" / "final_exam.json"
        if not exam_path.exists():
            print(f"\n🎓 Generating Final Exam...")
            exam_prompt = FINAL_EXAM_PROMPT.format(
                course_name=self.course_name,
                methodology=json.dumps(self.methodology),
                module_summaries="\n".join(f"M{k}: {v}" for k, v in self.module_summaries.items())
            )
            exam_result = await self.generator.generate(exam_prompt, SYSTEM_INSTRUCTION)
            if exam_result['success']:
                exam_dir = output_path / "Final_Exam"
                exam_dir.mkdir(exist_ok=True)
                exam = exam_result['text']
                if exam.startswith('```'):
                    exam = re.sub(r'^```json?\n?', '', exam)
                    exam = re.sub(r'\n?```$', '', exam)
                exam_path.write_text(exam)
                print("✅")
        
        # PASS 4: RESOURCE GENERATION - DISABLED
        # TODO: Reimplemented as React components in /my-library instead of static HTML
        # See Option B: Interactive templates with save/print/download functionality
        # print(f"\n📚 PASS 4: Generating Module Resources...")
        # ...resource generation code disabled...
        
        # Summary
        duration = datetime.now() - start_time
        total_lessons = sum(r['lessons_created'] for r in results)
        
        # PASS 4: VERIFICATION - Count lessons and identify gaps
        print(f"\n🔍 PASS 4: Verification...")
        verification = self._verify_course(output_path)
        
        # PASS 5: THUMBNAILS (Optional - requires --thumbnails flag)
        thumbnails_generated = 0
        if self.generate_thumbnails:
            if THUMBNAILS_AVAILABLE:
                print(f"\n🖼️ PASS 5: Generating Thumbnails...")
                
                # Get base income/reviews from methodology or defaults
                base_income = 10000
                base_reviews = 500
                
                # Level → Tier folder mapping
                level_to_tier = {
                    "certified": "L1_Main",
                    "advanced": "L2_Advanced", 
                    "master": "L3_Master",
                    "practice": "L4_Practice"
                }
                
                for level, tier_folder in level_to_tier.items():
                    tier_path = output_path / tier_folder
                    if tier_path.exists():
                        print(f"  🖼️ {tier_folder}...", end=" ", flush=True)
                        try:
                            # Use round-robin API keys
                            idx = thumbnails_generated % len(ANTHROPIC_API_KEYS)
                            result = generate_thumbnail(
                                self.course_name,
                                base_income, base_reviews, level,
                                str(tier_path),  # Output to tier folder
                                "2k",
                                ANTHROPIC_API_KEYS[idx],
                                WAVESPEED_API_KEYS[idx % len(WAVESPEED_API_KEYS)],
                                1  # version
                            )
                            if result.get("status") == "success":
                                # Rename to {course-slug}_{tier}.png format
                                old_path = Path(result["image_path"])
                                # Generate course slug from name
                                course_slug = self.course_name.lower().replace(" ", "-").replace("'", "").replace("&", "and")
                                course_slug = re.sub(r'[^a-z0-9-]', '', course_slug)
                                # Get tier suffix (l1, l2, l3, l4)
                                tier_suffix = tier_folder.split("_")[0].lower()  # L1_Main -> l1
                                new_filename = f"{course_slug}_{tier_suffix}.png"
                                new_path = tier_path / new_filename
                                if old_path.exists():
                                    old_path.rename(new_path)
                                print(f"✅")
                                thumbnails_generated += 1
                            else:
                                print(f"❌ {result.get('error', 'Unknown error')}")
                        except Exception as e:
                            print(f"❌ {str(e)[:40]}")
                
                print(f"  📊 Thumbnails: {thumbnails_generated}/4")
            else:
                print(f"\n⚠️ PASS 5 skipped: generate_ai_thumbnails.py not found")
        
        print("\n" + "=" * 70)
        print(f"✅ GENERATION COMPLETE")
        print(f"📚 {self.course_name}")
        print(f"📁 {output_path}")
        print(f"📝 Lessons: {total_lessons} generated")
        print(f"🔍 Verified: {verification['total_files']} HTML files found")
        if thumbnails_generated > 0:
            print(f"🖼️ Thumbnails: {thumbnails_generated} generated")
        print(f"⏱️ Duration: {duration}")
        if verification['missing_modules']:
            print(f"⚠️ Missing modules: {verification['missing_modules']}")
        print("=" * 70)
        
        return {
            'course_name': self.course_name, 
            'lessons': total_lessons, 
            'duration': str(duration), 
            'success': True,
            'verification': verification,
            'thumbnails': thumbnails_generated
        }
    
    def _verify_course(self, output_path: Path) -> Dict:
        """Verify course completeness by counting files"""
        module_counts = {}
        total_files = 0
        missing_modules = []
        
        # Count HTML files in each module folder (modules are inside tier directories)
        tier_dirs = ['L1_Main', 'L2_Advanced', 'L3_Master', 'L4_Practice']
        for tier in tier_dirs:
            tier_path = output_path / tier
            if not tier_path.exists():
                continue
            for module_dir in sorted(tier_path.glob("Module_*")):
                module_num = int(module_dir.name.split("_")[1])
                html_files = list(module_dir.glob("*.html"))
                count = len(html_files)
                module_counts[module_num] = count
                total_files += count
                
                # Check if module is empty or has fewer than expected lessons
                expected = 4 if module_num == 0 else 8
                if count < expected:
                    missing_modules.append(f"M{module_num}({count}/{expected})")
        
        print(f"  📊 Module counts: {len(module_counts)} modules, {total_files} lessons")
        
        if missing_modules:
            print(f"  ⚠️ Incomplete: {', '.join(missing_modules[:10])}...")
        else:
            print(f"  ✅ All modules complete")
        
        return {
            'total_files': total_files,
            'module_counts': module_counts,
            'missing_modules': missing_modules
        }



# 8-Pixel Launch Catalog
PIXEL_CATALOG = [
    "Narcissistic Abuse Recovery Coach",
    "Christian Life Coach",
    "Life Coach",
    "Grief & Loss Coach",
    "Energy Healing Practitioner",
    "Conscious Parenting Coach",
    "Pet Wellness Coach",
    "LGBTQ+ Affirming Life Coach",
]


async def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python turbo_generator.py 'Course Name'")
        print("  python turbo_generator.py --queue")
        print("\n8-Pixel Courses:")
        for c in PIXEL_CATALOG:
            print(f"  • {c}")
        sys.exit(1)
    
    # Parse --thumbnails flag
    generate_thumbs = '--thumbnails' in sys.argv
    # Remove flags from argv for course name parsing
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    
    if '--queue' in sys.argv:
        for course in PIXEL_CATALOG:
            gen = TurboGenerator(course, generate_thumbnails=generate_thumbs)
            await gen.run()
    else:
        course_name = args[0] if args else None
        if not course_name:
            print("Error: No course name provided")
            sys.exit(1)
        gen = TurboGenerator(course_name, generate_thumbnails=generate_thumbs)
        await gen.run()


if __name__ == "__main__":
    asyncio.run(main())
