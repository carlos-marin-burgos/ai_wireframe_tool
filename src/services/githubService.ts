// GitHub Integration Service
export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email?: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  private: boolean;
  default_branch: string;
}

class GitHubService {
  private clientId: string;
  private redirectUri: string;
  private scope: string;

  constructor() {
    // In production, these should come from environment variables
    this.clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "demo-client-id";
    this.redirectUri =
      import.meta.env.VITE_GITHUB_REDIRECT_URI ||
      `${window.location.origin}/auth/github/callback`;
    this.scope = "repo user:email";
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("github_access_token");
  }

  // Get stored user info
  getCurrentUser(): GitHubUser | null {
    const userStr = localStorage.getItem("github_user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Start OAuth flow
  initiateLogin(): void {
    console.log("🚀 Initiating GitHub OAuth flow...");

    // For demo purposes, we'll simulate the OAuth flow
    if (import.meta.env.DEV) {
      // Development mode - simulate successful login
      this.simulateLogin();
    } else {
      // Production mode - redirect to GitHub OAuth
      const authUrl = new URL("https://github.com/login/oauth/authorize");
      authUrl.searchParams.append("client_id", this.clientId);
      authUrl.searchParams.append("redirect_uri", this.redirectUri);
      authUrl.searchParams.append("scope", this.scope);
      authUrl.searchParams.append("state", this.generateState());

      window.location.href = authUrl.toString();
    }
  }

  // Simulate login for development
  private simulateLogin(): void {
    const mockUser: GitHubUser = {
      id: 12345,
      login: "wireframe-user",
      name: "AI Wireframe Developer",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4",
      email: "developer@wireframe.dev",
    };

    const mockToken = "demo-github-token-" + Date.now();

    localStorage.setItem("github_access_token", mockToken);
    localStorage.setItem("github_user", JSON.stringify(mockUser));

    console.log("✅ GitHub login simulated successfully");

    // Trigger a custom event to notify components
    window.dispatchEvent(
      new CustomEvent("github-auth-success", {
        detail: { user: mockUser },
      })
    );
  }

  // Handle OAuth callback (in production)
  async handleCallback(code: string): Promise<GitHubUser> {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch("/api/github/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const { access_token } = await tokenResponse.json();
      localStorage.setItem("github_access_token", access_token);

      // Get user info
      const user = await this.fetchUser();
      localStorage.setItem("github_user", JSON.stringify(user));

      return user;
    } catch (error) {
      console.error("GitHub OAuth error:", error);
      throw error;
    }
  }

  // Fetch user repositories
  async fetchRepositories(): Promise<GitHubRepository[]> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated with GitHub");
    }

    if (import.meta.env.DEV) {
      // Return mock repositories in development
      return this.getMockRepositories();
    }

    const token = localStorage.getItem("github_access_token");

    try {
      const response = await fetch(
        "https://api.github.com/user/repos?sort=updated&per_page=50",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching repositories:", error);
      throw error;
    }
  }

  // Fetch user info
  private async fetchUser(): Promise<GitHubUser> {
    const token = localStorage.getItem("github_access_token");

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return await response.json();
  }

  // Mock repositories for development
  private getMockRepositories(): GitHubRepository[] {
    return [
      {
        id: 1,
        name: "ai-wireframe-tool",
        full_name: "wireframe-user/ai-wireframe-tool",
        description: "AI-powered wireframe generation tool",
        html_url: "https://github.com/wireframe-user/ai-wireframe-tool",
        private: false,
        default_branch: "main",
      },
      {
        id: 2,
        name: "react-components",
        full_name: "wireframe-user/react-components",
        description: "Reusable React component library",
        html_url: "https://github.com/wireframe-user/react-components",
        private: true,
        default_branch: "main",
      },
      {
        id: 3,
        name: "design-system",
        full_name: "wireframe-user/design-system",
        description: "Company design system and UI kit",
        html_url: "https://github.com/wireframe-user/design-system",
        private: false,
        default_branch: "develop",
      },
    ];
  }

  // Logout
  logout(): void {
    localStorage.removeItem("github_access_token");
    localStorage.removeItem("github_user");

    console.log("🔓 Logged out from GitHub");

    // Trigger logout event
    window.dispatchEvent(new CustomEvent("github-auth-logout"));
  }

  // Generate state parameter for OAuth
  private generateState(): string {
    return btoa(
      Math.random().toString(36).substring(2) + Date.now().toString(36)
    );
  }

  // Save wireframe to GitHub (placeholder)
  async saveWireframe(repoId: number, wireframeData: any): Promise<void> {
    console.log(
      "💾 Saving wireframe to GitHub repository:",
      repoId,
      wireframeData
    );
    // Implementation would create/update files in the repository
    throw new Error("Wireframe saving not yet implemented");
  }

  // Import wireframes from GitHub (placeholder)
  async importWireframes(repoId: number): Promise<any[]> {
    console.log("📥 Importing wireframes from GitHub repository:", repoId);
    // Implementation would scan repository for wireframe files
    return [];
  }
}

export const githubService = new GitHubService();
