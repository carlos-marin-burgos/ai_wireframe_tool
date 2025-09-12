#!/usr/bin/env node
// Quick local tester for analyzeUIImage via JSON base64
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

(async () => {
  const imgPath = process.argv[2] || path.join(__dirname, "sample.png");
  let dataUrl = null;
  try {
    if (fs.existsSync(imgPath)) {
      const buf = fs.readFileSync(imgPath);
      const b64 = buf.toString("base64");
      dataUrl = `data:image/png;base64,${b64}`;
    } else {
      console.warn("Image file not found, sending stub pixel");
      dataUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2OQkpLyHwAFWgK9QHBpjwAAAABJRU5ErkJggg==";
    }
  } catch (e) {
    console.error("Failed to read image, using fallback pixel.", e.message);
    dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2OQkpLyHwAFWgK9QHBpjwAAAABJRU5ErkJggg==";
  }

  const payload = { image: dataUrl, prompt: "Identify UI components." };
  try {
    const res = await fetch("http://localhost:7072/api/analyzeUIImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text.slice(0, 1200));
  } catch (err) {
    console.error("Request failed:", err.message);
  }
})();
