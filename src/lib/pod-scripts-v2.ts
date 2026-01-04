/**
 * Pod Scripts System v2
 * 30-Day Humanized Scripts for Functional Medicine Pod
 * Matches docs/pod-scripts/*.md content
 */

export type SenderType = "coach" | "leader" | "struggler" | "questioner" | "buyer";

export interface PodScriptMessage {
    id: string;
    dayOffset: number;
    senderType: SenderType;
    senderName: string;
    delayMinutes: number; // Minutes after day start
    content: string;
    offerTag?: string;
}

// Character mapping
export const POD_CHARACTERS = {
    coach: { name: "Sarah M.", type: "coach" as SenderType },
    gina: { name: "Gina T.", type: "leader" as SenderType },
    amber: { name: "Amber L.", type: "leader" as SenderType },
    cheryl: { name: "Cheryl W.", type: "questioner" as SenderType },
    lisa: { name: "Lisa K.", type: "struggler" as SenderType },
    denise: { name: "Denise P.", type: "buyer" as SenderType },
};

// ============================================
// DAY 0-10: Trust Building & Learning Phase
// ============================================

export const HUMANIZED_SCRIPTS: PodScriptMessage[] = [
    // DAY 0 - Welcome
    {
        id: "day0_sarah_welcome",
        dayOffset: 0,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 0,
        content: `welcome to the pod everyone!! 🌿

so excited you're all here. I'm Sarah - your coach for this journey

quick things:
some of you are further along than others and that's actually perfect. you learn from the ones ahead and help the ones behind you

introduce yourself when you get a chance! tell us what brought you to functional medicine 💕`,
    },
    {
        id: "day0_gina_intro",
        dayOffset: 0,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 45,
        content: `omg welcome!! 🎉

so happy you're here. I started like 6 weeks ago and honestly it's been the best decision

this group is seriously the best and Sarah actually responds to everything which is rare lol

what made you decide to start?`,
    },
    {
        id: "day0_amber_intro",
        dayOffset: 0,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 80,
        content: `welcome!! 💕

one thing that helped me - don't try to rush through everything. I know it's tempting lol but the info really builds on itself so taking your time actually helps

also everyone here is super supportive. whenever I got confused about something I just asked and someone always helped`,
    },
    {
        id: "day0_cheryl_intro",
        dayOffset: 0,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 135,
        content: `hi!! welcome!

honestly I was kinda nervous at first because I wasn't sure if I could actually do this? but everyone here is so nice and Sarah explains stuff in a way that actually clicks

what part of functional medicine interests you most? I'm really into the gut health stuff so far it's fascinating`,
    },
    {
        id: "day0_lisa_intro",
        dayOffset: 0,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 210,
        content: `hey! welcome 🌸

what brought you here?`,
    },
    {
        id: "day0_denise_intro",
        dayOffset: 0,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 285,
        content: `welcome!! 🎉

the certification is really thorough and Sarah genuinely cares about us which you can tell

can't wait to see your journey! we're all cheering for you 💕`,
    },
    {
        id: "day0_sarah_close",
        dayOffset: 0,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 330,
        content: `everyone jumping in to welcome our newest member... this is exactly why this community works

let's do this together 💕`,
    },

    // DAY 1 - First Impressions
    {
        id: "day1_amber_progress",
        dayOffset: 1,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 0,
        content: `so I just finished the first lesson on the foundations of integrative health and wow

like I thought I knew what functional medicine was but they explain it so differently here? the whole thing about treating root causes vs symptoms finally clicked for me

anyone else have that "ohhhh" moment in the first module?`,
    },
    {
        id: "day1_gina_response",
        dayOffset: 1,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 70,
        content: `yes!! that's exactly how I felt

the part about how your body is all connected and not just separate organs doing their own thing... that changed everything for me

it only gets better from here trust me`,
    },
    {
        id: "day1_cheryl_response",
        dayOffset: 1,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 165,
        content: `going through the first module right now and I love how they break everything down

this is actually structured and makes sense? like I can follow it`,
    },
    {
        id: "day1_sarah_encourages",
        dayOffset: 1,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 260,
        content: `love seeing this energy!! 💕

that first module really does set the foundation for everything else. the "systems thinking" approach is what makes functional medicine different from just taking supplements randomly

keep going! every module builds on the one before it, and by the time you're done you'll see the human body completely differently 🌿`,
    },

    // DAY 2 - Safe to Ask Questions
    {
        id: "day2_lisa_question",
        dayOffset: 2,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 0,
        content: `maybe this is a dumb question but...

in the module about inflammation they talk about "chronic low-grade inflammation" being different from like normal inflammation when you get hurt

how do people even know if they have chronic inflammation? like is there a test or do you just guess based on symptoms?

sorry if this is basic I just want to make sure I understand it right`,
    },
    {
        id: "day2_sarah_answers",
        dayOffset: 2,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 35,
        content: `not a dumb question at all Lisa! this is actually one of the most important concepts to understand 💕

so yes there are tests: CRP, ESR, homocysteine, etc

but here's the thing... a lot of people with chronic low-grade inflammation have "normal" labs because the reference ranges are so wide

so we also look at symptoms: fatigue, brain fog, joint pain, skin issues, digestive problems

when someone has several of these plus elevated markers, that's when we're pretty confident it's chronic inflammation

you'll learn more about this in the lab interpretation module but you're asking exactly the right questions! 🌿`,
    },
    {
        id: "day2_denise_relates",
        dayOffset: 2,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 110,
        content: `omg Lisa I had the same exact question when I went through that section

so glad you asked because now I understand it better too!`,
    },
    {
        id: "day2_lisa_thanks",
        dayOffset: 2,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 195,
        content: `this makes so much more sense now thank you Sarah!! 

and Denise I felt the same way lol like maybe everyone else just gets it and I'm slow?? but apparently not haha`,
    },

    // DAY 3 - Early Win
    {
        id: "day3_gina_win",
        dayOffset: 3,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 0,
        content: `I have to share this

so I've had these random headaches for like 2 years and doctors kept saying "drink more water" or "it's stress" which fine but that didn't help

after going through the gut health module I decided to try cutting gluten for 2 weeks just to see

you guys... the headaches are basically GONE

I'm kind of shook right now ngl`,
    },
    {
        id: "day3_amber_relates",
        dayOffset: 3,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 55,
        content: `the gut-brain connection is SO real. I had something similar with my brain fog - cut out dairy and it cleared up within like a week

it's crazy how much food affects everything and we're never taught this`,
    },
    {
        id: "day3_sarah_celebrates",
        dayOffset: 3,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 130,
        content: `Gina this is EXACTLY why I love functional medicine 💕

headaches, brain fog, mood issues, even anxiety - so much of it can be traced back to what we're eating

and the beautiful thing is you figured this out yourself just by applying what you learned

this is what it's all about 🌿`,
    },
    {
        id: "day3_cheryl_inspired",
        dayOffset: 3,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 225,
        content: `this is really inspiring

that makes me want to keep going`,
    },
    {
        id: "day3_gina_closes",
        dayOffset: 3,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 320,
        content: `thank you everyone 🥹

honestly I was skeptical too Cheryl. like "sure food matters but MY headaches are different" lol

turns out they weren't different at all

if I can figure this out for myself just from the first few modules imagine what we'll be able to do for clients once we finish everything`,
    },

    // DAY 4 - Weekend Check-in
    {
        id: "day4_sarah_weekend",
        dayOffset: 4,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 0,
        content: `happy weekend everyone! 🌿

just checking in - how's everyone doing? making progress? taking a break? both are totally valid lol

what are you all working on?`,
    },
    {
        id: "day4_denise_progress",
        dayOffset: 4,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 90,
        content: `making progress!! just finished Module 3 on gut health basics and honestly mind blown

also taking notes like crazy because I know I'm gonna forget stuff lol`,
    },
    {
        id: "day4_lisa_catchup",
        dayOffset: 4,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 180,
        content: `trying to catch up a bit this weekend! fell behind a little because work was crazy this week

but honestly even going slow I'm learning so much. did anyone else highlight literally everything in the inflammation module or just me 😅`,
    },

    // DAY 5 - Personal Stories
    {
        id: "day5_cheryl_story",
        dayOffset: 5,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 0,
        content: `I don't usually share personal stuff but I feel like this group is safe so...

the reason I'm doing this certification is because of my sister. she's been dealing with chronic fatigue and fibromyalgia for 8 years and I've watched her go from doctor to doctor getting nowhere

I know I can't fix her but I want to at least understand what might actually be going on

sorry that got heavy lol just wanted to share why I'm here`,
    },
    {
        id: "day5_lisa_relates",
        dayOffset: 5,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 40,
        content: `Cheryl this is literally why I'm here too 😭

my mom has autoimmune stuff and watching her struggle while doctors just keep adding more medications is so frustrating

you're not trying to "fix" your sister - you're trying to UNDERSTAND. and that's huge 💕`,
    },
    {
        id: "day5_sarah_validates",
        dayOffset: 5,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 115,
        content: `Cheryl thank you for sharing this 💕

this is exactly why functional medicine exists. so many people like your sister are failed by a system that only looks at symptoms instead of root causes

you're in the right place. I'm so glad you're here 🌿`,
    },

    // DAY 5 - EDUCATIONAL TIP: Instagram Bio
    {
        id: "day5_gina_bio_tip",
        dayOffset: 5,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 180,
        content: `okay real talk - does anyone else stress about what to put in their Instagram bio?

I changed mine like 10 times and finally found a formula that works:

"I help [specific person] with [specific problem] achieve [specific result]"

mine is: "I help women with gut issues finally feel normal again"

simple but it actually gets people DMing me asking for help lol`,
    },
    {
        id: "day5_denise_bio_reaction",
        dayOffset: 5,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 225,
        content: `omg wait this is so helpful!! 

I've been overthinking my bio for weeks. I kept trying to list all my credentials but this is so much clearer

screenshot saved thank you 📸`,
    },
    {
        id: "day5_sarah_bio_adds",
        dayOffset: 5,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 260,
        content: `yes Gina!! this formula is gold 💕

pro tip: your bio should be about THEM not you

"Certified Functional Medicine Practitioner" = about you
"I help busy moms stop feeling exhausted" = about them

guess which one gets clients? 🌿`,
    },

    // DAY 6 - Sarah's Teaching
    {
        id: "day7_sarah_teaching",
        dayOffset: 7,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 0,
        content: `want to share something that took me YEARS to figure out

when a client comes to you with multiple symptoms - fatigue, brain fog, joint pain, skin issues - the temptation is to try to address everything at once

don't do that

here's the framework I use now:

Step 1: ALWAYS start with gut - even if gut isn't their main complaint. 70% of the immune system is in the gut

Step 2: Then stress/adrenals - chronic stress messes with everything

Step 3: Then specific systems - NOW you can look at thyroid, hormones, etc

this order works. trust it 🌿`,
    },
    {
        id: "day7_cheryl_clarity",
        dayOffset: 7,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 130,
        content: `this actually makes so much sense

I was reading through the protocols and thinking "how would I ever decide what to do first??" 

gut first, then stress, then specific stuff. that's so much simpler than what I was doing in my head lol`,
    },
    {
        id: "day7_denise_saves",
        dayOffset: 7,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 220,
        content: `bookmarking this!! 🔖

I literally screenshot this whole thing because I know when I'm actually working with clients I'm going to need this reminder

thank you for sharing your experience so we don't have to learn the hard way 💕`,
    },

    // DAY 8 - Momentum Building
    {
        id: "day8_denise_momentum",
        dayOffset: 8,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        content: `you guys this program is so good

just finished the digestive health module and my brain is literally exploding with information

I keep thinking about how many people walk around with gut issues that doctors just dismiss. we're going to be able to actually HELP them`,
    },
    {
        id: "day8_gina_validates",
        dayOffset: 8,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 85,
        content: `that's exactly how I felt Denise!

wait until you get to the healing protocols section. it all comes together so beautifully

you're doing amazing 💕`,
    },

    // DAY 8 - EDUCATIONAL TIP: Content Marketing
    {
        id: "day8_sarah_content_tip",
        dayOffset: 8,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 180,
        content: `quick tip for those of you thinking about building your presence online 💕

simplest content strategy that WORKS:

every day, share ONE thing you learned in the certification

"TIL that 80% of your immune system is in your gut 🤯"

that's it. that simple. people LOVE learning something new

you don't need to be an expert. you just need to share your journey 🌿`,
    },
    {
        id: "day8_melissa_excited",
        dayOffset: 8,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 220,
        content: `wait this is so low pressure

I've been scared to post anything because I feel like I need to know everything first

but sharing what I'm learning as I learn it? I can totally do that`,
    },
    {
        id: "day8_sarah_dm_invite",
        dayOffset: 8,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 260,
        content: `exactly! 💕 start today if you can

btw if anyone wants to brainstorm content ideas specific to your niche, DM me directly. happy to help you get started 🌿`,
    },

    // DAY 9 - Imposter Syndrome
    {
        id: "day9_lisa_doubt",
        dayOffset: 9,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 0,
        content: `okay be honest with me... does anyone else feel like a total fraud sometimes?

like I'm learning all this information but who am I to actually help people with their health? I don't have a medical degree

maybe I'm not cut out for this 😔`,
    },
    {
        id: "day9_sarah_responds",
        dayOffset: 9,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 120,
        content: `Lisa I'm so glad you shared this because SO many people feel this way 💕

here's the truth: the medical system has failed millions of people. they're looking for someone who will actually LISTEN and help them address root causes

you don't need an MD to change someone's life. you need knowledge, compassion, and a framework. you're getting all three right now

keep going. you ARE cut out for this 🌿`,
    },
    {
        id: "day9_cheryl_relates",
        dayOffset: 9,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 245,
        content: `Lisa I literally had the same thought this morning

but then I thought about my sister and all the doctors who dismissed her for years. she would have given anything to have someone who actually understood what she was going through

we're going to be that person for people like her`,
    },

    // DAY 10 - Protocol Deep Dive
    {
        id: "day10_sarah_teaching",
        dayOffset: 10,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 0,
        content: `quick lesson for those of you getting into the protocols section 💕

when you're learning supplement sequencing, remember: MORE is not better

the goal is to support the body's natural healing processes, not overwhelm it

start simple. one thing at a time. observe. adjust

this is the art of functional medicine 🌿`,
    },
    {
        id: "day10_gina_example",
        dayOffset: 10,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 150,
        content: `this is such good advice Sarah

I made this mistake early on - tried to do everything at once and my body just got confused

sometimes less really is more`,
    },

    // DAY 10 - EDUCATIONAL TIP: First Client Strategy
    {
        id: "day10_amber_first_client",
        dayOffset: 10,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 280,
        content: `okay since we're getting close to certification, here's something that helped me get my FIRST paying client

I offered 3 friends/family a "beta" package at 50% off

the deal: they get a huge discount, I get testimonials and case study photos

literally all 3 said yes immediately and those testimonials got me my next 5 clients

don't wait until you feel "ready" - just start with people who already trust you`,
    },
    {
        id: "day10_cheryl_lightbulb",
        dayOffset: 10,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 320,
        content: `wait this is genius

I kept thinking I needed a website and fancy business cards first

but my neighbor has been asking me about gut stuff for months... maybe she could be my first client?`,
    },
    {
        id: "day10_sarah_confirms",
        dayOffset: 10,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 355,
        content: `yes Cheryl!! your neighbor is literally a warm lead 💕

you don't need a website to help someone. you need knowledge (which you're getting) and a willingness to show up

reach out to her after you're certified. I bet she says yes immediately 🌿`,
    },

    // DAY 11 - Hitting a Wall
    {
        id: "day11_cheryl_stuck",
        dayOffset: 11,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 0,
        content: `anyone else hitting a wall right now?

I've been at this for almost 2 weeks and today I just felt SO tired. couldn't focus at all

starting to wonder if I should just take a break or push through`,
    },
    {
        id: "day11_amber_advice",
        dayOffset: 11,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 75,
        content: `Cheryl this is totally normal

honestly I took a 2-day break when I hit my wall and came back so much more focused

this isn't a race. take care of yourself first 💕`,
    },
    {
        id: "day11_sarah_validates",
        dayOffset: 11,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 190,
        content: `Cheryl if your body is asking for rest, listen to it 🌿

ironically, that's exactly what we teach in functional medicine - honor what your body needs

take a day off. come back refreshed. the material isn't going anywhere`,
    },

    // DAY 12 - SIBO Deep Dive
    {
        id: "day12_denise_excited",
        dayOffset: 12,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        content: `OMG the SIBO module is everything

I had a friend who struggled with SIBO for YEARS and now I finally understand why the standard approach didn't work for her

the part about biofilm disruptors?? mind blown 🤯`,
    },
    {
        id: "day12_lisa_agrees",
        dayOffset: 12,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 95,
        content: `right?? I had no idea SIBO was this complex

also feeling way less like a fraud now. there's SO much doctors don't learn about this stuff

we're getting real clinical knowledge here`,
    },

    // DAY 12 - EDUCATIONAL TIP: Discovery Call Questions
    {
        id: "day12_sarah_discovery",
        dayOffset: 12,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 200,
        content: `since some of you are thinking about clients - here's the discovery call script that changed everything for me 💕

the 3 MAGIC questions:

1. "What have you already tried?"
(shows you what failed and why)

2. "What would life look like if this was solved?"
(gets them emotional about the outcome)

3. "What's stopping you from getting there on your own?"
(they'll basically sell themselves on needing help)

write these down. you'll use them forever 🌿`,
    },
    {
        id: "day12_amber_reaction",
        dayOffset: 12,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 240,
        content: `Sarah these are GOLD

that second question especially. when people describe their dream outcome they get so emotional

it's like they're convincing themselves they need to do this`,
    },
    {
        id: "day12_denise_saves",
        dayOffset: 12,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 275,
        content: `literally just opened my Notes app and saved these

I was so nervous about what to say on calls but having specific questions makes it feel way less scary

thank you Sarah!! 🙏`,
    },

    // DAY 13 - Almost Certified
    {
        id: "day13_denise_close",
        dayOffset: 13,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        content: `ONE MORE MODULE LEFT

I can't believe I'm almost done with my certification. this felt impossible when I started

now I just need to pass the final exam and I'll officially be certified 😭`,
    },
    {
        id: "day13_gina_encourages",
        dayOffset: 13,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 60,
        content: `DENISE YOU'RE SO CLOSE!!

the final exam is very fair btw. if you've been paying attention to the modules you'll do great

we're all rooting for you! 🙌`,
    },
    {
        id: "day13_sarah_supports",
        dayOffset: 13,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 185,
        content: `Denise I'm blown away by how dedicated you've been 💕

you showed up. you did the work. you're about to become a certified practitioner

take a deep breath. you've got this 🌿`,
    },

    // DAY 14 - DENISE CERTIFIED
    {
        id: "day14_denise_certified",
        dayOffset: 14,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        content: `I can't believe I'm typing this but

I just officially completed my certification and passed my final exam 🎓

I'm sitting here at my kitchen table with my laptop and it says CERTIFIED and I actually started crying lol

my husband came in like "what's wrong" and I was like "nothing's wrong, I actually DID something"

I don't know what happens next but right now I just feel so proud of myself`,
    },
    {
        id: "day14_sarah_celebrates",
        dayOffset: 14,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 20,
        content: `DENISE!! 🎉🎉🎉

I'm bursting with pride for you

you showed up. you did the work. you finished something you said you were going to do. and now you're CERTIFIED

take today and just celebrate yourself. you earned this 💕`,
    },
    {
        id: "day14_cheryl_inspired",
        dayOffset: 14,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 150,
        content: `Denise this just gave me so much motivation

I'm on Lesson 8 right now and sometimes I get overwhelmed but seeing you finish and actually get certified makes me feel like I can do this too

congrats!! ❤️`,
    },
    {
        id: "day14_denise_grateful",
        dayOffset: 14,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 310,
        content: `thank you everyone 🥹

honestly this group has been such a huge part of why I kept going

now I need to figure out what I'm actually doing next lol but for tonight I'm just going to celebrate that I'm officially certified`,
    },

    // DAY 15 - "Now What?" (DFY Seed)
    {
        id: "day15_denise_stuck",
        dayOffset: 15,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        content: `so the certification high is wearing off and now I'm like... what do I actually DO with this?? 😅

I have all this knowledge in my head but no idea how to turn it into an actual practice

like do I need a website? how do I get clients? what do I even charge?

feeling a little lost honestly`,
    },
    {
        id: "day15_lisa_same",
        dayOffset: 15,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 50,
        content: `Denise this is EXACTLY what I'm worried about

the clinical stuff I can learn. the business stuff scares me way more`,
    },
    {
        id: "day15_sarah_hints",
        dayOffset: 15,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 210,
        content: `Denise and Lisa this is THE most common thing I hear 💕

here's the reality: the knowledge you have is valuable. but getting it in front of the right people requires a totally different skillset

I actually work with some students more closely on this part but we can talk about that another time. for now, just know you're not alone

you didn't come this far to stop now 🌿`,
    },

    // DAY 15 - EDUCATIONAL TIP: Pricing Psychology
    {
        id: "day15_gina_pricing",
        dayOffset: 15,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 340,
        content: `okay pricing tip since we're all thinking about this

biggest mistake I made early on: charging by the HOUR

$50/hr sounds good until you realize you're trading time for money forever

what works: charge by TRANSFORMATION

"3-month gut healing program" = $997
not "12 hours of coaching at $80/hr"

same amount of time. completely different perceived value`,
    },
    {
        id: "day15_cheryl_mindblown",
        dayOffset: 15,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 380,
        content: `this is such a mindset shift

I never thought about it like this. I was going to charge $40/session like a massage therapist

but we're not selling time... we're selling life-changing results`,
    },
    {
        id: "day15_sarah_confirms2",
        dayOffset: 15,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 410,
        content: `exactly Cheryl!! 💕

people don't pay for your time. they pay for the OUTCOME you help them get

would you pay $997 to finally solve your gut issues after suffering for years?

yes. yes you would.

price based on the value of the transformation 🌿`,
    },

    // DAY 16 - Gina's First Client (Income Proof)
    {
        id: "day16_gina_client",
        dayOffset: 16,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 0,
        content: `SCREAMING at my phone right now

I just got my FIRST paying client from the leads I've been nurturing!!! 

$1,000 for a 3-month gut healing program

I literally started crying. this is actually real 😭💕`,
    },
    {
        id: "day16_sarah_celebrates",
        dayOffset: 16,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 35,
        content: `GINA YES!!! 🎉🎉🎉

your first client! this is such a huge milestone

$1,000 from doing what you love. this is what it's all about 💕🌿`,
    },
    {
        id: "day16_denise_inspired",
        dayOffset: 16,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 125,
        content: `Gina this is giving me so much hope

I'm sitting here certified but still have no idea how to get clients. did you just post on social media or what?`,
    },
    {
        id: "day16_gina_explains",
        dayOffset: 16,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 180,
        content: `honestly Denise I had a lot of help setting up my systems

Sarah worked with me on my website, email sequences, and niche positioning. once that was in place, the clients started finding ME

I couldn't have done it alone tbh`,
    },

    // DAY 17 - Tech Overwhelm
    {
        id: "day17_denise_frustrated",
        dayOffset: 17,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        content: `okay I just spent 4 hours trying to set up a website and I want to throw my laptop out the window

Squarespace, Wix, WordPress - they all confuse me

how does anyone do this?? I just want to help people with their health, not become a web developer 😩`,
    },
    {
        id: "day17_lisa_relates",
        dayOffset: 17,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 55,
        content: `Denise I felt this so hard

I've been avoiding the tech side because it's so overwhelming

maybe we need to just pay someone to do it for us?`,
    },
    {
        id: "day17_cheryl_agrees",
        dayOffset: 17,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 130,
        content: `same honestly

I'm great at learning the clinical stuff but the business/tech piece feels like a completely different language

wish there was a way to just focus on helping people and have someone handle the rest`,
    },

    // DAY 18 - DFY REVEAL
    {
        id: "day18_sarah_dfy",
        dayOffset: 18,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 0,
        offerTag: "dfy_scholarship",
        content: `hey everyone 💕

a few of you have been asking about how to handle the business/tech side of things so I wanted to share something

I do have a small program where I personally help set everything up for you. website, booking system, email sequences, client scripts - all of it

I call it the "Done-For-You Practice Launch"

I only open 4 spots per quarter for this - it's very hands-on and I want to give everyone my full attention. right now I have a couple spots left before I close enrollment

happy to share more details if anyone's interested. no pressure at all 🌿`,
    },
    {
        id: "day18_denise_interested",
        dayOffset: 18,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 90,
        offerTag: "dfy_scholarship",
        content: `Sarah this is exactly what I've been looking for 😭

I literally spent 4 hours yesterday trying to figure out Squarespace and wanted to throw my laptop

yes please share more details!! what does it actually include?`,
    },
    {
        id: "day18_gina_validates",
        dayOffset: 18,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 165,
        content: `Denise I did something similar with Sarah a while back and it was honestly the best decision

I was spinning my wheels for weeks trying to do everything myself. once she helped me get set up, I had my first client within a month

just saying... sometimes getting help is worth it`,
    },
    {
        id: "day18_sarah_price",
        dayOffset: 18,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 325,
        offerTag: "dfy_scholarship",
        content: `Denise I'll DM you the full details! 💕

the full program is normally $9,997 (you can see everything in the programs section) but I do have a scholarship for engaged students at $1,997 (one time, no monthly fees)

most students make that back with their first 2 clients honestly

anyway, no pressure. just want you to know the option exists 🌿`,
    },

    // DAY 19 - DENISE SIGNS UP
    {
        id: "day19_denise_enrolled",
        dayOffset: 19,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        offerTag: "dfy_scholarship",
        content: `so... I just enrolled in Sarah's DFY program 😬🎉

I was up until midnight thinking about it and finally just went for it

here's my logic: I already spent months getting certified. I can either spend another 3-6 months fumbling around trying to figure out tech and marketing... or I can just START

plus $1997 sounds like a lot until you realize one client at $1000+ pays for half of it. two clients and I'm profitable

wish me luck!! 💕`,
    },
    {
        id: "day19_amber_congrats",
        dayOffset: 19,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 45,
        content: `DENISE YES!! I'm thrilled for you!! 🎉

this is such a big step. you're actually DOING it not just thinking about it`,
    },
    {
        id: "day19_sarah_welcomes",
        dayOffset: 19,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 280,
        content: `Denise I'm over the moon to work with you!! 💕

we're going to build something amazing together. you already have the knowledge and the heart - now we just add the structure

welcome to the DFY family! your website build starts this week 🌿`,
    },

    // DAY 19 - EDUCATIONAL TIP: Niching Down
    {
        id: "day19_gina_niche_tip",
        dayOffset: 19,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 400,
        content: `biggest lesson I learned early on: NICHE DOWN

I used to say "I help people with digestive issues"

now I say "I help busy professional women over 40 with IBS finally get relief"

same work. 3x the price. better clients. more referrals

specific = premium. broad = commodity`,
    },
    {
        id: "day19_cheryl_question",
        dayOffset: 19,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 440,
        content: `this is so hard though

I feel like if I niche down I'll miss out on all the other people I could help

how do you get over that fear?`,
    },
    {
        id: "day19_sarah_niche_dm",
        dayOffset: 19,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 480,
        content: `Cheryl I hear this all the time 💕

here's the truth: when you speak to everyone, you connect with no one

when you speak directly to ONE specific person, everyone in that category says "she's talking to ME"

if you're struggling to find your niche, DM me. I have a simple exercise that helps 🌿`,
    },

    // DAY 22 - WEBSITE LIVE
    {
        id: "day22_denise_live",
        dayOffset: 22,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        content: `MY WEBSITE IS OFFICIALLY LIVE 🎉🎉🎉

booking system works. email sequences set up. payment processor connected. everything

I shared it with my friends and family and they were like "this looks so professional"

one week ago I was crying over Squarespace tutorials. now I have a REAL business setup

this is insane`,
    },
    {
        id: "day22_cheryl_impressed",
        dayOffset: 22,
        senderType: "questioner",
        senderName: "Cheryl W.",
        delayMinutes: 55,
        content: `Denise I just stalked your site and WOW it looks incredible

the way your story is written, the services section, everything flows so well

there's no way I could make something like that myself

I think I need to DM Sarah too... 😅`,
    },
    {
        id: "day22_sarah_proud",
        dayOffset: 22,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 290,
        content: `Denise watching your journey is incredible!! 💕

you went from certified but stuck to having a complete practice setup in 2 weeks. that's exactly what the DFY program is designed to do

the first client is coming. I can feel it 🌿`,
    },

    // DAY 22 - EDUCATIONAL TIP: Client Retention
    {
        id: "day22_gina_retention",
        dayOffset: 22,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 400,
        content: `client retention tip that's been HUGE for me:

send a weekly voice note check-in to each client

takes me 30 seconds per person

but it makes them feel SO special and supported. like they have a real coach in their corner

my clients literally tell their friends about these voice notes. it's become part of my brand now

personal touch > fancy systems`,
    },
    {
        id: "day22_amber_agrees",
        dayOffset: 22,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 440,
        content: `this is so true Gina

I started doing 60-second loom videos on Sundays just checking in and asking how their week went

my retention rate went from 70% to 95% after I started this

people stay because they feel SEEN`,
    },
    {
        id: "day22_denise_notes",
        dayOffset: 22,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 470,
        content: `adding this to my "when I get clients" checklist lol

I love that it's so simple. I was imagining needing to build some complicated follow-up system

30 seconds of genuine care > hours of automation`,
    },

    // DAY 25 - FIRST CLIENT!!
    {
        id: "day25_denise_first_client",
        dayOffset: 25,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 0,
        content: `SCREAMING

I JUST GOT MY FIRST CLIENT 🎉🎉🎉🎉

remember the woman who filled out my contact form? we had our discovery call this morning and SHE SIGNED UP

$1,000 for a 3-month program

I literally cannot process this right now. one month ago I was crying over a website. TWO WEEKS ago I had nothing set up. and now I have a PAYING CLIENT

this is actually happening`,
    },
    {
        id: "day25_sarah_celebrates",
        dayOffset: 25,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 25,
        content: `DENISE!!!!! 🎉🎉🎉💕💕💕

I KNEW IT!! I knew that first client was coming!!

from stuck and overwhelmed to booking a $1,000 client in less than 3 weeks. THIS is what's possible when you invest in yourself

this is just the beginning. I couldn't be more proud of you 🌿`,
    },
    {
        id: "day25_gina_roi",
        dayOffset: 25,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 70,
        content: `DENISE YESSSSS!! congrats!!! 🎉🎉

your first client!! that's such a special milestone

$1,000 already!! that's half your DFY investment back with ONE client!!

can't wait to watch you grow 💕`,
    },
    {
        id: "day25_lisa_inspired",
        dayOffset: 25,
        senderType: "struggler",
        senderName: "Lisa K.",
        delayMinutes: 150,
        content: `Denise I'm literally tearing up reading this

you went from exactly where I am right now to having a paying client in like 3 weeks

I think I need to stop telling myself I'll "figure it out eventually" and just DO something`,
    },

    // DAY 28 - EDUCATIONAL TIP: Handling Objections
    {
        id: "day28_gina_objections",
        dayOffset: 28,
        senderType: "leader",
        senderName: "Gina T.",
        delayMinutes: 0,
        content: `okay real talk about the #1 objection you'll get:

"that's too expensive"

what they're really saying: "I don't see enough value yet"

what works for me:

"totally understand. can I ask what you've already spent trying to solve this?" 

then they list doctors, supplements, meds... usually thousands

suddenly $997 doesn't seem so expensive anymore`,
    },
    {
        id: "day28_amber_adds",
        dayOffset: 28,
        senderType: "leader",
        senderName: "Amber L.",
        delayMinutes: 60,
        content: `Gina this is so good

I also ask: "what would it be worth to you to finally solve this?"

when they describe their ideal outcome - more energy, sleeping better, no more pain - $997 feels like nothing

we're not selling coaching. we're selling TRANSFORMATION`,
    },
    {
        id: "day28_sarah_scripts",
        dayOffset: 28,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 120,
        content: `love these reframes 💕

if anyone wants my full objection handling script, DM me! 

I have responses for:
- "I need to think about it"
- "I need to talk to my husband"
- "I can't afford it right now"

happy to share with anyone who asks 🌿`,
    },

    // DAY 30 - MONTH REFLECTION
    {
        id: "day30_sarah_recap",
        dayOffset: 30,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 0,
        content: `can we just take a moment to appreciate this group?? 💕

it's been one month since some of you joined and look at what's happened:

- Gina: 3 clients, over $3,000 earned
- Denise: 2 clients, $2,200 earned  
- Cheryl: 1 client, $1,100 earned
- Lisa: website building, ready to launch

one month ago some of you were stuck. overwhelmed. wondering if this was even possible

now? you're actually doing it. you're certified practitioners with real paying clients

I'm so proud of every single one of you 🌿`,
    },
    {
        id: "day30_denise_reflection",
        dayOffset: 30,
        senderType: "buyer",
        senderName: "Denise P.",
        delayMinutes: 80,
        content: `Sarah this reflection hit me hard

30 days ago I was crying over Squarespace. NOW I have 2 clients, a professional website, and legit income from something I'm passionate about

I keep having to remind myself this is real lol

thank you for believing in us when we didn't believe in ourselves 💕`,
    },
    {
        id: "day30_sarah_invitation",
        dayOffset: 30,
        senderType: "coach",
        senderName: "Sarah M.",
        delayMinutes: 390,
        offerTag: "dfy_scholarship",
        content: `for anyone reading this who's still on the fence... still wondering if you're ready... still thinking "maybe later"...

look at what happened in just 30 days. real people. real progress. real income.

it doesn't take years. it takes a decision

3 of your pod-mates joined the scholarship this quarter. I have 1 spot left before enrollment closes

the DFY scholarship is still at $1,997 for serious students. DM me if you're ready to stop waiting and start building

you deserve this too 🌿`,
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getScriptsForDay(dayOffset: number): PodScriptMessage[] {
    return HUMANIZED_SCRIPTS.filter(s => s.dayOffset === dayOffset);
}

export function getAllScriptsUpToDay(dayOffset: number): PodScriptMessage[] {
    return HUMANIZED_SCRIPTS.filter(s => s.dayOffset <= dayOffset);
}

export function getScriptsWithOfferTag(tag: string): PodScriptMessage[] {
    return HUMANIZED_SCRIPTS.filter(s => s.offerTag === tag);
}

// Convert delay to actual Date based on enrollment date
export function getMessageTime(enrollmentDate: Date, script: PodScriptMessage): Date {
    const baseDate = new Date(enrollmentDate);
    baseDate.setDate(baseDate.getDate() + script.dayOffset);
    baseDate.setHours(9, 0, 0, 0); // Start at 9 AM
    baseDate.setMinutes(baseDate.getMinutes() + script.delayMinutes);
    return baseDate;
}
