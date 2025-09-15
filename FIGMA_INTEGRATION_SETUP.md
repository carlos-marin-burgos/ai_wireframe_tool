# Designetica Figma Integration Setup Guide

## 🎯 Overview

This guide will help you enable full Figma integration in Designetica, allowing you to import Figma files and convert them into editable wireframes.

## 📋 Current Status

✅ **Personal Access Token**: Already configured  
⚠️ **OAuth2 Setup**: Needs configuration  
✅ **Backend Endpoints**: Created  
✅ **Frontend Integration**: Ready

## 🚀 Quick Setup Steps

### Step 1: Test Current Integration

Your personal access token is already configured. Test it:

```bash
curl http://localhost:7072/api/figma/test
```

Expected response: User info and success message.

### Step 2: Set up OAuth2 (Optional but Recommended)

#### 2.1 Create Figma App

1. Go to: https://www.figma.com/developers/apps
2. Click **"Create new app"**
3. Fill in details:
   - **Name**: Designetica Wireframe Tool
   - **Description**: AI-powered wireframe generator with Figma integration
   - **Website**: Your domain (optional)

#### 2.2 Configure OAuth2 Settings

In your new Figma app settings:

**Redirect URIs:**

- `http://localhost:7072/api/figma/oauth/callback` (development)
- `https://your-domain.com/api/figma/oauth/callback` (production)

**Scopes:**

- `file_read` (allows reading Figma files)

#### 2.3 Update Environment Variables

Replace `YOUR_FIGMA_CLIENT_ID_HERE` in your `.env` file with your actual Client ID from Figma app settings.

### Step 3: Test OAuth2 Flow

1. Visit: http://localhost:7072/api/figma/oauth/start
2. Authorize Designetica in Figma
3. You'll be redirected back with success confirmation

## 🔧 API Endpoints

### Available Endpoints:

#### Test Integration

```
GET /api/figma/test
```

Tests connection and token validity.

#### Start OAuth2 Flow

```
GET /api/figma/oauth/start
```

Redirects to Figma for authorization.

#### OAuth2 Callback

```
GET /api/figma/oauth/callback?code=...
```

Handles authorization callback.

#### Import Figma File

```
POST /api/figma/components
Content-Type: application/json

{
  "fileUrl": "https://www.figma.com/file/ABC123/My-Design-File",
  "generateWireframe": true
}
```

#### Get Components

```
GET /api/figma/components
Authorization: Bearer YOUR_TOKEN
```

## 🎨 Usage Examples

### Example 1: Import Public Figma File

```bash
curl -X POST http://localhost:7072/api/figma/components \
  -H "Content-Type: application/json" \
  -d '{
    "fileUrl": "https://www.figma.com/file/wSppVRlOi9JZO2LxtHUbbW/Fluent-2-Extended-Figma-Library",
    "generateWireframe": true
  }'
```

### Example 2: Test with Personal Token

```bash
curl http://localhost:7072/api/figma/test \
  -H "Authorization: Bearer figd_YOUR_TOKEN_HERE"
```

### Example 3: Frontend Integration

```javascript
// In your React component
const importFigmaFile = async (fileUrl) => {
  const response = await fetch("/api/figma/components", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${figmaToken}`,
    },
    body: JSON.stringify({
      fileUrl: fileUrl,
      generateWireframe: true,
    }),
  });

  const result = await response.json();
  if (result.success) {
    // Use result.wireframeHtml in your app
    setWireframeContent(result.wireframeHtml);
  }
};
```

## 🔒 Security Considerations

### Personal Access Tokens

- **Pros**: Simple setup, immediate access
- **Cons**: Don't expire, full account access
- **Use for**: Development and testing

### OAuth2 Tokens

- **Pros**: Secure, limited scope, can be revoked
- **Cons**: More complex setup
- **Use for**: Production environments

### Token Storage

- Environment variables for server-side
- Secure storage for client-side tokens
- Never commit tokens to version control

## 🎯 Integration with Wireframe Generator

### Figma → Designetica Workflow:

1. **Import**: User provides Figma file URL
2. **Extract**: System extracts frames and components
3. **Convert**: Frames converted to HTML wireframes
4. **Edit**: Wireframes become editable in Designetica
5. **Export**: Final wireframes exported as needed

### Enhanced Features:

- **Component Library**: Extract reusable components
- **Design Tokens**: Import colors, typography, spacing
- **Asset Export**: Download images and icons
- **Version Control**: Track changes and updates

## 🧪 Testing Checklist

- [ ] Personal token authentication works
- [ ] OAuth2 flow completes successfully
- [ ] Can import public Figma files
- [ ] Wireframes render correctly
- [ ] Inline editing works on imported content
- [ ] Images and assets load properly

## 🚨 Troubleshooting

### Common Issues:

#### "Invalid access token"

- Check token format (should start with `figd_`)
- Verify token hasn't expired
- Ensure proper Authorization header format

#### "File not found"

- Verify file URL is correct
- Check if file is public or accessible
- Test with a known working file URL

#### OAuth2 redirect issues

- Verify redirect URI matches exactly
- Check client ID is correct
- Ensure callback endpoint is accessible

### Debug Commands:

```bash
# Test basic connectivity
curl http://localhost:7072/api/figma/test

# Test with specific token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:7072/api/figma/test

# Import test file
curl -X POST http://localhost:7072/api/figma/components \
  -H "Content-Type: application/json" \
  -d '{"fileUrl": "https://www.figma.com/file/wSppVRlOi9JZO2LxtHUbbW/Fluent-2-Extended-Figma-Library"}'
```

## 🎉 Next Steps

1. **Test the current setup** with your personal token
2. **Set up OAuth2** for production use
3. **Integrate with frontend** for seamless user experience
4. **Enhance import capabilities** with component libraries
5. **Add design token extraction** for consistent styling

## 📚 Additional Resources

- [Figma API Documentation](https://www.figma.com/developers/api)
- [OAuth2 Flow Guide](https://www.figma.com/developers/api#authentication)
- [Figma File Structure](https://www.figma.com/developers/api#files)
- [Designetica API Reference](./API_REFERENCE.md)

---

**Need Help?** Check the troubleshooting section or test endpoints individually to isolate issues.
