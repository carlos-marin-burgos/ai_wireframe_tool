# 🎨 How to Create a Test Figma File for the Integration

Since most Figma files require authentication even if they're public, the best way to test the integration is to create your own simple test file.

## ⚡ Quick Setup (5 minutes)

### Step 1: Create a Simple Figma File

1. Go to https://figma.com and sign in
2. Click "New" → "Design file"
3. Name it "Wireframe Test"

### Step 2: Add Some Basic Shapes

1. Add a few rectangles (for containers/cards)
2. Add some text elements (for headings/paragraphs)
3. Add circles (for buttons/avatars)
4. Group them into frames (right-click → "Frame")
5. Name your frames descriptively (e.g., "Header", "Card Component", "Footer")

### Step 3: Get the File URL

1. In your Figma file, click "Share" in the top-right
2. Make sure "Anyone with the link can view" is selected
3. Copy the file URL (it should look like: `https://www.figma.com/file/ABC123/Your-File-Name`)

### Step 4: Test the Integration

1. Get your Figma access token from https://www.figma.com/developers/api#access-tokens
2. Paste the token in the wireframe tool
3. Paste your file URL
4. Import your frames!

## 🎯 What Makes a Good Test File

- **Simple shapes**: Rectangles, circles, text
- **Clear frame structure**: Each artboard should be in its own frame
- **Logical grouping**: Group related elements together
- **Descriptive names**: Name your frames and layers clearly

## 🛠️ Example File Structure

```
📄 Wireframe Test File
├── 🖼️ Frame: "Landing Page Header"
│   ├── Rectangle (background)
│   ├── Text (title)
│   └── Rectangle (button)
├── 🖼️ Frame: "Product Card"
│   ├── Rectangle (image placeholder)
│   ├── Text (product name)
│   └── Text (price)
└── 🖼️ Frame: "Footer"
    ├── Rectangle (background)
    └── Text (copyright)
```

## ✅ Testing Checklist

- [ ] Figma file is created and public
- [ ] File contains at least 2-3 frames
- [ ] Frames have descriptive names
- [ ] You have a valid Figma access token
- [ ] File URL is copied correctly
- [ ] Token is pasted in the integration modal

This approach ensures you have full control over the test data and can verify that the integration works properly with your own content!
