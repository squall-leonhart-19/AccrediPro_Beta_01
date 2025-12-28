#!/usr/bin/env python3
"""
BATCH GENERATOR - All 18 Courses with Pro Accelerator Structure
Run in background: nohup python3 generate_all_18.py > generation.log 2>&1 &
"""

import sys
import os
import json
import asyncio
from pathlib import Path
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
# Load from external folder to keep keys safe from git/detection
load_dotenv(os.path.expanduser('~/.accredipro-keys/config.env'))

from turbo_generator import TurboGenerator

# ============================================================================
# 18 COURSE METHODOLOGIES
# ============================================================================

COURSES_TO_GENERATE = [
    {
        "name": "Holistic Nutrition Coach",
        "methodology": {
            "acronym": "VITAL",
            "full_name": "The V.I.T.A.L. Nutrition Method™",
            "letters": [
                {"letter": "V", "meaning": "Vitality Assessment", "description": "Identify root causes and bio-individual needs through comprehensive lifestyle and metabolic analysis."},
                {"letter": "I", "meaning": "Inflammation & Immunity", "description": "Address systemic inflammation and gut health to restore immune resilience."},
                {"letter": "T", "meaning": "Targeted Nourishment", "description": "Use functional superfoods and therapeutic macronutrient balancing as medicine."},
                {"letter": "A", "meaning": "Aligned Lifestyle", "description": "Synchronize eating with circadian rhythms, stress management, and movement."},
                {"letter": "L", "meaning": "Longevity & Legacy", "description": "Create sustainable habits for lifelong health and empower clients to teach others."}
            ]
        }
    },
    {
        "name": "Stress & Burnout Coach",
        "methodology": {
            "acronym": "RESTORE",
            "full_name": "The R.E.S.T.O.R.E. Protocol™",
            "letters": [
                {"letter": "R", "meaning": "Recognize", "description": "Identify burnout signs, stress patterns, and nervous system dysregulation."},
                {"letter": "E", "meaning": "Evaluate", "description": "Assess cortisol patterns, sleep quality, and energy levels."},
                {"letter": "S", "meaning": "Stabilize", "description": "Regulate the nervous system through breathwork and grounding."},
                {"letter": "T", "meaning": "Transform", "description": "Shift limiting beliefs and create healthy boundaries."},
                {"letter": "O", "meaning": "Optimize", "description": "Build resilience through nutrition, movement, and lifestyle."},
                {"letter": "R", "meaning": "Reclaim", "description": "Restore passion, purpose, and sustainable energy."},
                {"letter": "E", "meaning": "Empower", "description": "Create long-term stress management strategies."}
            ]
        }
    },
    {
        "name": "Hormone Health Coach",
        "methodology": {
            "acronym": "BLOOM",
            "full_name": "The B.L.O.O.M. Method™",
            "letters": [
                {"letter": "B", "meaning": "Baseline Assessment", "description": "Evaluate hormones, symptoms, and life stage."},
                {"letter": "L", "meaning": "Listen to Your Body", "description": "Develop body awareness and cycle tracking."},
                {"letter": "O", "meaning": "Optimize Hormones", "description": "Balance estrogen, progesterone, and thyroid naturally."},
                {"letter": "O", "meaning": "Overcome Symptoms", "description": "Address hot flashes, mood swings, fatigue, and weight."},
                {"letter": "M", "meaning": "Maintain & Thrive", "description": "Build sustainable wellness practices for each life stage."}
            ]
        }
    },
    {
        "name": "Menopause Support Coach",
        "methodology": {
            "acronym": "THRIVE",
            "full_name": "The T.H.R.I.V.E. Menopause Method™",
            "letters": [
                {"letter": "T", "meaning": "Track Symptoms", "description": "Monitor and understand hormonal changes and symptoms."},
                {"letter": "H", "meaning": "Hormone Harmony", "description": "Natural approaches to balance shifting hormones."},
                {"letter": "R", "meaning": "Reset Metabolism", "description": "Address weight changes and metabolic shifts."},
                {"letter": "I", "meaning": "Inflammation Control", "description": "Reduce systemic inflammation through nutrition."},
                {"letter": "V", "meaning": "Vitality Boost", "description": "Restore energy, sleep, and cognitive function."},
                {"letter": "E", "meaning": "Embrace Change", "description": "Mindset and identity work for this life transition."}
            ]
        }
    },
    {
        "name": "Fertility & Prenatal Coach",
        "methodology": {
            "acronym": "CONCEIVE",
            "full_name": "The C.O.N.C.E.I.V.E. Framework™",
            "letters": [
                {"letter": "C", "meaning": "Cleanse & Prepare", "description": "Detox and prepare the body for conception."},
                {"letter": "O", "meaning": "Optimize Hormones", "description": "Balance reproductive hormones naturally."},
                {"letter": "N", "meaning": "Nourish", "description": "Fertility-focused nutrition and supplementation."},
                {"letter": "C", "meaning": "Cycle Awareness", "description": "Track and understand fertility windows."},
                {"letter": "E", "meaning": "Environment", "description": "Reduce toxins and create a fertility-friendly lifestyle."},
                {"letter": "I", "meaning": "Intimacy & Connection", "description": "Support emotional and relationship aspects."},
                {"letter": "V", "meaning": "Visualize", "description": "Mind-body techniques for conception."},
                {"letter": "E", "meaning": "Embrace Journey", "description": "Navigate challenges with resilience."}
            ]
        }
    },
    {
        "name": "Gut Health & Detox Specialist",
        "methodology": {
            "acronym": "DIGEST",
            "full_name": "The D.I.G.E.S.T. Protocol™",
            "letters": [
                {"letter": "D", "meaning": "Discover", "description": "Identify gut dysfunction, food sensitivities, and root causes."},
                {"letter": "I", "meaning": "Investigate", "description": "Assess microbiome, SIBO, leaky gut, and inflammation markers."},
                {"letter": "G", "meaning": "Gut Repair", "description": "Heal intestinal lining and restore barrier function."},
                {"letter": "E", "meaning": "Eliminate", "description": "Remove trigger foods, pathogens, and toxins."},
                {"letter": "S", "meaning": "Seed & Feed", "description": "Rebuild microbiome with probiotics and prebiotics."},
                {"letter": "T", "meaning": "Transform", "description": "Create sustainable gut health lifestyle."}
            ]
        }
    },
    {
        "name": "Autoimmune Specialist",
        "methodology": {
            "acronym": "CALM",
            "full_name": "The C.A.L.M. Autoimmune Protocol™",
            "letters": [
                {"letter": "C", "meaning": "Contain Inflammation", "description": "Identify and reduce inflammatory triggers."},
                {"letter": "A", "meaning": "Address Root Causes", "description": "Gut health, infections, toxins, and stress."},
                {"letter": "L", "meaning": "Lifestyle Medicine", "description": "AIP diet, sleep, movement, and stress management."},
                {"letter": "M", "meaning": "Maintain Remission", "description": "Long-term strategies for autoimmune management."}
            ]
        }
    },
    {
        "name": "Thyroid Health Coach",
        "methodology": {
            "acronym": "BALANCE",
            "full_name": "The B.A.L.A.N.C.E. Thyroid Method™",
            "letters": [
                {"letter": "B", "meaning": "Baseline Testing", "description": "Comprehensive thyroid panel interpretation."},
                {"letter": "A", "meaning": "Address Hashimoto's", "description": "Autoimmune thyroid support strategies."},
                {"letter": "L", "meaning": "Lifestyle Factors", "description": "Sleep, stress, and environmental impacts."},
                {"letter": "A", "meaning": "Anti-Inflammatory Nutrition", "description": "Thyroid-supportive diet protocols."},
                {"letter": "N", "meaning": "Nutrient Optimization", "description": "Iodine, selenium, zinc, and key nutrients."},
                {"letter": "C", "meaning": "Clear Toxins", "description": "Reduce thyroid-disrupting chemicals."},
                {"letter": "E", "meaning": "Energy Restoration", "description": "Rebuild metabolism and vitality."}
            ]
        }
    },
    {
        "name": "Diabetes & Blood Sugar Coach",
        "methodology": {
            "acronym": "STABLE",
            "full_name": "The S.T.A.B.L.E. Blood Sugar Method™",
            "letters": [
                {"letter": "S", "meaning": "Screen & Assess", "description": "Evaluate insulin resistance and metabolic markers."},
                {"letter": "T", "meaning": "Transform Nutrition", "description": "Low-glycemic, blood sugar balancing diet."},
                {"letter": "A", "meaning": "Activate Movement", "description": "Exercise for insulin sensitivity."},
                {"letter": "B", "meaning": "Balance Hormones", "description": "Cortisol, leptin, and metabolic hormones."},
                {"letter": "L", "meaning": "Lifestyle Reset", "description": "Sleep, stress, and circadian optimization."},
                {"letter": "E", "meaning": "Empower & Sustain", "description": "Long-term diabetes prevention strategies."}
            ]
        }
    },
    {
        "name": "Mental Wellness Coach",
        "methodology": {
            "acronym": "MINDFUL",
            "full_name": "The M.I.N.D.F.U.L. Wellness Method™",
            "letters": [
                {"letter": "M", "meaning": "Map Mental Patterns", "description": "Identify thought patterns and emotional triggers."},
                {"letter": "I", "meaning": "Integrate Mind-Body", "description": "Connect mental and physical wellness."},
                {"letter": "N", "meaning": "Nourish the Brain", "description": "Nutrition for mental health and neurotransmitters."},
                {"letter": "D", "meaning": "Develop Resilience", "description": "Build coping skills and emotional regulation."},
                {"letter": "F", "meaning": "Foster Connection", "description": "Social support and relationship health."},
                {"letter": "U", "meaning": "Understand Stress", "description": "Nervous system regulation techniques."},
                {"letter": "L", "meaning": "Live Purposefully", "description": "Create meaning and sustainable wellbeing."}
            ]
        }
    },
    {
        "name": "Sleep Health Coach",
        "methodology": {
            "acronym": "DREAM",
            "full_name": "The D.R.E.A.M. Sleep Method™",
            "letters": [
                {"letter": "D", "meaning": "Diagnose Sleep Issues", "description": "Identify insomnia types and sleep disorders."},
                {"letter": "R", "meaning": "Reset Circadian Rhythm", "description": "Light exposure and timing optimization."},
                {"letter": "E", "meaning": "Environment", "description": "Create the optimal sleep sanctuary."},
                {"letter": "A", "meaning": "Address Root Causes", "description": "Stress, hormones, and underlying issues."},
                {"letter": "M", "meaning": "Master Sleep Hygiene", "description": "Evidence-based sleep improvement strategies."}
            ]
        }
    },
    {
        "name": "Integrative Health Coach",
        "methodology": {
            "acronym": "WHOLE",
            "full_name": "The W.H.O.L.E. Health Method™",
            "letters": [
                {"letter": "W", "meaning": "Wellness Assessment", "description": "Comprehensive health evaluation across all systems."},
                {"letter": "H", "meaning": "Holistic Planning", "description": "Integrate conventional and alternative approaches."},
                {"letter": "O", "meaning": "Optimize Function", "description": "Address root causes, not just symptoms."},
                {"letter": "L", "meaning": "Lifestyle Medicine", "description": "Nutrition, movement, stress, and sleep."},
                {"letter": "E", "meaning": "Empower Self-Healing", "description": "Build client autonomy and health literacy."}
            ]
        }
    },
    {
        "name": "Weight Loss Coach",
        "methodology": {
            "acronym": "TRANSFORM",
            "full_name": "The T.R.A.N.S.F.O.R.M. Weight Method™",
            "letters": [
                {"letter": "T", "meaning": "Test Metabolism", "description": "Assess metabolic rate and hormonal factors."},
                {"letter": "R", "meaning": "Reset Habits", "description": "Break emotional eating and food patterns."},
                {"letter": "A", "meaning": "Anti-Inflammatory Diet", "description": "Reduce inflammation for fat loss."},
                {"letter": "N", "meaning": "Nourish & Satisfy", "description": "Nutrient-dense eating without deprivation."},
                {"letter": "S", "meaning": "Strengthen", "description": "Build muscle for metabolic health."},
                {"letter": "F", "meaning": "Fix Hormones", "description": "Balance leptin, insulin, and cortisol."},
                {"letter": "O", "meaning": "Optimize Lifestyle", "description": "Sleep, stress, and circadian factors."},
                {"letter": "R", "meaning": "Rewire Mindset", "description": "Address root causes of weight issues."},
                {"letter": "M", "meaning": "Maintain Forever", "description": "Sustainable long-term strategies."}
            ]
        }
    },
    {
        "name": "Plant-Based Nutrition Coach",
        "methodology": {
            "acronym": "PLANT",
            "full_name": "The P.L.A.N.T. Nutrition Method™",
            "letters": [
                {"letter": "P", "meaning": "Prepare & Plan", "description": "Meal planning and kitchen setup for success."},
                {"letter": "L", "meaning": "Learn Nutrients", "description": "Address B12, iron, protein, and key nutrients."},
                {"letter": "A", "meaning": "Anti-Inflammatory Foods", "description": "Maximize plant-based healing foods."},
                {"letter": "N", "meaning": "Nourish Gut Health", "description": "Fiber and microbiome optimization."},
                {"letter": "T", "meaning": "Thrive Long-Term", "description": "Sustainable plant-based lifestyle."}
            ]
        }
    },
    {
        "name": "Sports Nutrition Coach",
        "methodology": {
            "acronym": "PERFORM",
            "full_name": "The P.E.R.F.O.R.M. Athletic Method™",
            "letters": [
                {"letter": "P", "meaning": "Periodize Nutrition", "description": "Match nutrition to training cycles."},
                {"letter": "E", "meaning": "Energy Systems", "description": "Fuel for different exercise demands."},
                {"letter": "R", "meaning": "Recovery Nutrition", "description": "Post-workout and sleep optimization."},
                {"letter": "F", "meaning": "Functional Foods", "description": "Performance-enhancing whole foods."},
                {"letter": "O", "meaning": "Optimize Hydration", "description": "Electrolytes and fluid balance."},
                {"letter": "R", "meaning": "Results Tracking", "description": "Measure and adjust for goals."},
                {"letter": "M", "meaning": "Mental Edge", "description": "Nutrition for cognitive performance."}
            ]
        }
    },
    {
        "name": "Pediatric Nutrition Coach",
        "methodology": {
            "acronym": "GROW",
            "full_name": "The G.R.O.W. Kids Nutrition Method™",
            "letters": [
                {"letter": "G", "meaning": "Growth Assessment", "description": "Evaluate developmental nutrition needs."},
                {"letter": "R", "meaning": "Remediate Deficiencies", "description": "Address picky eating and nutrient gaps."},
                {"letter": "O", "meaning": "Optimize Development", "description": "Brain, bone, and immune nutrition."},
                {"letter": "W", "meaning": "Whole Family Wellness", "description": "Create healthy family food culture."}
            ]
        }
    },
    {
        "name": "Anti-Aging & Longevity Coach",
        "methodology": {
            "acronym": "AGELESS",
            "full_name": "The A.G.E.L.E.S.S. Longevity Protocol™",
            "letters": [
                {"letter": "A", "meaning": "Assess Biomarkers", "description": "Measure biological vs chronological age."},
                {"letter": "G", "meaning": "Gut & Microbiome", "description": "Optimize digestive health for longevity."},
                {"letter": "E", "meaning": "Exercise & Movement", "description": "Muscle preservation and mobility."},
                {"letter": "L", "meaning": "Lifestyle Factors", "description": "Sleep, stress, and circadian health."},
                {"letter": "E", "meaning": "Eat for Longevity", "description": "Anti-inflammatory, nutrient-dense diet."},
                {"letter": "S", "meaning": "Supplements & Biohacks", "description": "Evidence-based longevity interventions."},
                {"letter": "S", "meaning": "Social & Purpose", "description": "Blue Zone lifestyle factors."}
            ]
        }
    },
    {
        "name": "Herbalism Practitioner",
        "methodology": {
            "acronym": "ROOTS",
            "full_name": "The R.O.O.T.S. Herbalism Method™",
            "letters": [
                {"letter": "R", "meaning": "Research & Safety", "description": "Evidence-based herb selection and contraindications."},
                {"letter": "O", "meaning": "Observe Patterns", "description": "Constitutional assessment and symptom analysis."},
                {"letter": "O", "meaning": "Organize Formulas", "description": "Create synergistic herbal blends."},
                {"letter": "T", "meaning": "Traditional Wisdom", "description": "Honor ancestral herbal knowledge."},
                {"letter": "S", "meaning": "Sustainable Practice", "description": "Ethical sourcing and long-term protocols."}
            ]
        }
    }
]


class BatchGenerator(TurboGenerator):
    def __init__(self, course_config):
        self.course_config = course_config
        super().__init__(course_config["name"], fill_gaps=False)
        
    def _get_predefined_methodology(self):
        return self.course_config["methodology"]


async def generate_course(course_config):
    """Generate a single course"""
    print(f"\n{'='*60}")
    print(f"🚀 STARTING: {course_config['name']}")
    print(f"   Methodology: {course_config['methodology']['full_name']}")
    print(f"   Time: {datetime.now().strftime('%H:%M:%S')}")
    print(f"{'='*60}\n")
    
    try:
        generator = BatchGenerator(course_config)
        
        # Save methodology first
        output_path = generator._get_output_path()
        output_path.mkdir(parents=True, exist_ok=True)
        (output_path / "methodology.json").write_text(
            json.dumps(course_config["methodology"], indent=2)
        )
        
        await generator.run()
        
        print(f"\n✅ COMPLETED: {course_config['name']}")
        return True
    except Exception as e:
        print(f"\n❌ FAILED: {course_config['name']} - {e}")
        return False


async def main():
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║     ACCREDIPRO BATCH GENERATOR - 18 COURSES                  ║
║     Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}                          ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    results = {"success": [], "failed": []}
    
    for i, course in enumerate(COURSES_TO_GENERATE, 1):
        print(f"\n[{i}/{len(COURSES_TO_GENERATE)}] Processing: {course['name']}")
        
        success = await generate_course(course)
        
        if success:
            results["success"].append(course["name"])
        else:
            results["failed"].append(course["name"])
    
    # Final report
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║                    GENERATION COMPLETE                       ║
╚══════════════════════════════════════════════════════════════╝

✅ Successful: {len(results['success'])}
❌ Failed: {len(results['failed'])}

Successful courses:
{chr(10).join('  - ' + c for c in results['success'])}

{('Failed courses:' + chr(10) + chr(10).join('  - ' + c for c in results['failed'])) if results['failed'] else ''}

Generation finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
""")


if __name__ == "__main__":
    asyncio.run(main())
