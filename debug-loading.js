// Quick debug test for loading state
console.log("=== LOADING STATE DEBUG ===");

// Test if we can access the SplitLayout component
const splitLayoutElement = document.querySelector(".split-layout");
if (splitLayoutElement) {
  console.log("✅ SplitLayout found");

  // Look for loading spinner
  const spinner = document.querySelector(".loading-spinner");
  const stopBtn = document.querySelector(".chat-stop-btn");
  const sendBtn = document.querySelector(".chat-send-btn");

  console.log("Spinner found:", !!spinner);
  console.log("Stop button found:", !!stopBtn);
  console.log("Send button found:", !!sendBtn);

  if (sendBtn) {
    console.log("Send button disabled:", sendBtn.disabled);
    console.log("Send button innerHTML:", sendBtn.innerHTML);
  }
} else {
  console.log("❌ SplitLayout not found");
}

// Check if we're on the right page
const landingPage = document.querySelector(".landing-page");
console.log("On landing page:", !!landingPage);
console.log("On split layout:", !!splitLayoutElement);
