#!/usr/bin/env node

/**
 * Test Production Enhanced Image Wireframe System
 * Verifies that Phase 1 enhancements are working in production
 */

const fs = require('fs');
const path = require('path');

// Production API URL
const API_BASE_URL = 'https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net';

async function testImageToWireframe(imagePath) {
  console.log('🚀 Testing Enhanced Image Wireframe Generation in Production...');
  console.log(`📸 Image: ${imagePath}`);
  console.log(`🌐 API: ${API_BASE_URL}/api/direct-image-to-wireframe`);

  try {
    // Read the image file
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';

    // Test the enhanced API
    console.log('\n⚡ Making API request...');
    const response = await fetch(`${API_BASE_URL}/api/direct-image-to-wireframe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: `data:${mimeType};base64,${base64Image}`,
        designTheme: 'microsoft-learn', // Test theme-based colors
        options: {
          enhanced: true, // Enable Phase 1 enhancements
          quality: 'high',
          colorExtraction: 'prioritize-image', // Prioritize actual image colors
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log('\n✅ Production API Response Received!');
    console.log('📊 Response Status:', response.status);
    
    // Check for Phase 1 enhancement indicators
    if (result.html) {
      console.log('✅ HTML wireframe generated');
      console.log('📏 HTML length:', result.html.length, 'characters');
      
      // Check for enhanced features
      const hasAdvancedStructure = result.html.includes('role=') || result.html.includes('aria-');
      const hasColorStyling = result.html.includes('color:') || result.html.includes('background');
      const hasSemanticHTML = result.html.includes('<section>') || result.html.includes('<article>');
      
      console.log('🔧 Enhancement Checks:');
      console.log('  - Accessibility features:', hasAdvancedStructure ? '✅' : '❌');
      console.log('  - Color styling:', hasColorStyling ? '✅' : '❌');
      console.log('  - Semantic HTML:', hasSemanticHTML ? '✅' : '❌');
    }

    if (result.analysis) {
      console.log('✅ Enhanced analysis data available');
      console.log('📋 Analysis phases:', Object.keys(result.analysis).length);
    }

    if (result.colorStrategy) {
      console.log('✅ Color extraction strategy:', result.colorStrategy);
    }

    if (result.extractedColors) {
      console.log('🎨 Extracted colors:', result.extractedColors.slice(0, 3));
    }

    if (result.qualityScore !== undefined) {
      console.log('📈 Quality score:', result.qualityScore + '%');
    }

    console.log('\n🎉 Production Enhanced System Test SUCCESSFUL!');
    return result;

  } catch (error) {
    console.error('\n❌ Production Test Failed:', error.message);
    
    // Additional debugging info
    if (error.message.includes('fetch')) {
      console.log('💡 This might be a cold start issue. Try again in a few moments.');
    }
    
    throw error;
  }
}

// Test with a sample image (use the Microsoft Learn image if available)
async function runTest() {
  const testImages = [
    '/Users/carlosmarinburgos/designetica/backend/Microsoft-Learn-keyart-neutral-gray-angle-1.png',
    '/Users/carlosmarinburgos/designetica/backend/Hero300.png',
  ];

  for (const imagePath of testImages) {
    if (fs.existsSync(imagePath)) {
      try {
        console.log(`\n${'='.repeat(60)}`);
        await testImageToWireframe(imagePath);
        console.log(`${'='.repeat(60)}\n`);
        break; // Stop after first successful test
      } catch (error) {
        console.log(`Failed with ${path.basename(imagePath)}, trying next...`);
      }
    }
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  runTest().catch(console.error);
}

module.exports = { testImageToWireframe };