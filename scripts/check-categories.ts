import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Checking Categories...");
  const categories = await prisma.category.findMany();
  console.log(categories);

  console.log("\nChecking CommunityPosts Categories (distinct)...");
  const posts = await prisma.communityPost.findMany({
    select: { categoryId: true },
    distinct: ['categoryId']
  });
  console.log(posts.map(p => p.categoryId));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
