# AccrediPro PWA (Progressive Web App)

This document covers the PWA implementation for AccrediPro Academy, including installation, push notifications, offline support, and configuration.

## Overview

AccrediPro is a full Progressive Web App that allows users to:
- **Install** the app to their home screen (like a native app)
- **Receive push notifications** for messages, certificates, and reminders
- **Access lessons offline** (cached for 30 days)
- **Open without browser chrome** (standalone mode)

---

## Table of Contents

1. [Installation](#installation)
2. [Push Notifications](#push-notifications)
3. [Offline Support](#offline-support)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Files & Components](#files--components)

---

## Installation

### How Users Install

#### Android / Chrome / Edge
1. User visits `https://learn.accredipro.academy`
2. Either:
   - **Auto-prompt**: After 30 seconds, an install banner appears
   - **Manual**: Click "Install App" button in sidebar
3. Browser shows native install dialog
4. One tap → App installed to home screen

#### iOS Safari
1. User visits the site in Safari
2. Either:
   - **Auto-prompt**: After 30 seconds, instructions appear
   - **Manual**: Click "Install App" button in sidebar
3. Visual guide shows 3 steps:
   - Tap Share button (bottom of Safari)
   - Scroll and tap "Add to Home Screen"
   - Tap "Add" to confirm
4. App appears on home screen

### Install Button Locations

- **Desktop sidebar**: Bottom of navigation, above user profile
- **Mobile menu**: Bottom of menu, above user profile
- **Auto-prompt**: Fixed banner at bottom of screen (appears after 30s)

### When Button Hides

The install button automatically hides when:
- App is already installed (running in standalone mode)
- User dismissed the prompt (hidden for 24 hours)
- Browser doesn't support PWA installation

---

## Push Notifications

### Supported Notification Types

| Type | Description | Preference Key |
|------|-------------|----------------|
| Messages | New DM from mentor/coach | `messagesEnabled` |
| Courses | Certificate earned, module complete | `coursesEnabled` |
| Reminders | Lesson reminders, deadlines | `remindersEnabled` |
| Marketing | Promotional (disabled by default) | `marketingEnabled` |

### How Push Works

1. **Permission Request**: User clicks "Enable Notifications" or auto-subscribes if permission already granted
2. **Subscription**: Browser creates push subscription with VAPID keys
3. **Storage**: Subscription saved to `PushSubscription` table in database
4. **Sending**: When event occurs (e.g., new message), server sends push via `web-push` library
5. **Display**: Service worker (`sw-push.js`) shows notification
6. **Click**: Tapping notification opens the app to relevant page

### Auto-Subscribe Behavior

- If user previously granted notification permission, the app **automatically subscribes** them silently
- No popup shown for returning users with permission
- New users see prompt after 60 seconds on page

### VAPID Keys

Push notifications require VAPID (Voluntary Application Server Identification) keys.

**Generate new keys:**
```bash
npx web-push generate-vapid-keys --json
```

**Environment variables required:**
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

**Current production keys:**
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BML9uQi4t3Y5ZOg6qNBouq6nn7_oa_orPsqROsVBZP1s2TKE62pVU_vrtx1RrBxqLq301NL37IuEqdGk1X2DWD8
VAPID_PRIVATE_KEY=zfXow4feC-NfxIDs5iN_qLxY48XhTC8jzPre0Hs2Z30
```

---

## Offline Support

### What's Cached

| Content Type | Cache Strategy | Duration | Cache Name |
|--------------|----------------|----------|------------|
| Lesson pages | CacheFirst | 30 days | `lesson-cache` |
| Images | CacheFirst | 30 days | `image-cache` |
| Fonts | CacheFirst | 1 year | `font-cache` |
| API responses | StaleWhileRevalidate | 5 minutes | `api-cache` |
| Static assets | CacheFirst | 1 year | `static-cache` |

### Offline Fallback

When user is offline and requests an uncached page:
- Shows `/offline` page
- Displays "You're Offline" message
- Lists tips and "View Offline Lessons" button
- "Try Again" button to refresh

### Cache Configuration

See `next.config.ts` for `runtimeCaching` rules:

```typescript
runtimeCaching: [
  {
    urlPattern: /^https:\/\/learn\.accredipro\.academy\/learning\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "lesson-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
  },
  // ... more rules
]
```

---

## Configuration

### Manifest (`/public/manifest.json`)

```json
{
  "name": "AccrediPro Academy",
  "short_name": "AccrediPro",
  "description": "Board Certified Functional Medicine Practitioner Certification",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#fdf8f0",
  "theme_color": "#722f37",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "shortcuts": [
    { "name": "My Courses", "url": "/my-courses" },
    { "name": "Messages", "url": "/messages" }
  ]
}
```

### App Icons

Icons are PNG files generated from the ASI logo:
- Located in `/public/icons/`
- Sizes: 72, 96, 128, 144, 152, 192, 384, 512 pixels
- Generated via `node scripts/generate-pwa-icons.js`

To regenerate icons:
```bash
npm install sharp --save-dev
node scripts/generate-pwa-icons.js
```

### Meta Tags (in `layout.tsx`)

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#722f37" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="AccrediPro" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
```

---

## Testing

### Test PWA Installation

1. **Chrome DevTools**:
   - Open DevTools → Application tab
   - Check "Manifest" section for errors
   - Check "Service Workers" for registration status

2. **Lighthouse Audit**:
   - DevTools → Lighthouse → Check "Progressive Web App"
   - Run audit to see PWA score

3. **Manual Test**:
   - Visit site in incognito
   - Wait 30 seconds for install prompt
   - Or click "Install App" in sidebar

### Test Push Notifications

1. **Enable in browser**:
   - Click "Enable Notifications" in app
   - Or sidebar "Install App" → then notifications prompt

2. **Send test notification**:
   - Send a message to yourself from admin
   - Check if push appears on device

3. **Debug in DevTools**:
   - Application → Service Workers → "Push" button
   - Enter test payload: `{"title":"Test","body":"Hello"}`

### Test Offline Mode

1. Install PWA and visit some lessons
2. DevTools → Network → Check "Offline"
3. Try to access visited lessons (should work)
4. Try to access unvisited page (should show offline page)

---

## Files & Components

### Core PWA Files

| File | Purpose |
|------|---------|
| `/public/manifest.json` | PWA manifest (name, icons, colors) |
| `/public/sw-push.js` | Custom service worker for push handling |
| `/public/icons/*.png` | App icons (8 sizes) |
| `/next.config.ts` | PWA configuration with `next-pwa` |

### React Components

| Component | File | Purpose |
|-----------|------|---------|
| `PWAInstallPrompt` | `/src/components/pwa/install-prompt.tsx` | Auto-popup install banner |
| `PushNotificationPrompt` | `/src/components/pwa/push-notification-prompt.tsx` | Push permission prompt |
| `InstallAppButton` | `/src/components/pwa/install-app-button.tsx` | Sidebar install button |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/push/subscribe` | GET | Get VAPID public key |
| `/api/push/subscribe` | POST | Save push subscription |
| `/api/push/subscribe` | DELETE | Remove subscription |
| `/api/push/preferences` | GET | Get notification preferences |
| `/api/push/preferences` | PATCH | Update preferences |

### Hooks

| Hook | File | Purpose |
|------|------|---------|
| `usePushNotifications` | `/src/hooks/use-push-notifications.ts` | Manage push state & actions |

### Backend Services

| Service | File | Purpose |
|---------|------|---------|
| `push-notifications.ts` | `/src/lib/push-notifications.ts` | Send push notifications |

### Database

**PushSubscription model** (in `prisma/schema.prisma`):

```prisma
model PushSubscription {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String   @unique
  p256dh    String
  auth      String
  userAgent String?
  deviceType String?
  messagesEnabled  Boolean @default(true)
  coursesEnabled   Boolean @default(true)
  remindersEnabled Boolean @default(true)
  marketingEnabled Boolean @default(false)
  lastPushAt    DateTime?
  failureCount  Int @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user User @relation(...)
}
```

---

## Troubleshooting

### Install Button Not Showing

1. **Already installed**: Check if running in standalone mode
2. **Browser not supported**: Safari on iOS doesn't support `beforeinstallprompt`
3. **HTTPS required**: PWA only works on HTTPS (or localhost)

### Push Not Working

1. **Check VAPID keys**: Ensure env vars are set in Vercel
2. **Check console**: Look for `[Push]` prefixed logs
3. **Check subscription**: Query `PushSubscription` table for user
4. **Permission denied**: User blocked notifications in browser settings

### Offline Not Working

1. **Service worker not registered**: Check DevTools → Application → Service Workers
2. **Page not cached**: Only visited pages are cached
3. **Cache expired**: Lessons cached for 30 days max

---

## Future Improvements

- [ ] Background sync for offline form submissions
- [ ] Push notification preferences UI in settings
- [ ] Badge count on app icon (requires iOS 16.4+)
- [ ] Share target (receive shares from other apps)
- [ ] File handling (open course files directly)

---

*Last updated: January 2026*
