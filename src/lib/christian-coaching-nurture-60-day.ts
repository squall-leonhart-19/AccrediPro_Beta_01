/**
 * Certified Christian Life Coach Mini Diploma - 60-Day Nurture Sequence
 * 
 * OFFER: $297 Complete Career Certification
 * 
 * What's Included:
 * - 3-Level Certification (CC-FC™ + CC-CP™ + CC-BC™)
 * - Board Certified Master Practitioner title
 * - 25+ in-depth lessons on faith-based coaching, biblical counseling, spiritual mentorship
 * - Sarah mentorship access
 * - My Circle Mastermind (5-person pod, DAILY check-ins)
 * - ASI Practitioner Directory listing
 * - Community access (20,000+ practitioners)
 * - LIFETIME ACCESS
 * 
 * Phase 1 (Days 0-14): VALUE - Build trust, NO selling
 * Phase 2 (Days 15-30): DESIRE - Show transformation
 * Phase 3 (Days 31-45): DECISION - Clear $297 offer
 * Phase 4 (Days 46-60): RE-ENGAGE - Stay connected
 * 
 * Target: US Christian Women 35-55+ called to faith-based coaching ministry
 */

function cleanContent(content: string): string {
    return content
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/—/g, '-')
        .trim();
}

const ASI_SIGNATURE = `
Sarah
Board Certified Master Practitioner
AccrediPro Standards Institute`;

export const CHRISTIAN_COACHING_NURTURE_SEQUENCE = [
    // ============================================
    // PHASE 1: VALUE (Days 0-14) - NO SELLING
    // ============================================

    {
        id: 1,
        phase: "value",
        day: 0,
        subject: "Re: your Certified Christian Life Coach access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of thousands of women who've answered God's call to serve others through faith-based coaching - practitioners in 47 countries who understand that true transformation happens when we align with God's purpose.

Your Certified Christian Life Coach Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified Master Practitioners in Christian coaching.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if this calling is for you.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

God brought you here for a reason. Let's discover it together.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    {
        id: 2,
        phase: "value",
        day: 1,
        subject: "Re: why I believe God called me to this work",
        content: cleanContent(`{{firstName}},

Can I share something personal with you?

For years, I knew God was calling me to serve others in a deeper way. I could feel it in my spirit. A persistent whisper: "There's more I have for you."

But I didn't know what it looked like. I wasn't a pastor. I didn't have a counseling degree. I was just a woman who loved Jesus and wanted to help others find Him in their struggles.

Then I discovered Christian life coaching.

It was like finding the missing puzzle piece. Finally - a way to combine my faith, my life experiences, and my calling to help others. A structured approach that honored both biblical truth AND practical wisdom.

The training gave me tools. The certification gave me credibility. But the CALLING - that was already inside me. Just like it's inside you.

Because here's what I believe, {{firstName}}:

If you're feeling drawn to help others deepen their faith, overcome challenges, and align with God's purpose... that's not random. That's the Holy Spirit.

So tell me - what made you sign up? What is God stirring in you?

Hit reply. I'd love to hear your story.

In Christ,

${ASI_SIGNATURE}`),
    },

    {
        id: 3,
        phase: "value",
        day: 3,
        subject: "Re: why faith-based coaching matters",
        content: cleanContent(`{{firstName}},

I need to tell you about Jennifer.

She came to one of our Board Certified Christian coaches feeling completely lost. 47 years old. Raised her kids, served at church, did everything "right." But inside? An emptiness she couldn't explain.

She'd prayed. She'd read her Bible. She'd talked to friends at church. Everyone said: "Just trust God more."

But the emptiness remained.

When she found a certified Christian life coach, something shifted. Not because the coach replaced God - but because she helped Jennifer hear what God was already saying.

Through faith-based coaching, Jennifer discovered she'd been so busy serving everyone else, she'd never asked God what HE wanted for her life NOW.

Within weeks, she had clarity. Within months, she started a meaningful ministry.

Here's what I want you to understand, {{firstName}}:

Faith-based coaching doesn't replace prayer, Scripture, or the Holy Spirit. It partners with them. It gives people tools to hear God more clearly, live more intentionally, and walk out their purpose.

This is what you're learning in your Mini Diploma. This is the difference you'll make.

${ASI_SIGNATURE}`),
    },

    {
        id: 4,
        phase: "value",
        day: 5,
        subject: "Re: beautiful testimony this week",
        content: cleanContent(`{{firstName}},

I have to share something that blessed my heart this week.

One of our Board Certified practitioners, Grace, sent me this message:

"Sarah, my client just told me: 'For the first time in my life, I feel like I understand what God is calling me to do. And I'm not afraid of it anymore.' We've been working together for 6 weeks. She went from paralyzed by fear to stepping into her calling. That's what faith-forward coaching does."

This is why this work matters.

Not the certificates (though they're important). Not the income (though that's a blessing too). THIS.

That moment when someone who's been stuck, confused, or afraid finally hears God's voice clearly and steps forward in faith.

Grace is one of thousands of ASI-certified Christian coaches now serving the Body of Christ. She got certified 10 months ago. Now she has a thriving ministry.

{{firstName}}, keep going with your lessons. God is preparing you for something beautiful.

${ASI_SIGNATURE}`),
    },

    {
        id: 5,
        phase: "value",
        day: 7,
        subject: "Re: quick question for you",
        content: cleanContent(`{{firstName}},

It's been a week since you started your Certified Christian Life Coach Mini Diploma.

What's resonating most with you so far?

When I ask our practitioners this question, the most common answers are:

1. "I finally understand how to integrate faith with practical coaching techniques"
2. "I realized I've been informally coaching people at church for years - now I have structure"
3. "The biblical foundation gave me confidence this isn't 'worldly' coaching dressed up"

What about you?

Just hit reply and share one thing that spoke to you.

${ASI_SIGNATURE}

P.S. If you haven't started yet, no pressure. But try to carve out 15 minutes this week. I believe God will meet you there.`),
    },

    {
        id: 6,
        phase: "value",
        day: 10,
        subject: "Re: a technique rooted in Scripture",
        content: cleanContent(`{{firstName}},

Quick coaching tip grounded in biblical wisdom:

Proverbs 20:5 says: "The purposes of a person's heart are deep waters, but one who has insight draws them out."

That's the heart of Christian coaching - drawing out what God has already placed inside someone.

Most people don't need us to give them answers. They need us to ask the right questions so THEY can hear God's answers.

Instead of: "Here's what you should do..."
Try: "What do you sense God might be saying about this?"

Instead of: "I think you should..."
Try: "What would it look like if you fully trusted God in this area?"

This is one of the core techniques in your Mini Diploma - learning to be a vessel, not the source.

Try this approach in conversation this week. Watch what happens.

${ASI_SIGNATURE}`),
    },

    {
        id: 7,
        phase: "value",
        day: 12,
        subject: "Re: checking in on you",
        content: cleanContent(`{{firstName}},

Just wanted to check in and see how you're doing.

How's your journey with the Mini Diploma going?

If you're making progress - praise God! You're joining thousands who've completed this training.

If life got busy - that's okay. God's timing is perfect.

The women who complete this Mini Diploma tell me it changed how they see their calling. How they serve others. How they understand their own gifts.

Even 10 minutes at a time counts. Every lesson plants a seed.

What can I pray for you about right now?

${ASI_SIGNATURE}

P.S. If you've finished or are close - reply "COMPLETE" and I'll share what's next.`),
    },

    {
        id: 8,
        phase: "value",
        day: 14,
        subject: "Re: two weeks in",
        content: cleanContent(`{{firstName}},

It's been two weeks since you started your Certified Christian Life Coach journey.

I want to acknowledge something:

Stepping into this calling takes faith. Maybe you're wondering if you're qualified. If you're ready. If this is really what God wants.

I understand those questions. I asked them too.

So wherever you are right now...

If you've finished: I'm blessed to walk this path with you. You now understand faith-based coaching at a deeper level than most ever will.

And {{firstName}} - something shifted in you. You're not the same person who started two weeks ago. God is doing something.

If you're still in progress: Keep going. He who began a good work in you will carry it to completion.

Whatever camp you're in:

I see God's hand on you.
I believe in your calling.
I'm here if you need anything.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 2: DESIRE (Days 15-30)
    // ============================================

    {
        id: 9,
        phase: "desire",
        day: 15,
        subject: "Re: how Grace found her ministry",
        content: cleanContent(`{{firstName}},

I want to tell you what happened to Grace after she got certified.

Grace was a faithful church member for 25 years. She led Bible studies, volunteered everywhere, prayed with anyone who asked.

But she always felt like she was meant for something MORE. Like God had a specific calling she hadn't discovered yet.

Then she got her Christian Life Coach certification through ASI.

Month 1: Nervous but excited. Finally had a framework for what she'd always done naturally.

Month 2: Started coaching women from church. Word spread fast.

Month 3: Three women asked to pay her. She almost said no - "How can I charge to do God's work?"

Then she remembered: The worker is worthy of her wages.

Month 6: Grace now runs a coaching ministry. 10 clients monthly. $4,500/month. But more than the income - she's walking in her PURPOSE.

Here's what changed:

Before: "Grace - dedicated church volunteer"
After: "Grace, CC-BC - Board Certified Christian Life Coach"

That credential gave her permission to step fully into her calling.

{{firstName}}, do you see yourself in her story?

${ASI_SIGNATURE}`),
    },

    {
        id: 10,
        phase: "desire",
        day: 18,
        subject: "Re: what my days look like now",
        content: cleanContent(`{{firstName}},

Want to know what my days look like as a Christian life coach?

6:30am - Wake naturally. Prayer and devotion time. Prepare my heart.

8:00am - Check my Mastermind pod chat. Share Scripture that's speaking to me. Pray for my pod members.

9:00am - First coaching session. A woman navigating a difficult marriage. I help her hear what God is saying - not what the world says.

10:30am - Second session. A college student struggling with God's purpose for her life.

12:00pm - Lunch in peace.

2:00pm - Third session. A business owner learning to integrate faith into her work.

3:00pm - Done with client work. Time for family, rest, renewal.

No Sunday only ministry. No permission needed. No waiting for "someday."

I introduce myself: "I'm Sarah, a Board Certified Christian Life Coach."

That title represents everything God promised me would come.

${ASI_SIGNATURE}

P.S. The daily Mastermind? It's my prayer circle. We support each other's ministries daily.`),
    },

    {
        id: 11,
        phase: "desire",
        day: 21,
        subject: "Re: questions you might be asking",
        content: cleanContent(`{{firstName}},

Let me address the questions I know you're asking:

"Is Christian coaching biblical?"

Absolutely. Proverbs 11:14 says "Where there is no guidance, a people falls, but in an abundance of counselors there is safety." We train you to guide others with Scripture at the center.

"Am I qualified to do this?"

If God has called you, He will equip you. 38% of our practitioners have no formal ministry background. They have life experience and willing hearts - and that's enough.

"Will people pay for faith-based coaching?"

Christian women are hungry for guidance that doesn't compromise their faith. 73% of our practitioners say demand exceeds their capacity.

"Isn't this just Christian counseling?"

Different. Counseling addresses the past. Coaching focuses on the future - where God is leading. Both are valuable, distinct callings.

"What if my church doesn't understand?"

Most churches celebrate when members discover their calling. You might become a valuable resource FOR your church.

The only real obstacle is not answering the call.

${ASI_SIGNATURE}`),
    },

    {
        id: 12,
        phase: "desire",
        day: 24,
        subject: "Re: the fellowship nobody talks about",
        content: cleanContent(`{{firstName}},

Here's what nobody tells you about faith-based coaching ministry:

It can feel lonely.

You're serving others, pouring out, listening to struggles. But who pours into YOU?

Who prays for YOUR challenges?
Who celebrates YOUR breakthroughs?
Who holds YOU accountable?

That's why we created the My Circle Mastermind.

When you enroll, you're matched with 5 fellow Christian coaches. Your Circle.

Every day:
- Morning devotional sharing
- Prayer requests and praises
- Client situation discussions (confidentially)
- Mutual encouragement and accountability

This isn't a random Facebook group.

This is YOUR 5. Women who share your faith. Who understand ministry challenges. Who celebrate your first paying client. Who pray when you're struggling.

Plus the ASI Directory where people seeking Christian coaches find YOU.

No one ministers alone. Grace didn't. I didn't. The apostles didn't.

${ASI_SIGNATURE}

P.S. My original Circle? Still praying together daily, 3 years later. Sisters in Christ now.`),
    },

    {
        id: 13,
        phase: "desire",
        day: 27,
        subject: "Re: two possible futures",
        content: cleanContent(`{{firstName}},

Imagine it's one year from now.

Two versions of that moment:

PATH A: Nothing Changed

Same life. Same nagging feeling that God has more. The Mini Diploma a fading memory.

Still sensing a calling you haven't fully answered. Still wondering "what if."

Not bad. Just... unfulfilled.

PATH B: You Answered the Call

You're Board Certified. Three levels complete: CC-FC, CC-CP, CC-BC.

You introduce yourself: "Hi, I'm {{firstName}}, CC-BC - Board Certified Christian Life Coach."

You're in the ASI Directory. Believers seeking coaching find YOU.

You have your 5-person Mastermind Circle. Daily prayer support. Ministry partners who became dear friends.

8-10 clients monthly. $4,000-$6,000/month. Work that honors God and changes lives.

That calling you felt? Fully answered.

Both futures take the same 365 days.

The only difference is your decision now.

${ASI_SIGNATURE}`),
    },

    {
        id: 14,
        phase: "desire",
        day: 30,
        subject: "Re: an invitation",
        content: cleanContent(`{{firstName}},

It's been a month since you started.

I want to personally invite you to answer God's call more fully.

If you've felt Him moving... if you've wondered what it would take to make this a ministry...

Here's what's waiting:

The Complete Career Certification - $297

What's included:

ALL 3 CERTIFICATION LEVELS:
- CC-FC (Foundation Certified)
- CC-CP (Certified Practitioner)
- CC-BC (Board Certified Master)

THE TRAINING:
- 25+ in-depth lessons
- Biblical coaching frameworks
- Faith-integration techniques
- Ministry development

THE COMMUNITY:
- My Circle Mastermind (5-person pod)
- DAILY prayer and accountability
- 20,000+ practitioner network

CLIENT ACQUISITION:
- ASI Directory listing
- Sarah mentorship access
- LIFETIME ACCESS

BONUSES:
- Session templates
- Client intake forms
- Ministry development guides

Ready to answer the call? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Or reply "tell me more."

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 3: DECISION (Days 31-45)
    // ============================================

    {
        id: 15,
        phase: "decision",
        day: 31,
        subject: "Re: the complete path",
        content: cleanContent(`{{firstName}},

Here's the complete path to becoming a Board Certified Christian Life Coach:

STEP 0: Mini Diploma (Done)
You've got the foundation.

STEP 1: Complete Career Certification ($297)

LEVEL 1: CC-FC - Foundation Certified
- Core coaching principles with biblical integration
- Basic frameworks
- Your first credential

LEVEL 2: CC-CP - Certified Practitioner
- Advanced techniques
- Ministry development
- Client protocols

LEVEL 3: CC-BC - Board Certified Master
- Elite practitioner status
- Complex situations
- Full authority

PLUS:
- My Circle Mastermind (daily prayer support)
- ASI Directory listing
- Ministry templates (BONUS)
- Client scripts (BONUS)
- Sarah mentorship access
- LIFETIME ACCESS

What practitioners earn:
- Beginning: $2,000-$4,000/month
- Established: $4,500-$7,000/month
- Advanced: $7,000-$12,000/month

The math: $297 / $150 = 2 clients to cover your investment.

Reply with questions.

${ASI_SIGNATURE}`),
    },

    {
        id: 16,
        phase: "decision",
        day: 34,
        subject: "Re: the investment",
        content: cleanContent(`{{firstName}},

Let's talk about $297.

For context:
- Seminary courses: $500-$2,000 each
- Christian counseling programs: $5,000-$20,000
- Other coaching certifications: $997-$5,000

What you get for $297:
- 3-level certification
- Board Certified title
- 25+ lessons
- My Circle Mastermind
- ASI Directory listing
- All bonuses
- LIFETIME access

Total value: $5,000+
You pay: $297

The stewardship math:

Christian coaches typically charge $100-$200/session.

$297 / $100 = 3 clients.

THREE CLIENTS and you've covered your investment.
Everything after that is provision for your ministry - and your family.

Grace made over $450 in her first month. Her investment returned before she even finished training.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 17,
        phase: "decision",
        day: 36,
        subject: "Re: the credential that opens doors",
        content: cleanContent(`{{firstName}},

BEFORE:
"{{firstName}} - Church volunteer, Bible study leader"
- No credential
- People unsure of scope
- Informal support

AFTER:
"{{firstName}}, CC-BC - Board Certified Christian Life Coach"
- Professional credential (CMA, CPD, IPHM recognized)
- Clear role and expertise
- Listed in ASI Directory
- Daily fellowship with your Circle

What you get:

3 CREDENTIALS:
- CC-FC
- CC-CP
- CC-BC

THE BADGE:
Display on LinkedIn, church website, ministry materials.

THE DIRECTORY:
People searching "Christian life coach" find YOU.

THE CIRCLE:
5-person Mastermind. Daily prayer. Deep bonds.

THE VERIFICATION:
Public verification at accredipro.com/verify

Grace told me: "When I could say 'I'm Board Certified,' pastors started referring people to me. The credential legitimized my calling."

For $297, you become {{firstName}}, CC-BC.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 18,
        phase: "decision",
        day: 38,
        subject: "Re: what might be holding you back",
        content: cleanContent(`{{firstName}},

Let me address what might be stopping you:

"I don't have time."
- Self-paced. No live requirements.
- Most complete in 8-12 weeks.
- Daily Mastermind takes 5 minutes.

"$297 is a lot."
- Less than most Christian conferences.
- 3 clients = covered.
- An investment in your calling.

"I'm not sure I'm called."
- The fact you're here suggests otherwise.
- The training clarifies calling.
- Your Circle supports discovery.

"What if charging for ministry feels wrong?"
- Luke 10:7: "The worker deserves his wages."
- Charging allows you to serve MORE.
- Your gifts have value.

"My church might not understand."
- Most churches celebrate members in ministry.
- You might become a resource FOR them.

"What if I fail?"
- 30-day money-back guarantee.
- God doesn't call the equipped; He equips the called.

What's really stopping you?

Reply honestly. I want to pray with you.

${ASI_SIGNATURE}`),
    },

    {
        id: 19,
        phase: "decision",
        day: 40,
        subject: "Re: the fellowship that sustains ministry",
        content: cleanContent(`{{firstName}},

About the My Circle Mastermind:

Most certifications give you training and say "good luck."

We do something different - something biblical.

"Two are better than one... if either of them falls down, one can help the other up." - Ecclesiastes 4:9-10

You're matched with 5 fellow Christian coaches. Your Circle.

Every day:
- Morning devotional shares
- Prayer for each other's ministries
- Client wisdom sharing
- Celebration and encouragement

This isn't posting to strangers.

This is DAILY fellowship with women who share your faith and calling.

When ministry is hard...
When you doubt yourself...
When you have a breakthrough...

Your Circle is there.

Grace told me: "The Mastermind alone is worth $297. It's like having a prayer team specifically for my ministry."

The certification equips you.
The Circle sustains you.

Ready for your Circle? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 20,
        phase: "decision",
        day: 42,
        subject: "Re: what our coaches are experiencing",
        content: cleanContent(`{{firstName}},

What Board Certified Christian Life Coaches are saying:

GRACE, 52, Long-time Church Leader:
"I led Bible studies for 20 years but always felt there was more. Coaching gave me structure for what I did naturally. Now I have 10 clients monthly and it's a real ministry."

JENNIFER, 45, Stay-at-Home Mom:
"My kids are older now and I asked God 'what's next?' This certification was His answer. I help women find their purpose - and I found mine."

MARIA, 39, Former Teacher:
"I left teaching but still wanted to pour into people. Christian coaching lets me do that on MY terms, with my faith at the center."

SHARON, 58, Pastor's Wife:
"I always supported my husband's ministry. Now I have my own. And honestly? It's brought us closer. We're ministry partners now."

None of them are special. They simply answered the call.

Just like you can today.

${ASI_SIGNATURE}`),
    },

    {
        id: 21,
        phase: "decision",
        day: 44,
        subject: "Re: the call doesn't go away",
        content: cleanContent(`{{firstName}},

That pull you feel toward Christian coaching?

It doesn't go away.

I've talked to women who waited years. Who felt the call but didn't answer.

Know what they all say?

"I wish I'd started sooner."

God's calling gets louder, not quieter.

Every day you wait is:
- Someone who doesn't get helped
- Ministry that doesn't happen
- Your gifts unused for His kingdom

Not pressuring you. It must be your choice - and His leading.

But make the choice consciously. Not by default.

Complete Certification: $297
Three clients to cover it.
A lifetime of ministry.

If He's calling, trust it: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 4: RE-ENGAGE (Days 46-60)
    // ============================================

    {
        id: 22,
        phase: "re-engage",
        day: 48,
        subject: "Re: still here, still praying",
        content: cleanContent(`{{firstName}},

Haven't heard from you in a while.

That's okay. God's timing is always perfect.

Just wanted you to know: I'm still here. The door is open. Your calling is waiting.

Maybe now isn't the time. Maybe life is full. Maybe you're still seeking clarity.

Whatever is true, I trust God is working.

When you're ready - the certification will be here. I'll be here.

I'm praying for your journey.

In Christ,

${ASI_SIGNATURE}`),
    },

    {
        id: 23,
        phase: "re-engage",
        day: 52,
        subject: "Re: something to encourage you",
        content: cleanContent(`{{firstName}},

Wanted to share something - just because.

A powerful coaching question rooted in faith:

"If fear wasn't a factor and you fully trusted God's provision, what would you do?"

This question bypasses the analytical brain and goes straight to the heart. It's amazing what people reveal when you give them permission to dream with God.

Try asking it - to a friend, a family member, or yourself.

This is from the certification training, but I wanted you to have it now.

Because I believe God has placed coaching gifts in you - whether you pursue certification or not.

${ASI_SIGNATURE}`),
    },

    {
        id: 24,
        phase: "re-engage",
        day: 56,
        subject: "Re: thinking of you",
        content: cleanContent(`{{firstName}},

I was thinking about you today - and praying.

About when you first signed up. Something called you here. A stirring. A sense that God had something.

That stirring is still there.

Maybe louder now.

I don't know what your journey looks like. But I know this:

The world needs Christian coaches. Women are hungry for guidance that honors their faith. Churches need resources. And there are never enough trained, certified coaches.

If you want to continue this conversation - about certification, about calling, about anything - just reply.

I'm here. And so is He.

${ASI_SIGNATURE}`),
    },

    {
        id: 25,
        phase: "re-engage",
        day: 60,
        subject: "Re: one final thought",
        content: cleanContent(`{{firstName}},

This is my last scheduled message in this sequence.

I want to leave you with this:

You found your way to Christian coaching for a reason. Whether you ever pursue certification or not - that calling is real. Those gifts are real. The desire to serve others through faith-based guidance is real.

Whatever path you take, I pray you:
- Listen closely to His voice
- Use your gifts however He leads
- Remember that He is faithful

If someday the time is right: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Until then, may He bless you and keep you.

Thank you for being part of this community, even briefly.

In His love,

${ASI_SIGNATURE}

P.S. I believe in your calling. I believe He has beautiful things planned for you.`),
    },
];

export type ChristianCoachingNurtureEmail = typeof CHRISTIAN_COACHING_NURTURE_SEQUENCE[number];
