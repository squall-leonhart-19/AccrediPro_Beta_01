#!/usr/bin/env python3
"""
import.py - Import Generated Courses to Database

Reads generated course content and imports to PostgreSQL via Prisma:
- Creates/updates Course records
- Creates Module and Lesson records
- Creates MarketingTag records
- Links courses to categories and coaches

Usage:
    python import.py "course-slug"
    python import.py --category "Mental Health"
    python import.py --all
"""

import sys
import os
import re
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime

# Prisma connection - we'll use the Node.js client via subprocess
PRISMA_SCRIPT_TEMPLATE = """
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const data = %s;
    
    try {
        // Upsert course
        const course = await prisma.course.upsert({
            where: { slug: data.course.slug },
            update: {
                title: data.course.title,
                description: data.course.description,
                price: data.course.price,
                isPublished: false,
            },
            create: {
                slug: data.course.slug,
                title: data.course.title,
                description: data.course.description,
                price: data.course.price,
                isPublished: false,
            }
        });
        
        console.log('Course created/updated:', course.id);
        
        // Create modules
        for (const mod of data.modules) {
            const module = await prisma.module.upsert({
                where: {
                    courseId_orderIndex: {
                        courseId: course.id,
                        orderIndex: mod.orderIndex
                    }
                },
                update: {
                    title: mod.title,
                    tier: mod.tier,
                },
                create: {
                    courseId: course.id,
                    title: mod.title,
                    tier: mod.tier,
                    orderIndex: mod.orderIndex,
                }
            });
            
            // Create lessons
            for (const lesson of mod.lessons) {
                await prisma.lesson.upsert({
                    where: {
                        moduleId_orderIndex: {
                            moduleId: module.id,
                            orderIndex: lesson.orderIndex
                        }
                    },
                    update: {
                        title: lesson.title,
                        htmlContent: lesson.htmlContent,
                        isPracticeLab: lesson.isPracticeLab,
                    },
                    create: {
                        moduleId: module.id,
                        title: lesson.title,
                        htmlContent: lesson.htmlContent,
                        isPracticeLab: lesson.isPracticeLab,
                        orderIndex: lesson.orderIndex,
                    }
                });
            }
        }
        
        // Create marketing tags
        for (const tag of data.tags) {
            await prisma.marketingTag.upsert({
                where: { slug: tag.slug },
                update: { name: tag.name },
                create: {
                    slug: tag.slug,
                    name: tag.name,
                    category: 'SUPPRESS',
                }
            });
        }
        
        console.log('Import complete!');
        console.log('Modules:', data.modules.length);
        console.log('Lessons:', data.modules.reduce((sum, m) => sum + m.lessons.length, 0));
        console.log('Tags:', data.tags.length);
        
    } catch (error) {
        console.error('Import error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
"""


class CourseImporter:
    def __init__(self, course_slug: str):
        self.course_slug = course_slug
        self.base_path = Path(__file__).parent.parent.parent / "courses" / course_slug
        self.project_root = Path(__file__).parent.parent.parent
        
    def prepare_import_data(self) -> Optional[Dict[str, Any]]:
        """Prepare course data for import"""
        if not self.base_path.exists():
            print(f"❌ Course not found: {self.course_slug}")
            return None
        
        # Load blueprint
        blueprint_path = self.base_path / "course_blueprint.json"
        if not blueprint_path.exists():
            print(f"❌ Blueprint not found: {blueprint_path}")
            return None
        
        try:
            blueprint = json.loads(blueprint_path.read_text())
        except Exception as e:
            print(f"❌ Error reading blueprint: {e}")
            return None
        
        # Load nomenclature if available
        nomenclature_path = self.base_path / "nomenclature.json"
        nomenclature = None
        if nomenclature_path.exists():
            try:
                nomenclature = json.loads(nomenclature_path.read_text())
            except:
                pass
        
        # Build course data
        course_data = {
            'slug': self.course_slug,
            'title': blueprint.get('course', self.course_slug.replace('-', ' ').title()),
            'description': blueprint.get('description', ''),
            'price': 9700,  # $97.00 in cents
        }
        
        # Override from nomenclature if available
        if nomenclature:
            course_data['title'] = nomenclature.get('course_name', course_data['title'])
            if nomenclature.get('prices', {}).get('L1'):
                try:
                    price_str = nomenclature['prices']['L1'].replace('$', '').replace(',', '')
                    course_data['price'] = int(float(price_str) * 100)
                except:
                    pass
        
        # Build modules and lessons
        modules_data = []
        tier_folders = ['L1_Main', 'L2_Advanced', 'L3_Master', 'L4_Practice']
        tier_map = {'L1_Main': 'L1', 'L2_Advanced': 'L2', 'L3_Master': 'L3', 'L4_Practice': 'L4'}
        
        module_order = 0
        for tier_folder in tier_folders:
            tier_path = self.base_path / tier_folder
            if not tier_path.exists():
                continue
            
            tier = tier_map[tier_folder]
            
            # Get module directories
            module_dirs = sorted([d for d in tier_path.iterdir() if d.is_dir() and d.name.startswith('Module_')])
            
            for module_dir in module_dirs:
                # Parse module number from directory name
                module_num_match = re.search(r'Module_(\d+)', module_dir.name)
                if not module_num_match:
                    continue
                module_num = int(module_num_match.group(1))
                
                # Get module title from blueprint
                module_title = f"Module {module_num}"
                for bp_module in blueprint.get('modules', []):
                    if bp_module.get('number') == module_num:
                        module_title = bp_module.get('title', module_title)
                        break
                
                # Collect lessons
                lessons_data = []
                lesson_files = sorted(module_dir.glob('Lesson_*.html'))
                
                lesson_order = 0
                for lesson_file in lesson_files:
                    try:
                        html_content = lesson_file.read_text(errors='ignore')
                    except:
                        continue
                    
                    # Parse lesson number from filename
                    lesson_num_match = re.search(r'Lesson_\d+\.(\d+)_', lesson_file.name)
                    lesson_num = int(lesson_num_match.group(1)) if lesson_num_match else lesson_order + 1
                    
                    # Extract title from filename
                    title_match = re.search(r'Lesson_[\d.]+_(.+)\.html', lesson_file.name)
                    lesson_title = title_match.group(1).replace('_', ' ') if title_match else f"Lesson {lesson_num}"
                    
                    # Is it a Practice Lab?
                    is_practice_lab = lesson_num == 8 or 'practice' in lesson_title.lower()
                    
                    lessons_data.append({
                        'title': lesson_title[:200],  # Limit title length
                        'htmlContent': html_content,
                        'isPracticeLab': is_practice_lab,
                        'orderIndex': lesson_order,
                    })
                    lesson_order += 1
                
                if lessons_data:
                    modules_data.append({
                        'title': module_title,
                        'tier': tier,
                        'orderIndex': module_order,
                        'lessons': lessons_data,
                    })
                    module_order += 1
        
        # Build marketing tags from nomenclature
        tags_data = []
        if nomenclature:
            if nomenclature.get('tags', {}).get('L1'):
                tags_data.append({
                    'slug': nomenclature['tags']['L1'].lower().replace(' ', '_'),
                    'name': nomenclature['tags']['L1'],
                })
            if nomenclature.get('tags', {}).get('PRO'):
                tags_data.append({
                    'slug': nomenclature['tags']['PRO'].lower().replace(' ', '_'),
                    'name': nomenclature['tags']['PRO'],
                })
        
        return {
            'course': course_data,
            'modules': modules_data,
            'tags': tags_data,
        }
    
    def import_to_database(self) -> bool:
        """Import course data to database using Prisma"""
        data = self.prepare_import_data()
        if not data:
            return False
        
        print(f"\n📦 Importing: {self.course_slug}")
        print(f"   Modules: {len(data['modules'])}")
        print(f"   Lessons: {sum(len(m['lessons']) for m in data['modules'])}")
        print(f"   Tags: {len(data['tags'])}")
        
        # Write data to temp file (avoid command line length issues)
        temp_data_path = self.project_root / "temp_import_data.json"
        temp_script_path = self.project_root / "temp_import_script.js"
        
        try:
            # Write data
            temp_data_path.write_text(json.dumps(data, ensure_ascii=False))
            
            # Create modified script that reads from file
            script = f"""
const {{ PrismaClient }} = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {{
    const data = JSON.parse(fs.readFileSync('{temp_data_path}', 'utf8'));
    
    try {{
        // Upsert course
        const course = await prisma.course.upsert({{
            where: {{ slug: data.course.slug }},
            update: {{
                title: data.course.title,
                description: data.course.description || '',
                price: data.course.price,
            }},
            create: {{
                slug: data.course.slug,
                title: data.course.title,
                description: data.course.description || '',
                price: data.course.price,
                isPublished: false,
            }}
        }});
        
        console.log('✅ Course:', course.id, course.title);
        
        let moduleCount = 0;
        let lessonCount = 0;
        
        for (const mod of data.modules) {{
            const module = await prisma.module.upsert({{
                where: {{
                    courseId_orderIndex: {{
                        courseId: course.id,
                        orderIndex: mod.orderIndex
                    }}
                }},
                update: {{
                    title: mod.title,
                }},
                create: {{
                    courseId: course.id,
                    title: mod.title,
                    orderIndex: mod.orderIndex,
                }}
            }});
            moduleCount++;
            
            for (const lesson of mod.lessons) {{
                await prisma.lesson.upsert({{
                    where: {{
                        moduleId_orderIndex: {{
                            moduleId: module.id,
                            orderIndex: lesson.orderIndex
                        }}
                    }},
                    update: {{
                        title: lesson.title,
                        htmlContent: lesson.htmlContent,
                    }},
                    create: {{
                        moduleId: module.id,
                        title: lesson.title,
                        htmlContent: lesson.htmlContent,
                        orderIndex: lesson.orderIndex,
                    }}
                }});
                lessonCount++;
            }}
        }}
        
        console.log('✅ Modules:', moduleCount);
        console.log('✅ Lessons:', lessonCount);
        
        // Create marketing tags
        for (const tag of data.tags) {{
            await prisma.marketingTag.upsert({{
                where: {{ slug: tag.slug }},
                update: {{ name: tag.name }},
                create: {{
                    slug: tag.slug,
                    name: tag.name,
                    category: 'SUPPRESS',
                }}
            }});
        }}
        
        if (data.tags.length > 0) {{
            console.log('✅ Tags:', data.tags.length);
        }}
        
        console.log('\\n🎉 Import complete!');
        
    }} catch (error) {{
        console.error('❌ Import error:', error.message);
        process.exit(1);
    }} finally {{
        await prisma.$disconnect();
    }}
}}

main();
"""
            temp_script_path.write_text(script)
            
            # Run the import script
            result = subprocess.run(
                ['node', str(temp_script_path)],
                cwd=str(self.project_root),
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            print(result.stdout)
            if result.stderr:
                print(f"⚠️ {result.stderr}")
            
            return result.returncode == 0
            
        except subprocess.TimeoutExpired:
            print("❌ Import timed out")
            return False
        except Exception as e:
            print(f"❌ Import error: {e}")
            return False
        finally:
            # Cleanup temp files
            if temp_data_path.exists():
                temp_data_path.unlink()
            if temp_script_path.exists():
                temp_script_path.unlink()
    
    def dry_run(self) -> bool:
        """Prepare data and show what would be imported (no database changes)"""
        data = self.prepare_import_data()
        if not data:
            return False
        
        print(f"\n🔍 DRY RUN: {self.course_slug}")
        print("="*50)
        print(f"\n📚 Course:")
        print(f"   Title: {data['course']['title']}")
        print(f"   Slug: {data['course']['slug']}")
        print(f"   Price: ${data['course']['price'] / 100:.2f}")
        
        print(f"\n📦 Modules ({len(data['modules'])}):")
        for mod in data['modules']:
            print(f"   [{mod['tier']}] {mod['title']} ({len(mod['lessons'])} lessons)")
        
        print(f"\n🏷️ Tags ({len(data['tags'])}):")
        for tag in data['tags']:
            print(f"   - {tag['name']} ({tag['slug']})")
        
        total_lessons = sum(len(m['lessons']) for m in data['modules'])
        total_size = sum(len(l['htmlContent']) for m in data['modules'] for l in m['lessons'])
        
        print(f"\n📊 Summary:")
        print(f"   Total Modules: {len(data['modules'])}")
        print(f"   Total Lessons: {total_lessons}")
        print(f"   Total Content Size: {total_size // 1024 // 1024:.1f} MB")
        
        return True


def import_by_category(category: str):
    """Import all courses in a category"""
    courses_path = Path(__file__).parent.parent.parent / "courses"
    course_dirs = [d for d in courses_path.iterdir() if d.is_dir() and not d.name.startswith('.')]
    
    if not course_dirs:
        print("No courses found.")
        return
    
    # Filter by category if nomenclature is available
    matching_courses = []
    for course_dir in course_dirs:
        nom_path = course_dir / "nomenclature.json"
        if nom_path.exists():
            try:
                nom = json.loads(nom_path.read_text())
                if category.lower() in nom.get('category', '').lower():
                    matching_courses.append(course_dir.name)
            except:
                pass
    
    if not matching_courses:
        print(f"No courses found for category: {category}")
        return
    
    print(f"\n📂 Importing {len(matching_courses)} courses in category: {category}\n")
    
    for slug in sorted(matching_courses):
        importer = CourseImporter(slug)
        importer.import_to_database()
        print()


def import_all_courses():
    """Import all courses in the courses directory"""
    courses_path = Path(__file__).parent.parent.parent / "courses"
    course_dirs = [d for d in courses_path.iterdir() if d.is_dir() and not d.name.startswith('.')]
    
    if not course_dirs:
        print("No courses found.")
        return
    
    print(f"\n📂 Importing {len(course_dirs)} courses...\n")
    
    success = 0
    failed = 0
    
    for course_dir in sorted(course_dirs):
        importer = CourseImporter(course_dir.name)
        if importer.import_to_database():
            success += 1
        else:
            failed += 1
        print()
    
    print(f"\n📊 Import Summary:")
    print(f"   Success: {success}")
    print(f"   Failed: {failed}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python import.py <course-slug>")
        print("       python import.py --dry-run <course-slug>")
        print("       python import.py --category <category-name>")
        print("       python import.py --all")
        sys.exit(1)
    
    arg = sys.argv[1]
    
    if arg == '--all':
        import_all_courses()
    elif arg == '--category':
        if len(sys.argv) < 3:
            print("Error: Category name required")
            sys.exit(1)
        import_by_category(sys.argv[2])
    elif arg == '--dry-run':
        if len(sys.argv) < 3:
            print("Error: Course slug required")
            sys.exit(1)
        importer = CourseImporter(sys.argv[2])
        importer.dry_run()
    else:
        importer = CourseImporter(arg)
        success = importer.import_to_database()
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
