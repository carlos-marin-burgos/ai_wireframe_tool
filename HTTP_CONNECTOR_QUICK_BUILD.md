# 🚀 HTTP Connector Quick Build - 30 Minutes

## 📱 **Controls to Add (In Order)**

### **1. Header Text**

```
Control: Text Label
Name: HeaderLabel
Text: "🎨 Designetica Wireframe Studio"
X: 40, Y: 20, Width: 600, Height: 50
FontSize: 24
FontWeight: FontWeight.Bold
Color: RGBA(0, 120, 212, 1)
```

### **2. Description Input**

```
Control: Text Input
Name: DescriptionInput
Default: "Create a login form with username, password, and submit button"
Mode: TextMode.MultiLine
X: 40, Y: 100, Width: 500, Height: 100
FontSize: 14
HintText: "Describe your wireframe..."
```

### **3. Theme Dropdown**

```
Control: Dropdown
Name: ThemeDropdown
Items: ["microsoftlearn", "minimal", "modern", "classic"]
DefaultSelectedItems: ["microsoftlearn"]
X: 40, Y: 220, Width: 200, Height: 40
```

### **4. Generate Button**

```
Control: Button
Name: GenerateButton
Text: "🤖 Generate Wireframe"
X: 260, Y: 220, Width: 200, Height: 40
Fill: RGBA(0, 120, 212, 1)
Color: RGBA(255, 255, 255, 1)
FontWeight: FontWeight.Bold
```

### **5. Loading Label**

```
Control: Text Label
Name: LoadingLabel
Text: "🤖 Generating wireframe... Please wait 15-30 seconds..."
Visible: false
Color: RGBA(0, 120, 212, 1)
X: 40, Y: 280, Width: 500, Height: 40
```

### **6. HTML Display**

```
Control: HTML Text
Name: WireframeDisplay
HtmlText: ""
Visible: false
X: 40, Y: 340, Width: 700, Height: 400
BorderStyle: BorderStyle.Solid
BorderColor: RGBA(200, 200, 200, 1)
```

### **7. Download Button**

```
Control: Button
Name: DownloadButton
Text: "📥 Download HTML"
Visible: false
X: 40, Y: 760, Width: 150, Height: 40
Fill: RGBA(16, 124, 16, 1)
Color: RGBA(255, 255, 255, 1)
```

## ⚡ **Key Formulas**

### **App OnStart:**

```powerquery
Set(IsLoading, false);
Set(WireframeHTML, "");
Set(HasResult, false)
```

### **Generate Button OnSelect:**

```powerquery
// Set loading state
Set(IsLoading, true);
Set(HasResult, false);
UpdateContext({LoadingLabel.Visible: true, WireframeDisplay.Visible: false, DownloadButton.Visible: false});

// Make HTTP request
Set(
    APIResult,
    HTTP.Invoke(
        "https://func-designetica-prod-rjsqzg4bs3fc6.azurewebsites.net/api/generate-wireframe",
        "POST",
        {
            "Content-Type": "application/json"
        },
        JSON(
            {
                description: DescriptionInput.Text,
                theme: ThemeDropdown.Selected.Value,
                colorScheme: "primary"
            }
        )
    )
);

// Process response
If(
    !IsEmpty(APIResult) And !IsError(APIResult),
    Set(WireframeHTML, ParseJSON(APIResult).html);
    Set(IsLoading, false);
    Set(HasResult, true);
    UpdateContext({LoadingLabel.Visible: false, WireframeDisplay.Visible: true, DownloadButton.Visible: true});
    Notify("✅ Wireframe generated successfully!", NotificationType.Success),

    Set(IsLoading, false);
    UpdateContext({LoadingLabel.Visible: false});
    Notify("❌ Error generating wireframe. Please try again.", NotificationType.Error)
)
```

### **Loading Label Visible:**

```powerquery
IsLoading
```

### **HTML Display HtmlText:**

```powerquery
WireframeHTML
```

### **HTML Display Visible:**

```powerquery
HasResult And !IsLoading
```

### **Download Button OnSelect:**

```powerquery
Launch("data:text/html;charset=utf-8," & EncodeUrl(WireframeHTML))
```

### **Download Button Visible:**

```powerquery
HasResult And !IsLoading
```

## 🧪 **Quick Test Steps**

1. **Save** app (Ctrl+S)
2. **Preview** (F5)
3. **Enter description:** "Create a red warning box"
4. **Select theme:** microsoftlearn
5. **Click Generate**
6. **Wait 15-30 seconds**
7. **See beautiful HTML wireframe appear!**

## 🎯 **Troubleshooting**

**If HTTP connector gives errors:**

- Make sure you selected "HTTP" not "HTTP with Azure AD"
- Ensure the URL is exactly: `https://func-designetica-prod-rjsqzg4bs3fc6.azurewebsites.net/api/generate-wireframe`
- Check the JSON format in the request body

**If nothing appears:**

- Check browser console for errors
- Verify the APIResult variable has data
- Test with simple description first

## ✅ **Success Indicators**

- ✅ Button shows loading state
- ✅ API call completes (15-30 seconds)
- ✅ HTML appears in display area
- ✅ Download button becomes visible
- ✅ Full responsive wireframe generated

**🚀 You'll have a working AI wireframe generator in Power Apps!**
