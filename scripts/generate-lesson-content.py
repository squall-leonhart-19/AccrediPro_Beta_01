#!/usr/bin/env python3
"""
AccrediPro Mini Diploma Lesson Generator
Uses Anthropic Claude API to generate 9-lesson curriculum for any niche.

Usage:
    python scripts/generate-lesson-content.py --niche "gut-health" --name "Gut Health"
    
Requirements:
    pip install anthropic

Environment:
    ANTHROPIC_API_KEY=your-api-key
"""

import os
import sys
import json
import argparse
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("❌ Please install anthropic: pip install anthropic")
    sys.exit(1)

# Lesson template
LESSON_TEMPLATE = '''\"use client\";

import {{ LessonBase, Message }} from \"../shared/lesson-base\";

interface LessonProps {{
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}}

export function {component_name}({{
    lessonNumber,
    totalLessons = 9,
    firstName = \"friend\",
    onComplete,
    onNext,
    isCompleted,
}}: LessonProps) {{
    const messages: Message[] = [
{messages_content}
    ];

    return (
        <LessonBase
            lessonNumber={{lessonNumber}}
            lessonTitle=\"{lesson_title}\"
            lessonSubtitle=\"{lesson_subtitle}\"
            totalLessons={{totalLessons}}
            messages={{messages}}
            onComplete={{onComplete}}
            onNext={{onNext}}
            isCompleted={{isCompleted}}
            firstName={{firstName}}
        />
    );
}}
'''

# Niche configurations
NICHE_CONFIGS = {
    "gut-health": {
        "name": "Gut Health",
        "credential_prefix": "GH",
        "topics": [
            ("Introduction to Gut Health", "Why the gut is the foundation of all health"),
            ("The Microbiome", "Understanding your trillion bacterial partners"),
            ("Leaky Gut Syndrome", "When the gut barrier breaks down"),
            ("SIBO & Dysbiosis", "Bacterial imbalances and their effects"),
            ("The Gut-Brain Axis", "How your gut affects your mood and mind"),
            ("Digestive Enzymes & HCl", "The chemistry of proper digestion"),
            ("Healing Protocols", "The 5R framework for gut restoration"),
            ("Food Sensitivities", "Identifying and eliminating triggers"),
            ("Your Next Step", "Becoming a certified Gut Health Specialist"),
        ]
    },
    "hormone-health": {
        "name": "Hormone Health", 
        "credential_prefix": "HH",
        "topics": [
            ("Meet Your Hormones", "Understanding the key players in hormonal health"),
            ("The Menstrual Cycle", "The monthly dance of estrogen and progesterone"),
            ("Hormonal Imbalances", "When hormones go rogue"),
            ("The Thyroid Connection", "Your metabolism master controller"),
            ("Adrenal Health", "Stress, cortisol, and burnout"),
            ("Perimenopause & Menopause", "Navigating life stage transitions"),
            ("Hormone Testing", "Labs that reveal the truth"),
            ("Natural Balancing", "Lifestyle and nutrition protocols"),
            ("Your Next Step", "Becoming a certified Hormone Health Specialist"),
        ]
    },
    "holistic-nutrition": {
        "name": "Holistic Nutrition",
        "credential_prefix": "HN",
        "topics": [
            ("Food as Medicine", "The foundation of holistic nutrition"),
            ("Macronutrients", "Proteins, fats, and carbs decoded"),
            ("Micronutrients", "Vitamins and minerals for optimal health"),
            ("Anti-Inflammatory Eating", "Foods that heal vs. foods that harm"),
            ("Blood Sugar Balance", "The key to energy and weight management"),
            ("Gut-Nutrition Connection", "Digestion and nutrient absorption"),
            ("Personalized Nutrition", "Bio-individuality and client protocols"),
            ("Mindful Eating", "The psychology of food choices"),
            ("Your Next Step", "Becoming a certified Holistic Nutrition Specialist"),
        ]
    },
    "nurse-coach": {
        "name": "Nurse Life Coach",
        "credential_prefix": "NLC",
        "topics": [
            ("From Bedside to Business", "Leveraging your nursing expertise"),
            ("The Coaching Mindset", "Shifting from fixing to facilitating"),
            ("Burnout Recovery", "Healing yourself to help others"),
            ("Core Coaching Skills", "Active listening, powerful questions"),
            ("Health Behavior Change", "Motivational interviewing for nurses"),
            ("Building Your Practice", "From employee to entrepreneur"),
            ("Marketing for Nurses", "Attracting clients authentically"),
            ("Legal & Ethical Considerations", "Scope of practice and boundaries"),
            ("Your Next Step", "Becoming a certified Nurse Life Coach"),
        ]
    },
    "health-coach": {
        "name": "Health Coach",
        "credential_prefix": "HC",
        "topics": [
            ("What is Health Coaching?", "The art and science of behavior change"),
            ("Core Coaching Competencies", "Skills that transform lives"),
            ("The Wellness Wheel", "Holistic health assessment"),
            ("Goal Setting & Action Plans", "Making change sustainable"),
            ("Motivational Interviewing", "Evoking intrinsic motivation"),
            ("Nutrition Foundations", "Food basics for coaches"),
            ("Stress & Lifestyle", "Mind-body approaches"),
            ("Building Your Practice", "From certification to clients"),
            ("Your Next Step", "Becoming a certified Health Coach"),
        ]
    },
}

def create_lesson_prompt(niche_name: str, lesson_num: int, title: str, subtitle: str, total_lessons: int = 9) -> str:
    """Create the prompt for generating a lesson."""
    return f"""You are creating lesson content for an online health certification program.

NICHE: {niche_name}
LESSON: {lesson_num} of {total_lessons}
TITLE: {title}
SUBTITLE: {subtitle}

Generate 12-15 messages for this lesson in the following JSON format. Each message should be one of these types:
- "coach": Coach Sarah speaking directly to the student (conversational, supportive, uses {{name}} placeholder)
- "system": Educational content blocks with **bold** headers and bullet points
- "user-choice": Interactive choice question with 3 options

REQUIREMENTS:
1. Start with a coach welcome message
2. Include 3-4 system blocks with key educational content
3. Include 2 user-choice interactions
4. Mix coach and system messages naturally
5. End with preview of next lesson and encouragement
6. Use emojis sparingly (1-2 per coach message max)
7. Keep coach messages conversational and warm
8. System blocks should have clear headers and bullet points
9. Content should be accurate and educational
10. If this is lesson 9, make it about next steps and certification

Return ONLY a valid JSON array of message objects like this:
[
  {{"id": 1, "type": "coach", "content": "Hey {{name}}! Welcome..."}},
  {{"id": 2, "type": "system", "content": "**Key Concept**\\n• Point 1\\n• Point 2", "systemStyle": "info"}},
  {{"id": 3, "type": "user-choice", "content": "Question here?", "choices": ["Option 1", "Option 2", "Option 3"], "showReaction": true}},
  ...
]

systemStyle can be: "info", "takeaway", or "quote"

Generate the JSON array now:"""

def generate_lesson_content(client: anthropic.Anthropic, niche_name: str, lesson_num: int, title: str, subtitle: str) -> list:
    """Generate lesson content using Claude API."""
    prompt = create_lesson_prompt(niche_name, lesson_num, title, subtitle)
    
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    response_text = message.content[0].text.strip()
    
    # Try to parse JSON
    try:
        # Find JSON array in response
        start_idx = response_text.find('[')
        end_idx = response_text.rfind(']') + 1
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"  ⚠️ JSON parse error: {e}")
        print(f"  Response: {response_text[:500]}...")
        return []
    
    return []

def format_messages_to_tsx(messages: list) -> str:
    """Convert message list to TSX code."""
    lines = []
    for msg in messages:
        msg_id = msg.get('id', 1)
        msg_type = msg.get('type', 'coach')
        content = msg.get('content', '').replace('`', '\\`').replace('${', '\\${')
        
        if msg_type == 'coach':
            lines.append(f'''        {{
            id: {msg_id},
            type: 'coach',
            content: `{content}`,
        }},''')
        elif msg_type == 'system':
            style = msg.get('systemStyle', 'info')
            lines.append(f'''        {{
            id: {msg_id},
            type: 'system',
            content: `{content}`,
            systemStyle: '{style}',
        }},''')
        elif msg_type == 'user-choice':
            choices = msg.get('choices', [])
            choices_str = json.dumps(choices)
            lines.append(f'''        {{
            id: {msg_id},
            type: 'user-choice',
            content: `{content}`,
            choices: {choices_str},
            showReaction: true,
        }},''')
    
    return '\n'.join(lines)

def slugify(text: str) -> str:
    """Convert text to slug format."""
    return text.lower().replace(' ', '-').replace('&', 'and').replace("'", '').replace(',', '')

def to_component_name(text: str) -> str:
    """Convert text to PascalCase component name."""
    words = text.replace('-', ' ').replace('&', 'and').replace("'", '').split()
    return 'Lesson' + ''.join(word.capitalize() for word in words)

def generate_all_lessons(niche_slug: str, api_key: str = None):
    """Generate all 9 lessons for a niche."""
    if niche_slug not in NICHE_CONFIGS:
        print(f"❌ Unknown niche: {niche_slug}")
        print(f"Available niches: {list(NICHE_CONFIGS.keys())}")
        return
    
    config = NICHE_CONFIGS[niche_slug]
    niche_name = config['name']
    topics = config['topics']
    
    # Setup API client
    api_key = api_key or os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ Please set ANTHROPIC_API_KEY environment variable")
        return
    
    client = anthropic.Anthropic(api_key=api_key)
    
    # Output directory
    output_dir = Path(f"src/components/mini-diploma/lessons/{niche_slug}")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n🚀 Generating {len(topics)} lessons for: {niche_name}")
    print(f"📁 Output: {output_dir}\n")
    
    generated_files = []
    
    for i, (title, subtitle) in enumerate(topics, 1):
        print(f"📝 Lesson {i}: {title}...", end=" ", flush=True)
        
        try:
            messages = generate_lesson_content(client, niche_name, i, title, subtitle)
            
            if not messages:
                print("❌ Failed to generate")
                continue
            
            # Format to TSX
            messages_tsx = format_messages_to_tsx(messages)
            component_name = to_component_name(title)
            file_slug = slugify(title)
            
            # Generate file content
            file_content = LESSON_TEMPLATE.format(
                component_name=component_name,
                messages_content=messages_tsx,
                lesson_title=title,
                lesson_subtitle=subtitle,
            )
            
            # Write file
            filename = f"lesson-{i}-{file_slug}.tsx"
            filepath = output_dir / filename
            filepath.write_text(file_content)
            
            generated_files.append((i, component_name, filename))
            print("✅")
            
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Generate router file
    print("\n📋 Generating lesson router...")
    generate_router(output_dir, niche_slug, niche_name, generated_files)
    
    print(f"\n✅ Complete! Generated {len(generated_files)} lessons.")
    print(f"📁 Files saved to: {output_dir}")

def generate_router(output_dir: Path, niche_slug: str, niche_name: str, lessons: list):
    """Generate the lesson router file."""
    imports = []
    cases = []
    
    for lesson_num, component_name, filename in lessons:
        import_path = f"./{filename.replace('.tsx', '')}"
        imports.append(f'import {{ {component_name} }} from "{import_path}";')
        cases.append(f'''        case {lesson_num}:
            return <{component_name} {{...commonProps}} />;''')
    
    router_name = ''.join(word.capitalize() for word in niche_slug.split('-')) + 'LessonRouter'
    default_component = lessons[0][1] if lessons else 'Lesson1'
    
    router_content = f'''\"use client\";

{chr(10).join(imports)}

interface LessonRouterProps {{
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}}

/**
 * Routes to the correct {niche_name} lesson component based on lesson number
 */
export function {router_name}({{
    lessonNumber,
    firstName,
    onComplete,
    onNext,
    isCompleted,
}}: LessonRouterProps) {{
    const commonProps = {{
        firstName,
        onComplete,
        onNext,
        isCompleted,
        lessonNumber,
        totalLessons: 9,
    }};

    switch (lessonNumber) {{
{chr(10).join(cases)}
        default:
            return <{default_component} {{...commonProps}} />;
    }}
}}
'''
    
    router_path = output_dir / "lesson-router.tsx"
    router_path.write_text(router_content)
    print("✅ Router generated")

def main():
    parser = argparse.ArgumentParser(description='Generate Mini Diploma lesson content using Claude AI')
    parser.add_argument('--niche', '-n', required=True, help='Niche slug (e.g., gut-health, hormone-health)')
    parser.add_argument('--api-key', '-k', help='Anthropic API key (or set ANTHROPIC_API_KEY env var)')
    parser.add_argument('--list', '-l', action='store_true', help='List available niches')
    
    args = parser.parse_args()
    
    if args.list:
        print("Available niches:")
        for slug, config in NICHE_CONFIGS.items():
            print(f"  - {slug}: {config['name']}")
        return
    
    generate_all_lessons(args.niche, args.api_key)

if __name__ == "__main__":
    main()
