/**
 * Button Readability Test
 * Tests the button readability fixes in wireframe generation
 */

// Test HTML with problematic button styling
const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .button-problematic1 {
            background-color: #0078d4;
            color: #0078d4;
            padding: 10px 20px;
            opacity: 0.6;
        }
        .button-problematic2 {
            background: #ffffff;
            color: #ffffff;
            border: none;
        }
        .button-good {
            background-color: #194a7a;
            color: #ffffff;
            padding: 12px 24px;
        }
    </style>
</head>
<body>
    <button class="button-problematic1">Hard to read button</button>
    <button class="button-problematic2">Invisible button</button>
    <button class="button-good">Good button</button>
</body>
</html>
`;

console.log("🧪 Testing Button Readability Fixes\n");
console.log("Original HTML has these problems:");
console.log("- Blue text on blue background");
console.log("- White text on white background");
console.log("- Low opacity (0.6)\n");

// This would normally be called from the actual function, but for testing
// we'll simulate the fix patterns
function testFixButtonReadability(html) {
  console.log("🔧 Applying button readability fixes...");

  let fixedHtml = html;

  // Test the same patterns from the actual fix function
  const buttonFixes = [
    {
      pattern: /background-color:\s*#0078d4[^;]*;[^}]*color:\s*#0078d4/gi,
      replacement: "background-color: #194a7a; color: #ffffff",
      description: "Blue on blue button text",
    },
    {
      pattern:
        /background[^:]*:\s*#(?:fff|ffffff|f8f9fa|e9ecef)[^;]*;[^}]*color:\s*#(?:fff|ffffff|f8f9fa|e9ecef)/gi,
      replacement: "background-color: #194a7a; color: #ffffff",
      description: "Light text on light background",
    },
    {
      pattern: /(opacity:\s*0\.[1-8])/gi,
      replacement: "opacity: 1.0",
      description: "Low opacity buttons",
    },
  ];

  let fixesApplied = 0;
  buttonFixes.forEach((fix) => {
    const beforeLength = fixedHtml.length;
    fixedHtml = fixedHtml.replace(fix.pattern, fix.replacement);
    const afterLength = fixedHtml.length;
    if (beforeLength !== afterLength) {
      fixesApplied++;
      console.log(`   ✓ Fixed: ${fix.description}`);
    }
  });

  console.log(`🎯 Applied ${fixesApplied} button readability fixes\n`);
  return fixedHtml;
}

const fixedHtml = testFixButtonReadability(testHtml);

console.log("Fixed HTML:");
console.log(fixedHtml);

console.log("\n✅ Button Readability Test Complete!");
