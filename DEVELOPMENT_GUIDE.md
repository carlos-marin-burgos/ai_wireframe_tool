# Development Environment Management

This project includes a comprehensive development environment management system to prevent configuration issues and ensure reliable AI wireframe generation.

## Quick Start

```bash
# Start development environment (recommended)
./scripts/start-dev.sh

# Stop development environment
./scripts/stop-dev.sh

# Check system health
./scripts/health-check.sh
```

## Port Configuration

All ports are centrally managed in `config/ports.json`:

- **Frontend**: 5173 (Vite dev server)
- **Primary Backend**: 7071 (Azure Functions with AI)
- **Emergency Backend**: 7072 (Fallback only, should not be used)

## Architecture

### Frontend (Port 5173)

- **Technology**: React + TypeScript + Vite
- **Configuration**: `vite.config.ts` with proxy to backend
- **API Client**: `src/config/api.ts` with automatic backend detection

### Backend (Port 7071)

- **Technology**: Azure Functions (Node.js)
- **AI Integration**: Azure OpenAI GPT-4o for wireframe generation
- **Health Endpoint**: `/api/health` for system verification

### AI Wireframe Generation

- **Endpoint**: `POST /api/generate-html-wireframe`
- **Features**: Context-aware wireframes based on user descriptions
- **Validation**: Automatic AI capability testing during startup

## Prevention System

### Automated Health Checks

The `scripts/health-check.sh` script verifies:

- ✅ Port availability and conflicts
- ✅ Service responsiveness
- ✅ AI functionality and configuration
- ✅ Frontend-backend connectivity

### Configuration Management

- **Centralized Ports**: `config/ports.json`
- **API Configuration**: `src/config/api.ts` with auto-detection
- **Environment Detection**: Automatic working backend discovery

### Development Scripts

- **start-dev.sh**: Intelligent startup with health verification
- **stop-dev.sh**: Clean shutdown of all services
- **health-check.sh**: Comprehensive system diagnostics

## Troubleshooting

### AI Not Working

1. Run health check: `./scripts/health-check.sh`
2. Verify Azure OpenAI configuration in `backend/.env`
3. Check backend logs for API key issues

### Frontend Can't Connect

1. Verify backend is running on port 7071
2. Check `vite.config.ts` proxy configuration
3. Ensure `src/config/api.ts` BASE_URL is correct

### Port Conflicts

1. Stop all services: `./scripts/stop-dev.sh`
2. Check for conflicting processes: `lsof -i :7071`
3. Restart with clean environment: `./scripts/start-dev.sh`

## Development Workflow

1. **Start**: Always use `./scripts/start-dev.sh`
2. **Develop**: Frontend automatically proxies API calls to backend
3. **Test AI**: Use the wireframe generator in the web interface
4. **Monitor**: Health checks run automatically during startup
5. **Stop**: Use `./scripts/stop-dev.sh` for clean shutdown

## Configuration Files

### Critical Files

- `vite.config.ts`: Frontend dev server and API proxy
- `src/config/api.ts`: API client configuration
- `config/ports.json`: Port assignments
- `backend/host.json`: Azure Functions configuration

### Environment Files

- `backend/.env`: Azure OpenAI API keys and configuration
- `backend/local.settings.json`: Local Azure Functions settings

## Best Practices

1. **Always use provided scripts** instead of manual commands
2. **Run health checks** before reporting issues
3. **Keep ports consistent** with `config/ports.json`
4. **Monitor AI functionality** through automated tests
5. **Use centralized configuration** to prevent conflicts

This system ensures reliable AI wireframe generation and prevents the configuration issues that can break the development environment.
