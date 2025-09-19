// Runtime safety layer to prevent accidental localhost calls in production
// Injected early in app startup (import in main.tsx) to sanitize fetch targets.

const PROD_BACKEND =
  "https://func-designetica-5gwyjxbwvr4s6.azurewebsites.net";

function isLocalhostHost(hostname: string) {
  return (
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
  );
}

(function installProductionFetchGuard() {
  if (typeof window === "undefined") return;
  if (isLocalhostHost(window.location.hostname)) return; // allow during local dev

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      let url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : (input as any).url;
      if (typeof url === "string" && url.includes("localhost:5001")) {
        const rewritten = url.replace(
          /https?:\/\/localhost:5001/gi,
          PROD_BACKEND
        );
        console.warn(
          "[ProductionSafety] Rewriting localhost:5001 ->",
          PROD_BACKEND,
          "\n Original:",
          url,
          "\n New:",
          rewritten
        );
        input = rewritten;
      }
    } catch (e) {
      console.warn("[ProductionSafety] Fetch guard inspection failed:", e);
    }
    return originalFetch(input as any, init);
  };

  // Also patch XMLHttpRequest as a defensive measure
  const OriginalXHR = window.XMLHttpRequest;
  class SafeXHR extends OriginalXHR {
    open(
      method: string,
      url: string,
      async?: boolean,
      user?: string,
      password?: string
    ) {
      if (
        url &&
        url.includes("localhost:5001") &&
        !isLocalhostHost(window.location.hostname)
      ) {
        const newUrl = url.replace(/https?:\/\/localhost:5001/gi, PROD_BACKEND);
        console.warn(
          "[ProductionSafety][XHR] Rewriting localhost:5001 ->",
          PROD_BACKEND,
          "\n Original:",
          url,
          "\n New:",
          newUrl
        );
        return super.open(
          method,
          newUrl,
          async ?? true,
          user as any,
          password as any
        );
      }
      return super.open(
        method,
        url,
        async ?? true,
        user as any,
        password as any
      );
    }
  }
  (window as any).XMLHttpRequest = SafeXHR;
})();
