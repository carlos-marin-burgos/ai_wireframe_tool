#!/usr/bin/env node

/**
 * API Documentation Generator - Build Script
 * 
 * Node.js script to generate API documentation from Azure Functions
 */

const fs = require('fs');
const path = require('path');

class ApiDocumentationGenerator {
  constructor(backendPath, outputPath) {
    this.backendPath = backendPath;
    this.outputPath = outputPath;
  }

  async scanAzureFunctions() {
    const functions = [];
    
    if (!fs.existsSync(this.backendPath)) {
      throw new Error(`Backend path does not exist: ${this.backendPath}`);
    }

    const entries = fs.readdirSync(this.backendPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const functionPath = path.join(this.backendPath, entry.name);
        const functionJsonPath = path.join(functionPath, 'function.json');
        
        if (fs.existsSync(functionJsonPath)) {
          try {
            const functionConfig = JSON.parse(fs.readFileSync(functionJsonPath, 'utf8'));
            const func = this.parseFunctionDefinition(entry.name, functionConfig);
            if (func) {
              functions.push(func);
            }
          } catch (error) {
            console.warn(`Failed to parse function.json for ${entry.name}:`, error);
          }
        }
      }
    }

    return functions.sort((a, b) => a.name.localeCompare(b.name));
  }

  parseFunctionDefinition(name, config) {
    const httpTrigger = config.bindings?.find((binding) => 
      binding.type === 'httpTrigger'
    );

    if (!httpTrigger) {
      return null;
    }

    return {
      name,
      route: httpTrigger.route || name,
      methods: httpTrigger.methods || ['GET', 'POST'],
      authLevel: httpTrigger.authLevel || 'anonymous',
      description: config.description || `Azure Function: ${name}`,
    };
  }

  async generate() {
    console.log(`📖 Generating API documentation from ${this.backendPath}...`);
    
    const functions = await this.scanAzureFunctions();
    const endpoints = functions.map(f => `/api/${f.route || f.name}`);
    
    const documentation = {
      functions,
      endpoints,
      generatedAt: new Date().toISOString(),
      backendPath: this.backendPath,
    };

    // Generate TypeScript types
    const typeContent = `/**
 * Auto-generated API Types
 * Generated at: ${documentation.generatedAt}
 * 
 * ⚠️ DO NOT EDIT MANUALLY - This file is auto-generated
 */

export const DISCOVERED_ENDPOINTS = [
${documentation.endpoints.map(endpoint => `  '${endpoint}',`).join('\n')}
] as const;

export type DiscoveredEndpoint = typeof DISCOVERED_ENDPOINTS[number];

export const AZURE_FUNCTIONS_INFO = ${JSON.stringify(documentation.functions, null, 2)};
`;

    // Ensure output directory exists
    const outputDir = path.dirname(this.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save files
    const typesPath = path.join(outputDir, 'discovered-api-types.ts');
    fs.writeFileSync(typesPath, typeContent, 'utf8');
    console.log(`📝 Generated: ${typesPath}`);

    const jsonPath = path.join(outputDir, 'api-discovery.json');
    fs.writeFileSync(jsonPath, JSON.stringify(documentation, null, 2), 'utf8');
    console.log(`📝 Generated: ${jsonPath}`);

    console.log(`✅ Successfully generated documentation for ${functions.length} functions`);
    return documentation;
  }
}

// Run if called directly
if (require.main === module) {
  const backendPath = process.argv[2] || path.join(__dirname, '../../backend');
  const outputPath = process.argv[3] || path.join(__dirname, '../generated');
  
  const generator = new ApiDocumentationGenerator(backendPath, outputPath);
  
  generator.generate()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Documentation generation failed:', error);
      process.exit(1);
    });
}

module.exports = ApiDocumentationGenerator;