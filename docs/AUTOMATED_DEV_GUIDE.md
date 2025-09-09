# 🚀 Automated Development Environment

No more manual restarts! This setup provides a completely automated development environment that just works.

## 🎯 Quick Start

### Option 1: Command Line (Recommended)

```bash
# Start everything automatically
npm run dev

# Stop everything
npm run dev:stop

# Monitor health
npm run dev:monitor
```

### Option 2: VS Code Tasks

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Tasks: Run Task"
3. Select "🚀 Complete Dev Environment (Auto)"

### Option 3: Manual Scripts

```bash
# Start complete environment
./dev-start-complete.sh

# Stop all services
./dev-stop.sh

# Monitor services
./dev-monitor.sh
```

## 🔧 What It Does

The automated startup script:

1. **🧹 Cleans up** any existing processes on ports 7072, 5173, and 3000
2. **🔧 Starts Azure Functions** backend on port 7072
3. **🎨 Starts Vite frontend** on port 5173
4. **⏰ Waits** for each service to be ready before proceeding
5. **🧪 Tests** the full stack to ensure everything works
6. **📍 Provides** direct access URLs
7. **🔍 Monitors** services continuously

## 📍 Service Endpoints

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:7072
- **Health Check**: http://localhost:7072/api/health

## 🛠️ Available Commands

| Command               | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start complete development environment   |
| `npm run dev:stop`    | Stop all development services            |
| `npm run dev:monitor` | Monitor service health                   |
| `npm run dev:auto`    | Same as `npm run dev`                    |
| `npm run dev:legacy`  | Use old unified server (not recommended) |

## 📝 Logs and Monitoring

### View Logs

```bash
# Backend logs
tail -f backend-logs.txt

# Frontend logs
tail -f frontend-logs.txt
```

### Monitor Health

The monitor script checks:

- Port availability (7072, 5173)
- Service health endpoints
- Full stack integration
- Updates every 10 seconds

## 🚨 Troubleshooting

### If Services Won't Start

```bash
# Force clean restart
./dev-stop.sh
sleep 3
./dev-start-complete.sh
```

### If Ports Are Occupied

The startup script automatically cleans up ports, but if you need manual cleanup:

```bash
# Kill specific port
lsof -ti :7072 | xargs kill -9
lsof -ti :5173 | xargs kill -9
```

### If Azure Functions Fail

1. Check `backend/local.settings.json` exists
2. Verify Azure OpenAI credentials
3. Run `npm run dev:stop` then `npm run dev`

## 🎨 VS Code Integration

### Tasks Available

- **🚀 Complete Dev Environment (Auto)** - Default build task
- **🛑 Stop All Dev Services** - Clean shutdown
- **🔍 Monitor Dev Environment** - Health monitoring

### Keyboard Shortcuts

- `Cmd+Shift+P` → "Tasks: Run Build Task" → Starts dev environment
- `Cmd+Shift+P` → "Tasks: Run Task" → Access all development tasks

## 🔄 Development Workflow

1. **Start**: `npm run dev` (or use VS Code task)
2. **Develop**: Services run automatically in background
3. **Monitor**: Keep an eye on the monitoring output
4. **Stop**: `npm run dev:stop` when done

## 📊 Health Monitoring Features

The monitoring system provides:

- ✅ Real-time service status
- 🔍 Port availability checks
- 🧪 Full stack integration tests
- ⚡ Automatic problem detection
- 📱 Clean status dashboard

## 💡 Pro Tips

1. **Leave monitoring running** - Keep the startup terminal open to see health updates
2. **Use VS Code tasks** - Easier than remembering commands
3. **Check logs if issues** - `backend-logs.txt` and `frontend-logs.txt`
4. **Test full stack** - The startup script tests everything automatically
5. **Clean restart** - Use `npm run dev:stop` then `npm run dev` for issues

## 🎯 Benefits

- **No more manual service management**
- **Automatic port cleanup**
- **Health monitoring included**
- **Comprehensive error checking**
- **VS Code integration**
- **Background operation**
- **Instant feedback on issues**

---

🎉 **Never manually restart services again!** The automation handles everything for you.
