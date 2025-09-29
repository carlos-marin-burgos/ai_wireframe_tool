# Device Management Authentication Workarounds

## Problem: AADSTS530003 Error

**Error**: "Your device is required to be managed to access this resource"
**Cause**: BAMI subscription requires managed devices for security compliance

## 🔧 Workaround Options

### Option 1: Use Service Principal Authentication (Recommended)

Instead of user authentication, use a service principal that doesn't require device management.

```bash
# Create a service principal (if you have permissions)
az ad sp create-for-rbac --name "designetica-deployment" --role contributor --scopes /subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d

# Login with service principal
az login --service-principal --username <app-id> --password <password> --tenant 54ad0b60-7fda-456b-b965-230c533f1418
```

### Option 2: Device Registration/Enrollment

Contact your IT administrator to:

1. Enroll your device in Microsoft Intune/Device Management
2. Register your device as a managed device
3. Apply necessary compliance policies

### Option 3: Use Azure Cloud Shell

Deploy directly from Azure Cloud Shell, which is already managed:

1. Go to https://shell.azure.com
2. Upload your project files
3. Run deployment commands from there

### Option 4: GitHub Actions (Automated Deployment)

Set up automated deployment that doesn't require your local device:

1. Use GitHub Actions with service principal
2. Deploy on every push to main branch
3. No local device management required

### Option 5: Use Azure Developer CLI with Different Auth

Try different authentication methods with azd:

```bash
# Try different auth flows
azd auth login --use-device-code
azd auth login --use-interactive-browser

# Or set up with client credentials
azd env set AZURE_CLIENT_ID <service-principal-id>
azd env set AZURE_CLIENT_SECRET <service-principal-secret>
azd env set AZURE_TENANT_ID 54ad0b60-7fda-456b-b965-230c533f1418
```

## 🚨 Immediate Action Items

1. **Contact IT Support** - Request device enrollment in management system
2. **Request Service Principal** - Ask for deployment service principal credentials
3. **Consider Azure Cloud Shell** - For immediate deployment needs
4. **Set up GitHub Actions** - For automated future deployments

## 📧 Request Template for IT Support

```
Subject: Device Management Enrollment for Azure BAMI Subscription Access

Hi IT Team,

I'm receiving error AADSTS530003 when trying to access Azure resources with our BAMI subscription (330eaa36-e19f-4d4c-8dea-37c2332f754d).

Could you please help me with one of the following:

1. Enroll my device (macOS) in the device management system
2. Provide a service principal for automated deployments
3. Grant exemption for development work

Device Details:
- OS: macOS
- User: [Your email]
- Subscription: BAMI (330eaa36-e19f-4d4c-8dea-37c2332f754d)
- Tenant: 54ad0b60-7fda-456b-b965-230c533f1418

Thanks!
```

## 🛠️ Temporary Local Development

You can continue local development without deployment:

- Frontend: http://localhost:5173
- Backend: http://localhost:7072
- All features work locally without Azure authentication
