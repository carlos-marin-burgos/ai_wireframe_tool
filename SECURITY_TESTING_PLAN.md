# 🧪 Security Testing Plan

**Date:** October 9, 2025  
**Purpose:** Verify Microsoft employee authentication is working correctly  
**Status:** Ready for Testing

---

## 🎯 Testing Objectives

1. ✅ Verify authenticated Microsoft employees can access all features
2. ✅ Confirm non-authenticated users receive 403 errors
3. ✅ Test OAuth flows (Figma) still work correctly
4. ✅ Validate no broken workflows
5. ✅ Check audit logging in Application Insights

---

## 🔐 Test Scenarios

### **Scenario 1: Authenticated Microsoft Employee Access**

**Test User:** Any user with @microsoft.com email  
**Expected Result:** Full access to all features

#### **Test Cases:**

**1.1 Wireframe Generation (Basic)**

- [ ] Navigate to: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
- [ ] Enter a description (e.g., "landing page for a product")
- [ ] Click "Generate Wireframe"
- [ ] **Expected:** Wireframe generates successfully
- [ ] **Expected:** No 403 errors in browser console

**1.2 Wireframe Generation (Enhanced)**

- [ ] Use the enhanced wireframe generation feature
- [ ] Include Atlas components
- [ ] **Expected:** Enhanced wireframe generates with components
- [ ] **Expected:** Authentication passes silently

**1.3 Image Analysis**

- [ ] Upload an image for analysis
- [ ] **Expected:** Image analysis completes successfully
- [ ] **Expected:** AI provides design feedback

**1.4 URL to Wireframe**

- [ ] Enter a website URL (e.g., "https://microsoft.com")
- [ ] Request wireframe generation from URL
- [ ] **Expected:** Website is analyzed and wireframe generated
- [ ] **Expected:** Puppeteer-based analysis works

**1.5 Design Consultant**

- [ ] Generate a wireframe
- [ ] Request AI design feedback
- [ ] **Expected:** AI consultant provides suggestions
- [ ] **Expected:** Analysis completes without errors

**1.6 Figma Component Access**

- [ ] Access Figma Atlas components
- [ ] Import a component
- [ ] **Expected:** Figma components load successfully
- [ ] **Expected:** Component import works

**1.7 Accessibility Validation**

- [ ] Generate a wireframe
- [ ] Request accessibility validation
- [ ] **Expected:** Accessibility report generated
- [ ] **Expected:** No authentication errors

**1.8 Theme Management**

- [ ] Access theme settings
- [ ] Change theme colors
- [ ] **Expected:** Theme updates successfully
- [ ] **Expected:** Changes persist

---

### **Scenario 2: Unauthenticated Access**

**Test User:** Not signed in OR non-@microsoft.com email  
**Expected Result:** 403 Forbidden errors

#### **Test Cases:**

**2.1 Test Without Authentication**

- [ ] Open incognito/private browser window
- [ ] Navigate to: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
- [ ] **Expected:** Redirected to Azure AD login
- [ ] **Expected:** Cannot access app without authentication

**2.2 Test Direct API Access (No Auth)**

- [ ] Open browser console
- [ ] Try to call protected endpoint directly:

```javascript
fetch(
  "https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/generateWireframe",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: "test" }),
  }
)
  .then((r) => r.json())
  .then(console.log);
```

- [ ] **Expected:** 403 Forbidden error
- [ ] **Expected:** Error message: "Microsoft employee authentication required"

**2.3 Test Non-Microsoft Email**

- [ ] Sign in with personal account (e.g., Gmail)
- [ ] Try to access protected features
- [ ] **Expected:** 403 Forbidden errors
- [ ] **Expected:** Clear error message about @microsoft.com requirement

---

### **Scenario 3: OAuth Flows**

**Test User:** Authenticated Microsoft employee  
**Expected Result:** OAuth still works for Figma integration

#### **Test Cases:**

**3.1 Figma OAuth Start**

- [ ] Navigate to Figma integration settings
- [ ] Click "Connect to Figma"
- [ ] **Expected:** Redirects to Figma OAuth page
- [ ] **Expected:** OAuth initiation works (public endpoint)

**3.2 Figma OAuth Callback**

- [ ] Complete Figma OAuth flow
- [ ] Return to app with OAuth code
- [ ] **Expected:** Callback processes successfully
- [ ] **Expected:** Figma connection established

**3.3 Figma OAuth Status**

- [ ] Check Figma connection status
- [ ] **Expected:** Shows connected/disconnected correctly
- [ ] **Expected:** Status endpoint works

---

### **Scenario 4: Public Endpoints**

**Test User:** Any user (authenticated or not)  
**Expected Result:** Public endpoints remain accessible

#### **Test Cases:**

**4.1 Health Check**

- [ ] GET: https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/health
- [ ] **Expected:** Returns 200 OK with health status
- [ ] **Expected:** No authentication required

**4.2 OpenAI Health Check**

- [ ] GET: https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/openai-health
- [ ] **Expected:** Returns OpenAI connection status
- [ ] **Expected:** Accessible without authentication

---

### **Scenario 5: Feedback System**

**Test User:** Authenticated Microsoft employee  
**Expected Result:** Feedback submission works

#### **Test Cases:**

**5.1 Submit Feedback**

- [ ] Navigate to feedback modal
- [ ] Fill out feedback form
- [ ] Submit feedback
- [ ] **Expected:** Feedback submits successfully
- [ ] **Expected:** Confirmation message displayed

**5.2 View Feedback**

- [ ] Access feedback admin panel (if available)
- [ ] **Expected:** Can view submitted feedback
- [ ] **Expected:** Authentication validated

---

## 🔍 Browser Console Testing

### **Quick Console Tests**

Open browser console on https://delightful-pond-064d9a91e.1.azurestaticapps.net/

**Test 1: Check Authentication Headers**

```javascript
// This should show authentication headers being sent
fetch("/api/generateWireframe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ description: "test page" }),
})
  .then((r) => {
    console.log("Status:", r.status);
    return r.json();
  })
  .then((data) => console.log("Response:", data))
  .catch((err) => console.error("Error:", err));
```

**Test 2: Check for 403 Errors**

```javascript
// Monitor network tab for any 403 responses
console.log("Watch Network tab for 403 errors...");
```

**Test 3: Verify No Function Keys in Requests**

```javascript
// Check that requests don't include ?code= parameter
performance
  .getEntriesByType("resource")
  .filter((r) => r.name.includes("azurewebsites.net"))
  .forEach((r) => {
    if (r.name.includes("?code=")) {
      console.error("❌ SECURITY ISSUE: Function key exposed in URL:", r.name);
    } else {
      console.log("✅ No function key in URL:", r.name);
    }
  });
```

---

## 📊 Application Insights Testing

### **Check Authentication Logs**

1. **Open Azure Portal**

   - Navigate to Application Insights for your Function App
   - Go to "Logs" section

2. **Query for Authentication Logs**

```kusto
traces
| where message contains "👤 Authenticated user"
| project timestamp, message, operation_Name
| order by timestamp desc
| take 50
```

3. **Expected Results:**

   - See log entries with authenticated user emails
   - Example: "👤 Authenticated user: carlos@microsoft.com"
   - Each protected endpoint should log authentication

4. **Query for 403 Errors**

```kusto
requests
| where resultCode == 403
| project timestamp, url, resultCode, operation_Name
| order by timestamp desc
| take 20
```

5. **Expected Results:**
   - Should see 403s only from unauthorized access attempts
   - Not from legitimate authenticated users

---

## 🐛 Debugging Failed Tests

### **If Authentication Fails (403 Errors):**

**Check 1: Verify Azure Static Web App Authentication**

```bash
# Check authentication configuration
az staticwebapp show \
  --name <your-static-web-app-name> \
  --query "properties.customDomains"
```

**Check 2: Verify x-ms-client-principal Header**

- Open browser dev tools → Network tab
- Make a request to protected endpoint
- Check request headers for `x-ms-client-principal`
- Should contain base64-encoded user info

**Check 3: Decode Principal Header**

```javascript
// Run in browser console after making a request
const header = "base64-string-from-network-tab";
const decoded = atob(header);
console.log("User Info:", JSON.parse(decoded));
```

**Check 4: Verify Backend Configuration**

- Ensure `AZURE_CLIENT_ID` is set in Function App settings
- Ensure `AZURE_CLIENT_SECRET` is set in Function App settings
- Check `staticwebapp.config.json` has correct auth settings

### **If Requests Show Function Keys:**

**Check 1: Verify Frontend Deployment**

```bash
# Ensure latest code is deployed
git log --oneline -5
# Should show recent commits removing function keys
```

**Check 2: Clear Browser Cache**

- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or clear browser cache completely

**Check 3: Check Vite Build Output**

```bash
# Look for any references to VITE_AZURE_FUNCTION_KEY
cd /Users/carlosmarinburgos/designetica
grep -r "VITE_AZURE_FUNCTION_KEY" dist/ || echo "✅ No function keys found"
```

---

## ✅ Test Results Template

### **Test Execution Record**

**Tester:** ********\_\_\_********  
**Date:** October 9, 2025  
**Environment:** Production  
**Browser:** ********\_\_\_********

| Test Case              | Status            | Notes |
| ---------------------- | ----------------- | ----- |
| 1.1 Basic Wireframe    | ⬜ Pass / ⬜ Fail |       |
| 1.2 Enhanced Wireframe | ⬜ Pass / ⬜ Fail |       |
| 1.3 Image Analysis     | ⬜ Pass / ⬜ Fail |       |
| 1.4 URL to Wireframe   | ⬜ Pass / ⬜ Fail |       |
| 1.5 Design Consultant  | ⬜ Pass / ⬜ Fail |       |
| 1.6 Figma Components   | ⬜ Pass / ⬜ Fail |       |
| 1.7 Accessibility      | ⬜ Pass / ⬜ Fail |       |
| 1.8 Theme Management   | ⬜ Pass / ⬜ Fail |       |
| 2.1 No Auth Redirect   | ⬜ Pass / ⬜ Fail |       |
| 2.2 Direct API Block   | ⬜ Pass / ⬜ Fail |       |
| 2.3 Non-MS Email Block | ⬜ Pass / ⬜ Fail |       |
| 3.1 OAuth Start        | ⬜ Pass / ⬜ Fail |       |
| 3.2 OAuth Callback     | ⬜ Pass / ⬜ Fail |       |
| 3.3 OAuth Status       | ⬜ Pass / ⬜ Fail |       |
| 4.1 Health Check       | ⬜ Pass / ⬜ Fail |       |
| 4.2 OpenAI Health      | ⬜ Pass / ⬜ Fail |       |
| 5.1 Submit Feedback    | ⬜ Pass / ⬜ Fail |       |
| 5.2 View Feedback      | ⬜ Pass / ⬜ Fail |       |

**Overall Result:** ⬜ PASS / ⬜ FAIL / ⬜ PARTIAL

**Issues Found:**

1. ***
2. ***
3. ***

**Recommendations:**

1. ***
2. ***
3. ***

---

## 🚀 Quick Start Testing Guide

### **5-Minute Smoke Test:**

1. **Sign in** to https://delightful-pond-064d9a91e.1.azurestaticapps.net/
2. **Generate a wireframe** with any description
3. **Check browser console** for errors (F12)
4. **Open Network tab** and verify:
   - ✅ No `?code=` parameters in URLs
   - ✅ No 403 errors
   - ✅ Requests include authentication headers
5. **Try incognito mode** - should redirect to login

**If all 5 pass:** ✅ Security is working!  
**If any fail:** Review debugging section above

---

## 📞 Support

**Issues During Testing:**

- Check debugging section above
- Review `SECURITY_IMPROVEMENTS_SUMMARY.md`
- Contact development team

**Security Concerns:**

- Report immediately via internal security channel
- Do not share credentials or tokens

---

**Ready to test!** 🎉  
Start with the 5-minute smoke test, then proceed with full test cases as needed.
