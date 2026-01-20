#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

base = Path("/Users/pochitino/Desktop/accredipro-lms/Courses_Updated_New_Version/certified-functional-medicine-practitioner")
audio_dir = base / "audio"
resources_dir = base / "resources"

levels = ["L1_Main", "L2_Advanced", "L3_Master", "L4_Practice"]

for level in levels:
    level_path = base / level
    if not level_path.exists():
        continue
    
    for module in level_path.iterdir():
        if not module.is_dir() or not module.name.startswith("Module_"):
            continue
        
        # Create destination folders
        audio_dest = audio_dir / level / module.name
        resources_dest = resources_dir / level / module.name
        audio_dest.mkdir(parents=True, exist_ok=True)
        resources_dest.mkdir(parents=True, exist_ok=True)
        
        # Move MP3 files
        for mp3 in module.glob("*.mp3"):
            print(f"Moving {mp3.name} to audio/{level}/{module.name}/")
            shutil.move(str(mp3), str(audio_dest / mp3.name))
        
        # Move Resources PDFs
        resources_folder = module / "Resources"
        if resources_folder.exists():
            for pdf in resources_folder.glob("*.pdf"):
                print(f"Moving {pdf.name} to resources/{level}/{module.name}/")
                shutil.move(str(pdf), str(resources_dest / pdf.name))
        
        # Delete script.txt files
        for txt in module.glob("*.script.txt"):
            print(f"Deleting {txt.name}")
            txt.unlink()

print("\n✅ Reorganization complete!")
print(f"\nAudio folders: {list(audio_dir.rglob('*.mp3'))[:5]}...")
print(f"Resources folders: {list(resources_dir.rglob('*.pdf'))[:5]}...")
