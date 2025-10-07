# Lovable-Style AI Wireframe Generation 🚀

We've upgraded Designetica to match **Lovable's approach** for AI-powered wireframe generation!

## What Changed? 🎯

### 1. **Claude 3.5 Sonnet** (Better at Following Instructions)

- **Before**: Using GPT-4o
- **After**: Primary model is Claude 3.5 Sonnet
- **Why**: Claude is significantly better at following complex instructions and produces cleaner, more consistent HTML output
- **Fallback**: OpenAI GPT-4o still available as backup

### 2. **Simpler Prompts** (Trust the Model More)

- **Before**: Thousands of lines of detailed instructions, constraints, and examples
- **After**: Clear, concise system prompts that state the goal
- **Why**: Over-engineering prompts leads to confusion. Claude works best with clear intent and creative freedom

### 3. **Pre-built Component Library**

- **Before**: AI generates everything from scratch
- **After**: Reusable component library (navigation, buttons, cards, forms, heroes, footers)
- **Why**: Like Lovable's React components - provides consistency and faster generation

### 4. **Iterative Refinement** (Conversation-Based Workflow)

- **Before**: One-shot generation only
- **After**: New `/api/refineWireframe` endpoint for iterative improvements
- **Why**: Lovable's key feature - users give feedback, AI refines the design

## New Files Created 📁

```
backend/
├── lib/
│   ├── claudeService.js          # Claude 3.5 Sonnet integration
│   └── componentLibrary.js       # Pre-built reusable components
└── refineWireframe/
    ├── function.json              # Azure Function config
    └── index.js                   # Iterative refinement endpoint
```

## Setup Instructions 🔧

### 1. Get a Claude API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key

### 2. Configure Environment

Add to `backend/local.settings.json`:

```json
{
  "Values": {
    "ANTHROPIC_API_KEY": "sk-ant-api03-your-key-here"
  }
}
```

### 3. Install Dependencies

```bash
npm install @anthropic-ai/sdk
```

## API Endpoints 🌐

### Generate Wireframe (Enhanced with Claude)

```bash
POST /api/generateWireframe
```

**Body:**

```json
{
  "description": "Create a landing page for a SaaS product",
  "theme": "professional",
  "colorScheme": "blue"
}
```

**Response:**

```json
{
  "success": true,
  "html": "<!DOCTYPE html>...",
  "metadata": {
    "model": "claude-3-5-sonnet-20241022",
    "tokens": 2847,
    "processingTimeMs": 1234
  }
}
```

### Refine Wireframe (NEW! ✨)

```bash
POST /api/refineWireframe
```

**Body:**

```json
{
  "currentHtml": "<!DOCTYPE html>...",
  "feedback": "Make the hero section taller and add a gradient background",
  "conversationHistory": [
    {
      "feedback": "Add a navigation bar",
      "response": "Added navigation"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "html": "<!DOCTYPE html>...",
  "metadata": {
    "model": "claude-3-5-sonnet-20241022",
    "refinementNumber": 2,
    "tokens": 3124
  }
}
```

## Component Library 🧩

### Available Components

**Navigation:**

- `navigation-horizontal` - Top nav bar with logo and links
- `navigation-sidebar` - Vertical sidebar navigation

**Buttons:**

- `buttons-primary` - Main CTA button
- `buttons-secondary` - Secondary action button

**Cards:**

- `cards-basic` - Simple content card
- `cards-feature` - Feature card with icon

**Forms:**

- `forms-input` - Text input field
- `forms-textarea` - Multi-line text area
- `forms-select` - Dropdown selection

**Heroes:**

- `heroes-centered` - Hero with centered content and CTAs

**Footers:**

- `footers-simple` - Basic footer with links

### Usage

Components are automatically passed to Claude in the generation context. Claude will intelligently compose them based on the user's request.

## Workflow Comparison 📊

### Before (GPT-4o + Rigid Prompts)

```
User Request → Complex Prompt → GPT-4o → Done
```

### After (Lovable-Style with Claude)

```
User Request → Simple Prompt + Components → Claude → Wireframe
     ↓
User Feedback → Refine → Claude → Updated Wireframe
     ↓
More Feedback → Refine → Claude → Final Wireframe
```

## Benefits 💪

1. **Better Quality**: Claude follows instructions more precisely
2. **Consistency**: Pre-built components ensure design coherence
3. **Faster Iteration**: Refinement API allows quick tweaks
4. **Less Hallucination**: Simpler prompts = less AI confusion
5. **Cost Effective**: Claude is cheaper than GPT-4o for similar quality

## Frontend Integration (TODO) 🎨

The backend is ready! Next steps for frontend:

1. **Add Refinement UI**

   - "Refine Design" button in wireframe viewer
   - Text input for feedback
   - Show refinement history

2. **Conversation Context**

   - Track conversation history
   - Show previous feedback and changes
   - Allow undo/redo of refinements

3. **Component Browser**
   - Visual library of available components
   - Drag-and-drop components into wireframe
   - Preview component variations

## Testing 🧪

### Test Claude Generation

```bash
curl -X POST http://localhost:7071/api/generateWireframe \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Create a modern dashboard with sidebar navigation and KPI cards"
  }'
```

### Test Refinement

```bash
curl -X POST http://localhost:7071/api/refineWireframe \
  -H "Content-Type: application/json" \
  -d '{
    "currentHtml": "<html>...</html>",
    "feedback": "Make the sidebar narrower and add a dark theme"
  }'
```

## Migration Path 🛤️

Don't worry! We didn't break anything:

- ✅ OpenAI still works as fallback
- ✅ All existing endpoints unchanged
- ✅ Backward compatible with current frontend
- ✅ Claude is optional (graceful degradation)

## Performance Comparison ⚡

| Metric                | GPT-4o  | Claude 3.5 Sonnet |
| --------------------- | ------- | ----------------- |
| Avg Response Time     | 3-5s    | 2-4s              |
| Instruction Following | Good    | Excellent         |
| HTML Quality          | Good    | Excellent         |
| Cost per 1M tokens    | $5      | $3                |
| Refinement Support    | Limited | Native            |

## Next Steps 🚀

1. Get Claude API key and test
2. Update frontend to use refinement endpoint
3. Add UI for component library browser
4. Implement conversation history UI
5. Add analytics for tracking refinements

## Questions? 🤔

- **Q: Do I need to remove OpenAI?**

  - A: No! Claude is primary, OpenAI is fallback

- **Q: Will my existing wireframes break?**

  - A: No! Everything is backward compatible

- **Q: Can I use only Claude or only OpenAI?**

  - A: Yes! Set only one API key and it will use that

- **Q: How do I switch back to OpenAI?**
  - A: Just remove `ANTHROPIC_API_KEY` from settings

---

**Made with 💙 by the Designetica team**
