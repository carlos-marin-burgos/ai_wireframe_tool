/**
 * Azure Functions API Documentation Generator
 *
 * This utility automatically discovers Azure Functions from the backend
 * and generates TypeScript types and documentation to keep the frontend in sync.
 */

import fs from "fs";
import path from "path";

interface FunctionDefinition {
  name: string;
  route?: string;
  methods: string[];
  authLevel: string;
  description?: string;
}

interface ApiDocumentation {
  functions: FunctionDefinition[];
  endpoints: string[];
  generatedAt: string;
  backendPath: string;
}

export class ApiDocumentationGenerator {
  private backendPath: string;
  private outputPath: string;

  constructor(backendPath: string, outputPath: string) {
    this.backendPath = backendPath;
    this.outputPath = outputPath;
  }

  /**
   * Scan the backend directory for Azure Functions
   */
  async scanAzureFunctions(): Promise<FunctionDefinition[]> {
    const functions: FunctionDefinition[] = [];

    if (!fs.existsSync(this.backendPath)) {
      throw new Error(`Backend path does not exist: ${this.backendPath}`);
    }

    const entries = fs.readdirSync(this.backendPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const functionPath = path.join(this.backendPath, entry.name);
        const functionJsonPath = path.join(functionPath, "function.json");

        if (fs.existsSync(functionJsonPath)) {
          try {
            const functionConfig = JSON.parse(
              fs.readFileSync(functionJsonPath, "utf8")
            );
            const func = this.parseFunctionDefinition(
              entry.name,
              functionConfig
            );
            if (func) {
              functions.push(func);
            }
          } catch (error) {
            console.warn(
              `Failed to parse function.json for ${entry.name}:`,
              error
            );
          }
        }
      }
    }

    return functions.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Parse a function.json file into a FunctionDefinition
   */
  private parseFunctionDefinition(
    name: string,
    config: any
  ): FunctionDefinition | null {
    const httpTrigger = config.bindings?.find(
      (binding: any) => binding.type === "httpTrigger"
    );

    if (!httpTrigger) {
      return null; // Not an HTTP-triggered function
    }

    return {
      name,
      route: httpTrigger.route || name,
      methods: httpTrigger.methods || ["GET", "POST"],
      authLevel: httpTrigger.authLevel || "anonymous",
      description: config.description || `Azure Function: ${name}`,
    };
  }

  /**
   * Generate API documentation
   */
  async generateDocumentation(): Promise<ApiDocumentation> {
    console.log(`📖 Generating API documentation from ${this.backendPath}...`);

    const functions = await this.scanAzureFunctions();
    const endpoints = functions.map((f) => `/api/${f.route || f.name}`);

    const documentation: ApiDocumentation = {
      functions,
      endpoints,
      generatedAt: new Date().toISOString(),
      backendPath: this.backendPath,
    };

    console.log(
      `📖 Found ${functions.length} Azure Functions with HTTP triggers`
    );

    return documentation;
  }

  /**
   * Generate TypeScript types file
   */
  async generateTypeScriptTypes(
    documentation: ApiDocumentation
  ): Promise<string> {
    const typeContent = `/**
 * Auto-generated API Types
 * Generated at: ${documentation.generatedAt}
 * Source: ${documentation.backendPath}
 * 
 * ⚠️ DO NOT EDIT MANUALLY - This file is auto-generated
 * Run the API documentation generator to update this file.
 */

// Available Azure Function endpoints
export const AVAILABLE_ENDPOINTS = [
${documentation.endpoints.map((endpoint) => `  '${endpoint}',`).join("\n")}
] as const;

export type AvailableEndpoint = typeof AVAILABLE_ENDPOINTS[number];

// Function definitions
export interface AzureFunctionDefinition {
  name: string;
  route?: string;
  methods: string[];
  authLevel: string;
  description?: string;
}

export const AZURE_FUNCTIONS: AzureFunctionDefinition[] = [
${documentation.functions
  .map(
    (func) => `  {
    name: '${func.name}',
    route: '${func.route}',
    methods: [${func.methods.map((m) => `'${m}'`).join(", ")}],
    authLevel: '${func.authLevel}',
    description: '${func.description || ""}',
  },`
  )
  .join("\n")}
];

// Endpoint validation helper
export function isValidEndpoint(endpoint: string): endpoint is AvailableEndpoint {
  return AVAILABLE_ENDPOINTS.includes(endpoint as AvailableEndpoint);
}

// Generate endpoint URL helper
export function getEndpointUrl(endpoint: AvailableEndpoint, baseUrl: string = ''): string {
  return \`\${baseUrl}\${endpoint}\`;
}
`;

    return typeContent;
  }

  /**
   * Generate markdown documentation
   */
  async generateMarkdownDocs(documentation: ApiDocumentation): Promise<string> {
    const markdownContent = `# API Documentation

**Generated at:** ${new Date(documentation.generatedAt).toLocaleString()}  
**Source:** ${documentation.backendPath}  
**Total Functions:** ${documentation.functions.length}

## Available Endpoints

${documentation.functions
  .map(
    (func) => `
### ${func.name}

- **Endpoint:** \`/api/${func.route || func.name}\`
- **Methods:** ${func.methods.join(", ")}
- **Auth Level:** ${func.authLevel}
- **Description:** ${func.description || "No description available"}
`
  )
  .join("\n")}

## Usage Examples

### JavaScript/TypeScript
\`\`\`typescript
import { AVAILABLE_ENDPOINTS, isValidEndpoint } from './generated-api-types';

// Validate endpoint
if (isValidEndpoint('/api/generate-wireframe')) {
  const response = await fetch('/api/generate-wireframe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: 'My wireframe' }),
  });
}
\`\`\`

### cURL Examples
${documentation.functions
  .filter((f) => f.methods.includes("POST"))
  .map(
    (func) => `
\`\`\`bash
# ${func.name}
curl -X POST "http://localhost:7071/api/${func.route || func.name}" \\
  -H "Content-Type: application/json" \\
  -d '{"example": "data"}'
\`\`\`
`
  )
  .join("\n")}

---
*This documentation is auto-generated. Do not edit manually.*
`;

    return markdownContent;
  }

  /**
   * Save generated documentation to files
   */
  async saveDocumentation(documentation: ApiDocumentation): Promise<void> {
    // Ensure output directory exists
    const outputDir = path.dirname(this.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate and save TypeScript types
    const typeScriptContent = await this.generateTypeScriptTypes(documentation);
    const typesPath = path.join(outputDir, "generated-api-types.ts");
    fs.writeFileSync(typesPath, typeScriptContent, "utf8");
    console.log(`📝 Generated TypeScript types: ${typesPath}`);

    // Generate and save markdown documentation
    const markdownContent = await this.generateMarkdownDocs(documentation);
    const docsPath = path.join(outputDir, "API_REFERENCE.md");
    fs.writeFileSync(docsPath, markdownContent, "utf8");
    console.log(`📝 Generated API documentation: ${docsPath}`);

    // Save JSON documentation
    const jsonPath = path.join(outputDir, "api-documentation.json");
    fs.writeFileSync(jsonPath, JSON.stringify(documentation, null, 2), "utf8");
    console.log(`📝 Generated JSON documentation: ${jsonPath}`);
  }

  /**
   * Run the full documentation generation process
   */
  async generate(): Promise<ApiDocumentation> {
    const documentation = await this.generateDocumentation();
    await this.saveDocumentation(documentation);
    return documentation;
  }
}

// CLI usage for build scripts
if (
  import.meta.url ===
  new URL(import.meta.resolve("./apiDocumentationGenerator")).href
) {
  const backendPath = process.argv[2] || "../backend";
  const outputPath = process.argv[3] || "./src/generated";

  const generator = new ApiDocumentationGenerator(backendPath, outputPath);

  generator
    .generate()
    .then((docs) => {
      console.log(
        `✅ Successfully generated documentation for ${docs.functions.length} functions`
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Documentation generation failed:", error);
      process.exit(1);
    });
}

export default ApiDocumentationGenerator;
