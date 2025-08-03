// Context-Aware Generation Testing Script
// This script tests the conversation history and learning capabilities

async function runContextAwareTest() {
    console.log('🧠 Starting Context-Aware Generation Tests...');
    
    const testSequence = [
        {
            description: "Create a modern dashboard for project management",
            expectedContext: "initial request",
            note: "First request - establishes baseline"
        },
        {
            description: "Add more metrics and charts to the dashboard",
            expectedContext: "building on previous dashboard",
            note: "Second request - should reference previous dashboard"
        },
        {
            description: "Make the dashboard mobile-responsive with touch interactions",
            expectedContext: "enhancing existing dashboard",
            note: "Third request - should understand we're still working on the same dashboard"
        },
        {
            description: "Create a user profile page that matches the dashboard style",
            expectedContext: "consistent design system",
            note: "Fourth request - should maintain design consistency"
        },
        {
            description: "Add a settings panel to the profile page",
            expectedContext: "extending profile functionality",
            note: "Fifth request - should build on profile page context"
        }
    ];

    const sessionId = 'test_session_' + Date.now();
    let conversationHistory = [];
    let results = [];

    for (let i = 0; i < testSequence.length; i++) {
        const test = testSequence[i];
        console.log(`\n📝 Test ${i + 1}: ${test.note}`);
        console.log(`Request: "${test.description}"`);

        try {
            const startTime = Date.now();

            // Prepare context data
            const contextData = {
                sessionId,
                conversationHistory: conversationHistory.slice(-3), // Last 3 interactions
                userPreferences: {
                    designStyle: 'modern',
                    complexity: 'medium',
                    platform: 'web'
                },
                currentRequest: test.description,
                iteration: i + 1
            };

            // Make API request with context
            const response = await fetch('http://localhost:5001/api/generate-wireframe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: test.description,
                    sessionId: sessionId,
                    conversationContext: contextData,
                    includeAdvancedPrompting: true,
                    useContextAwareness: true,
                    testMode: true
                })
            });

            const result = await response.json();
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // Record the interaction
            const interaction = {
                request: test.description,
                response: result.success ? 'Generated successfully' : 'Failed',
                timestamp: new Date().toISOString(),
                responseTime,
                contextScore: result.contextScore || 0,
                patternsUsed: result.patternsUsed || [],
                iteration: i + 1
            };

            conversationHistory.push(interaction);
            results.push({
                test,
                interaction,
                result
            });

            console.log(`✅ Response time: ${responseTime}ms`);
            console.log(`📊 Context score: ${result.contextScore || 'N/A'}`);
            console.log(`🎯 Patterns used: ${result.patternsUsed ? result.patternsUsed.join(', ') : 'None'}`);
            
            if (result.contextualImprovements) {
                console.log(`🚀 Contextual improvements: ${result.contextualImprovements.join(', ')}`);
            }

            // Wait between requests to simulate real user interaction
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`❌ Test ${i + 1} failed:`, error);
            results.push({
                test,
                error: error.message
            });
        }
    }

    // Analyze results
    console.log('\n📊 CONTEXT-AWARE GENERATION TEST RESULTS');
    console.log('==========================================');

    const successfulTests = results.filter(r => r.result && r.result.success);
    const avgResponseTime = successfulTests.reduce((sum, r) => sum + r.interaction.responseTime, 0) / successfulTests.length;
    const avgContextScore = successfulTests.reduce((sum, r) => sum + (r.result.contextScore || 0), 0) / successfulTests.length;

    console.log(`📈 Success rate: ${successfulTests.length}/${results.length} (${(successfulTests.length/results.length*100).toFixed(1)}%)`);
    console.log(`⚡ Average response time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`🧠 Average context score: ${avgContextScore.toFixed(2)}`);

    // Check for learning progression
    const contextScores = successfulTests.map(r => r.result.contextScore || 0);
    const isLearning = contextScores.length > 2 && contextScores[contextScores.length-1] > contextScores[0];
    console.log(`📚 Learning progression: ${isLearning ? '✅ IMPROVING' : '❌ NO CLEAR IMPROVEMENT'}`);

    // Pattern analysis
    const allPatterns = successfulTests.flatMap(r => r.result.patternsUsed || []);
    const uniquePatterns = [...new Set(allPatterns)];
    console.log(`🎨 Patterns learned: ${uniquePatterns.join(', ') || 'None'}`);

    console.log('\n🔍 DETAILED RESULTS:');
    results.forEach((result, index) => {
        console.log(`\nTest ${index + 1}: ${result.test.note}`);
        if (result.error) {
            console.log(`  ❌ Error: ${result.error}`);
        } else if (result.result) {
            console.log(`  ✅ Success: ${result.interaction.responseTime}ms`);
            console.log(`  📊 Context Score: ${result.result.contextScore || 'N/A'}`);
            if (result.result.contextualImprovements) {
                console.log(`  🚀 Improvements: ${result.result.contextualImprovements.join(', ')}`);
            }
        }
    });

    return {
        sessionId,
        results,
        metrics: {
            successRate: successfulTests.length / results.length,
            avgResponseTime,
            avgContextScore,
            isLearning,
            patternsLearned: uniquePatterns
        }
    };
}

// Export for use in HTML page
if (typeof window !== 'undefined') {
    window.runContextAwareTest = runContextAwareTest;
}

// Run if called directly
if (typeof require !== 'undefined' && require.main === module) {
    runContextAwareTest().then(results => {
        console.log('\n🎉 Context-aware generation testing completed!');
        process.exit(0);
    }).catch(error => {
        console.error('❌ Testing failed:', error);
        process.exit(1);
    });
}
