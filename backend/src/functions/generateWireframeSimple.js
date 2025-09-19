import React from "react";

const GenerateWireframeSimple = () => {
  return <div></div>;
};

export default GenerateWireframeSimple;
const { app } = require("@azure/functions");

app.http("generateWireframeSimple", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      context.log("generateWireframeSimple function triggered");

      // Get description from query or body
      let description = "";
      if (request.method === "GET") {
        description =
          request.query.get("description") || "A simple contact form";
      } else {
        const body = await request.text();
        if (body) {
          try {
            const parsed = JSON.parse(body);
            description = parsed.description || "A simple contact form";
          } catch (e) {
            description = body;
          }
        }
      }

      context.log(`Generating simple wireframe for: ${description}`);

      // Generate a simple working wireframe
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Wireframe</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { 
            color: #333; 
            text-align: center; 
            margin-bottom: 30px; 
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        label { 
            display: block; 
            margin-bottom: 5px; 
            font-weight: 600; 
            color: #555; 
        }
        input, textarea { 
            width: 100%; 
            padding: 12px; 
            border: 2px solid #ddd; 
            border-radius: 4px; 
            font-size: 14px; 
            box-sizing: border-box; 
        }
        input:focus, textarea:focus { 
            outline: none; 
            border-color: #194a7a; 
        }
        textarea { 
            height: 100px; 
            resize: vertical; 
        }
        .btn { 
            background-color: #194a7a; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 16px; 
            width: 100%; 
            margin-top: 10px; 
        }
        .btn:hover { 
            background-color: #0f3a5f; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Contact Form</h1>
        <form>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" class="btn">Send Message</button>
        </form>
    </div>
</body>
</html>`;

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify({
          success: true,
          html: html,
          metadata: {
            description: description,
            generatedAt: new Date().toISOString(),
            processingTime: 50,
          },
        }),
      };
    } catch (error) {
      context.log("Error in generateWireframeSimple:", error);

      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: error.message || "Internal server error",
        }),
      };
    }
  },
});
