# 🎯 The ONLY Development Commands You Need

## Start Everything

```bash
./START.sh
```

This will:

- Kill any old processes on ports 7071 and 5173
- Start Azure Functions backend on port 7071
- Start Vite frontend on port 5173
- Wait for both to be ready
- Show you the URLs and PIDs

## Stop Everything

```bash
# Option 1: Kill by port
lsof -ti:7071 | xargs kill
lsof -ti:5173 | xargs kill

# Option 2: Kill by PID (shown when you start)
kill <BACKEND_PID> <FRONTEND_PID>
```

## Check Status

```bash
# Backend
curl http://localhost:7071/api/health

# Frontend
curl http://localhost:5173

# Vite Proxy (this is what your app uses)
curl http://localhost:5173/api/health
```

## View Logs

```bash
# Backend logs
tail -f /tmp/backend.log

# Frontend logs
tail -f /tmp/frontend.log
```

---

## ❌ Don't Use These Anymore

All these scripts have been archived to `old-scripts/`:

- ❌ `complete-restart.sh`
- ❌ `smart-dev-start.sh`
- ❌ `dev-start-auto.sh`
- ❌ `fix-stuck-error.sh`
- ❌ `restart-functions.sh`
- ❌ `auto-recovery.sh`
- ❌ `dev-manager.sh`
- ❌ And 7 more...

**Why?** They all conflicted with each other and caused the "Backend Down" errors.

---

## 🎉 That's It!

Just use `./START.sh` every time. Simple, reliable, no confusion.

If something goes wrong:

1. Kill everything: `lsof -ti:7071 | xargs kill && lsof -ti:5173 | xargs kill`
2. Start again: `./START.sh`
3. Done!
