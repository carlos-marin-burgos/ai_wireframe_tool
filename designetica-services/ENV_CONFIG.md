# Environment Configuration

This document describes the environment variables and configuration needed for the Designetica Figma Code Connect services.

## Required Environment Variables

### Figma API Configuration

Create a `.env` file in the `designetica-services` directory with the following variables:

```bash
# Figma API Access Token
# Get this from: https://www.figma.com/developers/api#access-tokens
FIGMA_ACCESS_TOKEN=your_figma_access_token_here

# Figma File Key (already configured in figma.config.json)
FIGMA_FILE_KEY=wSppVRlOi9JZO2LxtHUbbW

# Optional: Custom API settings
FIGMA_API_TIMEOUT=10000
FIGMA_RATE_LIMIT=100
```

## Setup Instructions

### 1. Get Figma Access Token

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Scroll down to "Personal access tokens"
3. Click "Create new token"
4. Name it "Designetica Code Connect"
5. Copy the token and add it to your `.env` file

### 2. Install Dependencies

```bash
cd designetica-services
npm install
```

### 3. Verify Configuration

```bash
node -e "
const FigmaService = require('./figmaService.js');
const service = new FigmaService();
service.validateConnection().then(result => console.log(result));
"
```

## Service Configuration

### Code Connect Service

The `codeConnectService.js` manages the mapping between Figma components and React components.

**Default Component Mappings:**

- Button components → `../src/components/ui/Button.tsx`
- Modal components → `../src/components/SaveWireframeModal.tsx`
- Input components → `../src/components/ui/Input.tsx`
- Navigation components → `../src/components/PageNavigation.tsx`

### Figma Service

The `figmaService.js` handles all Figma API interactions:

- Fetching component definitions
- Extracting design tokens
- Exporting component images
- Syncing with Figma files

### Component Detection Service

The `componentDetectionService.js` automatically scans your React components:

- Detects component types
- Extracts props and interfaces
- Analyzes component complexity
- Suggests Figma mappings

## Usage Examples

### Initialize Services

```javascript
const CodeConnectService = require("./codeConnectService.js");
const FigmaService = require("./figmaService.js");
const ComponentDetectionService = require("./componentDetectionService.js");

const codeConnect = new CodeConnectService();
const figma = new FigmaService();
const detector = new ComponentDetectionService();
```

### Detect Components

```javascript
const components = await detector.detectComponents();
console.log(`Found ${components.length} components`);
```

### Sync with Figma

```javascript
const syncResult = await codeConnect.syncWithFigma();
console.log("Sync completed:", syncResult);
```

### Generate Design Tokens

```javascript
const tokens = await figma.getDesignTokens();
console.log("Design tokens:", tokens);
```

## Configuration Files

### figma.config.json (Project Root)

Already configured with:

```json
{
  "codeConnect": {
    "include": ["src/**/*.{tsx,jsx}"],
    "label": "React",
    "interactiveSetupFigmaFileUrl": "https://www.figma.com/design/wSppVRlOi9JZO2LxtHUbbW/Fluent-2-Extended-Figma-Library?m=auto&node-id=3232-54"
  }
}
```

### package.json (Services)

Dependencies:

- `@figma/code-connect` - Official Figma Code Connect library
- `axios` - HTTP client for Figma API
- `dotenv` - Environment variable management

## Troubleshooting

### Common Issues

1. **Invalid API Token**

   - Verify token in Figma settings
   - Check token permissions
   - Ensure token is not expired

2. **File Access Issues**

   - Verify file permissions in Figma
   - Check if file URL is correct
   - Ensure file is not private

3. **Component Detection Issues**
   - Check file paths in component mappings
   - Verify TypeScript interfaces exist
   - Ensure components export properly

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=designetica:*
```

### API Rate Limits

Figma API has rate limits:

- 500 requests per minute per token
- Batch requests when possible
- Implement retry logic for rate limit errors

## Security Notes

- Never commit `.env` files to version control
- Rotate API tokens regularly
- Use environment-specific tokens for different deployments
- Monitor API usage in Figma dashboard
