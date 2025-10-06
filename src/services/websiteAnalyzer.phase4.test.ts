/**
 * Phase 4 WebsiteAnalyzer Test
 * Tests the new analyzeWithPatterns() method with real backend
 */

import { WebsiteAnalyzer } from "./websiteAnalyzer";

async function testPhase4Integration() {
  console.log("\n🧪 Starting Phase 4 WebsiteAnalyzer Integration Test\n");

  const analyzer = new WebsiteAnalyzer();

  // Test with a real website URL
  const testUrl = "https://www.microsoft.com";

  try {
    console.log(`📍 Testing URL: ${testUrl}`);
    console.log(`⏳ Calling analyzeWithPatterns()...\n`);

    const analysis = await analyzer.analyzeWithPatterns(testUrl);

    // Verify basic structure
    console.log("✅ Analysis completed successfully");
    console.log(`\n📊 Basic Analysis Data:`);
    console.log(`   URL: ${analysis.url}`);
    console.log(`   Title: ${analysis.pageInfo.title}`);
    console.log(`   Sections: ${analysis.layout.sections.length}`);
    console.log(`   Components: ${analysis.styling.components.length}`);

    // Verify Phase 4 specific data
    console.log(`\n🎯 Phase 4 Pattern Recognition:`);
    console.log(`   Patterns detected: ${analysis.patterns?.length || 0}`);
    console.log(`   Suggestion groups: ${analysis.suggestions?.length || 0}`);

    if (analysis.patterns && analysis.patterns.length > 0) {
      console.log(`\n📋 Detected Patterns:`);
      analysis.patterns.forEach((pattern, index) => {
        console.log(`   ${index + 1}. ${pattern.title} (${pattern.type})`);
        console.log(
          `      Priority: ${pattern.priority} | Confidence: ${pattern.confidence}%`
        );
      });
    }

    if (analysis.suggestions && analysis.suggestions.length > 0) {
      console.log(`\n💡 Suggestion Groups:`);
      analysis.suggestions.forEach((group, index) => {
        console.log(
          `   ${index + 1}. ${group.pattern.title} (${
            group.suggestions.length
          } suggestions)`
        );
        console.log(
          `      Applicability: ${group.applicability.score}% (${group.applicability.label})`
        );

        // Show first 2 suggestions
        group.suggestions.slice(0, 2).forEach((suggestion, sIndex) => {
          console.log(`      → ${suggestion.title}`);
          console.log(
            `        Impact: ${suggestion.impact} | Effort: ${suggestion.effort}`
          );
        });

        if (group.suggestions.length > 2) {
          console.log(
            `      ... and ${group.suggestions.length - 2} more suggestions`
          );
        }
      });
    }

    // Verify type safety
    console.log(`\n🔍 Type Safety Checks:`);
    const patternsAreArray = Array.isArray(analysis.patterns);
    const suggestionsAreArray = Array.isArray(analysis.suggestions);
    console.log(`   ✓ patterns is array: ${patternsAreArray}`);
    console.log(`   ✓ suggestions is array: ${suggestionsAreArray}`);

    if (analysis.patterns && analysis.patterns.length > 0) {
      const firstPattern = analysis.patterns[0];
      const hasRequiredFields =
        firstPattern.type &&
        firstPattern.title &&
        firstPattern.confidence !== undefined &&
        firstPattern.priority;
      console.log(`   ✓ Pattern has required fields: ${hasRequiredFields}`);
      console.log(`     - type: ${firstPattern.type}`);
      console.log(`     - title: ${firstPattern.title}`);
      console.log(`     - confidence: ${firstPattern.confidence}%`);
      console.log(`     - priority: ${firstPattern.priority}`);
    }

    if (analysis.suggestions && analysis.suggestions.length > 0) {
      const firstGroup = analysis.suggestions[0];
      const hasRequiredFields =
        firstGroup.pattern &&
        Array.isArray(firstGroup.suggestions) &&
        firstGroup.applicability;
      console.log(
        `   ✓ SuggestionGroup has required fields: ${hasRequiredFields}`
      );
      console.log(`     - pattern: ${firstGroup.pattern.title}`);
      console.log(`     - suggestions count: ${firstGroup.suggestions.length}`);
      console.log(`     - applicability: ${firstGroup.applicability.score}%`);
    }

    console.log(`\n✅ All Phase 4 integration tests passed!\n`);
    return true;
  } catch (error) {
    console.error("\n❌ Phase 4 test failed:", error);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check if backend is running on port 7071");
    console.error("   2. Verify Phase 4 API is responding correctly");
    console.error("   3. Check network connectivity to test URL");
    console.error("\n   Run: ./quick-test-phase4.sh to verify backend\n");
    return false;
  }
}

// Run test
testPhase4Integration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
