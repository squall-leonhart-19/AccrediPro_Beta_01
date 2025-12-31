# Login Failure Fix: JWT Token Bloat

**Date Fixed:** December 31, 2024
**Severity:** Critical - Users unable to login
**Affected:** Cloned accounts and accounts with large avatar URLs

---

## Problem Summary

Users were experiencing login failures with the error message:
```
An error occurred. Please try again.
```

Despite server logs showing successful password validation:
```
[AUTH] Password valid: true
```

---

## Symptoms

1. **Client-side error**: "An error occurred. Please try again."
2. **Browser console error**: `Failed to execute 'json' on 'Response': Unexpected end of JSON input`
3. **Server logs**: Password validation succeeded, but response was truncated
4. **Pattern**: Often occurred with cloned accounts or accounts with avatar images

---

## Root Cause

### JWT Token Size Exceeded Limits

NextAuth stores session data in JWT tokens, which are stored in cookies. When the `image` (avatar URL) was included in the JWT payload, it caused several issues:

1. **Token size bloat**: Base64-encoded avatar URLs can be 50KB+
2. **Cookie chunking**: NextAuth splits large tokens into multiple cookies (`.0`, `.1`, `.2`, etc.)
3. **Response truncation**: Large JWT responses were being cut off mid-stream
4. **Vercel header limits**: ~8KB limit for request headers

### The Chain of Events

```
User login
    ↓
Password validated ✓
    ↓
JWT token created with avatar URL
    ↓
Token too large → Response truncated
    ↓
Client receives incomplete JSON
    ↓
"Unexpected end of JSON input" error
    ↓
Login fails despite valid credentials
```

---

## Solution

### 1. Remove Avatar from JWT Token

In `/src/lib/auth.ts`, the `authorize` function was updated to return `image: null`:

```typescript
// Note: Don't include image/avatar in JWT - it can cause token size issues
// Avatar is fetched separately when needed
return {
  id: user.id,
  email: user.email,
  name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
  image: null, // Removed to prevent JWT bloat
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  isFirstLogin,
};
```

### 2. Fire-and-Forget Database Operations

Non-critical database operations (login stats, login history) were changed to fire-and-forget to prevent response delays:

```typescript
// Update user login stats - fire and forget (don't await to prevent timeout)
prisma.user.update({
  where: { id: user.id },
  data: {
    lastLoginAt: now,
    firstLoginAt: isFirstLogin ? now : undefined,
    loginCount: { increment: 1 },
  },
}).then(() => {
  console.log("[AUTH] Login stats updated for:", user.id);
}).catch((err) => {
  console.error("[AUTH] Failed to update login stats:", err);
});

// Create login history record - fire and forget
prisma.loginHistory.create({
  data: {
    userId: user.id,
    ipAddress,
    userAgent,
    device,
    browser,
    isFirstLogin,
    loginMethod: "credentials",
  },
}).then(() => {
  console.log("[AUTH] Login history created for:", user.id);
}).catch((err) => {
  console.error("[AUTH] Failed to create login history:", err);
});
```

---

## Additional Safeguards Added

### Middleware Cookie Size Check

`/src/middleware.ts` was previously added to detect and clear oversized cookies before they cause 494 errors:

```typescript
const MAX_COOKIE_SIZE = 6000; // Vercel limit is ~8KB

if (headerSize > MAX_COOKIE_SIZE) {
  // Clear NextAuth cookies and redirect to login
}
```

### Client-Side Cookie Cleanup

`/src/app/(auth)/login/page.tsx` includes a "nuclear cookie cleaner" that runs on page load:

```typescript
useEffect(() => {
  // Clear any stale NextAuth session chunks
  const prefixes = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    // ...
  ];
  // Clear matching cookies
}, []);
```

---

## Files Modified

| File | Change |
|------|--------|
| `/src/lib/auth.ts` | Removed avatar from JWT, made DB ops fire-and-forget |
| `/src/middleware.ts` | Cookie size detection and cleanup |
| `/src/app/(auth)/login/page.tsx` | Client-side cookie cleanup, debug logging |

---

## How to Verify the Fix

1. Clone an account with avatar
2. Attempt to login with cloned account
3. Login should succeed without errors
4. Check browser DevTools → Application → Cookies
5. Session token should be small (not chunked)

---

## Prevention Guidelines

1. **Never store large data in JWT tokens** (avatars, base64 images)
2. **Fetch user images separately** via API when needed
3. **Monitor session cookie size** in production
4. **Use fire-and-forget for non-critical operations** to prevent response delays

---

## Related Issues

- 494 REQUEST_HEADER_TOO_LARGE errors
- Slow login response times
- Clone account login failures
