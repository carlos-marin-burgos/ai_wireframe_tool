# Designetica Development Scripts

This directory contains automated scripts to manage the development environment for Designetica.

## 🚀 Quick Start

### Start Development Environment

```bash
./start-dev.sh
```

This will:

- ✅ Check if services are already running
- ✅ Start Azure Functions backend on port 7071
- ✅ Start Vite frontend on port 5173
- ✅ Wait for both services to be healthy
- ✅ Show you the URLs and log locations

### Stop Development Environment

```bash
./stop-dev.sh
```

This will:

- 🛑 Stop Azure Functions backend
- 🛑 Stop Vite frontend
- 🛑 Clean up PID files
- 🛑 Kill any processes still using ports 7071 or 5173

### Health Check

```bash
./health-check.sh
```

This will:

- 🔍 Check if both services are responding
- 🔄 Automatically restart any failed services
- ✅ Report the health status

## 📋 VS Code Tasks

You can run these scripts directly from VS Code:

1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Tasks: Run Task"
3. Choose one of:
   - **🚀 Start All Services (Auto)** - Start everything
   - **🛑 Stop All Services** - Stop everything
   - **🔍 Health Check (Monitor Services)** - Check health and restart if needed

Or use the keyboard shortcut:

- `Cmd+Shift+B` (macOS) or `Ctrl+Shift+B` (Windows/Linux) to run the default build task (Start All Services)

## 📁 Logs

Logs are stored in the `logs/` directory:

- `logs/backend.log` - Azure Functions output
- `logs/frontend.log` - Vite output
- `logs/backend.pid` - Backend process ID
- `logs/frontend.pid` - Frontend process ID

To view logs in real-time:

```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs
tail -f logs/frontend.log

# Both logs
tail -f logs/*.log
```

## 🔧 Troubleshooting

### Ports Already in Use

If you get "port already in use" errors:

```bash
./stop-dev.sh
./start-dev.sh
```

### Services Won't Start

Check the logs:

```bash
cat logs/backend.log
cat logs/frontend.log
```

### Manual Cleanup

If the stop script doesn't work, manually kill processes:

```bash
# Kill backend
lsof -ti :7071 | xargs kill -9

# Kill frontend
lsof -ti :5173 | xargs kill -9
```

## 🎯 Service URLs

Once started, access services at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:7071
- **Health Check**: http://localhost:7071/api/health
- **OpenAI Health**: http://localhost:7071/api/openai-health

## 🔄 Auto-Restart on Workspace Open

To automatically start services when opening the workspace, the `start-dev.sh` script is configured to run on folder open in VS Code tasks.

## 📝 Notes

- Scripts use `lsof` to check port availability
- PID files are used to track running processes
- Health checks use HTTP requests to verify service readiness
- All scripts include colored output for better visibility
- Scripts are idempotent - safe to run multiple times
