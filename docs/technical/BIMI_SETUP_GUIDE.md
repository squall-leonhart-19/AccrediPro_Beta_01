# BIMI + VMC Setup Guide for AccrediPro

## Overview

**Goal:** Display AccrediPro logo next to emails in Gmail, Yahoo, and Apple Mail inboxes.

**Timeline:** 2-4 weeks total
**Cost:** ~$1,500/year for VMC certificate

---

## Phase 1: Prerequisites Check (Day 1)

### 1.1 Verify SPF Record

Check your current SPF:
```bash
dig TXT accredipro-certificate.com | grep spf
```

Should include Resend's servers. Example:
```
v=spf1 include:_spf.resend.com ~all
```

**Action:** Log into cPanel → Zone Editor → Verify SPF record exists.

---

### 1.2 Verify DKIM

Resend provides DKIM. Check:
```bash
dig TXT resend._domainkey.accredipro-certificate.com
```

Should return a DKIM public key.

**Action:** In Resend dashboard → Domains → Verify DKIM is ✅

---

### 1.3 Setup/Update DMARC (Critical!)

BIMI requires DMARC with `p=quarantine` or `p=reject`.

**Check current DMARC:**
```bash
dig TXT _dmarc.accredipro-certificate.com
```

**Required DMARC record:**
```
_dmarc.accredipro-certificate.com TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@accredipro-certificate.com; pct=100"
```

| Field | Meaning |
|-------|---------|
| `p=quarantine` | Unauthenticated emails go to spam (minimum for BIMI) |
| `p=reject` | Unauthenticated emails rejected (stricter, better) |
| `rua=mailto:...` | Where to receive DMARC reports |
| `pct=100` | Apply to 100% of emails |

**Action:** 
1. cPanel → Zone Editor → Add/Edit TXT record
2. Name: `_dmarc`
3. Value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@accredipro-certificate.com; pct=100`

⚠️ **Warning:** Start with `p=none` for 1-2 weeks to monitor, then upgrade to `p=quarantine`.

---

## Phase 2: Prepare Your Logo (Day 2-3)

### 2.1 Logo Requirements

| Requirement | Specification |
|-------------|---------------|
| Format | SVG (Tiny 1.2 Profile) |
| Shape | Square (centered, no padding issues) |
| Background | Solid color (no transparency) |
| Size | Any (vector scales) |
| File size | Under 32KB |

### 2.2 Convert Your Logo to BIMI SVG

**Option A: Use Online Converter**
- https://bimigroup.org/bimi-generator/
- Upload your logo, download BIMI-compliant SVG

**Option B: Manual Conversion**

Your SVG must start with:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.2" baseProfile="tiny-ps" xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 100 100" width="100" height="100">
  <!-- Your logo paths here -->
</svg>
```

### 2.3 Host Your Logo

Upload to publicly accessible HTTPS URL:
```
https://accredipro.academy/brand/bimi-logo.svg
```

**Test it:**
- URL must be accessible (no auth)
- Must be served over HTTPS
- Content-Type: image/svg+xml

---

## Phase 3: Get VMC Certificate (Week 1-3)

### 3.1 What You Need

| Document | Purpose |
|----------|---------|
| Registered Trademark | Proves you own the brand |
| Business Documents | Proves legitimate business |
| Domain Verification | Proves you control the domain |

### 3.2 Trademark Requirement

You need a **registered trademark** with:
- USPTO (United States)
- EUIPO (European Union)
- Or equivalent national office

**If you don't have one:**
- Apply at [USPTO.gov](https://www.uspto.gov)
- Cost: ~$250-350 per class
- Time: 8-12 months for approval

**Alternative:** Some VMC providers accept "Common Law" trademarks for certain jurisdictions.

### 3.3 VMC Providers

| Provider | Price | Link |
|----------|-------|------|
| DigiCert | $1,499/yr | [digicert.com/vmc](https://www.digicert.com/tls-ssl/verified-mark-certificates) |
| Entrust | $1,299/yr | [entrust.com/vmc](https://www.entrust.com/digital-security/certificate-solutions/products/digital-certificates/verified-mark-certificates) |

### 3.4 VMC Application Process

1. **Create Account** on DigiCert/Entrust
2. **Submit Application:**
   - Company name & address
   - Trademark registration number
   - Domain name
   - Upload your SVG logo
3. **Verification Process:**
   - Phone verification of business
   - Document review
   - Logo-trademark match verification
4. **Receive VMC:**
   - Download `.pem` certificate file
   - Host it publicly (like the SVG)

---

## Phase 4: Configure BIMI DNS (After VMC Received)

### 4.1 Host VMC Certificate

Upload to:
```
https://accredipro.academy/brand/accredipro-vmc.pem
```

### 4.2 Add BIMI DNS Record

**Location:** cPanel → Zone Editor → Add TXT Record

**Record:**
```
Name: default._bimi
Type: TXT
Value: v=BIMI1; l=https://accredipro.academy/brand/bimi-logo.svg; a=https://accredipro.academy/brand/accredipro-vmc.pem
```

| Field | Value |
|-------|-------|
| `v=BIMI1` | BIMI version |
| `l=` | URL to your SVG logo |
| `a=` | URL to your VMC certificate |

### 4.3 Verify BIMI Record

```bash
dig TXT default._bimi.accredipro-certificate.com
```

Should return your BIMI record.

---

## Phase 5: Test & Validate (Day After DNS)

### 5.1 BIMI Validators

- **BIMI Group Inspector:** https://bimigroup.org/bimi-generator/
- **Validity BIMI Lookup:** https://mxtoolbox.com/bimi.aspx
- **Google Postmaster:** https://postmaster.google.com

### 5.2 Test Email

1. Send test email to Gmail account
2. Wait 24-48 hours for DNS propagation
3. Open email in Gmail web
4. Hover over sender - should show your logo

---

## Timeline Summary

| Week | Task |
|------|------|
| **Week 1** | Setup SPF, DKIM, DMARC |
| **Week 1** | Create BIMI-compliant SVG |
| **Week 1-2** | Apply for VMC certificate |
| **Week 2-3** | Complete VMC verification |
| **Week 3-4** | Configure BIMI DNS |
| **Week 4** | Test and validate |

---

## Checklist

- [ ] SPF record verified
- [ ] DKIM verified (Resend)
- [ ] DMARC set to `p=quarantine` or `p=reject`
- [ ] Logo converted to BIMI SVG format
- [ ] SVG hosted at public HTTPS URL
- [ ] VMC certificate purchased
- [ ] VMC hosted at public HTTPS URL
- [ ] BIMI DNS record added
- [ ] Tested in Gmail inbox

---

## Support Links

- [BIMI Group Official](https://bimigroup.org/)
- [DigiCert VMC Guide](https://www.digicert.com/faq/verified-mark-certificates)
- [Gmail BIMI Support](https://support.google.com/a/answer/10911320)
- [Apple Mail BIMI](https://support.apple.com/guide/mail/mlhl03be2866/mac)
