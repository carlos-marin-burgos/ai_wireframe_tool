/**
 * Test if URL-based wireframe generation creates consistent but unique outputs
 */

import fs from "fs";

const testUrl = "https://learn.microsoft.com";

async function testConsistency() {
  console.log("\n🧪 Testing URL Wireframe Consistency");
  console.log("=".repeat(60));

  // First, analyze the website once
  console.log(`\n📍 Analyzing: ${testUrl}`);
  const analysisResponse = await fetch(
    "http://localhost:7071/api/websiteAnalyzer",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: testUrl }),
    }
  );

  if (!analysisResponse.ok) {
    throw new Error(`Analysis failed: ${analysisResponse.status}`);
  }

  const analysisData = await analysisResponse.json();
  if (!analysisData.success) {
    throw new Error(`Analysis error: ${analysisData.error}`);
  }

  const analysis = analysisData.analysis;
  console.log(
    `✅ Analysis complete: ${analysis.layout.sections.length} sections detected`
  );

  console.log(
    `\n📋 All ${analysis.layout.sections.length} sections from analysis:`
  );
  analysis.layout.sections.forEach((s, i) => {
    console.log(
      `   ${i + 1}. ${s.type.padEnd(12)} - "${s.heading || "No heading"}"`
    );
  });

  // Generate 3 wireframes with the same analysis
  console.log(`\n🎨 Generating 3 wireframes from the same analysis...\n`);

  const wireframes = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`   Generating wireframe ${i}/3...`);

    const wireframeResponse = await fetch(
      "http://localhost:7071/api/generate-wireframe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Create a wireframe based on ${testUrl}`,
          websiteAnalysis: analysis,
          theme: "modern",
          colorScheme: "primary",
        }),
      }
    );

    if (!wireframeResponse.ok) {
      throw new Error(`Wireframe ${i} failed: ${wireframeResponse.status}`);
    }

    const wireframeData = await wireframeResponse.json();
    wireframes.push({
      id: i,
      html: wireframeData.html,
      length: wireframeData.html.length,
    });

    console.log(`   ✓ Wireframe ${i}: ${wireframeData.html.length} characters`);
  }

  // Analyze the wireframes
  console.log(`\n\n📊 Analysis Results:`);
  console.log("=".repeat(60));

  // Check if they're identical
  const areIdentical = wireframes.every((w) => w.html === wireframes[0].html);
  console.log(
    `\n❓ All wireframes identical: ${areIdentical ? "YES ❌" : "NO ✅"}`
  );

  if (areIdentical) {
    console.log("\n⚠️  PROBLEM: All 3 wireframes are exactly the same!");
    console.log("   This suggests the AI is generating identical output.");
  } else {
    console.log("\n✅ GOOD: Wireframes have variations");
  }

  // Check lengths
  console.log(`\n📏 HTML Lengths:`);
  wireframes.forEach((w) => {
    console.log(`   Wireframe ${w.id}: ${w.length} characters`);
  });

  // Check for section types
  console.log(`\n🏷️  Section Types Found:`);
  wireframes.forEach((w) => {
    const sectionTypes = [];
    const matches = w.html.match(/data-section-type="([^"]*)"/g) || [];
    matches.forEach((m) => {
      const type = m.match(/data-section-type="([^"]*)"/)[1];
      if (!sectionTypes.includes(type)) sectionTypes.push(type);
    });

    if (sectionTypes.length === 0) {
      // Check for section tags without data attributes
      const sectionTags = (w.html.match(/<section[^>]*>/g) || []).length;
      console.log(
        `   Wireframe ${w.id}: NO data-section-type attributes (${sectionTags} <section> tags found)`
      );
    } else {
      console.log(`   Wireframe ${w.id}: ${sectionTypes.join(", ")}`);
    }
  });

  // Check expected content from analysis
  console.log(`\n📋 Expected Sections from Analysis:`);
  analysis.layout.sections.slice(0, 5).forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.type} - "${s.heading || "No heading"}"`);
  });

  console.log(`\n🔍 Checking if wireframes match expected sections...`);
  const expectedTypes = analysis.layout.sections.map((s) => s.type);
  const uniqueExpected = [...new Set(expectedTypes)];

  wireframes.forEach((w) => {
    const found = uniqueExpected.filter((type) =>
      w.html.toLowerCase().includes(type.toLowerCase())
    );
    const matchPercentage = Math.round(
      (found.length / uniqueExpected.length) * 100
    );
    console.log(
      `   Wireframe ${w.id}: ${found.length}/${uniqueExpected.length} types found (${matchPercentage}%)`
    );
  });

  // Save wireframes for manual inspection
  console.log(`\n💾 Saving wireframes for inspection...`);
  wireframes.forEach((w) => {
    const filename = `/Users/carlosmarinburgos/designetica/test-wireframe-${w.id}.html`;
    fs.writeFileSync(filename, w.html);
    console.log(`   Saved: test-wireframe-${w.id}.html`);
  });

  console.log(`\n\n${"=".repeat(60)}`);
  console.log("✅ Test Complete");
  console.log("=".repeat(60));
  console.log(`\n💡 Next Steps:`);
  console.log(
    `   1. Open test-wireframe-1.html, test-wireframe-2.html, test-wireframe-3.html`
  );
  console.log(`   2. Compare them visually`);
  console.log(`   3. Check if they match ${testUrl}`);
  console.log(
    `   4. Look for the expected section types: ${uniqueExpected.join(", ")}\n`
  );
}

testConsistency().catch((error) => {
  console.error("\n❌ Test failed:", error.message);
  process.exit(1);
});
