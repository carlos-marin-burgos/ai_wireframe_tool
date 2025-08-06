/**
 * Performance Optimized Wireframe Generator
 * This module provides fast wireframe generation with intelligent caching,
 * reduced AI calls, and optimized component generation
 */

const crypto = require("crypto");
const { performance } = require("perf_hooks");

// Simple in-memory cache for wireframes
const wireframeCache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
const MAX_CACHE_SIZE = 100;

// Performance metrics
const performanceMetrics = {
  totalRequests: 0,
  cacheHits: 0,
  aiCalls: 0,
  averageResponseTime: 0,
  fastModeUsage: 0,
};

/**
 * Fast cache implementation
 */
class FastWireframeCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = MAX_CACHE_SIZE;
    this.ttl = CACHE_TTL;
  }

  generateKey(description, colorScheme, theme) {
    // Create a hash-based key for faster lookups
    const normalized = `${description
      .toLowerCase()
      .trim()}-${colorScheme}-${theme}`;
    return crypto.createHash("md5").update(normalized).digest("hex");
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check TTL
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
    };
  }
}

// Initialize fast cache
const fastCache = new FastWireframeCache();

/**
 * Fast pattern-based wireframe generator
 * Generates wireframes instantly without AI for common patterns
 */
class FastWireframeGenerator {
  constructor() {
    // Pre-compiled templates for instant generation
    this.templates = new Map();
    this.initializeTemplates();
  }

  initializeTemplates() {
    // Login form template
    this.templates.set("login", {
      keywords: ["login", "sign in", "authenticate", "auth", "signin"],
      generate: (description, colorScheme) =>
        this.generateLoginForm(colorScheme),
    });

    // Contact form template
    this.templates.set("contact", {
      keywords: ["contact", "form", "feedback", "support", "submit"],
      generate: (description, colorScheme) =>
        this.generateContactForm(colorScheme),
    });

    // Dashboard template
    this.templates.set("dashboard", {
      keywords: ["dashboard", "analytics", "metrics", "chart", "data"],
      generate: (description, colorScheme) =>
        this.generateDashboard(colorScheme),
    });

    // Landing page template
    this.templates.set("landing", {
      keywords: ["landing", "homepage", "home", "welcome", "main"],
      generate: (description, colorScheme) =>
        this.generateLandingPage(colorScheme),
    });

    // Blog template
    this.templates.set("blog", {
      keywords: ["blog", "article", "post", "content", "news"],
      generate: (description, colorScheme) =>
        this.generateBlogPage(colorScheme),
    });
  }

  detectPattern(description) {
    const desc = description.toLowerCase();

    for (const [pattern, config] of this.templates) {
      if (config.keywords.some((keyword) => desc.includes(keyword))) {
        return pattern;
      }
    }

    return "generic";
  }

  generateInstant(description, colorScheme = "primary") {
    const pattern = this.detectPattern(description);
    const template = this.templates.get(pattern);

    if (template) {
      return template.generate(description, colorScheme);
    }

    return this.generateGenericPage(description, colorScheme);
  }

  generateLoginForm(colorScheme) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - Microsoft Learn</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        .login-header { text-align: center; margin-bottom: 32px; }
        .login-header h1 { color: #323130; font-size: 24px; margin-bottom: 8px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: #323130; font-weight: 500; }
        .form-group input { 
            width: 100%; 
            padding: 12px; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            font-size: 14px;
        }
        .btn-primary { 
            width: 100%; 
            padding: 12px; 
            background: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            font-size: 14px; 
            cursor: pointer;
        }
        .btn-primary:hover { opacity: 0.9; }
        .forgot-link { text-align: center; margin-top: 16px; }
        .forgot-link a { color: #0078d4; text-decoration: none; font-size: 14px; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>Sign in to Microsoft Learn</h1>
            <p>Continue your learning journey</p>
        </div>
        <form>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn-primary">Sign In</button>
        </form>
        <div class="forgot-link">
            <a href="#">Forgot your password?</a>
        </div>
    </div>
</body>
</html>`;
  }

  generateContactForm(colorScheme) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - Microsoft Learn</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .header { 
            background: white; 
            padding: 40px; 
            border-radius: 8px 8px 0 0; 
            text-align: center;
        }
        .form-container { 
            background: white; 
            padding: 40px; 
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 { color: #323130; margin-bottom: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: #323130; font-weight: 500; }
        .form-group input, .form-group textarea { 
            width: 100%; 
            padding: 12px; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            font-size: 14px;
        }
        .form-group textarea { height: 120px; resize: vertical; }
        .btn-primary { 
            padding: 12px 24px; 
            background: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            font-size: 14px; 
            cursor: pointer;
        }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Contact Our Support Team</h1>
            <p>We're here to help with your Microsoft Learn experience</p>
        </div>
        <div class="form-container">
            <form>
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" placeholder="Please describe your question or issue..." required></textarea>
                </div>
                <button type="submit" class="btn-primary">Send Message</button>
            </form>
        </div>
    </div>
</body>
</html>`;
  }

  generateDashboard(colorScheme) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Dashboard - Microsoft Learn</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
        }
        .header { background: white; padding: 20px; border-bottom: 1px solid #e1e5e9; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { 
            background: white; 
            padding: 24px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .card h3 { color: #323130; margin-bottom: 16px; }
        .metric { font-size: 32px; font-weight: bold; color: ${
          colorScheme === "primary" ? "#0078d4" : "#107c10"
        }; }
        .progress-bar { 
            background: #e1e5e9; 
            border-radius: 4px; 
            height: 8px; 
            margin: 16px 0;
        }
        .progress-fill { 
            background: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            height: 100%; 
            border-radius: 4px;
        }
        .course-list { list-style: none; }
        .course-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #f3f2f1; 
            display: flex; 
            justify-content: space-between;
        }
        .btn { 
            padding: 8px 16px; 
            background: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            text-decoration: none; 
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>Learning Dashboard</h1>
            <p>Track your progress and continue your learning journey</p>
        </div>
    </div>
    <div class="container">
        <div class="dashboard-grid">
            <div class="card">
                <h3>Learning Progress</h3>
                <div class="metric">75%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 75%"></div>
                </div>
                <p>3 of 4 modules completed</p>
            </div>
            <div class="card">
                <h3>Achievements</h3>
                <div class="metric">12</div>
                <p>Badges earned this month</p>
            </div>
            <div class="card">
                <h3>Study Streak</h3>
                <div class="metric">7</div>
                <p>Days in a row</p>
            </div>
            <div class="card">
                <h3>Current Courses</h3>
                <ul class="course-list">
                    <li><span>Azure Fundamentals</span> <a href="#" class="btn">Continue</a></li>
                    <li><span>JavaScript Basics</span> <a href="#" class="btn">Continue</a></li>
                    <li><span>Power BI Analytics</span> <a href="#" class="btn">Continue</a></li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  generateLandingPage(colorScheme) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
        }
        .hero { 
            background: linear-gradient(135deg, ${
              colorScheme === "primary"
                ? "#0078d4, #106ebe"
                : "#107c10, #0b6413"
            }); 
            color: white; 
            padding: 80px 20px; 
            text-align: center;
        }
        .hero h1 { font-size: 48px; margin-bottom: 16px; }
        .hero p { font-size: 20px; margin-bottom: 32px; opacity: 0.9; }
        .btn-hero { 
            background: white; 
            color: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            padding: 16px 32px; 
            border: none; 
            border-radius: 4px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .features { padding: 80px 20px; max-width: 1200px; margin: 0 auto; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
        .feature { text-align: center; padding: 32px; }
        .feature h3 { margin-bottom: 16px; color: #323130; }
        .feature p { color: #605e5c; }
        .cta { 
            background: #f8f9fa; 
            padding: 80px 20px; 
            text-align: center;
        }
        .cta h2 { margin-bottom: 16px; color: #323130; }
        .cta p { margin-bottom: 32px; color: #605e5c; font-size: 18px; }
    </style>
</head>
<body>
    <section class="hero">
        <h1>Learn. Build. Advance.</h1>
        <p>Develop your skills with hands-on training from Microsoft Learn</p>
        <a href="#" class="btn-hero">Start Learning Today</a>
    </section>
    
    <section class="features">
        <div class="features-grid">
            <div class="feature">
                <h3>🎯 Guided Learning Paths</h3>
                <p>Structured courses designed to take you from beginner to expert</p>
            </div>
            <div class="feature">
                <h3>🏅 Industry Certifications</h3>
                <p>Earn recognized credentials that advance your career</p>
            </div>
            <div class="feature">
                <h3>💻 Hands-on Labs</h3>
                <p>Practice with real Azure environments and sandbox resources</p>
            </div>
        </div>
    </section>
    
    <section class="cta">
        <h2>Ready to accelerate your career?</h2>
        <p>Join millions of learners who trust Microsoft Learn for their professional development</p>
        <a href="#" class="btn-hero">Browse Learning Paths</a>
    </section>
</body>
</html>`;
  }

  generateBlogPage(colorScheme) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn Blog</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #323130;
        }
        .header { 
            background: white; 
            padding: 20px; 
            border-bottom: 1px solid #e1e5e9;
            text-align: center;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        .article { margin-bottom: 40px; }
        .article-header { margin-bottom: 24px; }
        .article-title { 
            font-size: 32px; 
            margin-bottom: 8px; 
            color: ${colorScheme === "primary" ? "#0078d4" : "#107c10"};
        }
        .article-meta { 
            color: #605e5c; 
            font-size: 14px; 
            margin-bottom: 16px;
        }
        .article-excerpt { 
            font-size: 18px; 
            color: #605e5c; 
            margin-bottom: 16px;
        }
        .read-more { 
            color: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            text-decoration: none; 
            font-weight: 500;
        }
        .sidebar { 
            background: #f8f9fa; 
            padding: 24px; 
            border-radius: 8px; 
            margin-top: 40px;
        }
        .sidebar h3 { margin-bottom: 16px; }
        .tag { 
            display: inline-block; 
            background: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Microsoft Learn Blog</h1>
        <p>Latest insights, tutorials, and updates from the Microsoft Learn community</p>
    </div>
    
    <div class="container">
        <article class="article">
            <div class="article-header">
                <h2 class="article-title">Getting Started with Azure AI Services</h2>
                <div class="article-meta">Published on March 15, 2024 • 5 min read</div>
                <div class="article-excerpt">
                    Discover how to leverage Azure's powerful AI capabilities to build intelligent applications that can see, hear, speak, and understand.
                </div>
            </div>
            <a href="#" class="read-more">Read full article →</a>
        </article>
        
        <article class="article">
            <div class="article-header">
                <h2 class="article-title">Building Responsive Web Apps with CSS Grid</h2>
                <div class="article-meta">Published on March 12, 2024 • 8 min read</div>
                <div class="article-excerpt">
                    Learn modern CSS Grid techniques to create responsive layouts that work beautifully across all device sizes.
                </div>
            </div>
            <a href="#" class="read-more">Read full article →</a>
        </article>
        
        <article class="article">
            <div class="article-header">
                <h2 class="article-title">Power Platform: Automating Business Processes</h2>
                <div class="article-meta">Published on March 10, 2024 • 6 min read</div>
                <div class="article-excerpt">
                    Transform your organization's efficiency with Power Automate workflows and Power Apps solutions.
                </div>
            </div>
            <a href="#" class="read-more">Read full article →</a>
        </article>
        
        <div class="sidebar">
            <h3>Popular Tags</h3>
            <span class="tag">Azure</span>
            <span class="tag">JavaScript</span>
            <span class="tag">AI</span>
            <span class="tag">Power Platform</span>
            <span class="tag">DevOps</span>
        </div>
    </div>
</body>
</html>`;
  }

  generateGenericPage(description, colorScheme) {
    const title = description.charAt(0).toUpperCase() + description.slice(1);
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Microsoft Learn</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #323130;
        }
        .header { 
            background: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            color: white; 
            padding: 40px 20px; 
            text-align: center;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .content { 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 { margin-bottom: 16px; }
        p { margin-bottom: 16px; color: #605e5c; }
        .btn { 
            background: ${colorScheme === "primary" ? "#0078d4" : "#107c10"}; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>Professional solution built with Microsoft Learn design principles</p>
    </div>
    <div class="container">
        <div class="content">
            <h2>Welcome to ${title}</h2>
            <p>This page has been optimized for fast loading and excellent user experience. Built using modern web standards and accessible design principles.</p>
            <p>Explore the features and functionality designed specifically for your needs.</p>
            <a href="#" class="btn">Get Started</a>
        </div>
    </div>
</body>
</html>`;
  }
}

// Initialize fast generator
const fastGenerator = new FastWireframeGenerator();

/**
 * Optimized wireframe generation with multiple speed strategies
 */
async function generateOptimizedWireframe(
  description,
  colorScheme = "primary",
  options = {}
) {
  const startTime = performance.now();
  performanceMetrics.totalRequests++;

  try {
    // Strategy 1: Check cache first
    const cacheKey = fastCache.generateKey(
      description,
      colorScheme,
      "microsoftlearn"
    );
    const cached = fastCache.get(cacheKey);

    if (cached && !options.skipCache) {
      performanceMetrics.cacheHits++;
      return {
        html: cached,
        source: "cache",
        responseTime: performance.now() - startTime,
        fromCache: true,
      };
    }

    // Strategy 2: Fast pattern-based generation for simple requests
    const isSimpleRequest =
      description.length < 100 &&
      !description.includes("complex") &&
      !description.includes("advanced") &&
      !description.includes("custom");

    if (isSimpleRequest || options.fastMode) {
      performanceMetrics.fastModeUsage++;
      const html = fastGenerator.generateInstant(description, colorScheme);

      // Cache the result
      fastCache.set(cacheKey, html);

      return {
        html,
        source: "fast-pattern",
        responseTime: performance.now() - startTime,
        pattern: fastGenerator.detectPattern(description),
      };
    }

    // Strategy 3: AI generation with timeout for complex requests
    if (options.useAI) {
      performanceMetrics.aiCalls++;

      // Use shorter AI prompt for faster response
      const optimizedPrompt = createOptimizedPrompt(description, colorScheme);

      try {
        // Shorter timeout for speed
        const aiResult = await generateWithAI(optimizedPrompt, 15000); // 15 second timeout

        if (aiResult) {
          fastCache.set(cacheKey, aiResult);
          return {
            html: aiResult,
            source: "ai-optimized",
            responseTime: performance.now() - startTime,
          };
        }
      } catch (aiError) {
        console.warn(
          "AI generation failed, falling back to fast mode:",
          aiError.message
        );
      }
    }

    // Strategy 4: Fallback to fast generation
    const html = fastGenerator.generateInstant(description, colorScheme);
    fastCache.set(cacheKey, html);

    return {
      html,
      source: "fast-fallback",
      responseTime: performance.now() - startTime,
      pattern: fastGenerator.detectPattern(description),
    };
  } catch (error) {
    console.error("Optimized generation failed:", error);

    // Emergency fallback
    return {
      html: fastGenerator.generateGenericPage(description, colorScheme),
      source: "emergency",
      responseTime: performance.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Create optimized prompt for faster AI generation
 */
function createOptimizedPrompt(description, colorScheme) {
  return `Create a complete, responsive HTML page for: ${description}

Requirements:
- Use inline CSS for fast loading
- Microsoft Learn design system
- ${colorScheme} color scheme
- Semantic HTML5 structure
- Mobile-first responsive design
- Fast, minimal code

Generate ONLY the HTML, no explanations.`;
}

/**
 * AI generation with timeout
 */
async function generateWithAI(prompt, timeoutMs = 15000) {
  // This would integrate with your existing OpenAI setup
  // Placeholder for actual AI integration
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), timeoutMs);
  });
}

/**
 * Performance monitoring and stats
 */
function getPerformanceStats() {
  const totalTime =
    performanceMetrics.totalRequests > 0
      ? performanceMetrics.averageResponseTime *
        performanceMetrics.totalRequests
      : 0;

  return {
    ...performanceMetrics,
    cacheHitRate:
      performanceMetrics.totalRequests > 0
        ? (performanceMetrics.cacheHits / performanceMetrics.totalRequests) *
          100
        : 0,
    aiUsageRate:
      performanceMetrics.totalRequests > 0
        ? (performanceMetrics.aiCalls / performanceMetrics.totalRequests) * 100
        : 0,
    fastModeRate:
      performanceMetrics.totalRequests > 0
        ? (performanceMetrics.fastModeUsage /
            performanceMetrics.totalRequests) *
          100
        : 0,
    cacheStats: fastCache.getStats(),
  };
}

/**
 * Clear performance cache
 */
function clearCache() {
  fastCache.clear();
  console.log("Performance cache cleared");
}

module.exports = {
  generateOptimizedWireframe,
  FastWireframeGenerator,
  FastWireframeCache,
  getPerformanceStats,
  clearCache,
  fastGenerator,
};
