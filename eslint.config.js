import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.yarn/**",
      "**/.git/**",
      "**/.git-rewrite/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/src_backup*/**",
      "**/src-backup*/**",
      "**/backup/**",
      "**/assets/**", // Build assets
      "**/*backup*/**", // Any backup directories
      "**/*.backup.*", // Backup files
      "**/components/backup-*/**", // Backup component folders
      ".vite",
      ".next",
      "tmp",
      "temp",
      "*.config.tsbuildinfo",
      "scripts/**/templates/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  // Backend files - more relaxed rules for CommonJS/Node.js files
  {
    files: ["backend/**/*.{js,mjs}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off", // Backend has dynamic requires and global variables
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
    languageOptions: {
      globals: {
        ...globals.node,
        // Add common backend globals
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        exports: "readonly",
        require: "readonly",
        global: "readonly",
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "none",
          caughtErrors: "none",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "no-case-declarations": "warn",
      "prefer-const": "warn",
      "no-empty": "warn",
      "no-constant-binary-expression": "warn",
      "no-control-regex": "warn",
      "no-useless-escape": "warn",
    },
  }
);
