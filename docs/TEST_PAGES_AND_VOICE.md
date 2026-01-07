# Test Pages & Voice/Audio Reference

> Quick reference for all test pages and voice generation endpoints in AccrediPro

---

## 🎙️ Voice/Audio Test Pages

| Page | Local URL | Production URL | Purpose |
|------|-----------|----------------|---------|
| **Voice Test (Admin)** | `localhost:3000/admin/voice-test` | `learn.accredipro.academy/admin/voice-test` | Main admin voice testing panel |
| **Voice Test (Public)** | `localhost:3000/voice-test` | `learn.accredipro.academy/voice-test` | Public voice testing |
| **Test Audio Final Exam** | `localhost:3000/test-audio-final-exam` | `learn.accredipro.academy/test-audio-final-exam` | Final exam audio testing |

---

## 🔊 Voice/Audio API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/tts` | POST | Text-to-Speech (ElevenLabs → OpenAI fallback) |
| `/api/ai/voice-reply` | POST | AI voice reply generation |
| `/api/voice-test` | POST | Voice test API |
| `/api/admin/voice-test` | POST | Admin voice test API |
| `/api/test-audio` | POST | Audio test endpoint |
| `/api/public/tts` | POST | Public TTS endpoint |

---

## 🧪 Other Test Pages

### Community & Chat
| Page | Local URL | Purpose |
|------|-----------|---------|
| **Community Test** | `localhost:3000/community/test` | Community feature testing |
| **Chat Test** | `localhost:3000/chat-test` | Chat widget testing |
| **Live Chat Test** | `localhost:3000/test-live-chat` | Live chat testing |

### Email
| Page | Local URL | Purpose |
|------|-----------|---------|
| **Email Test (Admin)** | `localhost:3000/admin/email-test` | Email template testing |
| **Inbox Test** | `localhost:3000/admin/marketing/inbox-test` | Marketing inbox testing |

### Certificates
| Page | Local URL | Purpose |
|------|-----------|---------|
| **Certificate Test** | `localhost:3000/test-certificates` | Certificate generation testing |

### Other
| Page | Local URL | Purpose |
|------|-----------|---------|
| **FM Test** | `localhost:3000/fm-test-1` | Functional Medicine page test |
| **Testimonials** | `localhost:3000/testimonials` | Testimonials page |

---

## 🎙️ ElevenLabs Voice Setup (Sarah)

### Voice Configuration
```typescript
// Located in: src/lib/elevenlabs.ts

Voice ID: "Rn0vawuWHBy1e0yur4D8"  // Sarah's cloned voice
Model: "eleven_turbo_v2_5"        // English-focused, fast, high quality
Output: "mp3_44100_128"           // High quality MP3
```

### Voice Settings (Tested & Approved)
```typescript
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.60,       // Balanced - reduces random breaths
  similarityBoost: 0.80, // Good similarity to original voice
  style: 0.25,           // Lower = less breathy/sighing
  speed: 0.90,           // Medium pace, natural
};
```

### Environment Variables Required
```bash
ELEVENLABS_API_KEY=your_api_key
SARAH_VOICE_ID=Rn0vawuWHBy1e0yur4D8
OPENAI_API_KEY=your_openai_key  # Fallback TTS
```

---

## 📱 OpenAI TTS Fallback

If ElevenLabs fails, the system falls back to OpenAI TTS:

```typescript
// Located in: src/app/api/ai/tts/route.ts

Model: "tts-1"
Voice: "nova"  // Maps to Sarah's voice style
Format: "mp3"
```

---

## 🛒 Using for Checkout Page Audio

1. Go to `/admin/voice-test`
2. Enter your script in the text box
3. Click "Generate Voice"
4. Download the MP3 file
5. Upload to your checkout page

### Example Scripts

**Urgency Script:**
```
You're just one step away from transforming your career. Join over 5,000 women who have already changed their lives with AccrediPro certification. Complete your enrollment now to lock in this special price.
```

**Welcome Script:**
```
Congratulations on taking this step! I'm so excited to welcome you to the AccrediPro family. In just a few weeks, you'll have the skills and certification to start your dream career.
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/elevenlabs.ts` | ElevenLabs voice generation library |
| `src/app/api/ai/tts/route.ts` | TTS API endpoint |
| `src/app/(admin)/admin/voice-test/page.tsx` | Admin voice test page |
| `src/app/(public)/voice-test/page.tsx` | Public voice test page |
