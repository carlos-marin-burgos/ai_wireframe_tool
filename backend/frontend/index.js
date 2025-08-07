const fs = require("fs");
const path = require("path");

module.exports = async function (context, req) {
  try {
    const url = req.url || "";

    // Get the file path from the URL
    let filePath;
    if (url === "/" || url === "") {
      filePath = path.join(__dirname, "../index.html");
    } else {
      // Remove leading slash and join with backend directory
      const cleanPath = url.startsWith("/") ? url.slice(1) : url;
      filePath = path.join(__dirname, "..", cleanPath);
    }

    // Check if file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath);

      // Determine content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      let contentType = "text/plain";

      switch (ext) {
        case ".html":
          contentType = "text/html";
          break;
        case ".css":
          contentType = "text/css";
          break;
        case ".js":
          contentType = "application/javascript";
          break;
        case ".json":
          contentType = "application/json";
          break;
        case ".png":
          contentType = "image/png";
          break;
        case ".ico":
          contentType = "image/x-icon";
          break;
        case ".svg":
          contentType = "image/svg+xml";
          break;
      }

      context.res = {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control":
            ext === ".html" ? "no-cache" : "public, max-age=31536000",
        },
        body: fileContent,
      };
    } else {
      // If file not found, serve index.html for SPA routing
      const indexPath = path.join(__dirname, "../index.html");
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, "utf8");
        context.res = {
          status: 200,
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
          body: indexContent,
        };
      } else {
        context.res = {
          status: 404,
          body: "File not found",
        };
      }
    }
  } catch (error) {
    context.log.error("Error serving frontend:", error);
    context.res = {
      status: 500,
      body: "Internal server error",
    };
  }
};
