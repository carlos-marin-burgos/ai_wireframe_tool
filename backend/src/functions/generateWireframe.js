const { app } = require("@azure/functions");
const wireframeGenerator = require("../../generateWireframe/index");

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
        const description =
          request.query.get("description") ||
          `Generate a wireframe for the website: ${url}`;
        const template = request.query.get("template") || "cards";

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

        requestBody = { description, url, template };
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

      // Extract parameters and create a proper context object for the wireframe generator
      const { description, url, template = "cards" } = requestBody;

      if (!description && !url) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: false,
            error: "Missing required parameter: description or url",
          }),
        };
      }

      context.log(
        `Generating wireframe: ${
          description || `for URL: ${url}`
        }, template: ${template}`
      );

      // Create a proper request object for the wireframe generator
      const wireframeRequest = {
        method: "POST",
        body: {
          description:
            description || `Generate a wireframe for the website: ${url}`,
          theme: "professional",
          colorScheme: "blue",
          fastMode: true,
          includeAtlas: false,
        },
      };

      // Call the wireframe generator function
      await wireframeGenerator(context, wireframeRequest);

      // The wireframe generator modifies context.res, so we return that
      return context.res;
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
