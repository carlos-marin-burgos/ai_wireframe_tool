const fs = require('fs');
const path = require('path');

// Template mapping logic from template-manager.js
const TEMPLATE_CONDITIONS = {
  "default": ["landing page", "home page", "main page", "default page"],
  "product": ["product page", "product showcase", "product details", "product catalog", "product listing"],
  "dashboard": ["dashboard", "admin panel", "control panel", "analytics dashboard", "user dashboard"],
  "profile": ["profile page", "user profile", "account page", "personal page", "settings page"],
  "blog": ["blog", "article", "news", "blog post", "content page"],
  "contact": ["contact page", "contact us", "contact form", "get in touch"],
  "about": ["about page", "about us", "company info", "team page"],
  "services": ["services page", "our services", "what we do", "offerings"],
  "portfolio": ["portfolio", "projects", "work samples", "case studies"],
  "pricing": ["pricing page", "plans", "packages", "cost"],
  "faq": ["faq", "frequently asked questions", "help", "support"],
  "login": ["login page", "sign in", "authentication", "user login"],
  "register": ["register page", "sign up", "create account", "registration"],
  "checkout": ["checkout page", "payment", "order", "purchase"],
  "search": ["search page", "search results", "find", "search interface"],
  "404": ["404 page", "not found", "error page", "page not found"],
  "coming-soon": ["coming soon", "under construction", "launch page", "preview"],
  "thank-you": ["thank you page", "confirmation", "success page", "completed"],
  "newsletter": ["newsletter", "subscribe", "mailing list", "email signup"],
  "gallery": ["gallery", "photos", "images", "media gallery"],
  "testimonials": ["testimonials", "reviews", "feedback", "customer stories"],
  "microsoft-docs": ["Microsoft Learn Doc page", "microsoft learn doc page", "learn doc page", "documentation page", "docs page", "microsoft docs"],
  "ms-learn-dashboard": ["Microsoft Learn Dashboard", "microsoft learn dashboard", "learn dashboard", "training dashboard"],
  "atlas-components": ["Atlas Component Library", "atlas components", "component library", "ui components"],
  "figma-bridge": ["Figma Integration Bridge", "figma bridge", "design bridge", "figma integration"]
};

function findBestTemplateMatch(selectedPill) {
  if (!selectedPill) return 'default';
  
  const normalizedInput = selectedPill.toLowerCase().trim();
  
  // Direct match search
  for (const [templateKey, conditions] of Object.entries(TEMPLATE_CONDITIONS)) {
    if (conditions.some(condition => 
      normalizedInput === condition.toLowerCase() ||
      normalizedInput.includes(condition.toLowerCase()) ||
      condition.toLowerCase().includes(normalizedInput)
    )) {
      return templateKey;
    }
  }
  
  // Fallback to default
  return 'default';
}

async function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
  
  try {
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    } else {
      console.warn(`Template not found: ${templatePath}`);
      // Load default template as fallback
      const defaultPath = path.join(__dirname, '..', 'templates', 'default.html');
      if (fs.existsSync(defaultPath)) {
        return fs.readFileSync(defaultPath, 'utf8');
      }
      return null;
    }
  } catch (error) {
    console.error('Error loading template:', error);
    return null;
  }
}

const { requireMicrosoftAuth } = require("../lib/authMiddleware");

module.exports = async function (context, req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-MS-CLIENT-PRINCIPAL',
        'Access-Control-Max-Age': '86400'
      }
    };
    return;
  }

  // Require Microsoft employee authentication
  const auth = requireMicrosoftAuth(req);
  if (!auth.valid) {
    context.res = {
      status: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: {
        error: 'Unauthorized',
        message: auth.error || 'Microsoft employee authentication required'
      }
    };
    return;
  }

  context.log(`👤 Authenticated user: ${auth.email}`);

  try {
    const { selectedPill } = req.body || {};
    
    if (!selectedPill) {
      context.res = {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: { error: 'selectedPill is required' }
      };
      return;
    }

    // Find the best template match
    const templateName = findBestTemplateMatch(selectedPill);
    console.log(`Template mapping: "${selectedPill}" -> "${templateName}"`);

    // Load the template
    const templateContent = await loadTemplate(templateName);
    
    if (!templateContent) {
      context.res = {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: { error: 'Template not found' }
      };
      return;
    }

    context.res = {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: {
        success: true,
        templateName,
        templateContent,
        selectedPill
      }
    };

  } catch (error) {
    console.error('Error in get-template function:', error);
    context.res = {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: { 
        error: 'Internal server error',
        details: error.message 
      }
    };
  }
};
