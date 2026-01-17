#!/usr/bin/env python3
"""
Generate User Profile Images using WaveSpeed API
- Built-in smart prompt generator (no Anthropic needed)  
- All scenes tracked to ensure maximum diversity
- Ages 30-65, all American, positive expressions only
"""

import requests
import time
import os
import json
import random
from concurrent.futures import ThreadPoolExecutor, as_completed

# === API KEYS ===
WAVESPEED_API_KEYS = [
    "7c63ba17d21054a39da8518dd5148425e08289da6df9968445e3f581091220f4",
    "3e64d71623df870a1052093acbc1f05df63430daec671dafa4a0566c873a63ca",
    "a92944f5fff2b1167e926e57c57e88a960b52773f6fe4bb5d7ac7be6cb70725d",
    "b501c6bee22ce9ec76c411f5dd9a52a2dd948284e1b236cf571187c7dfb05e9e",
    "25608bfcf45c820e97911f0db5778b76af4f009824a9a238d0a7f6ccf49dad6f",
]

WAVESPEED_API_BASE = "https://api.wavespeed.ai/api/v3/google/nano-banana-pro/text-to-image"
WAVESPEED_RESULT_BASE = "https://api.wavespeed.ai/api/v3/predictions"

OUTPUT_DIR = "/Users/pochitino/Desktop/accredipro-lms/docs/User_Profile_img"

# === DIVERSITY TRACKING ===
USED_SCENES = set()
USED_AGES = set()

# 100+ unique scenes
SCENE_TEMPLATES = [
    # HOME SCENES
    ("bathroom_mirror", "bathroom mirror selfie, toothbrushes and messy counter visible, fluorescent lighting"),
    ("bedroom_morning", "bedroom mirror selfie, unmade bed visible behind, morning sunlight through curtains"),
    ("living_room_couch", "couch selfie, throw blankets and pillows behind, TV remote in hand, relaxing"),
    ("kitchen_cooking", "kitchen selfie, stovetop behind, apron on, wooden spoon in hand, cooking dinner"),
    ("kitchen_baking", "kitchen selfie, flour on counter, mixing bowl visible, baking cookies"),
    ("home_office", "home office desk selfie, laptop and coffee mug visible, working from home"),
    ("backyard_bbq", "backyard selfie, grill smoking behind, lawn chairs visible, summer day"),
    ("front_porch_coffee", "front porch selfie, coffee mug in hand, rocking chair behind, morning"),
    ("laundry_room", "laundry room selfie, washer and dryer behind, laundry basket visible, folding clothes"),
    ("craft_room", "craft room selfie, sewing machine or yarn visible, colorful supplies behind, doing hobby"),
    ("garage_organizing", "garage selfie, storage bins behind, tools visible, organizing weekend"),
    ("dining_table", "dining room selfie, table set for dinner, candles visible, hosting dinner"),
    
    # CAR SCENES  
    ("car_parking_lot", "car selfie, seatbelt on, steering wheel visible, parked in store parking lot"),
    ("car_drive_thru", "car selfie, coffee cup from drive-thru in hand, morning commute"),
    ("car_school_pickup", "minivan selfie, kid art on dashboard, waiting in school pickup line"),
    ("car_road_trip", "SUV selfie, highway through window, road trip snacks visible, travel day"),
    ("gas_station", "gas station selfie, pump visible behind, filling up the car"),
    
    # OUTDOOR SCENES
    ("hiking_trail", "hiking trail selfie, sweaty but happy, mountain trail behind, backpack strap visible"),
    ("beach_vacation", "beach selfie, ocean behind, cover-up over swimsuit, sandy, vacation happy"),
    ("park_walk", "park morning walk selfie, trees and path behind, athleisure, dog leash in hand"),
    ("dog_park", "dog park selfie, dogs playing behind, holding tennis ball, happy pet mom"),
    ("garden_harvesting", "garden selfie, tomato plants behind, sun hat on, holding fresh vegetables"),
    ("farmers_market", "farmers market selfie, produce stands behind, reusable bag visible, shopping"),
    ("camping", "campsite morning selfie, tent behind, mug of coffee, no makeup camping hair"),
    ("lake_dock", "lake dock selfie, water behind, sunset colors, relaxing at the lake"),
    ("mountain_overlook", "mountain overlook selfie, scenic view behind, hiking accomplished, proud"),
    ("jogging_path", "jogging path selfie, earbuds in, sweaty after run, park behind"),
    ("bike_ride", "bike ride break selfie, bike handle visible, trail behind, helmet on"),
    
    # WORK/PROFESSIONAL  
    ("office_cubicle", "office cubicle selfie, computer monitors behind, coffee mug, corporate worker"),
    ("coffee_shop_working", "coffee shop selfie, laptop and latte visible, working remotely"),
    ("coworking_space", "coworking space selfie, modern office behind, freelancer vibes"),
    ("library_studying", "library selfie, bookshelves behind, reading glasses on head, quiet studying"),
    ("lunch_break", "lunch break selfie outside, park bench, sandwich in hand, midday sun"),
    
    # ERRANDS/DAILY LIFE
    ("grocery_store", "grocery store aisle selfie, cart handle visible, cereal boxes behind, shopping"),
    ("target_shopping", "Target store selfie, red carts behind, dollar spot items in cart, shopping fun"),
    ("costco_run", "Costco selfie, bulk items in cart, samples in hand, warehouse shopping"),
    ("pharmacy_pickup", "pharmacy waiting selfie, medication counter behind, quick errand"),
    ("airport_terminal", "airport terminal selfie, gate behind, carry-on luggage, waiting to board"),
    ("waiting_room", "waiting room selfie, magazines on table, passing time, routine checkup"),
    ("nail_salon", "nail salon selfie, hands out drying, pedicure chair, self-care day"),
    ("hair_salon", "hair salon selfie, cape on, new haircut excitement, salon chair"),
    ("vet_office", "vet office selfie, pet carrier visible, taking pet for checkup"),
    
    # SOCIAL/FUN
    ("restaurant_birthday", "restaurant birthday selfie, cake candles behind, celebration"),
    ("wedding_guest", "wedding guest selfie, ceremony chairs behind, dressed up, happy occasion"),
    ("church_sunday", "church parking lot selfie, Sunday dress, after service, peaceful"),
    ("book_club", "book club hosting selfie, wine glasses and books visible, friends gathering"),
    ("gym_workout", "gym mirror selfie, workout done, sweaty, proud of consistency"),
    ("yoga_class", "yoga studio selfie, mat behind, namaste pose, zen vibes"),
    ("pool_day", "poolside selfie, lounge chair behind, sunglasses on, summer relaxation"),
    ("spa_day", "spa robe selfie, cucumber water in hand, self-care day"),
    ("brunch_friends", "brunch selfie, mimosa in hand, friends at table behind, weekend fun"),
    ("wine_tasting", "wine tasting selfie, vineyard behind, wine glass in hand, girls trip"),
    ("game_night", "game night hosting selfie, board games on table, snacks behind, hosting friends"),
    ("potluck", "potluck dinner selfie, casserole dish in hand, gathered with friends"),
    
    # FAMILY/LIFE
    ("kids_game", "kids sports game selfie, field behind, cheering from bleachers, proud mom"),
    ("vacation_hotel", "hotel room morning selfie, vacation bed behind, trip excitement"),
    ("new_house", "new house moving selfie, boxes behind, new home excitement"),
    ("empty_nest", "peaceful home morning selfie, quiet house, coffee, serene empty nest"),
    ("grandkids_visit", "grandma selfie, toys visible behind, grandkids visiting happiness"),
    ("family_bbq", "family gathering backyard selfie, relatives behind, summer BBQ"),
    ("thanksgiving", "Thanksgiving kitchen selfie, turkey cooking behind, hosting family"),
    ("christmas_morning", "Christmas morning pajamas selfie, tree behind, holiday happiness"),
    
    # HOBBIES
    ("painting_studio", "painting studio selfie, canvas behind, paint on hands, creative"),
    ("pottery_class", "pottery class selfie, clay on hands, wheel behind, learning new hobby"),
    ("cooking_class", "cooking class selfie, chef hat on, kitchen station, learning"),
    ("photography_walk", "photography walk selfie, camera strap visible, golden hour"),
    ("antique_shopping", "antique store selfie, vintage items behind, treasure hunting"),
    ("thrift_store", "thrift store selfie, clothes rack behind, bargain hunting"),
    ("plant_nursery", "plant nursery selfie, plants behind, selecting new houseplant"),
    ("winery_tour", "winery tour selfie, barrels behind, wine country trip"),
    ("museum_visit", "museum selfie, art on wall behind, cultural day out"),
    
    # HEALTHCARE WORKERS
    ("nurse_scrubs_break", "nurse in scrubs selfie, break room behind, coffee in hand, tired but smiling after shift"),
    ("nurse_station", "nurse selfie at nurse station, medical charts behind, proud healthcare worker"),
    ("medical_office", "medical office selfie, stethoscope around neck, clipboard in hand, caring smile"),
    ("hospital_cafeteria", "hospital cafeteria selfie, scrubs on, quick lunch break, healthcare worker life"),
    ("night_shift_nurse", "night shift nurse selfie, coffee cup, tired but dedicated smile, hospital hallway"),
    ("home_health_aide", "home health aide selfie in patient home, medical bag visible, compassionate care"),
    ("physical_therapist", "physical therapy clinic selfie, exercise equipment behind, helping patients"),
    ("dental_hygienist", "dental office selfie, dental chair behind, professional smile, healthcare setting"),
    ("pharmacy_tech", "pharmacy tech selfie, prescription bottles behind, counting pills, helpful"),
    ("emt_ambulance", "EMT selfie near ambulance, uniform on, first responder proud smile"),
    
    # SINGLE MOM LIFE
    ("singlemom_morning_chaos", "single mom morning chaos selfie, kids backpacks behind, messy hair, juggling it all"),
    ("singlemom_homework_help", "single mom helping with homework selfie, kitchen table, patient and tired but loving"),
    ("singlemom_bedtime", "single mom bedtime routine selfie, kids toothbrushes visible, pajamas, exhausted but happy"),
    ("singlemom_soccer_practice", "single mom at kids soccer practice selfie, folding chair, cheering on the sidelines"),
    ("singlemom_grocery_kids", "single mom grocery shopping with kids selfie, cart full, kids in background, multitasking"),
    ("singlemom_laundry_mountain", "single mom tackling laundry mountain selfie, piles of clothes, determined smile"),
    ("singlemom_dinner_prep", "single mom cooking dinner selfie, kids playing behind, multitasking queen"),
    ("singlemom_work_from_home", "single mom working from home selfie, laptop open, kid toys visible, balance life"),
    
    # MOM WITH KIDS
    ("mom_playground", "mom at playground selfie, kids on swings behind, watching them play, happy"),
    ("mom_baby_carrier", "mom with baby in carrier selfie, grocery store, multitasking new mom"),
    ("mom_school_drop", "mom after school drop off selfie, school building behind, coffee in hand, freedom moment"),
    ("mom_birthday_party", "mom hosting kids birthday party selfie, decorations behind, cake prep, party mode"),
    ("mom_dance_recital", "mom at dance recital selfie, auditorium, proud mama moment, dressed up"),
    ("mom_pediatrician", "mom at pediatrician waiting room selfie, kids books visible, routine checkup"),
    ("mom_library_storytime", "mom at library storytime selfie, kids section behind, reading time"),
    ("mom_swimming_lessons", "mom watching swimming lessons selfie, pool behind, proud of kids progress"),
    ("mom_art_project", "mom doing art project with kids selfie, paint and mess everywhere, creative fun"),
    ("mom_sick_kid_cuddles", "mom cuddling sick kiddo selfie, blankets and soup, nurturing moment, tired but loving"),
    
    # WELLNESS/HEALTH JOURNEY
    ("health_coach_office", "health coach in office selfie, wellness posters behind, helping clients"),
    ("nutrition_consult", "nutrition consultation selfie, food models visible, teaching healthy eating"),
    ("fitness_instructor", "fitness instructor selfie, gym class behind, energetic and motivating"),
    ("yoga_instructor", "yoga instructor selfie, peaceful studio, namaste, zen teacher vibes"),
    ("massage_therapist", "massage therapist selfie, treatment room, candles visible, healing hands"),
    ("wellness_retreat", "wellness retreat selfie, nature setting, meditation cushion, self-care weekend"),
    ("smoothie_prep", "making healthy smoothie selfie, blender and greens, wellness journey"),
    ("meal_prep_sunday", "meal prep Sunday selfie, containers everywhere, organized and healthy"),
    ("morning_vitamins", "morning vitamins routine selfie, supplement bottles, healthy habits"),
    ("functional_medicine", "functional medicine practitioner selfie, holistic health books behind, caring approach"),
]

# Target demographic: US 40+ WHITE WOMEN ONLY
ETHNICITIES = [
    "white American woman",
    "white American woman", 
    "white American woman",
    "white American woman with blonde hair",
    "white American woman with brown hair",
    "white American woman with auburn hair",
    "white American woman with gray hair",
    "white American woman with silver hair",
]

# Age ranges - 40 to 65 (US target demo)
AGES = list(range(40, 66))  # 40 to 65

CLOTHING = [
    "casual t-shirt", "old hoodie", "yoga pants", "jeans and sweater", "sundress",
    "work blouse", "athleisure", "scrubs", "cardigan", "flannel shirt",
    "oversized sweater", "tank top", "comfortable pajamas"
]

EXPRESSIONS = [
    "genuine smile", "content relaxed smile", "laughing", "peaceful expression",
    "happy grin", "soft smile", "warm friendly smile", "proud smile"
]

# Track existing combos to avoid duplicates
EXISTING_COMBOS = set()

def load_existing_combos():
    """Load existing age+scene combos from disk to avoid duplicates"""
    global EXISTING_COMBOS
    import re
    for filename in os.listdir(OUTPUT_DIR):
        if filename.endswith('.png') and filename.startswith('user_'):
            # Extract age and scene from filename: user_45_kitchen_baking_timestamp.png
            match = re.match(r'user_(\d+)_(.+?)_\d+\.png', filename)
            if match:
                age = int(match.group(1))
                scene = match.group(2)
                EXISTING_COMBOS.add((age, scene))
    print(f"📂 Found {len(EXISTING_COMBOS)} existing age+scene combos to skip")

def get_unique_combo():
    """Get unique age + scene combo that doesn't already exist"""
    # Try to find unused combo
    max_attempts = 500
    for _ in range(max_attempts):
        # Pick a scene
        available_scenes = [s for s in SCENE_TEMPLATES if s[0] not in USED_SCENES]
        if not available_scenes:
            USED_SCENES.clear()
            available_scenes = SCENE_TEMPLATES.copy()
        
        scene = random.choice(available_scenes)
        USED_SCENES.add(scene[0])
        
        # Pick an age
        available_ages = [a for a in range(40, 66) if a not in USED_AGES]
        if not available_ages:
            USED_AGES.clear()
            available_ages = list(range(40, 66))
        
        age = random.choice(available_ages)
        USED_AGES.add(age)
        
        # Check if this combo already exists
        if (age, scene[0]) not in EXISTING_COMBOS:
            EXISTING_COMBOS.add((age, scene[0]))  # Mark as used
            return age, scene
    
    # If we can't find unique, just return any combo (fallback)
    scene = random.choice(SCENE_TEMPLATES)
    age = random.choice(range(40, 66))
    return age, scene

def generate_prompt(index):
    """Generate diverse amateur profile photo prompt - US 40+ WHITE WOMEN"""
    age, (scene_key, scene_desc) = get_unique_combo()
    ethnicity = random.choice(ETHNICITIES)
    clothing = random.choice(CLOTHING)
    expression = random.choice(EXPRESSIONS)
    
    prompt = f"""iPhone selfie photo of a {age}-year-old {ethnicity}, wearing {clothing}, {expression}. {scene_desc}. Completely amateur phone photo quality, not professional, real everyday American woman, authentic candid moment. 1:1 square format."""
    
    return {
        "age": age,
        "scene": scene_key,
        "prompt": prompt
    }

def submit_wavespeed(prompt, api_key):
    """Submit image generation request to WaveSpeed"""
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}
    payload = {
        "aspect_ratio": "1:1",
        "enable_sync_mode": False,
        "output_format": "png",
        "prompt": prompt,
        "resolution": "1k"
    }
    try:
        response = requests.post(WAVESPEED_API_BASE, headers=headers, json=payload)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def poll_wavespeed(request_id, api_key):
    """Poll WaveSpeed for completion"""
    headers = {"Authorization": f"Bearer {api_key}"}
    for _ in range(60):  # 2 min max
        try:
            r = requests.get(f"{WAVESPEED_RESULT_BASE}/{request_id}/result", headers=headers)
            data = r.json()
            status = data.get("data", {}).get("status")
            if status == "completed":
                return data
            if status == "failed":
                return {"error": "generation_failed"}
        except:
            pass
        time.sleep(2)
    return {"error": "timeout"}

def download_image(url, path):
    """Download image from URL"""
    try:
        r = requests.get(url, stream=True, timeout=30)
        if r.status_code == 200:
            with open(path, 'wb') as f:
                for chunk in r.iter_content(8192):
                    f.write(chunk)
            return True
    except:
        pass
    return False

def generate_one_profile(index, wavespeed_key):
    """Generate one complete user profile image"""
    
    # Generate prompt
    prompt_data = generate_prompt(index)
    prompt = prompt_data["prompt"]
    
    # Submit to WaveSpeed
    submit_result = submit_wavespeed(prompt, wavespeed_key)
    request_id = submit_result.get("data", {}).get("id")
    
    if not request_id:
        return {"index": index, "status": "failed", "error": "wavespeed submit failed"}
    
    # Poll for completion
    completion = poll_wavespeed(request_id, wavespeed_key)
    
    if "error" in completion:
        return {"index": index, "status": "failed", "error": completion["error"]}
    
    # Download image
    outputs = completion.get("data", {}).get("outputs", [])
    if not outputs:
        return {"index": index, "status": "failed", "error": "no output image"}
    
    # Create filename
    filename = f"user_{prompt_data['age']}_{prompt_data['scene']}_{int(time.time())}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    if download_image(outputs[0], filepath):
        return {
            "index": index,
            "status": "success",
            "path": filepath,
            "age": prompt_data["age"],
            "scene": prompt_data["scene"]
        }
    else:
        return {"index": index, "status": "failed", "error": "download failed"}

def main(count=100):
    """Generate specified number of user profile images"""
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Pre-load existing combos to avoid duplicates
    load_existing_combos()
    
    print(f"\n🎭 Generating {count} User Profile Images")
    print(f"📁 Output: {OUTPUT_DIR}")
    print(f"🎨 Using {len(SCENE_TEMPLATES)} unique scenes")
    print(f"👥 US WHITE WOMEN Ages 40-65")
    print("-" * 60)
    
    start = time.time()
    results = []
    
    # Process in parallel
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {}
        for i in range(count):
            wavespeed_key = WAVESPEED_API_KEYS[i % len(WAVESPEED_API_KEYS)]
            future = executor.submit(generate_one_profile, i, wavespeed_key)
            futures[future] = i
        
        for i, future in enumerate(as_completed(futures), 1):
            result = future.result()
            results.append(result)
            
            if result["status"] == "success":
                print(f"✅ [{i}/{count}] user_{result['age']}_{result['scene']}", flush=True)
            else:
                print(f"❌ [{i}/{count}] Failed: {result.get('error', 'unknown')}", flush=True)
    
    elapsed = time.time() - start
    success_count = sum(1 for r in results if r["status"] == "success")
    
    print("-" * 60)
    print(f"⏱️ {elapsed:.0f}s | ✅ {success_count}/{count} images generated")
    
    # Show scene diversity
    scenes_used = list(USED_SCENES)
    print(f"🎯 Scene Diversity: {len(scenes_used)} unique scenes")
    
    # Save manifest
    manifest = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_count": count,
        "success_count": success_count,
        "scenes_used": scenes_used,
        "results": results
    }
    manifest_path = os.path.join(OUTPUT_DIR, "generation_manifest.json")
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f"📋 Manifest saved: {manifest_path}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Generate user profile images")
    parser.add_argument("--count", type=int, default=100, help="Number of images to generate")
    args = parser.parse_args()
    
    main(args.count)
