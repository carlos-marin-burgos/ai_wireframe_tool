# 🚀 Canvas App Quick Build Guide

## 📱 **Screen Layout (Copy-Paste Ready)**

### **1. Add Header Controls**

**Text Label (Header):**

```powerquery
Text: "🎨 Designetica Wireframe Studio"
Font: Font.'Segoe UI'
FontSize: 24
FontWeight: FontWeight.Bold
Color: RGBA(0, 120, 212, 1)
X: 40
Y: 20
Width: 600
Height: 50
```

**Rectangle (Header Background):**

```powerquery
Fill: RGBA(248, 249, 250, 1)
X: 0
Y: 0
Width: Parent.Width
Height: 80
```

### **2. Add Input Section**

**Text Input (Description):**

```powerquery
Name: TextInput_Description
Default: "Create a login form with username, password, and submit button"
HintText: "Describe your wireframe in detail..."
Mode: TextMode.MultiLine
X: 40
Y: 100
Width: 500
Height: 120
FontSize: 14
```

**Dropdown (Theme):**

```powerquery
Name: Dropdown_Theme
Items: [
    {Value: "microsoftlearn", Label: "Microsoft Learn"},
    {Value: "minimal", Label: "Minimal"},
    {Value: "modern", Label: "Modern"},
    {Value: "classic", Label: "Classic"}
]
DefaultSelectedItems: [{Value: "microsoftlearn", Label: "Microsoft Learn"}]
X: 40
Y: 240
Width: 200
Height: 40
```

### **3. Add Action Button**

**Button (Generate):**

```powerquery
Name: Button_Generate
Text: "🤖 Generate Wireframe"
OnSelect: |
    Set(IsLoading, true);
    Set(ErrorMessage, "");
    Set(WireframeHTML, "");

    IfError(
        Set(
            APIResponse,
            'Designetica Wireframe Generator'.GenerateWireframe({
                description: TextInput_Description.Text,
                theme: Dropdown_Theme.Selected.Value,
                colorScheme: "primary"
            })
        );

        Set(WireframeHTML, APIResponse.html);
        Set(IsLoading, false);
        Set(GenerationTime, APIResponse.processingTimeMs);
        Set(CorrelationId, APIResponse.correlationId);
        Notify("✅ Wireframe generated successfully!", NotificationType.Success),

        Set(IsLoading, false);
        Set(ErrorMessage, "❌ Error: " & FirstError.Message);
        Notify("Failed to generate wireframe. Please try again.", NotificationType.Error)
    )

X: 260
Y: 240
Width: 200
Height: 40
Fill: RGBA(0, 120, 212, 1)
Color: RGBA(255, 255, 255, 1)
FontWeight: FontWeight.Bold
DisplayMode: If(IsLoading Or Len(Trim(TextInput_Description.Text)) < 10, DisplayMode.Disabled, DisplayMode.Edit)
```

### **4. Add Loading Indicator**

**Label (Loading):**

```powerquery
Name: Label_Loading
Text: "🤖 AI is generating your wireframe... This may take 15-30 seconds."
Visible: IsLoading
Color: RGBA(0, 120, 212, 1)
FontWeight: FontWeight.Semibold
X: 40
Y: 300
Width: 500
Height: 50
```

**Circle (Spinner):**

```powerquery
Name: Loading_Circle
Fill: RGBA(0, 120, 212, 1)
Visible: IsLoading
X: 40
Y: 350
Width: 20
Height: 20
```

### **5. Add Result Display**

**HTML Text (Wireframe Display):**

```powerquery
Name: HtmlText_Wireframe
HtmlText: WireframeHTML
Visible: !IsLoading And IsBlank(ErrorMessage) And !IsBlank(WireframeHTML)
X: 40
Y: 380
Width: Parent.Width - 80
Height: 400
BorderStyle: BorderStyle.Solid
BorderColor: RGBA(200, 200, 200, 1)
```

**Button (Download HTML):**

```powerquery
Name: Button_Download
Text: "📥 Download HTML"
OnSelect: Launch("data:text/html;charset=utf-8," & EncodeUrl(WireframeHTML))
Visible: !IsBlank(WireframeHTML) And !IsLoading
X: 40
Y: 800
Width: 150
Height: 40
Fill: RGBA(16, 124, 16, 1)
Color: RGBA(255, 255, 255, 1)
```

**Button (Copy HTML):**

```powerquery
Name: Button_Copy
Text: "📋 Copy HTML"
OnSelect: |
    Set(ClipboardData, WireframeHTML);
    Notify("HTML copied to clipboard!", NotificationType.Success)
Visible: !IsBlank(WireframeHTML) And !IsLoading
X: 200
Y: 800
Width: 150
Height: 40
Fill: RGBA(106, 106, 106, 1)
Color: RGBA(255, 255, 255, 1)
```

### **6. Add Error Display**

**Label (Error):**

```powerquery
Name: Label_Error
Text: ErrorMessage
Visible: !IsBlank(ErrorMessage)
Color: RGBA(196, 43, 28, 1)
X: 40
Y: 300
Width: 500
Height: 80
```

### **7. Add Info Panel**

**Label (Instructions):**

```powerquery
Name: Label_Instructions
Text: "💡 Tips: Be specific in your description. Mention colors, layout, components you want. The AI works best with detailed requirements!"
Color: RGBA(106, 106, 106, 1)
FontSize: 12
X: 580
Y: 100
Width: 300
Height: 100
```

**Label (Generation Info):**

```powerquery
Name: Label_GenerationInfo
Text: If(
    !IsBlank(GenerationTime),
    "⏱️ Generated in " & Text(GenerationTime / 1000, "0.0") & " seconds" & Char(10) &
    "🆔 ID: " & Left(CorrelationId, 8),
    ""
)
Visible: !IsBlank(GenerationTime)
Color: RGBA(106, 106, 106, 1)
FontSize: 10
X: 580
Y: 220
Width: 300
Height: 60
```

## 🎨 **App Variables (OnStart)**

```powerquery
// App OnStart Event
Set(IsLoading, false);
Set(ErrorMessage, "");
Set(WireframeHTML, "");
Set(GenerationTime, 0);
Set(CorrelationId, "");
Set(ClipboardData, "");

// App settings
Set(AppTitle, "🎨 Designetica Wireframe Studio");
Set(AppVersion, "v1.0");
```

## 📱 **Responsive Design Adjustments**

```powerquery
// For Width-based responsive design
Width: If(App.Width > 1200, 800, If(App.Width > 768, App.Width * 0.9, App.Width - 20))

// For Height-based responsive design
Height: If(App.Height > 600, 400, App.Height * 0.4)

// Font size adjustments
FontSize: If(App.Width > 768, 14, 12)
```

## ✅ **Quick Test Steps**

1. **Save the app** (Ctrl+S)
2. **Preview** (F5 or Play button)
3. **Test with simple input:**
   - Description: "Create a blue button with white text"
   - Theme: Microsoft Learn
   - Click Generate

**Expected:** Should return HTML wireframe in 15-30 seconds!

## 🎯 **Pro Tips**

- **Input Validation:** App prevents generation with descriptions < 10 characters
- **Error Handling:** Shows user-friendly error messages
- **Loading States:** Clear feedback during AI processing
- **Results Management:** Easy download and copy functionality
- **Mobile Ready:** Responsive design works on phones/tablets

**🚀 Your Canvas App is ready to generate amazing wireframes!**
