// Example: How to use Lovable-style wireframe generation

import lovableWireframeService from './services/lovableWireframeService';
import WireframeRefinementPanel from './components/WireframeRefinementPanel';

/**
 * Example 1: Basic wireframe generation
 */
async function generateBasicWireframe() {
    try {
        const result = await lovableWireframeService.generate(
            'Create a landing page for a SaaS product with hero section, features, and pricing'
        );

        console.log('Generated wireframe:', result.html);
        console.log('Model used:', result.metadata?.model); // claude-3-5-sonnet-20241022
        console.log('Tokens:', result.metadata?.tokens);
    } catch (error) {
        console.error('Generation failed:', error);
    }
}

/**
 * Example 2: Generate with custom theme
 */
async function generateWithTheme() {
    const result = await lovableWireframeService.generate(
        'Modern dashboard with sidebar and KPI cards',
        {
            theme: 'modern',
            colorScheme: 'purple'
        }
    );

    return result.html;
}

/**
 * Example 3: Iterative refinement workflow
 */
async function iterativeRefinement() {
    // Step 1: Generate initial wireframe
    const initial = await lovableWireframeService.generate(
        'E-commerce product page'
    );

    let currentHtml = initial.html;

    // Step 2: First refinement
    const refined1 = await lovableWireframeService.refine(
        currentHtml,
        'Make the product images larger and add a reviews section'
    );

    currentHtml = refined1.html;

    // Step 3: Second refinement
    const refined2 = await lovableWireframeService.refine(
        currentHtml,
        'Add related products carousel at the bottom'
    );

    currentHtml = refined2.html;

    // Check refinement history
    const history = lovableWireframeService.getConversationHistory();
    console.log(`Made ${history.length} refinements`);

    return currentHtml;
}

/**
 * Example 4: Using the refinement panel in a React component
 */
function WireframeEditor() {
    const [wireframeHtml, setWireframeHtml] = React.useState('');
    const [showRefinement, setShowRefinement] = React.useState(false);
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await lovableWireframeService.generate(
                'Create a blog homepage with featured posts'
            );
            setWireframeHtml(result.html);
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRefinementComplete = (newHtml: string) => {
        setWireframeHtml(newHtml);
    };

    return (
        <div>
            {/* Generate button */}
            <button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Wireframe'}
            </button>

            {/* Wireframe preview */}
            {wireframeHtml && (
                <div>
                    <iframe srcDoc={wireframeHtml} style={{ width: '100%', height: '600px' }} />

                    {/* Refine button */}
                    <button onClick={() => setShowRefinement(true)}>
                        ✨ Refine Wireframe
                    </button>
                </div>
            )}

            {/* Refinement panel */}
            {showRefinement && wireframeHtml && (
                <WireframeRefinementPanel
                    currentHtml={wireframeHtml}
                    onRefinementComplete={handleRefinementComplete}
                    onClose={() => setShowRefinement(false)}
                />
            )}
        </div>
    );
}

/**
 * Example 5: Component library usage (automatic)
 */
async function generateWithComponents() {
    // The component library is automatically passed to Claude
    // Just describe what you want, and Claude will use appropriate components
    const result = await lovableWireframeService.generate(
        'Create a contact form with name, email, message fields and a submit button'
    );

    // Claude will use pre-built form components from the library
    return result.html;
}

export {
    generateBasicWireframe,
    generateWithTheme,
    iterativeRefinement,
    WireframeEditor,
    generateWithComponents
};
