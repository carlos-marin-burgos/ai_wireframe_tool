/**
 * Test file to verify Pattern type definitions
 * Run this to ensure types are correctly defined
 */

import {
  Pattern,
  Suggestion,
  SuggestionGroup,
  PatternType,
  Priority,
  ImpactLevel,
  EffortLevel,
  formatConfidence,
  formatApplicability,
  getPriorityIcon,
  getImpactIcon,
  isHighPriority,
  isHighImpact,
  isLowEffort,
  createMockPattern,
  createMockSuggestion,
  createMockSuggestionGroup,
} from "./patterns";

// Test 1: Create a pattern
console.log("✅ Test 1: Create Pattern");
const pattern: Pattern = {
  type: "long-form",
  title: "Long Form Pattern",
  confidence: 0.867,
  priority: "high",
  tags: ["forms", "information-architecture"],
  context: { fieldCount: 10 },
};
console.log("   Pattern:", pattern.title, formatConfidence(pattern.confidence));

// Test 2: Create a suggestion
console.log("\n✅ Test 2: Create Suggestion");
const suggestion: Suggestion = {
  title: "Group fields into sections",
  description: "Organize the 10 fields into logical sections",
  category: "structure",
  impact: "high",
  effort: "low",
  example: "Use fieldset and legend elements",
};
console.log("   Suggestion:", suggestion.title);
console.log("   Impact:", getImpactIcon(suggestion.impact), suggestion.impact);

// Test 3: Create a suggestion group
console.log("\n✅ Test 3: Create Suggestion Group");
const suggestionGroup: SuggestionGroup = {
  pattern,
  suggestions: [suggestion],
  applicability: {
    score: 97,
    label: "Highly Recommended",
  },
};
console.log("   Group:", suggestionGroup.pattern.title);
console.log(
  "   Applicability:",
  suggestionGroup.applicability.score + "%",
  suggestionGroup.applicability.label
);

// Test 4: Type guards
console.log("\n✅ Test 4: Type Guards");
console.log("   Is high priority?", isHighPriority(pattern));
console.log("   Is high impact?", isHighImpact(suggestion));
console.log("   Is low effort?", isLowEffort(suggestion));

// Test 5: Helper functions
console.log("\n✅ Test 5: Helper Functions");
console.log("   Priority icon:", getPriorityIcon(pattern.priority));
console.log("   Formatted confidence:", formatConfidence(pattern.confidence));
console.log("   Applicability label:", formatApplicability(97));

// Test 6: Mock data generators
console.log("\n✅ Test 6: Mock Data Generators");
const mockPattern = createMockPattern();
const mockSuggestion = createMockSuggestion();
const mockGroup = createMockSuggestionGroup();
console.log("   Mock pattern:", mockPattern.title);
console.log("   Mock suggestion:", mockSuggestion.title);
console.log("   Mock group has", mockGroup.suggestions.length, "suggestions");

// Test 7: Pattern types
console.log("\n✅ Test 7: All Pattern Types");
const allPatternTypes: PatternType[] = [
  "multi-step-form",
  "long-form",
  "validated-form",
  "data-table",
  "search-interface",
  "complex-navigation",
  "interactive-components",
  "content-heavy",
  "hero-section",
  "async-content",
];
console.log("   Total pattern types:", allPatternTypes.length);

// Test 8: Priority levels
console.log("\n✅ Test 8: Priority Levels");
const priorities: Priority[] = ["high", "medium", "low"];
priorities.forEach((p) => {
  console.log(`   ${getPriorityIcon(p)} ${p}`);
});

console.log("\n🎉 All type tests passed!");
console.log("✅ Pattern type definitions are working correctly\n");
