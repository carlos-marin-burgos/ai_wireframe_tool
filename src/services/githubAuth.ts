// Frontend helper for GitHub OAuth (development)
// Opens popup to backend start endpoint and waits for postMessage from callback

export interface GitHubAuthResult {
  status: "success" | "error";
  token?: string;
  tokenType?: string;
  scope?: string;
  login?: string | null;
  error?: string;
}

const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:7072";

export function startGitHubAuth(): Promise<GitHubAuthResult> {
  return new Promise((resolve) => {
    const url = `${BACKEND_BASE}/api/github/auth/start`;
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      url,
      "github_auth",
      `width=${width},height=${height},left=${left},top=${top}`
    );
    if (!popup) {
      resolve({ status: "error", error: "Popup blocked" });
      return;
    }

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener("message", onMessage);
        resolve({ status: "error", error: "Popup closed" });
      }
    }, 500);

    function onMessage(e: MessageEvent) {
      const data = e.data;
      if (!data || data.source !== "github-auth") return;
      clearInterval(timer);
      window.removeEventListener("message", onMessage);
      try {
        popup.close();
      } catch {}
      resolve(data as GitHubAuthResult);
    }

    window.addEventListener("message", onMessage);
  });
}
