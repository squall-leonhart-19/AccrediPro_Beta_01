import os
import json
import time
import threading
import re
import random
import csv
import zipfile
import shutil
from queue import Queue
from json_repair import repair_json
from concurrent.futures import ThreadPoolExecutor, as_completed
from jinja2 import Environment, FileSystemLoader
import pynliner

# --- LANGUAGE CONFIGURATION ---
try:
    from language_configs import get_language_config, get_available_languages
except ImportError:
    print("ERROR: Make sure 'language_configs.py' is in the same directory.")
    def get_language_config(code):
        return {"language_name": "English", "code": "en"}
    def get_available_languages():
        return [("en", "English")]

# --- LOGGING FUNCTION ---
log_lock = threading.Lock()

def log(message, level="INFO"):
    """Logs a message to the console with timestamp, level, and thread info."""
    with log_lock:
        colors = {"INFO": "\033[94m", "SUCCESS": "\033[92m", "WARNING": "\033[93m", "ERROR": "\033[91m", "TASK": "\033[96m", "ENDC": "\033[0m"}
        timestamp = time.strftime("%H:%M:%S")
        thread_name = threading.current_thread().name.replace("ThreadPoolExecutor-", "")
        print(f"{colors.get(level, '')}[{timestamp}] [{level:^7}] [{thread_name:^15}] {message}{colors['ENDC']}")

# --- API KEY MANAGEMENT ---
API_KEYS_FILE = "config/api_keys.txt"
thread_local = threading.local()
api_key_queue = Queue()

def load_api_keys(filepath):
    """Loads API keys from a file, creating the file and directory if they don't exist."""
    keys = []
    try:
        config_dir = os.path.dirname(filepath)
        if config_dir and not os.path.exists(config_dir):
            os.makedirs(config_dir)
        if not os.path.exists(filepath):
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write("# Add your Google Gemini API keys here, one per line.\n")
            return []
        with open(filepath, 'r', encoding='utf-8') as f:
            keys = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        if not keys:
            print(f"WARNING: No active API keys found in {filepath}.")
        else:
            print(f"SUCCESS: Loaded {len(keys)} API keys from file.")
        return keys
    except Exception as e:
        print(f"ERROR: Could not read or create API keys file at {filepath}: {e}")
        return []

all_keys = load_api_keys(API_KEYS_FILE)
if all_keys:
    random.shuffle(all_keys)
    for key in all_keys:
        api_key_queue.put(key)

def get_key_for_thread():
    """Assigns a unique API key to the current thread from the queue."""
    if not hasattr(thread_local, 'api_key'):
        try:
            # This will now wait until a key is available, preventing errors.
            thread_local.api_key = api_key_queue.get(block=True, timeout=120) 
        except Exception:
            # This fallback is now safer.
            if all_keys:
                log("Queue was empty, assigning a random key as a last resort.", "WARNING")
                thread_local.api_key = random.choice(all_keys)
            else:
                thread_local.api_key = None
    return thread_local.api_key

def rotate_key_for_thread():
    """Rotates the API key for the current thread."""
    old_key = getattr(thread_local, 'api_key', None)
    if old_key:
        api_key_queue.put(old_key)
    # Clear the old key and get a new one by calling the main function
    thread_local.api_key = None
    get_key_for_thread()

# --- GEMINI API CALL FUNCTION ---
import google.generativeai as genai
from google.api_core import exceptions

GENERATION_CONFIG = {"temperature": 0.8, "top_p": 0.95, "top_k": 64, "max_output_tokens": 8192}
SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]

def call_gemini_api_with_retry(prompt, max_retries=7, backoff_factor=3):
    """Calls the Gemini API with automatic retry and key rotation on failure."""
    for attempt in range(max_retries):
        api_key = get_key_for_thread()
        if not api_key:
            log(f"Thread {threading.current_thread().name} could not secure an API key.", "ERROR")
            time.sleep(backoff_factor)
            continue

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(
                model_name="gemini-2.0-flash-lite",
                generation_config=GENERATION_CONFIG,
                safety_settings=SAFETY_SETTINGS
            )
            response = model.generate_content(prompt, request_options={"timeout": 240})
            if response.text:
                return response.text
            else:
                log(f"API returned empty response. Content may have been blocked.", "WARNING")
                return None
        except Exception as e:
            wait_time = (backoff_factor ** attempt) + random.uniform(0, 1)
            log(f"API Error: {e}. Retrying in {wait_time:.2f}s...", "WARNING")
            rotate_key_for_thread()
            time.sleep(wait_time)
    log(f"API call failed after all retries.", "ERROR")
    return None

# --- CORE CONFIGURATION ---
CONFIG = {
    "MAX_CONCURRENT_TASKS": 50,
    "main_output_dir": "output/certification_courses",
    "niches_folder": "niches",
    "current_year": time.strftime("%Y"),
    "publisher": "AccrediPro",
    "templates_folder": "templates"
}
BRAND_VOICE_GUIDE = {
    "persona_name": "Sarah Johnson, M.Ed.",
    "voice_profile": """
    Your name is Sarah Johnson, M.Ed. Your voice is a powerful blend of three things:
    1. **Academic Authority:** You are grounded in science and evidence. You speak with the confidence of a university professor.
    2. **Empathetic Mentor:** You've been where the student is. You understand their fears ("Yeah, but...") and their dreams. Your tone is deeply encouraging, respectful, and nurturing.
    3. **Successful Entrepreneur:** You are not just a teacher; you are a practitioner who has built a thriving business. Every piece of advice is practical, actionable, and tied to real-world success.
    """,
    "guiding_philosophy": "This is not just a course; it is a **transformation**. Every lesson must move the student closer to a new identity as a confident, competent, and successful practitioner. Focus on empowerment, clarity, and tangible outcomes. Avoid dry, academic language. Use storytelling and metaphors to make complex topics relatable."
}

# --- TEAM STRUCTURE ---
EXPERT_TEAM = {
    "sarah": {"name": "Sarah Johnson, M.Ed.", "role": "Lead Instructor & Program Director", "image_text": "SJ"},
    "jessica": {"name": "Jessica Martinez", "role": "Family Dynamics Specialist", "image_text": "JM"},
    "michael": {"name": "Michael Johnson", "role": "Autism Advocate & Lived Experience Expert", "image_text": "MJ"},
    "emma": {"name": "Emma Chen", "role": "Current Student & Peer Mentor", "image_text": "EC"},
    "dr_david_chen": {"name": "Dr. David Chen, PhD", "role": "Veteran Practitioner & Researcher", "image_text": "DC"}
}

# --- ICONS DICTIONARY ---
ICONS = {
    "lesson": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
    "method": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-award"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>'
}

# --- MASTER STYLE GUIDE (FINAL, LARGER VERSION) ---
STYLE_GUIDE = {
    "body": "font-family: 'Inter', sans-serif; background-color: #fdfbf7; color: #1f2937; font-size: 22px; line-height: 1.7; margin: 0; padding: 2rem;",
    "h1": "font-family: 'Playfair Display', Georgia, serif; font-size: 60px; font-weight: 700; color: #4c1d95; margin-top: 1rem; line-height: 1.2;",
    "h2": "font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 700; color: #7c4e9f; margin-bottom: 2rem;",
    "h3": "font-family: 'Playfair Display', Georgia, serif; font-size: 38px; font-weight: 600; margin-bottom: 1.5rem;",
    "p": "font-size: 22px; line-height: 1.8; color: #4b5563;",
    "strong": "font-weight: 700; color: #6b4289;",
    "mark": "background-color: #fef9c3; color: #713f12; padding: 2px 8px; border-radius: 4px;"
}

# --- CERTIFICATION & ACADEMY STRUCTURE ---
CERTIFICATION_STRUCTURE = {
    "levels": [
        {"number": 1, "title": "Foundation Practitioner", "modules": 6},
        {"number": 2, "title": "Certified Practitioner", "modules": 6},
        {"number": 3, "title": "Advanced Practitioner", "modules": 6},
        {"number": 4, "title": "Expert Practitioner", "modules": 6},
        {"number": 5, "title": "Master Consultant or Senior Specialist", "modules": 7}
    ],
    "lessons_per_module": 5
}

BUSINESS_ACADEMY_STRUCTURE = [
    {
        "course_number": 1, "title": "The CEO Mindset & Bulletproof Foundations", "folder": "COURSE_1_FOUNDATIONS",
        "modules": [
            {"module_number": 1, "title": "From Healer to CEO - Embracing Your New Identity", "lessons": 5},
            {"module_number": 2, "title": "The 'Boring' Stuff Made Simple - Legal & Ethics", "lessons": 5},
            {"module_number": 3, "title": "Financial Clarity & Confident Pricing", "lessons": 5},
            {"module_number": 4, "title": "Crafting Your Unique Niche", "lessons": 5},
            {"module_number": 5, "title": "The Art of Productivity for a Solo-CEO", "lessons": 5},
            {"module_number": 6, "title": "Your Professional Toolkit", "lessons": 5}
        ]
    },
    {
        "course_number": 2, "title": "Your First 5 Clients - The Authentic Attraction Method", "folder": "COURSE_2_MARKETING",
        "modules": [
            {"module_number": 1, "title": "Building Your Online Home", "lessons": 5},
            {"module_number": 2, "title": "Social Media Without the Overwhelm", "lessons": 5},
            {"module_number": 3, "title": "The Power of Your Network", "lessons": 5},
            {"module_number": 4, "title": "Heart-to-Heart Enrollment Conversations", "lessons": 5},
            {"module_number": 5, "title": "Creating Your Signature Program", "lessons": 5},
            {"module_number": 6, "title": "The First 5 Client Case Study", "lessons": 5}
        ]
    },
    {
        "course_number": 3, "title": "Coaching Mastery & Client Transformation", "folder": "COURSE_3_DELIVERY",
        "modules": [
            {"module_number": 1, "title": "The Art of the Coaching Session", "lessons": 5},
            {"module_number": 2, "title": "Advanced Coaching Techniques", "lessons": 5},
            {"module_number": 3, "title": "The Science of Habit Change", "lessons": 5},
            {"module_number": 4, "title": "Documenting and Tracking Client Progress", "lessons": 5},
            {"module_number": 5, "title": "Group Coaching Mastery", "lessons": 5},
            {"module_number": 6, "title": "Your Continuing Education as a Coach", "lessons": 5}
        ]
    },
    {
        "course_number": 4, "title": "Authority & Personal Branding", "folder": "COURSE_4_AUTHORITY",
        "modules": [
            {"module_number": 1, "title": "Your Brand Identity", "lessons": 5},
            {"module_number": 2, "title": "Content That Establishes Expertise", "lessons": 5},
            {"module_number": 3, "title": "The Power of PR and Media", "lessons": 5},
            {"module_number": 4, "title": "Your Signature Talk", "lessons": 5},
            {"module_number": 5, "title": "The Bestselling Book", "lessons": 5},
            {"module_number": 6, "title": "Building a Thriving Community", "lessons": 5}
        ]
    },
    {
        "course_number": 5, "title": "Scaling Your Impact & Income to 6-Figures and Beyond", "folder": "COURSE_5_SCALING",
        "modules": [
            {"module_number": 1, "title": "Advanced Business Models", "lessons": 5},
            {"module_number": 2, "title": "Building Your Dream Team", "lessons": 5},
            {"module_number": 3, "title": "The Automated Business", "lessons": 5},
            {"module_number": 4, "title": "Financial Mastery for the CEO", "lessons": 5},
            {"module_number": 5, "title": "The Art of the Launch", "lessons": 5},
            {"module_number": 6, "title": "Your Legacy as a Leader", "lessons": 5}
        ]
    }
]

PRACTITIONER_LAB_STRUCTURE = [
    {"course_number": 1, "title": "Foundational Client Skills Lab", "folder": "LAB_1_CLIENT_SKILLS", "modules": 6, "lessons_per_module": 5, "complexity": "a straightforward client case with common issues like general fatigue and basic digestive complaints."},
    {"course_number": 2, "title": "Applied Protocols & Methods Lab", "folder": "LAB_2_PROTOCOLS", "modules": 6, "lessons_per_module": 5, "complexity": "an intermediate client case with clear signs of adrenal stress and suspected food sensitivities."},
    {"course_number": 3, "title": "Advanced Case Study Analysis Lab", "folder": "LAB_3_CASE_STUDIES", "modules": 6, "lessons_per_module": 5, "complexity": "a complex, multi-system client case, such as interconnected hormonal imbalances and gut dysbiosis."},
    {"course_number": 4, "title": "Expert Intervention Strategies Lab", "folder": "LAB_4_INTERVENTIONS", "modules": 6, "lessons_per_module": 5, "complexity": "a highly complex client case with comorbidities, such as a diagnosed autoimmune condition and significant lifestyle challenges."},
    {"course_number": 5, "title": "Mastery & Consultation Lab", "folder": "LAB_5_MASTERY", "modules": 7, "lessons_per_module": 5, "complexity": "a consultant-level challenge where another practitioner is 'stuck' and has referred the client for a second opinion."}
]
# --- PROMPT TEMPLATES ---
PROMPT_TEMPLATES = {
    "standard_lesson": """
    **PERSONA & DIRECTIVE (CRITICAL):**
    Adhere strictly to the following brand voice and philosophy:
    - **Persona:** {brand_voice[persona_name]}
    - **Voice Profile:** {brand_voice[voice_profile]}
    - **Guiding Philosophy:** {brand_voice[guiding_philosophy]}

    **CRITICAL GOAL:**
    Your primary objective is to produce a complete and valid JSON object in **{language_name}**. Every single key in the provided structure MUST be present and populated with substantial, high-quality content.

    **CRITICAL INSTRUCTIONS:**
    1.  Write rich, detailed, and scannable HTML. Use `<h3>`, `<ul>`/`<ol>`, `<strong>`, and `<blockquote>`.
    2.  Throughout all generated text, identify and wrap 5-7 of the most important keywords or phrases in `<mark>` tags.
    3.  Actively avoid starting different JSON string values with similar phrases to ensure variety.

    **TASK:**
    Generate the JSON for lesson "{les_title}".

    {{
      "learning_objectives": ["A list of 3-4 **transformational outcomes**. Frame them as new capabilities. Start each with a powerful action verb (e.g., 'Confidently apply X to solve Y for your clients')."],
      "section1_content": "Full, multi-paragraph HTML content (minimum 250 words) for the first core concept.",
      "section2_content": "Full, multi-paragraph HTML content (minimum 250 words) for the second core concept.",
      "section3_content": "Full, multi-paragraph HTML content (minimum 250 words) for the third core concept.",
      "case_study": {{
        "title": "Case Study: [Relevant Title]",
        "scenario": "A realistic, multi-faceted situation a professional would genuinely encounter.",
        "approach": "A detailed explanation of how to apply this lesson's concepts to the scenario."
      }},
      "unifying_case_study_application": {{
          "title": "Golden Thread: Applying this to {unifying_client[name]}'s Journey",
          "body": "A short, insightful HTML paragraph explaining how this lesson's specific topic is a crucial piece of the puzzle for solving {unifying_client[name]}'s larger health issues ({unifying_client[tagline]})."
      }},
      "career_impact": {{
          "title": "From Student to In-Demand Professional",
          "body": "A short, powerful HTML paragraph explaining how mastering THIS specific lesson makes the student more marketable. Connect it to a higher salary, better client results, or a unique selling proposition they can add to their website."
      }},
      "business_application": {{
          "title": "The Business Application 💰",
          "body": "Actionable HTML content explaining how a practitioner can use this knowledge in their business. Provide one example for marketing (e.g., blog post idea) and one for program design (e.g., where this fits in a signature program)."
      }},
      "overcoming_imposter_syndrome": {{
        "title": "Your 'Yeah, But...' Moment 🤔",
        "common_fear": "A common fear or self-doubt students have about this topic.",
        "sarah_reframe": "An empathetic and empowering reframe from Sarah that validates the fear but shows them why they ARE capable. **Exemplar Quality:** For a fear like 'I'm not an expert yet,' the reframe should be: 'That feeling is your high standards speaking. Remember, you don't need to be a 'guru' to be a guide. You just need to be one step ahead to light the way for someone else. This lesson gives you that step.'"
      }},
      "quick_win": "A simple, 15-minute action a student can take immediately after the lesson to apply their knowledge and feel a sense of progress.",
      "powerful_quote": "A single, impactful sentence from 'Sarah' that summarizes the lesson's core wisdom. Should be tweetable.",
      "takeaways": ["A list of 3-4 concise, full-sentence key takeaways."],
      "next_lesson_preview": {{"title": "Title of next lesson", "body": "A short, engaging preview."}}
    }}

    Generate ONLY the complete, valid JSON object.
    """,

    "method_lesson": """
    **PERSONA & DIRECTIVE (CRITICAL):**
    Adhere strictly to the following brand voice and philosophy:
    - **Persona:** {brand_voice[persona_name]}
    - **Voice Profile:** {brand_voice[voice_profile]}
    - **Guiding Philosophy:** {brand_voice[guiding_philosophy]}

    **GUIDING PHILOSOPHY for THIS METHOD:**
    Your goal is to create a complete **"business-in-a-box"** for this specific Method. When a student finishes this lesson, they must have a new, marketable *service* they can offer immediately. This is not a summary; it is a practical, actionable toolkit that builds both competence and confidence. Use emojis like 🛠️, 💡, and 💰 to signify practical tools and business insights.

    **TASK:**
    Create a complete toolkit for the capstone Method of the module "{mod_title}", which synthesized these lessons:
    {lessons_str}

    **CRITICAL INSTRUCTIONS:**
    1. Generate a single, valid JSON object in **{language_name}**. ALL fields are required and must contain substantial, detailed content.
    2. Write the FULL, DETAILED content for each section as rich HTML. Use headings, lists, and bold tags.
    3. Wrap 7-10 important keywords/phrases in `<mark>` tags.
    4. **Avoid Repetitive Framing:** Do not start different sections with the same leading phrases.

    **JSON STRUCTURE (ALL FIELDS REQUIRED):**
    {{
      "lesson_title": "A powerful, brandable name for the method, starting with 'Method:'.",
      "learning_objectives": ["A list of 3-4 objectives focused on APPLYING this method with clients and in their business."],
      "method_overview": "A compelling, multi-paragraph HTML introduction (minimum 200 words). It MUST clearly answer: 1. What specific problem does this Method solve? 2. What is the core principle behind it? 3. What tangible outcome will the client receive? This section must sell the value of the Method itself.",
      "coachs_toolkit": {{
        "title": "🛠️ Your Coach's Toolkit (Downloadables)",
        "worksheet_coach_facing": "The full text/content for a detailed PDF worksheet for the COACH to use during a session.",
        "handout_client_facing": "The full text/content for a simple, one-page PDF handout for the CLIENT (e.g., pre-session questionnaire or post-session summary)."
      }},
      "step_by_step_guide": "Full HTML content detailing the step-by-step process. (Minimum 4-5 detailed steps).",
      "in_session_guide": {{
        "title": "💡 In-Session Coaching Guide",
        "key_question_scripts": ["A list of at least 4 powerful, open-ended questions a coach can use."],
        "handling_resistance_scenarios": [
          {{"scenario": "A common client objection, e.g., 'I don't have time for this.'", "response_script": "A word-for-word best-practice response script for the coach."}},
          {{"scenario": "Another common client challenge.", "response_script": "Another empathetic and effective response script."}}
        ]
      }},
      "unifying_case_study_application": {{
          "title": "Golden Thread: Applying this Method to {unifying_client[name]}'s Journey",
          "body": "A short, insightful HTML paragraph explaining how this specific Method would be a turning point for {unifying_client[name]}, our unifying case study client ({unifying_client[tagline]})."
      }},
      "business_blueprint": {{
        "title": "💰 The Business Blueprint: Monetizing This Method",
        "marketing_language": "Specific, compelling copy the coach can use on their website or in consultations to describe this valuable service.",
        "social_media_prompts": ["A list of 2-3 ready-to-use social media post ideas to promote this new skill."],
        "packaging_and_pricing_strategy": "Actionable advice on how to package this method as a premium service (e.g., 'This Method is the perfect foundation for your 90-minute Initial Deep Dive session, which you can confidently price at $350+ because...')."
      }},
      "method_cheat_sheet": {{
        "title": "The Method Cheat Sheet",
        "objective": "A single, concise sentence describing the goal of this method.",
        "key_steps": [
            {{"step_number": 1, "description": "A brief summary of the first key action."}},
            {{"step_number": 2, "description": "A brief summary of the second key action."}},
            {{"step_number": 3, "description": "A brief summary of the third key action."}}
        ],
        "pro_tip": "The single most important pro-tip for making this method effective."
      }},
      "next_lesson_preview": {{"title": "Title of next module", "body": "An exciting preview of what's coming next."}}
    }}

    Generate ONLY the complete, valid JSON object.
    """
}
# --- HELPER FUNCTIONS ---
LANG_CONFIG = {}

def sanitize_filename(name):
    """Cleans a string to be a valid filename."""
    name = re.sub(r'[^\w\s-]', '', name).strip()
    return re.sub(r'[-\s]+', '_', name)

def clean_ai_generated_text(text):
    """Fixes common UTF-8 corruption issues in AI-generated text."""
    if not isinstance(text, str):
        return text
    fixes = {
        'Ã¢â‚¬"': 'â€"', 'Ã¢â‚¬"': 'â€"', 'Ã¢â‚¬â„¢': "'", 'Ã¢â‚¬Ëœ': "'",
        'Ã¢â‚¬Å"': '"', 'Ã¢â‚¬': '"', 'Ã¢â‚¬Â¢': 'â€¢', 'Ã¢â‚¬Â¦': 'â€¦',
    }
    for corrupt, correct in fixes.items():
        text = text.replace(corrupt, correct)
    return text

def clean_json_content(data):
    """Recursively cleans all string values in a JSON object."""
    if isinstance(data, dict):
        return {key: clean_json_content(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [clean_json_content(item) for item in data]
    elif isinstance(data, str):
        return clean_ai_generated_text(data)
    else:
        return data

def extract_json_and_clean(response_text):
    """Extracts a JSON object from a string, cleans it, and fixes common errors."""
    if not response_text:
        return None
    
    cleaned_response = clean_ai_generated_text(response_text)
    match = re.search(r'```json\s*(\{.*\}|\[.*\])\s*```|(\{.*\}|\[.*\])', cleaned_response, re.DOTALL)
    
    if not match:
        log("No JSON object or array found in response.", "WARNING")
        return None
    
    json_str = match.group(1) or match.group(2)
    
    # Fix illegal trailing commas
    json_str = re.sub(r',\s*(\}|\])', r'\1', json_str)
    
    # Basic cleanup
    json_str = json_str.replace('\\n', ' ').replace('\\r', ' ')
    
    try:
        # First, try the standard, fast method
        parsed_data = json.loads(json_str)
        return clean_json_content(parsed_data)
    except json.JSONDecodeError:
        # If it fails, try to repair the broken JSON
        log("Standard JSON decode failed. Attempting to repair...", "WARNING")
        try:
            repaired_json_str = repair_json(json_str)
            parsed_data = json.loads(repaired_json_str)
            return clean_json_content(parsed_data)
        except Exception as e:
            log(f"JSON repair failed: {e}", "ERROR")
            return None

def call_gemini_with_json_retry(prompt, task_description="JSON generation", max_retries=3):
    """Calls Gemini and retries if the response is not valid JSON."""
    for attempt in range(max_retries):
        response_text = call_gemini_api_with_retry(prompt)
        if response_text:
            json_data = extract_json_and_clean(response_text)
            if json_data:
                return json_data
        log(f"Task '{task_description}' failed to return valid JSON. Retrying ({attempt+2}/{max_retries})...", "WARNING")
        time.sleep(2 * (attempt + 1))
    log(f"Task '{task_description}' failed after {max_retries} attempts.", "ERROR")
    return None

# --- REPLACEMENT FOR safe_file_write (SIMPLIFIED VERSION) ---

def safe_file_write(content, filepath):
    """Writes content to a file, creating directories if needed and cleaning text."""
    try:
        # The templates now handle all styling, so we only need to clean and write.
        cleaned_content = clean_ai_generated_text(content)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8', errors='replace') as f:
            f.write(cleaned_content)
        return True
    except Exception as e:
        log(f"Failed to write {filepath}: {e}", "ERROR")
        return False
def select_language():
    """Displays a menu for the user to select which language(s) to generate."""
    available_languages = get_available_languages()
    print("\n" + "="*70 + "\nSELECT LANGUAGE\n" + "="*70)
    for i, (code, name) in enumerate(available_languages, 1):
        print(f"  {i}. {name} ({code})")
    print("\n  0. Generate ALL languages (sequential)\n" + "="*70)
    while True:
        try:
            choice = input("\nSelect language number (or 'q' to quit): ").strip()
            if choice.lower() == 'q': exit(0)
            choice_num = int(choice)
            if choice_num == 0: return [code for code, name in available_languages]
            elif 1 <= choice_num <= len(available_languages): return [available_languages[choice_num - 1][0]]
            else: print("Invalid choice.")
        except ValueError: print("Please enter a number.")

def calculate_lesson_number_in_course(level_number, module_number, lesson_number, master_plan):
    """Calculates the sequential lesson number across the entire course."""
    total_lessons = 0
    
    # Count lessons from previous levels
    for level in master_plan.get("academy", []):
        if level["level_number"] < level_number:
            for module in level.get("modules", []):
                total_lessons += len(module.get("lessons", []))
    
    # Count lessons from previous modules in current level
    current_level = next((l for l in master_plan.get("academy", []) if l["level_number"] == level_number), None)
    if current_level:
        for module in current_level.get("modules", []):
            if module["module_number"] < module_number:
                total_lessons += len(module.get("lessons", []))
            elif module["module_number"] == module_number:
                total_lessons += lesson_number
                break
    
    return total_lessons

# --- PERSONAS AND NARRATIVE FUNCTIONS ---
def discover_and_generate_personas(niche_topic, category, language_name):
    """Uses AI to generate richer buyer personas for a given niche."""
    log(f"Discovering and generating enriched personas for niche: '{niche_topic}'...", "TASK")
    niche_key = sanitize_filename(niche_topic).lower()
    prompt = f"""
    You are a world-class market research strategist. Your task is to analyze the niche topic "{niche_topic}" and develop the 3-4 most common buyer personas for a professional certification course. The course and all output must be in **{language_name}**.

    Generate a single, valid JSON object. The root key must be "{niche_key}". For each persona, create a simple, one-word key (e.g., "nurse", "coach"). Each persona object must contain:
    - "name": A realistic name.
    - "description": A short paragraph.
    - "pain_points": A list of 4 strings, written in the first-person.
    - "goals": A list of 4 strings describing their desired outcomes.
    - "motivations": A list of 2-3 core drivers.
    - "learning_preferences": A list of 2-3 learning styles.

    Your entire output must be ONLY the valid JSON object.
    """
    persona_data = call_gemini_with_json_retry(prompt, f"Persona Discovery for {niche_topic}")
    if not persona_data:
        log("Failed to extract valid JSON from persona discovery response.", "ERROR")
        return None
    persona_dir = os.path.join(CONFIG["main_output_dir"], "_personas", category)
    os.makedirs(persona_dir, exist_ok=True)
    file_path = os.path.join(persona_dir, f"{niche_key}_personas.json")
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(persona_data, f, indent=4, ensure_ascii=False)
        log(f"Enriched personas saved successfully to '{file_path}'", "SUCCESS")
    except Exception as e:
        log(f"Could not save persona file: {e}", "ERROR")
    return persona_data

def generate_onboarding_module(course_title, language_name):
    """Generates the consolidated 'Module 00: Start Here' content with a single lesson."""
    log("Generating Consolidated Onboarding Module (Module 00)...", "TASK")
    
    single_lesson_content = """
    <h3>A Personal Message From Me (Sarah)</h3>
    <p>Hello, and welcome! I'm Sarah, your lead instructor, and I am genuinely so glad you're here.</p>
    
    <p>I know the feeling of starting something new - the mix of excitement and maybe a little bit of 'Can I really do this?'</p>
    
    <p>Let me put that to rest right now: <mark>You can, and you will.</mark></p>
    
    <p>You are here because you are capable and driven to make a real difference. This program was built for you.</p>
    
    <h3>Our Goal: Your Transformation</h3>
    <p>The single biggest goal of this course is to help you step into a new identity as a <mark>confident, competent, and successful practitioner</mark>.</p>
    
    <p>This journey is about more than just gathering information - it's about transformation.</p>
    
    <p>We will give you the skills, the tools, and the frameworks not just to help others, but to build a thriving, impactful career for yourself.</p>

    <h3>How We'll Get There: Small Wins, No Pressure</h3>
    <p>It's easy to feel overwhelmed, so we have a simple philosophy: <mark>learn at your own pace and celebrate the small wins.</mark></p>
    
    <p>You have lifetime access to this program for a reason. Whether you fly through it in weeks or savor it over months, the content will be here for you.</p>
    
    <p>There are no deadlines, so you can learn in a way that truly fits your life. <mark>You can't fall behind here.</mark></p>
    
    <p>Your only task right now is to complete this first lesson and join our private community.</p>
    
    <p>That's your first 'small win' - and it's the most important one. I am personally active in the channel every single day to support you.</p>
    
    <p>Let's begin this journey together.</p>
    """
    
    return {
      "module_number": "00",
      "module_title": "Welcome! Your Journey Begins Here",
      "module_intro": "<h3>Welcome to the family!</h3><p>I'm Sarah, and I am genuinely thrilled to have you here. Take a deep breath and celebrate this step you've taken. This program is a supportive, nurturing space where you can grow with confidence. Remember, this is **your journey**, at your own pace. Let's begin!</p>",
      "lessons": [
        {
          "lesson_number": 1,
          "lesson_title": "Your Journey, Your Community & Your First Steps",
          "section1_content": single_lesson_content
        }
      ]
    }

def generate_unifying_case_study_client(niche_topic, language_name, persona_data):
    """Generates the 'Golden Thread' case study client for the entire course."""
    log("Generating Unifying 'Golden Thread' Case Study Client...", "TASK")
    first_persona_desc = list(persona_data.values())[0][next(iter(list(persona_data.values())[0]))]['description']
    
    prompt = f"""
    Based on the niche "{niche_topic}" and the primary persona described as "{first_persona_desc}", create a single, detailed case study client. This client's story will be referenced in every 'Method' lesson throughout the 5 levels of the certification.

    Generate a single, valid JSON object with the following keys:
    {{
      "name": "The client's first name (e.g., 'Jane').",
      "tagline": "A short, memorable tagline.",
      "full_profile": "A detailed, multi-paragraph HTML description of the client's background."
    }}
    Generate ONLY the valid JSON object.
    """
    return call_gemini_with_json_retry(prompt, f"Case Study Client for {niche_topic}")

def generate_final_module_content(level_info, next_level_info=None):
    """Generates the content for the final module of any given level with a single lesson."""
    log(f"Generating static final module for Level {level_info['number']}...", "TASK")
    module_number = level_info['modules'] + 1
    
    exam_content = f"<h3>Step 1: Make Your Achievement Official!</h3><p>Congratulations on completing the core content of Level {level_info['number']}!</p><p>The final step for this level is to take and pass the <mark>Level {level_info['number']} Final Exam</mark>, which is now unlocked on your student dashboard.</p>"
    
    if level_info['number'] == 1:
        lesson_title = "Your Level 1 Exam & Business Accelerator Invitation"
        next_steps_content = """<h3>Step 2: From Certified Practitioner to Thriving CEO</h3><p>You now have the foundational skills to get incredible results.</p>"""
    elif level_info['number'] < 5:
        lesson_title = f"Your Level {level_info['number']} Exam & Next Steps"
        next_steps_content = f"""<h3>Step 2: Get Ready for Level {next_level_info['number']}!</h3><p>Once you've passed your exam, an exciting new chapter awaits.</p>"""
    else:
        lesson_title = "Your Final Certification Exam & Graduation"
        next_steps_content = """<h3>Step 2: Congratulations, Certified Master!</h3><p>You have completed the final and most advanced level of this certification.</p>"""

    return {
        "module_number": module_number,
        "module_title": "Certification Exam and Next Steps",
        "module_intro": f"<h3>You've reached a major milestone!</h3><p>Completing the core content of Level {level_info['number']} is a huge accomplishment.</p>",
        "lessons": [{
            "lesson_number": 1,
            "lesson_title": lesson_title,
            "section1_content": exam_content + next_steps_content
        }]
    }

# --- CORE GENERATION FUNCTIONS ---
def generate_master_plan_incrementally(niche_topic, language_name, persona_data):
    """Generates the entire curriculum structure (master plan) for the main certification."""
    log(f"Generating Master Plan for '{niche_topic}'", "INFO")
    niche_key = list(persona_data.keys())[0]
    personas = persona_data[niche_key]
    personas_list = ", ".join([p['name'] for p in personas.values()])
    
    overview_prompt = f"""
    You are creating a unified certification on "{niche_topic}" for a diverse audience: {personas_list}.
    Generate introductory content in **{language_name}**. Generate a JSON object with "course_title", "introductory_paragraph", and "program_goals" (a list of 4-5 strings).
    Generate ONLY the valid JSON object.
    """
    
    log("  - Generating course overview...", "TASK")
    master_plan = call_gemini_with_json_retry(overview_prompt, f"Master Plan Overview for {niche_topic}")
    if not master_plan or "course_title" not in master_plan:
        log("Failed to generate course overview. Aborting.", "ERROR")
        return None
    
    master_plan["academy"] = []
    log("  - Generating curriculum for each level...", "TASK")

    all_levels_info = CERTIFICATION_STRUCTURE['levels']
    for i, level_info in enumerate(all_levels_info):
        level_number = level_info["number"]
        level_title = level_info["title"]
        num_modules = level_info["modules"] 
        num_lessons = CERTIFICATION_STRUCTURE["lessons_per_module"]
        
        log(f"    - Level {level_number}: '{level_title}' ({num_modules} AI modules)...", "INFO")
        
        level_detail_prompt = f"""
        Design the curriculum for "{master_plan['course_title']}" - Level {level_number}: "{level_title}".
        This level has **{num_modules} modules**, each with **{num_lessons} lessons**. The final lesson of each module is a practical 'Method'.
        Generate a JSON array of {num_modules} module objects in **{language_name}**.
        Each Module: "module_number", "module_title", "module_intro", "objectives" (list), "lessons".
        Each Lesson: "lesson_number", "lesson_title". For Lesson {num_lessons}, title it "Method: [Actionable Name]".
        """
        level_modules = call_gemini_with_json_retry(level_detail_prompt, f"Level {level_number} modules")
        
        if not level_modules or not isinstance(level_modules, list) or len(level_modules) != num_modules:
            log(f"    - Failed module structure for Level {level_number}.", "ERROR")
            master_plan["academy"].append({
                "level_number": level_number,
                "level_title": level_title,
                "modules": []
            })
            continue

        next_level_info = all_levels_info[i + 1] if i + 1 < len(all_levels_info) else None
        final_module = generate_final_module_content(level_info, next_level_info)
        level_modules.append(final_module)

        master_plan["academy"].append({
            "level_number": level_number,
            "level_title": level_title,
            "modules": level_modules
        })

    log(f"Master Plan generated successfully.", "SUCCESS")
    return master_plan

def generate_standard_lesson_content(brief, niche_topic, language_name, persona_data):
    """Generates the detailed content for a standard lesson, including the Application Zone."""
    task_id = f"L{brief['level_num']}-M{brief['mod_num']}-L{brief['les_num']}"
    log(f"Generating Lesson {task_id}...", "TASK")

    prompt = PROMPT_TEMPLATES["standard_lesson"].format(
        brand_voice=BRAND_VOICE_GUIDE,
        language_name=language_name,
        les_title=brief['les_title'],
        unifying_client=brief['unifying_client']
    )
    return call_gemini_with_json_retry(prompt, f"Standard Lesson {task_id}")

def generate_method_lesson_content(brief, niche_topic, language_name, persona_data):
    """Generates a high-value, actionable 'Method' lesson that functions as a business toolkit."""
    task_id = f"L{brief['level_num']}-M{brief['mod_num']}-L{brief['les_num']}"
    log(f"Generating High-Value Method {task_id}...", "TASK")

    lessons_str = "\n".join(f"- {title}" for title in brief.get("previous_lesson_titles", []))
    prompt = PROMPT_TEMPLATES["method_lesson"].format(
        brand_voice=BRAND_VOICE_GUIDE,
        language_name=language_name,
        mod_title=brief['mod_title'],
        lessons_str=lessons_str,
        unifying_client=brief['unifying_client']
    )
    return call_gemini_with_json_retry(prompt, f"Method Lesson {task_id}")

def generate_method_lesson_content(brief, niche_topic, language_name, persona_data):
    """Generates comprehensive, high-value Method lessons that serve as complete business and practice toolkits."""
    task_id = f"L{brief['level_num']}-M{brief['mod_num']}-L{brief['les_num']}"
    log(f"Generating High-Value Method {task_id}...", "TASK")
    unifying_client = brief.get("unifying_client", {})
    lessons_str = "\n".join(f"- {title}" for title in brief.get("previous_lesson_titles", []))
    
    prompt = f"""
    Create a PREMIUM, comprehensive Method toolkit that synthesizes the module "{brief['mod_title']}" with these lessons:
    {lessons_str}

    TARGET: 2,000+ word comprehensive business and practice toolkit that transforms learning into profitable action.

    COMPREHENSIVE METHOD REQUIREMENTS:
    - This is the capstone lesson - synthesize ALL previous module content
    - Provide complete implementation framework with timelines
    - Include full business toolkit with pricing, marketing, and operations
    - Add comprehensive troubleshooting and problem-solving guides
    - Provide client success frameworks and measurement tools
    - Include legal and ethical implementation guidelines

    Generate a single, valid JSON object in **{language_name}**:

    {{
      "lesson_title": "Method: [Powerful, brandable name that captures the essence of this systematic approach]",
      "learning_objectives": ["4-5 specific business and practice objectives focused on IMPLEMENTATION and RESULTS"],
      
      "method_overview": "Comprehensive introduction (400+ words) explaining the method's unique value proposition, scientific backing, target applications, expected outcomes, and differentiation from other approaches. Include success statistics and client testimonials format.",
      
      "complete_framework": {{
        "title": "The Complete [Method Name] Framework",
        "philosophy": "Core principles and theoretical foundation (200+ words)",
        "methodology": "Step-by-step systematic approach (300+ words)",
        "assessment_tools": "How to evaluate client readiness and progress",
        "customization_guide": "Adapting the method for different client types",
        "success_indicators": "Measurable outcomes and progress markers"
      }},
      
      "step_by_step_implementation": [
        {{
          "phase": "Phase 1: Assessment & Foundation",
          "duration": "Weeks 1-2", 
          "objectives": ["Specific goals for this phase"],
          "activities": "Detailed activities and processes (150+ words)",
          "tools_needed": ["Required tools, templates, assessments"],
          "success_criteria": "How to know this phase is complete",
          "troubleshooting": "Common issues and solutions"
        }},
        {{
          "phase": "Phase 2: Implementation & Integration", 
          "duration": "Weeks 3-8",
          "objectives": ["Phase-specific outcomes"],
          "activities": "Core implementation activities (150+ words)",
          "tools_needed": ["Implementation tools and resources"],
          "success_criteria": "Measurable progress indicators",
          "troubleshooting": "Advanced problem-solving strategies"
        }},
        {{
          "phase": "Phase 3: Mastery & Sustainability",
          "duration": "Weeks 9-12",
          "objectives": ["Long-term sustainability goals"],
          "activities": "Mastery and maintenance activities (150+ words)",
          "tools_needed": ["Advanced tools and systems"],
          "success_criteria": "Mastery benchmarks",
          "troubleshooting": "Maintaining long-term success"
        }}
      ],

      "comprehensive_business_toolkit": {{
        "title": "Complete Business Implementation System",
        "service_packages": [
          {{
            "package_name": "Foundation Package",
            "duration": "3 months",
            "pricing_range": "$1,500-2,500",
            "what_included": "Specific deliverables and sessions",
            "client_outcomes": "Expected results and guarantees"
          }},
          {{
            "package_name": "Transformation Package", 
            "duration": "6 months",
            "pricing_range": "$3,000-5,000",
            "what_included": "Premium services and support",
            "client_outcomes": "Advanced transformation results"
          }},
          {{
            "package_name": "Mastery Package",
            "duration": "12 months", 
            "pricing_range": "$5,000-10,000",
            "what_included": "Comprehensive support and coaching",
            "client_outcomes": "Complete life transformation metrics"
          }}
        ],
        "pricing_psychology": "How to position and justify premium pricing",
        "payment_options": "Flexible payment structures that increase conversion",
        "guarantee_framework": "Risk-reversal strategies and satisfaction guarantees"
      }},

      "marketing_mastery_system": {{
        "title": "Complete Marketing System for [Method Name]",
        "unique_selling_proposition": "Your distinctive market positioning statement",
        "target_avatar_profiles": [
          {{
            "avatar": "Primary Avatar Name",
            "demographics": "Age, income, lifestyle details", 
            "pain_points": ["3-4 specific frustrations"],
            "desired_outcomes": ["3-4 specific goals"],
            "marketing_messages": "How to speak to this avatar"
          }},
          {{
            "avatar": "Secondary Avatar Name",
            "demographics": "Different demographic profile",
            "pain_points": ["Unique pain points"],
            "desired_outcomes": ["Specific aspirations"],
            "marketing_messages": "Tailored messaging approach"
          }}
        ],
        "content_marketing_calendar": [
          {{"week": 1, "focus": "Awareness content", "post_ideas": ["3-4 specific post concepts"]}},
          {{"week": 2, "focus": "Education content", "post_ideas": ["3-4 educational post ideas"]}},
          {{"week": 3, "focus": "Trust-building content", "post_ideas": ["3-4 credibility-building posts"]}},
          {{"week": 4, "focus": "Conversion content", "post_ideas": ["3-4 sales-focused posts"]}}
        ],
        "email_sequence_templates": [
          {{"email": 1, "subject": "Welcome sequence subject", "purpose": "Relationship building", "key_points": ["Main messages to convey"]}},
          {{"email": 2, "subject": "Value-add sequence subject", "purpose": "Provide value", "key_points": ["Educational content"]}},
          {{"email": 3, "subject": "Social proof subject", "purpose": "Build credibility", "key_points": ["Testimonials and results"]}},
          {{"email": 4, "subject": "Soft pitch subject", "purpose": "Introduce services", "key_points": ["Service introduction"]}},
          {{"email": 5, "subject": "Sales sequence subject", "purpose": "Direct invitation", "key_points": ["Clear call to action"]}}
        ]
      }},
      
      "client_success_framework": {{
        "title": "Ensuring Client Success with [Method Name]",
        "intake_process": {{
          "screening_questions": ["10+ questions to identify ideal clients"],
          "readiness_assessment": "How to determine client preparedness",
          "expectation_setting": "Managing client expectations for success",
          "contraindications": "When NOT to work with someone"
        }},
        "session_structure": {{
          "session_1": "Foundation session template and objectives",
          "ongoing_sessions": "Standard session flow and focus areas", 
          "milestone_sessions": "Progress evaluation and course correction",
          "completion_session": "Graduation and maintenance planning"
        }},
        "progress_tracking": {{
          "measurement_tools": ["Specific assessment instruments"],
          "milestone_markers": "Key progress indicators to celebrate",
          "course_correction": "When and how to adjust the approach",
          "success_documentation": "How to capture and share client wins"
        }}
      }},

      "advanced_practitioner_guide": {{
        "title": "Mastering [Method Name]: Advanced Applications",
        "complex_cases": [
          {{"scenario": "Challenging client situation", "approach": "Advanced intervention strategy", "expected_outcome": "Realistic resolution"}},
          {{"scenario": "Resistant client pattern", "approach": "Breakthrough technique", "expected_outcome": "Transformation pathway"}}
        ],
        "integration_opportunities": "How to combine with other modalities and methods",
        "referral_network": "Building strategic partnerships and referral relationships",
        "continuing_education": "Recommended next steps for skill advancement"
      }},
      
      "unifying_case_study_application": {{
          "title": "Sarah's Complete Transformation: [Method Name] in Action",
          "initial_state": "Sarah's starting point and primary challenges (100+ words)",
          "method_application": "How each phase of the method addressed her specific needs (200+ words)",
          "breakthrough_moments": "Key turning points and insights in her journey",
          "measurable_results": "Specific, quantifiable outcomes and improvements",
          "long_term_impact": "Sustained changes and ongoing benefits",
          "lessons_learned": "Insights for applying this method to similar clients"
      }},

      "troubleshooting_mastery": [
        {{
          "challenge": "Client not seeing results after 4 weeks",
          "diagnosis": "Possible underlying causes to investigate",
          "intervention": "Step-by-step resolution strategy", 
          "prevention": "How to avoid this issue in future clients",
          "follow_up": "Monitoring and adjustment protocols"
        }},
        {{
          "challenge": "Client resistance to key method components",
          "diagnosis": "Understanding the root of resistance",
          "intervention": "Breakthrough communication and adaptation techniques",
          "prevention": "Early identification and proactive strategies",
          "follow_up": "Building sustained engagement"
        }},
        {{
          "challenge": "Practitioner uncertainty about method application",
          "diagnosis": "Common areas of practitioner confusion",
          "intervention": "Self-coaching and professional development steps",
          "prevention": "Building competence and confidence",
          "follow_up": "Ongoing skill development pathway"
        }}
      ],

      "legal_and_ethical_framework": {{
        "title": "Professional Implementation Guidelines",
        "scope_of_practice": "Clear boundaries for method application",
        "informed_consent": "Comprehensive consent process and documentation",
        "client_safety": "Risk assessment and safety protocols",
        "professional_boundaries": "Maintaining therapeutic relationship integrity", 
        "documentation_requirements": "Record-keeping and liability protection",
        "referral_protocols": "When and how to refer to other professionals"
      }},

      "implementation_checklist": [
        {{"category": "Foundation Setup", "tasks": ["Specific preparation tasks with deadlines"]}},
        {{"category": "Client Acquisition", "tasks": ["Marketing and outreach action items"]}},
        {{"category": "Service Delivery", "tasks": ["Operational systems to establish"]}},
        {{"category": "Business Growth", "tasks": ["Scaling and expansion activities"]}}
      ],

      "success_metrics_dashboard": {{
        "client_metrics": ["Specific client outcome measurements"],
        "business_metrics": ["Revenue, retention, and referral indicators"],
        "personal_metrics": ["Professional satisfaction and development measures"],
        "review_schedule": "When and how to evaluate progress",
        "adjustment_triggers": "What changes indicate need for modification"
      }},

      "resource_library": [
        {{"type": "Assessment", "name": "Client readiness evaluation", "use_case": "Initial screening"}},
        {{"type": "Template", "name": "Session planning guide", "use_case": "Consistent service delivery"}},
        {{"type": "Worksheet", "name": "Progress tracking tool", "use_case": "Client engagement and measurement"}},
        {{"type": "Script", "name": "Difficult conversation guide", "use_case": "Handling challenges"}},
        {{"type": "Checklist", "name": "Implementation verification", "use_case": "Quality assurance"}}
      ],

      "next_level_preview": {{
        "title": "Advanced Mastery: What's Next in Your Journey",
        "skill_progression": "Next competencies to develop",
        "business_evolution": "How to scale and expand your impact", 
        "specialization_options": "Advanced certifications and niches",
        "community_building": "Creating your professional network"
      }}
    }}

    Generate ONLY the complete, comprehensive JSON object.
    """
    return call_gemini_with_json_retry(prompt, f"Method Lesson {task_id}")

def save_level_structure_json(level_data, level_path):
    """Saves a _structure.json file for a course level."""
    log(f"Creating structure JSON for Level {level_data['level_number']}...", "TASK")
    structure = {
        "level_number": level_data.get("level_number"),
        "level_title": level_data.get("level_title"),
        "modules": []
    }
    for module in level_data.get("modules", []):
        folder_name = f"Module_{module['module_number']}_{sanitize_filename(module['module_title'])}"
        
        module_structure = {
            "module_number": module.get("module_number"),
            "module_title": module.get("module_title"),
            "folder_path": folder_name,
            "lessons": []
        }

        for lesson in module.get("lessons", []):
            # Use new lesson naming format
            lesson_filename = f"Lesson_{lesson['lesson_number']:02d}_{sanitize_filename(lesson['lesson_title'])}.html"
            module_structure["lessons"].append({
                "lesson_number": lesson.get("lesson_number"),
                "lesson_title": lesson.get("lesson_title"),
                "filename": lesson_filename
            })
        structure["modules"].append(module_structure)

    file_path = os.path.join(level_path, "_structure.json")
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(structure, f, indent=4, ensure_ascii=False)
        log(f"  - Saved structure to '{file_path}'", "SUCCESS")
    except Exception as e:
        log(f"  - FAILED to write structure JSON for Level {level_data['level_number']}: {e}", "ERROR")

def render_and_save_files(master_plan, course_path, templates, niche_topic):
    """Renders all HTML files and generates all module-specific PDF assets using parallel processing."""
    log(f"Rendering all course files & assets for '{master_plan.get('course_title')}'...", "INFO")
    
    # First pass: Create all directories and save HTML files
    for level in master_plan.get("academy", []):
        level_folder_name = f"Level_{level['level_number']}_{sanitize_filename(level['level_title'])}"
        level_path = os.path.join(course_path, level_folder_name)
        os.makedirs(level_path, exist_ok=True)
        save_level_structure_json(level, level_path)
        
        level['niche_topic'] = niche_topic
        level['course_title'] = master_plan.get('course_title')

        for module in level.get("modules", []):
            module_folder_name = f"Module_{module['module_number']}_{sanitize_filename(module['module_title'])}"
            module_path = os.path.join(level_path, module_folder_name)
            os.makedirs(module_path, exist_ok=True)
            
            # Create Resources folder
            resources_path = os.path.join(module_path, "Resources")
            os.makedirs(resources_path, exist_ok=True)
            
            is_welcome_module = module.get("module_number") == "00"
            is_final_module = module.get("module_title") == "Certification Exam and Next Steps"

            # Save module overview HTML
            module_overview_data = {
                "level": level, "module": module,
                "course_title": master_plan.get("course_title"),
                "team": EXPERT_TEAM, **CONFIG, "ICONS": ICONS,
                "LANG_CONFIG": LANG_CONFIG, "sanitize_filename": sanitize_filename
            }
            module_index_html = templates['module_overview'].render(module_overview_data)
            safe_file_write(module_index_html, os.path.join(module_path, "index.html"))

            if is_welcome_module or is_final_module:
                # Special modules with one lesson
                lesson = module['lessons'][0]
                lesson_data = {
                    "level": level, "module": module, "lesson": lesson,
                    "course_title": master_plan.get("course_title"),
                    "team": EXPERT_TEAM, **CONFIG, "ICONS": ICONS,
                    "LANG_CONFIG": LANG_CONFIG, "sanitize_filename": sanitize_filename
                }
                
                template = templates['welcome_lesson_template'] if is_welcome_module else templates['final_module_lesson_template']
                html_content = template.render(lesson_data)
                
                # Use new lesson naming format
                filename = f"Lesson_{lesson['lesson_number']:02d}_{sanitize_filename(lesson['lesson_title'])}.html"
                filepath = os.path.join(module_path, filename)
                safe_file_write(html_content, filepath)
            else:
                # Standard modules - save ALL lesson HTML files INCLUDING lesson 5
                for lesson in module.get("lessons", []):
                    lesson_data = {
                        "level": level, "module": module, "lesson": lesson,
                        "course_title": master_plan.get("course_title"),
                        "team": EXPERT_TEAM, **CONFIG, "ICONS": ICONS,
                        "LANG_CONFIG": LANG_CONFIG,
                        "total_lessons_in_module": len(module.get("lessons", []))
                    }
                    
                    # Use new lesson naming format for all lessons
                    if lesson.get("lesson_type") == "method":
                        lesson_filename_html = f"Lesson_{lesson['lesson_number']:02d}_{sanitize_filename(lesson.get('lesson_title', 'Method'))}.html"
                        template = templates['method_lesson']
                    else:
                        lesson_filename_html = f"Lesson_{lesson['lesson_number']:02d}_{sanitize_filename(lesson.get('lesson_title', 'Lesson'))}.html"
                        template = templates['lesson']
                    
                    # Generate and save the HTML lesson file
                    lesson_html = template.render(lesson_data)
                    lesson_filepath = os.path.join(module_path, lesson_filename_html)
                    safe_file_write(lesson_html, lesson_filepath)
                    log(f"  - Saved lesson HTML: {lesson_filename_html}", "SUCCESS")

    # Save syllabus
    syllabus_data = {
        **master_plan, "team": EXPERT_TEAM, **CONFIG,
        "sanitize_filename": sanitize_filename,
        "ICONS": ICONS, "LANG_CONFIG": LANG_CONFIG
    }
    syllabus_html = templates['syllabus'].render(syllabus_data)
    safe_file_write(syllabus_html, os.path.join(course_path, "index.html"))

    # Second pass: Generate SUPPLEMENTARY PDFs in parallel (these are IN ADDITION to HTML lessons)
    log("Starting parallel PDF generation for supplementary materials...", "INFO")
    pdf_tasks = []
    
    for level in master_plan.get("academy", []):
        level_folder_name = f"Level_{level['level_number']}_{sanitize_filename(level['level_title'])}"
        level_path = os.path.join(course_path, level_folder_name)
        
        for module in level.get("modules", []):
            module_folder_name = f"Module_{module['module_number']}_{sanitize_filename(module['module_title'])}"
            module_path = os.path.join(level_path, module_folder_name)
            resources_path = os.path.join(module_path, "Resources")
            
            is_welcome_module = module.get("module_number") == "00"
            is_final_module = module.get("module_title") == "Certification Exam and Next Steps"
            
            if not is_welcome_module and not is_final_module:
                # Add cheat sheet tasks ONLY as supplements for method lessons
                for lesson in module.get("lessons", []):
                    if lesson.get("lesson_type") == "method" and 'method_cheat_sheet' in lesson:
                        pdf_tasks.append({
                            'type': 'cheat_sheet',
                            'lesson_data': {"level": level, "module": module, "lesson": lesson, **CONFIG},
                            'resources_path': resources_path,
                            'templates': templates
                        })
                
                # Add resource and marketing pack tasks
                pdf_tasks.append({
                    'type': 'resource_pack',
                    'module': module,
                    'level': level,
                    'resources_path': resources_path,
                    'templates': templates
                })
                
                pdf_tasks.append({
                    'type': 'marketing_pack',
                    'module': module,
                    'level': level,
                    'resources_path': resources_path,
                    'templates': templates
                })
    
    # Execute all PDF generation tasks in parallel
    with ThreadPoolExecutor(max_workers=50, thread_name_prefix="PDFWorker") as executor:
        futures = []
        for task in pdf_tasks:
            if task['type'] == 'cheat_sheet':
                future = executor.submit(generate_and_save_cheat_sheet_supplement, 
                                       task['lesson_data'], task['resources_path'], task['templates'])
            elif task['type'] == 'resource_pack':
                future = executor.submit(generate_and_save_resource_pack,
                                       task['module'], task['level'], task['resources_path'], task['templates'])
            elif task['type'] == 'marketing_pack':
                future = executor.submit(generate_and_save_enhanced_marketing_pack,
                                       task['module'], task['level'], task['resources_path'], task['templates'])
            futures.append(future)
        
        # Wait for all PDF tasks to complete
        completed = 0
        total = len(futures)
        for future in as_completed(futures):
            completed += 1
            try:
                future.result()
                if completed % 10 == 0:
                    log(f"PDF Generation Progress: {completed}/{total} completed", "INFO")
            except Exception as e:
                log(f"PDF generation task failed: {e}", "ERROR")
    
    log(f"All course files and PDF assets have been successfully generated.", "SUCCESS")
    return True

# --- ASSET GENERATION FUNCTIONS ---
def generate_and_save_resource_pack(module, level, resources_path, templates):
    """Generates a pack of 2-3 client-facing PDF resources for a module."""
    log(f"Generating Resource Pack for M{module.get('module_number')}...", "TASK")
    try:
        from weasyprint import HTML

        prompt = f"""
        You are an expert curriculum designer. For the module "{module.get('module_title')}" in a course on "{level.get('niche_topic')}", create a pack of 2 high-value, client-facing resources.
        
        Generate a single, valid JSON object with a key "resources" which is a list of 2 resource objects.
        Each resource object MUST have:
        1. "resource_title": A clear, client-facing title.
        2. "resource_type": A short label (e.g., "Checklist", "Handout", "Journal_Prompts").
        3. "resource_content_html": The full, detailed HTML content for the resource.

        Generate ONLY the valid JSON object.
        """
        
        resource_data = call_gemini_with_json_retry(prompt, f"Resource Pack M{module.get('module_number')}")
        
        if not resource_data or "resources" not in resource_data:
            log(f"Failed to generate valid resource pack for M{module.get('module_number')}.", "ERROR")
            return

        for i, resource in enumerate(resource_data["resources"]):
            context = {
                'resource_title': resource.get('resource_title', 'Resource'),
                'resource_content_html': resource.get('resource_content_html', '<p>No content.</p>'),
                'course_title': level.get('course_title', ''),
                'current_year': CONFIG["current_year"],
                'publisher': CONFIG["publisher"]
            }
            
            html_string = templates['resource'].render(context)
            # Updated naming with module number prefix
            pdf_filename = f"M{module.get('module_number'):02d}_{sanitize_filename(resource.get('resource_type', 'Resource'))}_{i+1}.pdf"
            pdf_filepath = os.path.join(resources_path, pdf_filename)
            
            HTML(string=html_string).write_pdf(pdf_filepath)
            log(f"  - Generated Resource PDF: {pdf_filename}", "SUCCESS")

    except ImportError:
        log("WeasyPrint not installed. Skipping PDF resource generation.", "WARNING")
    except Exception as e:
        log(f"Failed to generate resource pack for M{module.get('module_number')}: {e}", "ERROR")

def generate_and_save_enhanced_marketing_pack(module, level, resources_path, templates):
    """Generates a comprehensive, high-converting marketing pack with multiple assets."""
    log(f"Generating Enhanced Marketing Pack for M{module.get('module_number')}...", "TASK")
    try:
        from weasyprint import HTML

        prompt = f"""
        You are a world-class direct response copywriter and marketing strategist specializing in the "{level.get('niche_topic')}" niche.
        
        For the module "{module.get('module_title')}", create a COMPREHENSIVE marketing pack that maximizes conversions.
        
        Generate a single, valid JSON object with the following keys:
        
        1. "social_media_posts": An array of 10 posts with platform, hook, body, cta, hashtags
        2. "email_sequences": cold_outreach, warm_nurture, sales_email, follow_up
        3. "landing_page_copy": headline, subheadline, problem_agitation, solution_bridge, benefit_bullets
        4. "paid_ad_copy": facebook_ads (3 variations), google_ads (5 headlines + 3 descriptions)
        5. "sales_tools": discovery_questions, objection_handlers, value_stack

        Generate ONLY the valid JSON object with ALL these elements.
        """
        
        marketing_data = call_gemini_with_json_retry(prompt, f"Enhanced Marketing Pack M{module.get('module_number')}")
        
        if not marketing_data:
            log(f"Failed to generate valid marketing pack for M{module.get('module_number')}.", "ERROR")
            return

        # Generate multiple PDF documents for different marketing assets
        marketing_assets = [
            {
                'title': f"Social Media Content Pack - {module.get('module_title')}",
                'content': format_social_media_content(marketing_data.get('social_media_posts', [])),
                'filename': f"M{module.get('module_number'):02d}_Social_Media_Pack.pdf"
            },
            {
                'title': f"Email Templates - {module.get('module_title')}",
                'content': format_email_content(marketing_data.get('email_sequences', {})),
                'filename': f"M{module.get('module_number'):02d}_Email_Templates.pdf"
            },
            {
                'title': f"Landing Page & Ad Copy - {module.get('module_title')}",
                'content': format_landing_page_content(marketing_data.get('landing_page_copy', {})),
                'filename': f"M{module.get('module_number'):02d}_Landing_Ad_Copy.pdf"
            }
        ]

        # Generate PDFs
        for asset in marketing_assets:
            context = {
                'resource_title': asset['title'],
                'resource_content_html': asset['content'],
                'course_title': level.get('course_title', ''),
                'current_year': CONFIG["current_year"],
                'publisher': CONFIG["publisher"]
            }
            html_string = templates['resource'].render(context)
            pdf_filepath = os.path.join(resources_path, asset['filename'])
            HTML(string=html_string).write_pdf(pdf_filepath)
            log(f"  - Generated Marketing PDF: {asset['filename']}", "SUCCESS")

    except ImportError:
        log("WeasyPrint not installed. Skipping PDF marketing pack generation.", "WARNING")
    except Exception as e:
        log(f"Failed to generate marketing pack for M{module.get('module_number')}: {e}", "ERROR")

def generate_lab_course_toolkit(course, lab_client, course_path, templates):
    """Generates a single, consolidated 'Clinical Toolkit' for an entire Lab course."""
    log(f"Generating Clinical Toolkit for Lab Course {course.get('course_number')}...", "TASK")
    try:
        from weasyprint import HTML

        prompt = f"""
        You are an expert curriculum designer creating a single, consolidated 'Clinical Toolkit' PDF.
        This toolkit is the capstone resource for the entire Practitioner Lab course titled: "{course.get('title')}".
        The course focuses on: "{course.get('complexity')}".
        The unifying case study client is "{lab_client.get('name')}".

        Generate a single, valid JSON object with a key "resources". This key should hold a list of 3-4 high-value, practical tools a practitioner would use.

        Each tool object in the list MUST have:
        1. "resource_title": A clear, practical title (e.g., "Comprehensive Intake Form", "Case Analysis Framework", "Client Protocol Summary Template").
        2. "resource_content_html": The full, detailed HTML content for the tool. Use headings, lists, and tables to structure the content professionally.

        These should be substantial, ready-to-use tools, not simple checklists. Generate ONLY the valid JSON object.
        """

        toolkit_data = call_gemini_with_json_retry(prompt, f"Lab Toolkit for C{course.get('course_number')}")

        if not toolkit_data or "resources" not in toolkit_data:
            log(f"Failed to generate valid toolkit data for Lab Course {course.get('course_number')}.", "ERROR")
            return

        # Combine all resources into a single HTML string
        combined_html_content = ""
        for resource in toolkit_data["resources"]:
            combined_html_content += f"<div class='resource-section'><h2>{resource.get('resource_title', 'Unnamed Resource')}</h2>{resource.get('resource_content_html', '<p>No content.</p>')}</div>"

        context = {
            'toolkit_title': f"Clinical Toolkit: {course.get('title')}",
            'toolkit_content_html': combined_html_content,
            'course_title': course.get('title'),
            'current_year': CONFIG["current_year"],
            'publisher': CONFIG["publisher"]
        }

        html_string = templates['toolkit'].render(context)
        pdf_filename = f"Lab_Course_{course.get('course_number')}_Clinical_Toolkit.pdf"
        pdf_filepath = os.path.join(course_path, pdf_filename)

        HTML(string=html_string).write_pdf(pdf_filepath)
        log(f"  - Generated Clinical Toolkit PDF: {pdf_filename}", "SUCCESS")

    except ImportError:
        log("WeasyPrint not installed. Skipping PDF toolkit generation.", "WARNING")
    except Exception as e:
        log(f"Failed to generate Lab toolkit for Course {course.get('course_number')}: {e}", "ERROR")


def generate_academy_course_toolkit(course, course_path, templates):
    """Generates a single, consolidated 'Business-in-a-Box Toolkit' for an entire Academy course."""
    log(f"Generating Business Toolkit for Academy Course {course.get('course_number')}...", "TASK")
    try:
        from weasyprint import HTML

        prompt = f"""
        You are a world-class business coach creating a consolidated 'Business-in-a-Box Toolkit'.
        This toolkit is the main downloadable resource for the Business Academy course titled: "{course.get('title')}".

        Generate a single, valid JSON object with a key "resources". This key should hold a list of 3-4 high-value, business-building tools (worksheets, templates, planners, etc.).

        Each tool object in the list MUST have:
        1. "resource_title": A clear, actionable title (e.g., "Niche & Ideal Client Avatar Workbook", "Pricing & Package Calculator", "Monthly Content Calendar").
        2. "resource_content_html": The full, detailed HTML content for the tool. Use headings and structured questions for worksheets.

        These should be practical tools that help a new practitioner build their business. Generate ONLY the valid JSON object.
        """

        toolkit_data = call_gemini_with_json_retry(prompt, f"Academy Toolkit for C{course.get('course_number')}")

        if not toolkit_data or "resources" not in toolkit_data:
            log(f"Failed to generate valid toolkit data for Academy Course {course.get('course_number')}.", "ERROR")
            return

        combined_html_content = ""
        for resource in toolkit_data["resources"]:
            combined_html_content += f"<div class='resource-section'><h2>{resource.get('resource_title', 'Unnamed Resource')}</h2>{resource.get('resource_content_html', '<p>No content.</p>')}</div>"

        context = {
            'toolkit_title': f"Business Toolkit: {course.get('title')}",
            'toolkit_content_html': combined_html_content,
            'course_title': course.get('title'),
            'current_year': CONFIG["current_year"],
            'publisher': CONFIG["publisher"]
        }

        html_string = templates['toolkit'].render(context)
        pdf_filename = f"Academy_Course_{course.get('course_number')}_Business_Toolkit.pdf"
        pdf_filepath = os.path.join(course_path, pdf_filename)

        HTML(string=html_string).write_pdf(pdf_filepath)
        log(f"  - Generated Business Toolkit PDF: {pdf_filename}", "SUCCESS")

    except ImportError:
        log("WeasyPrint not installed. Skipping PDF toolkit generation.", "WARNING")
    except Exception as e:
        log(f"Failed to generate Academy toolkit for Course {course.get('course_number')}: {e}", "ERROR")
def generate_and_save_cheat_sheet_supplement(lesson_data, resources_path, templates):
    """Renders a SUPPLEMENTARY cheat sheet PDF - does not replace the lesson HTML."""
    try:
        from weasyprint import HTML

        lesson = lesson_data.get('lesson', {})
        # Only generate if this is a method lesson with cheat sheet content
        if 'method_cheat_sheet' not in lesson:
            return

        cheat_sheet_content = lesson['method_cheat_sheet']

        context = {
            'content': cheat_sheet_content,
            'level': lesson_data.get('level', {}),
            'module': lesson_data.get('module', {}),
            'current_year': CONFIG["current_year"],
            'publisher': CONFIG["publisher"]
        }

        html_string = templates['cheat_sheet'].render(context)

        # Updated naming for Resources folder
        pdf_filename = f"M{lesson_data['module']['module_number']:02d}_L{lesson['lesson_number']:02d}_Quick_Reference_Cheat_Sheet.pdf"
        pdf_filepath = os.path.join(resources_path, pdf_filename)

        HTML(string=html_string).write_pdf(pdf_filepath)
        log(f"  - Generated Cheat Sheet PDF: {pdf_filename}", "SUCCESS")

    except ImportError:
        log("WeasyPrint not installed. Skipping PDF cheat sheet generation.", "WARNING")
    except Exception as e:
        log(f"Failed to generate cheat sheet PDF: {e}", "ERROR")

# Marketing formatting helper functions
def format_social_media_content(posts):
    """Formats social media posts into readable HTML."""
    if not posts:
        return "<p>No social media content available.</p>"
    
    html = "<div class='social-media-posts'>"
    for i, post in enumerate(posts[:5], 1):  # Limit to first 5 for PDF size
        if isinstance(post, dict):
            html += f"""
            <div style='margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>
                <h3 style='color: #2c3e50;'>Post #{i}</h3>
                <p><strong>Hook:</strong> {post.get('hook', '')}</p>
                <p>{post.get('body', '')}</p>
                <p><strong>CTA:</strong> {post.get('cta', '')}</p>
                <p><strong>Hashtags:</strong> {post.get('hashtags', '')}</p>
            </div>
            """
    html += "</div>"
    return html

def format_email_content(emails):
    """Formats email templates into readable HTML."""
    if not emails:
        return "<p>No email templates available.</p>"
    
    html = "<div class='email-templates'>"
    for email_type, content in emails.items():
        html += f"""
        <div style='margin-bottom: 30px; padding: 20px; border-left: 4px solid #4CAF50;'>
            <h3 style='color: #2c3e50;'>{email_type.replace('_', ' ').title()}</h3>
            <div style='padding: 15px; background: #f8f9fa; border-radius: 5px;'>
                <p>{content if isinstance(content, str) else str(content)}</p>
            </div>
        </div>
        """
    html += "</div>"
    return html

def format_landing_page_content(landing_page):
    """Formats landing page copy into structured HTML."""
    if not landing_page:
        return "<p>No landing page content available.</p>"
    
    html = f"""
    <div class='landing-page-copy'>
        <h2>{landing_page.get('headline', 'Your Compelling Headline Here')}</h2>
        <h3>{landing_page.get('subheadline', 'Supporting promise statement')}</h3>
        <div style='margin-top: 30px;'>
            <h3>Key Benefits</h3>
            <ul>
    """
    
    for bullet in landing_page.get('benefit_bullets', []):
        html += f"<li>{bullet}</li>"
    
    html += "</ul></div></div>"
    return html

def generate_and_save_module_quiz_csv(module_title, lesson_titles, language_name, dest_path):
    """Generates a 5-question quiz for a module and saves it as a CSV."""
    log(f"Generating Quiz CSV for Module: '{module_title}'...", "TASK")
    lesson_titles_str = "\n".join(f"- {title}" for title in lesson_titles)
    prompt = f"""
    Create a 5-question multiple-choice quiz for a module titled "{module_title}".
    The quiz should assess understanding of: {lesson_titles_str}
    Generate a single, valid JSON object with a key "quiz" (a list of 5 question objects).
    Each question object must have: "question", "option_a", "option_b", "option_c", "option_d", "correct", "explanation".
    Ensure the entire output is ONLY the valid JSON object in **{language_name}**.
    """
    quiz_data = call_gemini_with_json_retry(prompt, f"Quiz for '{module_title}'")
    if not quiz_data or "quiz" not in quiz_data:
        log(f"Failed to generate valid quiz data for module '{module_title}'.", "ERROR")
        return
    try:
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        headers = ["question", "option_a", "option_b", "option_c", "option_d", "correct", "explanation"]
        with open(dest_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=headers)
            writer.writeheader()
            for question in quiz_data["quiz"]:
                writer.writerow({key: clean_ai_generated_text(str(value)) for key, value in question.items()})
        log(f"  - Saved quiz to '{dest_path}'", "SUCCESS")
    except Exception as e:
        log(f"  - FAILED to write quiz CSV for module '{module_title}': {e}", "ERROR")

def generate_exam_questions_for_module(module, language_name, num_questions=20):
    """Generates exam questions for a single module."""
    task_id = f"Exam Qs for M{module.get('module_number')}"
    log(f"Generating {num_questions} exam questions for Module: '{module['module_title']}'...", "TASK")
    lesson_titles_str = "\n".join(f"- {l.get('lesson_title', 'Untitled')}" for l in module.get("lessons", []))
    prompt = f"""
    Generate **{num_questions}** rigorous, multiple-choice final exam questions for module "{module['module_title']}".
    The questions must cover concepts from these lessons: {lesson_titles_str}
    Generate a single, valid JSON object with a key "questions" (a list of **{num_questions}** question objects).
    Each question object MUST have: "question", "option_a", "option_b", "option_c", "option_d", "correct", "explanation", and "module_source" (value: "{module['module_number']}").
    Ensure the entire output is ONLY the valid JSON object in **{language_name}**.
    """
    exam_data = call_gemini_with_json_retry(prompt, task_id)
    if exam_data and "questions" in exam_data:
        return exam_data["questions"]
    log(f"Failed to generate exam questions for module '{module['module_title']}'.", "ERROR")
    return []

def generate_final_exam(master_plan, course_path):
    """Generates a final exam for each level by aggregating questions from its modules."""
    log("STARTING FINAL EXAM GENERATION PROCESS...", "SUCCESS")
    language_name = LANG_CONFIG.get('language_name', 'English')
    for level in master_plan.get("academy", []):
        log(f"  - Generating Final Exam for Level {level['level_number']}: '{level['level_title']}'", "INFO")
        all_exam_questions = []
        modules_for_exam = [m for m in level.get("modules", []) if m.get("module_title") != "Certification Exam and Next Steps"]
        
        with ThreadPoolExecutor(max_workers=50, thread_name_prefix="ExamWorker") as executor:
            future_to_module = {executor.submit(generate_exam_questions_for_module, m, language_name): m for m in modules_for_exam}
            for future in as_completed(future_to_module):
                try:
                    if questions := future.result():
                        all_exam_questions.extend(questions)
                except Exception as exc:
                    log(f"Exam questions for module generated an exception: {exc}", "ERROR")
        
        if not all_exam_questions:
            log(f"  - No exam questions generated for Level {level['level_number']}. Skipping.", "ERROR")
            continue
        
        level_folder_name = f"Level_{level['level_number']}_{sanitize_filename(level['level_title'])}"
        exam_path = os.path.join(course_path, level_folder_name, "FINAL_EXAM")
        os.makedirs(exam_path, exist_ok=True)
        csv_path = os.path.join(exam_path, "final_exam.csv")
        
        try:
            headers = ["question_number", "question", "option_a", "option_b", "option_c", "option_d", "correct", "explanation", "module_source"]
            with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=headers)
                writer.writeheader()
                for i, q in enumerate(all_exam_questions, 1):
                    q['question_number'] = i
                    writer.writerow({key: clean_ai_generated_text(str(value)) if isinstance(value, str) else value for key, value in q.items()})
            log(f"    - Saved exam CSV to '{csv_path}'", "SUCCESS")
        except Exception as e:
            log(f"    - FAILED to write exam CSV for Level {level['level_number']}: {e}", "ERROR")

# Course-wide asset generation functions
def generate_ebook_from_course(master_plan, course_path, templates):
    """Generates a complete PDF ebook from the entire course content."""
    log("Generating full course ebook...", "TASK")
    try:
        from weasyprint import HTML

        ebook_html_content = templates['ebook'].render(
            book_title=master_plan.get("course_title", "Course Book"),
            subtitle="Your Complete Guide to Mastery",
            author_name="Sarah Johnson, M.Ed.",
            author_credentials="Lead Instructor & Program Director",
            current_year=CONFIG["current_year"],
            publisher=CONFIG["publisher"],
            academy=master_plan.get("academy", [])
        )

        ebook_pdf_path = os.path.join(course_path, f"{sanitize_filename(master_plan.get('course_title'))}_Ebook.pdf")
        
        HTML(string=ebook_html_content).write_pdf(ebook_pdf_path)
        log(f"Ebook generated successfully: {ebook_pdf_path}", "SUCCESS")

    except ImportError:
        log("WeasyPrint not installed. Skipping PDF ebook generation.", "WARNING")
    except Exception as e:
        log(f"Failed to generate ebook: {e}", "ERROR")

# --- PRACTITIONER LAB GENERATION ---
def generate_lab_case_study_client(course_brief, language_name):
    """Generates a single, detailed 'golden thread' client for an entire lab course."""
    task_id = f"Lab Client for C{course_brief['course_number']}"
    log(f"Generating Golden Thread Client for Lab Course {course_brief['course_number']}...", "TASK")
    
    prompt = f"""
    You are a master storyteller and curriculum designer creating a single, detailed case study client. This client's story will be the 'golden thread' for an entire advanced lab course.

    **COURSE CONTEXT:**
    - Course Title: "{course_brief['title']}"
    - Case Complexity: The client's situation must reflect: **{course_brief['complexity']}**.

    **TASK:**
    Generate a single, valid JSON object in **{language_name}** for this client. Invent a realistic name. The client's profile must be rich and detailed enough to be explored from multiple angles across 30+ lessons.

    **JSON STRUCTURE (all fields required):**
    {{
      "name": "The client's full name (e.g., 'Eleanor Vance').",
      "tagline": "A short, memorable tagline",
      "full_profile_html": "A detailed, multi-paragraph HTML description of the client's background, presenting symptoms, frustrations with conventional medicine, lifestyle, and ultimate goals."
    }}
    
    Generate ONLY the valid JSON object.
    """
    return call_gemini_with_json_retry(prompt, task_id)

def generate_practitioner_lab_lesson_content(brief, language_name):
    """Generate comprehensive, topic-focused lab content for a single lesson using a continuous case study client."""
    task_id = f"Lab C{brief['course_num']}-M{brief['mod_num']}-L{brief['les_num']}"
    log(f"Generating {task_id} for '{brief['les_title']}'...", "TASK")
    
    lab_client = brief['lab_client']
    
    prompt = f"""
    You are a master instructor creating a single, immersive lesson for a 'Practitioner's Lab'.

    **CRITICAL CONTEXT & FOCUS:**
    - This lesson's specific topic is: **"{brief['les_title']}"**.
    - This lesson is part of the larger case study for the client: **{lab_client.get('name', 'the client')} ({lab_client.get('tagline', '')})**.

    **CRITICAL INSTRUCTIONS:**
    1.  **LASER FOCUS:** All content you generate MUST be about applying the lesson topic **"{brief['les_title']}"** to the specific situation of the provided client, **{lab_client.get('name')}**.
    2.  **USE THE PROVIDED CLIENT:** Do NOT invent a new client. Base all content on the client's established profile. The client's main profile is: {lab_client.get('full_profile_html', '')}
    3.  **RICH CONTENT:** Populate ALL fields in the JSON with detailed, high-quality HTML content that explores a new facet of the client's case relevant to this lesson.

    **JSON STRUCTURE (all fields required):**
    {{
        "practice_module_title": "{brief['les_title']}",
        "practice_objective": "A clear, 2-3 sentence learning objective for this specific lesson on '{brief['les_title']}'.",
        
        "case_study_deep_dive": {{
            "title": "Case Study: Applying '{brief['les_title']}' to {lab_client.get('name')}'s Case",
            "client_profile": "Provide a brief HTML summary of {lab_client.get('name')}'s core issues as a reminder, then dive deep into the specific aspect of their case that is relevant to THIS lesson's topic.",
            "mock_lab_results": "Invent and detail new mock lab results for {lab_client.get('name')} that are highly relevant to diagnosing or managing the issues in '{brief['les_title']}'.",
            "practitioner_insight": "An expert clinical pearl from Dr. David Chen about the nuances of applying '{brief['les_title']}' to a complex case like {lab_client.get('name')}'s.",
            "challenge": "A specific challenge for the student to solve for {lab_client.get('name')}, directly applying the principles of '{brief['les_title']}'."
        }},
        
        "role_play_scenario": {{
            "title": "Role-Play: Discussing '{brief['les_title']}' with {lab_client.get('name')}",
            "scenario_setup": "Context for a role-play where the student must discuss findings or recommendations related to '{brief['les_title']}' with {lab_client.get('name')}.",
            "dialogue_prompts": [
                {{"prompt": "A question {lab_client.get('name')} would ask related to '{brief['les_title']}'.", "best_practice_response": "A model response for this topic."}},
                {{"prompt": "A second, more challenging prompt from {lab_client.get('name')}.", "best_practice_response": "Another exemplary practitioner response."}},
                {{"prompt": "A resistant statement from {lab_client.get('name')} regarding '{brief['les_title']}'.", "best_practice_response": "A professional response to handle the situation."}}
            ]
        }},
        
        "client_asset_task": {{
            "title": "Practical Exercise: Creating a [Asset Name] for {lab_client.get('name')}",
            "pre_task_checklist": ["A relevant preparation item.", "A second preparation item.", "A third preparation item."],
            "task_description": "A detailed description of a client-facing asset the student must create for {lab_client.get('name')} using knowledge from '{brief['les_title']}'.",
            "self_assessment_rubric": ["A criterion for self-evaluation.", "A second criterion.", "A third criterion."]
        }},
        
        "summary_takeaways": ["Five key, full-sentence learning points from this lesson."],
        "tips_and_tricks": ["Five advanced, practical tips for mastering the skills in this lesson."],
        "next_lab_preview": {{ "title": "Title of Next Lab Lesson", "body": "A brief, exciting preview." }}
    }}
    
    Generate ONLY the complete valid JSON object.
    """
    
    return call_gemini_with_json_retry(prompt, task_id)

def generate_practitioner_lab_series(personas_json, base_course_path, niche_topic, language_name):
    """Orchestrates the entire generation of the Practitioner Lab series, including a capstone PDF toolkit for each course."""
    log(f"STARTING TIERED PRACTITIONER LAB BUILD for '{niche_topic}'", "SUCCESS")
    start_time = time.time()
    lab_path = os.path.join(base_course_path, "PRACTITIONER_LAB")

    try:
        script_dir = os.path.abspath(os.path.dirname(__file__))
        template_path = os.path.join(script_dir, CONFIG["templates_folder"])
        env = Environment(loader=FileSystemLoader(template_path, encoding='utf-8'))
        templates = {
            'lab_syllabus': env.get_template('lab_syllabus_template.html'),
            'module_overview': env.get_template('module_overview_template.html'),
            'lab_lesson': env.get_template('practice_module_template.html'),
            'toolkit': env.get_template('toolkit_template.html') # Added toolkit template
        }
    except Exception as e:
        log(f"Fatal Error loading Lab templates: {e}. Aborting.", "ERROR")
        return

    # Generate the high-level plan for all lab courses first
    lab_plan_template = {"practitioner_lab": [dict(c) for c in PRACTITIONER_LAB_STRUCTURE]}
    for course in lab_plan_template["practitioner_lab"]:
        num_modules = course.get("modules", 0)
        num_lessons = course.get("lessons_per_module", 0)
        course["modules"] = [{"module_number": i, "lessons": [{"lesson_number": j, "title": ""} for j in range(1, num_lessons + 1)]} for i in range(1, num_modules + 1)]

    lab_titles_prompt = f'You are a curriculum designer for a "{niche_topic}" Practitioner Lab. Fill in all empty "title" values for the modules and lessons in this JSON: {json.dumps(lab_plan_template, indent=2)}. Generate ONLY the valid JSON in **{language_name}**.'
    log("  - Generating Practitioner Lab module and lesson titles...", "TASK")
    final_lab_plan = call_gemini_with_json_retry(lab_titles_prompt, f"Lab Plan for {niche_topic}")
    if not final_lab_plan or "practitioner_lab" not in final_lab_plan:
        log("Failed to generate Lab plan. Aborting.", "ERROR")
        return

    # Process each course completely, one by one
    for i, course_data in enumerate(final_lab_plan["practitioner_lab"]):
        static_course_info = PRACTITIONER_LAB_STRUCTURE[i]
        static_course_info.pop("modules", None) # <-- ADD THIS NEW LINE
        course_data.update(static_course_info) # Merge static info like folder, title, etc.

        log(f"--- Processing Lab Course {course_data['course_number']}: {course_data['title']} ---", "INFO")
        
        # Generate the unique case study client for THIS course
        lab_client = generate_lab_case_study_client(course_data, language_name)
        if not lab_client:
            log(f"Failed to generate case study client for Lab Course {course_data['course_number']}. Skipping.", "ERROR")
            continue

        # Generate all lesson content for THIS course in parallel
        briefs = []
        for module_data in course_data.get("modules", []):
            for lesson_data in module_data.get("lessons", []):
                briefs.append({
                    "niche_topic": niche_topic, "course_num": course_data["course_number"],
                    "course_title": course_data["title"], "mod_num": module_data["module_number"],
                    "mod_title": module_data.get("title", ""), "les_num": lesson_data["lesson_number"],
                    "les_title": lesson_data.get("title", ""), "complexity_description": course_data["complexity"],
                    "lab_client": lab_client, "target": lesson_data
                })
        with ThreadPoolExecutor(max_workers=CONFIG["MAX_CONCURRENT_TASKS"], thread_name_prefix="LabWorker") as executor:
            future_to_brief = {executor.submit(generate_practitioner_lab_lesson_content, b, language_name): b for b in briefs}
            for future in as_completed(future_to_brief):
                brief = future_to_brief[future]
                try:
                    if result := future.result(): brief['target']['content'] = result
                except Exception as exc:
                    log(f"Lab Lesson C{brief['course_num']}-M{brief['mod_num']}-L{brief['les_num']} failed: {exc}", "ERROR")

        # Render all HTML files for THIS course
        course_path = os.path.join(lab_path, course_data["folder"])
        os.makedirs(course_path, exist_ok=True)
        for module in course_data.get("modules", []):
            module_folder_name = f"Module_{module['module_number']}_{sanitize_filename(module.get('title', ''))}"
            module_path = os.path.join(course_path, module_folder_name)
            os.makedirs(module_path, exist_ok=True)
            
            context = {"level": course_data, "module": module, "course_title": f"{niche_topic} Practitioner Lab", "sanitize_filename": sanitize_filename, "LANG_CONFIG": LANG_CONFIG}
            module_index_html = templates['module_overview'].render(context)
            safe_file_write(module_index_html, os.path.join(module_path, "index.html"))

            for lesson in module.get("lessons", []):
                if 'content' in lesson:
                    lesson_context = {"level": course_data, "module": lesson['content'], "LANG_CONFIG": LANG_CONFIG}
                    lesson_html = templates['lab_lesson'].render(lesson_context)
                    lesson_filename = f"Lesson_{lesson['lesson_number']:02d}_{sanitize_filename(lesson.get('title', ''))}.html"
                    safe_file_write(lesson_html, os.path.join(module_path, lesson_filename))
        
        # Generate the consolidated PDF toolkit for THIS course
        generate_lab_course_toolkit(course_data, lab_client, course_path, templates)

    # After all courses are done, render the main syllabus
    log("Rendering final Practitioner Lab syllabus...", "INFO")
    syllabus_html = templates['lab_syllabus'].render(lab=final_lab_plan, course_title=niche_topic, LANG_CONFIG=LANG_CONFIG, sanitize_filename=sanitize_filename, **CONFIG)
    safe_file_write(syllabus_html, os.path.join(lab_path, "index.html"))
    
    log(f"PRACTITIONER LAB BUILD COMPLETE (Time: {time.time() - start_time:.2f}s)", "SUCCESS")

# --- BUSINESS ACADEMY GENERATION ---
def generate_business_academy_avatar(niche_topic, language_name):
    """Generates a single, detailed 'student avatar' for the entire Business Academy."""
    task_id = f"Biz Academy Avatar for {niche_topic}"
    log(f"Generating Golden Thread Student Avatar for Business Academy...", "TASK")
    
    prompt = f"""
    You are a master storyteller and business coach. Your task is to create a relatable and compelling "student avatar" for a Business Academy focused on the niche: **"{niche_topic}"**.

    This avatar represents the student taking the course. Their journey of building their practice will be the 'golden thread' that connects all 30+ lessons.

    **TASK:**
    Generate a single, valid JSON object in **{language_name}**. Invent a realistic name. The avatar's profile must be rich and detailed enough to be explored from multiple angles, from founding their business to scaling it.

    **JSON STRUCTURE (all fields required):**
    {{
      "name": "The student avatar's full name (e.g., 'Dr. Evelyn Reed').",
      "tagline": "A short, memorable tagline",
      "full_profile_html": "A detailed, multi-paragraph HTML description of the avatar including their background, passion for '{niche_topic}', business fears, and ultimate dream."
    }}
    
    Generate ONLY the valid JSON object.
    """
    return call_gemini_with_json_retry(prompt, task_id)

def generate_business_academy_content(brief, language_name):
    """Generates deep, narrative-driven content for a single Business Academy lesson using the student avatar."""
    task_id = f"Academy C{brief['course_num']}-M{brief['mod_num']}-L{brief['les_num']}"
    log(f"Generating {task_id} for '{brief['les_title']}'...", "TASK")
    
    student_avatar = brief['student_avatar']
    
    prompt = f"""
    You are a world-class business coach (Sarah) creating a single, in-depth lesson for a Business Academy.

    **CRITICAL CONTEXT & FOCUS:**
    - This lesson's specific topic is: **"{brief['les_title']}"**.
    - The student is **{student_avatar.get('name', 'the student')}**, {student_avatar.get('tagline', '')}, building a **"{brief['niche_topic']}"** practice.

    **CRITICAL INSTRUCTIONS:**
    1.  **LASER FOCUS:** All content MUST be about applying the business topic **"{brief['les_title']}"** to the specific journey of **{student_avatar.get('name')}** as they build their **"{brief['niche_topic']}"** practice.
    2.  **USE THE AVATAR:** Base all examples on the avatar's profile: {student_avatar.get('full_profile_html', '')}.
    3.  **GO DEEP:** Content must be comprehensive, detailed, and provide immense value.

    **JSON STRUCTURE (ALL FIELDS REQUIRED AND MUST CONTAIN SUBSTANTIAL CONTENT):**
    {{
      "learning_objectives": ["3-4 action-oriented business objectives"],
      "lesson_body": "Minimum 4-6 detailed paragraphs of rich HTML content.",
      "niche_specific_example": {{
        "title": "Bringing it to Life: How {student_avatar.get('name')} Applies This",
        "body": "2-3 HTML paragraphs showing {student_avatar.get('name')} applying '{brief['les_title']}' to their {brief['niche_topic']} practice."
      }},
      "action_step": {{ "title": "Your Action Step", "body": "A concrete business-building task." }},
      "worksheet_prompt": {{ "title": "CEO Mindset Journal Prompt", "body": "2-3 deep, reflective questions." }},
      "sarah_insider_tip": "A personal, empathetic tip from Sarah addressing a common fear.",
      "common_pitfalls": [
        {{"pitfall": "A common mistake", "solution": "A practical solution."}},
        {{"pitfall": "Another stumbling block.", "solution": "Another clear solution."}}
      ],
      "next_lesson_preview": {{ "title": "Coming Up Next: [Title]", "body": "An exciting 1-2 sentence preview." }},
      "progress_data": {{ "current_lesson_in_module": {brief['les_num']}, "total_lessons_in_module": {brief['lessons_per_module']} }}
    }}
    Generate ONLY the complete, valid JSON object.
    """
    return call_gemini_with_json_retry(prompt, task_id)

def generate_business_academy(master_plan, base_course_path, niche_topic, language_name):
    """Orchestrates the entire generation process for the Business Academy using a student avatar."""
    log(f"STARTING BUSINESS ACADEMY BUILD for '{niche_topic}'", "SUCCESS")
    start_time = time.time()
    academy_path = os.path.join(base_course_path, "BUSINESS_ACADEMY")
    os.makedirs(academy_path, exist_ok=True)

    try:
        script_dir = os.path.abspath(os.path.dirname(__file__))
        template_path = os.path.join(script_dir, CONFIG["templates_folder"])
        env = Environment(loader=FileSystemLoader(template_path, encoding='utf-8'))
        templates = {
            'academy_syllabus': env.get_template('academy_syllabus.html'),
            'academy_course_overview': env.get_template('academy_course_overview.html'),
            'academy_lesson': env.get_template('academy_lesson_template.html'),
            'academy_module_overview': env.get_template('academy_module_overview.html'),
            # --- ADDITION 1 of 2: Load the new toolkit template ---
            'toolkit': env.get_template('toolkit_template.html')
        }
    except Exception as e:
        log(f"Fatal Error loading Business Academy templates: {e}. Aborting.", "ERROR")
        return

    student_avatar = generate_business_academy_avatar(niche_topic, language_name)
    if not student_avatar:
        log("Failed to generate a student avatar for the Business Academy. Aborting.", "ERROR")
        return

    plan_template = {"academy": [dict(c) for c in BUSINESS_ACADEMY_STRUCTURE]}
    for course in plan_template["academy"]:
        for module in course["modules"]:
            num_lessons = module.get("lessons", 0)
            if isinstance(num_lessons, int):
                module["lessons"] = [{"lesson_number": j, "title": ""} for j in range(1, num_lessons + 1)]

    plan_generation_prompt = f'As a curriculum designer for a "{niche_topic}" Business Academy, fill in the "title" for each lesson in this JSON: {json.dumps(plan_template, indent=2)}. Generate ONLY the valid JSON in **{language_name}**.'
    log("  - Generating Business Academy lesson titles...", "TASK")
    academy_plan = call_gemini_with_json_retry(plan_generation_prompt, f"Academy Lesson Plan for {niche_topic}")
    if not academy_plan or "academy" not in academy_plan:
        log(f"Failed to generate a valid lesson plan for Business Academy. Aborting.", "ERROR")
        return

    briefs = []
    for i, course_data in enumerate(academy_plan["academy"]):
        static_course_info = BUSINESS_ACADEMY_STRUCTURE[i]
        course_data["folder"] = static_course_info["folder"]
        for module_data in course_data["modules"]:
            for lesson_data in module_data.get("lessons", []):
                briefs.append({
                    "niche_topic": niche_topic,
                    "course_num": course_data["course_number"], 
                    "course_title": course_data["title"],
                    "mod_num": module_data["module_number"], 
                    "mod_title": module_data["title"],
                    "les_num": lesson_data["lesson_number"], 
                    "les_title": lesson_data["title"],
                    "student_avatar": student_avatar,
                    "target": lesson_data,
                    "lessons_per_module": len(module_data.get("lessons", []))
                })

    with ThreadPoolExecutor(max_workers=50, thread_name_prefix="AcademyWorker") as executor:
        future_to_brief = {executor.submit(generate_business_academy_content, b, language_name): b for b in briefs}
        for future in as_completed(future_to_brief):
            brief = future_to_brief[future]
            try:
                if result := future.result():
                    brief['target'].update(result)
            except Exception as exc:
                log(f"Academy C{brief['course_num']}-M{brief['mod_num']}-L{brief['les_num']} generated an exception: {exc}", "ERROR")

    log(f"Rendering all Business Academy files...", "INFO")
    for course in academy_plan["academy"]:
        course_path = os.path.join(academy_path, course["folder"])
        os.makedirs(course_path, exist_ok=True)
        
        for module in course["modules"]:
            module_folder_name = f"Module_{module['module_number']}_{sanitize_filename(module['title'])}"
            module_path = os.path.join(course_path, module_folder_name)
            os.makedirs(module_path, exist_ok=True)
            
            for lesson in module.get("lessons", []):
                lesson_html = templates['academy_lesson'].render(
                    course=course, module=module, lesson=lesson,
                    LANG_CONFIG=LANG_CONFIG,
                    total_lessons_in_module=len(module.get("lessons", []))
                )
                lesson_filename = f"Lesson_{lesson['lesson_number']:02d}_{sanitize_filename(lesson['title'])}.html"
                safe_file_write(lesson_html, os.path.join(module_path, lesson_filename))
            
            module_context = {"course": course, "module": module, "LANG_CONFIG": LANG_CONFIG, "sanitize_filename": sanitize_filename}
            module_index_html = templates['academy_module_overview'].render(module_context)
            safe_file_write(module_index_html, os.path.join(module_path, "index.html"))
        
        course_overview_html = templates['academy_course_overview'].render(
            course=course, LANG_CONFIG=LANG_CONFIG, sanitize_filename=sanitize_filename
        )
        safe_file_write(course_overview_html, os.path.join(course_path, "index.html"))

        # --- ADDITION 2 of 2: Generate the consolidated PDF toolkit for this course ---
        generate_academy_course_toolkit(course, course_path, templates)
    
    academy_syllabus_html = templates['academy_syllabus'].render(
        academy=academy_plan["academy"], niche_course_title=master_plan.get("course_title"),
        LANG_CONFIG=LANG_CONFIG, current_year=CONFIG["current_year"],
        publisher=CONFIG["publisher"], sanitize_filename=sanitize_filename
    )
    safe_file_write(academy_syllabus_html, os.path.join(academy_path, "index.html"))
    
    log(f"BUSINESS ACADEMY BUILD COMPLETE (Time: {time.time() - start_time:.2f}s)", "SUCCESS")

def generate_certification_course(niche_topic, category, category_output_dir, language_code, persona_data):
    """Orchestrates the entire generation process for the main certification course and all associated assets."""
    start_time = time.time()
    language_name = LANG_CONFIG.get('language_name', 'English')
    log(f"STARTING BUILD: '{niche_topic}' in {language_name}", "SUCCESS")
    
    # 1. Generate core curriculum and narrative assets first
    master_plan = generate_master_plan_incrementally(niche_topic, language_name, persona_data)
    if not master_plan:
        return False, None, None

    onboarding_module = generate_onboarding_module(master_plan.get("course_title"), language_name)
    unifying_client = generate_unifying_case_study_client(niche_topic, language_name, persona_data)
    
    if onboarding_module and master_plan.get("academy"):
        master_plan["academy"][0]["modules"].insert(0, onboarding_module)
        log("Onboarding Module (Module 00) integrated.", "SUCCESS")

    # 2. Load all required templates
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        template_path = os.path.join(script_dir, CONFIG["templates_folder"])
        print(f"DEBUG: Attempting to load templates from: {template_path}")
        
        env = Environment(loader=FileSystemLoader(template_path, encoding='utf-8'))
        templates = {
            'syllabus': env.get_template('syllabus_template.html'),
            'module_overview': env.get_template('module_overview_template.html'),
            'lesson': env.get_template('lesson_template.html'),
            'method_lesson': env.get_template('method_lesson_template.html'),
            'welcome_lesson_template': env.get_template('welcome_lesson_template.html'),
            'final_module_lesson_template': env.get_template('final_module_lesson_template.html'),
            'cheat_sheet': env.get_template('cheatsheet_template.html'),
            'resource': env.get_template('resource_template.html'),
            'ebook': env.get_template('ebook_template.html'),
        }
    except Exception as e:
        log(f"Fatal Error loading templates from '{template_path}': {e}. Aborting.", "ERROR")
        return False, None, None
        
    # 3. Prepare briefs for concurrent lesson content generation
    all_lessons_briefs = []
    niche_key = list(persona_data.keys())[0]
    personas = persona_data[niche_key]
    for level in master_plan.get("academy", []):
        for module in level.get("modules", []):
            if module.get("module_number", -1) in ["00"] or "Certification Exam" in module.get("module_title", ""):
                continue
            previous_lesson_titles = [l.get('lesson_title', '') for l in module.get("lessons", [])[:-1]]
            for lesson in module.get("lessons", []):
                is_method = (lesson["lesson_number"] == CERTIFICATION_STRUCTURE['lessons_per_module'])
                lesson['lesson_type'] = "method" if is_method else "standard"
                brief = {
                    "level_num": level["level_number"],
                    "mod_num": module["module_number"],
                    "mod_title": module["module_title"],
                    "les_num": lesson["lesson_number"],
                    "les_title": lesson["lesson_title"],
                    "target": lesson,
                    "is_method_lesson": is_method,
                    "previous_lesson_titles": previous_lesson_titles if is_method else [],
                    "persona_data": personas,
                    "unifying_client": unifying_client
                }
                all_lessons_briefs.append(brief)

    # 4. Generate all lesson content in memory
    with ThreadPoolExecutor(max_workers=CONFIG["MAX_CONCURRENT_TASKS"], thread_name_prefix="LessonWorker") as executor:
        future_to_brief = {}
        for b in all_lessons_briefs:
            future = executor.submit(generate_method_lesson_content, b, niche_topic, language_name, persona_data) if b['is_method_lesson'] else executor.submit(generate_standard_lesson_content, b, niche_topic, language_name, persona_data)
            future_to_brief[future] = b
        for future in as_completed(future_to_brief):
            brief = future_to_brief[future]
            try:
                if result := future.result():
                    brief["target"].update(result)
                else:
                    log(f"Lesson L{brief['level_num']}-M{brief['mod_num']}-L{brief['les_num']} received no content.", "ERROR")
            except Exception as exc:
                log(f"Lesson L{brief['level_num']}-M{brief['mod_num']}-L{brief['les_num']} generated an exception: {exc}", "ERROR")

    log("All lesson content generation completed.", "SUCCESS")
    
    # 5. Render all files and module-specific assets
    course_folder_name = f"CERTIFICATION_{sanitize_filename(niche_topic)}"
    course_path = os.path.join(category_output_dir, course_folder_name)
    render_and_save_files(master_plan, course_path, templates, niche_topic)
    
    # 6. Generate module quizzes
    log("Generating all module quizzes as CSVs...", "INFO")
    quiz_tasks = []
    for level in master_plan.get("academy", []):
        for module in level.get("modules", []):
            if module.get("module_number", -1) in ["00"] or module.get("module_title") == "Certification Exam and Next Steps":
                continue
            module_folder_name = f"Module_{module['module_number']}_{sanitize_filename(module['module_title'])}"
            level_folder_name = f"Level_{level['level_number']}_{sanitize_filename(level['level_title'])}"
            module_path = os.path.join(course_path, level_folder_name, module_folder_name)
            lesson_titles = [l.get('lesson_title', 'Untitled Lesson') for l in module.get("lessons", [])]
            dest_quiz_dir = os.path.join(module_path, "quizzes")
            dest_csv_path = os.path.join(dest_quiz_dir, "quiz.csv")
            quiz_tasks.append({
                "module_title": module['module_title'],
                "lesson_titles": lesson_titles,
                "language_name": language_name,
                "dest_path": dest_csv_path
            })

    with ThreadPoolExecutor(max_workers=50, thread_name_prefix="QuizWorker") as executor:
        future_to_task = {executor.submit(generate_and_save_module_quiz_csv, **task): task for task in quiz_tasks}
        for future in as_completed(future_to_task):
            try:
                future.result()
            except Exception as exc:
                task = future_to_task[future]
                log(f"Module quiz for '{task['module_title']}' generated an exception: {exc}", "ERROR")
    
    # 7. Generate final course-wide assets in parallel
    log("Generating course-wide assets in parallel...", "INFO")
    master_plan['niche_topic'] = niche_topic
    
    # --- AFTER THE CHANGE ---

    with ThreadPoolExecutor(max_workers=10, thread_name_prefix="AssetWorker") as executor:
        futures = [
            executor.submit(generate_final_exam, master_plan, course_path),
            # executor.submit(generate_ebook_from_course, master_plan, course_path, templates)
        ]
        
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                log(f"Course-wide asset generation failed: {e}", "ERROR")
    
    # 8. Generate Business Academy and Practitioner Lab
    log("Generating Business Academy and Practitioner Lab...", "INFO")
    
    # Generate Practitioner Lab  
    generate_practitioner_lab_series(persona_data, course_path, niche_topic, language_name)

    # Generate Business Academy
    generate_business_academy(master_plan, course_path, niche_topic, language_name)
    
    log(f"BUILD COMPLETE: '{niche_topic}' (Time: {time.time() - start_time:.2f}s)", "SUCCESS")
    return True, master_plan, course_path

# --- MAIN EXECUTION SCRIPT ---
if __name__ == "__main__":
    if not all_keys:
        log("CRITICAL: No API keys were loaded. Please check 'config/api_keys.txt'.", "ERROR")
        exit(1)
    
    print("AUTONOMOUS 5/5 CERTIFICATION COURSE GENERATOR")
    selected_languages = select_language()
    
    for language_code in selected_languages:
        LANG_CONFIG = get_language_config(language_code)
        if len(selected_languages) > 1:
            print(f"\n{'='*70}\nPROCESSING LANGUAGE: {LANG_CONFIG['language_name'].upper()}\n{'='*70}\n")
        
        if not os.path.exists(CONFIG["niches_folder"]):
            log(f"No '{CONFIG['niches_folder']}' directory found!", "ERROR")
            continue
            
        available_files = [f for f in os.listdir(CONFIG["niches_folder"]) if f.endswith('.txt')]
        if not available_files:
            log(f"No .txt files found in '{CONFIG['niches_folder']}' directory!", "ERROR")
            continue
            
        print(f"\nAVAILABLE NICHE CATEGORIES ({LANG_CONFIG['language_name']}):")
        for i, file in enumerate(available_files, 1):
            print(f"  {i}. {file.replace('.txt', '').replace('_', ' ').title()}")
        print("\n  0. Process ALL categories")
        
        categories_to_process = []
        while True:
            try:
                choice = input(f"\nSelect category for {LANG_CONFIG['language_name']} (or 'q' to quit): ").strip()
                if choice.lower() == 'q': break
                choice_num = int(choice)
                if choice_num == 0:
                    categories_to_process = [f.replace('.txt', '') for f in available_files]
                    break
                elif 1 <= choice_num <= len(available_files):
                    categories_to_process = [available_files[choice_num - 1].replace('.txt', '')]
                    break
                else: print("Invalid choice.")
            except ValueError: print("Please enter a number.")
            
        if not categories_to_process: continue
            
        for category in categories_to_process:
            log(f"PROCESSING CATEGORY: {category.upper()}", "INFO")
            language_dir = os.path.join(CONFIG["main_output_dir"], language_code)
            category_output_dir = os.path.join(language_dir, category)
            os.makedirs(category_output_dir, exist_ok=True)
            niche_file_path = os.path.join(CONFIG["niches_folder"], f"{category}.txt")
            
            try:
                with open(niche_file_path, 'r', encoding='utf-8') as f:
                    all_primary_niches = [line.strip() for line in f if line.strip() and not line.strip().startswith(('#', '-', '*'))]
            except FileNotFoundError:
                log(f"Niche file not found: {niche_file_path}", "ERROR")
                continue
            
            for primary_niche in all_primary_niches:
                personas_json = discover_and_generate_personas(primary_niche, category, LANG_CONFIG['language_name'])
                if not personas_json:
                    log(f"Skipping course for '{primary_niche}' due to persona failure.", "WARNING")
                    continue
                
                success, master_plan, course_path = generate_certification_course(primary_niche, category, category_output_dir, language_code, personas_json)
                    
    log("--- ALL COURSE GENERATION OPERATIONS FINISHED ---", "SUCCESS")