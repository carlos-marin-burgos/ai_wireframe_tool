#!/usr/bin/env node

// Test Azure Storage Blob integration for Figma OAuth tokens
const { BlobServiceClient } = require("@azure/storage-blob");

const CONTAINER_NAME = "figma-tokens";
const BLOB_NAME = "oauth-tokens.json";

async function testStorageIntegration() {
  try {
    console.log("🧪 Testing Azure Storage integration for OAuth tokens");

    // Test connection string
    const connectionString = process.env.AzureWebJobsStorage;
    if (!connectionString) {
      throw new Error("AzureWebJobsStorage environment variable not found");
    }
    console.log("✅ Connection string found");

    // Initialize client
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    console.log("✅ BlobServiceClient initialized");

    // Test container operations
    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);

    // Check if container exists, create if not
    const containerExists = await containerClient.exists();
    console.log("📦 Container exists:", containerExists);

    if (!containerExists) {
      console.log("📦 Creating private container...");
      await containerClient.create(); // Create private container (no public access)
      console.log("✅ Container created successfully");
    }

    // Test token data structure
    const testTokens = {
      access_token: "test_access_token_12345",
      refresh_token: "test_refresh_token_67890",
      expires_at: Date.now() + 3600000, // 1 hour from now
      scope: "files:read",
      created_at: Date.now(),
    };

    // Test write operation
    console.log("💾 Testing blob upload...");
    const blockBlobClient = containerClient.getBlockBlobClient(BLOB_NAME);
    const tokenJson = JSON.stringify(testTokens, null, 2);

    await blockBlobClient.upload(tokenJson, tokenJson.length, {
      overwrite: true,
      metadata: {
        created: new Date().toISOString(),
        scope: testTokens.scope,
      },
    });
    console.log("✅ Blob uploaded successfully");

    // Test read operation
    console.log("📖 Testing blob download...");
    const downloadResponse = await blockBlobClient.download();
    const downloadedContent = await streamToString(
      downloadResponse.readableStreamBody
    );
    const parsedTokens = JSON.parse(downloadedContent);

    console.log("✅ Blob downloaded successfully");
    console.log("🔑 Parsed tokens:", {
      access_token: parsedTokens.access_token?.substring(0, 20) + "...",
      scope: parsedTokens.scope,
      expires_at: new Date(parsedTokens.expires_at).toISOString(),
    });

    // Verify data integrity
    if (
      parsedTokens.access_token === testTokens.access_token &&
      parsedTokens.scope === testTokens.scope
    ) {
      console.log("✅ Data integrity verified - tokens match!");
    } else {
      throw new Error("Data integrity failed - tokens don't match");
    }

    console.log("\n🎉 All storage tests passed!");
  } catch (error) {
    console.error("❌ Storage test failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

// Helper function to convert stream to string
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}

testStorageIntegration();
