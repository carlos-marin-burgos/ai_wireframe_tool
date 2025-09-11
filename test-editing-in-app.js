// Test script to inject a simple wireframe and test editing
(function () {
  console.log("🧪 Starting EditableWireframe test...");

  // Simple test wireframe HTML
  const testHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1>Test Header</h1>
            <p>This is a test paragraph that should be editable.</p>
            <button>Test Button</button>
            <div>Test Division</div>
        </div>
    `;

  // Wait for the app to load
  setTimeout(() => {
    // Try to find the wireframe input and simulate generating content
    const textarea = document.querySelector(
      'textarea[placeholder*="wireframe"]'
    );
    if (textarea) {
      console.log("📝 Found textarea, setting test description...");
      textarea.value = "Simple test wireframe";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));

      // Find and click the submit button
      setTimeout(() => {
        const submitBtn =
          document.querySelector('button[type="submit"]') ||
          document.querySelector('button:contains("Create")') ||
          document.querySelector(".ai-assistant-submit");
        if (submitBtn) {
          console.log("🚀 Clicking submit button...");
          submitBtn.click();
        } else {
          console.log("❌ Submit button not found");
        }
      }, 500);
    } else {
      console.log("❌ Textarea not found");
    }
  }, 2000);

  // Monitor for wireframe container and inject test HTML
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const container =
            node.querySelector?.(".editable-wireframe-container") ||
            (node.classList?.contains("editable-wireframe-container")
              ? node
              : null);
          if (container) {
            console.log("🎯 Found wireframe container, injecting test HTML...");
            container.innerHTML = testHTML;

            // Manually trigger the editing setup
            setTimeout(() => {
              console.log("🔧 Manually triggering editing setup...");
              makeElementsEditableManually(container);
            }, 1000);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Manual editing setup function
  function makeElementsEditableManually(container) {
    const selectors = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "button",
      "div",
    ];
    let count = 0;

    selectors.forEach((selector) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element.children.length > 0 && element.tagName !== "BUTTON") return;
        if (!element.textContent?.trim()) return;
        if (element.getAttribute("data-editable") === "true") return;

        console.log(
          `✅ Making ${
            element.tagName
          } editable: "${element.textContent.trim()}"`
        );

        element.setAttribute("data-editable", "true");
        element.style.cursor = "text";
        element.style.outline = "none";
        count++;

        element.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(`🖱️ Clicked on ${element.tagName}:`, element.textContent);
          startEditingManually(element);
        });

        element.addEventListener("mouseenter", () => {
          element.style.backgroundColor = "rgba(0, 120, 212, 0.1)";
          element.style.borderRadius = "2px";
        });

        element.addEventListener("mouseleave", () => {
          if (element.contentEditable !== "true") {
            element.style.backgroundColor = "";
            element.style.borderRadius = "";
          }
        });
      });
    });

    console.log(`🎯 Made ${count} elements editable manually`);
  }

  function startEditingManually(element) {
    console.log(`🚀 Starting manual edit for:`, element.tagName);

    element.contentEditable = "true";
    element.focus();

    // Select all text
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Style for editing
    element.style.backgroundColor = "rgba(0, 120, 212, 0.2)";
    element.style.border = "2px solid #0078d4";
    element.style.borderRadius = "4px";
    element.style.padding = "2px 4px";

    function handleKeyDown(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        finishEditingManually(element);
      }
    }

    function handleBlur() {
      setTimeout(() => finishEditingManually(element), 100);
    }

    element.addEventListener("keydown", handleKeyDown);
    element.addEventListener("blur", handleBlur);

    element._cleanup = () => {
      element.removeEventListener("keydown", handleKeyDown);
      element.removeEventListener("blur", handleBlur);
    };
  }

  function finishEditingManually(element) {
    element.contentEditable = "false";
    element.style.backgroundColor = "";
    element.style.border = "";
    element.style.borderRadius = "";
    element.style.padding = "";

    if (element._cleanup) {
      element._cleanup();
      delete element._cleanup;
    }

    console.log(`✅ Finished editing:`, element.textContent);
  }
})();
