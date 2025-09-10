/**
 * Design Version Management
 * This file tracks the current design version and prevents regressions
 */

export const CURRENT_DESIGN_VERSION = "2025.07.17-modern-white";

export const designVersions = {
  "2025.07.17-modern-white": {
    name: "Modern White Background Design",
    description:
      "Current modern design with clean white background, no navbar, clean footer",
    primaryGradient: "none",
    backgroundColor: "#ffffff",
    backgroundGradient: "none",
    components: {
      navbar: "none", // No navbar in modern design
      footer: "clean-minimal",
      landingPage: "modern-white",
      suggestions: "purple-pills",
    },
  },
  "2025.07.16-blue-teal": {
    name: "Blue-Teal Gradient (Deprecated)",
    description: "Old blue to teal gradient design - DO NOT USE",
    primaryGradient: "DEPRECATED",
    status: "DEPRECATED",
  },
  "2025.07.17-purple": {
    name: "Purple Gradient (Deprecated)",
    description: "Purple gradient design - DO NOT USE, should be white",
    primaryGradient: "DEPRECATED",
    status: "DEPRECATED",
  },
};

/**
 * Validate that the current design matches the expected version
 */
export function validateDesignVersion(): boolean {
  const currentVersion = designVersions[CURRENT_DESIGN_VERSION];
  if (!currentVersion) {
    console.error(`Design version ${CURRENT_DESIGN_VERSION} not found!`);
    return false;
  }

  if ((currentVersion as any).status === "DEPRECATED") {
    console.error(
      `Current design version ${CURRENT_DESIGN_VERSION} is deprecated!`
    );
    return false;
  }

  return true;
}
