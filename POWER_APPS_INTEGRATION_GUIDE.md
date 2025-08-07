# 🚀 Power Apps Integration Guide - Designetica Wireframe Generator

## 📋 **Overview**

This guide provides step-by-step instructions for integrating the Designetica AI Wireframe Generator with Microsoft Power Apps using Custom Connectors.

## ✅ **Prerequisites**

- ✅ **API Verified Working**: https://func-designetica-prod-rjsqzg4bs3fc6.azurewebsites.net
- ✅ **CORS Already Configured**: Power Apps origins already added
- ✅ **Authentication**: Anonymous access (no API key required)
- ✅ **OpenAPI Spec**: Available in `POWER_APPS_API_SPECIFICATION.json`

## 🔗 **Step 1: Create Custom Connector in Power Apps**

### 1.1 Access Power Apps Maker Portal

1. Navigate to https://make.powerapps.com
2. Select your environment
3. Go to **Data** > **Custom connectors**
4. Click **+ New custom connector** > **Import an OpenAPI file**

### 1.2 Import API Specification

1. Upload the `POWER_APPS_API_SPECIFICATION.json` file
2. **Connector name**: `Designetica Wireframe Generator`
3. **Description**: `AI-powered wireframe generation using Azure OpenAI`
4. **Host**: `func-designetica-prod-rjsqzg4bs3fc6.azurewebsites.net`

### 1.3 Configure General Settings

- **Scheme**: HTTPS
- **Base URL**: `/api`
- **Icon**: Upload custom icon (optional)
- **Icon background color**: `#0078d4` (Microsoft Blue)

## 🔧 **Step 2: Configure Security (No Authentication Required)**

Since our API uses anonymous access and CORS is already configured for Power Apps origins, no additional authentication is needed:

1. **Authentication type**: No authentication
2. Click **Update connector**

## 🧪 **Step 3: Test the Connector**

### 3.1 Test Generate Wireframe Operation

1. Go to the **Test** tab
2. Click **+ New connection**
3. Test the `GenerateWireframe` operation with:

```json
{
  "description": "Create a Power Apps login form with username field, password field, and blue submit button",
  "theme": "microsoftlearn"
}
```

### 3.2 Expected Response

```json
{
  "html": "...(Generated HTML wireframe)...",
  "aiGenerated": true,
  "theme": "microsoftlearn",
  "correlationId": "...",
  "processingTimeMs": 15000
}
```

## 🎨 **Step 4: Use in Power Apps Canvas App**

### 4.1 Add Data Source

1. In Power Apps Studio, go to **Data** > **Add data**
2. Search for "Designetica Wireframe Generator"
3. Create a connection

### 4.2 Basic Usage Example

**Generate Wireframe Button:**

```powerquery
// OnSelect property of Generate button
Set(
    WireframeResult,
    'Designetica Wireframe Generator'.GenerateWireframe({
        description: TextInput_Description.Text,
        theme: Dropdown_Theme.Selected.Value
    })
);

// Display result in HTML Text control
Set(GeneratedHTML, WireframeResult.html)
```

**HTML Display Control:**

```powerquery
// HtmlText property
GeneratedHTML
```

### 4.3 Advanced Usage with Error Handling

```powerquery
// OnSelect with error handling
IfError(
    Set(
        WireframeResult,
        'Designetica Wireframe Generator'.GenerateWireframe({
            description: TextInput_Description.Text,
            theme: Dropdown_Theme.Selected.Value
        })
    );
    Set(IsLoading, false);
    Set(ErrorMessage, ""),

    // Error handling
    Set(IsLoading, false);
    Set(ErrorMessage, "Failed to generate wireframe: " & FirstError.Message)
)
```

## 📱 **Step 5: Use in Power Apps Model-Driven App**

### 5.1 Create Power Automate Flow

1. Create a new cloud flow
2. Trigger: **When a record is created/updated**
3. Action: Use the Designetica connector
4. Parse the JSON response
5. Update the record with generated wireframe

### 5.2 Flow Configuration

```json
{
  "trigger": "When a record is created or updated",
  "entity": "Custom Entity (Wireframe Requests)",
  "action": "Generate wireframe using connector",
  "response_handling": "Update record with HTML result"
}
```

## 🔍 **Available Operations**

### 1. Generate Wireframe

- **Operation**: `GenerateWireframe`
- **Method**: POST
- **Endpoint**: `/generate-wireframe`
- **Purpose**: Create AI-generated wireframes

### 2. Generate Suggestions

- **Operation**: `GenerateSuggestions`
- **Method**: POST
- **Endpoint**: `/generate-suggestions`
- **Purpose**: Get UI/UX improvement suggestions

### 3. Health Check

- **Operation**: `HealthCheck`
- **Method**: GET
- **Endpoint**: `/health`
- **Purpose**: Verify API connectivity

## 🎯 **Best Practices**

### Performance Optimization

- **Cache Results**: Store generated wireframes to avoid repeated API calls
- **Async Processing**: Use Power Automate for longer operations
- **Batch Requests**: Combine multiple descriptions when possible

### Error Handling

- **Timeout Handling**: Set appropriate timeouts (30+ seconds for AI generation)
- **Retry Logic**: Implement retry for temporary failures
- **User Feedback**: Show loading states and clear error messages

### Security Considerations

- **Data Privacy**: Ensure descriptions don't contain sensitive information
- **Rate Limiting**: Implement app-level rate limiting if needed
- **Audit Trail**: Log API usage for compliance

## 📊 **Monitoring and Troubleshooting**

### Check API Health

Use the Health Check operation to verify connectivity:

```json
GET /api/health
Response: {"status": "healthy", "timestamp": "..."}
```

### Common Issues

1. **CORS Errors**: Verify Power Apps origins are in CORS configuration
2. **Timeout**: Increase timeout settings for AI generation
3. **Authentication**: Ensure "No authentication" is selected

### Monitoring Endpoints

- **API Health**: https://func-designetica-prod-rjsqzg4bs3fc6.azurewebsites.net/api/health
- **Azure Portal**: Monitor Function App logs and metrics

## 🔗 **Additional Resources**

- **API Documentation**: `POWER_APPS_API_SPECIFICATION.json`
- **Live API**: https://func-designetica-prod-rjsqzg4bs3fc6.azurewebsites.net
- **Frontend Demo**: https://designetica.carlosmarin.net
- **Power Apps Docs**: https://docs.microsoft.com/power-apps/maker/canvas-apps/custom-connector

---

## ✅ **Integration Checklist**

- [ ] Custom connector created and imported
- [ ] API specification uploaded
- [ ] Security configured (No authentication)
- [ ] Test operations successful
- [ ] Canvas app integration tested
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Documentation reviewed

**Ready to build amazing AI-powered wireframes in Power Apps! 🚀**
