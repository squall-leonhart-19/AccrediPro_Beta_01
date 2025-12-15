const fs = require('fs');
const path = require('path');

const REFINED_COMMENTS_FILE = path.join(process.cwd(), 'refined_comments.json');
const POST_DETAIL_CLIENT = path.join(process.cwd(), 'src/components/community/post-detail-client.tsx');

function formatObject(obj, indent = 2) {
    const spaces = ' '.repeat(indent);
    if (typeof obj === 'string') {
        if (obj.startsWith('new Date')) return obj;
        return JSON.stringify(obj);
    }
    if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);

    if (Array.isArray(obj)) {
        const items = obj.map(item => formatObject(item, indent + 2)).join(',\n' + spaces + '  ');
        return `[\n${spaces}  ${items}\n${spaces}]`;
    }

    const entries = Object.entries(obj).map(([key, value]) => {
        const k = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
        return `${spaces}  ${k}: ${formatObject(value, indent + 2)}`;
    }).join(',\n');

    return `{\n${entries}\n${spaces}}`;
}

try {
    console.log("Injecting refined comments...");
    // Read JSON
    const rawContent = fs.readFileSync(REFINED_COMMENTS_FILE, 'utf8');
    const jsonStartIndex = rawContent.indexOf('{');
    if (jsonStartIndex === -1) throw new Error("No JSON object found in refined comments file");

    const jsonContent = rawContent.substring(jsonStartIndex);
    const commentsData = JSON.parse(jsonContent);

    // Fix dates (recursive? No, map is flat-ish)
    // Structure: { "pinned-introductions": [...], "share-win-0": [...], ... }

    Object.keys(commentsData).forEach(key => {
        commentsData[key].forEach(c => {
            c.createdAt = `new Date("${c.createdAt}")`;
        });
    });

    const targetContent = fs.readFileSync(POST_DETAIL_CLIENT, 'utf8');

    // We want to replace `const SAMPLE_COMMENTS: Record<string, Comment[]> = { ... };` entirely?
    // Or just the content inside `{ ... }`.

    // Let's find `const SAMPLE_COMMENTS: Record<string, Comment[]> = {`
    const declStart = 'const SAMPLE_COMMENTS: Record<string, Comment[]> = {';
    const startIndex = targetContent.indexOf(declStart);

    if (startIndex === -1) throw new Error("Could not find SAMPLE_COMMENTS declaration");

    // We assume the object ends before `export default function`.
    // Or we can just count braces?
    // Let's rely on the fact that `/*` or `export` usually follows.

    // Actually, let's keep it safe. "pinned-introductions" was the first key.
    // The previous injection worked by replacing inside keys.
    // Now we want to replace the whole object content, or append new keys.

    // Let's just create the WHOLE object string and replace the block.
    // How to find the end?
    // Start index + length of declStart.
    // Use a brace counter to find matching closing brace.

    let braceCount = 1;
    let i = startIndex + declStart.length;
    while (braceCount > 0 && i < targetContent.length) {
        if (targetContent[i] === '{') braceCount++;
        else if (targetContent[i] === '}') braceCount--;
        i++;
    }

    if (braceCount !== 0) throw new Error("Could not find end of SAMPLE_COMMENTS object");

    const endIndex = i; // This is the index AFTER the closing brace `}`

    const newObjectContent = formatObject(commentsData, 2);
    // formatObject returns `{\n ... \n  }`

    const pre = targetContent.substring(0, startIndex);
    const post = targetContent.substring(endIndex);

    // Construct new file content
    const newFileContent = pre +
        `const SAMPLE_COMMENTS: Record<string, Comment[]> = ${newObjectContent}` +
        post;

    fs.writeFileSync(POST_DETAIL_CLIENT, newFileContent);
    console.log("Successfully replaced SAMPLE_COMMENTS.");

} catch (err) {
    console.error("Error:", err.message);
}
