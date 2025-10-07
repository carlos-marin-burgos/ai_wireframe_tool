# 🚀 Quick Start: Lovable-Style Wireframe Generation

## Setup in 3 Minutes ⚡

### Step 1: Get Claude API Key (2 min)

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Click "API Keys" in sidebar
4. Click "Create Key"
5. Copy your key (starts with `sk-ant-api03-`)

### Step 2: Configure (30 sec)

Open `backend/local.settings.json` and add:

```json
{
  "Values": {
    "ANTHROPIC_API_KEY": "sk-ant-api03-YOUR-KEY-HERE"
  }
}
```

### Step 3: Test (30 sec)

```bash
# Start backend
cd backend
func start

# In another terminal, test generation
curl -X POST http://localhost:7071/api/generateWireframe \
  -H "Content-Type: application/json" \
  -d '{"description": "Create a modern landing page"}'
```

## ✅ That's it! You're ready!

## Quick Examples

### Generate a Wireframe

```typescript
import lovableWireframeService from "./services/lovableWireframeService";

// Generate
const result = await lovableWireframeService.generate(
  "Create a dashboard with KPI cards and charts"
);

console.log(result.html); // Your wireframe!
```

### Refine a Wireframe

```typescript
// Refine
const refined = await lovableWireframeService.refine(
  result.html,
  "Make the cards bigger and add a dark mode"
);

console.log(refined.html); // Updated wireframe!
```

## 🎯 What You Get

✅ Claude 3.5 Sonnet (best at instructions)  
✅ Pre-built components (buttons, cards, forms, etc.)  
✅ Iterative refinement (give feedback, get improvements)  
✅ Simple API (2 endpoints, easy to use)  
✅ Backward compatible (OpenAI still works)

## 📖 Full Documentation

- **Complete Guide**: `LOVABLE_UPGRADE.md`
- **Implementation Details**: `LOVABLE_IMPLEMENTATION_COMPLETE.md`
- **Examples**: `examples/lovable-wireframe-examples.tsx`

## 🆘 Troubleshooting

**Problem**: "Claude not initialized"  
**Solution**: Check that `ANTHROPIC_API_KEY` is set in `local.settings.json`

**Problem**: Generation fails  
**Solution**: System automatically falls back to OpenAI GPT-4o

**Problem**: Slow responses  
**Solution**: Claude typically responds in 2-4 seconds. Check your internet connection.

## 💬 Support

Need help? Check:

1. `LOVABLE_UPGRADE.md` - Full documentation
2. `examples/lovable-wireframe-examples.tsx` - Code examples
3. Backend logs - `backend/` folder

---

**Happy Wireframing! ✨**
