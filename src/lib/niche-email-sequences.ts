/**
 * Niche Email Sequences — Templatized Email Generator
 * 
 * Generates 13 niche-specific emails per diploma from the blueprint JSONs:
 *   - 6 Pre-Completion (0–48h) — Get them to FINISH
 *   - 7 LT Nurture (7–90d) — Value + soft pitch to Practitioner Certification
 * 
 * ENGAGEMENT STRATEGY:
 *   - "Re:" threading on every subject for Gmail Primary inbox
 *   - Every email asks for a REPLY (boosts sender reputation)
 *   - Circle Pod community mentioned in every nurture email
 *   - Plain text "Sarah" voice — no HTML, no buttons, no images
 *   - Curiosity-gap subject lines (short, lowercase, personal)
 *   - Pattern interrupts (one-liners, questions, voice notes)
 * 
 * All content pulls from src/data/niche-blueprints/{niche-id}.json
 * Offer: $297 Scholarship → {Niche} Practitioner Certification
 * Checkout: https://www.fanbasis.com/agency-checkout/AccrediPro/BNJkW
 */

// ═══════════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════════

export interface NicheEmailTemplate {
    order: number;
    subject: string;
    content: string;
    delayDays: number;
    delayHours: number;
}

export interface NicheBlueprint {
    niche: {
        id: string;
        slug: string;
        displayName: string;
        tagline: string;
        credentialTitle: string;
        practiceType: string;
    };
    certification: {
        name: string;
        scholarshipPrice: number;
        fullPrice: number;
        checkoutUrl: string;
        scholarshipLabel: string;
    };
    method: {
        name: string;
        acronym: string;
        fullTitle: string;
        description: string;
        steps: { letter: string; word: string; title: string; description: string }[];
    };
    lessons: {
        id: number;
        title: string;
        subtitle: string;
        sections: string[];
    }[];
    zombie: {
        name: string;
        age: number;
        backstory: string;
        transformation: string;
        incomeStory: string;
    };
    sarah: {
        credentials: string;
        storySnippet: string;
    };
}

// ═══════════════════════════════════════════════════════════════════
//  BLUEPRINT LOADER
// ═══════════════════════════════════════════════════════════════════

import fmBlueprint from "@/data/niche-blueprints/functional-medicine.json";
import shBlueprint from "@/data/niche-blueprints/spiritual-healing.json";
import ehBlueprint from "@/data/niche-blueprints/energy-healing.json";
import reikiBlueprint from "@/data/niche-blueprints/reiki-healing.json";

const BLUEPRINTS: Record<string, NicheBlueprint> = {
    "functional-medicine": fmBlueprint as unknown as NicheBlueprint,
    "spiritual-healing": shBlueprint as unknown as NicheBlueprint,
    "energy-healing": ehBlueprint as unknown as NicheBlueprint,
    "reiki-healing": reikiBlueprint as unknown as NicheBlueprint,
};

export function getBlueprint(nicheId: string): NicheBlueprint | null {
    return BLUEPRINTS[nicheId] || null;
}

export function getAllNicheIds(): string[] {
    return Object.keys(BLUEPRINTS);
}

// ═══════════════════════════════════════════════════════════════════
//  PRE-COMPLETION SEQUENCE (6 emails, 0–48h)
//  Goal: Get them to FINISH the Mini Diploma
//
//  TACTICS:
//  - "Re:" prefix on all follow-ups for thread continuity
//  - Every email ends with a question or reply trigger
//  - Short paragraphs, one idea per email
//  - Zombie stories create "that could be me" feeling
//  - Countdown urgency in later emails
// ═══════════════════════════════════════════════════════════════════

export function generatePreCompletionEmails(bp: NicheBlueprint): NicheEmailTemplate[] {
    const { niche, method, zombie, certification, lessons } = bp;
    const lessonUrl = `https://learn.accredipro.academy/${niche.slug}/lesson/1`;
    const communityUrl = `https://learn.accredipro.academy/portal/${niche.id}/circle`;

    return [
        // ─────────────────────────────────────────────────
        // EMAIL 1: Welcome (Instant)
        // Strategy: Excitement + clear next step + community intro
        // ─────────────────────────────────────────────────
        {
            order: 0,
            subject: "you're in 🎉 (start here)",
            delayDays: 0,
            delayHours: 0,
            content: `Hey {{firstName}},

You're in. Your ${niche.displayName} Mini Diploma is ready.

Before you do anything else — start Lesson 1. It takes 5 minutes: ${lessonUrl}

Seriously. 5 minutes. Most people open it "just to peek" and finish the whole thing in one sitting.

Here's the deal:

→ 3 lessons. 48 hours. Pass the exam. Get your certificate.
→ 89% of our students finish the same day they start.
→ After you finish, you'll unlock a scholarship for the ${certification.name} that I don't offer publicly.

One more thing — I set up a private community just for students like you. It's where our graduates share wins, ask questions, and support each other.

Join when you're ready: ${communityUrl}

But first: Lesson 1.

${lessonUrl}

Talk soon,

Sarah

P.S. Quick question — what made you sign up today? I'm genuinely curious. Just hit reply and tell me in one sentence. I read every single one.`,
        },

        // ─────────────────────────────────────────────────
        // EMAIL 2: Zombie Proof Story (+4h)
        // Strategy: If-she-can-I-can story + reply trigger
        // ─────────────────────────────────────────────────
        {
            order: 1,
            subject: `Re: you're in 🎉 (quick story about ${zombie.name})`,
            delayDays: 0,
            delayHours: 4,
            content: `Hey {{firstName}},

Quick story.

${zombie.name} signed up just like you did. Same page. Same moment of curiosity.

${zombie.backstory}

She almost didn't start. "I'll do it tomorrow," she told herself.

But she opened Lesson 1 at 9pm that night. Just to peek.

${zombie.transformation}

${zombie.incomeStory}

Her exact words to me: "I almost closed the tab that first night. Thank God I didn't."

You're one click away from your own ${zombie.name} story: ${lessonUrl}

— Sarah

P.S. What's YOUR story? Are you a career changer, a curious learner, or something else entirely? Reply and tell me — I love hearing what brings people here.`,
        },

        // ─────────────────────────────────────────────────
        // EMAIL 3: Method Teaser (+12h)
        // Strategy: Teach one concept to create "I need more" feeling
        // ─────────────────────────────────────────────────
        {
            order: 2,
            subject: "Re: the thing about Lesson 2 nobody expects",
            delayDays: 0,
            delayHours: 12,
            content: `{{firstName}},

Can I tell you something about Lesson 2?

There's a framework in there called the ${method.name}.

${method.acronym} — ${method.steps.map(s => s.word).join(", ")}.

When I first developed it, even I was surprised by how it changed the way practitioners work with clients. It's not what you'd expect.

But here's the thing — I can't really explain it in an email. It's one of those "you have to experience it" moments.

What I CAN tell you: every single one of our successful graduates says the ${method.name} was the turning point.

${method.description}

You're about 20 minutes away from that moment: ${lessonUrl}

Have you started yet? If something's holding you back, just reply and tell me. No judgment. I've heard it all.

— Sarah`,
        },

        // ─────────────────────────────────────────────────
        // EMAIL 4: Pattern Interrupt — Short & Personal (+24h)
        // Strategy: Ultra-short email = higher read rate
        // ─────────────────────────────────────────────────
        {
            order: 3,
            subject: "Re: hey {{firstName}}, quick question",
            delayDays: 1,
            delayHours: 0,
            content: `{{firstName}},

Be honest with me.

Are you going to finish the Mini Diploma?

I'm not asking to pressure you. I'm asking because I've seen the pattern a hundred times:

Someone signs up → gets excited → life happens → they never start → the access expires → they regret it.

I don't want that to be you.

You've got about 24 hours left. The lessons take maybe 45 minutes total.

If you're in — go finish: ${lessonUrl}

If something's holding you back — reply to this email and tell me what it is. I'll help.

Seriously. One sentence. What's stopping you?

— Sarah`,
        },

        // ─────────────────────────────────────────────────
        // EMAIL 5: Community Social Proof (+36h)
        // Strategy: Show activity happening without them + FOMO
        // ─────────────────────────────────────────────────
        {
            order: 4,
            subject: "re: 3 people just posted in the community about this",
            delayDays: 1,
            delayHours: 12,
            content: `{{firstName}},

Something cool happened in our private community today.

Three students just posted about finishing their Mini Diploma. One said:

"I literally cried when I got my certificate. I've been wanting to do this for YEARS."

Another wrote:

"The ${method.name} changed how I see everything. Why didn't anyone teach me this sooner?"

And ${zombie.name} replied: "Welcome to the club 😭❤️ It only gets better from here."

These women are where you're about to be. They're celebrating. They're supporting each other. They're planning their next steps.

<strong>Your spot in the community is waiting.</strong> But you need to finish first.

12 hours left, {{firstName}}.

Finish now: ${lessonUrl}

— Sarah

P.S. When you finish, post in the community. I want to celebrate with you. 🎉`,
        },

        // ─────────────────────────────────────────────────
        // EMAIL 6: Final — Real Deadline (+44h)
        // Strategy: Honest urgency + no manipulation
        // ─────────────────────────────────────────────────
        {
            order: 5,
            subject: "re: closing your access in 4 hours",
            delayDays: 1,
            delayHours: 20,
            content: `{{firstName}},

Not a marketing trick. Not a fake countdown.

Your ${niche.displayName} Mini Diploma access expires in 4 hours.

After that:
→ The lessons lock
→ The exam disappears
→ The ${certification.name} scholarship? Gone.

I set the 48-hour window on purpose. Because "someday" = never. I've watched it happen too many times.

You have two options:

Option A: Close this email. Go back to scrolling. Tell yourself you'll find something else later.

Option B: Take 45 minutes. Finish the 3 lessons. Pass the exam. Get your certificate. Join the community. See what's on the other side.

2,400+ women chose Option B. Their lives look different now.

${lessonUrl}

4 hours.

— Sarah

P.S. If something legit came up and you need more time, reply right now. Tell me what happened. I'm a real person and I'll see what I can do. But I need to hear from you BEFORE the deadline.`,
        },
    ];
}

// ═══════════════════════════════════════════════════════════════════
//  LONG-TERM NURTURE SEQUENCE (7 emails, Day 7–90)
//  Goal: Stay top of mind, build relationship, drive to $297 cert
//
//  TACTICS:
//  - Every email asks for a REPLY (trains Gmail to show in Primary)
//  - Circle Pod community referenced in every email
//  - Mix of value, story, check-in, resource, soft pitch
//  - "Re:" threading for continuity
//  - A/B/C/D poll in Day 30 email for engagement
//  - Day 90 "list cleanup" creates fear of missing out
// ═══════════════════════════════════════════════════════════════════

export function generateLTNurtureEmails(bp: NicheBlueprint): NicheEmailTemplate[] {
    const { niche, method, zombie, certification } = bp;
    const checkoutUrl = certification.checkoutUrl;
    const certName = certification.name;
    const communityUrl = `https://learn.accredipro.academy/portal/${niche.id}/circle`;

    return [
        // ─────────────────────────────────────────────────
        // LT-1: Day 7 — Value Bomb + Reply Hook
        // Strategy: Teach something genuinely useful, make them reply
        // ─────────────────────────────────────────────────
        {
            order: 0,
            subject: "re: the biggest mistake I see (and I see it a LOT)",
            delayDays: 7,
            delayHours: 0,
            content: `{{firstName}},

Can I be real with you for a sec?

I've mentored over 2,400 ${niche.displayName.toLowerCase()} practitioners. And the #1 mistake I see — especially early on — is this:

They try to help everyone.

"I can help with stress, trauma, energy, relationships, confidence, sleep..."

That's not a specialty. That's a menu.

Here's the truth: clients don't hire generalists. They hire the person who says "I help burnt-out moms reconnect with their energy" or "I specialize in grief recovery for women over 40."

<strong>Specificity = credibility = clients.</strong>

One of our graduates, ${zombie.name}, niched down to ONE type of client. Within months, word spread. Referrals came in. She never had to "sell" herself.

Meanwhile, her classmate who tried to help "everyone"? Still struggling.

Quick question: if you HAD to pick just one specific person you'd love to help, who would it be?

Reply and tell me. I might have a suggestion for you.

— Sarah

P.S. A few students just shared their niching stories in the community — really inspiring stuff: ${communityUrl}`,
        },

        // ─────────────────────────────────────────────────
        // LT-2: Day 14 — Success Story + Community Push
        // Strategy: Zombie story that makes them see themselves
        // ─────────────────────────────────────────────────
        {
            order: 1,
            subject: `re: "${zombie.name} just posted this in the group"`,
            delayDays: 14,
            delayHours: 0,
            content: `{{firstName}},

I have to share this.

${zombie.name} posted in our community yesterday:

"6 months ago I was scrolling through free courses at midnight, wondering if I'd ever actually DO something about this feeling. Today I had my 3rd client call this week. I literally cannot believe this is my life."

I'm sharing this because ${zombie.name}'s starting point was EXACTLY where you are right now.

She completed the Mini Diploma. She was curious but scared. She didn't know if she was "qualified enough" or if anyone would actually pay her.

${zombie.transformation}

${zombie.incomeStory}

The difference between ${zombie.name} and everyone else? She started. That's it.

Your Mini Diploma certificate is a real credential. You can start having conversations TODAY.

But if you want to go deeper — the ${certName} scholarship is still available to graduates like you. Just $${certification.scholarshipPrice} (was $${certification.fullPrice}): ${checkoutUrl}

Have you been back to the community lately? There's some really good discussions happening: ${communityUrl}

— Sarah

P.S. If you've already started having conversations with potential clients, reply and tell me about it! I want to hear. If you haven't — reply and tell me what's stopping you. Either way, I want to hear from you.`,
        },

        // ─────────────────────────────────────────────────
        // LT-3: Day 21 — Behind the Scenes (Aspiration)
        // Strategy: Paint the "day in the life" picture they want
        // ─────────────────────────────────────────────────
        {
            order: 2,
            subject: "re: my actual schedule this week (spoiler: I worked 15 hours)",
            delayDays: 21,
            delayHours: 0,
            content: `{{firstName}},

I don't normally share this. But a student asked me last week what my schedule actually looks like, and I thought you'd want to know too.

Here's my actual week:

Monday → 3 virtual client sessions (60 min each)
Tuesday → content day (I batch everything)
Wednesday → 4 client sessions
Thursday → mentorship calls with certified graduates
Friday → OFF (hiking, daughter time, zero work)

Total hours worked: ~15
Total client hours: ~7

The rest? Admin, community engagement, and... honestly? Living my life.

I'm not saying this to flex. I'm saying it because THIS IS WHAT'S POSSIBLE.

Not in 5 years. Not "maybe someday." This is what our certified graduates build within 6-12 months.

${zombie.name} started seeing this kind of freedom at month 4. She told me: "I used to think flexibility meant being able to leave work at 5:15 instead of 5:00. Now I set my own hours and make more money."

That's what the ${method.name} framework gives you — not just skills, but a real PRACTICE.

Does this kind of schedule interest you? Reply and tell me what your ideal week would look like. I'm curious.

And if you haven't checked the community recently, you should — some graduates are sharing their own schedules: ${communityUrl}

— Sarah`,
        },

        // ─────────────────────────────────────────────────
        // LT-4: Day 30 — Interactive Check-in (A/B/C/D Poll)
        // Strategy: Get a reply no matter what — the options make it easy
        // ─────────────────────────────────────────────────
        {
            order: 3,
            subject: "re: 30-day check in (reply with A, B, C, or D)",
            delayDays: 30,
            delayHours: 0,
            content: `{{firstName}},

One month since you finished the Mini Diploma. 🎉

I check in with all my graduates around this time. Takes 2 seconds.

<strong>Where are you right now?</strong>

A → "Still thinking about it. Haven't taken action yet."

B → "I've started talking to people. Getting some interest."

C → "I'm stuck. Don't know what to do next."

D → "I've moved on. This isn't for me right now."

Just reply with the letter. That's it. One letter.

Here's why I ask:

If you're at <strong>A</strong> → I'll share the exact first step that got ${zombie.name} unstuck
If you're at <strong>B</strong> → I'll tell you how to convert those conversations into paying clients
If you're at <strong>C</strong> → I'll personally help you figure out your next move
If you're at <strong>D</strong> → No hard feelings. I'll stop emailing. We're good.

Either way, I genuinely want to know. You're not just a name on a list to me.

Reply with your letter.

— Sarah

P.S. If you're somewhere between letters, just tell me in your own words. I read every single reply.

P.P.S. Have you been in the community? Some A's have turned into B's just from reading other people's stories: ${communityUrl}`,
        },

        // ─────────────────────────────────────────────────
        // LT-5: Day 45 — Free Resource + Soft Pitch
        // Strategy: Give something valuable, then mention cert naturally
        // ─────────────────────────────────────────────────
        {
            order: 4,
            subject: "re: free 30-day plan I forgot to send you",
            delayDays: 45,
            delayHours: 0,
            content: `{{firstName}},

I owe you an apology.

I should have sent you this 44 days ago. It's the exact 30-day client attraction plan I give to my certified graduates:

Day 1 → Update your social bio to include your ${niche.displayName.toLowerCase()} specialty
Day 7 → Post your certification announcement (yes, your Mini Diploma counts!)
Day 14 → Share a transformation story (even your own journey counts)
Day 21 → Make your first "I'm accepting clients" post
Day 30 → Follow up with everyone who engaged

That's it. No funnel. No website. No ads. Just 5 actions over 30 days.

${zombie.name} followed this exact plan. Her first client came from Step 4.

<strong>You can start this TODAY with the credential you already have.</strong>

And if you want to accelerate things — the ${certName} scholarship gives you mentorship, a done-for-you website, and a full certification. Just $${certification.scholarshipPrice} (scholarship applied): ${checkoutUrl}

But honestly? Start with the 30-day plan first. See what happens. Then decide.

Have you tried any of these steps yet? Reply and tell me which one scares you most — I'll help you with it.

— Sarah

P.S. Some of our graduates shared their announcement posts in the community. Great inspiration if you need ideas: ${communityUrl}`,
        },

        // ─────────────────────────────────────────────────
        // LT-6: Day 60 — Direct but Warm Pitch
        // Strategy: "I'm not going to dance around it" honesty
        // ─────────────────────────────────────────────────
        {
            order: 5,
            subject: "re: can I be honest with you for a second?",
            delayDays: 60,
            delayHours: 0,
            content: `{{firstName}},

I'm going to be direct.

It's been two months since you completed the ${niche.displayName} Mini Diploma.

In that same time:
→ ${zombie.name} went from "just curious" to earning real income
→ 47 graduates posted wins in our community this month
→ 12 new practitioners launched their first packages

And you? I don't know where you are. That's why I'm writing.

I'm not going to dance around it: the ${certName} scholarship is still available to you at $${certification.scholarshipPrice}. That's 70% off the regular price.

But more importantly than the price — here's what I've learned in 20+ years:

<strong>The longer you wait, the harder it gets.</strong>

Not because it gets harder. But because the VOICE gets louder. You know the one.

"Maybe later."
"I'm not ready."
"Who am I to do this?"

${zombie.name} heard that voice too. She told me: "I wasted months being scared of something that wasn't even scary."

If this is still on your heart, {{firstName}}, stop thinking about it. Start: ${checkoutUrl}

If it's NOT on your heart anymore — reply and tell me. I'll respect it.

But if it IS... reply and tell me that too. Sometimes just saying it out loud makes it real.

— Sarah

P.S. The community is still here for you whenever you're ready: ${communityUrl}`,
        },

        // ─────────────────────────────────────────────────
        // LT-7: Day 90 — "Last Email" (List Cleanup FOMO)
        // Strategy: Fear of loss + easy reply to stay + final cert mention
        // ─────────────────────────────────────────────────
        {
            order: 6,
            subject: "re: removing you from my list (unless you reply)",
            delayDays: 90,
            delayHours: 0,
            content: `{{firstName}},

This is my last email to you.

Not a marketing tactic. Here's what's happening:

I'm cleaning up my email list. You completed the ${niche.displayName} Mini Diploma 3 months ago. Since then, I've sent you value, stories, resources, and check-ins.

You haven't replied.

And that's okay. Maybe the timing wasn't right. Maybe ${niche.displayName.toLowerCase()} isn't your thing. Maybe you're just busy.

Whatever the reason — I don't want to keep showing up in your inbox if you've moved on.

<strong>So here's the deal:</strong>

If you want to STAY on my list → just reply "STAY"
If you want me to stop emailing → do nothing (I'll remove you in 7 days)

That's it. One word.

But before you decide, I want you to know:

The community is still here: ${communityUrl}
Your Mini Diploma certificate is still valid.
The ${certName} scholarship is still available at $${certification.scholarshipPrice}: ${checkoutUrl}

And most importantly — I'm still here. Still rooting for you. Still believing you can do this.

Even if you don't reply, I want you to know that.

Whatever you choose,

— Sarah

P.S. The graduates who reply "STAY" are the ones who eventually succeed. Just saying. 💛`,
        },
    ];
}

// ═══════════════════════════════════════════════════════════════════
//  COMBINED GENERATOR — All 13 emails for a niche
// ═══════════════════════════════════════════════════════════════════

export interface NicheSequenceSet {
    nicheId: string;
    nicheName: string;
    preCompletion: NicheEmailTemplate[];
    ltNurture: NicheEmailTemplate[];
}

export function generateAllEmailsForNiche(nicheId: string): NicheSequenceSet | null {
    const bp = getBlueprint(nicheId);
    if (!bp) return null;

    return {
        nicheId: bp.niche.id,
        nicheName: bp.niche.displayName,
        preCompletion: generatePreCompletionEmails(bp),
        ltNurture: generateLTNurtureEmails(bp),
    };
}

export function generateAllNicheEmails(): NicheSequenceSet[] {
    return getAllNicheIds()
        .map(id => generateAllEmailsForNiche(id))
        .filter(Boolean) as NicheSequenceSet[];
}

// ═══════════════════════════════════════════════════════════════════
//  SEQUENCE HQ IMPORT CONFIG
//  Used by the import API to create sequences in the database
// ═══════════════════════════════════════════════════════════════════

export function getSequenceImportConfigs(nicheId: string) {
    const emails = generateAllEmailsForNiche(nicheId);
    if (!emails) return [];

    return [
        {
            slug: `${nicheId}-pre-completion`,
            name: `${emails.nicheName}: Pre-Completion`,
            description: `Get ${emails.nicheName} Mini Diploma leads to finish within 48 hours`,
            triggerType: "MINI_DIPLOMA_STARTED",
            courseCategory: "MINI_DIPLOMA",
            emails: emails.preCompletion,
        },
        {
            slug: `${nicheId}-lt-nurture`,
            name: `${emails.nicheName}: Long-Term Nurture`,
            description: `Value-first nurture for ${emails.nicheName} graduates (Day 7–90) — soft pitch to $${emails.preCompletion.length > 0 ? "297" : "297"} certification`,
            triggerType: "MINI_DIPLOMA_COMPLETED",
            courseCategory: "MINI_DIPLOMA",
            emails: emails.ltNurture,
        },
    ];
}
