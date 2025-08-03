// Smart wireframe generator with pattern matching and OpenAI integration
const crypto = require("crypto");
const path = require("path");

// Import our template system
const { createFallbackWireframe } = require("../fallback-generator");

// Logger utility
const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message, error, data = {}) => {
    console.error(`[ERROR] ${message}`, error, data);
  },
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  }
};

// Initialize OpenAI client with proper error handling
let openai = null;

// Azure OpenAI configuration with fallback handling
function initializeOpenAI() {
  try {
    // Check if OpenAI is disabled via environment variable
    if (process.env.DISABLE_OPENAI === 'true') {
      logger.info("🚫 OpenAI disabled via DISABLE_OPENAI environment variable");
      return false;
    }
    
    // Only initialize if we have the required environment variables
    if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      const { OpenAI } = require("openai");
      
      // Ensure endpoint format is correct for Azure OpenAI
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, ''); // Remove trailing slash
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'designetica-gpt4o';
      
      openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { 'api-version': '2024-02-15-preview' },
        defaultHeaders: {
          'api-key': process.env.AZURE_OPENAI_KEY,
        },
      });
      
      logger.info("🤖 OpenAI client initialized successfully", {
        endpoint: endpoint,
        deployment: deployment,
        keyPresent: !!process.env.AZURE_OPENAI_KEY
      });
      return true;
    } else {
      logger.warn("⚠️ OpenAI environment variables not found, using pattern-based generation");
      return false;
    }
  } catch (error) {
    logger.error("❌ Failed to initialize OpenAI client", error);
    openai = null;
    return false;
  }
}

// Create wireframe prompt for OpenAI
function createWireframePrompt(
  description,
  style = "default",
  colorScheme = "primary"
) {
  const basePrompt = `You are an expert UI/UX designer creating HTML wireframes for Microsoft Learn platform.

Create a complete, responsive HTML wireframe based on this description: "${description}"

Requirements:
- Use Microsoft Learn design system (Segoe UI font, #0078d4 primary color)
- Include proper semantic HTML structure
- Add inline CSS for styling (no external stylesheets)
- Use Microsoft Learn color palette: #0078d4 (primary), #f3f2f1 (background), #171717 (text)
- Make it responsive and accessible
- Include Microsoft Learn header with logo
- Add a clean footer with copyright
- Use proper form controls and interactive elements
- Ensure all text is readable and properly sized

Style preferences:
- Clean, professional Microsoft Learn aesthetic
- Proper spacing and visual hierarchy
- Consistent with Microsoft design principles
- Modern, minimalist approach

Generate ONLY the complete HTML code (starting with <!DOCTYPE html> and ending with </html>). No explanations or markdown formatting.`;

  return basePrompt;
}

// Generate wireframe using OpenAI with robust error handling
async function generateWireframeWithOpenAI(description, colorScheme = "primary", correlationId) {
  try {
    if (!openai) {
      logger.warn("🔄 OpenAI client not available, falling back to pattern-based generation", { correlationId });
      return null;
    }

    logger.info("🤖 Attempting OpenAI wireframe generation", {
      correlationId,
      description: description.substring(0, 50) + "...",
      colorScheme
    });

    const prompt = createWireframePrompt(description, "microsoftlearn", colorScheme);
    
    // Call OpenAI with timeout and retry logic
    const startTime = Date.now();
    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || 'designetica-gpt4o',
        messages: [
          {
            role: "system", 
            content: "You are an expert UI/UX designer specializing in Microsoft Learn platform wireframes. Generate clean, semantic HTML with inline CSS."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
      // 15 second timeout
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI request timeout')), 15000)
      )
    ]);

    const openaiTime = Date.now() - startTime;
    
    if (response?.choices?.[0]?.message?.content) {
      const html = response.choices[0].message.content.trim();
      
      // Basic validation of HTML response
      if (html.includes('<!DOCTYPE html>') && html.includes('</html>')) {
        logger.info("✅ OpenAI wireframe generated successfully", {
          correlationId,
          openaiTimeMs: openaiTime,
          htmlLength: html.length
        });
        return html;
      } else {
        logger.warn("⚠️ OpenAI returned invalid HTML format", { correlationId });
        return null;
      }
    } else {
      logger.warn("⚠️ OpenAI returned empty response", { correlationId });
      return null;
    }
    
  } catch (error) {
    // Handle specific error types
    if (error.status === 401) {
      logger.error("🔐 OpenAI authentication failed - API key may be invalid or expired", error, { correlationId });
      // Disable OpenAI for subsequent requests to avoid repeated failures
      openai = null;
    } else if (error.status === 404) {
      logger.error("🔍 OpenAI deployment not found - check deployment name", error, { correlationId });
      openai = null;
    } else if (error.message?.includes('timeout')) {
      logger.error("⏰ OpenAI request timed out", error, { correlationId });
    } else {
      logger.error("❌ OpenAI wireframe generation failed", error, {
        correlationId,
        errorType: error.name,
        errorMessage: error.message,
        errorStatus: error.status
      });
    }
    return null;
  }
}

// Smart wireframe generator with pattern matching
// Smart wireframe generator with AI and pattern-based fallback
async function generateWireframeFromDescription(description, colorScheme, correlationId) {
  try {
    // First, try our hardcoded template system
    logger.info("🎯 Checking hardcoded templates first", { correlationId, description });
    
    try {
      const templateHtml = createFallbackWireframe(description, "microsoftlearn", colorScheme);
      
      logger.info("🔍 Template result info", { 
        correlationId, 
        hasTemplateHtml: !!templateHtml,
        templateLength: templateHtml ? templateHtml.length : 0,
        containsTemplatesPath: templateHtml ? templateHtml.includes('templates/') : false,
        containsAzureLearning: templateHtml ? templateHtml.includes('Azure Learning Path') : false
      });
      
      // Check if we got a hardcoded template (not a generic fallback)
      // Look for specific indicators that this is one of our hardcoded templates
      if (templateHtml && (
        templateHtml.includes('templates/') || 
        templateHtml.includes('Azure Learning Path') ||
        templateHtml.includes('Azure Fundamentals Learning Path') ||
        templateHtml.includes('Microsoft Learn training dashboard') ||
        templateHtml.includes('certification progress tracker') ||
        templateHtml.length > 10000  // Our hardcoded templates are much longer than generic ones
      )) {
        logger.info("✅ Using hardcoded template", { correlationId });
        return { html: templateHtml, source: 'hardcoded-template', aiGenerated: false };
      }
    } catch (templateError) {
      logger.warn("⚠️ Template system error, continuing to other methods", templateError, { correlationId });
    }
    
    // Then, try OpenAI generation if available
    if (openai) {
      const aiHtml = await generateWireframeWithOpenAI(description, colorScheme, correlationId);
      if (aiHtml) {
        logger.info("🎯 Using OpenAI-generated wireframe", { correlationId });
        return { html: aiHtml, source: 'openai', aiGenerated: true };
      }
    }
    
    // Fallback to pattern-based generation
    logger.info("🔧 Using pattern-based wireframe generation", { correlationId });
    const desc = description.toLowerCase();
    
    // Check for common wireframe patterns
    if (desc.includes('form') || desc.includes('textbox') || desc.includes('input') || desc.includes('submit')) {
      return { html: generateFormWireframe(description, colorScheme), source: 'pattern-form', aiGenerated: false };
    } else if (desc.includes('dashboard') || desc.includes('chart') || desc.includes('analytics')) {
      return { html: generateDashboardWireframe(description, colorScheme), source: 'pattern-dashboard', aiGenerated: false };
    } else if (desc.includes('landing') || desc.includes('hero') || desc.includes('marketing')) {
      return { html: generateLandingWireframe(description, colorScheme), source: 'pattern-landing', aiGenerated: false };
    } else if (desc.includes('blog') || desc.includes('article') || desc.includes('content')) {
      return { html: generateContentWireframe(description, colorScheme), source: 'pattern-content', aiGenerated: false };
    } else {
      return { html: createSimpleFallback(description, colorScheme), source: 'pattern-generic', aiGenerated: false };
    }
    
  } catch (error) {
    logger.error("💥 Error in wireframe generation, using emergency fallback", error, { correlationId });
    return { html: createSimpleFallback("Emergency fallback", colorScheme), source: 'emergency-fallback', aiGenerated: false };
  }
}

// Generate form wireframe based on description
function generateFormWireframe(description, colorScheme) {
  const desc = description.toLowerCase();
  
  // Extract specific number mentioned
  const numberMatch = desc.match(/(\d+)\s*(textbox|input|field)/);
  const requestedCount = numberMatch ? parseInt(numberMatch[1]) : 1;
  
  // Extract form details from description
  const hasName = desc.includes('name');
  const hasEmail = desc.includes('email');
  const hasPhone = desc.includes('phone');
  const hasMessage = desc.includes('message') || desc.includes('comment');
  const hasPassword = desc.includes('password');
  const hasAddress = desc.includes('address');
  
  let formFields = '';
  let fieldCount = 0;
  
  // Add fields based on specific requests or fill up to requested count
  if (hasName || (fieldCount < requestedCount && !hasEmail && !hasPhone)) {
    formFields += `
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" class="form-control" placeholder="Enter your name">
            </div>`;
    fieldCount++;
  }
  
  if (hasEmail || (fieldCount < requestedCount)) {
    formFields += `
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email">
            </div>`;
    fieldCount++;
  }
  
  if (hasPhone || (fieldCount < requestedCount)) {
    formFields += `
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone" class="form-control" placeholder="Enter your phone">
            </div>`;
    fieldCount++;
  }
  
  // Add generic fields if we still need more to reach requested count
  while (fieldCount < requestedCount) {
    const fieldNum = fieldCount + 1;
    formFields += `
            <div class="form-group">
                <label for="field${fieldNum}">Field ${fieldNum}</label>
                <input type="text" id="field${fieldNum}" name="field${fieldNum}" class="form-control" placeholder="Enter text for field ${fieldNum}">
            </div>`;
    fieldCount++;
  }
  
  if (hasPassword) {
    formFields += `
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="Enter password">
            </div>`;
  }
  
  if (hasAddress) {
    formFields += `
            <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" name="address" class="form-control" rows="3" placeholder="Enter your address"></textarea>
            </div>`;
  }
  
  if (hasMessage) {
    formFields += `
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" class="form-control" rows="4" placeholder="Enter your message"></textarea>
            </div>`;
  }
  
  // If no specific fields found, add default ones based on textbox count
  if (!formFields) {
    const defaultCount = Math.max(requestedCount, 2); // Default to 2 if no count specified
    for (let i = 1; i <= defaultCount; i++) {
      formFields += `
            <div class="form-group">
                <label for="field${i}">Field ${i}</label>
                <input type="text" id="field${i}" name="field${i}" class="form-control" placeholder="Enter field ${i}">
            </div>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #f3f2f1; 
            color: #171717; 
            line-height: 1.5; 
        }
        .header { 
            background: #ffffff; 
            padding: 12px 24px; 
            border-bottom: 1px solid #e1dfdd; 
            display: flex; 
            align-items: center; 
        }
        .logo { 
            font-weight: 600; 
            font-size: 18px; 
            color: #0078d4; 
        }
        .main { 
            max-width: 600px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .form-container { 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            border: 1px solid #e1dfdd; 
        }
        .form-title { 
            color: #0078d4; 
            margin-bottom: 24px; 
            font-size: 24px; 
            font-weight: 600; 
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        .form-group label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 500; 
            color: #323130; 
        }
        .form-control { 
            width: 100%; 
            padding: 12px 16px; 
            border: 1px solid #e1dfdd; 
            border-radius: 4px; 
            font-size: 14px; 
            font-family: inherit; 
            transition: border-color 0.2s; 
        }
        .form-control:focus { 
            outline: none; 
            border-color: #0078d4; 
            box-shadow: 0 0 0 1px #0078d4; 
        }
        .btn { 
            background: #0078d4; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            font-size: 14px; 
            cursor: pointer; 
            font-weight: 500; 
            width: 100%;
        }
        .btn:hover { 
            background: #106ebe; 
        }
        .footer { 
            background: #ffffff; 
            border-top: 1px solid #e1dfdd; 
            padding: 20px 24px; 
            margin-top: 60px; 
            text-align: center; 
            color: #737373; 
        }
        textarea.form-control {
            resize: vertical;
            min-height: 80px;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">🪟 Microsoft Learn</div>
    </header>
    <main class="main">
        <div class="form-container">
            <h1 class="form-title">${description}</h1>
            <form>${formFields}
            <button type="submit" class="btn">Submit</button>
            </form>
        </div>
    </main>
    <footer class="footer">
        <p>© Microsoft Learn - AI Wireframe Generator</p>
    </footer>
</body>
</html>`;
}

// Dashboard-focused wireframe
function generateDashboardWireframe(description, colorScheme) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #f8f9fa; 
            color: #171717; 
            line-height: 1.5; 
        }
        .header { 
            background: #ffffff; 
            padding: 12px 24px; 
            border-bottom: 1px solid #e1dfdd; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
        }
        .logo { 
            font-weight: 600; 
            font-size: 18px; 
            color: #0078d4; 
        }
        .user-menu { 
            display: flex; 
            align-items: center; 
            gap: 16px; 
        }
        .avatar { 
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            background: #0078d4; 
            color: white; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 14px; 
            font-weight: 500; 
        }
        .main { 
            max-width: 1400px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .page-title { 
            font-size: 28px; 
            font-weight: 600; 
            color: #171717; 
            margin-bottom: 24px; 
        }
        .dashboard-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 300px)); 
            gap: 1rem; 
            margin-bottom: 2rem; 
            justify-content: start;
        }
        .card { 
            background: white; 
            padding: 1rem; 
            border-radius: 4px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            border: 1px solid #e1dfdd;
            max-width: 300px;
            width: 100%;
        }
        .card-title { 
            font-size: 1rem; 
            font-weight: 600; 
            color: #0078d4; 
            margin-bottom: 0.5rem; 
            line-height: 1.3;
        }
        .metric { 
            font-size: 1.5rem; 
            font-weight: 600; 
            color: #0078d4; 
            margin-bottom: 0.25rem; 
        }
        .metric-label { 
            font-size: 0.8125rem; 
            color: #605e5c; 
        }
        .chart-placeholder { 
            height: 200px; 
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe); 
            border: 2px dashed #0078d4; 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #0078d4; 
            font-weight: 500; 
        }
        .table-container { 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.08); 
            border: 1px solid #e1dfdd; 
            overflow: hidden; 
        }
        .table-header { 
            padding: 20px 24px; 
            border-bottom: 1px solid #e1dfdd; 
            font-weight: 600; 
            color: #171717; 
        }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
        }
        .table th, .table td { 
            padding: 12px 24px; 
            text-align: left; 
            border-bottom: 1px solid #f3f2f1; 
        }
        .table th { 
            background: #f8f9fa; 
            font-weight: 600; 
            color: #171717; 
            font-size: 14px; 
        }
        .table td { 
            color: #505050; 
            font-size: 14px; 
        }
        .status { 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 12px; 
            font-weight: 500; 
        }
        .status.active { 
            background: #d1fae5; 
            color: #065f46; 
        }
        .status.pending { 
            background: #fef3c7; 
            color: #92400e; 
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">🪟 Microsoft Learn Dashboard</div>
        <div class="user-menu">
            <div class="avatar">JD</div>
        </div>
    </header>
    <main class="main">
        <h1 class="page-title">${description}</h1>
        
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-title">Total Users</div>
                <div class="metric">2,847</div>
                <div class="metric-label">+12% from last month</div>
            </div>
            <div class="card">
                <div class="card-title">Active Sessions</div>
                <div class="metric">1,423</div>
                <div class="metric-label">Currently online</div>
            </div>
            <div class="card">
                <div class="card-title">Completion Rate</div>
                <div class="metric">87%</div>
                <div class="metric-label">+5% improvement</div>
            </div>
            <div class="card">
                <div class="card-title">Performance Chart</div>
                <div class="chart-placeholder">📊 Chart Visualization</div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">Recent Activity</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>Status</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>Completed Module 1</td>
                        <td><span class="status active">Active</span></td>
                        <td>2 minutes ago</td>
                    </tr>
                    <tr>
                        <td>Jane Smith</td>
                        <td>Started Assessment</td>
                        <td><span class="status pending">Pending</span></td>
                        <td>5 minutes ago</td>
                    </tr>
                    <tr>
                        <td>Mike Johnson</td>
                        <td>Downloaded Certificate</td>
                        <td><span class="status active">Active</span></td>
                        <td>10 minutes ago</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>`;
}

// Landing page wireframe
function generateLandingWireframe(description, colorScheme) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #ffffff; 
            color: #171717; 
            line-height: 1.6; 
        }
        .header { 
            background: rgba(255,255,255,0.95); 
            backdrop-filter: blur(10px); 
            padding: 16px 24px; 
            position: fixed; 
            top: 0; 
            width: 100%; 
            border-bottom: 1px solid #e1dfdd; 
            z-index: 1000; 
        }
        .header-content { 
            max-width: 1200px; 
            margin: 0 auto; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
        }
        .logo { 
            font-weight: 600; 
            font-size: 20px; 
            color: #0078d4; 
        }
        .nav { 
            display: flex; 
            gap: 32px; 
        }
        .nav a { 
            color: #171717; 
            text-decoration: none; 
            font-weight: 500; 
            transition: color 0.2s; 
        }
        .nav a:hover { 
            color: #0078d4; 
        }
        .cta-btn { 
            background: #0078d4; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            font-weight: 500; 
            text-decoration: none; 
            transition: background 0.2s; 
        }
        .cta-btn:hover { 
            background: #106ebe; 
        }
        ${getBreadcrumbStyles()}
        .hero { 
            background: #E8E6DF !important; 
            color: #161616 !important; 
            text-align: center; 
            padding: 120px 24px 80px; 
            margin-top: 70px; 
        }
        .hero-content { 
            max-width: 800px; 
            margin: 0 auto; 
        }
        .hero h1 { 
            font-size: 48px; 
            font-weight: 700; 
            margin-bottom: 24px; 
            line-height: 1.2; 
            color: #161616 !important; 
        }
        .hero p { 
            font-size: 20px; 
            margin-bottom: 32px; 
            color: #161616 !important; 
        }
        .hero-buttons { 
            display: flex; 
            gap: 16px; 
            justify-content: center; 
            flex-wrap: wrap; 
        }
        .btn-primary { 
            background: white; 
            color: #0078d4; 
            padding: 16px 32px; 
            border: none; 
            border-radius: 6px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
        }
        .btn-secondary { 
            background: transparent; 
            color: white; 
            padding: 16px 32px; 
            border: 2px solid white; 
            border-radius: 6px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
        }
        .features { 
            padding: 80px 24px; 
            background: #f8f9fa; 
        }
        .features-content { 
            max-width: 1200px; 
            margin: 0 auto; 
            text-align: center; 
        }
        .features h2 { 
            font-size: 36px; 
            margin-bottom: 16px; 
            color: #171717; 
        }
        .features-subtitle { 
            font-size: 18px; 
            color: #737373; 
            margin-bottom: 48px; 
        }
        .features-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 300px)); 
            gap: 1rem; 
            justify-content: start;
        }
        .feature-card { 
            background: white; 
            padding: 1rem; 
            border-radius: 4px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            text-align: center;
            border: 1px solid #e1dfdd;
            max-width: 300px;
            width: 100%;
        }
        .feature-icon { 
            width: 40px; 
            height: 40px; 
            background: #0078d4; 
            border-radius: 4px; 
            margin: 0 auto 0.75rem; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 18px; 
            color: white; 
        }
        .feature-card h3 { 
            font-size: 1rem; 
            margin-bottom: 0.5rem; 
            color: #0078d4;
            font-weight: 600;
            line-height: 1.3;
        }
        .feature-card p { 
            color: #605e5c;
            font-size: 0.8125rem;
            line-height: 1.4;
            margin: 0;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">🪟 Microsoft Learn</div>
            <nav class="nav">
                <a href="#">Learn</a>
                <a href="#">Docs</a>
                <a href="#">Community</a>
                <a href="#">Support</a>
            </nav>
            <a href="#" class="cta-btn">Get Started</a>
        </div>
    </header>
    <section class="hero">
        <div class="hero-content">
            <h1>${description}</h1>
            <p>Discover the power of Microsoft technologies through hands-on learning experiences and comprehensive documentation.</p>
            <div class="hero-buttons">
                <a href="#" class="btn-primary">Start Learning</a>
                <a href="#" class="btn-secondary">Browse Paths</a>
            </div>
        </div>
    </section>
    
    <section class="features">
        <div class="features-content">
            <h2>Why Choose Microsoft Learn?</h2>
            <p class="features-subtitle">Everything you need to build your skills and advance your career</p>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Structured Learning</h3>
                    <p>Follow curated learning paths designed by Microsoft experts to master specific technologies.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏆</div>
                    <h3>Earn Certifications</h3>
                    <p>Validate your skills with industry-recognized Microsoft certifications and badges.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <h3>Hands-on Practice</h3>
                    <p>Apply your knowledge with interactive labs and real-world scenarios in the cloud.</p>
                </div>
            </div>
        </div>
    </section>
    ${getBreadcrumbScript()}
</body>
</html>`;
}

// Content-focused wireframe
function generateContentWireframe(description, colorScheme) {

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #ffffff; 
            color: #171717; 
            line-height: 1.6; 
        }
        .header { 
            background: #f8f9fa; 
            padding: 16px 24px; 
            border-bottom: 1px solid #e5e7eb; 
            position: sticky; 
            top: 0; 
            z-index: 100; 
        }
        .header-content { 
            max-width: 1200px; 
            margin: 0 auto; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
        }
        .logo { 
            font-weight: 600; 
            font-size: 20px; 
            color: #0078d4; 
        }
        .nav { 
            display: flex; 
            gap: 32px; 
        }
        .nav a { 
            color: #4b5563; 
            text-decoration: none; 
            font-weight: 500; 
        }
        .nav a:hover { 
            color: #0078d4; 
        }
        ${getBreadcrumbStyles()}
        .container { 
            max-width: 800px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .article-header { 
            margin-bottom: 40px; 
            text-align: center; 
        }
        .article-title { 
            font-size: 42px; 
            font-weight: 700; 
            color: #1f2937; 
            margin-bottom: 16px; 
            line-height: 1.2; 
        }
        .article-meta { 
            color: #6b7280; 
            font-size: 16px; 
        }
        .article-content { 
            font-size: 18px; 
            line-height: 1.8; 
        }
        .article-content h2 { 
            font-size: 28px; 
            color: #1f2937; 
            margin: 32px 0 16px 0; 
            font-weight: 600; 
        }
        .article-content h3 { 
            font-size: 22px; 
            color: #374151; 
            margin: 24px 0 12px 0; 
            font-weight: 600; 
        }
        .article-content p { 
            margin-bottom: 20px; 
            color: #374151; 
        }
        .article-content ul { 
            margin: 20px 0; 
            padding-left: 24px; 
        }
        .article-content li { 
            margin-bottom: 8px; 
            color: #374151; 
        }
        .highlight { 
            background: #f0f9ff; 
            border-left: 4px solid #0078d4; 
            padding: 16px 20px; 
            margin: 24px 0; 
            border-radius: 0 4px 4px 0; 
        }
        .code-block { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 20px 0; 
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; 
            font-size: 14px; 
            overflow-x: auto; 
        }
        .tags { 
            margin-top: 40px; 
            padding-top: 24px; 
            border-top: 1px solid #e5e7eb; 
        }
        .tag { 
            display: inline-block; 
            background: #f3f4f6; 
            color: #374151; 
            padding: 6px 12px; 
            border-radius: 16px; 
            font-size: 14px; 
            margin-right: 8px; 
            margin-bottom: 8px; 
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">🪟 Microsoft Learn</div>
            <nav class="nav">
                <a href="#">Docs</a>
                <a href="#">Learn</a>
                <a href="#">Support</a>
                <a href="#">Community</a>
            </nav>
        </div>
    </header>
    
    <div class="container">
        <header class="article-header">
            <h1 class="article-title">${description}</h1>
            <div class="article-meta">Published on Microsoft Learn • 5 min read</div>
        </header>
        
        <article class="article-content">
            <p>Welcome to this comprehensive guide about <strong>${description.toLowerCase()}</strong>. This article will walk you through the essential concepts and practical applications you need to know.</p>
            
            <h2>Overview</h2>
            <p>In this section, we'll cover the fundamental concepts and explain why this topic is important for modern development practices.</p>
            
            <div class="highlight">
                <strong>Key Takeaway:</strong> Understanding these concepts will help you build more efficient and maintainable solutions.
            </div>
            
            <h2>Getting Started</h2>
            <p>Let's begin with the basics. Here are the essential steps to get you started:</p>
            
            <ul>
                <li>Understand the core concepts and terminology</li>
                <li>Set up your development environment</li>
                <li>Follow the step-by-step implementation guide</li>
                <li>Test your implementation thoroughly</li>
            </ul>
            
            <h3>Implementation Example</h3>
            <p>Here's a practical example to demonstrate the concepts:</p>
            
            <div class="code-block">
// Example implementation
function example() {
    console.log("This is a sample code block");
    return "Success!";
}
            </div>
            
            <h2>Best Practices</h2>
            <p>When working with these concepts, consider the following best practices:</p>
            
            <ul>
                <li>Always follow established patterns and conventions</li>
                <li>Keep your code clean and well-documented</li>
                <li>Test thoroughly before deploying to production</li>
                <li>Monitor performance and optimize as needed</li>
            </ul>
            
            <h2>Next Steps</h2>
            <p>Now that you understand the basics, you can explore more advanced topics and integrate these concepts into your projects.</p>
            
            <div class="tags">
                <span class="tag">Tutorial</span>
                <span class="tag">Best Practices</span>
                <span class="tag">Development</span>
                <span class="tag">Microsoft Learn</span>
            </div>
        </article>
    </div>
    ${getBreadcrumbScript()}
</body>
</html>`;
}

// Simple fallback for when no pattern matches
function createSimpleFallback(description, colorScheme) {

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #f3f2f1; 
            color: #171717; 
            line-height: 1.5; 
        }
        .header { 
            background: #ffffff; 
            padding: 12px 24px; 
            border-bottom: 1px solid #e1dfdd; 
            display: flex; 
            align-items: center; 
        }
        .logo { 
            font-weight: 600; 
            font-size: 18px; 
            color: #0078d4; 
        }
        ${getBreadcrumbStyles()}
        .main { 
            max-width: 1200px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .hero { 
            background: #E8E6DF !important; 
            color: #161616 !important; 
            padding: 60px 40px; 
            border-radius: 8px; 
            margin-bottom: 40px; 
            text-align: center; 
        }
        .hero h1 { 
            font-size: 32px; 
            margin-bottom: 16px; 
            font-weight: 600; 
            color: #161616 !important; 
        }
        .hero p { 
            font-size: 18px; 
            color: #161616 !important; 
        }
        .content { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 24px; 
        }
        .card { 
            background: white; 
            padding: 24px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            border: 1px solid #e1dfdd; 
        }
        .card h3 { 
            color: #0078d4; 
            margin-bottom: 12px; 
            font-size: 20px; 
        }
        .card p { 
            color: #505050; 
            margin-bottom: 16px; 
        }
        .btn { 
            background: #0078d4; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            font-size: 14px; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
        }
        .btn:hover { 
            background: #106ebe; 
        }
        .footer { 
            background: #ffffff; 
            border-top: 1px solid #e1dfdd; 
            padding: 40px 24px; 
            margin-top: 60px; 
            text-align: center; 
            color: #737373; 
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">🪟 Microsoft Learn</div>
    </header>
    
    <main class="main">
        <section class="hero">
            <h1>${description}</h1>
            <p>Custom wireframe generated based on your description.</p>
        </section>
        <div class="content">
            <div class="card">
                <h3>Getting Started</h3>
                <p>Learn the fundamentals and build your first application with our guided tutorials.</p>
                <a href="#" class="btn">Start Learning</a>
            </div>
            <div class="card">
                <h3>Documentation</h3>
                <p>Comprehensive guides and API references to help you build amazing applications.</p>
                <a href="#" class="btn">View Docs</a>
            </div>
            <div class="card">
                <h3>Community</h3>
                <p>Connect with other developers and get help from our vibrant community.</p>
                <a href="#" class="btn">Join Now</a>
            </div>
        </div>
    </main>
    <footer class="footer">
        <p>© Microsoft Learn - AI Wireframe Generator</p>
    </footer>
    ${getBreadcrumbScript()}
</body>
</html>`;
}

// Breadcrumb utility for multi-page wireframes
function generateBreadcrumb(currentPage = 1, totalPages = 3) {
  if (totalPages <= 1) return '';
  
  let breadcrumbItems = '';
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    const activeClass = isActive ? 'active' : '';
    breadcrumbItems += `
      <button class="breadcrumb-item ${activeClass}" onclick="navigateToPage(${i})">
        Page ${i}
      </button>`;
  }
  
  return `
    <div class="breadcrumb-nav">
      <div class="breadcrumb-container">
        <span class="breadcrumb-label">Navigate:</span>
        ${breadcrumbItems}
      </div>
    </div>`;
}

// Breadcrumb CSS styles
function getBreadcrumbStyles() {
  return `
    .breadcrumb-nav {
      background: #f8f9fa;
      border-bottom: 1px solid #e1dfdd;
      padding: 12px 24px;
      margin-bottom: 20px;
    }
    .breadcrumb-container {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .breadcrumb-label {
      font-size: 14px;
      color: #505050;
      font-weight: 500;
      margin-right: 8px;
    }
    .breadcrumb-item {
      background: #ffffff;
      border: 1px solid #e1dfdd;
      color: #0078d4;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    .breadcrumb-item:hover {
      background: #f3f2f1;
      border-color: #0078d4;
    }
    .breadcrumb-item.active {
      background: #0078d4;
      color: white;
      border-color: #0078d4;
      cursor: default;
    }
    .breadcrumb-item.active:hover {
      background: #0078d4;
    }`;
}

// JavaScript for breadcrumb navigation
function getBreadcrumbScript() {
  return `
    <script>
      function navigateToPage(pageNumber) {
        // Show loading state
        const clickedBtn = event.target;
        const originalText = clickedBtn.textContent;
        clickedBtn.textContent = 'Loading...';
        clickedBtn.style.opacity = '0.7';
        
        // Simulate page navigation (in a real app, this would navigate to different pages)
        setTimeout(() => {
          // Update active state
          document.querySelectorAll('.breadcrumb-item').forEach(btn => {
            btn.classList.remove('active');
          });
          clickedBtn.classList.add('active');
          
          // Reset button state
          clickedBtn.textContent = originalText;
          clickedBtn.style.opacity = '1';
          
          // In a real application, you would:
          // window.location.href = '/page-' + pageNumber;
          // or use your router to navigate to the specific page
          
          console.log('Navigated to Page ' + pageNumber);
        }, 500);
      }
    </script>`;
}

// Validation functions
function isValidDescription(description) {
  if (!description || typeof description !== 'string') {
    return false;
  }
  
  if (description.trim().length < 3) {
    return false;
  }
  
  if (description.length > 1000) {
    return false;
  }
  
  return true;
}

module.exports = async function (context, req) {
  const correlationId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    // Set CORS headers first
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Correlation-ID": correlationId,
        // Cache-busting headers for development
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Development-Mode": "true"
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    logger.info("🚀 Wireframe generation started", {
      correlationId,
      method: req.method,
    });

    // Simplified body handling
    let description = "Sample wireframe";
    let colorScheme = "primary";

    if (req.method === "POST" && req.body) {
      description = req.body.description || description;
      colorScheme = req.body.colorScheme || colorScheme;
    } else if (req.method === "GET" && req.query) {
      description = req.query.description || description;
      colorScheme = req.query.colorScheme || colorScheme;
    }

    // Initialize OpenAI client if not already done
    if (!openai) {
      initializeOpenAI();
    }

    logger.info("🔧 Starting wireframe generation", {
      correlationId,
      description: description.substring(0, 50) + "...",
      hasOpenAI: !!openai
    });

    // Use smart AI + pattern-based generation
    const result = await generateWireframeFromDescription(description, colorScheme, correlationId);
    const processingTime = Date.now() - startTime;

    logger.info("✅ Wireframe generation completed successfully", {
      correlationId,
      processingTimeMs: processingTime,
      htmlLength: result.html.length,
      source: result.source,
      aiGenerated: result.aiGenerated
    });

    context.res.status = 200;
    // Add cache-busting headers to existing response
    context.res.headers = {
      ...context.res.headers,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    };
    context.res.body = {
      html: result.html,
      fallback: result.source.includes('fallback'),
      correlationId,
      processingTimeMs: processingTime,
      theme: "microsoftlearn",
      colorScheme,
      aiGenerated: result.aiGenerated,
      source: result.source
    };

  } catch (error) {
    const processingTime = Date.now() - startTime;

    logger.error("💥 Error in wireframe generation", error, {
      correlationId,
      processingTimeMs: processingTime,
    });

    // Emergency fallback
    const html = createSimpleFallback("Error fallback", "primary");

    context.res.status = 200;
    context.res.body = {
      html: html,
      fallback: true,
      error: "Error occurred, using fallback",
      correlationId,
      processingTimeMs: processingTime,
      aiGenerated: false,
      source: "error-fallback"
    };
  }
};
