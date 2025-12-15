const fs = require('fs');

// Read CSV (semicolon separated)
const csv = fs.readFileSync('buyerqualification.csv', 'utf-8');
const lines = csv.split('\n');

// Read avatar URLs
const avatarCSV = fs.readFileSync('student_avatars/students-profiles-imgs.csv', 'utf-8');
const avatarUrls = avatarCSV.split('\n').slice(1).filter(l => l.startsWith('http')).map(u => u.trim());

// Parse semicolon-separated values
function parseLine(line) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (let char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ';' && !inQuotes) { parts.push(current.trim()); current = ''; }
    else current += char;
  }
  parts.push(current.trim());
  return parts;
}

// Extract stories - skip header (0) and first 2 entries
const stories = [];
for (let i = 3; i < lines.length && stories.length < 245; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const cols = parseLine(line);
  const story = cols[2];
  if (story && story.length > 50) {
    let text = story.replace(/^"|"$/g, '').trim();
    if (text.length > 50) {
      // Escape for template literals
      text = text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\r?\n/g, ' ');
      stories.push(text);
    }
  }
}

// Shuffle avatars
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const shuffledAvatars = shuffle(avatarUrls);

// Sarah replies
const sarahReplies = [
  "Welcome to the community! So glad you're here.",
  "Love this! Can't wait to see your progress.",
  "You're going to do amazing things!",
  "This is exactly why we do what we do.",
  "So inspiring! Thank you for sharing.",
  "Welcome! You're in the right place.",
  "Your story resonates with so many here.",
  "Excited to have you on this journey!",
  "This community is lucky to have you!",
  "Can't wait to support you on this path."
];

// Build file
let output = `// Auto-generated community comments

export const INTRODUCTION_COMMENTS = [
`;

stories.forEach((story, idx) => {
  const avatar = shuffledAvatars[idx % shuffledAvatars.length];
  const hasSarahReply = Math.random() > 0.25;
  const sarahReply = sarahReplies[idx % sarahReplies.length];
  const month = Math.floor(Math.random() * 5) + 7;
  const day = Math.floor(Math.random() * 28) + 1;

  output += `  {
    id: "intro-${idx + 1}",
    author: {
      name: "Student ${String(idx + 1).padStart(3, '0')}",
      avatar: "${avatar}",
      role: "student" as const,
    },
    content: \`${story}\`,
    createdAt: new Date(2025, ${month}, ${day}),
    likes: ${Math.floor(Math.random() * 20) + 5},
`;
  if (hasSarahReply) {
    output += `    replies: [{
      id: "sarah-reply-${idx + 1}",
      author: {
        name: "Dr. Sarah Chen",
        avatar: "/instructor-1.png",
        role: "instructor" as const,
      },
      content: "${sarahReply}",
      createdAt: new Date(2025, ${month}, ${day + 1}),
      likes: ${Math.floor(Math.random() * 10) + 2},
    }],
`;
  } else {
    output += `    replies: [],
`;
  }
  output += `  },
`;
});

output += `];

`;

// Tips comments
const tipsComments = [
  "This!", "So true!", "Needed this today", "Love it", "Yes!", "Facts", "Exactly!", "Wow", "Perfect timing",
  "Thank you for this reminder!", "Printing this out for my wall", "Sharing with my clients today",
  "This changed my perspective", "Simple but powerful", "Bookmarking this one",
  "I needed to hear this today. Been struggling with imposter syndrome and this helps.",
  "This is why I love this community - real practical advice that works.",
  "Started implementing this yesterday and already seeing results!",
  "My clients are going to love this approach. Thank you!",
  "I was just talking to a colleague about this exact thing. The pressure to know everything before starting is what keeps so many people stuck.",
  "After 20 years in healthcare, I wish someone had told me this earlier. So many of us burn out trying to be perfect.",
  "This resonates so deeply with my journey. I spent years thinking I needed more certifications before I could help anyone.",
  "OMG this is EXACTLY what I needed! Thank you thank you thank you!",
  "YESSS! Finally someone says it! This community is the best!",
  "I literally screenshot this and sent it to 5 friends. So good!",
  "How do you handle clients who expect you to have all the answers though?",
  "This is great but what about the imposter syndrome that comes with it?",
  "Any tips for applying this when you are just starting out?",
  "My perfectionist brain needed to read this about 47 times lol",
  "Tell that to my anxiety! But seriously, this helps.",
  "Printing this and putting it on my forehead so I remember",
  "Taking action on this TODAY. No more excuses.",
  "Just booked my first client after reading this. Here we go!",
  "This gave me the push I needed to finally launch my practice."
];

const sarahTipsReplies = [
  "So glad this resonated with you!",
  "You've got this!",
  "Keep us posted on your progress!",
  "That's the spirit!",
  "Love seeing this energy!",
  "Proud of you for taking action!",
  "This community is here for you!",
  "Your clients are lucky to have you!",
  "That's exactly the right mindset!",
  "Celebrating this win with you!"
];

output += `export const TIPS_COMMENTS = [
`;

for (let i = 0; i < 67; i++) {
  const avatar = shuffledAvatars[(i + 100) % shuffledAvatars.length];
  const commentText = tipsComments[i % tipsComments.length];
  const hasSarahReply = Math.random() > 0.25;
  const sarahReply = sarahTipsReplies[i % sarahTipsReplies.length];
  const month = Math.floor(Math.random() * 5) + 7;
  const day = Math.floor(Math.random() * 28) + 1;

  output += `  {
    id: "tips-comment-${i + 1}",
    author: {
      name: "Student ${String(i + 1).padStart(3, '0')}",
      avatar: "${avatar}",
      role: "student" as const,
    },
    content: "${commentText}",
    createdAt: new Date(2025, ${month}, ${day}),
    likes: ${Math.floor(Math.random() * 25) + 3},
`;
  if (hasSarahReply) {
    output += `    replies: [{
      id: "sarah-tips-reply-${i + 1}",
      author: {
        name: "Dr. Sarah Chen",
        avatar: "/instructor-1.png",
        role: "instructor" as const,
      },
      content: "${sarahReply}",
      createdAt: new Date(2025, ${month}, ${day + 1}),
      likes: ${Math.floor(Math.random() * 8) + 1},
    }],
`;
  } else {
    output += `    replies: [],
`;
  }
  output += `  },
`;
}

output += `];

export function getSampleComments(postId: string, category?: string) {
  if (postId === 'pinned-introductions') {
    return INTRODUCTION_COMMENTS;
  }
  if (postId.startsWith('tips-daily-')) {
    return TIPS_COMMENTS;
  }
  return [];
}
`;

fs.writeFileSync('/Users/pochitino/Desktop/accredipro-lms/src/components/community/post-detail-data.ts', output);
console.log('Generated', stories.length, 'intro comments and 67 tips comments');
