import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Convert markdown-style content to HTML
function convertToHtml(content: string): string {
  let html = content;

  // Convert **bold** to <strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* to <em>
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Convert ## headers to <h3>
  html = html.replace(/^## (.+)$/gm, '<h3 class="text-lg font-bold text-burgundy-800 mt-4 mb-2">$1</h3>');

  // Convert - bullet points to proper list items
  // First, find consecutive lines starting with -
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> items in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul class="list-disc list-inside space-y-1 my-3 text-gray-700">${match}</ul>`;
  });

  // Convert numbered lists (1. 2. 3.)
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Convert ✅ checkmarks to styled items
  html = html.replace(/^✅ (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-green-600">✅</span><span>$1</span></div>');

  // Convert double newlines to paragraph breaks
  html = html.replace(/\n\n/g, '</p><p class="my-3">');

  // Convert single newlines to <br/>
  html = html.replace(/\n/g, '<br/>');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<p') && !html.startsWith('<h')) {
    html = `<p class="my-3">${html}</p>`;
  }

  // Clean up empty paragraphs
  html = html.replace(/<p class="my-3"><\/p>/g, '');
  html = html.replace(/<p class="my-3"><br\/><\/p>/g, '');

  // Fix nested paragraphs
  html = html.replace(/<p class="my-3"><p class="my-3">/g, '<p class="my-3">');
  html = html.replace(/<\/p><\/p>/g, '</p>');

  return html;
}

async function main() {
  console.log('🔄 Converting all coaching tips to proper HTML...\n');

  const posts = await prisma.communityPost.findMany({
    where: { categoryId: 'coaching-tips' },
    select: { id: true, title: true, content: true }
  });

  console.log(`Found ${posts.length} coaching tips posts\n`);

  let updated = 0;

  for (const post of posts) {
    // Check if content already has HTML tags (properly formatted)
    const hasProperHtml = post.content.includes('<p>') && !post.content.includes('**');

    if (hasProperHtml) {
      console.log(`✓ Already HTML: ${post.title.substring(0, 50)}...`);
      continue;
    }

    // Convert markdown to HTML
    const htmlContent = convertToHtml(post.content);

    await prisma.communityPost.update({
      where: { id: post.id },
      data: { content: htmlContent }
    });

    console.log(`✅ Converted: ${post.title.substring(0, 50)}...`);
    updated++;
  }

  console.log(`\n✅ Done! Updated ${updated} posts to HTML format.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
