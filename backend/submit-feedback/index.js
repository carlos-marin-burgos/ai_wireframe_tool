const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  context.log("📬 Feedback submission request received");

  // CORS headers
  context.res = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    context.res.status = 200;
    context.res.body = "";
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    context.res.status = 405;
    context.res.body = JSON.stringify({ error: "Method not allowed" });
    return;
  }

  try {
    const { type, rating, message, email, metadata } = req.body;

    // Validate required fields
    if (!type || !message) {
      context.res.status = 400;
      context.res.body = JSON.stringify({
        error: "Missing required fields: type and message are required",
      });
      return;
    }

    // Validate feedback type
    const validTypes = ["bug", "feature", "general", "praise"];
    if (!validTypes.includes(type)) {
      context.res.status = 400;
      context.res.body = JSON.stringify({
        error: `Invalid feedback type. Must be one of: ${validTypes.join(
          ", "
        )}`,
      });
      return;
    }

    // Validate rating if provided
    if (rating !== undefined && rating !== null) {
      if (typeof rating !== "number" || rating < 0 || rating > 5) {
        context.res.status = 400;
        context.res.body = JSON.stringify({
          error: "Invalid rating. Must be a number between 0 and 5",
        });
        return;
      }
    }

    // Create feedback document
    const feedbackDocument = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      rating: rating || 0,
      message: message.trim(),
      email: email ? email.trim() : null,
      metadata: {
        ...metadata,
        submittedAt: new Date().toISOString(),
        ipAddress:
          req.headers["x-forwarded-for"] ||
          req.headers["x-real-ip"] ||
          "unknown",
      },
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // Initialize Cosmos DB client
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;
    const databaseId = process.env.COSMOS_DATABASE_ID || "designetica";
    const containerId = process.env.COSMOS_FEEDBACK_CONTAINER_ID || "feedback";

    if (!endpoint || !key) {
      context.log.error("❌ Cosmos DB credentials not configured");
      context.res.status = 500;
      context.res.body = JSON.stringify({
        error: "Database configuration error",
      });
      return;
    }

    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Store feedback in Cosmos DB
    const { resource: createdDocument } = await container.items.create(
      feedbackDocument
    );

    context.log("✅ Feedback stored successfully:", createdDocument.id);

    // Optional: Send email notification (implement if needed)
    // await sendEmailNotification(feedbackDocument);

    context.res.status = 201;
    context.res.body = JSON.stringify({
      success: true,
      message: "Feedback submitted successfully",
      id: createdDocument.id,
    });
  } catch (error) {
    context.log.error("❌ Error submitting feedback:", error);

    context.res.status = 500;
    context.res.body = JSON.stringify({
      error: "Failed to submit feedback",
      message: error.message,
    });
  }
};
