/**
 * Test examples showing how Pure AI handles ANY user input
 */

const { PureAIWireframeGenerator } = require("./pure-ai-wireframe-generator");

async function testPureAIGeneration() {
  const generator = new PureAIWireframeGenerator();

  // Test cases showing the versatility
  const testCases = [
    // Navigation Examples
    "left navigation sidebar with collapsible menu sections",
    "top navigation with dropdown menus and search bar",
    "breadcrumb navigation for multi-level hierarchy",

    // Dashboard Examples
    "executive dashboard with KPI cards and revenue charts",
    "analytics dashboard with real-time metrics and graphs",
    "admin dashboard with user management and system status",

    // Table Examples
    "data table with inline editing and bulk actions",
    "comparison table with sorting and filtering",
    "pricing table with feature comparison matrix",

    // Complex Layouts
    "e-commerce product page with image gallery and reviews",
    "social media feed with posts, likes, and comments",
    "chat application with message history and emoji picker",
    "kanban project board with drag and drop functionality",
    "calendar scheduler with appointment booking",
    "file manager with folder tree and file preview",

    // Specialized Interfaces
    "video streaming platform with player and playlist",
    "code editor with syntax highlighting and file tree",
    "email client with inbox, compose, and folder navigation",
    "photo editor with tools panel and layer management",
    "music player with playlist and audio controls",
    "map interface with markers and route planning",

    // Business Applications
    "CRM contact management with lead tracking",
    "inventory management with stock levels and alerts",
    "employee timesheet with clock in/out functionality",
    "invoice generator with client and product selection",
    "help desk ticketing system with status tracking",
    "event management platform with RSVP handling",

    // Creative & Unique
    "recipe app with ingredient calculator and timer",
    "fitness tracker with workout plans and progress charts",
    "weather app with 7-day forecast and radar map",
    "cryptocurrency portfolio with live price tracking",
    "learning management system with course progress",
    "virtual pet game interface with care actions",
  ];

  console.log("🚀 Testing Pure AI Wireframe Generation");
  console.log("=====================================\n");

  // Test a few examples
  for (let i = 0; i < 3; i++) {
    const description = testCases[i];
    console.log(`🎯 Generating: "${description}"`);

    try {
      const result = await generator.generateReactWireframe(description);
      console.log(
        `✅ Success! Generated ${result.code.length} characters of React code`
      );
      console.log(`📝 Type: ${result.framework} with ${result.styling}`);
      console.log(`🕒 Generated at: ${result.generatedAt}\n`);
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }

  // Test variations
  console.log("🔄 Testing Variations");
  console.log("====================\n");

  try {
    const variations = await generator.generateVariations(
      "dashboard with charts and data tables",
      3
    );
    console.log(`✅ Generated ${variations.length} variations successfully\n`);
  } catch (error) {
    console.log(`❌ Variations failed: ${error.message}\n`);
  }

  // Test component requirements
  console.log("🧩 Testing Required Components");
  console.log("==============================\n");

  try {
    const withComponents = await generator.generateWithComponents(
      "user management interface",
      ["data table", "search bar", "user form modal", "pagination"]
    );
    console.log(`✅ Generated with required components successfully\n`);
  } catch (error) {
    console.log(`❌ Component requirements failed: ${error.message}\n`);
  }
}

// Examples of what the AI can generate (no templates needed!)
const capabilityExamples = {
  // These would ALL work with pure AI:
  navigation: [
    "vertical sidebar navigation with icons",
    "horizontal mega menu with categories",
    "mobile hamburger menu with slide-out",
    "tab navigation with active states",
    "wizard step navigation with progress",
    "breadcrumb trail for deep hierarchies",
  ],

  dashboards: [
    "sales dashboard with revenue charts",
    "analytics dashboard with conversion funnels",
    "admin dashboard with user statistics",
    "monitoring dashboard with health metrics",
    "financial dashboard with portfolio tracking",
    "social media dashboard with engagement stats",
  ],

  tables: [
    "data table with sortable columns",
    "editable table with inline validation",
    "comparison table with highlighting",
    "pricing table with feature checkmarks",
    "invoice table with line item calculations",
    "inventory table with stock alerts",
  ],

  forms: [
    "multi-step form with validation",
    "contact form with file uploads",
    "user registration with email verification",
    "payment form with credit card validation",
    "survey form with conditional questions",
    "settings form with toggle switches",
  ],

  ecommerce: [
    "product catalog with filters",
    "shopping cart with quantity updates",
    "checkout flow with payment options",
    "product detail page with reviews",
    "wishlist with save for later",
    "order tracking with status updates",
  ],

  social: [
    "news feed with infinite scroll",
    "user profile with activity timeline",
    "messaging interface with chat bubbles",
    "notification center with read/unread",
    "comments section with threaded replies",
    "social media post composer",
  ],

  productivity: [
    "todo list with drag and drop",
    "calendar with event scheduling",
    "note-taking app with rich text",
    "project management kanban board",
    "time tracking with timers",
    "document editor with collaboration",
  ],

  media: [
    "video player with playlist",
    "image gallery with lightbox",
    "audio player with waveform",
    "photo editor with filter controls",
    "music streaming interface",
    "podcast player with episodes",
  ],

  // And literally ANY other concept the user describes!
  creative: [
    "recipe finder with ingredient matching",
    "workout planner with exercise library",
    "habit tracker with streak counters",
    "budget tracker with spending categories",
    "travel planner with itinerary builder",
    "book reading tracker with progress",
    "language learning with flashcards",
    "meditation app with guided sessions",
    "plant care tracker with watering schedules",
    "pet adoption platform with search filters",
  ],
};

module.exports = { testPureAIGeneration, capabilityExamples };
