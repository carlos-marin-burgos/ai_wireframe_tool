/**
 * Test data and utilities for Figma integration testing
 */

export interface TestFigmaFile {
  name: string;
  url: string;
  description: string;
  isPublic: boolean;
}

/**
 * Public Figma files that can be used for testing
 * Note: These are actual public community files that can be accessed
 */
export const testFigmaFiles: TestFigmaFile[] = [
  {
    name: "Wireframe Kit by Figma",
    url: "https://www.figma.com/file/fKYVvgOyTKhJRGVOWLJWFK/Wireframe-Kit-(Community)",
    description: "Official Figma wireframe kit with common UI patterns",
    isPublic: true,
  },
  {
    name: "Landing Page Wireframes",
    url: "https://www.figma.com/file/8qNcDzOXLj1hFtjHOW8OOc/Landing-Page-Wireframes-(Community)",
    description: "Collection of landing page wireframe templates",
    isPublic: true,
  },
  {
    name: "Mobile App Wireframes",
    url: "https://www.figma.com/file/2VjGvMnKP0FQY4W9TQAjhJ/Mobile-App-Wireframes-(Community)",
    description: "Mobile app wireframe templates and components",
    isPublic: true,
  },
];

/**
 * Demo access token for testing (this would be replaced with actual token)
 */
export const demoInstructions = {
  getAccessToken: `
To get a Figma access token:
1. Go to https://www.figma.com/developers/api#access-tokens
2. Click "Create new personal access token"
3. Name it "Wireframe Tool Test"
4. Copy the generated token
5. Paste it into the integration modal
  `,

  testWithPublicFile: `
For testing without a personal token, try using public Figma community files:
1. Browse Figma Community: https://www.figma.com/community
2. Find a public wireframe or design file
3. Copy the file URL (should start with https://www.figma.com/file/)
4. Use it in the integration modal
  `,
};

/**
 * Extract file key from Figma URL
 */
export function extractFigmaFileKey(url: string): string | null {
  const match = url.match(/\/file\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Validate Figma URL format
 */
export function isValidFigmaUrl(url: string): boolean {
  const figmaUrlPattern = /^https:\/\/www\.figma\.com\/file\/[a-zA-Z0-9]+\/.*$/;
  return figmaUrlPattern.test(url);
}

/**
 * Create a test Figma file URL for demo purposes
 */
export function createTestFigmaUrl(): string {
  // Return the official Figma wireframe kit
  return "https://www.figma.com/file/fKYVvgOyTKhJRGVOWLJWFK/Wireframe-Kit-(Community)";
}
