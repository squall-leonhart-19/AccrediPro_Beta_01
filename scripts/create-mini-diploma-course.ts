#!/usr/bin/env npx ts-node

/**
 * Create Mini Diploma Course in Database
 * 
 * Usage:
 *   npx ts-node scripts/create-mini-diploma-course.ts --slug spiritual-healing-mini-diploma --name "Spiritual Healing"
 * 
 * This script creates the course entry needed for the mini diploma to work.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// Initialize Prisma with driver adapter (Prisma 7 requirement)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function createMiniDiplomaCourse(slug: string, name: string) {
    console.log(`\n🎓 Creating Mini Diploma Course: ${name}`);
    console.log(`   Slug: ${slug}\n`);

    // Check if course already exists
    const existing = await prisma.course.findFirst({
        where: { slug }
    });

    if (existing) {
        console.log(`✅ Course already exists with ID: ${existing.id}`);
        return existing;
    }

    // Create the course
    const course = await prisma.course.create({
        data: {
            title: `${name} Mini Diploma`,
            slug: slug,
            description: `Free ${name} mini diploma - complete 9 lessons to earn your certificate.`,
            price: 0, // Mini diplomas are free
            isFree: true,
            isPublished: true,
        }
    });

    console.log(`✅ Course created successfully!`);
    console.log(`   ID: ${course.id}`);
    console.log(`   Title: ${course.title}`);
    console.log(`   Slug: ${course.slug}`);
    console.log(`   Published: ${course.isPublished}`);

    return course;
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    let slug = "";
    let name = "";

    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--slug" && args[i + 1]) {
            slug = args[i + 1];
            i++;
        } else if (args[i] === "--name" && args[i + 1]) {
            name = args[i + 1];
            i++;
        }
    }

    return { slug, name };
}

async function main() {
    const { slug, name } = parseArgs();

    if (!slug || !name) {
        console.error(`
❌ Missing required arguments

Usage:
  npx ts-node scripts/create-mini-diploma-course.ts --slug <course-slug> --name "<Course Name>"

Example:
  npx ts-node scripts/create-mini-diploma-course.ts --slug spiritual-healing-mini-diploma --name "Spiritual Healing"
        `);
        process.exit(1);
    }

    try {
        await createMiniDiplomaCourse(slug, name);
    } catch (error) {
        console.error("❌ Error creating course:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
