# Wireframe Generator API Reference

## Quick Reference

### ✅ Correct Usage

```bash
# Correct endpoint
curl -X POST http://localhost:7071/api/generate-html-wireframe

# Correct design theme for Microsoft Learn
{
  "description": "learn home page",
  "designTheme": "microsoftlearn"
}
```

### ❌ Common Mistakes to Avoid

```bash
# Wrong endpoint (404 error)
curl -X POST http://localhost:7071/api/generate-wireframe

# Wrong design theme (won't trigger Learn template)
{
  "description": "learn home page",
  "designTheme": "learnhomepage"  # ❌ Should be "microsoftlearn"
}
```

## API Endpoint

**URL:** `POST /api/generate-html-wireframe`

**Note:** The route is `generate-html-wireframe` (with hyphens), not `generateWireframe`

## Request Parameters

| Parameter     | Type   | Required | Valid Values               | Description                          |
| ------------- | ------ | -------- | -------------------------- | ------------------------------------ |
| `description` | string | ✅ Yes   | Any string                 | Description of wireframe to generate |
| `designTheme` | string | No       | `"microsoftlearn"`, others | Design theme for template selection  |

## Design Themes

| Theme Value        | Template                  | Use Case                                                           |
| ------------------ | ------------------------- | ------------------------------------------------------------------ |
| `"microsoftlearn"` | Microsoft Learn Home Page | Official Microsoft Learn styling with search, header, hero section |
| Other values       | Generic wireframe         | Standard wireframe templates                                       |

## Complete Examples

### Microsoft Learn Home Page

```bash
curl -X POST http://localhost:7071/api/generate-html-wireframe \
  -H "Content-Type: application/json" \
  -d '{
    "description": "learn home page with search functionality",
    "designTheme": "microsoftlearn"
  }'
```

### Generic Wireframe

```bash
curl -X POST http://localhost:7071/api/generate-html-wireframe \
  -H "Content-Type: application/json" \
  -d '{
    "description": "dashboard with navigation and charts"
  }'
```

## Response Format

```json
{
  "html": "<html>...</html>",
  "fallback": true,
  "error": "Used fallback wireframe due to API error"
}
```

## Troubleshooting

### 404 Error

- ✅ Use `/api/generate-html-wireframe`
- ❌ Not `/api/generate-wireframe`

### Learn Template Not Loading

- ✅ Use `"designTheme": "microsoftlearn"`
- ❌ Not `"designTheme": "learnhomepage"`

### Missing Description Error

- ✅ Include `"description"` in request body
- ❌ Don't send empty or missing description

## Testing Commands

```bash
# Test endpoint is working
curl -v http://localhost:7071/api/generate-html-wireframe

# Test Microsoft Learn template
curl -s -X POST http://localhost:7071/api/generate-html-wireframe \
  -H "Content-Type: application/json" \
  -d '{"description": "learn home page", "designTheme": "microsoftlearn"}' \
  | grep -o "Microsoft Learn Home Page"

# Test search button with Atlas classes
curl -s -X POST http://localhost:7071/api/generate-html-wireframe \
  -H "Content-Type: application/json" \
  -d '{"description": "learn home page", "designTheme": "microsoftlearn"}' \
  | grep -o "button button-primary button-filled button-lg"
```

## Backend Logs

The API provides helpful logging to identify issues:

```
ℹ️ API Info: {
  endpoint: '/api/generate-html-wireframe',
  correctDesignTheme: 'microsoftlearn',
  receivedTheme: 'your-theme-here'
}
```

Watch the logs to ensure you're using the correct parameters!
