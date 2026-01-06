#!/usr/bin/env python3
"""
AccrediPro Coach Avatar Generator
Generates professional headshots for all 9 coaches using WaveSpeed API.

All avatars are:
- 1:1 aspect ratio (square)
- Middle-aged US women
- Ethnically diverse (matching their names/backgrounds)
- Niche-coherent (appearance matches their specialty)

Usage:
    python generate_coach_avatars.py
    python generate_coach_avatars.py --coach sarah
"""

import requests
import time
import os
import json
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed

# =============================================================================
# API CONFIGURATION
# =============================================================================

WAVESPEED_API_KEYS = [
    os.environ.get("WAVESPEED_API_KEY_1", ""),
    os.environ.get("WAVESPEED_API_KEY_2", ""),
    os.environ.get("WAVESPEED_API_KEY_3", ""),
    os.environ.get("WAVESPEED_API_KEY_4", ""),
    os.environ.get("WAVESPEED_API_KEY_5", ""),
]

WAVESPEED_API_BASE = "https://api.wavespeed.ai/api/v3/google/nano-banana-pro/text-to-image"
WAVESPEED_RESULT_BASE = "https://api.wavespeed.ai/api/v3/predictions"

# =============================================================================
# COACH PERSONAS & PROMPTS
# =============================================================================

COACH_PROMPTS = {
    "sarah": {
        "name": "Sarah Mitchell",
        "age": 42,
        "prompt": """Professional headshot for wellness coaching website. 1:1 square portrait. 
Photorealistic image of confident American woman in her early 40s with warm hazel eyes and shoulder-length auburn hair with subtle highlights.
Wearing a sophisticated white lab coat over a soft sage green blouse.
Warm, approachable smile showing genuine caring nature.
Light natural makeup, small gold stud earrings.
Background: soft blurred modern medical office with warm lighting, subtle functional medicine aesthetic.
Professional healthcare authority with integrative medicine credibility.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: Caucasian American."""
    },
    
    "olivia": {
        "name": "Olivia Reyes",
        "age": 38,
        "prompt": """Professional headshot for trauma recovery coaching. 1:1 square portrait.
Photorealistic image of empathetic Latina woman in her late 30s with warm brown eyes and dark brown wavy hair past shoulders.
Wearing a soft burgundy cardigan over cream blouse, approachable professional style.
Compassionate expression with gentle strength, soft smile showing understanding.
Minimal elegant jewelry, small silver hoops.
Background: soft blurred therapy office with cozy elements, warm earth tones, calming atmosphere.
Professional trauma-informed coach aesthetic with safe nurturing presence.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: Hispanic/Latina American."""
    },
    
    "luna": {
        "name": "Luna Sinclair",
        "age": 35,
        "prompt": """Professional headshot for energy healing and sacred intimacy coaching. 1:1 square portrait.
Photorealistic image of serene bohemian woman in her mid-30s with striking blue-green eyes and long flowing dark hair with natural waves.
Wearing a flowing mauve silk blouse with subtle shimmer, spiritual but professional.
Peaceful ethereal expression with knowing gentle smile, soft mystical presence.
Delicate crystal pendant necklace, small gemstone earrings.
Background: soft blurred meditation sanctuary with candles, crystals, warm golden spiritual light.
Professional energy healer aesthetic with divine feminine grace.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: Mixed heritage (Mediterranean/European), fair skin."""
    },
    
    "maya": {
        "name": "Maya Chen",
        "age": 44,
        "prompt": """Professional headshot for mindfulness and EFT coaching. 1:1 square portrait.
Photorealistic image of calm centered Asian-American woman in her mid-40s with kind dark eyes and sleek black bob haircut.
Wearing a minimalist navy blazer over white silk blouse, modern zen professional style.
Serene peaceful expression with warm slight smile, grounded confident presence.
Simple jade pendant, small pearl studs.
Background: soft blurred minimal zen office with natural wood elements, soft natural light, calming modern aesthetic.
Professional mindfulness coach aesthetic with quiet inner strength.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: East Asian American (Chinese heritage)."""
    },
    
    "emma": {
        "name": "Emma Thompson",
        "age": 39,
        "prompt": """Professional headshot for parenting and birth doula coaching. 1:1 square portrait.
Photorealistic image of warm nurturing American woman in her late 30s with friendly green eyes and honey blonde hair in soft waves.
Wearing a cozy dusty rose cardigan over cream top, maternal but professional style.
Warm motherly smile with welcoming open expression, reassuring presence.
Simple rose gold jewelry, small heart necklace.
Background: soft blurred nursery or family room with warm natural light, comforting home atmosphere.
Professional birth doula aesthetic with safe maternal energy.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: Caucasian American, Southern warmth."""
    },
    
    "bella": {
        "name": "Bella Martinez",
        "age": 36,
        "prompt": """Professional headshot for holistic pet wellness coaching. 1:1 square portrait.
Photorealistic image of vibrant Latina woman in her mid-30s with bright brown eyes and dark curly hair in natural style.
Wearing a casual olive green sweater, outdoorsy approachable style.
Bright genuine smile with playful energy, animal lover warmth.
Simple turquoise jewelry, natural boho touches.
Background: soft blurred sunny natural setting suggesting outdoor wellness, warm golden light.
Professional pet wellness coach aesthetic with natural vitality.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: Hispanic/Latina American, warm tan skin."""
    },
    
    "sage": {
        "name": "Sage Hawkins",
        "age": 52,
        "prompt": """Professional headshot for clinical herbalism and plant medicine education. 1:1 square portrait.
Photorealistic image of wise earthy American woman in her early 50s with knowing gray-green eyes and silver-streaked auburn hair worn naturally long.
Wearing a forest green linen tunic with natural fiber texture, herbalist aesthetic.
Warm knowing smile with grounded wisdom, grandmother healer presence.
Simple wooden bead necklace, natural crystal pendant.
Background: soft blurred apothecary or herb garden with dried herbs, natural wood shelves, earthy organic light.
Professional herbalist aesthetic with Appalachian folk wisdom.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: Caucasian American, Appalachian roots, natural aging."""
    },
    
    "grace": {
        "name": "Grace Williams",
        "age": 48,
        "prompt": """Professional headshot for Christian faith-based life coaching. 1:1 square portrait.
Photorealistic image of elegant African-American woman in her late 40s with warm brown eyes and beautiful natural hair styled professionally.
Wearing a refined ivory blazer over soft lavender blouse, church-ready elegance.
Graceful warm smile with spiritual depth, faithful reassuring presence.
Elegant pearl necklace and matching studs, small cross pendant visible.
Background: soft blurred church community room or elegant office with warm wood, soft golden light, faith-based professional setting.
Professional Christian coach aesthetic with ministerial grace.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: African-American, Southern elegance."""
    },
    
    "rachel": {
        "name": "Rachel Kim-Davis",
        "age": 34,
        "prompt": """Professional headshot for LGBTQ+ affirming life coaching. 1:1 square portrait.
Photorealistic image of modern inclusive Korean-American woman in her mid-30s with expressive dark eyes and stylish short textured haircut.
Wearing a contemporary teal blazer over graphic white tee, progressive professional style.
Warm authentic smile with confident approachable energy, ally presence.
Subtle rainbow pin on blazer, minimalist modern jewelry.
Background: soft blurred modern colorful office with inclusive decor, bright natural light, welcoming progressive space.
Professional LGBTQ+ coach aesthetic with intersectional awareness.
Studio quality lighting, sharp focus on face, bokeh background.
Ethnicity: Korean-American, modern queer aesthetic."""
    }
}

# =============================================================================
# WAVESPEED IMAGE GENERATION
# =============================================================================

def submit_wavespeed_request(prompt: str, api_key: str) -> dict:
    """Submit image generation request to WaveSpeed API"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "aspect_ratio": "1:1",  # Square for avatars
        "enable_base64_output": False,
        "enable_sync_mode": False,
        "output_format": "png",
        "prompt": prompt,
        "resolution": "2k"
    }
    response = requests.post(WAVESPEED_API_BASE, headers=headers, json=payload)
    return response.json()


def get_wavespeed_result(request_id: str, api_key: str, max_wait: int = 120) -> dict:
    """Poll for result from WaveSpeed API"""
    headers = {"Authorization": f"Bearer {api_key}"}
    url = f"{WAVESPEED_RESULT_BASE}/{request_id}/result"
    
    start_time = time.time()
    while time.time() - start_time < max_wait:
        try:
            response = requests.get(url, headers=headers)
            result = response.json()
            status = result.get("data", {}).get("status", "")
            if status == "completed":
                return result
            elif status == "failed":
                return {"error": "Generation failed"}
            time.sleep(2)
        except:
            time.sleep(2)
    return {"error": "Timeout"}


def download_image(url: str, save_path: str) -> bool:
    """Download image from URL"""
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"Download error: {e}")
    return False


# =============================================================================
# MAIN GENERATION PIPELINE
# =============================================================================

def generate_coach_avatar(coach_key: str, output_dir: str, api_key: str, version: int = 1) -> dict:
    """Generate avatar for a single coach"""
    
    coach = COACH_PROMPTS.get(coach_key)
    if not coach:
        return {"coach": coach_key, "status": "failed", "error": "Unknown coach"}
    
    result = {
        "coach": coach_key,
        "name": coach["name"],
        "prompt": coach["prompt"],
        "image_path": None,
        "status": "pending",
        "time_ms": 0
    }
    
    start = time.time()
    
    # Submit request
    submit_response = submit_wavespeed_request(coach["prompt"], api_key)
    request_id = submit_response.get("data", {}).get("id")
    
    if not request_id:
        result["status"] = "failed"
        result["error"] = f"WaveSpeed submit failed: {submit_response}"
        return result
    
    print(f"   ⏳ {coach['name']}: Generating... (ID: {request_id[:8]})")
    
    # Wait for completion
    completion = get_wavespeed_result(request_id, api_key)
    
    if "error" in completion:
        result["status"] = "failed"
        result["error"] = completion["error"]
        return result
    
    outputs = completion.get("data", {}).get("outputs", [])
    if not outputs:
        result["status"] = "failed"
        result["error"] = "No output from API"
        return result
    
    # Download and save
    filename = f"{coach_key}-{coach['name'].lower().replace(' ', '-')}_v{version}.png"
    save_path = os.path.join(output_dir, filename)
    
    if download_image(outputs[0], save_path):
        result["status"] = "success"
        result["image_path"] = save_path
        result["time_ms"] = int((time.time() - start) * 1000)
    else:
        result["status"] = "failed"
        result["error"] = "Download failed"
    
    return result


def generate_all_coaches(output_dir: str, version: int = 1, max_parallel: int = 5) -> list:
    """Generate avatars for all coaches in parallel"""
    
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"\n🎨 AccrediPro Coach Avatar Generator")
    print(f"📐 1:1 Square | Resolution: 2k")
    print(f"📁 Output: {output_dir}")
    print(f"🧑‍💼 Generating {len(COACH_PROMPTS)} coach avatars")
    print("-" * 50)
    
    for key, coach in COACH_PROMPTS.items():
        print(f"   🤖 {key}: {coach['name']} (age {coach['age']})")
    
    print("-" * 50)
    print("⏳ Generating in parallel...\n")
    
    results = []
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=max_parallel) as executor:
        futures = {}
        for i, coach_key in enumerate(COACH_PROMPTS.keys()):
            api_key = WAVESPEED_API_KEYS[i % len(WAVESPEED_API_KEYS)]
            future = executor.submit(generate_coach_avatar, coach_key, output_dir, api_key, version)
            futures[future] = coach_key
        
        for i, future in enumerate(as_completed(futures), 1):
            coach_key = futures[future]
            result = future.result()
            results.append(result)
            
            status_icon = "✅" if result["status"] == "success" else "❌"
            time_str = f" ({result['time_ms']}ms)" if result.get('time_ms') else ""
            name = result.get("name", coach_key)
            print(f"   {status_icon} [{i}/{len(COACH_PROMPTS)}] {name}: {result['status']}{time_str}")
    
    elapsed = time.time() - start_time
    success_count = sum(1 for r in results if r["status"] == "success")
    
    print("-" * 50)
    print(f"⏱️  Completed in {elapsed:.1f}s")
    print(f"✅ Success: {success_count}/{len(COACH_PROMPTS)}")
    
    return results


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Coach Avatar Generator")
    parser.add_argument("--coach", type=str, default=None, 
                        help="Generate single coach (sarah, olivia, luna, maya, emma, bella, sage, grace, rachel)")
    parser.add_argument("--version", type=int, default=1, help="Version number for filenames")
    parser.add_argument("--max-parallel", type=int, default=5, help="Max parallel generations")
    
    args = parser.parse_args()
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, "generated_ai", "coach_avatars")
    os.makedirs(output_dir, exist_ok=True)
    
    if args.coach:
        if args.coach not in COACH_PROMPTS:
            print(f"❌ Unknown coach: {args.coach}")
            print(f"   Available: {', '.join(COACH_PROMPTS.keys())}")
            exit(1)
        
        api_key = WAVESPEED_API_KEYS[0]
        result = generate_coach_avatar(args.coach, output_dir, api_key, args.version)
        results = [result]
        
        status_icon = "✅" if result["status"] == "success" else "❌"
        print(f"\n{status_icon} {result['name']}: {result['status']}")
        if result.get("image_path"):
            print(f"   📁 Saved: {result['image_path']}")
    else:
        results = generate_all_coaches(output_dir, args.version, args.max_parallel)
    
    # Save log
    log_path = os.path.join(output_dir, "generation_log.json")
    with open(log_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n📋 Log saved: {log_path}")
