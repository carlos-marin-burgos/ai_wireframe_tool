# Smart Sidebar Testing Guide

**Date**: October 3, 2025  
**Purpose**: Step-by-step testing procedures for Smart Sidebar development

---

## 🧪 Testing Strategy Overview

We'll test in **3 phases**:

1. **Unit Tests** - Individual components and functions
2. **Integration Tests** - Components working together
3. **E2E Tests** - Full user flow from URL to suggestions

---

## Phase 1: Unit Testing (Already Complete! ✅)

### Test 1: Type Definitions

**Status**: ✅ PASSED

```bash
cd /Users/carlosmarinburgos/designetica
npx tsx src/types/patterns.test.ts
```

**Expected Output**:

```
✅ All type tests passed!
```

**What it validates**:

- All TypeScript types compile
- Helper functions work correctly
- Mock data generators produce valid data
- Type guards return correct boolean values

---

## Phase 2: API Integration Testing

### Test 2.1: Backend Phase 4 API (Local)

**Prerequisite**: Backend running on port 7071

```bash
# Terminal 1: Start backend
cd backend
func start

# Terminal 2: Test Phase 4 endpoint
curl -X POST http://localhost:7071/api/websiteAnalyzer \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/login"}' \
  | jq '.patterns, .suggestions'
```

**Expected Output**:

```json
{
  "patterns": [
    {
      "type": "long-form",
      "title": "Long Form Pattern",
      "confidence": 0.867,
      "priority": "high",
      "tags": ["forms", "information-architecture"],
      "context": { "fieldCount": 10 }
    }
    // ... more patterns
  ],
  "suggestions": [
    {
      "pattern": {
        /* pattern object */
      },
      "suggestions": [
        {
          "title": "Group fields into sections",
          "description": "...",
          "category": "structure",
          "impact": "high",
          "effort": "low",
          "example": "..."
        }
      ],
      "applicability": {
        "score": 97,
        "label": "Highly Recommended"
      }
    }
    // ... more suggestion groups
  ]
}
```

**Success Criteria**:

- ✅ HTTP 200 status
- ✅ `success: true`
- ✅ `patterns` array exists (4-7 items)
- ✅ `suggestions` array exists (4-7 items)
- ✅ Each pattern has required fields
- ✅ Each suggestion has title, description, impact, effort

---

### Test 2.2: WebsiteAnalyzer Service (After Step 2 Complete)

Create test file: `src/services/websiteAnalyzer.test.ts`

```typescript
import { WebsiteAnalyzer } from "./websiteAnalyzer";

async function testWebsiteAnalyzer() {
  console.log("🧪 Testing WebsiteAnalyzer with Phase 4 support...\n");

  const analyzer = new WebsiteAnalyzer();

  try {
    // Test URL with patterns
    const url = "https://github.com/login";
    console.log(`📍 Analyzing: ${url}`);

    const result = await analyzer.analyzeWithPatterns(url);

    // Validate Phase 1-3 data
    console.log("\n✅ Phase 1-3 Analysis:");
    console.log(`   - Title: ${result.pageInfo.title}`);
    console.log(`   - Sections: ${result.layout.sections.length}`);
    console.log(`   - Colors: ${result.styling.primaryColors.length}`);

    // Validate Phase 4 data
    if (result.patterns && result.suggestions) {
      console.log("\n✅ Phase 4 Pattern Recognition:");
      console.log(`   - Patterns detected: ${result.patterns.length}`);
      console.log(`   - Suggestion groups: ${result.suggestions.length}`);

      // Show first pattern
      const firstPattern = result.patterns[0];
      console.log(`\n   First Pattern:`);
      console.log(`   - Type: ${firstPattern.type}`);
      console.log(`   - Title: ${firstPattern.title}`);
      console.log(
        `   - Confidence: ${(firstPattern.confidence * 100).toFixed(1)}%`
      );
      console.log(`   - Priority: ${firstPattern.priority}`);

      // Show first suggestion
      const firstSuggestionGroup = result.suggestions[0];
      const firstSuggestion = firstSuggestionGroup.suggestions[0];
      console.log(`\n   First Suggestion:`);
      console.log(`   - Title: ${firstSuggestion.title}`);
      console.log(`   - Impact: ${firstSuggestion.impact}`);
      console.log(`   - Effort: ${firstSuggestion.effort}`);
      console.log(
        `   - Applicability: ${firstSuggestionGroup.applicability.score}%`
      );

      console.log("\n🎉 WebsiteAnalyzer test PASSED!");
      return true;
    } else {
      console.error("\n❌ Phase 4 data missing!");
      return false;
    }
  } catch (error) {
    console.error("\n❌ Test FAILED:", error);
    return false;
  }
}

testWebsiteAnalyzer();
```

**Run it**:

```bash
npx tsx src/services/websiteAnalyzer.test.ts
```

**Success Criteria**:

- ✅ Analysis completes without errors
- ✅ `patterns` array populated
- ✅ `suggestions` array populated
- ✅ TypeScript types match correctly

---

## Phase 3: Component Testing

### Test 3.1: PatternBadge Component (After Step 5 Complete)

Create: `src/components/SmartSidebar/PatternBadge.test.tsx`

```typescript
import React from "react";
import { createRoot } from "react-dom/client";
import PatternBadge from "./PatternBadge";
import { createMockPattern } from "../../types/patterns";

// Mount component with mock data
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);

const mockPattern = createMockPattern({
  type: "long-form",
  title: "Long Form Pattern",
  confidence: 0.867,
  priority: "high",
  tags: ["forms", "information-architecture"],
});

root.render(
  <PatternBadge
    pattern={mockPattern}
    isExpanded={false}
    onToggle={() => console.log("Toggle clicked")}
  />
);

console.log("✅ PatternBadge rendered successfully");
console.log("   Check browser for visual verification");
```

**Manual Visual Test**:

1. Open browser dev tools
2. Check for:
   - ✅ Pattern title displays
   - ✅ Confidence percentage shows (86.7%)
   - ✅ Priority icon displays (🔴 for high)
   - ✅ Tags render correctly
   - ✅ Card has proper styling
   - ✅ Hover state works
   - ✅ Click toggles expansion

---

### Test 3.2: SuggestionCard Component (After Step 6 Complete)

Create: `src/components/SmartSidebar/SuggestionCard.test.tsx`

```typescript
import React from "react";
import { createRoot } from "react-dom/client";
import SuggestionCard from "./SuggestionCard";
import { createMockSuggestionGroup } from "../../types/patterns";

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);

const mockGroup = createMockSuggestionGroup();

root.render(
  <SuggestionCard
    suggestionGroup={mockGroup}
    onApply={(suggestion) => {
      console.log("✅ Apply clicked:", suggestion.title);
    }}
  />
);

console.log("✅ SuggestionCard rendered successfully");
```

**Manual Visual Test**:

1. Verify:
   - ✅ Suggestion title displays
   - ✅ Applicability badge shows (⭐ 97% Highly Recommended)
   - ✅ Impact/Effort indicators display correctly
   - ✅ Description truncates properly
   - ✅ Apply button works
   - ✅ Learn More button works
   - ✅ Card styling matches design

---

### Test 3.3: SmartSidebar Full Component (After Step 4 Complete)

Create: `src/components/SmartSidebar/SmartSidebar.test.tsx`

```typescript
import React from "react";
import { createRoot } from "react-dom/client";
import SmartSidebar from "./SmartSidebar";
import {
  createMockPattern,
  createMockSuggestionGroup,
} from "../../types/patterns";

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);

const mockPatterns = [
  createMockPattern({ type: "long-form", confidence: 0.867, priority: "high" }),
  createMockPattern({
    type: "multi-step-form",
    confidence: 0.85,
    priority: "high",
  }),
  createMockPattern({
    type: "validated-form",
    confidence: 0.95,
    priority: "medium",
  }),
];

const mockSuggestions = mockPatterns.map((p) =>
  createMockSuggestionGroup({ pattern: p })
);

root.render(
  <SmartSidebar
    url="https://github.com/login"
    patterns={mockPatterns}
    suggestions={mockSuggestions}
    isLoading={false}
    isVisible={true}
    onClose={() => console.log("✅ Close clicked")}
    onApplySuggestion={(suggestion, pattern) => {
      console.log(
        "✅ Apply suggestion:",
        suggestion.title,
        "for pattern:",
        pattern.title
      );
    }}
  />
);

console.log("✅ SmartSidebar rendered with 3 patterns and 3 suggestion groups");
```

**Manual Interaction Test**:

1. Open browser
2. Check sidebar appears on right side
3. Verify header shows "🎯 Smart Sidebar"
4. Check URL displays correctly
5. Verify all 3 patterns display
6. Verify all 3 suggestion cards display
7. Test "Show All" buttons
8. Test close button
9. Test Apply button on suggestions
10. Check responsive behavior (resize window)

---

## Phase 4: Integration Testing (After Step 7 Complete)

### Test 4.1: Full Integration with Real Backend

**Setup**:

```bash
# Terminal 1: Backend
cd backend
func start

# Terminal 2: Frontend
npm run dev
```

**Test Procedure**:

1. **Open Designetica** → http://localhost:5173

2. **Navigate to wireframe creation**

3. **Enter a URL with patterns**:

   - `https://github.com/login` (forms)
   - `https://stripe.com` (navigation, hero)
   - `https://docs.github.com` (content-heavy)

4. **Click "Generate" or "Analyze"**

5. **Verify Smart Sidebar appears**:

   - ✅ Sidebar slides in from right
   - ✅ Shows analyzing status
   - ✅ Displays detected patterns
   - ✅ Shows suggestions with applicability scores

6. **Test Interactions**:

   - ✅ Click pattern badge → expands/collapses
   - ✅ Click "View Suggestions" → scrolls to suggestions
   - ✅ Click "Apply" → logs to console (or applies to wireframe)
   - ✅ Click "Learn More" → opens modal
   - ✅ Click close button → sidebar disappears

7. **Test Filtering**:

   - ✅ Select category filter → suggestions update
   - ✅ Change sort order → suggestions reorder
   - ✅ Verify counts update correctly

8. **Test Edge Cases**:
   - ✅ Enter invalid URL → shows error state
   - ✅ Analyze simple site (example.com) → shows minimal patterns
   - ✅ Re-analyze same URL → updates correctly
   - ✅ Close and reopen → state preserves

---

## Phase 5: E2E Testing Scenarios

### Scenario 1: First-Time User

```
1. User opens Designetica
2. User enters "https://github.com/login"
3. User clicks "Generate Wireframe"
4. ✅ Analysis starts (loading indicator)
5. ✅ Wireframe appears
6. ✅ Smart Sidebar appears with 7 patterns
7. User clicks first suggestion "Group fields into sections"
8. ✅ "Apply" button logs action (future: modifies wireframe)
9. User clicks "Learn More"
10. ✅ Modal opens with detailed explanation
11. User closes modal
12. User closes sidebar
13. ✅ Sidebar disappears smoothly
```

### Scenario 2: Power User Workflow

```
1. User analyzes GitHub login → 7 patterns detected
2. User filters by "forms" category → 3 patterns shown
3. User sorts by "Impact" → high-impact suggestions first
4. User applies first 3 suggestions
5. User analyzes Stripe homepage → 5 patterns detected
6. User compares patterns between sites
7. User exports wireframe with applied suggestions
```

### Scenario 3: Mobile User

```
1. User opens Designetica on mobile
2. User analyzes URL
3. ✅ Smart Sidebar appears as bottom sheet
4. User swipes up → sidebar expands
5. User swipes down → sidebar minimizes
6. User taps suggestion → applies
7. ✅ Responsive layout works correctly
```

---

## 🐛 Common Issues & Debugging

### Issue 1: Patterns Array is Empty

**Debug Steps**:

```bash
# Check backend response
curl -X POST http://localhost:7071/api/websiteAnalyzer \
  -d '{"url":"https://github.com/login"}' | jq '.patterns'

# Should return array with 4-7 patterns
```

**Possible Causes**:

- Backend not running Phase 4 code
- URL doesn't trigger any patterns
- API timeout

---

### Issue 2: TypeScript Errors in Components

**Debug Steps**:

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Check specific file
npx tsc --noEmit src/components/SmartSidebar/SmartSidebar.tsx
```

**Possible Causes**:

- Missing type imports
- Incorrect prop types
- Missing pattern type definitions

---

### Issue 3: Sidebar Doesn't Appear

**Debug Steps**:

```javascript
// In browser console
console.log("Patterns:", patternAnalysis?.patterns);
console.log("Sidebar visible:", showSmartSidebar);

// Check state in React DevTools
```

**Possible Causes**:

- `showSmartSidebar` state not set to true
- CSS hiding sidebar
- Component not mounted

---

### Issue 4: Apply Button Does Nothing

**Debug Steps**:

```javascript
// Add console.log in handler
const handleApplySuggestion = (suggestion, pattern) => {
  console.log("Apply clicked:", suggestion.title, pattern.type);
  // TODO: Implement application logic
};
```

**Expected**: Console log appears when clicking Apply

---

## 📋 Testing Checklist

### Before Each Step

- [ ] Backend running on port 7071
- [ ] Frontend dev server running
- [ ] Browser console open
- [ ] React DevTools installed

### After Step 2 (WebsiteAnalyzer Update)

- [ ] WebsiteAnalyzer test passes
- [ ] Patterns array populated
- [ ] Suggestions array populated
- [ ] TypeScript compiles without errors

### After Step 4 (SmartSidebar Component)

- [ ] Component renders with mock data
- [ ] Header displays correctly
- [ ] Pattern section shows
- [ ] Suggestion section shows
- [ ] Close button works

### After Step 5 (PatternBadge)

- [ ] Badge displays pattern info
- [ ] Confidence percentage correct
- [ ] Priority icon shows
- [ ] Tags render
- [ ] Expand/collapse works

### After Step 6 (SuggestionCard)

- [ ] Card displays suggestion
- [ ] Applicability badge shows
- [ ] Impact/effort display correctly
- [ ] Apply button works
- [ ] Learn More button works

### After Step 7 (Integration)

- [ ] Sidebar appears on URL analysis
- [ ] Real patterns display
- [ ] Real suggestions display
- [ ] Filtering works
- [ ] Sorting works
- [ ] Apply functionality works
- [ ] Close button works

### After Step 8 (Full Testing)

- [ ] E2E scenarios pass
- [ ] Mobile responsive works
- [ ] Error states handled
- [ ] Performance acceptable (<100ms render)
- [ ] No console errors
- [ ] No memory leaks

---

## 🚀 Quick Test Commands

```bash
# 1. Test types
npx tsx src/types/patterns.test.ts

# 2. Test backend API
curl -X POST http://localhost:7071/api/websiteAnalyzer \
  -d '{"url":"https://github.com/login"}' | jq

# 3. Test WebsiteAnalyzer (after Step 2)
npx tsx src/services/websiteAnalyzer.test.ts

# 4. Test TypeScript compilation
npx tsc --noEmit

# 5. Start full dev environment
npm run dev

# 6. Run comprehensive Phase 4 backend tests
node test-phase4-patterns.js
```

---

## 📊 Expected Test Results Summary

| Test             | Expected Duration | Status        |
| ---------------- | ----------------- | ------------- |
| Type definitions | ~5 seconds        | ✅ PASSED     |
| Backend API      | ~10 seconds       | Ready to test |
| WebsiteAnalyzer  | ~15 seconds       | After Step 2  |
| PatternBadge     | ~30 seconds       | After Step 5  |
| SuggestionCard   | ~30 seconds       | After Step 6  |
| SmartSidebar     | ~1 minute         | After Step 4  |
| Full Integration | ~2 minutes        | After Step 7  |
| E2E Scenarios    | ~5 minutes        | After Step 8  |

**Total Testing Time**: ~10 minutes per implementation step

---

## 💡 Pro Testing Tips

1. **Test incrementally** - Don't wait until everything is built
2. **Use mock data first** - Faster iteration
3. **Check browser console** - Catch errors early
4. **Use React DevTools** - Inspect component state
5. **Test on mobile** - Don't forget responsive design
6. **Keep backend running** - Avoid restart delays
7. **Use TypeScript errors** - They catch bugs before runtime
8. **Log liberally** - console.log is your friend
9. **Test edge cases** - Invalid URLs, timeouts, empty states
10. **Document issues** - Track what works and what doesn't

---

**This testing guide will ensure each step of the Smart Sidebar implementation works correctly!** 🧪
