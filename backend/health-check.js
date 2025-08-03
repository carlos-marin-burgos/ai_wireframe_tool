const axios = require('axios');

/**
 * Automated health checks for wireframe generation
 */
class WireframeHealthChecker {
  constructor(baseUrl = 'http://localhost:5001') {
    this.baseUrl = baseUrl;
    this.testCases = [
      {
        name: 'Simple Login Form',
        description: 'simple login form',
        theme: 'microsoftlearn',
        colorScheme: 'primary'
      },
      {
        name: 'Dashboard',
        description: 'analytics dashboard',
        theme: 'microsoftlearn',
        colorScheme: 'blue'
      }
    ];
  }

  async runHealthCheck() {
    console.log('🏥 Running wireframe health checks...');
    
    let allChecksPassed = true;
    const results = [];

    for (const testCase of this.testCases) {
      try {
        console.log(`\n🧪 Testing: ${testCase.name}`);
        
        const response = await axios.post(`${this.baseUrl}/api/generate-html-wireframe`, {
          description: testCase.description,
          theme: testCase.theme,
          colorScheme: testCase.colorScheme
        }, {
          timeout: 15000, // 15 second timeout
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'WireframeHealthChecker/1.0'
          }
        });

        const { html, fallback, error } = response.data;
        
        // Check if we got valid HTML
        const checks = [
          {
            name: 'Response received',
            passed: response.status === 200,
            value: response.status
          },
          {
            name: 'HTML content exists',
            passed: html && html.length > 0,
            value: html ? `${html.length} characters` : 'No HTML'
          },
          {
            name: 'Contains Microsoft Learn styling',
            passed: html && html.includes('Segoe UI') && html.includes('#0078d4'),
            value: html ? 'Styling detected' : 'No styling'
          },
          {
            name: 'No placeholder text',
            passed: html && !html.includes('${description}') && !html.includes('Simple wireframe template'),
            value: html && html.includes('${description}') ? 'Contains placeholders' : 'Clean template'
          },
          {
            name: 'Contains actual description',
            passed: html && html.includes(testCase.description),
            value: html && html.includes(testCase.description) ? 'Description found' : 'Description missing'
          }
        ];

        let testPassed = true;
        checks.forEach(check => {
          if (check.passed) {
            console.log(`  ✅ ${check.name}: ${check.value}`);
          } else {
            console.log(`  ❌ ${check.name}: ${check.value}`);
            testPassed = false;
            allChecksPassed = false;
          }
        });

        if (fallback) {
          console.log(`  📋 Using fallback template${error ? ` due to: ${error}` : ''}`);
        }

        results.push({
          testCase: testCase.name,
          passed: testPassed,
          fallbackUsed: !!fallback,
          error: error || null,
          htmlLength: html ? html.length : 0
        });

        console.log(`  🎯 Test Result: ${testPassed ? '✅ PASSED' : '❌ FAILED'}`);

      } catch (error) {
        console.log(`  💥 Test FAILED with error: ${error.message}`);
        allChecksPassed = false;
        results.push({
          testCase: testCase.name,
          passed: false,
          error: error.message,
          fallbackUsed: false,
          htmlLength: 0
        });
      }
    }

    // Generate summary report
    console.log('\n📊 Health Check Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      const fallback = result.fallbackUsed ? ' (Fallback)' : '';
      console.log(`${status} ${result.testCase}${fallback}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
      if (result.htmlLength > 0) {
        console.log(`    HTML Length: ${result.htmlLength} characters`);
      }
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Overall Result: ${allChecksPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`);

    return {
      passed: allChecksPassed,
      results: results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Run health checks on a schedule
   */
  startScheduledChecks(intervalMinutes = 30) {
    console.log(`🕐 Starting scheduled health checks every ${intervalMinutes} minutes`);
    
    // Run initial check
    this.runHealthCheck();
    
    // Schedule recurring checks
    setInterval(() => {
      console.log(`\n⏰ Scheduled health check at ${new Date().toISOString()}`);
      this.runHealthCheck();
    }, intervalMinutes * 60 * 1000);
  }
}

module.exports = WireframeHealthChecker;

// Run health check if this file is executed directly
if (require.main === module) {
  const checker = new WireframeHealthChecker();
  checker.runHealthCheck().then(result => {
    process.exit(result.passed ? 0 : 1);
  }).catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
  });
}
