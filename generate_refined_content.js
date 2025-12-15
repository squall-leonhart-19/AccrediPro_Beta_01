const fs = require('fs');
const path = require('path');

// Paths
const BUYER_CSV = path.join(process.cwd(), 'mailadjust', 'BUYER QUALIFICATION - My branded typeform (1).csv');
const AVATAR_CSV = path.join(process.cwd(), 'student_avatars', 'students-profiles-imgs.csv');

// --- DATA ---
const firstNames = [
    "Sarah", "Jennifer", "Michelle", "Lisa", "Amanda", "Jessica", "Ashley", "Stephanie",
    "Nicole", "Elizabeth", "Heather", "Lauren", "Megan", "Christina", "Amy", "Melissa",
    "Rebecca", "Rachel", "Kimberly", "Angela", "Samantha", "Brittany", "Katherine", "Emily",
    "Danielle", "Amber", "Tiffany", "Vanessa", "Natalie", "Crystal", "Karen", "Nancy",
    "Susan", "Margaret", "Patricia", "Sandra", "Donna", "Carol", "Ruth", "Sharon",
    "Linda", "Barbara", "Maria", "Teresa", "Helen", "Anna", "Dorothy", "Gloria",
    "Victoria", "Cynthia", "Diana", "Deborah", "Paula", "Julie", "Laura", "Kelly",
    "Brenda", "Catherine", "Cheryl", "Christine", "Denise", "Janet", "Judy", "Martha",
    "Olivia", "Sophia", "Emma", "Ava", "Isabella", "Mia", "Charlotte", "Harper",
    "Evelyn", "Abigail", "Ella", "Scarlett", "Grace", "Lily", "Chloe", "Zoey",
    "Penelope", "Hannah", "Aria", "Aurora", "Savannah", "Audrey", "Brooklyn", "Bella",
    "Claire", "Skylar", "Lucy", "Paisley", "Caroline", "Genesis", "Kennedy", "Kinsley",
    "Allison", "Maya", "Madelyn", "Aubrey", "Addison", "Eleanor", "Stella", "Natalia",
    "Leah", "Hazel", "Violet", "Ellie", "Piper", "Nora", "Willow", "Ruby",
    "Emilia", "Layla", "Serenity", "Ivy", "Naomi", "Luna", "Sadie", "Jade"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
    "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts", "Phillips", "Evans", "Turner", "Parker", "Collins", "Edwards",
    "Stewart", "Morris", "Murphy", "Cook", "Rogers", "Morgan", "Peterson", "Cooper",
    "Reed", "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward", "Cox",
    "Diaz", "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray", "James",
    "Reyes", "Cruz", "Hughes", "Price", "Myers", "Long", "Foster", "Sanders",
    "Ross", "Morales", "Powell", "Sullivan", "Russell", "Ortiz", "Jenkins", "Gutierrez"
];

const winComments = [
    "Congratulations! That is such a huge milestone!",
    "So inspiring to see this. Keep it up!",
    "Wow, amazing work! You deserve it.",
    "This gives me so much motivation.",
    "Well done! The first of many.",
    "Incredible! How long did it take you?",
    "So happy for you!",
    "Yesss! Crushing it! 🔥",
    "Love seeing these wins.",
    "Big congrats! 🎉"
];

const gradComments = [
    "Welcome to the alumni family!",
    "Congratulations on getting certified!",
    "So proud of you! You did it!",
    "Can't wait to see what you do next.",
    "Huge accomplishment. Congrats!",
    "Way to go! 🎓",
    "The world needs more practitioners like you.",
    "Congrats! Time to change lives.",
    "Well done! Enjoy the moment.",
    "Welcome to the club!"
];

// --- HELPERS ---
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentField);
            if (currentRow.length > 1) rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(daysBack = 30) {
    const now = Date.now();
    const timeOffset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
    return new Date(now - timeOffset).toISOString();
}

// --- MAIN ---

// 1. Load Avatars
const avatarContent = fs.readFileSync(AVATAR_CSV, 'utf8');
const avatarUrls = avatarContent
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.startsWith('http'));

// 2. Load Buyer Personas
const buyerContent = fs.readFileSync(BUYER_CSV, 'utf8');
const buyerRows = parseCSV(buyerContent).slice(1);

// Extract Valid Stories
const validStories = [];
const originalNames = []; // store original names to reuse if needed, or mix

for (const row of buyerRows) {
    let story = row[5];
    if (story && story.length > 20) {
        story = story.replace(/\s+/g, ' ').trim();
        validStories.push(story);
        originalNames.push({ first: row[0], last: row[1] });
    }
}

console.log(`Found ${validStories.length} valid stories.`);

// We need 237+ comments for Introductions.
// We will loop through validStories.
const introComments = [];
const targetIntro = 245;

let avatarIndex = 0;
let storyIndex = 0;

while (introComments.length < targetIntro) {
    const story = validStories[storyIndex % validStories.length];

    // For specific iterations, vary the name to avoid obvious duplicates if looping
    let firstName, lastName;

    if (storyIndex < originalNames.length) {
        // Use original name for first pass
        firstName = originalNames[storyIndex].first;
        lastName = originalNames[storyIndex].last;
    } else {
        // Generate new name for recycled story
        firstName = getRandomItem(firstNames);
        lastName = getRandomItem(lastNames);
    }

    // Vary story slightly if recycled? (Optional, maybe just keep it simple)

    const avatar = avatarUrls[avatarIndex % avatarUrls.length];

    introComments.push({
        id: `intro-${introComments.length}`,
        content: story,
        createdAt: getRandomDate(14),
        parentId: null,
        author: {
            id: `user-intro-${introComments.length}`,
            firstName: firstName || "Student",
            lastName: lastName || "",
            avatar: avatar,
            role: "STUDENT"
        },
        likeCount: Math.floor(Math.random() * 30) + 2,
        isLiked: false,
        reactions: {
            "❤️": Math.floor(Math.random() * 10),
            "👏": Math.floor(Math.random() * 5)
        },
        userReactions: [],
        replies: []
    });

    avatarIndex++;
    storyIndex++;
}

// Comments for new posts (Wins/Grads) are NOT in the big map, 
// they need to be separate or we need to know the IDs of the new posts.
// The new posts were: `share-win-0` to `share-win-6` and `new-grad-0` to `new-grad-6`.

// We will creating a map: { "post-id": [comments...] }

const additionalComments = {};

// Wins
for (let i = 0; i < 7; i++) {
    const postId = `share-win-${i}`;
    const numComments = 4 + Math.floor(Math.random() * 6); // 4-9 comments
    const list = [];
    for (let j = 0; j < numComments; j++) {
        const avatar = avatarUrls[avatarIndex % avatarUrls.length];
        avatarIndex++;
        list.push({
            id: `win-c-${i}-${j}`,
            content: getRandomItem(winComments),
            createdAt: getRandomDate(2),
            parentId: null,
            author: {
                id: `u-win-${i}-${j}`,
                firstName: getRandomItem(firstNames),
                lastName: getRandomItem(lastNames),
                avatar: avatar,
                role: "STUDENT"
            },
            likeCount: Math.floor(Math.random() * 10),
            isLiked: false,
            reactions: { "❤️": Math.floor(Math.random() * 3) },
            userReactions: [],
            replies: []
        });
    }
    additionalComments[postId] = list;
}

// Grads
for (let i = 0; i < 7; i++) {
    const postId = `new-grad-${i}`;
    const numComments = 5 + Math.floor(Math.random() * 8); // 5-12 comments
    const list = [];
    for (let j = 0; j < numComments; j++) {
        const avatar = avatarUrls[avatarIndex % avatarUrls.length];
        avatarIndex++;
        list.push({
            id: `grad-c-${i}-${j}`,
            content: getRandomItem(gradComments),
            createdAt: getRandomDate(3),
            parentId: null,
            author: {
                id: `u-grad-${i}-${j}`,
                firstName: getRandomItem(firstNames),
                lastName: getRandomItem(lastNames),
                avatar: avatar,
                role: "STUDENT"
            },
            likeCount: Math.floor(Math.random() * 10),
            isLiked: false,
            reactions: { "🎉": Math.floor(Math.random() * 5) },
            userReactions: [],
            replies: []
        });
    }
    additionalComments[postId] = list;
}

const finalOutput = {
    "pinned-introductions": introComments,
    ...additionalComments
};

console.log(JSON.stringify(finalOutput, null, 2));
