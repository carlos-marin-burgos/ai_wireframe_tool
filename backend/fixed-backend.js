const express = require("express");    // Mock wireframe generation
    const wireframe = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <header style="background: #e8e6df; border-bottom: 2px solid #e8e6df; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                <h1 style="color: #333; margin: 0;">Generated Wireframe</h1>
                <p style="color: #666; margin: 10px 0 0 0;">Based on: "${wireframePrompt}"</p>
            </header>cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Basic API endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!", port: PORT });
});

// Main wireframe generation endpoint - matching frontend expectations
app.post("/api/generate-html-wireframe", (req, res) => {
  const { prompt, description } = req.body;
  const wireframePrompt = prompt || description;

  if (!wireframePrompt) {
    return res.status(400).json({
      success: false,
      error: "Missing prompt or description",
    });
  }

  // Mock wireframe generation
  const wireframe = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <header style="background: #e8e6df; border-bottom: 2px solid #e8e6df; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                <h1 style="color: #333; margin: 0;">Generated Wireframe</h1>
                <p style="color: #666; margin: 10px 0 0 0;">Based on: "${wireframePrompt}"</p>
            </header>
            
            <main style="display: grid; gap: 20px;">
                <section style="border: 1px solid #e1e1e1; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #333; margin-top: 0;">Content Section</h2>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 10px 0;">
                        <p style="margin: 0; color: #666;">This wireframe was generated based on your description: "${wireframePrompt}"</p>
                    </div>
                </section>
                
                <section style="border: 1px solid #e1e1e1; border-radius: 8px; padding: 20px;">
                    <h3 style="color: #333; margin-top: 0;">Interactive Elements</h3>
                    <div style="display: flex; gap: 10px; margin: 15px 0;">
                        <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Primary Action</button>
                        <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 8px 16px; border-radius: 4px;">Secondary Action</button>
                    </div>
                </section>
            </main>
        </div>
    `;

  res.json({
    success: true,
    html: wireframe,
    wireframe: wireframe,
    timestamp: new Date().toISOString(),
    prompt: wireframePrompt,
  });
});

// Suggestions endpoint
app.post("/api/get-suggestions", (req, res) => {
  const suggestions = [
    "Create a modern login page with email and password fields",
    "Design a dashboard with navigation sidebar and content area",
    "Build a product card layout with image, title, and price",
    "Make a contact form with name, email, and message fields",
    "Create a landing page hero section with call-to-action button",
  ];

  res.json({
    success: true,
    suggestions: suggestions,
  });
});

// Legacy endpoint for compatibility
app.post("/api/generateWireframe", (req, res) => {
  const { prompt } = req.body;
  res.json({
    success: true,
    wireframe: `<div style="border: 1px solid #ccc; padding: 20px; margin: 10px;">
            <h2>Generated Wireframe</h2>
            <p>Prompt: ${prompt}</p>
            <div style="border: 1px dashed #999; height: 200px; display: flex; align-items: center; justify-content: center;">
                Wireframe Content Here
            </div>
        </div>`,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(
    `🎨 Wireframe endpoint: http://localhost:${PORT}/api/generate-html-wireframe`
  );
});
