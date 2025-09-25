module.exports = async function (context, req) {
  const { BlobServiceClient } = require("@azure/storage-blob");

  try {
    console.log("🧪 Testing Azure Storage connection...");

    const connectionString = process.env.AzureWebJobsStorage;
    if (!connectionString) {
      throw new Error("AzureWebJobsStorage not found");
    }

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient =
      blobServiceClient.getContainerClient("figma-tokens");

    // Test container access
    const exists = await containerClient.exists();
    console.log("📦 Container exists:", exists);

    if (!exists) {
      console.log("📦 Creating container...");
      await containerClient.create();
      console.log("✅ Container created");
    }

    // Test blob write
    const blockBlobClient =
      containerClient.getBlockBlobClient("test-blob.json");
    const testData = JSON.stringify({ test: "data", timestamp: new Date() });

    await blockBlobClient.upload(testData, testData.length, {
      overwrite: true,
    });
    console.log("✅ Test blob uploaded");

    // Test blob read
    const downloadResponse = await blockBlobClient.download();
    const chunks = [];
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(chunk);
    }
    const downloadedContent = Buffer.concat(chunks).toString();
    console.log("✅ Test blob downloaded:", downloadedContent);

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: "Azure Storage test passed",
        containerExists: exists,
        testData: JSON.parse(downloadedContent),
      },
    };
  } catch (error) {
    console.error("❌ Storage test failed:", error);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        success: false,
        error: error.message,
        details: error.toString(),
      },
    };
  }
};
