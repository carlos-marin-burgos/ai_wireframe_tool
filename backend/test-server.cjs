#!/usr/bin/env node

// Test the actual server endpoint with your exact input
const express = require("express");
const { createFallbackWireframe } = require("./fallback-generator");

const app = express();
app.use(express.json());

app.post("/api/generate-wireframe", (req, res) => {
  try {
    const { description, designTheme, colorScheme } = req.body;

    console.log("📝 Request:", { description, designTheme, colorScheme });

    const wireframe = createFallbackWireframe(
      description,
      designTheme,
      colorScheme
    );

    res.json({
      html: wireframe,
      success: true,
      source: "local-fallback",
      aiGenerated: false,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`🚀 Test server running on port ${port}`);
  console.log(`📍 Endpoint: http://localhost:${port}/api/generate-wireframe`);
});
