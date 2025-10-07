/**
 * Test Enhanced Website Analyzer
 * Tests the improved URL analysis with Microsoft Learn
 */

import fs from "fs";

const testUrl = "https://learn.microsoft.com";

async function testEnhancedAnalyzer() {
  console.log("\n🧪 Testing Enhanced Website Analyzer");
  console.log("=".repeat(60));
  console.log(`📍 Testing URL: ${testUrl}\n`);

  try {
    // Call the website analyzer
    console.log("⏳ Analyzing website structure...");
    const response = await fetch("http://localhost:7071/api/websiteAnalyzer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: testUrl }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Analysis failed: ${data.error}`);
    }

    const analysis = data.analysis;

    console.log("\n✅ Analysis completed successfully!\n");
    console.log("=".repeat(60));

    // Display page info
    console.log("\n📄 Page Information:");
    console.log(`   Title: ${analysis.pageInfo.title}`);
    console.log(`   URL: ${analysis.pageInfo.url}`);
    if (analysis.pageInfo.description) {
      console.log(
        `   Description: ${analysis.pageInfo.description.substring(0, 100)}...`
      );
    }

    // Display visual hierarchy
    if (analysis.layout?.visualHierarchy) {
      const vh = analysis.layout.visualHierarchy;
      console.log("\n👁️ Visual Hierarchy:");
      console.log(`   Layout Type: ${vh.layout}`);
      console.log(`   Has Hero Section: ${vh.hasHero ? "Yes ✓" : "No"}`);
      console.log(`   Has Sidebar: ${vh.hasSidebar ? "Yes ✓" : "No"}`);
      console.log(`   Header Height: ${vh.headerHeight}px`);
      console.log(`   Main Content Width: ${vh.mainContentWidth}px`);
      console.log(`   Prominent Sections: ${vh.prominentSections.length}`);
      console.log(`   Viewport Sections: ${vh.viewportSections.length}`);
    }

    // Display navigation
    if (analysis.layout?.navigation?.links) {
      console.log("\n🧭 Navigation:");
      console.log(`   Total Links: ${analysis.layout.navigation.links.length}`);
      const topLinks = analysis.layout.navigation.links.slice(0, 5);
      topLinks.forEach((link, i) => {
        console.log(`   ${i + 1}. ${link.text || link.href}`);
      });
      if (analysis.layout.navigation.links.length > 5) {
        console.log(
          `   ... and ${analysis.layout.navigation.links.length - 5} more`
        );
      }
    }

    // Display sections with enhanced information
    if (analysis.layout?.sections && analysis.layout.sections.length > 0) {
      console.log(`\n📋 Sections Detected: ${analysis.layout.sections.length}`);
      console.log("=".repeat(60));

      analysis.layout.sections.forEach((section, index) => {
        console.log(`\n${index + 1}. ${section.type.toUpperCase()}`);
        if (section.heading) {
          console.log(`   Heading: "${section.heading}"`);
        }
        if (section.subheadings && section.subheadings.length > 0) {
          console.log(`   Subheadings: ${section.subheadings.join(" | ")}`);
        }
        if (section.summary) {
          console.log(`   Summary: ${section.summary.substring(0, 100)}...`);
        }

        // Display component counts
        if (section.counts) {
          const components = [];
          if (section.counts.buttons > 0)
            components.push(`${section.counts.buttons} buttons`);
          if (section.counts.images > 0)
            components.push(`${section.counts.images} images`);
          if (section.counts.links > 0)
            components.push(`${section.counts.links} links`);
          if (section.counts.forms > 0)
            components.push(`${section.counts.forms} forms`);
          if (section.counts.videos > 0)
            components.push(`${section.counts.videos} videos`);

          if (components.length > 0) {
            console.log(`   Contains: ${components.join(", ")}`);
          }
        }

        // Display CTAs
        if (section.ctas && section.ctas.length > 0) {
          console.log(`   CTAs: "${section.ctas.join('", "')}"`);
        }
      });
    }

    // Test wireframe generation with this analysis
    console.log("\n\n🎨 Testing Wireframe Generation");
    console.log("=".repeat(60));
    console.log("⏳ Generating wireframe from analyzed structure...\n");

    const wireframeResponse = await fetch(
      "http://localhost:7071/api/generate-wireframe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: `Create a wireframe for ${testUrl}`,
          websiteAnalysis: analysis,
          designTheme: "modern",
          colorScheme: "primary",
        }),
      }
    );

    if (!wireframeResponse.ok) {
      throw new Error(
        `Wireframe generation HTTP error! status: ${wireframeResponse.status}`
      );
    }

    const wireframeData = await wireframeResponse.json();

    if (wireframeData.html) {
      console.log("✅ Wireframe generated successfully!");
      console.log(`   HTML Length: ${wireframeData.html.length} characters`);

      // Check if wireframe includes section types from analysis
      const sectionTypes = analysis.layout.sections.map((s) => s.type);
      const uniqueTypes = [...new Set(sectionTypes)];
      console.log(`\n   Section types found in wireframe:`);
      uniqueTypes.forEach((type) => {
        const inWireframe =
          wireframeData.html.includes(`data-section-type="${type}"`) ||
          wireframeData.html.toLowerCase().includes(type);
        console.log(`   ${inWireframe ? "✓" : "✗"} ${type}`);
      });

      // Save wireframe for inspection
      const outputPath =
        "/Users/carlosmarinburgos/designetica/test-enhanced-wireframe.html";
      fs.writeFileSync(outputPath, wireframeData.html);
      console.log(`\n   💾 Wireframe saved to: ${outputPath}`);
      console.log(`   Open it in a browser to verify accuracy!`);

      console.log("\n\n" + "=".repeat(60));
      console.log("✅ Test completed successfully!");
      console.log("=".repeat(60));
      console.log("\n📊 Summary:");
      console.log(`   • Analyzed ${analysis.layout.sections.length} sections`);
      console.log(`   • Detected ${uniqueTypes.length} unique section types`);
      console.log(`   • Generated ${wireframeData.html.length} chars of HTML`);
      console.log(
        "\n💡 Next: Open the generated wireframe and compare with actual site!"
      );
    } else {
      console.log("⚠️ No HTML generated");

      console.log("\n\n" + "=".repeat(60));
      console.log("⚠️ Test completed with warnings");
      console.log("=".repeat(60));
    }
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error("\nStack trace:", error.stack);
    process.exit(1);
  }
}

// Run the test
testEnhancedAnalyzer()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
