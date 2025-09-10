const CACHE_KEY = "wireframe_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const getCachedWireframe = (description: string) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const cached = cache[description];

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  } catch (error) {
    console.error("Error reading cache:", error);
  }
  return null;
};

export const setCachedWireframe = (description: string, data: any) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    cache[description] = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
};
