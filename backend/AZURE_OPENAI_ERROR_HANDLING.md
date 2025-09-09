# Azure OpenAI Service Management

This document explains the new error handling system that replaces confusing fallback wireframes with clear error messages.

## 🚫 No More Fallback Confusion

**Problem Solved**: Previously, when Azure OpenAI was unavailable, the system would generate fallback wireframes that didn't match user requests, causing confusion.

**New Solution**: When Azure OpenAI is unavailable, users now see clear error messages instead of incorrect wireframes.

## 📡 Error Response Format

When the AI service is down, the API returns a **503 Service Unavailable** status with this structure:

```json
{
  "error": "AI Wireframe Service Temporarily Unavailable",
  "message": "The AI wireframe generation service is currently down. Please try again in a few minutes.",
  "suggestions": [
    "Wait a few minutes and try again",
    "Check if your internet connection is stable",
    "Contact support if the issue persists"
  ],
  "retryAfter": 60,
  "timestamp": "2025-08-11T16:35:35.578Z",
  "serviceStatus": "down"
}
```

## 🔧 Service Monitoring & Recovery

### Automatic Monitoring

Use the Azure OpenAI monitor to continuously check service health:

```bash
# Start continuous monitoring (checks every 60 seconds)
node azure-openai-monitor.js start

# Run one-time health check
node azure-openai-monitor.js check

# Get current service status
node azure-openai-monitor.js status
```

### Recovery Script

When the service is detected as down, run the recovery script:

```bash
# Attempt automatic recovery
./azure-service-recovery.sh
```

The recovery script will:

1. ✅ Validate configuration
2. 🌐 Check DNS resolution
3. 🌍 Test internet connectivity
4. 🔧 Flush DNS cache if needed
5. 🧪 Test Azure OpenAI endpoint
6. 🔄 Restart backend server if recovery succeeds

## 🎯 Service Status Indicators

### ✅ Healthy Service

- DNS resolution works
- HTTP connectivity established
- API authentication successful
- Wireframes generate normally

### ❌ Unhealthy Service

- DNS resolution fails (`getaddrinfo ENOTFOUND`)
- HTTP connection timeout
- Invalid API key (401/403 errors)
- Service rate limited (429 errors)

## 🚨 Common Issues & Solutions

### DNS Resolution Failed

```
❌ Error: getaddrinfo ENOTFOUND cog-35kjosu4rfnkc.openai.azure.com
```

**Causes:**

- Invalid Azure OpenAI endpoint URL
- DNS server issues
- Network connectivity problems

**Solutions:**

1. Verify `AZURE_OPENAI_ENDPOINT` in `.env` file
2. Check Azure portal for correct endpoint URL
3. Flush DNS cache: `sudo dscacheutil -flushcache`
4. Try different DNS servers (8.8.8.8, 1.1.1.1)

### Invalid API Key

```
❌ Error: 401 Unauthorized / 403 Forbidden
```

**Solutions:**

1. Verify `AZURE_OPENAI_KEY` in `.env` file
2. Check if key is expired in Azure portal
3. Regenerate API key if needed

### Service Rate Limited

```
❌ Error: 429 Too Many Requests
```

**Solutions:**

1. Wait for rate limit to reset
2. Upgrade Azure OpenAI pricing tier
3. Implement request queuing

## 📋 Manual Recovery Steps

If automatic recovery fails:

1. **Check Azure Portal**

   - Verify Azure OpenAI resource status
   - Check for service outages
   - Validate endpoint URL and API keys

2. **Update Configuration**

   ```bash
   # Edit environment variables
   nano backend/.env

   # Verify configuration
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_KEY=your-32-character-key
   AZURE_OPENAI_DEPLOYMENT=your-deployment-name
   ```

3. **Test Connection**

   ```bash
   # Test with curl
   curl -H "api-key: YOUR_KEY" \
        -H "Content-Type: application/json" \
        https://your-resource.openai.azure.com/
   ```

4. **Restart Services**
   ```bash
   # Restart backend server
   pkill -f simple-server.js
   cd backend && node simple-server.js
   ```

## 🎛️ Configuration Options

### Monitor Settings (azure-openai-monitor.js)

```javascript
const CONFIG = {
  checkInterval: 60 * 1000, // Check every 60 seconds
  retryAttempts: 3, // Retry failed checks 3 times
  timeout: 10000, // 10 second timeout per check
  alertsEnabled: true, // Enable alert notifications
  autoRecovery: false, // Disable automatic recovery
};
```

### Recovery Settings (azure-service-recovery.sh)

```bash
MAX_RETRIES=3                   # Maximum recovery attempts
LOG_FILE="service-recovery.log" # Recovery log file
```

## 📊 User Experience

### Before (Confusing)

- User: "Create a page with 2 cards"
- System: _Generates 4 cards using fallback_ ❌
- User: "This doesn't match what I asked for!" 😕

### After (Clear)

- User: "Create a page with 2 cards"
- System: "AI service temporarily unavailable. Please try again in a few minutes." ✅
- User: _Understands the issue and can retry later_ 😊

## 🔄 Scheduled Monitoring

To run monitoring automatically, add to crontab:

```bash
# Check service health every 5 minutes
*/5 * * * * /path/to/designetica/backend/azure-service-recovery.sh

# Monitor continuously (run once at startup)
@reboot cd /path/to/designetica/backend && node azure-openai-monitor.js start
```

## 📝 Logs

Monitor logs are written to:

- `backend/azure-openai-monitor.log` - Service health checks
- `backend/service-recovery.log` - Recovery attempts
- `backend/server.log` - Backend server logs

## 🎯 Summary

✅ **No more confusing fallback wireframes**  
✅ **Clear error messages when AI is down**  
✅ **Automated service monitoring**  
✅ **Recovery scripts for common issues**  
✅ **Better user experience**

The system now prioritizes transparency over generating incorrect content, giving users clear feedback about service status.
