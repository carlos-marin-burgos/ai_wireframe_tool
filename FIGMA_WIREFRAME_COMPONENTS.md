# Figma Low-Fi Wireframe Kit - Component Reference

This file contains the node IDs for different sections of the Lookscout Low-Fi Wireframe Kit that you can import using the `figma-wireframe-import` function.

## Usage

```javascript
POST http://localhost:7072/api/figma-wireframe-import
Content-Type: application/json

{
  "nodeIds": "3312:105532",  // Choose from the IDs below
  "preserveText": true,      // Keep actual text content (optional)
  "inlineCss": true,         // Include embedded CSS (default: true)
  "wrapRoot": true          // Wrap in container div (default: true)
}
```

## Available Component Sections

### 🔗 Shared Components (RECOMMENDED)

- **Node ID**: `3312:105532`
- **Description**: Core reusable wireframe components (search, dropdowns, buttons, calendars, etc.)
- **Status**: ✅ Successfully imported - 437KB of wireframe HTML

### 📱 Mobile Wireframes

- **Navigation**: `4302:1085774`
- **Headers & Submenus**: `4315:345026`
- **Cards & Widgets**: `4315:345027`
- **Charts & Tables**: `3312:105533`
- **Listing Items**: `4302:1097355`
- **Slideouts**: `4302:1108936`

### 🖥️ Website Components

- **Page Headers**: `3312:105535`
- **Hero Sections**: `4302:1228097`
- **Blog Posts**: `4302:1300791`
- **Call to Actions**: `4302:1373485`
- **Features**: `4302:1446179`
- **Logos**: `4302:1518873`
- **Team**: `4302:1591567`
- **Left & Right Sections**: `4303:345966`
- **Footers**: `4303:418660`
- **Testimonials**: `4303:491354`
- **FAQs**: `4303:564048`
- **Forms**: `4303:636742`
- **Web Tables**: `4303:709436`
- **Pricing Tables**: `4303:854824`
- **Gallery**: `4304:334617`
- **Contact Us**: `4304:329295`

### 💻 Dashboard Components

- **Sidebars & Menus**: `4302:1120517`
- **Navigation**: `4302:1142033`
- **Cards & Widgets**: `4302:1163549`
- **Charts**: `4315:343345`
- **Tables**: `4302:1185065`
- **Filters**: `4302:1206581`

### 📦 E-Commerce Components

- **Product Listings**: `4314:343132`
- **Product Details**: `4314:330105`
- **Categories**: `4303:782130`
- **Filters**: `4315:315712`

## Component Sets (Individual Components)

- **Lo-Fi UX Hero**: `2846:413761`
- **Low-Fi Page Header**: `2843:410948`
- **Low-Fi Button**: `2837:408182`
- **Lo-Fi Text**: `3584:393155`
- **Low-Fi Placeholder**: `2837:413968`
- **Lo-Fi UX Features**: `2896:423428`
- **Low-Fi Avatar**: `2865:415678`

## Examples

### Import Core Shared Components

```bash
curl -X POST http://localhost:7072/api/figma-wireframe-import \
  -H 'Content-Type: application/json' \
  -d '{"nodeIds":"3312:105532","preserveText":true}'
```

### Import Multiple Component Types

```bash
curl -X POST http://localhost:7072/api/figma-wireframe-import \
  -H 'Content-Type: application/json' \
  -d '{"nodeIds":["4302:1228097","4302:1373485"],"preserveText":false}'
```

### Import Hero Section Only

```bash
curl -X POST http://localhost:7072/api/figma-wireframe-import \
  -H 'Content-Type: application/json' \
  -d '{"nodeIds":"4302:1228097"}'
```

## Generated Files

- **Last Import**: `actual-shared-components.html` (437KB)
- **Body Content**: `components-body-only.html` (2,888 lines)

## Notes

- The function automatically handles CANVAS, COMPONENT_SET, FRAME, GROUP, COMPONENT, INSTANCE, and SECTION node types
- Text content is preserved when `preserveText: true`
- All imports include low-fidelity wireframe CSS styling
- Components are wrapped in semantic CSS classes for easy styling
