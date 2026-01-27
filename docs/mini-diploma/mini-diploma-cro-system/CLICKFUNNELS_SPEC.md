# ClickFunnels VSL Page Specification

> Technical requirements for the Live VSL Scholarship Page.
> Built in ClickFunnels 2.0 with native CF checkout.

---

## Video Details

**Wistia Video ID:** `3go641tx38`

**Embed Code:**
```html
<script src="https://fast.wistia.com/player.js" async></script>
<script src="https://fast.wistia.com/embed/3go641tx38.js" async type="module"></script>
<style>
  wistia-player[media-id='3go641tx38']:not(:defined) {
    background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/3go641tx38/swatch');
    display: block;
    filter: blur(5px);
    padding-top: 56.25%;
  }
</style>
<wistia-player media-id="3go641tx38" aspect="1.7777777777777777"></wistia-player>
```

**Checkout:** Native ClickFunnels checkout (not Fanbasis embed)

---

## Page URL Structure

```
https://accelerator.accredipro.academy/scholarship
https://accelerator.accredipro.academy/scholarship-complete (thank you page)
```

Or subdomain on ClickFunnels:
```
https://scholarship.accredipro.com/live
https://scholarship.accredipro.com/welcome
```

---

## Page Sections

### Section 1: Header (Sticky)

**Elements:**
- AccrediPro logo (left)
- "🔴 LIVE" indicator with pulse animation (center)
- Viewer count: "47 graduates watching" (right)
- Progress bar showing video position (bottom border)

**Styling:**
```css
.header {
  background: linear-gradient(135deg, #722F37, #8B3A42);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 24px;
}

.live-indicator {
  background: #ff4444;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

### Section 2: Hero (Above Fold)

**Layout:** Two columns (65% video, 35% chat)

**Left Column - Video:**
- Title: "Live Graduate Training with Sarah"
- Subtitle: "Watch now - your $297 scholarship expires in [COUNTDOWN]"
- Video player (Wistia/Vimeo embed)
  - Custom play button overlay
  - No visible controls (auto-play after click)
  - Disable seeking forward
- Below video: Scholarship spots remaining indicator

**Right Column - Chat:**
- Header: "Live Chat (47 online)"
- Chat feed (scrolling messages)
- Input field: "Type a message..."
- Send button

**Video Player Requirements:**
```javascript
// Wistia embed with custom settings
window._wq = window._wq || [];
_wq.push({
  id: "3go641tx38",
  options: {
    autoPlay: false,
    controlsVisibleOnLoad: false,
    playButton: true,
    seekbarEnabled: false,  // Disable scrubbing
    fullscreenButton: false,
    playbackRateControl: false,
    volumeControl: true,
    qualityControl: false
  },
  onReady: function(video) {
    // Track video events
    video.bind("play", function() {
      window.startZombieChat();
    });
    video.bind("pause", function() {
      window.pauseZombieChat();
    });
    video.bind("timechange", function(t) {
      window.syncChatToVideo(t);
    });
  }
});
```

---

### Section 3: Social Proof Bar

**Layout:** Horizontal scrolling logos/badges

**Content:**
- "As Recognized By:"
- IPHM logo
- CMA logo
- CPD logo
- IAOTH logo
- "9 International Accreditations"

**Styling:**
```css
.social-proof-bar {
  background: #f8f9fa;
  padding: 20px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.logos {
  display: flex;
  align-items: center;
  gap: 40px;
  overflow-x: auto;
}

.logo img {
  height: 50px;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s;
}

.logo img:hover {
  filter: grayscale(0%);
  opacity: 1;
}
```

---

### Section 4: Scholarship Offer (Below Video)

**Visibility:** Hidden until video reaches 38:00

**Content:**
```
YOUR ASI GRADUATE SCHOLARSHIP

You Qualified! Here's What's Included:

✓ Foundation Certificate (30 days)
✓ Professional Certificate (60 days)
✓ Board Certification (90 days)
✓ 9 International Accreditations
✓ 150-Hour DEPTH Method Training
✓ 52 Weeks Group Mentorship
✓ Weekly Accountability Pod
✓ Private Practitioner Community
✓ Done-For-You Practice Website
✓ 500+ Clinical Templates
✓ $100K Business Accelerator Box
✓ And 15+ More Bonuses...

Total Value: $24,655
Your Scholarship Price: $297

[CLAIM YOUR SCHOLARSHIP NOW]

⚠️ Only 1 scholarship spot remaining for January
🕐 Your offer expires in: [COUNTDOWN TIMER]
```

**CTA Button:**
- Large, gold gradient button
- Pulsing animation on hover
- Links to embedded Fanbasis checkout (scroll down)

---

### Section 5: Native ClickFunnels Checkout

**Layout:** Full-width, centered, max 800px

**ClickFunnels Native Checkout:**
- Use CF 2.0's built-in order form element
- Product: ASI Graduate Scholarship - $297
- One-time payment (no subscription)
- Stripe integration for payment processing

**Pre-fill Configuration:**
- Pass user data via URL params: `?email={{email}}&firstName={{firstName}}&score={{score}}`
- CF will auto-populate form fields from URL params
- Add hidden fields for tracking (fbclid, utm_source, etc.)

**Order Bump (Optional):**
- "Add Priority Support - $47"
- Includes direct Sarah access for 90 days

**Checkout Form Fields:**
- Email (pre-filled)
- First Name (pre-filled)
- Last Name
- Card Number
- Expiry / CVV
- [ ] I agree to terms and conditions

**Post-Purchase:**
- Redirect to Thank You page
- Webhook to AccrediPro for enrollment
- Facebook Purchase event fires

---

### Section 6: FAQ Accordion

**Questions:**

1. **"What exactly do I get for $297?"**
> Everything listed above: 3 certification levels, 9 accreditations, 150 hours of clinical training, 52 weeks of mentorship, your accountability pod, done-for-you website, 500+ templates, and all the bonuses. It's normally $997+ and comparable programs charge $4,000-6,000.

2. **"Is this actually accredited?"**
> Yes! We hold 9 international accreditations including IPHM, CMA, CPD, and IAOTH. These are real, verifiable credentials you can add to LinkedIn and display in your practice.

3. **"What if I'm not a healthcare professional?"**
> Perfect! Many of our most successful graduates had zero health background. Sarah, a stay-at-home mom, made $6,200 her second month. The certification teaches you everything from scratch.

4. **"How long does it take?"**
> Most graduates complete the full certification in 12-16 weeks, studying about 1 hour per day. It's completely self-paced, so you can go faster or slower based on your schedule.

5. **"What if it doesn't work for me?"**
> We have a 30-day money-back guarantee. If you do the work and don't feel it's worth it, we'll refund you. Our refund rate is under 3% because the training actually works.

6. **"Why is the scholarship so cheap?"**
> Because you proved yourself. You scored in the top 5% on the exam. The scholarship is our way of investing in women who've shown they're serious. We can only offer 3 per month at this price.

---

### Section 7: Guarantee Box

**Content:**
```
🛡️ THE SARAH GUARANTEE

I'm so confident this will work for you that I personally guarantee it:

✓ 30-Day Money-Back Guarantee
  No questions asked. If it's not for you, full refund.

✓ 100% Certification Guarantee
  If you do the work, you WILL get certified. I make sure of it.

✓ First Client Support
  I don't stop until you get your first paying client.

You have nothing to lose and everything to gain.

This is the exact system that's created 1,247+ certified practitioners.

Now it's your turn.

[CLAIM YOUR SCHOLARSHIP - $297]
```

---

### Section 8: Footer

**Content:**
- AccrediPro logo
- "AccrediPro Standards Institute | New York | Dubai"
- "1,247+ Certified Practitioners Worldwide"
- Links: Privacy Policy | Terms | Contact
- Copyright

---

## Custom Code Requirements

### Zombie Chat System

```javascript
// zombie-chat.js

const ZOMBIE_MESSAGES = [
  // Load from ZOMBIE_CHAT_SCRIPT.md
];

let currentVideoTime = 0;
let chatScheduler = null;

function startZombieChat() {
  chatScheduler = setInterval(() => {
    const currentTime = getCurrentVideoTime();
    const messagesToShow = ZOMBIE_MESSAGES.filter(
      m => m.timestamp <= currentTime && m.timestamp > currentTime - 1
    );

    messagesToShow.forEach(msg => {
      addMessageToChat(msg);
    });
  }, 1000);
}

function pauseZombieChat() {
  clearInterval(chatScheduler);
}

function addMessageToChat(msg) {
  const chatFeed = document.getElementById('chat-feed');
  const messageEl = createMessageElement(msg);
  chatFeed.appendChild(messageEl);
  chatFeed.scrollTop = chatFeed.scrollHeight;

  // Animate entry
  messageEl.animate([
    { opacity: 0, transform: 'translateY(10px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 300 });
}

function createMessageElement(msg) {
  const div = document.createElement('div');
  div.className = `chat-message chat-${msg.type.toLowerCase()}`;

  if (msg.type === 'CHAT') {
    div.innerHTML = `
      <img src="${msg.avatar}" class="chat-avatar" />
      <div class="chat-content">
        <span class="chat-name">${msg.name}</span>
        <span class="chat-text">${msg.message}</span>
      </div>
    `;
  } else if (msg.type === 'SARAH') {
    div.innerHTML = `
      <img src="/sarah-avatar.jpg" class="chat-avatar sarah" />
      <div class="chat-content sarah">
        <span class="chat-name">Sarah (Host)</span>
        <span class="chat-text">${msg.message}</span>
      </div>
    `;
  } else if (msg.type === 'ENROLL') {
    div.innerHTML = `
      <div class="enrollment-notification">
        🎉 ${msg.message}
      </div>
    `;
  } else if (msg.type === 'ALERT') {
    div.innerHTML = `
      <div class="alert-notification">
        ⚠️ ${msg.message}
      </div>
    `;
  }

  return div;
}
```

### Real User Chat Handler

```javascript
// real-user-chat.js

async function sendUserMessage(message) {
  const userEmail = getUserEmail();
  const userName = getUserFirstName();
  const videoTime = getCurrentVideoTime();

  // Show user's message immediately
  addMessageToChat({
    type: 'USER',
    name: userName || 'You',
    message: message,
    timestamp: Date.now()
  });

  // Send to Sarah AI for response
  const response = await fetch('/api/sarah-ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      userEmail,
      userName,
      videoTime,
      context: 'live_vsl'
    })
  });

  const { reply, delay } = await response.json();

  // Show Sarah's response after natural delay
  setTimeout(() => {
    addMessageToChat({
      type: 'SARAH',
      name: 'Sarah (Host)',
      message: reply,
      timestamp: Date.now()
    });
  }, delay || 3000);
}
```

### Scholarship Countdown

```javascript
// countdown.js

function initCountdown() {
  const deadline = getUserScholarshipDeadline(); // From URL param or cookie

  setInterval(() => {
    const now = new Date();
    const diff = deadline - now;

    if (diff <= 0) {
      showExpiredState();
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
      ${hours}h ${minutes}m ${seconds}s
    `;
  }, 1000);
}
```

### Spots Counter

```javascript
// spots-counter.js

let spotsRemaining = 3; // Start with 3

function initSpotsCounter() {
  updateSpotsDisplay();

  // Decrease spots at specific video timestamps
  const decreaseTimestamps = [450, 825, 1080, 1380, 1890, 2250]; // in seconds

  video.bind('timechange', (t) => {
    if (decreaseTimestamps.includes(Math.floor(t)) && spotsRemaining > 1) {
      spotsRemaining--;
      updateSpotsDisplay();
      showSpotTakenAnimation();
    }
  });
}

function updateSpotsDisplay() {
  const el = document.getElementById('spots-remaining');
  el.textContent = spotsRemaining;

  if (spotsRemaining === 1) {
    el.classList.add('urgent');
    showLastSpotWarning();
  }
}

function showSpotTakenAnimation() {
  // Flash the spots counter
  const el = document.getElementById('spots-counter');
  el.animate([
    { backgroundColor: '#ff4444' },
    { backgroundColor: 'transparent' }
  ], { duration: 500 });

  // Show toast notification
  showToast('🎉 Another graduate just enrolled!');
}
```

---

## Tracking & Analytics

### Facebook Pixel Events

```javascript
// On page load
fbq('track', 'ViewContent', {
  content_name: 'ASI Scholarship VSL',
  content_category: 'certification',
  value: 297,
  currency: 'USD'
});

// On video play
fbq('track', 'CustomEvent', { event: 'VSL_Started' });

// At video milestones
fbq('track', 'CustomEvent', { event: 'VSL_25' }); // 25%
fbq('track', 'CustomEvent', { event: 'VSL_50' }); // 50%
fbq('track', 'CustomEvent', { event: 'VSL_75' }); // 75%
fbq('track', 'CustomEvent', { event: 'VSL_Complete' }); // 100%

// On checkout scroll
fbq('track', 'InitiateCheckout', {
  value: 297,
  currency: 'USD'
});

// On purchase (from Fanbasis webhook)
fbq('track', 'Purchase', {
  value: 297,
  currency: 'USD',
  content_name: 'ASI Graduate Scholarship'
});
```

### Google Analytics 4 Events

```javascript
gtag('event', 'video_start', { video_title: 'ASI Scholarship VSL' });
gtag('event', 'video_progress', { video_percent: 25 });
gtag('event', 'video_complete', { video_title: 'ASI Scholarship VSL' });
gtag('event', 'begin_checkout', { value: 297 });
gtag('event', 'purchase', { value: 297 });
```

---

## Mobile Responsiveness

### Breakpoints

```css
/* Desktop: Side-by-side video and chat */
@media (min-width: 1024px) {
  .hero-section {
    display: grid;
    grid-template-columns: 65% 35%;
    gap: 20px;
  }
}

/* Tablet: Video above, chat below */
@media (max-width: 1023px) and (min-width: 768px) {
  .hero-section {
    display: flex;
    flex-direction: column;
  }

  .chat-column {
    height: 300px;
  }
}

/* Mobile: Full-width video, collapsible chat */
@media (max-width: 767px) {
  .hero-section {
    display: flex;
    flex-direction: column;
  }

  .chat-column {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50vh;
    transform: translateY(calc(100% - 50px));
    transition: transform 0.3s;
  }

  .chat-column.expanded {
    transform: translateY(0);
  }

  .chat-toggle {
    display: block;
    padding: 15px;
    text-align: center;
    background: #722F37;
    color: white;
    cursor: pointer;
  }
}
```

---

## URL Parameters

| Param | Purpose | Example |
|-------|---------|---------|
| `email` | Pre-fill checkout | `?email=user@example.com` |
| `firstName` | Personalize page | `?firstName=Maria` |
| `score` | Show exam score | `?score=95` |
| `deadline` | Set countdown | `?deadline=2024-01-16T23:59:59` |
| `fbclid` | Facebook tracking | Auto-appended by FB |
| `utm_source` | Attribution | `?utm_source=email` |
| `ref` | Referral tracking | `?ref=jennifer123` |

---

## Testing Checklist

- [ ] Video plays on desktop Chrome, Safari, Firefox
- [ ] Video plays on mobile iOS Safari, Android Chrome
- [ ] Zombie chat syncs correctly with video
- [ ] Real user messages send and receive responses
- [ ] Countdown timer works and shows correct deadline
- [ ] Spots counter decreases at correct video timestamps
- [ ] Fanbasis checkout loads and accepts payment
- [ ] Facebook Pixel fires all events
- [ ] GA4 tracks video progress and conversions
- [ ] Mobile chat toggle works smoothly
- [ ] Page loads in < 3 seconds on 4G
- [ ] All CTAs link to correct checkout
- [ ] Thank you page redirect works after purchase
