import React from "react";

const GenerateWireframe = () => {
  return <div></div>;
};

export default GenerateWireframe;
const { app } = require("@azure/functions");
const {
  generateWireframeFromDescription,
} = require("../../generateWireframe/index");

app.http("generateWireframe", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      context.log("generateWireframe function triggered");

      let requestBody;

      if (request.method === "GET") {
        // Handle GET request with query parameters
        const url = request.query.get("url");
        const template = request.query.get("template") || "cards";
        const analysis = request.query.get("analysis")
          ? JSON.parse(request.query.get("analysis"))
          : null;

        if (!url) {
          return {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              success: false,
              error: "Missing required parameter: url",
            }),
          };
        }

        requestBody = { url, template, analysis };
      } else {
        // Handle POST request with JSON body
        const requestText = await request.text();

        if (!requestText) {
          return {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              success: false,
              error: "Empty request body",
            }),
          };
        }

        try {
          requestBody = JSON.parse(requestText);
        } catch (parseError) {
          context.log("JSON parse error:", parseError);
          return {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              success: false,
              error: "Invalid JSON in request body",
            }),
          };
        }
      }

      const { url, template = "cards", analysis } = requestBody;

      if (!url) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: false,
            error: "Missing required parameter: url",
          }),
        };
      }

      context.log(
        `Generating wireframe for URL: ${url}, template: ${template}`
      );

      // Use the main wireframe generation function
      let prompt = `Generate a wireframe for the website: ${url}`;
      if (template) {
        prompt += ` using the ${template} template style`;
      }
      if (analysis) {
        prompt += `. Based on analysis: ${JSON.stringify(analysis)}`;
      }

      const result = await generateWireframeFromDescription({
        prompt,
        url,
        template,
        analysis,
        options: {
          includeAccessibility: true,
          optimizeForMobile: true,
          includeInteractivity: true,
        },
      });

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
          html: result.html,
          metadata: {
            url,
            template,
            generatedAt: new Date().toISOString(),
            processingTime: result.processingTime || 0,
          },
        }),
      };
    } catch (error) {
      context.log("Error in generateWireframe:", error);

      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: error.message || "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        }),
      };
    }
  },
});
