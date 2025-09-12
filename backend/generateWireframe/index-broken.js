// Standalone wireframe generator - self-contained for production deployment
const { OpenAI } = require("openai");

// Initialize OpenAI client
let openaiClient = null;

function initializeOpenAI() {
  if (!openaiClient) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const apiVersion =
      process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

    if (!endpoint || !apiKey) {
      throw new Error("Azure OpenAI configuration missing");
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
      baseURL: `${endpoint}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: {
        "api-key": apiKey,
      },
    });
  }
  return openaiClient;
}

// Embedded component library for Microsoft Learn ecosystem
const MICROSOFT_LEARN_COMPONENTS = {
  // Navigation Components
  navigation: {
    breadcrumb: `<nav aria-label="Breadcrumb"><ol class="breadcrumb"><li><a href="/">Microsoft Learn</a></li><li><a href="/paths">Learning Paths</a></li><li class="active">Current Page</li></ol></nav>`,
    topNav: `<header class="ms-learn-header"><nav class="navbar"><div class="nav-brand"><a href="/">Microsoft Learn</a></div><ul class="nav-links"><li><a href="/browse">Browse</a></li><li><a href="/paths">Learning Paths</a></li><li><a href="/certifications">Certifications</a></li><li><a href="/profile">Profile</a></li></ul></nav></header>`,
    sidebar: `<aside class="sidebar"><nav class="side-nav"><h3>In this module</h3><ul><li><a href="#overview">Overview</a></li><li><a href="#prerequisites">Prerequisites</a></li><li><a href="#learning-objectives">Learning objectives</a></li><li><a href="#units">Units</a></li><li><a href="#summary">Summary</a></li></ul></nav></aside>`,
  },

  // Content Components
  content: {
    learningPath: `<section class="learning-path-card"><div class="path-header"><h2>Learning Path Title</h2><span class="duration">4 hr 30 min</span></div><div class="path-content"><p>Learn the fundamentals of Azure services and cloud computing concepts.</p><div class="path-stats"><span class="modules">6 modules</span><span class="level">Beginner</span></div></div><button class="btn-start">Start learning path</button></section>`,
    moduleCard: `<article class="module-card"><header><h3>Module Title</h3><span class="time">45 min</span></header><div class="module-content"><p>Description of what you'll learn in this module.</p><div class="learning-objectives"><h4>Learning objectives</h4><ul><li>Understand key concepts</li><li>Apply best practices</li><li>Complete hands-on exercises</li></ul></div></div><footer><button class="btn-start">Start module</button><span class="progress">Not started</span></footer></article>`,
    knowledgeCheck: `<section class="knowledge-check"><h3>Knowledge check</h3><div class="question"><h4>Which Azure service is best for hosting web applications?</h4><div class="options"><label><input type="radio" name="q1" value="a"> App Service</label><label><input type="radio" name="q1" value="b"> Virtual Machines</label><label><input type="radio" name="q1" value="c"> Container Instances</label></div></div><button class="btn-submit">Submit answer</button></section>`,
  },

  // Interactive Components
  interactive: {
    labLauncher: `<section class="hands-on-lab"><div class="lab-header"><h3>Hands-on Lab</h3><span class="lab-type">Azure Sandbox</span></div><div class="lab-content"><p>Practice what you've learned with real Azure resources in a safe environment.</p><div class="lab-details"><span class="duration">30 minutes</span><span class="resources">3 Azure resources</span></div></div><button class="btn-launch-lab">Launch lab environment</button></section>`,
    codeBlock: `<div class="code-example"><div class="code-header"><span class="language">Azure CLI</span><button class="btn-copy">Copy</button></div><pre><code>az group create --name myResourceGroup --location eastus
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myWebApp</code></pre><button class="btn-try-it">Try it yourself</button></div>`,
    progressTracker: `<div class="progress-tracker"><div class="progress-header"><h4>Your Progress</h4><span class="completion">3 of 6 completed</span></div><div class="progress-bar"><div class="progress-fill" style="width: 50%"></div></div><div class="next-step"><p>Next: Complete the knowledge check</p><button class="btn-continue">Continue</button></div></div>`,
  },

  // Layout Components
  layout: {
    container: `<div class="ms-learn-container"><main class="content-area">[CONTENT]</main></div>`,
    grid: `<div class="ms-learn-grid"><div class="grid-item">[ITEM1]</div><div class="grid-item">[ITEM2]</div><div class="grid-item">[ITEM3]</div></div>`,
    hero: `<section class="hero-section"><div class="hero-content"><h1>Welcome to Microsoft Learn</h1><p>Develop your skills with free, self-paced learning paths, modules, and hands-on learning.</p><button class="btn-get-started">Get started</button></div><div class="hero-image"><img src="/images/learn-hero.svg" alt="Learning illustration"></div></section>`,
  },
};

// Fallback templates for quick response
const FALLBACK_TEMPLATES = {
  dashboard: `<!DOCTYPE html><html><head><title>Microsoft Learn Dashboard</title><style>.dashboard{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;padding:20px}.card{background:#fff;border:1px solid #e1e5e9;border-radius:8px;padding:20px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}.btn{background:#8E9AAF;color:white;border:none;padding:10px 20px;border-radius:4px;cursor:pointer}</style></head><body><div class="dashboard"><div class="card"><h2>Learning Paths</h2><p>Structured learning journeys</p><button class="btn">Browse Paths</button></div><div class="card"><h2>Modules</h2><p>Individual learning modules</p><button class="btn">View Modules</button></div><div class="card"><h2>Certifications</h2><p>Microsoft certifications</p><button class="btn">Explore Certs</button></div></div></body></html>`,

  learningPath: `<!DOCTYPE html><html><head><title>Learning Path</title><style>.path-container{max-width:800px;margin:0 auto;padding:20px}.module{border:1px solid #ddd;margin:10px 0;padding:15px;border-radius:4px}.progress{background:#f0f0f0;height:8px;border-radius:4px;margin:20px 0}.progress-fill{background:#8E9AAF;height:100%;border-radius:4px}</style></head><body><div class="path-container"><h1>Azure Fundamentals Learning Path</h1><div class="progress"><div class="progress-fill" style="width:30%"></div></div><div class="module"><h3>Introduction to Azure</h3><p>Learn the basics of cloud computing and Azure services</p><button class="btn">Start Module</button></div><div class="module"><h3>Azure Core Services</h3><p>Explore compute, storage, and networking services</p><button class="btn">Start Module</button></div></div></body></html>`,

  module: `<!DOCTYPE html><html><head><title>Learning Module</title><style>.module-content{max-width:800px;margin:0 auto;padding:20px}.unit{margin:20px 0;padding:15px;border-left:4px solid #8E9AAF}.knowledge-check{background:#f8f9fa;padding:20px;border-radius:4px;margin:20px 0}</style></head><body><div class="module-content"><h1>Azure Web Apps</h1><div class="unit"><h3>Unit 1: Introduction</h3><p>Learn about Azure App Service and web applications</p></div><div class="unit"><h3>Unit 2: Creating Web Apps</h3><p>Step-by-step guide to creating your first web app</p></div><div class="knowledge-check"><h3>Knowledge Check</h3><p>Test your understanding with interactive questions</p><button class="btn">Take Quiz</button></div></div></body></html>`,
};

async function generateAIWireframe(prompt, context = {}) {
  try {
    const client = initializeOpenAI();

    const systemPrompt = `You are a Microsoft Learn UX specialist. Create modern, accessible wireframes for Microsoft Learn ecosystem.

REQUIREMENTS:
- Use Microsoft Fluent Design System
- Include accessibility features (ARIA labels, semantic HTML)
- Focus on learning experience and user engagement
- Include progress tracking and interactive elements
- Use Microsoft Learn color scheme (#8E9AAF primary)

COMPONENTS AVAILABLE:
${JSON.stringify(MICROSOFT_LEARN_COMPONENTS, null, 2)}

Generate complete HTML wireframe with inline CSS. Include:
1. Semantic HTML structure
2. Responsive design
3. Microsoft Learn branding
4. Interactive elements for learning
5. Progress indicators where relevant
6. Accessibility attributes`;

    const userPrompt = `Create a wireframe for: ${prompt}

Context: ${JSON.stringify(context)}

Return only valid HTML with inline CSS. Make it modern, accessible, and focused on the Microsoft Learn experience.`;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const wireframe = response.choices[0]?.message?.content;

    if (!wireframe) {
      throw new Error("No wireframe generated");
    }

    return {
      success: true,
      wireframe: wireframe,
      aiGenerated: true,
      source: "azure-openai",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("AI generation failed:", error);

    // Return fallback template based on prompt keywords
    let template = FALLBACK_TEMPLATES.dashboard;
    if (prompt.toLowerCase().includes("learning path")) {
      template = FALLBACK_TEMPLATES.learningPath;
    } else if (prompt.toLowerCase().includes("module")) {
      template = FALLBACK_TEMPLATES.module;
    }

    return {
      success: true,
      wireframe: template,
      aiGenerated: false,
      source: "fallback-template",
      timestamp: new Date().toISOString(),
      note: "AI generation failed, using fallback template",
    };
  }
}

// Main Azure Function handler
module.exports = async function (context, req) {
  context.log("Wireframe generation request received");

  // Log environment variables for debugging
  context.log("Environment check:", {
    hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
    hasKey: !!process.env.AZURE_OPENAI_KEY,
    hasDeployment: !!process.env.AZURE_OPENAI_DEPLOYMENT,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT ? "SET" : "MISSING",
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "MISSING",
  });

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: "",
    };
    return;
  }

  try {
    // Get prompt from request body
    const prompt =
      req.body?.prompt ||
      req.body?.description ||
      req.body?.requirements ||
      "Create a basic wireframe";
    const context_data = req.body?.context || {};

    context.log("Generating wireframe for prompt:", prompt);

    // Try AI generation first, fallback to template if it fails
    const result = await generateAIWireframe(prompt, context_data);

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: result,
    };

    context.log("Wireframe generated successfully");
  } catch (error) {
    context.log.error("Error generating wireframe:", error);

    // Return error with fallback
    context.res = {
      status: 200, // Return 200 to avoid frontend errors
      headers: corsHeaders,
      body: {
        success: true,
        wireframe: FALLBACK_TEMPLATES.dashboard,
        aiGenerated: false,
        source: "error-fallback",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
    };
  }
};
