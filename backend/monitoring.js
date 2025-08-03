const fs = require('fs').promises;
const path = require('path');

/**
 * Wireframe Generation Monitoring Dashboard
 */
class WireframeMonitor {
  constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulGenerations: 0,
      fallbacksUsed: 0,
      errors: {},
      responseTimesMs: [],
      parameterValidationFailures: 0,
      lastHealthCheck: null
    };
    this.events = [];
    this.maxEvents = 1000; // Keep last 1000 events
  }

  /**
   * Log a wireframe generation event
   */
  logEvent(type, data) {
    const timestamp = new Date().toISOString();
    const event = { timestamp, type, ...data };
    
    this.events.unshift(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Update metrics
    this.updateMetrics(event);
    
    console.log(`📊 [${timestamp}] ${type}:`, JSON.stringify(data, null, 2));
  }

  updateMetrics(event) {
    switch (event.type) {
      case 'request_received':
        this.metrics.totalRequests++;
        break;
      case 'generation_success':
        this.metrics.successfulGenerations++;
        if (event.responseTimeMs) {
          this.metrics.responseTimesMs.push(event.responseTimeMs);
          // Keep only last 100 response times
          if (this.metrics.responseTimesMs.length > 100) {
            this.metrics.responseTimesMs = this.metrics.responseTimesMs.slice(-100);
          }
        }
        break;
      case 'fallback_used':
        this.metrics.fallbacksUsed++;
        break;
      case 'generation_error':
        const errorType = event.error || 'unknown';
        this.metrics.errors[errorType] = (this.metrics.errors[errorType] || 0) + 1;
        break;
      case 'parameter_validation_failed':
        this.metrics.parameterValidationFailures++;
        break;
      case 'health_check':
        this.metrics.lastHealthCheck = event;
        break;
    }
  }

  /**
   * Generate dashboard report
   */
  generateReport() {
    const avgResponseTime = this.metrics.responseTimesMs.length > 0 
      ? Math.round(this.metrics.responseTimesMs.reduce((a, b) => a + b, 0) / this.metrics.responseTimesMs.length)
      : 0;

    const successRate = this.metrics.totalRequests > 0 
      ? Math.round((this.metrics.successfulGenerations / this.metrics.totalRequests) * 100)
      : 0;

    const fallbackRate = this.metrics.totalRequests > 0 
      ? Math.round((this.metrics.fallbacksUsed / this.metrics.totalRequests) * 100)
      : 0;

    return {
      summary: {
        totalRequests: this.metrics.totalRequests,
        successfulGenerations: this.metrics.successfulGenerations,
        successRate: `${successRate}%`,
        fallbacksUsed: this.metrics.fallbacksUsed,
        fallbackRate: `${fallbackRate}%`,
        averageResponseTimeMs: avgResponseTime,
        parameterValidationFailures: this.metrics.parameterValidationFailures,
        lastHealthCheck: this.metrics.lastHealthCheck
      },
      errors: this.metrics.errors,
      recentEvents: this.events.slice(0, 10) // Last 10 events
    };
  }

  /**
   * Display dashboard in console
   */
  displayDashboard() {
    const report = this.generateReport();
    
    console.clear();
    console.log('🎯 WIREFRAME GENERATION MONITORING DASHBOARD');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📈 PERFORMANCE METRICS');
    console.log('─'.repeat(50));
    console.log(`Total Requests: ${report.summary.totalRequests}`);
    console.log(`Successful Generations: ${report.summary.successfulGenerations}`);
    console.log(`Success Rate: ${report.summary.successRate}`);
    console.log(`Fallbacks Used: ${report.summary.fallbacksUsed} (${report.summary.fallbackRate})`);
    console.log(`Average Response Time: ${report.summary.averageResponseTimeMs}ms`);
    console.log(`Parameter Validation Failures: ${report.summary.parameterValidationFailures}`);

    if (Object.keys(report.errors).length > 0) {
      console.log('\n🚨 ERROR BREAKDOWN');
      console.log('─'.repeat(50));
      Object.entries(report.errors).forEach(([error, count]) => {
        console.log(`${error}: ${count} occurrences`);
      });
    }

    if (report.summary.lastHealthCheck) {
      console.log('\n🏥 LAST HEALTH CHECK');
      console.log('─'.repeat(50));
      console.log(`Status: ${report.summary.lastHealthCheck.passed ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`Timestamp: ${report.summary.lastHealthCheck.timestamp}`);
      if (report.summary.lastHealthCheck.results) {
        report.summary.lastHealthCheck.results.forEach(result => {
          const status = result.passed ? '✅' : '❌';
          console.log(`  ${status} ${result.testCase}${result.fallbackUsed ? ' (Fallback)' : ''}`);
        });
      }
    }

    if (report.recentEvents.length > 0) {
      console.log('\n📋 RECENT EVENTS');
      console.log('─'.repeat(50));
      report.recentEvents.forEach(event => {
        const time = new Date(event.timestamp).toLocaleTimeString();
        let details = '';
        
        switch (event.type) {
          case 'generation_success':
            details = `✅ ${event.description || 'Unknown'} (${event.responseTimeMs}ms)`;
            break;
          case 'fallback_used':
            details = `📋 ${event.description || 'Unknown'} - ${event.reason || 'Unknown reason'}`;
            break;
          case 'generation_error':
            details = `❌ ${event.error || 'Unknown error'}`;
            break;
          case 'parameter_validation_failed':
            details = `⚠️  Invalid parameters: ${event.validationError || 'Unknown'}`;
            break;
          default:
            details = JSON.stringify(event).substring(0, 100);
        }
        
        console.log(`${time}: ${details}`);
      });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Last Updated: ${new Date().toLocaleString()}`);
  }

  /**
   * Save monitoring data to file
   */
  async saveReport(filename = 'monitoring-report.json') {
    const report = this.generateReport();
    const filepath = path.join(__dirname, filename);
    
    try {
      await fs.writeFile(filepath, JSON.stringify(report, null, 2));
      console.log(`📁 Monitoring report saved to: ${filepath}`);
    } catch (error) {
      console.error('Failed to save monitoring report:', error);
    }
  }

  /**
   * Start live dashboard updates
   */
  startLiveDashboard(updateIntervalSeconds = 30) {
    console.log(`🔄 Starting live dashboard updates every ${updateIntervalSeconds} seconds`);
    
    // Initial display
    this.displayDashboard();
    
    // Schedule updates
    setInterval(() => {
      this.displayDashboard();
    }, updateIntervalSeconds * 1000);
  }

  /**
   * Export alert conditions
   */
  checkAlerts() {
    const report = this.generateReport();
    const alerts = [];

    // High error rate alert
    if (report.summary.totalRequests > 10 && parseInt(report.summary.successRate) < 80) {
      alerts.push({
        level: 'HIGH',
        message: `Success rate dropped to ${report.summary.successRate}`,
        type: 'LOW_SUCCESS_RATE'
      });
    }

    // High fallback rate alert
    if (report.summary.totalRequests > 10 && parseInt(report.summary.fallbackRate) > 50) {
      alerts.push({
        level: 'MEDIUM',
        message: `High fallback usage: ${report.summary.fallbackRate}`,
        type: 'HIGH_FALLBACK_RATE'
      });
    }

    // Slow response time alert
    if (report.summary.averageResponseTimeMs > 10000) {
      alerts.push({
        level: 'MEDIUM',
        message: `Slow response time: ${report.summary.averageResponseTimeMs}ms`,
        type: 'SLOW_RESPONSE'
      });
    }

    // Parameter validation failures
    if (report.summary.parameterValidationFailures > 0) {
      alerts.push({
        level: 'LOW',
        message: `${report.summary.parameterValidationFailures} parameter validation failures`,
        type: 'VALIDATION_FAILURES'
      });
    }

    if (alerts.length > 0) {
      console.log('\n🚨 ALERTS:');
      alerts.forEach(alert => {
        const icon = alert.level === 'HIGH' ? '🔴' : alert.level === 'MEDIUM' ? '🟡' : '🟠';
        console.log(`${icon} [${alert.level}] ${alert.message}`);
      });
    }

    return alerts;
  }
}

module.exports = WireframeMonitor;

// Example integration
if (require.main === module) {
  const monitor = new WireframeMonitor();
  
  // Simulate some events for demo
  monitor.logEvent('request_received', { description: 'test form' });
  monitor.logEvent('generation_success', { description: 'test form', responseTimeMs: 1250 });
  monitor.logEvent('fallback_used', { description: 'dashboard', reason: 'OpenAI rate limit' });
  
  monitor.displayDashboard();
}
