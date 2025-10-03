# 🎯 Quick Answer: Localhost vs Production

## TL;DR - You're Right to Be Concerned!

**YES, localhost and production CAN behave differently.** Here's what you need to know:

---

## 🔴 Major Differences

### 1. **Session Storage (BIGGEST ISSUE for Figma)**

| Aspect         | Localhost                                          | Production                                      |
| -------------- | -------------------------------------------------- | ----------------------------------------------- |
| Domain         | `localhost:5173`                                   | `*.azurestaticapps.net`                         |
| localStorage   | Separate storage                                   | Separate storage                                |
| OAuth Callback | `http://localhost:5173/...`                        | `https://*.azurestaticapps.net/...`             |
| **Impact**     | ⚠️ **Must re-authenticate after every deployment** | ⚠️ **Different session = different connection** |

### 2. **Performance**

| Aspect           | Localhost             | Production                       |
| ---------------- | --------------------- | -------------------------------- |
| Backend Response | Instant (always warm) | 5-30s first request (cold start) |
| API Calls        | Direct connection     | Goes through Azure CDN           |
| Caching          | None                  | Multiple layers                  |

### 3. **API Routing**

```
Localhost:
Browser → Vite Proxy → Local Functions (port 7071)

Production:
Browser → Azure CDN → Static Web App → Function App → Cold Start?
```

---

## ✅ Your Figma Fix - Will It Work in Production?

### What You Fixed:

```typescript
// Added handleClose that preserves session
const handleClose = useCallback(() => {
  if (isConnected) {
    extendTrustedSession(); // ✅ This is good!
  }
  onClose();
}, [isConnected, onClose]);
```

### Will it work in production? **Mostly YES, but...**

✅ **Will work:** Session persistence logic
✅ **Will work:** localStorage management
⚠️ **Might fail:** Cold starts could timeout connection check
⚠️ **Must verify:** Figma OAuth app has production callback URL

---

## 🧪 Test Before Deploying

Run this test script:

```bash
./test-production-parity.sh
```

Or manually test:

### Step 1: Build Production Version

```bash
npm run build
npx serve -s dist -l 8080
```

### Step 2: Test Production Backend

```bash
# Point local frontend to production backend
cat > .env.local << EOF
VITE_API_ENDPOINT=https://func-original-app-pgno4orkguix6.azurewebsites.net/api
VITE_BACKEND_BASE_URL=https://func-original-app-pgno4orkguix6.azurewebsites.net
EOF

npm run dev
```

### Step 3: Test Figma Connection

1. Connect to Figma
2. Close modal
3. Wait 30 seconds (simulate cold start)
4. Reopen modal
5. ✅ Should still be connected

---

## ⚠️ Critical Checklist Before Deploy

- [ ] Figma OAuth app has **BOTH** callback URLs:

  - `http://localhost:5173/api/figmaoauthcallback`
  - `https://delightful-pond-064d9a91e.1.azurestaticapps.net/api/figmaoauthcallback`

- [ ] Azure Function App has same environment variables as local `.env`

- [ ] Test with production backend locally (`.env.local`)

- [ ] Plan to test **immediately** after deploy (warm)

- [ ] Plan to test **30 minutes** after deploy (cold start)

---

## 🐛 Common Production-Only Bugs

### Bug 1: "Connection Lost" After Modal Close (Your Issue)

**Symptoms:**

- ✅ Works in localhost
- ❌ Breaks in production

**Root Causes:**

- Cold start delays connection check
- Different localStorage domain
- Timeout too short for production

**Your Fix Status:** ✅ **Should work** (you added session preservation)

### Bug 2: OAuth Redirect Fails

**Symptoms:**

- OAuth popup opens but doesn't redirect back

**Root Cause:**

- Missing production callback URL in Figma OAuth app

**Fix:**

```
Go to Figma OAuth app settings
Add: https://delightful-pond-064d9a91e.1.azurestaticapps.net/api/figmaoauthcallback
```

### Bug 3: API Calls Timeout

**Symptoms:**

- First API call after 20+ minutes times out

**Root Cause:**

- Cold start takes too long

**Already Fixed:** Your `api.ts` has 90-second timeout ✅

---

## 📊 Monitor After Deployment

### Check These in Browser DevTools:

```javascript
// 1. Check session exists
console.log(localStorage.getItem("figma_oauth_session"));

// 2. Check tokens
console.log(localStorage.getItem("figma_oauth_tokens"));

// 3. Test backend directly
fetch(
  "https://func-original-app-pgno4orkguix6.azurewebsites.net/api/figmaoauthstatus"
)
  .then((r) => r.json())
  .then(console.log);

// 4. Check domain
console.log(window.location.hostname);
// Should be: delightful-pond-064d9a91e.1.azurestaticapps.net
```

---

## 🚀 Deployment Workflow

```bash
# 1. Test locally
npm run dev
# ✅ Verify fix works

# 2. Test production build locally
npm run build
npx serve -s dist -l 8080
# ✅ Verify fix still works

# 3. Deploy
git add .
git commit -m "fix: Preserve Figma connection when closing modal"
git push origin main

# 4. Test immediately (backend is warm)
open https://delightful-pond-064d9a91e.1.azurestaticapps.net
# ✅ Test Figma connection

# 5. Wait 30 minutes and test again (cold start)
# ✅ Should still work (but might be slow first time)
```

---

## 💡 Key Takeaway

**Your fix is good, but remember:**

1. ✅ **Localhost tests basic logic** - Does the code work?
2. ⚠️ **Production tests real-world conditions** - Does it work under load, with cold starts, on different networks?
3. 🔄 **Always test both** - Localhost is fast iteration, production is reality

**Bottom line:** Your Figma connection fix should work in production, but you MUST test it there to be sure!

---

## 📖 Full Documentation

- Detailed comparison: `LOCALHOST_VS_PRODUCTION.md`
- Test script: `./test-production-parity.sh`
- Original fix: `FIGMA_CONNECTION_PERSISTENCE_FIX.md`
