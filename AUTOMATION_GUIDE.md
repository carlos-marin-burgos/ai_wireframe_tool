# 🤖 Automated Deployment Guide

## Overview

This guide shows you how to use the deployment scripts automatically instead of running them manually every time.

## 🚀 Automation Options

### 1. Git Hooks (Recommended for Teams)

**What it does**: Automatically validates environment before pushing code and deploys after pulling changes.

**Setup**:

```bash
./setup-hooks.sh
```

**How it works**:

- `pre-push`: Validates your environment before you push code
- `post-merge`: Auto-deploys when you pull changes that affect deployment files

**Best for**: Team environments where you want to ensure consistency

---

### 2. File Watcher (Best for Active Development)

**What it does**: Monitors your files and automatically deploys when you save changes.

**Setup**:

```bash
# Install fswatch (if not already installed)
brew install fswatch

# Start watching
./watch-deploy.sh
```

**How it works**:

- Monitors `backend/`, `src/`, `azure.yaml`, `package.json`
- Has a 5-minute cooldown to prevent rapid deployments
- Validates environment before each deployment

**Best for**: Active development when you want immediate deployments

---

### 3. VS Code Tasks (Best for IDE Integration)

**What it does**: Integrates automation directly into VS Code.

**Setup**: Tasks are already configured! Use them via:

- `Cmd+Shift+P` → "Tasks: Run Task"
- Or use the Terminal menu → "Run Task"

**Available tasks**:

- `🔍 Check Azure Environment` - Validates current environment
- `🚀 Deploy to Azure` - Safe deployment with validation
- `👀 Start Auto-Deploy Watcher` - Start file watching mode
- `⚙️ Setup Git Hooks` - Install Git hooks

**Best for**: When you spend most time in VS Code

---

### 4. Scheduled Checks (Best for Monitoring)

**What it does**: Regularly checks your environment health (doesn't auto-deploy by default).

**Setup**:

```bash
./setup-cron.sh
```

Then follow the instructions to add a cron job.

**How it works**:

- Runs environment checks on schedule
- Logs results to `deployment-cron.log`
- Can be configured for auto-deployment (edit `scheduled-deploy.sh`)

**Best for**: Monitoring environment health

---

## 🎯 Recommended Setup

For most developers, I recommend this combination:

1. **Setup Git Hooks** for team consistency:

   ```bash
   ./setup-hooks.sh
   ```

2. **Use VS Code Tasks** during development:

   - `Cmd+Shift+P` → "Tasks: Run Task" → "👀 Start Auto-Deploy Watcher"

3. **Manual deployment** when needed:
   ```bash
   ./deploy.sh
   ```

## 🛡️ Safety Features

All automation includes:

- ✅ Environment validation
- ✅ Confirmation prompts (where appropriate)
- ✅ Health checks after deployment
- ✅ OAuth configuration validation
- ✅ Cooldown periods to prevent rapid deployments

## 🔧 Customization

### Modify what triggers deployment

Edit the file patterns in:

- `.githooks/post-merge` (for Git automation)
- `watch-deploy.sh` (for file watcher)

### Change deployment cooldown

Edit `DEPLOY_COOLDOWN` in `watch-deploy.sh` (currently 5 minutes)

### Enable scheduled auto-deployment

Uncomment the deployment line in `scheduled-deploy.sh`

---

## 🎉 Quick Start

**For immediate automation**:

```bash
# 1. Setup Git hooks for team consistency
./setup-hooks.sh

# 2. Start file watcher for active development
./watch-deploy.sh
```

**To stop automation**:

- File watcher: `Ctrl+C`
- Git hooks: `git config --unset core.hooksPath`
- VS Code tasks: Just close the terminal

---

_Last updated: September 17, 2025_
