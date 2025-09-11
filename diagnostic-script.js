// Quick diagnostic script - Copy and paste this into browser console on http://localhost:5173
// after generating a wireframe

console.log("🔍 DIAGNOSTIC: Checking inline editing setup...");

// Check if we're on the wireframe page
const wireframeContainer = document.querySelector(
  ".editable-wireframe-container, .wireframe-container"
);
if (!wireframeContainer) {
  console.log(
    "❌ No wireframe container found. Please generate a wireframe first."
  );
} else {
  console.log("✅ Wireframe container found");
}

// Check for mode toggle button
const modeToggle = document.querySelector(".mode-toggle-btn");
if (!modeToggle) {
  console.log("❌ Mode toggle button not found");
} else {
  console.log("✅ Mode toggle button found:", modeToggle.textContent);
}

// Check for EditableWireframe component
const editableWireframe = document.querySelector(".editable-wireframe");
if (!editableWireframe) {
  console.log(
    "❌ EditableWireframe component not found - might be in drag mode"
  );
} else {
  console.log("✅ EditableWireframe component found");

  // Check for editable elements
  const editableElements = editableWireframe.querySelectorAll(
    '[data-editable="true"]'
  );
  console.log(`📝 Found ${editableElements.length} editable elements`);

  if (editableElements.length > 0) {
    console.log("🎯 Editable elements:");
    editableElements.forEach((el, i) => {
      console.log(`  ${i + 1}. ${el.tagName}: "${el.textContent.trim()}"`);
    });

    // Test clicking on first element
    console.log("🧪 Testing click on first editable element...");
    editableElements[0].click();

    setTimeout(() => {
      if (editableElements[0].contentEditable === "true") {
        console.log("🎉 SUCCESS: Element became contentEditable!");
        console.log("✅ Inline editing is working correctly");

        // Reset the element
        editableElements[0].blur();
      } else {
        console.log("❌ FAILED: Element did not become contentEditable");
        console.log("🔧 Check browser console for errors");
      }
    }, 500);
  }
}

// Check current editing mode
const app = document.querySelector("#root");
if (app) {
  console.log("🏠 React app found");
} else {
  console.log("❌ React app not found");
}
