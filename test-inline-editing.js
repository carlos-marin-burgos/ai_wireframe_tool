// Test script to verify inline editing functionality
// Run this in the browser console on http://localhost:5173

console.log("🧪 Starting inline editing test...");

// Function to wait for element
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Function to generate a wireframe for testing
async function generateTestWireframe() {
  console.log("📝 Generating test wireframe...");

  // Look for the description input
  const descriptionInput = document.querySelector(
    'input[placeholder*="wireframe"], textarea[placeholder*="wireframe"], input[placeholder*="Describe"], textarea[placeholder*="Describe"]'
  );
  if (!descriptionInput) {
    console.error("❌ Description input not found");
    return false;
  }

  // Fill in test description
  const testDescription =
    'Simple dashboard with header text saying "Designetica Dashboard" and a paragraph below it';
  descriptionInput.value = testDescription;
  descriptionInput.dispatchEvent(new Event("input", { bubbles: true }));

  console.log(`✅ Filled description: ${testDescription}`);

  // Look for the generate button
  const generateButton = document.querySelector(
    'button[type="submit"], button:contains("Generate"), .ai-assistant-form button'
  );
  if (!generateButton) {
    console.error("❌ Generate button not found");
    return false;
  }

  // Click generate button
  generateButton.click();
  console.log("🚀 Clicked generate button");

  return true;
}

// Function to find and test mode toggle
async function testModeToggle() {
  console.log("🔄 Testing mode toggle...");

  try {
    // Wait for the wireframe area to appear
    await waitForElement(
      ".wireframe-container, .editable-wireframe-container",
      10000
    );
    console.log("✅ Wireframe container found");

    // Look for mode toggle button
    const modeToggleButton = document.querySelector(
      '.mode-toggle-btn, button:contains("Edit Mode"), button:contains("Drag Mode")'
    );
    if (!modeToggleButton) {
      console.error("❌ Mode toggle button not found");
      return false;
    }

    console.log("✅ Mode toggle button found:", modeToggleButton.textContent);

    // Check current mode
    const isEditMode = modeToggleButton.textContent.includes("Edit Mode");
    console.log(`📍 Current mode: ${isEditMode ? "Edit" : "Drag"}`);

    // If not in edit mode, click to switch
    if (!isEditMode) {
      modeToggleButton.click();
      console.log("🔄 Switched to edit mode");

      // Wait a moment for mode change
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return true;
  } catch (error) {
    console.error("❌ Error testing mode toggle:", error);
    return false;
  }
}

// Function to test inline editing
async function testInlineEditing() {
  console.log("✏️ Testing inline editing...");

  try {
    // Wait for editable wireframe to be loaded
    await waitForElement(".editable-wireframe-container", 5000);
    console.log("✅ Editable wireframe container found");

    // Look for text elements that should be editable
    const textElements = document.querySelectorAll(
      ".editable-wireframe-container h1, .editable-wireframe-container h2, .editable-wireframe-container h3, .editable-wireframe-container p, .editable-wireframe-container div"
    );
    console.log(`🔍 Found ${textElements.length} potential text elements`);

    // Filter for elements with actual text content
    const textElementsWithContent = Array.from(textElements).filter(
      (el) => el.textContent && el.textContent.trim().length > 0
    );
    console.log(
      `📝 Found ${textElementsWithContent.length} text elements with content`
    );

    if (textElementsWithContent.length === 0) {
      console.error("❌ No text elements with content found");
      return false;
    }

    // Test clicking on the first text element
    const firstTextElement = textElementsWithContent[0];
    console.log(
      `🎯 Testing click on: ${
        firstTextElement.tagName
      } - "${firstTextElement.textContent.trim()}"`
    );

    // Check if element is marked as editable
    const isEditable =
      firstTextElement.getAttribute("data-editable") === "true";
    console.log(`📊 Element editable status: ${isEditable}`);

    // Simulate click
    firstTextElement.click();
    console.log("🖱️ Clicked on text element");

    // Wait a moment for editing to start
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if element became contentEditable
    const isContentEditable = firstTextElement.contentEditable === "true";
    console.log(`📝 Element contentEditable: ${isContentEditable}`);

    if (isContentEditable) {
      console.log("🎉 SUCCESS: Inline editing is working!");

      // Test typing
      firstTextElement.textContent = "Designetica Dashboard";
      console.log('✏️ Changed text to "Designetica Dashboard"');

      // Simulate Enter key to finish editing
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      firstTextElement.dispatchEvent(enterEvent);
      console.log("⌨️ Pressed Enter to finish editing");

      return true;
    } else {
      console.error("❌ FAILED: Element did not become contentEditable");
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing inline editing:", error);
    return false;
  }
}

// Main test function
async function runCompleteTest() {
  console.log("🚀 Starting complete inline editing test...");

  try {
    // Step 1: Generate wireframe
    const wireframeGenerated = await generateTestWireframe();
    if (!wireframeGenerated) {
      console.error("❌ Failed to generate wireframe");
      return;
    }

    // Wait for wireframe to be generated (longer timeout)
    console.log("⏳ Waiting for wireframe generation...");
    await new Promise((resolve) => setTimeout(resolve, 8000));

    // Step 2: Test mode toggle
    const modeToggleWorking = await testModeToggle();
    if (!modeToggleWorking) {
      console.error("❌ Mode toggle test failed");
      return;
    }

    // Step 3: Test inline editing
    const inlineEditingWorking = await testInlineEditing();
    if (!inlineEditingWorking) {
      console.error("❌ Inline editing test failed");
      return;
    }

    console.log("🎉 ALL TESTS PASSED: Inline editing is working correctly!");
  } catch (error) {
    console.error("❌ Test suite failed:", error);
  }
}

// Export functions for manual testing
window.testInlineEditing = {
  runCompleteTest,
  generateTestWireframe,
  testModeToggle,
  testInlineEditing,
  waitForElement,
};

console.log(
  "🧪 Test functions loaded. Run window.testInlineEditing.runCompleteTest() to start the complete test."
);
