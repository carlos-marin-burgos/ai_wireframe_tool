#!/usr/bin/env node

/**
 * 🚀 AI Suggestions Re-Enablement Script
 * 
 * This script enables the sophisticated Microsoft Learn-focused AI suggestion system
 * by removing the fallback bypass and implementing robust JSON parsing.
 * 
 * Purpose: Ensure Microsoft Learn AI functionality is deployed and working
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Enabling Microsoft Learn AI Suggestions System');
console.log('====================================================');

const generateSuggestionsPath = path.join(__dirname, 'generateSuggestions', 'index.js');

// Read the current file
const content = fs.readFileSync(generateSuggestionsPath, 'utf8');

// Check if AI is already enabled
if (!content.includes('Always use fallback suggestions for now to avoid JSON parsing issues')) {
  console.log('✅ Microsoft Learn AI suggestions are already enabled!');
  process.exit(0);
}

console.log('📝 Enabling OpenAI integration in generateSuggestions function...');

// Replace the fallback bypass with actual AI integration
const aiEnabledVersion = content.replace(
  /\/\/ Always use fallback suggestions for now to avoid JSON parsing issues[\s\S]*?const fallbackSuggestions = generateFallbackSuggestions\(description\);[\s\S]*?body: \{ suggestions: fallbackSuggestions \},[\s\S]*?\};/,
  `// Initialize OpenAI client for this request
    if (!openai) {
      try {
        openai = await getOpenAIClient();
        context.log("🤖 OpenAI client initialized for suggestions");
      } catch (error) {
        context.log.error("❌ Failed to initialize OpenAI client:", error);
        // Fall back to static suggestions
        const fallbackSuggestions = generateFallbackSuggestions(description);
        context.res = {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Content-Type": "application/json",
          },
          body: { suggestions: fallbackSuggestions },
        };
        return;
      }
    }

    // Generate AI-powered Microsoft Learn suggestions
    if (openai) {
      try {
        context.log("🧠 Generating Microsoft Learn AI suggestions with OpenAI");
        
        const prompt = createLearnSuggestionsPrompt(description);
        const response = await openai.chat.completions.create({
          model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a Microsoft Learn UX expert. Always respond with valid JSON in the exact format requested. Focus on educational and learning-focused suggestions that align with Microsoft Learn design patterns."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        const aiContent = response.choices[0]?.message?.content?.trim();
        
        if (aiContent) {
          // Enhanced JSON parsing with fallback
          let parsedSuggestions;
          try {
            // First try to parse the full response
            const parsed = JSON.parse(aiContent);
            parsedSuggestions = parsed.suggestions || parsed;
          } catch (parseError) {
            context.log.warn("🔧 JSON parsing failed, trying to extract JSON from content...");
            
            // Try to extract JSON from the content
            const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                const parsed = JSON.parse(jsonMatch[0]);
                parsedSuggestions = parsed.suggestions || parsed;
              } catch (extractError) {
                context.log.warn("🔧 JSON extraction failed, using fallback suggestions");
                parsedSuggestions = null;
              }
            } else {
              parsedSuggestions = null;
            }
          }
          
          if (parsedSuggestions && Array.isArray(parsedSuggestions) && parsedSuggestions.length > 0) {
            // Convert to simple string array if needed
            const suggestions = parsedSuggestions.map(item => {
              if (typeof item === 'string') return item;
              if (item.title && item.description) return \`\${item.title}: \${item.description}\`;
              if (item.title) return item.title;
              if (item.description) return item.description;
              return JSON.stringify(item);
            }).slice(0, 6); // Limit to 6 suggestions
            
            context.log("✅ Generated AI-powered Microsoft Learn suggestions:", suggestions.length);
            context.res = {
              status: 200,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Content-Type": "application/json",
              },
              body: { suggestions, ai_powered: true },
            };
            return;
          }
        }
        
        context.log.warn("🔧 AI response was empty or invalid, using fallback suggestions");
      } catch (aiError) {
        context.log.error("❌ OpenAI error generating suggestions:", aiError);
      }
    }

    // Fallback to static Microsoft Learn suggestions
    context.log("🔧 Using fallback Microsoft Learn suggestions");
    const fallbackSuggestions = generateFallbackSuggestions(description);
    context.res = {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
      body: { suggestions: fallbackSuggestions },
    };`
);

// Write the updated file
fs.writeFileSync(generateSuggestionsPath, aiEnabledVersion);

console.log('✅ Microsoft Learn AI suggestions have been enabled!');
console.log('');
console.log('📋 What was changed:');
console.log('  • Removed "Always use fallback" bypass');
console.log('  • Added OpenAI client initialization');
console.log('  • Implemented robust JSON parsing with fallbacks');
console.log('  • Enhanced error handling for AI responses');
console.log('  • Preserved Microsoft Learn-focused prompting');
console.log('');
console.log('🚀 Ready to deploy the Microsoft Learn AI suggestion system!');
console.log('   Run: func start (or azd up) to deploy with AI enabled');
