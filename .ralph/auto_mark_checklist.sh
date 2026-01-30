#!/bin/bash
# .ralph/auto_mark_checklist.sh
# This script scans for file changes and auto-marks items in fix_plan.md
# Run this after each Ralph loop OR as a standalone watcher

FIX_PLAN=".ralph/fix_plan.md"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Helper to mark an item in fix_plan.md
mark_complete() {
    local pattern="$1"
    local description="$2"
    
    if grep -q "$pattern" "$FIX_PLAN"; then
        if grep -q "- \[ \] $description" "$FIX_PLAN"; then
            sed -i '' "s/- \[ \] $description/- [x] $description/" "$FIX_PLAN"
            echo -e "${GREEN}✓ Marked: $description${NC}"
            return 0
        fi
    fi
    return 1
}

# Get portal slug from PROMPT.md (e.g., "christian-coaching")
get_portal_slug() {
    # Match format: - `portal_slug`: `christian-coaching`
    grep "portal_slug" .ralph/PROMPT.md 2>/dev/null | grep -oE '\`[a-z0-9-]+\`$' | tr -d '\`' | head -1
}

SLUG=$(get_portal_slug)
if [[ -z "$SLUG" ]]; then
    echo "Warning: Could not detect portal slug from PROMPT.md"
    exit 1
fi

echo "📋 Checking completions for: $SLUG"

# Check for registry entries
if grep -q "\"$SLUG-mini-diploma\":" src/lib/mini-diploma-registry.ts 2>/dev/null; then
    mark_complete "" "Add lessons array to registry"
    mark_complete "" "Add config entry to registry"
fi

# Check optin API
if grep -q "\"$SLUG\":" src/app/api/mini-diploma/optin/route.ts 2>/dev/null; then
    mark_complete "" "Update optin API - COURSE_SLUGS"
    if grep -c "\"$SLUG\":" src/app/api/mini-diploma/optin/route.ts | grep -q "5\|6\|7\|8\|9"; then
        mark_complete "" "Update optin API - COACH_EMAILS"
        mark_complete "" "Update optin API - WELCOME_MESSAGES"
        mark_complete "" "Update optin API - getCertificationDisplayName"
        mark_complete "" "Update optin API - nicheNames"
    fi
fi

# Check auth redirect
if grep -q "$SLUG-mini-diploma" src/app/api/auth/get-redirect/route.ts 2>/dev/null; then
    mark_complete "" "Update auth get-redirect"
fi

# Check next.config.ts
if grep -q "'$SLUG'" next.config.ts 2>/dev/null; then
    mark_complete "" "Update next.config.ts"
fi

# Check landing page
if [[ -f "src/app/(public)/$SLUG-mini-diploma/page.tsx" ]]; then
    mark_complete "" "Create landing page"
fi

# Check diploma-configs.ts
if grep -q "\"$SLUG-diploma\":" src/components/lead-portal/diploma-configs.ts 2>/dev/null; then
    mark_complete "" "Add to diploma-configs.ts"
fi

# Check lesson content JSON
if [[ -f "src/components/mini-diploma/lessons/content/$SLUG.json" ]]; then
    mark_complete "" "Create lesson content JSON"
fi

# Check dynamic-lesson-router
if grep -q "$SLUG" src/components/mini-diploma/lessons/shared/dynamic-lesson-router.tsx 2>/dev/null; then
    mark_complete "" "Add to dynamic-lesson-router.tsx"
fi

# Check lead layout DIPLOMA_TAG_PREFIX
if grep -q "$SLUG-diploma" src/app/\(lead\)/layout.tsx 2>/dev/null; then
    mark_complete "" "Add to DIPLOMA_TAG_PREFIX in lead layout"
fi

# Check SMS template
if [[ -f "docs/sms-sequences/$SLUG-sms.md" ]]; then
    mark_complete "" "Generate SMS template file for GHL"
fi

# Check nurture sequence
if [[ -f "src/lib/$SLUG-nurture-60-day.ts" ]]; then
    mark_complete "" "Create 60-day nurture sequence file"
fi

# Check DM sequence
if [[ -f "src/lib/$SLUG-dms.ts" ]]; then
    mark_complete "" "Create DM sequence file"
fi

# Check nudge cron
if grep -q "$SLUG-mini-diploma" src/app/api/cron/mini-diploma-nudges/route.ts 2>/dev/null; then
    mark_complete "" "Add to nudge cron"
fi

# Count completions
total=$(grep -cE "^- \[" "$FIX_PLAN" 2>/dev/null || echo "0")
completed=$(grep -cE "^- \[x\]" "$FIX_PLAN" 2>/dev/null || echo "0")

echo ""
echo -e "${YELLOW}Progress: $completed / $total items completed${NC}"
