const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  context.log("📊 Feedback retrieval request received");

  // CORS headers
  context.res = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-MS-CLIENT-PRINCIPAL",
    },
  };

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    context.res.status = 200;
    context.res.body = "";
    return;
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    context.res.status = 405;
    context.res.body = JSON.stringify({ error: "Method not allowed" });
    return;
  }

  // 🔐 Microsoft Employee Authentication Check
  try {
    const clientPrincipal = req.headers["x-ms-client-principal"];

    if (clientPrincipal) {
      // The header should be base64-encoded JSON. However, in some environments
      // it may be URL-safe base64 or have spaces instead of pluses. Normalize it
      // before decoding.
      let encoded = String(clientPrincipal).trim();
      // Replace spaces with plus signs (sometimes proxies/middleware alter base64)
      encoded = encoded.replace(/\s+/g, "+");
      // Pad base64 if necessary
      const pad = encoded.length % 4;
      if (pad !== 0) encoded = encoded + "=".repeat(4 - pad);

      let principal;
      try {
        principal = JSON.parse(Buffer.from(encoded, "base64").toString());
      } catch (parseError) {
        context.log.error(
          "❌ Failed to parse x-ms-client-principal header:",
          parseError
        );
        context.res.status = 400;
        context.res.body = JSON.stringify({
          error: "Invalid authentication header format",
          details: parseError.message,
          rawHeader: String(clientPrincipal).slice(0, 200),
        });
        return;
      }
      const userEmail =
        principal.userDetails ||
        principal.claims?.find((c) => c.typ === "emails")?.val;

      // Check if user is a Microsoft employee (ONLY @microsoft.com)
      const isMicrosoftEmployee =
        userEmail && userEmail.toLowerCase().endsWith("@microsoft.com");

      if (!isMicrosoftEmployee) {
        context.log.warn(`🚫 Unauthorized access attempt by: ${userEmail}`);
        context.res.status = 403;
        context.res.body = JSON.stringify({
          error:
            "Access denied. This application is restricted to @microsoft.com email addresses only.",
          userEmail: userEmail,
        });
        return;
      }

      context.log(`✅ Authorized Microsoft employee: ${userEmail}`);
    } else {
      // When called through Static Web App linked backend, auth is handled by SWA
      // Allow access when no x-ms-client-principal header (SWA proxy scenario)
      context.log(
        "⚠️  No x-ms-client-principal header - assuming authenticated via Static Web App"
      );
    }
  } catch (authError) {
    context.log.error("❌ Authentication error:", authError);
    context.res.status = 500;
    context.res.body = JSON.stringify({
      error: "Authentication verification failed",
    });
    return;
  }

  try {
    // Get query parameters for filtering
    const {
      type,
      status = "all",
      limit = 50,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

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

    // Build query
    let query = "SELECT * FROM c WHERE 1=1";
    const parameters = [];

    // Filter by type if specified
    if (type && type !== "all") {
      query += " AND c.type = @type";
      parameters.push({ name: "@type", value: type });
    }

    // Filter by status if specified
    if (status && status !== "all") {
      query += " AND c.status = @status";
      parameters.push({ name: "@status", value: status });
    }

    // Add sorting
    const sortDirection = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
    query += ` ORDER BY c.${sortBy} ${sortDirection}`;

    // Add pagination
    query += ` OFFSET ${parseInt(offset)} LIMIT ${parseInt(limit)}`;

    context.log("🔍 Executing query:", query);

    // Execute query
    const { resources: feedbackItems } = await container.items
      .query({
        query,
        parameters,
      })
      .fetchAll();

    // Get total count for pagination
    let countQuery = "SELECT VALUE COUNT(1) FROM c WHERE 1=1";
    if (type && type !== "all") {
      countQuery += " AND c.type = @type";
    }
    if (status && status !== "all") {
      countQuery += " AND c.status = @status";
    }

    const { resources: countResult } = await container.items
      .query({
        query: countQuery,
        parameters,
      })
      .fetchAll();

    const totalCount = countResult[0] || 0;

    // Calculate summary statistics
    const summary = {
      total: totalCount,
      byType: {},
      byStatus: {},
      averageRating: 0,
      totalRatings: 0,
    };

    // Get summary data
    const { resources: allFeedback } = await container.items
      .query("SELECT c.type, c.status, c.rating FROM c")
      .fetchAll();

    // Calculate summaries
    let totalRatingSum = 0;
    let totalRatings = 0;

    allFeedback.forEach((item) => {
      // Count by type
      summary.byType[item.type] = (summary.byType[item.type] || 0) + 1;

      // Count by status
      summary.byStatus[item.status] = (summary.byStatus[item.status] || 0) + 1;

      // Calculate average rating
      if (item.rating && item.rating > 0) {
        totalRatingSum += item.rating;
        totalRatings++;
      }
    });

    summary.averageRating =
      totalRatings > 0 ? (totalRatingSum / totalRatings).toFixed(1) : 0;
    summary.totalRatings = totalRatings;

    context.log(`✅ Retrieved ${feedbackItems.length} feedback items`);

    context.res.status = 200;
    context.res.body = JSON.stringify({
      success: true,
      data: feedbackItems,
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        total: totalCount,
        hasMore: parseInt(offset) + parseInt(limit) < totalCount,
      },
      summary,
      query: {
        type: type || "all",
        status: status || "all",
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    context.log.error("❌ Error retrieving feedback:", error);

    context.res.status = 500;
    context.res.body = JSON.stringify({
      error: "Failed to retrieve feedback",
      message: error.message,
    });
  }
};
