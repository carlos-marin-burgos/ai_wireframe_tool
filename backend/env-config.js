// Load environment variables from .env file
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Try to load environment variables from .env file
try {
  const envPath = path.resolve(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    console.log("✅ Loading environment variables from .env file");
    dotenv.config({ path: envPath });
  } else {
    console.log("⚠️ No .env file found, using existing environment variables");
  }
} catch (error) {
  console.error("❌ Error loading environment variables:", error);
}

// Validation function to check if required env vars are set
function validateEnv(requiredVars) {
  const missing = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `⚠️ Missing required environment variables: ${missing.join(", ")}`
    );
    return false;
  }

  return true;
}

// Azure OpenAI validation
function validateAzureOpenAI() {
  return validateEnv([
    "AZURE_OPENAI_KEY",
    "AZURE_OPENAI_ENDPOINT",
    "AZURE_OPENAI_DEPLOYMENT",
  ]);
}

module.exports = {
  validateEnv,
  validateAzureOpenAI,
};
