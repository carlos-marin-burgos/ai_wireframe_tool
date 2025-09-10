// Suggestion Cache Utility
// Provides a caching mechanism for AI-generated suggestions to improve performance
// and reduce unnecessary API calls

interface CachedSuggestion {
  key: string;
  suggestions: string[];
  timestamp: number;
  source: "ai" | "fallback";
}

// Cache expiration time in milliseconds (3 hours)
const CACHE_EXPIRATION = 3 * 60 * 60 * 1000;

// Create a normalized cache key from input text
export const createCacheKey = (input: string): string => {
  // Normalize the input by:
  // 1. Converting to lowercase
  // 2. Removing extra spaces
  // 3. Removing common filler words
  // 4. Sorting words to help with minor reorderings

  const normalized = input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(
      (word) =>
        ![
          "a",
          "an",
          "the",
          "and",
          "or",
          "but",
          "for",
          "with",
          "in",
          "on",
          "at",
          "to",
          "of",
        ].includes(word)
    )
    .sort()
    .join(" ");

  return normalized;
};

// Store suggestions in cache
export const cacheSuggestions = (
  input: string,
  suggestions: string[],
  source: "ai" | "fallback" = "ai"
): void => {
  try {
    const cacheKey = createCacheKey(input);

    // Get existing cache
    const existingCache = localStorage.getItem("designetica_suggestion_cache");
    const cache: Record<string, CachedSuggestion> = existingCache
      ? JSON.parse(existingCache)
      : {};

    // Add new entry
    cache[cacheKey] = {
      key: cacheKey,
      suggestions,
      timestamp: Date.now(),
      source,
    };

    // Clean up expired entries
    const cleanedCache = Object.fromEntries(
      Object.entries(cache).filter(
        ([, value]) => Date.now() - value.timestamp < CACHE_EXPIRATION
      )
    );

    // Store back to localStorage
    localStorage.setItem(
      "designetica_suggestion_cache",
      JSON.stringify(cleanedCache)
    );
    console.log(`📦 Cached ${suggestions.length} suggestions for "${input}"`);
  } catch (error) {
    console.error("Failed to cache suggestions:", error);
  }
};

// Get cached suggestions if available
export const getCachedSuggestions = (
  input: string
): { suggestions: string[]; source: "ai" | "fallback" } | null => {
  try {
    const cacheKey = createCacheKey(input);

    // Get existing cache
    const existingCache = localStorage.getItem("designetica_suggestion_cache");
    if (!existingCache) return null;

    const cache: Record<string, CachedSuggestion> = JSON.parse(existingCache);
    const cachedItem = cache[cacheKey];

    // Check if cached item exists and is not expired
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_EXPIRATION) {
      console.log(`🔍 Cache hit for "${input}"`);
      return {
        suggestions: cachedItem.suggestions,
        source: cachedItem.source,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to retrieve cached suggestions:", error);
    return null;
  }
};

// Clear all cached suggestions
export const clearSuggestionCache = (): void => {
  localStorage.removeItem("designetica_suggestion_cache");
  console.log("🧹 Suggestion cache cleared");
};

// Get cache statistics
export const getCacheStats = (): {
  count: number;
  aiCount: number;
  fallbackCount: number;
  oldestTimestamp: number | null;
} => {
  try {
    const existingCache = localStorage.getItem("designetica_suggestion_cache");
    if (!existingCache) {
      return { count: 0, aiCount: 0, fallbackCount: 0, oldestTimestamp: null };
    }

    const cache: Record<string, CachedSuggestion> = JSON.parse(existingCache);
    const entries = Object.values(cache);

    return {
      count: entries.length,
      aiCount: entries.filter((item) => item.source === "ai").length,
      fallbackCount: entries.filter((item) => item.source === "fallback")
        .length,
      oldestTimestamp:
        entries.length > 0
          ? Math.min(...entries.map((item) => item.timestamp))
          : null,
    };
  } catch (error) {
    console.error("Failed to get cache stats:", error);
    return { count: 0, aiCount: 0, fallbackCount: 0, oldestTimestamp: null };
  }
};
