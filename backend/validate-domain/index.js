/**
 * Domain Validation API for Azure Static Web Apps
 * Validates TXT records and provides domain verification instructions
 */

const dns = require("dns").promises;

/**
 * Generate required TXT record pattern
 */
function generateRequiredTxtRecord(type, domain) {
  // For designetica.onmicrosoft.com, we have the actual verification ID
  if (domain === "designetica.onmicrosoft.com") {
    return "ms-azure-staticwebapp-verify=_gizsvol1m4gbecw8dzqz8243knshkws";
  }

  switch (type) {
    case "azure-static-web-app":
      return "ms-azure-staticwebapp-verify=<verification-id>";
    case "github-pages":
      return "github-pages-challenge-<username>";
    default:
      return "ms-azure-staticwebapp-verify=<verification-id>";
  }
}

module.exports = async function (context, req) {
  const startTime = Date.now();

  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = { error: "Method not allowed. Use POST." };
      return;
    }

    const { domain, type } = req.body || {};

    if (!domain) {
      context.res.status = 400;
      context.res.body = {
        error: "Domain is required",
        example: { domain: "example.com", type: "azure-static-web-app" },
      };
      return;
    }

    // Validate domain format
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    if (!domainRegex.test(domain)) {
      context.res.status = 400;
      context.res.body = { error: "Invalid domain format" };
      return;
    }

    context.log(`🔍 Validating domain: ${domain} (type: ${type})`);

    const result = await validateDomainTxtRecord(domain, type, context);

    context.res.status = 200;
    context.res.body = {
      domain,
      type: type || "azure-static-web-app",
      timestamp: new Date().toISOString(),
      performance: {
        responseTimeMs: Date.now() - startTime,
      },
      ...result,
    };
  } catch (error) {
    context.log.error("❌ Domain validation error:", error);

    context.res.status = 500;
    context.res.body = {
      error: "Internal server error during domain validation",
      message: error.message,
      timestamp: new Date().toISOString(),
      performance: {
        responseTimeMs: Date.now() - startTime,
      },
    };
  }
};

/**
 * Validate domain TXT record based on type
 */
async function validateDomainTxtRecord(domain, type, context) {
  try {
    // Query TXT records for the domain
    const txtRecords = await dns.resolveTxt(domain);
    const flatRecords = txtRecords.flat();

    context.log(
      `📋 Found ${flatRecords.length} TXT records for ${domain}:`,
      flatRecords
    );

    let verified = false;
    let foundRecord = null;
    let requiredPattern = null;

    switch (type) {
      case "azure-static-web-app":
        // Azure Static Web Apps verification pattern
        if (domain === "designetica.onmicrosoft.com") {
          // Check for specific verification ID
          foundRecord = flatRecords.find(
            (record) =>
              record ===
              "ms-azure-staticwebapp-verify=_gizsvol1m4gbecw8dzqz8243knshkws"
          );
          verified = !!foundRecord;
        } else {
          // Generic pattern for other domains
          requiredPattern = /^ms-azure-staticwebapp-verify=/;
          foundRecord = flatRecords.find((record) =>
            requiredPattern.test(record)
          );
          verified = !!foundRecord;
        }
        break;

      case "github-pages":
        // GitHub Pages verification pattern
        requiredPattern = /^github-pages-challenge-/;
        foundRecord = flatRecords.find((record) =>
          requiredPattern.test(record)
        );
        verified = !!foundRecord;
        break;

      case "custom":
        // Generic verification - just check if any TXT record exists
        verified = flatRecords.length > 0;
        foundRecord = flatRecords[0];
        break;

      default:
        // Default to Azure Static Web Apps
        requiredPattern = /^ms-azure-staticwebapp-verify=/;
        foundRecord = flatRecords.find((record) =>
          requiredPattern.test(record)
        );
        verified = !!foundRecord;
    }

    const result = {
      verified,
      txtRecords: flatRecords,
      foundRecord,
      dnsResolutionSuccess: true,
    };

    if (verified) {
      context.log(`✅ Domain verification successful for ${domain}`);
      result.status = "verified";
      result.message = "Domain has valid verification TXT record";
    } else {
      context.log(`⚠️ Domain verification failed for ${domain}`);
      result.status = "unverified";
      result.message = "Domain verification TXT record not found";
      result.instructions = getVerificationInstructions(domain, type);
      result.requiredTxtRecord = generateRequiredTxtRecord(type, domain);
    }

    return result;
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "ENODATA") {
      context.log(`🔍 No TXT records found for ${domain}`);
      return {
        verified: false,
        status: "unverified",
        message: "No TXT records found for domain",
        dnsResolutionSuccess: true,
        txtRecords: [],
        instructions: getVerificationInstructions(domain, type),
        requiredTxtRecord: generateRequiredTxtRecord(type, domain),
      };
    } else {
      context.log.error(`❌ DNS resolution failed for ${domain}:`, error);
      return {
        verified: false,
        status: "dns_error",
        message: "DNS resolution failed",
        dnsResolutionSuccess: false,
        error: error.message,
        instructions: getVerificationInstructions(domain, type),
        requiredTxtRecord: generateRequiredTxtRecord(type, domain),
      };
    }
  }
}

/**
 * Generate verification instructions based on type
 */
function getVerificationInstructions(domain, type) {
  const baseInstructions = {
    azure: {
      title: "Azure Static Web Apps Domain Verification",
      steps: [
        "1. Go to Azure Portal → Static Web Apps",
        "2. Select your Static Web App resource",
        "3. Navigate to 'Custom domains' in the left menu",
        "4. Click 'Add' and enter your domain name",
        "5. Azure will provide a verification TXT record",
        "6. Add this TXT record to your domain's DNS settings",
        "7. Wait for DNS propagation (5-60 minutes)",
        "8. Return to Azure Portal and click 'Validate'",
      ],
      dnsSettings: {
        type: "TXT",
        name: "@ (or root/apex)",
        value: "ms-azure-staticwebapp-verify=<verification-id>",
        ttl: "3600",
      },
    },
    github: {
      title: "GitHub Pages Domain Verification",
      steps: [
        "1. Go to GitHub repository settings",
        "2. Navigate to 'Pages' section",
        "3. Add your custom domain",
        "4. GitHub will provide a verification challenge",
        "5. Add the TXT record to your DNS settings",
        "6. Wait for DNS propagation",
        "7. GitHub will automatically verify",
      ],
      dnsSettings: {
        type: "TXT",
        name: "@ (or root/apex)",
        value: "github-pages-challenge-<username>",
        ttl: "3600",
      },
    },
  };

  switch (type) {
    case "azure-static-web-app":
      return baseInstructions.azure;
    case "github-pages":
      return baseInstructions.github;
    default:
      return baseInstructions.azure; // Default to Azure
  }
}

/**
 * Generate required TXT record pattern
 */
function generateRequiredTxtRecord(type) {
  switch (type) {
    case "azure-static-web-app":
      return "ms-azure-staticwebapp-verify=<verification-id>";
    case "github-pages":
      return "github-pages-challenge-<username>";
    default:
      return "ms-azure-staticwebapp-verify=<verification-id>";
  }
}
