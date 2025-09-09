# 🎨 Figma Component Selection Guide

## Current Status

- **Total Components**: 100 (50 from Atlas Design + 50 from Fluent Design)
- **Quality Filtering**: ✅ Active (excludes variants and low-quality components)
- **Categories**: 8 main categories available
- **Libraries**: Atlas Design & Fluent Design

## What Components Do You Want?

### 1. **Wireframe Essentials** (Most Important)

Please specify which of these are most important for your wireframing needs:

#### Navigation & Structure

- [ ] **Hero Sections** - Landing page headers with CTAs
- [ ] **Navigation Bars** - Site navigation and menus
- [ ] **Breadcrumbs** - Page location indicators
- [ ] **Footers** - Site footer with links and info

#### Content & Layout

- [ ] **Content Cards** - Information display containers
- [ ] **Grid Layouts** - Multi-column content layouts
- [ ] **Sections** - Page content sections with headers
- [ ] **Sidebars** - Secondary navigation and content

#### Actions & Interactions

- [ ] **Call-to-Action Buttons** - Primary action buttons
- [ ] **Form Buttons** - Submit, cancel, secondary actions
- [ ] **Link Buttons** - Text-based navigation links
- [ ] **Icon Buttons** - Compact action triggers

#### Forms & Input

- [ ] **Contact Forms** - User contact and inquiry forms
- [ ] **Newsletter Signup** - Email subscription forms
- [ ] **Search Forms** - Site search functionality
- [ ] **Login/Signup Forms** - User authentication

### 2. **UI Components** (Secondary Priority)

Which specific UI components do you need most?

#### Data Display

- [ ] **Tables** - Structured data presentation
- [ ] **Lists** - Ordered and unordered content
- [ ] **Avatars** - User profile images
- [ ] **Badges** - Status and category indicators

#### Feedback & Communication

- [ ] **Alerts** - Success, error, warning messages
- [ ] **Notifications** - System and user notifications
- [ ] **Modals** - Overlay dialogs and confirmations
- [ ] **Tooltips** - Contextual help and information

#### Form Controls

- [ ] **Input Fields** - Text, email, password inputs
- [ ] **Dropdowns** - Selection menus and pickers
- [ ] **Checkboxes** - Boolean selection controls
- [ ] **Radio Buttons** - Single selection controls

### 3. **Component Exclusions**

What should we avoid importing?

- [ ] **Low-level variants** (Size=Medium, State=Rest, etc.)
- [ ] **Technical components** (Development-only components)
- [ ] **Outdated components** (Legacy or deprecated items)
- [ ] **Complex compositions** (Multi-component assemblies)

## Configuration Questions

### Library Preferences

1. **Atlas Design vs Fluent Design** - Which should we prioritize?

   - Atlas Design: Marketing/landing page focused
   - Fluent Design: Enterprise/application focused

2. **Component Maturity** - What level of completeness do you need?
   - Production-ready only
   - Include work-in-progress components
   - Include experimental/concept components

### Use Case Focus

1. **Primary Use Case** - What are you building?

   - Marketing websites
   - Web applications
   - Dashboards
   - E-commerce sites
   - Corporate websites

2. **Target Audience** - Who will use these wireframes?
   - Developers (need technical accuracy)
   - Designers (need visual fidelity)
   - Stakeholders (need concept clarity)
   - Clients (need presentation quality)

## Next Steps

1. **Review Current Components**: Check the component browser to see what's currently available
2. **Specify Requirements**: Fill out the checkboxes above with your priorities
3. **Configure Filtering**: I'll update the filtering logic based on your needs
4. **Test & Iterate**: We'll refine the selection based on your feedback

## Technical Details

### Current Filtering Logic

```javascript
// Quality filtering removes:
- Components with "=" in names (variants)
- Size-only components (Small, Medium, Large)
- State variants (Hover, Focus, Active)
- Technical frames and pages

// Prioritizes:
- Component sets (main components)
- Clean names without slashes
- Common UI patterns (button, card, nav, etc.)
```

### File Configuration

- **Selection Criteria**: `/config/component-selection.json`
- **Backend Logic**: `/backend/figmaComponents/index.js`
- **Frontend Browser**: `/src/components/FigmaComponentBrowser.tsx`

---

**Let me know your preferences and I'll configure the component selection to match your exact needs!**
