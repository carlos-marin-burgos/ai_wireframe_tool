# 🧪 Manual Security Testing Guide

**Quick Start:** Open https://delightful-pond-064d9a91e.1.azurestaticapps.net/ in your browser

---

## ✅ **Test 1: Verify You Can Access the App**

### Steps:

1. Open: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
2. You should be redirected to Azure AD login
3. Sign in with your **@microsoft.com** email
4. You should land on the Designetica homepage

### Expected Result:

✅ Successfully authenticated and can see the app

### If This Fails:

- Check you're using a @microsoft.com email
- Try clearing browser cache and cookies
- Try incognito/private mode

---

## ✅ **Test 2: Generate a Wireframe (Most Important!)**

### Steps:

1. On the Designetica homepage
2. Enter description: **"landing page for a Microsoft product"**
3. Click "Generate Wireframe" button
4. Open browser console (F12 or Cmd+Option+I)
5. Watch the Network tab

### Expected Result:

✅ Wireframe generates successfully  
✅ No 403 or 401 errors in console  
✅ Network tab shows request to `/api/generateWireframe`  
✅ Request does NOT include `?code=` parameter

### If This Fails:

- Check console for error messages
- Look for 403 errors (authentication not working)
- Look for 401 errors (not authenticated)

---

## ✅ **Test 3: Verify No Function Keys in URLs**

### Steps:

1. Keep console open (F12)
2. Go to **Network** tab
3. Generate another wireframe
4. Find the request to `generateWireframe`
5. Check the URL in the request

### Expected Result:

✅ URL looks like: `https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/generateWireframe`  
❌ URL should NOT look like: `...azurewebsites.net/api/generateWireframe?code=ABC123...`

### Why This Matters:

- Function keys (the `?code=` part) should NOT be visible
- If you see them, credentials are exposed in browser
- Authentication should use headers, not URL parameters

---

## ✅ **Test 4: Test Unauthenticated Access**

### Steps:

1. Open **incognito/private browser window**
2. Try to access: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
3. Do NOT sign in (close the login popup if possible)
4. Try to navigate to different pages

### Expected Result:

✅ Redirected back to Azure AD login  
✅ Cannot access app without authentication  
✅ All pages require authentication

---

## ✅ **Test 5: Test Direct API Call (Advanced)**

### Steps:

1. Open **incognito/private browser** (no authentication)
2. Open browser console (F12)
3. Paste and run this code:

```javascript
fetch(
  "https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/generateWireframe",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: "test page",
    }),
  }
)
  .then((r) => {
    console.log("Status:", r.status);
    return r.text();
  })
  .then((data) => console.log("Response:", data))
  .catch((err) => console.error("Error:", err));
```

### Expected Result:

✅ Status: **401** (Unauthorized) or **403** (Forbidden)  
✅ Response mentions "authentication required"  
❌ Should NOT return Status: 200 (success)

### Why This Matters:

- Direct API calls without authentication should fail
- This proves endpoints are protected
- Attackers cannot bypass the frontend

---

## ✅ **Test 6: Test Figma Integration**

### Steps:

1. Signed in as Microsoft employee
2. Navigate to Figma component section
3. Try to load Atlas components
4. Try to import a component

### Expected Result:

✅ Components load successfully  
✅ Can import Figma components  
✅ No authentication errors

---

## ✅ **Test 7: Verify Audit Logging**

### Steps:

1. Sign in to Azure Portal
2. Navigate to your Function App: `func-designetica-prod-vmlmp4vej4ckc`
3. Go to **Application Insights**
4. Click **Logs**
5. Run this query:

```kusto
traces
| where message contains "👤 Authenticated user"
| project timestamp, message
| order by timestamp desc
| take 20
```

### Expected Result:

✅ See log entries with your email  
✅ Example: "👤 Authenticated user: yourname@microsoft.com"  
✅ Logs show which endpoints were accessed

### Why This Matters:

- Proves authentication is working
- Creates audit trail for security
- Can track who accessed what

---

## 📊 **Quick Status Check**

Run through these 7 tests and mark results:

| Test                            | Pass/Fail | Notes |
| ------------------------------- | --------- | ----- |
| 1. Can access app               | ⬜        |       |
| 2. Generate wireframe           | ⬜        |       |
| 3. No function keys in URLs     | ⬜        |       |
| 4. Incognito redirects to login | ⬜        |       |
| 5. Direct API returns 401/403   | ⬜        |       |
| 6. Figma integration works      | ⬜        |       |
| 7. Audit logs show activity     | ⬜        |       |

**If all 7 pass:** 🎉 Security is working perfectly!

---

## 🐛 **Common Issues & Solutions**

### **Issue: Getting 403 errors even when signed in**

**Solution:**

1. Verify you're using @microsoft.com email
2. Check `staticwebapp.config.json` has correct auth config
3. Verify backend has `authMiddleware.js` deployed
4. Check Application Insights for error details

### **Issue: See `?code=` in URLs**

**Solution:**

1. Check that frontend is latest version (hard refresh: Cmd+Shift+R)
2. Verify `.env` doesn't have `VITE_AZURE_FUNCTION_KEY`
3. Check `src/config/api.ts` doesn't append function keys
4. Clear browser cache

### **Issue: Can access endpoints without auth**

**Solution:**

1. Check `staticwebapp.config.json` requires authentication
2. Verify Azure Static Web App has authentication enabled
3. Check Function App has `authMiddleware.js`
4. Ensure environment is deployed correctly

### **Issue: OAuth flows broken**

**Solution:**

1. Verify `figmaOAuthStart` and `figmaOAuthCallback` endpoints exist
2. Check these endpoints are NOT protected with auth middleware
3. Verify Figma OAuth credentials in environment variables

---

## 🎯 **Success Criteria**

✅ Microsoft employees can access all features  
✅ Non-Microsoft users cannot access protected endpoints  
✅ No function keys visible in URLs  
✅ Direct API calls without auth return 401/403  
✅ Audit logs show authenticated user activity  
✅ Figma integration still works  
✅ All protected features work correctly

If all criteria met: **Security implementation successful!** ✅

---

## 📞 **Need Help?**

**Can't complete tests?**

- Review `SECURITY_IMPROVEMENTS_SUMMARY.md` for implementation details
- Check `backend/lib/authMiddleware.js` for authentication logic
- Review `staticwebapp.config.json` for routing configuration

**Found security issues?**

- Document the issue with screenshots
- Check Application Insights for error logs
- Report via internal security channel

---

**Ready to test!** Start with Test 1 and work through each test sequentially.

The most important tests are **#2** (Generate Wireframe) and **#3** (No Function Keys).
