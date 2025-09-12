/**
 * Dashboard endpoint for monitoring wireframe generation
 */
const WireframeMonitor = require("./monitoring");
const http = require("http");

// Initialize the monitor (should be shared instance in production)
const monitor = new WireframeMonitor();

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let data = "";
      response.on("data", (chunk) => (data += chunk));
      response.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error("Invalid JSON response"));
        }
      });
    });

    request.on("error", reject);
    request.setTimeout(5000, () => {
      request.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

/**
 * Dashboard API endpoint
 * GET /api/dashboard - Returns monitoring data including OpenAI status
 */
async function getDashboardData(req, res) {
  try {
    const report = monitor.generateReport();
    const alerts = monitor.checkAlerts();

    // Fetch OpenAI health status
    let openaiHealth = null;
    try {
      openaiHealth = await makeRequest(
        "http://localhost:7072/api/openai-health"
      );
    } catch (error) {
      console.log("Could not fetch OpenAI health:", error.message);
      openaiHealth = {
        overall_status: "unknown",
        error: "Health check unavailable",
        openai: {
          status: "unknown",
          error: "Cannot connect to health endpoint",
        },
      };
    }

    res.json({
      success: true,
      data: {
        ...report,
        alerts,
        openaiHealth,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate dashboard data",
    });
  }
}

/**
 * Dashboard HTML page
 * GET /dashboard - Returns HTML dashboard
 */
function getDashboardPage(req, res) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wireframe Generation Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .metric-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .metric-card h3 {
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .metric-card .value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #333;
        }
        
        .metric-card.success .value {
            color: #4caf50;
        }
        
        .metric-card.warning .value {
            color: #ff9800;
        }
        
        .metric-card.error .value {
            color: #f44336;
        }
        
        .section {
            background: white;
            margin-bottom: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .section-header {
            padding: 20px 25px 0;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
        }
        
        .section-header h2 {
            color: #333;
            font-size: 1.5rem;
        }
        
        .section-content {
            padding: 0 25px 25px;
        }
        
        .alert {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .alert.high {
            background: #ffebee;
            border-left: 4px solid #f44336;
            color: #c62828;
        }
        
        .alert.medium {
            background: #fff8e1;
            border-left: 4px solid #ff9800;
            color: #e65100;
        }
        
        .alert.low {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            color: #1565c0;
        }
        
        .events-list {
            list-style: none;
        }
        
        .event-item {
            padding: 12px;
            margin: 8px 0;
            background: #f9f9f9;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .event-time {
            font-size: 0.9rem;
            color: #666;
            font-weight: 500;
        }
        
        .event-details {
            flex-grow: 1;
            margin-left: 15px;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.2s;
        }
        
        .refresh-btn:hover {
            transform: translateY(-2px);
        }
        
        .last-updated {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 0.9rem;
        }
        
        /* OpenAI Status Styles */
        .openai-status {
            background: white;
            margin-bottom: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .openai-status-header {
            background: linear-gradient(135deg, #8E9AAF 0%, #68769C 100%);
            color: white;
            padding: 20px 25px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .openai-status-header h2 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .openai-status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .openai-status-indicator.up {
            background: #4caf50;
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
        }
        
        .openai-status-indicator.down {
            background: #f44336;
            box-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
        }
        
        .openai-status-indicator.degraded {
            background: #ff9800;
            box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
        }
        
        .openai-status-indicator.unknown {
            background: #9e9e9e;
            box-shadow: 0 0 10px rgba(158, 158, 158, 0.5);
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .openai-status-content {
            padding: 25px;
        }
        
        .openai-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .openai-metric {
            text-align: center;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        
        .openai-metric-label {
            font-size: 0.8rem;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .openai-metric-value {
            font-size: 1.2rem;
            font-weight: bold;
            color: #333;
        }
        
        .openai-metric-value.good {
            color: #4caf50;
        }
        
        .openai-metric-value.warning {
            color: #ff9800;
        }
        
        .openai-metric-value.error {
            color: #f44336;
        }
        
        .openai-details {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            font-size: 0.9rem;
            color: #666;
        }
        
        .openai-details strong {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🎯 Wireframe Generation Dashboard</h1>
            <p>Real-time monitoring and analytics</p>
            <button class="refresh-btn" onclick="loadDashboard()">🔄 Refresh</button>
        </div>
        
        <div id="dashboard-content" class="loading">
            Loading dashboard data...
        </div>
    </div>

    <script>
        async function loadDashboard() {
            try {
                const response = await fetch('/api/dashboard');
                const result = await response.json();
                
                if (result.success) {
                    renderDashboard(result.data);
                } else {
                    document.getElementById('dashboard-content').innerHTML = 
                        '<div class="alert high">❌ Failed to load dashboard data</div>';
                }
            } catch (error) {
                console.error('Dashboard load error:', error);
                document.getElementById('dashboard-content').innerHTML = 
                    '<div class="alert high">❌ Error connecting to dashboard API</div>';
            }
        }
        
        function renderDashboard(data) {
            const content = document.getElementById('dashboard-content');
            
            // Function to render OpenAI status
            function renderOpenAIStatus(openaiHealth) {
                if (!openaiHealth) {
                    return '<div class="alert medium">⚠️ OpenAI status unavailable</div>';
                }
                
                const status = openaiHealth.openai?.status || 'unknown';
                const overall = openaiHealth.overall_status || 'unknown';
                
                let statusText, statusClass, statusIcon;
                switch(status) {
                    case 'up':
                        statusText = 'Online & Healthy';
                        statusClass = 'up';
                        statusIcon = '🟢';
                        break;
                    case 'degraded':
                        statusText = 'Degraded Performance';
                        statusClass = 'degraded';
                        statusIcon = '🟡';
                        break;
                    case 'rate_limited':
                        statusText = 'Rate Limited';
                        statusClass = 'degraded';
                        statusIcon = '🟡';
                        break;
                    case 'down':
                    case 'auth_error':
                    case 'connection_error':
                    case 'server_error':
                        statusText = 'Service Down';
                        statusClass = 'down';
                        statusIcon = '🔴';
                        break;
                    default:
                        statusText = 'Status Unknown';
                        statusClass = 'unknown';
                        statusIcon = '⚪';
                }
                
                const responseTime = openaiHealth.openai?.responseTime || 0;
                const lastCheck = openaiHealth.timestamp ? new Date(openaiHealth.timestamp).toLocaleTimeString() : 'Unknown';
                
                return \`
                    <div class="openai-status">
                        <div class="openai-status-header">
                            <div class="openai-status-indicator \${statusClass}"></div>
                            <h2>🤖 Azure OpenAI Service</h2>
                            <span style="margin-left: auto; font-size: 1.2rem;">\${statusIcon}</span>
                        </div>
                        <div class="openai-status-content">
                            <div class="openai-metrics">
                                <div class="openai-metric">
                                    <div class="openai-metric-label">Service Status</div>
                                    <div class="openai-metric-value \${statusClass === 'up' ? 'good' : statusClass === 'degraded' ? 'warning' : 'error'}">
                                        \${statusText}
                                    </div>
                                </div>
                                <div class="openai-metric">
                                    <div class="openai-metric-label">Response Time</div>
                                    <div class="openai-metric-value \${responseTime < 2000 ? 'good' : responseTime < 5000 ? 'warning' : 'error'}">
                                        \${responseTime}ms
                                    </div>
                                </div>
                                <div class="openai-metric">
                                    <div class="openai-metric-label">Last Check</div>
                                    <div class="openai-metric-value">
                                        \${lastCheck}
                                    </div>
                                </div>
                                <div class="openai-metric">
                                    <div class="openai-metric-label">Model</div>
                                    <div class="openai-metric-value">
                                        \${openaiHealth.openai?.model || openaiHealth.configuration?.deployment || 'gpt-4o'}
                                    </div>
                                </div>
                            </div>
                            \${openaiHealth.openai?.error ? \`
                                <div class="openai-details">
                                    <strong>Error Details:</strong> \${openaiHealth.openai.error}
                                    \${openaiHealth.openai.errorCode ? \` (Code: \${openaiHealth.openai.errorCode})\` : ''}
                                </div>
                            \` : ''}
                            \${openaiHealth.configuration ? \`
                                <div class="openai-details">
                                    <strong>Configuration:</strong> 
                                    Endpoint: \${openaiHealth.configuration.endpoint || 'Not configured'} | 
                                    Deployment: \${openaiHealth.configuration.deployment} |
                                    API Key: \${openaiHealth.configuration.hasApiKey ? '✅ Configured' : '❌ Missing'}
                                </div>
                            \` : ''}
                        </div>
                    </div>
                \`;
            }
            
            content.innerHTML = \`
                \${renderOpenAIStatus(data.openaiHealth)}
                
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h3>Total Requests</h3>
                        <div class="value">\${data.summary.totalRequests}</div>
                    </div>
                    <div class="metric-card success">
                        <h3>Success Rate</h3>
                        <div class="value">\${data.summary.successRate}</div>
                    </div>
                    <div class="metric-card \${parseInt(data.summary.fallbackRate) > 30 ? 'warning' : ''}">
                        <h3>Fallback Rate</h3>
                        <div class="value">\${data.summary.fallbackRate}</div>
                    </div>
                    <div class="metric-card \${data.summary.averageResponseTimeMs > 5000 ? 'warning' : ''}">
                        <h3>Avg Response Time</h3>
                        <div class="value">\${data.summary.averageResponseTimeMs}ms</div>
                    </div>
                </div>
                
                \${data.alerts && data.alerts.length > 0 ? \`
                <div class="section">
                    <div class="section-header">
                        <h2>🚨 Active Alerts</h2>
                    </div>
                    <div class="section-content">
                        \${data.alerts.map(alert => \`
                            <div class="alert \${alert.level.toLowerCase()}">
                                \${alert.level === 'HIGH' ? '🔴' : alert.level === 'MEDIUM' ? '🟡' : '🟠'} 
                                [\${alert.level}] \${alert.message}
                            </div>
                        \`).join('')}
                    </div>
                </div>
                \` : ''}
                
                \${Object.keys(data.errors).length > 0 ? \`
                <div class="section">
                    <div class="section-header">
                        <h2>📊 Error Breakdown</h2>
                    </div>
                    <div class="section-content">
                        \${Object.entries(data.errors).map(([error, count]) => \`
                            <div class="event-item">
                                <span>\${error}</span>
                                <span class="event-time">\${count} occurrences</span>
                            </div>
                        \`).join('')}
                    </div>
                </div>
                \` : ''}
                
                <div class="section">
                    <div class="section-header">
                        <h2>📋 Recent Events</h2>
                    </div>
                    <div class="section-content">
                        \${data.recentEvents && data.recentEvents.length > 0 ? \`
                            <ul class="events-list">
                                \${data.recentEvents.map(event => \`
                                    <li class="event-item">
                                        <span class="event-time">\${new Date(event.timestamp).toLocaleTimeString()}</span>
                                        <span class="event-details">
                                            \${event.type === 'generation_success' ? '✅' : 
                                              event.type === 'fallback_used' ? '📋' : 
                                              event.type === 'generation_error' ? '❌' : '📝'}
                                            \${event.description || event.error || event.type}
                                            \${event.responseTimeMs ? \` (\${event.responseTimeMs}ms)\` : ''}
                                        </span>
                                    </li>
                                \`).join('')}
                            </ul>
                        \` : '<p>No recent events</p>'}
                    </div>
                </div>
                
                <div class="last-updated">
                    Last updated: \${new Date(data.timestamp).toLocaleString()}
                </div>
            \`;
        }
        
        // Load dashboard on page load
        loadDashboard();
        
        // Auto-refresh every 30 seconds
        setInterval(loadDashboard, 30000);
    </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
}

/**
 * Test endpoint to simulate events (for demo purposes)
 */
function simulateEvent(req, res) {
  const events = [
    {
      type: "request_received",
      description: "Dashboard for project management",
    },
    {
      type: "generation_success",
      description: "Dashboard for project management",
      responseTimeMs: 1250,
    },
    {
      type: "fallback_used",
      description: "E-commerce website",
      reason: "OpenAI rate limit",
    },
    {
      type: "generation_error",
      error: "timeout_error",
      description: "Complex form",
    },
    {
      type: "parameter_validation_failed",
      validationError: "Description too short",
    },
  ];

  const randomEvent = events[Math.floor(Math.random() * events.length)];
  monitor.logEvent(randomEvent.type, randomEvent);

  res.json({
    success: true,
    message: "Event simulated",
    event: randomEvent,
  });
}

module.exports = {
  getDashboardData,
  getDashboardPage,
  simulateEvent,
  monitor,
};
