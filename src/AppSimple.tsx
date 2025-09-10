import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import LandingPage from "./components/LandingPageSimple";
import SplitLayoutSimple from "./components/SplitLayoutSimple";
import { API_CONFIG, getApiUrl } from "./config/api";
import { PerformanceTracker } from "./utils/performance";
import { getInstantSuggestions, shouldUseAI } from "./utils/fastSuggestions";
import { getCachedSuggestions, cacheSuggestions } from "./utils/suggestionCache";

interface SavedWireframe {
    id: string;
    name: string;
    description: string;
    html: string;
    createdAt: string;
    updatedAt: string;
    theme: string;
}

const App: React.FC = () => {
    // Core state
    const [showLandingPage, setShowLandingPage] = useState(true);
    const [description, setDescription] = useState("");
    const [htmlWireframe, setHtmlWireframe] = useState("");
    const [reactComponent, setReactComponent] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState("");
    const [error, setError] = useState<string | null>(null);

    // AI Suggestions state
    const [showAiSuggestions, setShowAiSuggestions] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [suggestionLoading, setSuggestionLoading] = useState(false);
    const [isAiSourcedSuggestions, setIsAiSourcedSuggestions] = useState(false);

    // Design system state
    const [designTheme, setDesignTheme] = useState("microsoft");
    const [colorScheme, setColorScheme] = useState("primary");

    // Performance tracking
    const [forceUpdateKey, setForceUpdateKey] = useState(0);

    // Refs for cancellation
    const abortControllerRef = useRef<AbortController | null>(null);

    // Handle wireframe generation
    const handleSubmit = useCallback(async (e: React.FormEvent, overrideDescription?: string) => {
        e.preventDefault();

        const targetDescription = overrideDescription || description;
        if (!targetDescription.trim() || loading) return;

        console.log("🚀 Starting wireframe generation for:", targetDescription);

        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        const perfTracker = new PerformanceTracker('wireframe-generation');

        try {
            setLoading(true);
            setLoadingStage("Generating wireframe...");
            setError(null);
            setReactComponent("");

            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: targetDescription,
                    designTheme: designTheme,
                    colorScheme: colorScheme,
                    fastMode: false,
                    useTemplates: false,
                    aiOnly: true
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.html) {
                setHtmlWireframe(data.html);
                setShowLandingPage(false);
                console.log("✅ Wireframe generated successfully");
            } else {
                throw new Error(data.error || 'No wireframe generated');
            }

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                console.log("🚫 Request was cancelled");
                return;
            }

            console.error("❌ Wireframe generation failed:", err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
            setLoadingStage("");
            perfTracker.stop();
        }
    }, [description, loading, designTheme, colorScheme]);

    // Handle stop generation
    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setLoading(false);
        setLoadingStage("");
    }, []);

    // Handle AI suggestion click
    const handleAiSuggestionClick = useCallback(async (suggestion: string) => {
        console.log("🚀 AI suggestion clicked:", suggestion);
        setShowAiSuggestions(false);
        setDescription(suggestion);

        const perfTracker = new PerformanceTracker('ai-suggestion-wireframe');

        try {
            setLoading(true);
            setLoadingStage("Generating wireframe from suggestion...");
            setError(null);
            setReactComponent("");

            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: suggestion,
                    designTheme: designTheme,
                    colorScheme: colorScheme
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.html) {
                setHtmlWireframe(data.html);
                setReactComponent("");
                setShowLandingPage(false);
                console.log("✅ Wireframe generated from suggestion");
            } else {
                throw new Error(data.error || 'No wireframe generated');
            }
        } catch (err) {
            console.error("❌ AI suggestion generation failed:", err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
            setLoadingStage("");
            perfTracker.stop();
        }
    }, [designTheme, colorScheme]);

    // Generate AI suggestions
    const handleGenerateAiSuggestions = useCallback(async (input: string) => {
        if (!input || input.trim().length < 3) return;

        console.log("🤖 Generating AI suggestions for:", input);

        try {
            setSuggestionLoading(true);

            // Try cache first
            const cached = getCachedSuggestions(input);
            if (cached && cached.suggestions) {
                setAiSuggestions(cached.suggestions);
                setIsAiSourcedSuggestions(true);
                setShowAiSuggestions(true);
                setSuggestionLoading(false);
                return;
            }

            // Check if we should use AI
            if (!shouldUseAI(input)) {
                const instant = getInstantSuggestions(input);
                setAiSuggestions(instant);
                setIsAiSourcedSuggestions(false);
                setShowAiSuggestions(true);
                setSuggestionLoading(false);
                return;
            }

            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_SUGGESTIONS), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input, theme: designTheme })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.suggestions && Array.isArray(data.suggestions)) {
                    setAiSuggestions(data.suggestions);
                    setIsAiSourcedSuggestions(true);
                    setShowAiSuggestions(true);

                    // Cache the results
                    cacheSuggestions(input, data.suggestions);
                }
            } else {
                // Fallback to instant suggestions
                const instant = getInstantSuggestions(input);
                setAiSuggestions(instant);
                setIsAiSourcedSuggestions(false);
                setShowAiSuggestions(true);
            }
        } catch (err) {
            console.error("❌ Suggestion generation failed:", err);
            // Fallback to instant suggestions
            const instant = getInstantSuggestions(input);
            setAiSuggestions(instant);
            setIsAiSourcedSuggestions(false);
            setShowAiSuggestions(true);
        } finally {
            setSuggestionLoading(false);
        }
    }, [designTheme]);

    // Handle back to landing
    const handleBackToLanding = useCallback(() => {
        setShowLandingPage(true);
        setHtmlWireframe("");
        setReactComponent("");
        setDescription("");
        setError(null);
        setShowAiSuggestions(false);
        setForceUpdateKey(prev => prev + 1);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <div className="App">
            {showLandingPage && !htmlWireframe && !reactComponent ? (
                <LandingPage
                    error={error}
                    savedWireframesCount={0}
                    onLoadClick={() => { }}
                    description={description}
                    onDescriptionChange={(e) => {
                        const value = e.target.value;
                        setDescription(value);

                        // Hide suggestions when content becomes too short
                        if (value.length <= 2) {
                            setShowAiSuggestions(false);
                        }
                    }}
                    onSubmit={handleSubmit}
                    loading={loading}
                    handleStop={handleStop}
                    showAiSuggestions={showAiSuggestions}
                    aiSuggestions={aiSuggestions}
                    suggestionLoading={suggestionLoading}
                    onAiSuggestionClick={handleAiSuggestionClick}
                    onGenerateAiSuggestions={handleGenerateAiSuggestions}
                />
            ) : (
                <SplitLayoutSimple
                    description={description}
                    setDescription={setDescription}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    loadingStage={loadingStage}
                    fallback={false}
                    processingTime={0}
                    handleStop={handleStop}
                    showAiSuggestions={showAiSuggestions}
                    aiSuggestions={aiSuggestions}
                    suggestionLoading={suggestionLoading}
                    isAiSourced={isAiSourcedSuggestions}
                    setShowAiSuggestions={setShowAiSuggestions}
                    onGenerateAiSuggestions={handleGenerateAiSuggestions}
                    error={error}
                    htmlWireframe={htmlWireframe}
                    setHtmlWireframe={setHtmlWireframe}
                    reactComponent={reactComponent}
                    setReactComponent={setReactComponent}
                    designTheme={designTheme}
                    colorScheme={colorScheme}
                    onAiSuggestionClick={handleAiSuggestionClick}
                    forceUpdateKey={forceUpdateKey}
                />
            )}
        </div>
    );
};

export default App;
