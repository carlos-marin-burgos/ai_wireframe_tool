const busboy = require("@fastify/busboy");

/**
 * Parses multipart form data from Azure Functions HTTP request
 * @param {Object} request - Azure Functions HTTP request object
 * @returns {Promise<{fields: Object, files: Array}>} Parsed form data
 */
function parseMultipartData(request) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = [];

    try {
      // Get the raw body as a buffer
      let rawBody;
      if (request.body && Buffer.isBuffer(request.body)) {
        rawBody = request.body;
      } else if (request.rawBody) {
        rawBody = Buffer.isBuffer(request.rawBody)
          ? request.rawBody
          : Buffer.from(request.rawBody);
      } else {
        return reject(new Error("No body data found in request"));
      }

      const contentType =
        request.headers["content-type"] || request.headers["Content-Type"];

      if (!contentType || !contentType.includes("multipart/form-data")) {
        return reject(new Error("Content-Type must be multipart/form-data"));
      }

      // Initialize busboy with the content type header
      const bb = busboy({
        headers: { "content-type": contentType },
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit
          files: 5, // Max 5 files
          fields: 20, // Max 20 fields
        },
      });

      // Handle form fields
      bb.on("field", (name, val) => {
        fields[name] = val;
      });

      // Handle file uploads
      bb.on("file", (name, file, info) => {
        const { filename, encoding, mimeType } = info;
        const buffers = [];

        file.on("data", (data) => {
          buffers.push(data);
        });

        file.on("end", () => {
          const buffer = Buffer.concat(buffers);
          files.push({
            fieldName: name,
            filename: filename,
            encoding: encoding,
            mimeType: mimeType,
            buffer: buffer,
            size: buffer.length,
          });
        });
      });

      // Handle completion
      bb.on("close", () => {
        resolve({ fields, files });
      });

      // Handle errors
      bb.on("error", (err) => {
        reject(new Error(`Multipart parsing error: ${err.message}`));
      });

      // Write the raw body to busboy
      bb.write(rawBody);
      bb.end();
    } catch (error) {
      reject(new Error(`Failed to parse multipart data: ${error.message}`));
    }
  });
}

/**
 * Converts a file buffer to base64 data URL
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - File MIME type
 * @returns {string} Base64 data URL
 */
function bufferToBase64DataUrl(buffer, mimeType) {
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Extracts image from multipart data and converts to base64
 * @param {Object} parsedData - Result from parseMultipartData
 * @returns {string|null} Base64 image data URL or null if no image found
 */
function extractImageFromMultipart(parsedData) {
  const { files } = parsedData;

  // Find the first image file
  const imageFile = files.find(
    (file) => file.mimeType && file.mimeType.startsWith("image/")
  );

  if (!imageFile) {
    return null;
  }

  return bufferToBase64DataUrl(imageFile.buffer, imageFile.mimeType);
}

/**
 * Helper function to determine if request has multipart data
 * @param {Object} request - Azure Functions HTTP request
 * @returns {boolean} True if request contains multipart data
 */
function isMultipartRequest(request) {
  const contentType =
    request.headers["content-type"] || request.headers["Content-Type"];
  return contentType && contentType.includes("multipart/form-data");
}

module.exports = {
  parseMultipartData,
  bufferToBase64DataUrl,
  extractImageFromMultipart,
  isMultipartRequest,
};
