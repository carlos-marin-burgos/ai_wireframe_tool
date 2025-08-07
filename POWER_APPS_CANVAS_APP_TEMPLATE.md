# 🎨 Power Apps Canvas App Example - Wireframe Generator

## 📱 **Canvas App Template for Designetica Integration**

### **App Structure**

```
Wireframe Generator App
├── Screen1 (Main)
│   ├── Header (Logo + Title)
│   ├── Input Section
│   │   ├── TextInput_Description
│   │   ├── Dropdown_Theme
│   │   └── Button_Generate
│   ├── Loading Section
│   │   └── Loading_Spinner
│   ├── Result Section
│   │   ├── HtmlText_Wireframe
│   │   └── Button_Download
│   └── Error Section
│       └── Label_Error
```

## 🔧 **Control Configuration**

### **1. Description Input**

```powerquery
// TextInput_Description properties
Default: "Create a login form with username, password, and submit button"
HintText: "Describe your wireframe in detail..."
Mode: TextMode.MultiLine
MaxLength: 1000
```

### **2. Theme Dropdown**

```powerquery
// Dropdown_Theme properties
Items: [
    {Value: "microsoftlearn", Label: "Microsoft Learn"},
    {Value: "minimal", Label: "Minimal"},
    {Value: "modern", Label: "Modern"},
    {Value: "classic", Label: "Classic"}
]
DefaultSelectedItems: [{Value: "microsoftlearn", Label: "Microsoft Learn"}]
```

### **3. Generate Button**

```powerquery
// Button_Generate OnSelect
// Set loading state
Set(IsLoading, true);
Set(ErrorMessage, "");
Set(WireframeHTML, "");

// Call the API
IfError(
    Set(
        APIResponse,
        'Designetica Wireframe Generator'.GenerateWireframe({
            description: TextInput_Description.Text,
            theme: Dropdown_Theme.Selected.Value,
            colorScheme: "primary"
        })
    );

    // Success - store the result
    Set(WireframeHTML, APIResponse.html);
    Set(IsLoading, false);
    Set(GenerationTime, APIResponse.processingTimeMs);
    Set(CorrelationId, APIResponse.correlationId),

    // Error handling
    Set(IsLoading, false);
    Set(ErrorMessage, "Error: " & FirstError.Message)
)
```

### **4. HTML Display**

```powerquery
// HtmlText_Wireframe properties
HtmlText: WireframeHTML
Width: Parent.Width - 40
Height: 600
Visible: !IsLoading And IsBlank(ErrorMessage) And !IsBlank(WireframeHTML)
```

### **5. Loading Spinner**

```powerquery
// Loading indicator
Visible: IsLoading
Text: "🤖 AI is generating your wireframe..."
```

### **6. Error Display**

```powerquery
// Label_Error properties
Text: ErrorMessage
Visible: !IsBlank(ErrorMessage)
Color: Color.Red
```

## 🎯 **Advanced Features**

### **History Tracking**

```powerquery
// Store generation history
OnStart App:
Set(WireframeHistory, [])

// After successful generation:
Set(
    WireframeHistory,
    Append(
        WireframeHistory,
        {
            Description: TextInput_Description.Text,
            Theme: Dropdown_Theme.Selected.Value,
            HTML: APIResponse.html,
            GeneratedAt: Now(),
            CorrelationId: APIResponse.correlationId,
            ProcessingTime: APIResponse.processingTimeMs
        }
    )
)
```

### **Export Functionality**

```powerquery
// Button_Download OnSelect
Launch("data:text/html;charset=utf-8," & EncodeUrl(WireframeHTML))
```

### **Copy to Clipboard**

```powerquery
// Button_Copy OnSelect
Set(
    ClipboardText,
    WireframeHTML
);
Notify("HTML copied to clipboard!", NotificationType.Success)
```

## 📊 **Gallery for History**

### **Gallery Configuration**

```powerquery
// Gallery_History properties
Items: WireframeHistory
TemplateSize: 100
Layout: Layout.Vertical

// Gallery template:
// - Label for Description (truncated)
// - Label for Theme
// - Label for Generated timestamp
// - Button to reload wireframe
```

### **Gallery Template**

```powerquery
// Label_HistoryDescription
Text: Left(ThisItem.Description, 50) & If(Len(ThisItem.Description) > 50, "...", "")

// Label_HistoryTheme
Text: "Theme: " & ThisItem.Theme

// Label_HistoryTime
Text: "Generated: " & Text(ThisItem.GeneratedAt, "mm/dd/yyyy hh:mm")

// Button_LoadHistory OnSelect
Set(WireframeHTML, ThisItem.HTML);
Set(TextInput_Description.Text, ThisItem.Description);
Set(Dropdown_Theme.Selected, {Value: ThisItem.Theme, Label: ThisItem.Theme})
```

## 🔍 **Validation and UX**

### **Input Validation**

```powerquery
// Button_Generate DisplayMode
If(
    IsBlank(TextInput_Description.Text) Or Len(Trim(TextInput_Description.Text)) < 10,
    DisplayMode.Disabled,
    DisplayMode.Edit
)

// Validation message
If(
    Len(Trim(TextInput_Description.Text)) < 10,
    "Please provide at least 10 characters for wireframe description",
    ""
)
```

### **Progressive Enhancement**

```powerquery
// Character counter
Text: Len(TextInput_Description.Text) & "/1000 characters"
Color: If(Len(TextInput_Description.Text) > 900, Color.Orange, Color.Gray)
```

### **Accessibility**

```powerquery
// Screen reader support
AccessibleLabel: "Wireframe generator main screen"
TabIndex: 1

// Button accessibility
AccessibleLabel: "Generate wireframe using AI"
TabIndex: 3
```

## 🎨 **Styling and Theming**

### **Microsoft Design Language**

```powerquery
// Color palette
Set(AppColors, {
    Primary: RGBA(0, 120, 212, 1),        // #0078d4
    Secondary: RGBA(106, 106, 106, 1),    // #6a6a6a
    Success: RGBA(16, 124, 16, 1),        // #107c10
    Warning: RGBA(255, 185, 0, 1),        // #ffb900
    Error: RGBA(196, 43, 28, 1),          // #c42b1c
    Background: RGBA(255, 255, 255, 1),   // #ffffff
    Surface: RGBA(250, 249, 249, 1)       // #faf9f9
})

// Typography
Set(AppFonts, {
    Heading: Font.'Segoe UI',
    Body: Font.'Segoe UI',
    Code: Font.'Courier New'
})
```

### **Responsive Design**

```powerquery
// Container width based on screen size
Width: If(
    App.Width > 1200, 800,
    If(App.Width > 768, App.Width * 0.8, App.Width - 20)
)

// Adaptive layout
TemplateSize: If(App.Width > 768, 120, 100)
```

## 📱 **Mobile Optimization**

### **Touch-Friendly Controls**

```powerquery
// Button sizing
Height: 48  // Minimum 44px for touch targets
Width: 200

// Input field sizing
Height: 40
Padding: 12
```

### **Mobile Navigation**

```powerquery
// Hamburger menu for mobile
Visible: App.Width < 768

// Full menu for desktop
Visible: App.Width >= 768
```

## 🔒 **Error Handling Patterns**

### **Network Errors**

```powerquery
IfError(
    /* API Call */,

    If(
        FirstError.Kind = ErrorKind.Network,
        Set(ErrorMessage, "Network error. Please check your connection."),
        If(
            FirstError.Kind = ErrorKind.Timeout,
            Set(ErrorMessage, "Request timed out. AI generation may take up to 30 seconds."),
            Set(ErrorMessage, "Unexpected error: " & FirstError.Message)
        )
    )
)
```

### **Rate Limiting**

```powerquery
// Basic rate limiting
Set(LastRequestTime, Now());
If(
    DateDiff(LastGenerationTime, Now(), Seconds) < 10,
    Notify("Please wait 10 seconds between requests", NotificationType.Warning);
    Exit(),
    /* Continue with API call */
)
```

---

## ✅ **Testing Checklist**

- [ ] API connection working
- [ ] Generate wireframe successful
- [ ] Error handling functional
- [ ] Loading states working
- [ ] HTML display rendering
- [ ] History saving/loading
- [ ] Export functionality
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Performance optimized

**Ready to create amazing wireframes in Power Apps! 🚀**
