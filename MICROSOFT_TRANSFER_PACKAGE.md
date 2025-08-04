# 🚀 Microsoft Transfer Package

## Repository Information

- **Current Owner**: carlos-marin-burgos
- **Repository**: ai_wireframe_tool
- **Current URL**: https://github.com/carlos-marin-burgos/ai_wireframe_tool
- **Transfer Date**: August 3, 2025

## 📋 Pre-Transfer Checklist

### ✅ Security & Credentials

- [x] Sensitive Azure OpenAI credentials removed/sanitized
- [x] `.gitignore` properly configured for sensitive files
- [x] No hardcoded secrets in codebase
- [x] Local settings files marked as templates

### ✅ Code Quality

- [x] TypeScript compilation errors resolved
- [x] All major functionality working
- [x] Development environment tested
- [x] Dependencies up to date

### ✅ Documentation

- [x] README.md updated and comprehensive
- [x] Setup instructions provided
- [x] API documentation included
- [x] Transfer guide created

## 🏗️ Project Overview

**AI Wireframe Tool** - An intelligent wireframing platform that combines Microsoft Atlas design system with Azure OpenAI for rapid prototyping.

### Key Features

- **AI-Powered Generation**: Uses Azure OpenAI GPT-4o for intelligent wireframe creation
- **Microsoft Atlas Integration**: Built-in component library using Microsoft design tokens
- **Real-time Collaboration**: Interactive wireframe editing and preview
- **Export Capabilities**: PowerPoint, HTML, and Figma integration
- **Presentation Mode**: Professional presentation interface for team demos

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Azure Functions (Node.js)
- **AI**: Azure OpenAI Service (GPT-4o)
- **Design**: Microsoft Atlas Design System
- **Deployment**: Azure Static Web Apps + Azure Functions

## 🚀 Quick Start (Post-Transfer)

### 1. Azure OpenAI Setup

```bash
# Navigate to backend directory
cd backend

# Copy and configure settings
cp local.settings.json.template local.settings.json
```

Required Azure services:

- Azure OpenAI Service with GPT-4o deployment
- Azure Functions (for backend API)
- Azure Static Web Apps (optional, for hosting)

### 2. Environment Configuration

Update `backend/local.settings.json`:

```json
{
  "Values": {
    "AZURE_OPENAI_KEY": "your-actual-azure-openai-key",
    "AZURE_OPENAI_ENDPOINT": "https://your-resource-name.openai.azure.com/",
    "AZURE_OPENAI_DEPLOYMENT": "your-gpt-4o-deployment-name"
  }
}
```

### 3. Development Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Start development environment
npm run dev:full
```

## 📁 Project Structure

```
ai_wireframe_tool/
├── src/                    # React frontend application
│   ├── components/         # React components
│   ├── services/          # API and service layers
│   └── styles/            # CSS and styling
├── backend/               # Azure Functions backend
│   ├── generateWireframe/ # AI wireframe generation
│   ├── generateSuggestions/ # AI suggestions API
│   └── health/            # Health check endpoint
├── infra/                 # Infrastructure as Code (Bicep)
├── public/                # Static assets
└── docs/                  # Additional documentation
```

## 🔧 Key Configuration Files

- `azure.yaml` - Azure Developer CLI configuration
- `staticwebapp.config.json` - Azure Static Web Apps config
- `vite.config.ts` - Frontend build configuration
- `backend/host.json` - Azure Functions configuration
- `backend/local.settings.json` - Local development settings (not in repo)

## 🎯 Current Status

### ✅ Working Features

- AI wireframe generation with Azure OpenAI
- Component library with Microsoft Atlas components
- Real-time wireframe editing and preview
- PowerPoint export functionality
- HTML code viewer and export
- Figma integration (basic)
- Health monitoring and error handling

### 🔧 In Progress / Known Issues

- Component Library Modal: Click handler debugging
- Presentation Mode: User experience improvements needed
- Advanced Figma integration features

## 🤝 Handoff Notes

### Development Environment

- Node.js 18+ required
- Azure Functions Core Tools v4 required
- Vite dev server runs on port 5173
- Azure Functions backend runs on port 7072

### Key Dependencies

- `@azure/openai` - Azure OpenAI SDK
- `react` + `typescript` - Frontend framework
- `@azure/functions` - Backend functions framework
- `vite` - Build tool and dev server

### Testing

- Run `npm run dev:full` to start complete development environment
- Access frontend at `http://localhost:5173`
- Backend APIs available at `http://localhost:7072/api/`

## 📞 Support Information

### Original Developer

- **GitHub**: @carlosUX
- **Contact**: Available for transition questions

### Documentation

- Complete setup guide in `README.md`
- API documentation in `backend/API_REFERENCE.md`
- Deployment guide in `DEPLOYMENT_OPTIMIZATION.md`

---

**Ready for Microsoft Transfer** ✅

This repository has been prepared and sanitized for transfer to Microsoft internal accounts.
All sensitive credentials have been removed and replaced with template placeholders.
