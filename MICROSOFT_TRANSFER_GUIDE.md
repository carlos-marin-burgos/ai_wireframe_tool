# Microsoft Transfer - Setup Guide

## 🚨 Security Notice
This repository has been cleaned of all sensitive credentials before transfer. The original Azure OpenAI credentials have been removed from git history.

## Required Setup After Transfer

### 1. Azure OpenAI Configuration
You'll need to create your own Azure OpenAI resource and configure the following:

```bash
# Copy the example configuration
cp backend/local.settings.json.example backend/local.settings.json
```

Then update `backend/local.settings.json` with your values:
- `AZURE_OPENAI_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint URL  
- `AZURE_OPENAI_DEPLOYMENT`: Your GPT-4 deployment name

### 2. Development Environment Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies  
cd backend
npm install

# Start development environment
npm run dev:full
```

### 3. Architecture Overview

**Frontend (React + TypeScript + Vite)**
- Port: http://localhost:5173
- Modern React with TypeScript
- Vite for fast development and building
- Responsive design with CSS modules

**Backend (Azure Functions + Node.js)**
- Port: http://localhost:7072
- Four main endpoints:
  - `/api/generate-wireframe` - Generate HTML wireframes
  - `/api/generate-suggestions` - AI-powered suggestions
  - `/api/get-template` - Component templates
  - `/api/health` - Health check

### 4. Key Features
- **AI Wireframe Generation**: Create wireframes from natural language descriptions
- **Component Library**: Pre-built Atlas design system components
- **Real-time Collaboration**: Multi-user editing capabilities
- **Presentation Mode**: Professional wireframe presentations
- **Export Options**: HTML, PowerPoint, and Figma integration

### 5. Deployment Options
- **Azure Static Web Apps** (Recommended)
- **Azure App Service**
- **Azure Container Instances**

See `DEPLOYMENT_CONFIGURATION_GUIDE.md` for detailed deployment instructions.

## Next Steps for Microsoft Team
1. Set up Azure OpenAI resource
2. Configure environment variables
3. Test development environment
4. Review deployment options
5. Configure CI/CD pipeline

## Contact
Original author: Carlos Marin Burgos
For questions about the codebase architecture and design decisions.
