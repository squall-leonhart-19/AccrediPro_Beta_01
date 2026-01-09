#!/usr/bin/env python3
"""
Generate Coach Profile Image Variants using WaveSpeed API
4 variants per coach (36 total images)
"""

import requests
import time
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

WAVESPEED_API_KEYS = [
    "7c63ba17d21054a39da8518dd5148425e08289da6df9968445e3f581091220f4",
    "3e64d71623df870a1052093acbc1f05df63430daec671dafa4a0566c873a63ca",
    "a92944f5fff2b1167e926e57c57e88a960b52773f6fe4bb5d7ac7be6cb70725d",
    "b501c6bee22ce9ec76c411f5dd9a52a2dd948284e1b236cf571187c7dfb05e9e",
    "25608bfcf45c820e97911f0db5778b76af4f009824a9a238d0a7f6ccf49dad6f",
]

API_BASE = "https://api.wavespeed.ai/api/v3/google/nano-banana-pro/text-to-image"
RESULT_BASE = "https://api.wavespeed.ai/api/v3/predictions"
OUTPUT_BASE = "/Users/pochitino/Desktop/metrix_real/Coach_Profile_img"

# Coach prompts - 4 variants each (different poses/settings/moods)
COACHES = {
    "Sarah_Mitchell": {
        "base": "42-year-old American woman, former ER nurse now functional medicine coach. Honey blonde hair, hazel eyes, natural makeup, warm maternal energy.",
        "variants": [
            ("v1_couch", "iPhone selfie on her Austin home couch, messy mom bun, gray t-shirt, afternoon light. Relaxed, real, tired but happy."),
            ("v2_office", "Sitting at home office desk, laptop visible, professional but casual blue blouse, genuine smile. Natural lighting from window."),
            ("v3_kitchen", "Standing in modern kitchen, cup of green smoothie, wearing cozy cardigan. Morning light, wellness lifestyle."),
            ("v4_outdoor", "Casual outdoor photo in Austin park, simple white top, hair down, genuine laugh. Golden hour light."),
        ]
    },
    "Olivia_Reyes": {
        "base": "38-year-old Latina American woman, trauma survivor turned coach. Dark wavy hair, expressive brown eyes, raw vulnerable strength.",
        "variants": [
            ("v1_apartment", "Phone photo in Denver apartment, string lights behind, oversized cardigan. Gentle knowing look, evening light."),
            ("v2_therapy", "Sitting in cozy therapy-style room, warm blanket, thoughtful expression. Soft lamp lighting."),
            ("v3_window", "Looking out window, contemplative pose, natural makeup. Moody natural light, authentic."),
            ("v4_coffee", "Holding coffee mug with both hands, comfortable sweater, slight smile. Cozy morning vibe."),
        ]
    },
    "Luna_Sinclair": {
        "base": "35-year-old American woman, energy healer in Sedona. Long wavy auburn hair, freckles, no makeup, crystal necklace, bohemian.",
        "variants": [
            ("v1_rocks", "Sitting cross-legged on red rocks at sunset, white linen outfit. Spiritual, grounded, earthy."),
            ("v2_meditation", "Eyes closed in meditation pose, morning light, flowing cream dress. Peaceful, ethereal."),
            ("v3_crystals", "Surrounded by crystals in home studio, candles, warm amber light. Mystical but approachable."),
            ("v4_nature", "Walking barefoot in desert garden, flowy clothes, connected to earth. Natural, free spirit."),
        ]
    },
    "Maya_Chen": {
        "base": "44-year-old Asian-American woman, anxiety coach. Black hair with visible gray, gentle wrinkles, calm presence, oversized sweater.",
        "variants": [
            ("v1_cushion", "Sitting on meditation cushion, cup of tea, Portland living room. Calm, centered, real."),
            ("v2_garden", "In small zen garden, simple clothing, morning dew. Peaceful, mindful, natural."),
            ("v3_tapping", "Demonstrating EFT tapping point, warm smile, therapeutic setting. Approachable, helpful."),
            ("v4_reading", "Reading on couch with glasses, cozy blanket, afternoon light. Wise, relatable, comfortable."),
        ]
    },
    "Emma_Thompson": {
        "base": "39-year-old American woman, doula and parenting coach Nashville. Light brown hair, minimal makeup, maternal warmth.",
        "variants": [
            ("v1_living", "Sitting in messy cozy living room, toys visible, gray henley. Real mom energy, genuine warmth."),
            ("v2_nursery", "In soft nursery setting, gentle lighting, holding baby blanket. Nurturing, safe."),
            ("v3_porch", "On Nashville home front porch, morning coffee, relaxed. Southern warmth, approachable."),
            ("v4_playful", "Laughing with joy, casual clothes, natural outdoor light. Authentic happy mom."),
        ]
    },
    "Bella_Martinez": {
        "base": "36-year-old Mexican-American woman, pet wellness coach San Diego. Dark hair messy braid, sun-kissed, genuine smile.",
        "variants": [
            ("v1_dog", "Standing in backyard garden with golden retriever beside her. Natural, outdoorsy, dog lover."),
            ("v2_herbs", "In home herb garden, casual denim jacket, pets nearby. Natural pet wellness vibe."),
            ("v3_beach", "Casual beach walk with dog, sunrise light, relaxed. San Diego lifestyle, healthy."),
            ("v4_kitchen", "Preparing healthy pet food in bright kitchen, apron, focused but happy. Dedicated pet parent."),
        ]
    },
    "Sage_Hawkins": {
        "base": "52-year-old American woman, clinical herbalist Appalachian NC. Long silver-gray hair, weathered hands, wise knowing eyes.",
        "variants": [
            ("v1_garden", "Standing in herb garden, lavender and echinacea, earth-toned linen apron. Wise, earthy."),
            ("v2_apothecary", "In home apothecary surrounded by tincture bottles, working. Traditional, knowledgeable."),
            ("v3_teaching", "Showing dried herbs to camera, educational pose, warm studio light. Sharing wisdom."),
            ("v4_porch", "On cabin porch in Blue Ridge mountains, morning mist, peaceful. Mountain healer."),
        ]
    },
    "Grace_Williams": {
        "base": "48-year-old Black American woman, Christian life coach Atlanta. Short natural hair with gray, gentle strong eyes, warm smile.",
        "variants": [
            ("v1_porch", "Sitting on front porch with Bible, navy blouse, small cross necklace. Southern faith, real."),
            ("v2_church", "In sunlit church setting, hands clasped, peaceful expression. Spiritual strength."),
            ("v3_home", "In warm Atlanta home living room, family photos visible. Grounded, family-focused."),
            ("v4_garden", "In church community garden, serving others, joyful. Faith in action."),
        ]
    },
    "Rachel_Kim_Davis": {
        "base": "34-year-old Korean-American woman, LGBTQ coach Seattle. Short stylish haircut, subtle rainbow pin, confident authentic.",
        "variants": [
            ("v1_coffee", "Seattle coffee shop window seat, latte, olive jacket, casual. Urban, approachable."),
            ("v2_office", "In modern inclusive therapy office, colorful art. Professional, safe space."),
            ("v3_outdoor", "Pike Place market area, casual urban style, genuine smile. Seattle vibe."),
            ("v4_community", "At LGBTQ community event, surrounded by people, joyful. Belonging, celebration."),
        ]
    },
}

def submit(prompt, api_key):
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}
    payload = {"aspect_ratio": "1:1", "enable_sync_mode": False, "output_format": "png", "prompt": prompt, "resolution": "1k"}
    try:
        return requests.post(API_BASE, headers=headers, json=payload).json()
    except Exception as e:
        return {"error": str(e)}

def poll(req_id, api_key):
    headers = {"Authorization": f"Bearer {api_key}"}
    for _ in range(60):
        try:
            r = requests.get(f"{RESULT_BASE}/{req_id}/result", headers=headers).json()
            if r.get("data", {}).get("status") == "completed":
                return r
            if r.get("data", {}).get("status") == "failed":
                return {"error": "failed"}
        except:
            pass
        time.sleep(2)
    return {"error": "timeout"}

def download(url, path):
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(path, 'wb') as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return True
    return False

def generate_one(coach_name, variant_name, prompt, api_key):
    result = {"coach": coach_name, "variant": variant_name, "status": "pending"}
    
    resp = submit(prompt, api_key)
    req_id = resp.get("data", {}).get("id")
    if not req_id:
        result["status"] = "failed"
        result["error"] = resp.get("message", "No request ID")
        return result
    
    completion = poll(req_id, api_key)
    if "error" in completion:
        result["status"] = "failed"
        return result
    
    outputs = completion.get("data", {}).get("outputs", [])
    if outputs:
        output_dir = os.path.join(OUTPUT_BASE, coach_name)
        os.makedirs(output_dir, exist_ok=True)
        path = os.path.join(output_dir, f"{variant_name}.png")
        if download(outputs[0], path):
            result["status"] = "success"
            result["path"] = path
    else:
        result["status"] = "failed"
    
    return result

def main():
    print("\n🎭 Generating Coach Profile Variants")
    print(f"📁 Output: {OUTPUT_BASE}")
    print("-" * 50)
    
    # Build job list
    jobs = []
    for coach_name, data in COACHES.items():
        base_desc = data["base"]
        for variant_name, variant_desc in data["variants"]:
            full_prompt = f"Casual authentic phone photo portrait. {base_desc} {variant_desc} Natural, real, not stock photo. 1:1 square format."
            jobs.append((coach_name, variant_name, full_prompt))
    
    print(f"📷 Total images to generate: {len(jobs)}")
    
    start = time.time()
    results = []
    
    with ThreadPoolExecutor(max_workers=5) as ex:
        futures = {ex.submit(generate_one, coach, var, prompt, WAVESPEED_API_KEYS[i % len(WAVESPEED_API_KEYS)]): (coach, var)
                   for i, (coach, var, prompt) in enumerate(jobs)}
        
        for i, f in enumerate(as_completed(futures), 1):
            r = f.result()
            results.append(r)
            icon = "✅" if r["status"] == "success" else "❌"
            print(f"{icon} [{i}/{len(jobs)}] {r['coach']}/{r['variant']}")
    
    elapsed = time.time() - start
    success = sum(1 for r in results if r["status"] == "success")
    
    print("-" * 50)
    print(f"⏱️ {elapsed:.0f}s | ✅ {success}/{len(jobs)} images generated")
    
    # Summary by coach
    print("\n📊 Summary by Coach:")
    for coach_name in COACHES.keys():
        coach_results = [r for r in results if r["coach"] == coach_name]
        coach_success = sum(1 for r in coach_results if r["status"] == "success")
        print(f"  {coach_name}: {coach_success}/4")

if __name__ == "__main__":
    main()
