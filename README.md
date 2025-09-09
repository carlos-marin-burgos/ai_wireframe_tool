# SnapFrame AI Wireframe Generator

> **🏢 Microsoft Transfer Ready** - This repository has been prepared for transfer to Microsoft internal accounts. See `MICROSOFT_TRANSFER_PACKAGE.md` for complete handoff documentation.

A professional AI-powered wireframing tool that transforms natural language descriptions into functional wireframes using Microsoft Atlas Design system and Azure OpenAI.

**Updated: August 8, 2025** - Fixed deployment configuration for correct Static Web App endpoint.

## 🚀 Features

### Core Capabilities

- **AI Wireframe Generation**: Transform text descriptions into professional wireframes
- **Microsoft Atlas Design Integration**: Pre-built components following Microsoft design standards
- **Real-time Collaboration**: Multi-user editing and suggestions
- **Component Library**: Comprehensive collection of forms, buttons, navigation, and layout components
- **Presentation Mode**: Professional wireframe presentations with navigation
- **Export Options**: HTML, PowerPoint, and Figma integration

### Technical Features

- **Azure OpenAI Integration**: GPT-4 powered intelligent wireframe generation
- **Responsive Design**: Mobile-first approach with modern CSS
- **TypeScript**: Full type safety throughout the application
- **Hot Module Replacement**: Fast development with Vite
- **Azure Functions Backend**: Serverless scalable architecture

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Azure OpenAI resource (for AI features)
- Azure Functions Core Tools (for backend development)

### 1. Clone and Install

```bash
git clone <repository-url>
cd designetica
npm install
cd backend && npm install && cd ..
```

### 2. Configure Azure OpenAI

```bash
# Copy configuration template
cp backend/local.settings.json.example backend/local.settings.json

# Edit with your Azure OpenAI credentials
# - AZURE_OPENAI_KEY
# - AZURE_OPENAI_ENDPOINT
# - AZURE_OPENAI_DEPLOYMENT
```

### 3. Start Development Environment

```bash
# Start both frontend and backend
npm run dev:full

# Or start individually:
npm run dev              # Frontend only (localhost:5173)
cd backend && func start # Backend only (localhost:7072)
```

## 📁 Project Structure

```
designetica/
├── src/                          # Frontend React app
│   ├── components/              # React components
│   │   ├── ComponentLibraryModal.tsx

│   │   ├── PresentationMode.tsx
│   │   └── SplitLayout.tsx
│   ├── services/               # API services
│   └── config.ts              # Configuration
├── backend/                    # Azure Functions
│   ├── generateWireframe/     # AI wireframe generation
│   ├── generateSuggestions/   # AI suggestions
│   ├── get-template/         # Component templates
│   └── health/              # Health check
├── infra/                    # Infrastructure as Code
└── public/                  # Static assets
```

## 🔧 Development

### Available Scripts

```bash
npm run dev              # Start frontend development server
npm run dev:full         # Start frontend + backend
npm run build           # Build for production
npm run preview         # Preview production build
npm test               # Run tests
```

### Backend Development

```bash
cd backend
func start --port 7072  # Start Azure Functions locally
func new               # Create new function
```

### Troubleshooting

If changes aren't reflecting in the browser:

```bash
npm run dev:clean       # Clean build and restart
```

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)

- **Port**: http://localhost:5173
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: CSS Modules with Microsoft Atlas design tokens
- **State Management**: React hooks and context

### Backend (Azure Functions + Node.js)

- **Port**: http://localhost:7072
- **Runtime**: Node.js 18
- **Framework**: Azure Functions v4
- **AI Integration**: Azure OpenAI GPT-4

#### API Endpoints

- `POST /api/generate-wireframe` - Generate HTML wireframes from descriptions
- `POST /api/generate-suggestions` - Get AI-powered improvement suggestions
- `POST /api/get-template` - Retrieve component templates
- `GET /api/health` - Health check endpoint

## 🚀 Deployment

### Azure Static Web Apps (Recommended)

```bash
# Deploy using Azure CLI
az staticwebapp create \
  --name my-wireframe-app \
  --source https://github.com/your-org/ai_wireframe_tool \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --api-location "backend" \
  --output-location "dist"
```

### Manual Deployment

1. Build the application: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Deploy Azure Functions from `backend/` folder
4. Configure environment variables

See `DEPLOYMENT_CONFIGURATION_GUIDE.md` for detailed deployment instructions.

## 🔐 Security

- All sensitive credentials removed from repository
- Environment variables used for configuration
- CORS properly configured for production
- Input validation on all endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📋 Requirements

### Development

- Node.js 18+
- Azure Functions Core Tools 4.x
- Azure OpenAI resource

### Production

- Azure subscription
- Azure OpenAI service
- Azure Static Web Apps or App Service

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions about setup, architecture, or deployment:

- Review the `MICROSOFT_TRANSFER_GUIDE.md` for transfer-specific instructions
- Check the `DEPLOYMENT_CONFIGURATION_GUIDE.md` for deployment help
- Original author: Carlos Marin Burgos
# Force rebuild Fri Aug  8 10:18:56 PDT 2025
