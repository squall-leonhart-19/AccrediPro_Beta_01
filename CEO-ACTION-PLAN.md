# ASI CEO-Level Action Plan
## Becoming the Coursera of Functional Medicine

*Generated: January 2026*

---

## ✅ COMPLETED TODAY

### Security & Performance
- [x] **Security Headers** - X-Frame-Options, X-Content-Type-Options, XSS-Protection, Referrer-Policy
- [x] **Upstash Redis** - Rate limiting & caching infrastructure ($10/mo Fixed 250MB)
- [x] **Bundle Analyzer** - `npm run build:analyze` for optimization insights
- [x] **Removed duplicate dependency** - @types/bcrypt removed (using bcryptjs)

### SEO & AEO (Answer Engine Optimization)
- [x] **sitemap.xml** - Lite version protecting course catalog from competitors
- [x] **robots.txt** - AI crawler rules (GPTBot, PerplexityBot, ChatGPT-User)
- [x] **llms.txt** - AI search engine optimization file
- [x] **Domain fix** - All URLs now use `learn.accredipro.academy`
- [x] **Schema markup** - FAQPage, Course, Product schemas on key pages
- [x] **Metadata** - Added to fm-pro and fm-dip conversion pages

---

## 🎯 CEO PRIORITY MATRIX

### P0: Critical (This Week)
| Action | Impact | Effort |
|--------|--------|--------|
| Add Google Search Console verification | SEO tracking | 5 min |
| Submit sitemap to Google | Indexing | 5 min |
| Add canonical URLs to all pages | Duplicate content | 2 hrs |
| Convert 74 `<img>` tags to `next/image` | Core Web Vitals | 4 hrs |

### P1: High Priority (This Month)
| Action | Impact | Effort |
|--------|--------|--------|
| Add metadata to remaining 79 pages | SEO | 8 hrs |
| Implement Redis caching on DB queries | Performance | 4 hrs |
| Add blur placeholders to hero images | UX/CWV | 2 hrs |
| Create OG images for all pages | Social sharing | 4 hrs |
| Add Strict-Transport-Security header | Security | 30 min |

### P2: Medium Priority (This Quarter)
| Action | Impact | Effort |
|--------|--------|--------|
| Implement ISR for course pages | Performance | 8 hrs |
| Add A/B testing framework | CRO | 1 week |
| Create API rate limiting middleware | Security | 4 hrs |
| Add structured data for reviews | Rich snippets | 2 hrs |

---

## 🏆 COURSERA PARITY CHECKLIST

### What Coursera Has That We Need

#### Content Discovery
- [ ] **Advanced search** with filters (topic, duration, skill level)
- [ ] **Learning paths** - curated certification sequences
- [ ] **Skill assessments** - pre-course evaluation
- [ ] **Recommendations engine** - personalized suggestions

#### Trust & Social Proof
- [ ] **Verified certificates** - blockchain/unique verification
- [x] **Public directory** - /directory page ✓
- [ ] **Employer partnerships** - logos on homepage
- [ ] **Success metrics** - "X% got promoted" stats
- [ ] **LinkedIn integration** - one-click credential sharing

#### Learning Experience
- [ ] **Mobile app** (React Native)
- [ ] **Offline mode** - download lessons
- [ ] **Subtitles/transcripts** - accessibility
- [ ] **Playback speed** - 0.5x to 2x
- [ ] **Notes & highlights** - in-lesson annotations
- [ ] **Discussion forums** - per-lesson Q&A

#### Business Model
- [ ] **Team/Enterprise plans** - bulk licensing
- [ ] **Financial aid** - scholarship applications
- [ ] **Subscription model** - monthly access option
- [ ] **Gift certificates** - holiday gifting

---

## 📊 METRICS TO TRACK

### Technical KPIs
| Metric | Current | Target |
|--------|---------|--------|
| Lighthouse Performance | ? | >90 |
| LCP (Largest Contentful Paint) | ? | <2.5s |
| FID (First Input Delay) | ? | <100ms |
| CLS (Cumulative Layout Shift) | ? | <0.1 |
| Time to Interactive | ? | <3.5s |

### Business KPIs
| Metric | Target |
|--------|--------|
| Organic traffic growth | +20% MoM |
| Conversion rate (visitor → lead) | >5% |
| Conversion rate (lead → student) | >10% |
| Certificate completion rate | >70% |
| NPS Score | >50 |

---

## 🔧 COMMANDS REFERENCE

```bash
# Analyze bundle size
npm run build:analyze

# Pull Vercel env vars locally
vercel env pull .env.development.local

# Check sitemap
curl https://learn.accredipro.academy/sitemap.xml

# Check robots.txt
curl https://learn.accredipro.academy/robots.txt

# Run Lighthouse audit
npx lighthouse https://learn.accredipro.academy --view
```

---

## 💰 INFRASTRUCTURE COSTS

| Service | Cost | Purpose |
|---------|------|---------|
| Vercel Pro | $20/mo | Hosting, CDN, Analytics |
| Upstash Redis | $10/mo | Caching & rate limiting |
| Supabase | $25/mo | PostgreSQL database |
| Resend | $20/mo | Transactional email |
| Sentry | Free tier | Error tracking |
| **Total** | **~$75/mo** | |

---

## 🚀 NEXT STEPS

1. **Today**: Push these changes to production
2. **Tomorrow**: Submit sitemap to Google Search Console
3. **This week**: Convert img tags to next/image
4. **This month**: Complete metadata for all pages
5. **Q1 2026**: Launch mobile app MVP

---

*"The best time to plant a tree was 20 years ago. The second best time is now."*
