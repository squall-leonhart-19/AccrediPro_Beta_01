#!/usr/bin/env python3
"""
Generate ONLY Integrative Medicine Practitioner course.
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from turbo_generator import TurboGenerator

async def generate_integrative():
    """Generate Integrative Medicine course"""
    print("=" * 70)
    print("🩺 Generating: Integrative Medicine Practitioner")
    print("=" * 70)
    
    generator = TurboGenerator("Integrative Medicine Practitioner")
    await generator.run()
    
    print("\n✅ Integrative Medicine Practitioner COMPLETE!")

if __name__ == "__main__":
    asyncio.run(generate_integrative())
