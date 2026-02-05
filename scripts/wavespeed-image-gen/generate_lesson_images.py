#!/usr/bin/env python3
"""
WaveSpeed Lesson Image Generator
Generates doodle-style images for mini diploma lessons using nano-banana-pro model.
Uses 20 API keys for parallel generation.

Usage:
    python generate_lesson_images.py --niche functional-medicine
    python generate_lesson_images.py --niche spiritual-healing --prompts custom_prompts.json
"""

import os
import sys
import json
import time
import argparse
import requests
import concurrent.futures
from pathlib import Path
from typing import List, Dict, Optional

# WaveSpeed API Configuration
WAVESPEED_API_URL = "https://api.wavespeed.ai/api/v3/google/nano-banana-pro/text-to-image-ultra"
WAVESPEED_RESULT_URL = "https://api.wavespeed.ai/api/v3/predictions"

# API Keys (rotate for parallel generation)
API_KEYS = [
    "7c63ba17d21054a39da8518dd5148425e08289da6df9968445e3f581091220f4",
    "3e64d71623df870a1052093acbc1f05df63430daec671dafa4a0566c873a63ca",
    "a92944f5fff2b1167e926e57c57e88a960b52773f6fe4bb5d7ac7be6cb70725d",
    "b501c6bee22ce9ec76c411f5dd9a52a2dd948284e1b236cf571187c7dfb05e9e",
    "25608bfcf45c820e97911f0db5778b76af4f009824a9a238d0a7f6ccf49dad6f",
    "aa23f77649cac352e0f16c200245046eaf50a41f0f87629ecd9359ed5a489ecf",
    "7bdd8923b7c92438f8614672d0d25d84317e0c14dc0f80059963fc06f6a9215c",
    "37276b92e2b327d8b7b8eab81d0bfce82c9f92caef1c5074df8992c68963f80f",
    "b317a23c8cf8d3bac6481d440e474e6f9235afc78a859e6b3f70fa970f9f0d5a",
    "3fcc1d56d652da7afbc951ceddb089e6930cf6d5c1dd4dd10a19d9bc7e92fbe2",
    "325ebd8111d398ec01f5e36d84644e6dcf6386d6c6b3326c97b2220011839567",
    "46e7b341cd9519c8a0ea45ee6a789af83782ae8ef96d7e1147d5d37d1797e986",
    "9140290325d9bd93ccba6f8e8ca3b6aacf2fc6f40967192795b8163c316f02da",
    "39495512f96a668fbfa1e650240caf9e8b44a79c828021768d2d43c2a901fc29",
    "320f0fdd61caa62e76c648d6081febf0cee1d53b0f5c8fa2132c63fa779e83bf",
    "61a67281612fa5dc281084506e04f00a87136fdf6b4936cf3fa25a713c4131ba",
    "c7fd64483bd226dc608ef556edb72e3d70421bd67c02074fc9a97b5ae789f462",
    "c8b09fe032b404eaf092cf314d230f3a70f5402324dd91ae0cd28e0232760390",
    "59e11cd0a186be5b355af873494cd770789018d01360f7b1d24277d9294e6180",
    "dda2e3d62ff37be4864b0bde387180dd206dfdb7ad0449f1affa0e2435f1603e",
]

# Default doodle prompts for health coaching niches
DEFAULT_PROMPTS = {
    "lesson_1": """Hand-drawn whiteboard sketch style, black marker on cream paper background, 
educational doodle about root cause medicine. Shows: stick figure with symptoms (tired, bloated, anxious) 
with red X marks on left, arrow pointing to "ROOT CAUSE" in center with magnifying glass doodle, 
then happy stick figure on right with green checkmarks. 
Bottom text in sketchy handwriting: "Fix the cause, not the symptom". 
Authentic student notebook doodle aesthetic, not polished, messy arrows and circles.""",

    "lesson_2": """Hand-drawn whiteboard sketch style, black marker on cream paper background,
educational doodle about gut health as second brain. Shows: simple gut/intestine diagram in center,
three labels pointing to it: "Second Brain" with brain doodle, "Immune HQ" with shield, "Mood Factory" with smiley.
Arrows showing connection between gut and these systems.
Bottom text: "When the gut breaks, everything breaks".
Authentic student notebook doodle aesthetic.""",

    "lesson_3": """Hand-drawn whiteboard sketch style, black marker on cream paper background,
educational doodle about inflammation. Shows: two sides - left has small controlled fire labeled "Acute" with checkmark,
right has large spreading fire labeled "Chronic" with X mark. Arrow between showing progression.
Stick figure looking concerned at chronic side.
Bottom text: "Good fire vs bad fire".
Authentic student notebook doodle aesthetic.""",

    "lesson_4": """Hand-drawn whiteboard sketch style, black marker on cream paper background,
educational doodle about toxins. Shows: five simple icons representing toxin categories - 
house (home toxins), droplet (water), leaf (food), factory (environmental), pill (medications).
All arrows pointing to stick figure in center looking overwhelmed.
Bottom text: "The 5 toxin categories".
Authentic student notebook doodle aesthetic.""",

    "lesson_5": """Hand-drawn whiteboard sketch style, black marker on cream paper background,
educational doodle about stress and HPA axis. Shows: three battery icons in a row - 
full battery labeled "Wired", half battery labeled "Tired but Wired", empty battery labeled "Exhausted".
Arrow showing progression from left to right.
Bottom text: "The burnout stages".
Authentic student notebook doodle aesthetic.""",

    "lesson_6": """Hand-drawn whiteboard sketch style, black marker on cream paper background,
educational doodle about lab interpretation. Shows: two thermometer-style ranges side by side -
left labeled "Doctor's Range" showing wide normal band, right labeled "Optimal Range" showing narrow optimal band.
X mark on doctor's range, checkmark on optimal range.
Bottom text: "Normal vs Optimal".
Authentic student notebook doodle aesthetic.""",

    "lesson_7": """Hand-drawn whiteboard sketch style, black marker on cream paper background,
educational doodle about building client protocols. Shows: simple pyramid with 3 levels -
bottom "Sleep + Stress", middle "Nutrition", top "Supplements". 
Timeline arrow below showing "90-Day Journey".
Bottom text: "Simple protocols = big results".
Authentic student notebook doodle aesthetic.""",

    "lesson_8": """Hand-drawn whiteboard sketch style, black marker on cream paper background,
educational doodle about finding clients. Shows: funnel diagram - 
top has multiple stick figures labeled "Your Network", middle shows heart with "Free Value",
bottom shows fewer figures with dollar signs labeled "Paying Clients".
Bottom text: "Help first, sell second".
Authentic student notebook doodle aesthetic.""",

    "lesson_9": """Hand-drawn whiteboard sketch style, black marker on cream paper background,
educational doodle about new lifestyle. Shows: daily schedule with clock icons -
"10am Client Call $200", "12pm Break", "2pm Client Call $200", "3pm School Pickup" with heart.
Money symbols and happy family stick figures.
Bottom text: "Your new life awaits".
Authentic student notebook doodle aesthetic.""",
}


def get_api_key(index: int) -> str:
    """Get API key by rotating through available keys."""
    return API_KEYS[index % len(API_KEYS)]


def submit_image_request(prompt: str, api_key: str, lesson_num: int) -> Optional[str]:
    """Submit image generation request to WaveSpeed API."""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "prompt": prompt,
        "aspect_ratio": "16:9",
        "resolution": "4k",
        "output_format": "png",
        "enable_sync_mode": False,
        "enable_base64_output": False
    }
    
    try:
        response = requests.post(WAVESPEED_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        request_id = result.get("id")
        print(f"   ✓ Lesson {lesson_num}: Submitted (ID: {request_id[:8]}...)")
        return request_id
    except Exception as e:
        print(f"   ✗ Lesson {lesson_num}: Failed to submit - {e}")
        return None


def poll_for_result(request_id: str, api_key: str, lesson_num: int, max_attempts: int = 60) -> Optional[str]:
    """Poll for image generation result."""
    headers = {"Authorization": f"Bearer {api_key}"}
    
    for attempt in range(max_attempts):
        try:
            # Check status
            status_url = f"{WAVESPEED_RESULT_URL}/{request_id}"
            response = requests.get(status_url, headers=headers, timeout=10)
            response.raise_for_status()
            result = response.json()
            
            status = result.get("status", "unknown")
            
            if status == "completed":
                # Get result
                result_url = f"{WAVESPEED_RESULT_URL}/{request_id}/result"
                response = requests.get(result_url, headers=headers, timeout=10)
                response.raise_for_status()
                result_data = response.json()
                
                outputs = result_data.get("outputs", [])
                if outputs:
                    print(f"   ✓ Lesson {lesson_num}: Completed!")
                    return outputs[0]
                    
            elif status == "failed":
                error = result.get("error", "Unknown error")
                print(f"   ✗ Lesson {lesson_num}: Failed - {error}")
                return None
                
            # Still processing, wait and retry
            time.sleep(2)
            
        except Exception as e:
            print(f"   ! Lesson {lesson_num}: Poll error - {e}")
            time.sleep(2)
    
    print(f"   ✗ Lesson {lesson_num}: Timeout after {max_attempts * 2}s")
    return None


def download_image(url: str, output_path: Path) -> bool:
    """Download image from URL."""
    try:
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        output_path.write_bytes(response.content)
        return True
    except Exception as e:
        print(f"   ✗ Download failed: {e}")
        return False


def generate_single_image(args: tuple) -> Dict:
    """Generate a single image (for parallel execution)."""
    lesson_num, prompt, api_key, output_dir = args
    
    result = {
        "lesson": lesson_num,
        "success": False,
        "output_path": None,
        "url": None
    }
    
    # Submit request
    request_id = submit_image_request(prompt, api_key, lesson_num)
    if not request_id:
        return result
    
    # Poll for result
    image_url = poll_for_result(request_id, api_key, lesson_num)
    if not image_url:
        return result
    
    # Download image
    output_path = output_dir / f"lesson-{lesson_num}-doodle.png"
    if download_image(image_url, output_path):
        result["success"] = True
        result["output_path"] = str(output_path)
        result["url"] = image_url
    
    return result


def generate_all_images(niche: str, prompts: Dict[str, str], output_dir: Path, max_workers: int = 9):
    """Generate all lesson images in parallel."""
    print(f"\n{'='*60}")
    print(f"🖼️  WAVESPEED LESSON IMAGE GENERATOR")
    print(f"{'='*60}")
    print(f"📂 Niche: {niche}")
    print(f"📁 Output: {output_dir}")
    print(f"🔧 Workers: {max_workers}")
    print(f"{'='*60}\n")
    
    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Prepare tasks
    tasks = []
    for i in range(1, 10):
        prompt_key = f"lesson_{i}"
        prompt = prompts.get(prompt_key, DEFAULT_PROMPTS.get(prompt_key, ""))
        if not prompt:
            print(f"⚠️  No prompt for lesson {i}, skipping")
            continue
        
        api_key = get_api_key(i - 1)
        tasks.append((i, prompt, api_key, output_dir))
    
    print(f"🚀 Submitting {len(tasks)} images...\n")
    
    # Execute in parallel
    start_time = time.time()
    results = []
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_lesson = {executor.submit(generate_single_image, task): task[0] for task in tasks}
        
        for future in concurrent.futures.as_completed(future_to_lesson):
            result = future.result()
            results.append(result)
    
    elapsed = time.time() - start_time
    
    # Summary
    print(f"\n{'='*60}")
    print(f"📊 GENERATION SUMMARY")
    print(f"{'='*60}")
    
    successful = [r for r in results if r["success"]]
    failed = [r for r in results if not r["success"]]
    
    print(f"✅ Successful: {len(successful)}/9")
    print(f"❌ Failed: {len(failed)}/9")
    print(f"⏱️  Time: {elapsed:.1f}s")
    
    if successful:
        print(f"\n📁 Generated files:")
        for r in sorted(successful, key=lambda x: x["lesson"]):
            print(f"   lesson-{r['lesson']}-doodle.png")
    
    if failed:
        print(f"\n⚠️  Failed lessons: {[r['lesson'] for r in failed]}")
    
    return results


def main():
    parser = argparse.ArgumentParser(description="Generate lesson doodle images using WaveSpeed API")
    parser.add_argument("--niche", required=True, help="Niche slug (e.g., functional-medicine)")
    parser.add_argument("--prompts", help="Path to custom prompts JSON file")
    parser.add_argument("--output", help="Custom output directory")
    parser.add_argument("--workers", type=int, default=9, help="Number of parallel workers (default: 9)")
    
    args = parser.parse_args()
    
    # Load prompts
    prompts = DEFAULT_PROMPTS.copy()
    if args.prompts:
        with open(args.prompts) as f:
            custom_prompts = json.load(f)
            prompts.update(custom_prompts)
    
    # Set output directory
    if args.output:
        output_dir = Path(args.output)
    else:
        output_dir = Path(f"../../public/images/lessons/{args.niche}")
    
    # Generate images
    results = generate_all_images(args.niche, prompts, output_dir, args.workers)
    
    # Exit with error if any failed
    if not all(r["success"] for r in results):
        sys.exit(1)


if __name__ == "__main__":
    main()
