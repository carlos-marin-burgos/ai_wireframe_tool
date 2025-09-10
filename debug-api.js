// Debug script to test API configuration from built frontend
console.log("🔍 Debugging API configuration...");

// Test the API configuration
const API_CONFIG = {
  BASE_URL: "http://localhost:5001",
  ENDPOINTS: {
    HEALTH: "/health",
    GENERATE_WIREFRAME: "/api/generate-html-wireframe",
  },
};

console.log("📋 API Configuration:", API_CONFIG);

// Test health endpoint
async function testHealth() {
  try {
    console.log("🏥 Testing health endpoint...");
    const healthUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`;
    console.log("🔗 Health URL:", healthUrl);

    const response = await fetch(healthUrl);
    console.log("📊 Health response status:", response.status);

    if (response.ok) {
      const data = await response.text();
      console.log("✅ Health response:", data);
    } else {
      console.log("❌ Health check failed:", response.statusText);
    }
  } catch (error) {
    console.error("💥 Health check error:", error);
  }
}

// Test wireframe generation
async function testWireframe() {
  try {
    console.log("🎨 Testing wireframe generation...");
    const wireframeUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME}`;
    console.log("🔗 Wireframe URL:", wireframeUrl);

    const payload = {
      description: "test dashboard",
      theme: "microsoft",
      colorScheme: "primary",
    };

    console.log("📦 Payload:", payload);

    const response = await fetch(wireframeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("📊 Wireframe response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Wireframe response:", {
        hasHtml: !!data.html,
        htmlLength: data.html?.length,
        fallback: data.fallback,
      });
    } else {
      const errorText = await response.text();
      console.log("❌ Wireframe generation failed:", errorText);
    }
  } catch (error) {
    console.error("💥 Wireframe generation error:", error);
  }
}

// Run tests
testHealth();
setTimeout(testWireframe, 2000);
