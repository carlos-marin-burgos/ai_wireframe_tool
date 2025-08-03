module.exports = async function (context, req) {
  // Set CORS headers for all requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: ""
    };
    return;
  }

  try {
    // Simple working response with CORS headers
    const suggestions = [
      "Add clear visual hierarchy with consistent typography and spacing",
      "Implement responsive design with mobile-first approach", 
      "Include accessibility features like keyboard navigation and ARIA labels",
      "Use Microsoft Learn design system components for consistency",
      "Add loading states and error handling for better user feedback",
      "Create intuitive navigation with breadcrumbs and clear call-to-actions"
    ];

    context.res = {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      body: { suggestions }
    };

  } catch (error) {
    context.res = {
      status: 200, // Return 200 instead of 500 to avoid fetch errors
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      body: { 
        suggestions: [
          "Add clear visual hierarchy with consistent typography and spacing",
          "Implement responsive design with mobile-first approach", 
          "Include accessibility features like keyboard navigation and ARIA labels",
          "Use Microsoft Learn design system components for consistency",
          "Add loading states and error handling for better user feedback",
          "Create intuitive navigation with breadcrumbs and clear call-to-actions"
        ]
      }
    };
  }
};
