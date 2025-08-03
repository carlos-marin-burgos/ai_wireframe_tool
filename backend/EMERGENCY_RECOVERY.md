# 🚨 EMERGENCY RECOVERY GUIDE

## Quick Recovery Commands

### If a file gets corrupted:

```bash
# Check file integrity
npm run integrity:check

# List available backups
npm run backup:list simple-server.js

# Restore latest backup
npm run emergency:restore

# Or restore specific backup
node auto-backup.js restore simple-server.js [timestamp]
```

### If the server won't start:

```bash
# Use the safe startup script
./safe-start.sh

# Or manually check and fix
npm run integrity:check
npm run backup:restore simple-server.js
node simple-server.js
```

## What Happened Before?

The corruption occurred when HTML span elements got mixed into your JavaScript code:

**Before (corrupted):**

```javascript
baseURL: `<span style="background-color: rgb(255, 255, 102);">${process.env.AZURE_OPENAI_ENDPOINT}</span>/openai/deployments/<span style="background-color: rgb(255, 255, 102);">${process.env.AZURE_OPENAI_DEPLOYMENT}</span>`,
```

**After (fixed):**

```javascript
baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
```

## How to Prevent This:

### 1. **Always use the safe startup script:**

```bash
./safe-start.sh
```

### 2. **Check integrity before making changes:**

```bash
npm run integrity:check
```

### 3. **Monitor files continuously:**

```bash
npm run integrity:monitor
```

### 4. **Use proper copy-paste practices:**

- Copy from plain text sources, not HTML pages
- Use VS Code's "Paste and Match Style" (Cmd+Shift+V on Mac)
- Avoid copying from browsers or formatted documents

### 5. **Enable VS Code safeguards:**

Add to your VS Code settings.json:

```json
{
  "editor.trimAutoWhitespace": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

## File Protection System

The new protection system includes:

### 🔒 **Auto-Backup (`auto-backup.js`)**

- Automatically backs up critical files every time they change
- Keeps 20 versions of each file
- CLI commands for restore and list

### 🛡️ **Integrity Checker (`integrity-checker.js`)**

- Detects HTML corruption in JavaScript files
- Monitors for suspicious patterns
- Validates file checksums
- Real-time monitoring

### 🚀 **Safe Startup (`safe-start.sh`)**

- Pre-flight integrity checks
- Automatic backup restoration if corruption detected
- Background monitoring during runtime

## Daily Workflow

1. **Start your work session:**

   ```bash
   ./safe-start.sh
   ```

2. **Before making major changes:**

   ```bash
   npm run integrity:check
   ```

3. **If something goes wrong:**
   ```bash
   npm run emergency:restore
   ```

## Backup Locations

- **Auto-backups:** `/backend/backups/`
- **Manual backups:** Use `npm run backup:list` to see all
- **Git history:** Always commit working versions

## Recovery Strategies

### Level 1: Quick Fix

```bash
npm run emergency:restore
```

### Level 2: Manual Restore

```bash
npm run backup:list simple-server.js
node auto-backup.js restore simple-server.js [specific-timestamp]
```

### Level 3: Git Recovery

```bash
git checkout HEAD -- simple-server.js
```

### Level 4: Manual Reconstruction

Use the backup files in `/backend/backups/` to manually reconstruct the file.

---

**Remember:** The protection system is now active and will prevent this type of corruption from happening again!
