#!/bin/bash

# 🎯 Pattern Analyzer - Project Setup Script
# This script creates a complete standalone Pattern Analyzer app

set -e  # Exit on any error

echo "🚀 Creating Pattern Analyzer project..."
echo ""

# Navigate to parent directory (outside designetica)
cd ..

# Create project directory
PROJECT_DIR="pattern-analyzer"
if [ -d "$PROJECT_DIR" ]; then
  echo "⚠️  Directory $PROJECT_DIR already exists!"
  read -p "Do you want to delete it and start fresh? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$PROJECT_DIR"
    echo "✅ Removed existing directory"
  else
    echo "❌ Aborting..."
    exit 1
  fi
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "📁 Created project directory: $(pwd)"
echo ""

# Create main project structure
echo "📦 Creating project structure..."

mkdir -p frontend/src/{components,services,types,hooks,utils,pages,assets}
mkdir -p frontend/src/components/{Dashboard,Analysis,PatternLibrary,Comparison,Shared}
mkdir -p frontend/public
mkdir -p backend/{analyzeWebsite,shared}
mkdir -p backend/shared/patterns
mkdir -p docs

echo "✅ Project structure created"
echo ""

# Create Frontend package.json
echo "📝 Creating frontend configuration..."
cat > frontend/package.json << 'EOF'
{
  "name": "pattern-analyzer-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-icons": "^4.12.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF

# Create Backend package.json
echo "📝 Creating backend configuration..."
cat > backend/package.json << 'EOF'
{
  "name": "pattern-analyzer-backend",
  "version": "1.0.0",
  "description": "Pattern Analyzer Backend - Azure Functions",
  "scripts": {
    "start": "func start",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "puppeteer": "^21.6.0",
    "cheerio": "^1.0.0-rc.12"
  },
  "devDependencies": {
    "@azure/functions": "^4.0.0",
    "azure-functions-core-tools": "^4.0.5000"
  }
}
EOF

# Create TypeScript config for frontend
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

cat > frontend/tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# Create Vite config
cat > frontend/vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true
      }
    }
  }
})
EOF

# Create Tailwind config
cat > frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      }
    },
  },
  plugins: [],
}
EOF

# Create PostCSS config
cat > frontend/postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create backend host.json
cat > backend/host.json << 'EOF'
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "maxTelemetryItemsPerSecond": 20
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
EOF

# Create backend local.settings.json
cat > backend/local.settings.json << 'EOF'
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development"
  },
  "Host": {
    "CORS": "*",
    "CORSCredentials": false
  }
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
*.log

# Azure Functions
backend/bin/
backend/obj/
backend/.azurefunctions/
backend/.python_packages/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
Thumbs.db
EOF

# Create README
cat > README.md << 'EOF'
# 🔍 Pattern Analyzer

A web application that analyzes websites to detect UX patterns and provides design insights.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Azure Functions Core Tools
- npm or yarn

### Installation

1. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

### Running Locally

1. **Start Backend (Terminal 1)**
   ```bash
   cd backend
   npm start
   # Runs on http://localhost:7071
   ```

2. **Start Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm run dev
   # Runs on http://localhost:3000
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
pattern-analyzer/
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                # Azure Functions
│   ├── analyzeWebsite/     # Main analysis function
│   ├── shared/             # Shared code
│   └── package.json
└── docs/                   # Documentation
```

## 🎯 Features

- ✅ URL Analysis
- ✅ Pattern Detection (10+ patterns)
- ✅ Design Quality Scoring
- ✅ Contextual Suggestions
- ✅ PDF Export
- ✅ Responsive Design

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts

**Backend:**
- Azure Functions
- Node.js
- Puppeteer
- Cheerio

## 📝 Development

### Adding New Patterns

1. Create pattern detector in `backend/shared/patterns/`
2. Add pattern type to `frontend/src/types/pattern.ts`
3. Update pattern detection logic in `backend/analyzeWebsite/`

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
func azure functionapp publish <function-app-name>
```

## 🚀 Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## 📄 License

MIT

## 👤 Author

Carlos Marin Burgos
EOF

# Create initial frontend index.html
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pattern Analyzer - Analyze UX Patterns</title>
    <meta name="description" content="Analyze any website to detect UX patterns and get design insights">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Create basic CSS
cat > frontend/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}
EOF

echo "✅ Configuration files created"
echo ""

# Create setup completion message
cat > NEXT_STEPS.md << 'EOF'
# 🎉 Pattern Analyzer Project Created!

## 📍 Location
Your new project is at: `pattern-analyzer/`

## 🚀 Next Steps

### 1. Open the Project in VS Code
```bash
cd pattern-analyzer
code .
```

### 2. Install Dependencies

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
```

### 3. Copy Pattern Detection Code

The backend needs the pattern detection code from Designetica. 
Copy these files:
- `designetica/backend/websiteAnalyzer/detectPatterns.js`
- `designetica/backend/websiteAnalyzer/generateSuggestions.js`

To: `pattern-analyzer/backend/shared/`

### 4. Run the App

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open Browser
Navigate to `http://localhost:3000`

## 📋 What's Been Created

✅ Complete project structure
✅ TypeScript configuration
✅ Vite + React setup
✅ Tailwind CSS
✅ Azure Functions backend
✅ Package.json files
✅ Git configuration

## 🔧 TODO: Code to Write

The structure is ready, but you need to create:

1. **Frontend Components** (React + TypeScript)
   - Dashboard with URL input
   - Analysis results page
   - Pattern cards
   - Visualizations

2. **Backend Function** (Node.js)
   - Copy pattern detection from Designetica
   - Create API endpoints
   - Add error handling

3. **Types** (TypeScript)
   - Pattern interfaces
   - Analysis response types
   - Component props

## 💡 Want Me to Generate the Code?

Once you:
1. Open the project in VS Code
2. Run `npm install` in both folders

I can generate all the frontend and backend code! Just say:
"Generate Pattern Analyzer code"

## 🎯 Quick Start Command

```bash
cd pattern-analyzer && code .
```

Then come back and I'll help you build it! 🚀
EOF

echo "✅ Project structure created successfully!"
echo ""
echo "📁 Location: $(pwd)"
echo ""
echo "📖 Read NEXT_STEPS.md for instructions"
echo ""
echo "🚀 Quick start:"
echo "   cd pattern-analyzer"
echo "   code ."
echo ""
echo "✨ Happy coding!"
