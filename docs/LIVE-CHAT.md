# Live Chat System Documentation

## Overview

The Live Chat system enables real-time conversations between potential students on sales pages and Sarah (AI-powered or human admin). It captures leads, logs conversations, and provides an admin panel for monitoring and responding.

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Sales Page        │────▶│   /api/chat/sales   │────▶│   Anthropic API     │
│   (chat-test.html)  │     │   (Next.js API)     │     │   (Claude Sonnet)   │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │   PostgreSQL DB     │
                            │   - SalesChat       │
                            │   - ChatOptin       │
                            └─────────────────────┘
                                      │
                                      ▼
┌─────────────────────┐     ┌─────────────────────┐
│   Admin Panel       │◀────│  /api/admin/        │
│   /admin/live-chat  │     │  live-chat          │
└─────────────────────┘     └─────────────────────┘
```

## Database Models

### SalesChat
Stores all chat messages (visitor and AI/admin responses).

```prisma
model SalesChat {
  id            String    @id @default(cuid())
  visitorId     String    // Unique visitor identifier
  page          String    // Source page (e.g., "fm-certification")
  message       String    @db.Text
  isFromVisitor Boolean   @default(true)
  isRead        Boolean   @default(false)
  repliedBy     String?   // Admin user ID if human replied
  visitorName   String?   // Name if visitor opted in
  visitorEmail  String?   // Email if visitor opted in
  createdAt     DateTime  @default(now())
}
```

### ChatOptin
Stores lead information from chat optins.

```prisma
model ChatOptin {
  id          String    @id @default(cuid())
  visitorId   String    @unique
  name        String
  email       String?
  page        String    // Which page they opted in on
  ipAddress   String?
  userAgent   String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## API Endpoints

### POST /api/chat/sales
Public endpoint for visitor messages.

**Request:**
```json
{
  "message": "What certifications do I get?",
  "page": "fm-certification",
  "visitorId": "visitor_abc123",
  "userName": "Jennifer",
  "userEmail": "jennifer@example.com"
}
```

**Response:**
```json
{
  "reply": "Great question! You'll receive 9 internationally recognized certifications..."
}
```

**Features:**
- CORS enabled for cross-origin requests
- Saves visitor message to database
- Creates/updates ChatOptin record if name provided
- Calls Claude Sonnet for AI response
- Saves AI response to database
- Falls back to static response on error

### GET /api/admin/live-chat
Admin endpoint to fetch all conversations.

**Response:**
```json
{
  "conversations": [
    {
      "visitorId": "visitor_abc123",
      "visitorName": "Jennifer",
      "visitorEmail": "jennifer@example.com",
      "page": "fm-certification",
      "messages": [...],
      "lastMessage": "Thanks!",
      "lastMessageAt": "2024-12-21T...",
      "unreadCount": 2
    }
  ]
}
```

**Authentication:** Requires ADMIN or INSTRUCTOR role.

### POST /api/admin/live-chat/reply
Admin endpoint to send replies.

**Request:**
```json
{
  "visitorId": "visitor_abc123",
  "message": "Let me help you with that!",
  "useAI": false
}
```

Or for AI-generated reply:
```json
{
  "visitorId": "visitor_abc123",
  "useAI": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Let me help you with that!"
}
```

### GET /api/admin/chat-optins
Admin endpoint to fetch all chat leads.

**Response:**
```json
{
  "optins": [
    {
      "id": "...",
      "visitorId": "visitor_abc123",
      "name": "Jennifer",
      "email": "jennifer@example.com",
      "page": "fm-certification",
      "createdAt": "2024-12-21T...",
      "messageCount": 5
    }
  ]
}
```

## Frontend Components

### Chat Widget (chat-test.html)
Located at `/public/chat-test.html` for testing.

**Features:**
- Opt-in form (name + optional email)
- Skip option for anonymous chat
- Real-time messaging with typing indicator
- LocalStorage persistence for visitor ID and name
- Debug panel for testing

**JavaScript Functions:**
- `toggleChat()` - Open/close chat window
- `startChat()` - Submit opt-in form
- `skipOptin()` - Skip opt-in, use as "Friend"
- `sendChatMessage()` - Send message to API

### Admin Panel (/admin/live-chat)
React component at `src/app/(admin)/admin/live-chat/page.tsx`.

**Features:**
- Conversation list with unread counts
- Real-time polling (10 second intervals)
- Message thread view
- Manual reply input
- AI Reply button (generates response via Claude)
- Quick reply templates
- Mark messages as read

### Chat Leads Page (/admin/chat-optins)
React component at `src/app/(admin)/admin/chat-optins/page.tsx`.

**Features:**
- Stats cards (total leads, with email, capture rate)
- Searchable lead list
- Export to CSV
- Link to view conversation

## AI System Prompt

Sarah's personality is defined in the API route:

```
You are Sarah, the lead instructor and mentor at AccrediPro Academy.

Your personality:
- Warm, friendly, and genuinely helpful
- Passionate about functional medicine
- Confident but not pushy
- Conversational and personable

Key information about FM Certification:
- Price: $97 (80% off, normally $497)
- 9 International Certifications
- 30-Day DEPTH Method Training
- Personal Mentorship
- Private Community
- 14 Bonuses worth $4,959
- 30-Day Certification Guarantee

Keep responses conversational, 2-4 sentences max.
```

## CORS Configuration

The chat API supports cross-origin requests:

```typescript
// /api/chat/sales - allows all origins
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// /api/admin/* - restricted to sarah.accredipro.academy
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sarah.accredipro.academy",
  "Access-Control-Allow-Credentials": "true",
};
```

## Deployment

### Database Setup
Run Prisma migrations to create tables:

```bash
npx prisma db push
```

### Environment Variables
Required in `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
```

## Testing

1. Go to `/chat-test.html`
2. Open the chat widget
3. Enter name or skip
4. Send a test message
5. Check debug panel for API responses
6. Verify in `/admin/live-chat`
7. Check leads in `/admin/chat-optins`

## File Locations

```
src/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── sales/
│   │   │       └── route.ts          # Public chat API
│   │   └── admin/
│   │       ├── live-chat/
│   │       │   ├── route.ts          # Get conversations
│   │       │   └── reply/
│   │       │       └── route.ts      # Send replies
│   │       └── chat-optins/
│   │           └── route.ts          # Get leads
│   └── (admin)/
│       └── admin/
│           ├── live-chat/
│           │   └── page.tsx          # Admin chat panel
│           └── chat-optins/
│               └── page.tsx          # Leads dashboard

public/
├── chat-test.html                    # Test page with debug
└── winning_sp.html                   # Sales page (widget hidden)

prisma/
└── schema.prisma                     # SalesChat & ChatOptin models
```

## Future Enhancements

- [ ] Real-time updates via WebSocket/SSE
- [ ] Push notifications for new messages
- [ ] Canned responses library
- [ ] Chat analytics dashboard
- [ ] Integration with email marketing
- [ ] Mobile app notifications
