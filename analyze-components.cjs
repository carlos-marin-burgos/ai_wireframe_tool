#!/usr/bin/env node

/**
 * Component Usage Analyzer
 * Identifies which React components are actually being used in the codebase
 */

const fs = require('fs');
const path = require('path');

// Read component directory
const path = require('path');

// Use relative paths instead of hardcoded paths
const componentsDir = path.join(__dirname, 'src', 'components');
const srcDir = path.join(__dirname, 'src');

function getAllTsxFiles(dir) {
  const files = [];
  
  function traverseDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverseDir(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverseDir(dir);
  return files;
}

function getComponentFiles() {
  const componentFiles = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => ({
      name: file.replace('.tsx', ''),
      filename: file,
      path: path.join(componentsDir, file)
    }));
  
  return componentFiles;
}

function findImportUsage(componentName, files) {
  const usage = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for import statements
      const importRegex = new RegExp(`import.*${componentName}.*from`, 'g');
      const jsxUsageRegex = new RegExp(`<${componentName}[\\s/>]`, 'g');
      
      const hasImport = importRegex.test(content);
      const hasJSXUsage = jsxUsageRegex.test(content);
      
      if (hasImport || hasJSXUsage) {
        usage.push({
          file: path.relative(srcDir, file),
          hasImport,
          hasJSXUsage,
          importMatches: content.match(importRegex) || [],
          jsxMatches: content.match(jsxUsageRegex) || []
        });
      }
    } catch (error) {
      console.warn(`Error reading file ${file}:`, error.message);
    }
  }
  
  return usage;
}

function analyzeComponents() {
  console.log('🔍 Analyzing React component usage...\n');
  
  const componentFiles = getComponentFiles();
  const allFiles = getAllTsxFiles(srcDir);
  
  console.log(`📁 Found ${componentFiles.length} component files`);
  console.log(`📄 Scanning ${allFiles.length} TypeScript/React files\n`);
  
  const results = {
    used: [],
    unused: [],
    duplicates: []
  };
  
  // Group by component name to find duplicates
  const componentsByName = {};
  
  for (const component of componentFiles) {
    if (!componentsByName[component.name]) {
      componentsByName[component.name] = [];
    }
    componentsByName[component.name].push(component);
  }
  
  // Check for duplicates
  for (const [name, components] of Object.entries(componentsByName)) {
    if (components.length > 1) {
      results.duplicates.push({
        name,
        files: components.map(c => c.filename)
      });
    }
  }
  
  // Analyze usage
  for (const component of componentFiles) {
    const usage = findImportUsage(component.name, allFiles);
    
    if (usage.length > 0) {
      results.used.push({
        component: component.name,
        filename: component.filename,
        usage
      });
    } else {
      results.unused.push({
        component: component.name,
        filename: component.filename,
        path: component.path
      });
    }
  }
  
  return results;
}

function generateReport(results) {
  console.log('📊 COMPONENT USAGE ANALYSIS REPORT');
  console.log('=' .repeat(50));
  
  // Used components
  console.log(`\n✅ USED COMPONENTS (${results.used.length}):`);
  console.log('-'.repeat(30));
  
  for (const item of results.used) {
    console.log(`📦 ${item.component}`);
    for (const usage of item.usage) {
      const status = usage.hasImport && usage.hasJSXUsage ? '✅ Full Usage' : 
                    usage.hasImport ? '📥 Import Only' : 
                    '🏷️  JSX Only';
      console.log(`   ${status} in ${usage.file}`);
    }
    console.log('');
  }
  
  // Unused components
  console.log(`\n❌ UNUSED COMPONENTS (${results.unused.length}):`);
  console.log('-'.repeat(30));
  
  for (const item of results.unused) {
    console.log(`🗑️  ${item.component} (${item.filename})`);
  }
  
  // Duplicate names
  if (results.duplicates.length > 0) {
    console.log(`\n⚠️  DUPLICATE COMPONENT NAMES (${results.duplicates.length}):`);
    console.log('-'.repeat(30));
    
    for (const duplicate of results.duplicates) {
      console.log(`🔄 ${duplicate.name}:`);
      for (const file of duplicate.files) {
        console.log(`   - ${file}`);
      }
      console.log('');
    }
  }
  
  // Summary
  console.log('\n📈 SUMMARY:');
  console.log('-'.repeat(20));
  console.log(`Total Components: ${results.used.length + results.unused.length}`);
  console.log(`Used: ${results.used.length}`);
  console.log(`Unused: ${results.unused.length}`);
  console.log(`Duplicates: ${results.duplicates.length}`);
  console.log(`Usage Rate: ${Math.round((results.used.length / (results.used.length + results.unused.length)) * 100)}%`);
  
  return results;
}

function generateCleanupScript(results) {
  const cleanupCommands = [];
  
  // Remove unused components
  for (const unused of results.unused) {
    cleanupCommands.push(`rm "${unused.path}"`);
    
    // Check for associated CSS files
    const cssPath = unused.path.replace('.tsx', '.css');
    if (fs.existsSync(cssPath)) {
      cleanupCommands.push(`rm "${cssPath}"`);
    }
  }
  
  // Create cleanup script
  const scriptContent = `#!/bin/bash

# Component Cleanup Script
# Generated on ${new Date().toISOString()}

echo "🧹 Starting component cleanup..."

# Backup first
echo "📁 Creating backup..."
cp -r src/components src/components.backup.$(date +%Y%m%d_%H%M%S)

# Remove unused components
${cleanupCommands.join('\n')}

echo "✅ Cleanup complete!"
echo "📊 Removed ${results.unused.length} unused components"
echo "💾 Backup saved in src/components.backup.*"
`;

  fs.writeFileSync('/Users/carlosmarinburgos/designetica/cleanup-components.sh', scriptContent);
  fs.chmodSync('/Users/carlosmarinburgos/designetica/cleanup-components.sh', '755');
  
  console.log('\n🛠️  CLEANUP SCRIPT GENERATED:');
  console.log('   ./cleanup-components.sh');
  console.log('\n⚠️  BACKUP WILL BE CREATED AUTOMATICALLY');
}

// Run the analysis
const results = analyzeComponents();
generateReport(results);
generateCleanupScript(results);

console.log('\n🎯 RECOMMENDATIONS:');
console.log('1. Review unused components before deletion');
console.log('2. Check duplicate components for consolidation opportunities');
console.log('3. Run cleanup script when ready: ./cleanup-components.sh');
