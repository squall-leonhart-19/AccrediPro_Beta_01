
import sys
import os
import json
import asyncio
from pathlib import Path
import re
from datetime import datetime

# Add core directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from core import APIKeyPool, CourseDatabase, GeminiGenerator, QualityChecker
from turbo_generator import TurboGenerator, SYSTEM_INSTRUCTION

# --- METHODOLOGY DEFINITION ---
HOLISTIC_METHODOLOGY = {
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

class HolisticGenerator(TurboGenerator):
    def __init__(self):
        # Load config relative to script location
        env_path = Path(__file__).parent / 'config.env'
        from dotenv import load_dotenv
        load_dotenv(env_path)
        
        super().__init__("Holistic Nutrition Coach", fill_gaps=False)
        self.config['output_dir'] = Path('../../courses') 
        self.config = self._load_config() # Reload config to get keys after dotenv
        
    def _get_predefined_methodology(self):
        return HOLISTIC_METHODOLOGY

async def main():
    print("🌿 STARTING HOLISTIC NUTRITION FULL REGENERATION...")
    
    generator = HolisticGenerator()
    
    # 1. Force set methodology and save it
    generator.methodology = HOLISTIC_METHODOLOGY
    output_path = generator._get_output_path()
    output_path.mkdir(parents=True, exist_ok=True)
    (output_path / "methodology.json").write_text(json.dumps(HOLISTIC_METHODOLOGY, indent=2))
    print(f"✅ Methodology saved: {HOLISTIC_METHODOLOGY['full_name']}")

    # 2. Run standard Turbo generation
    await generator.run()

if __name__ == "__main__":
    asyncio.run(main())
