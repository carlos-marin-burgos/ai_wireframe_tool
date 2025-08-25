/**
 * Figma Component Import API Endpoint
 * Imports selected Figma components and converts them to wireframe HTML/CSS
 */

module.exports = async function (context, req) {
  try {
    context.log("Starting Figma component import");

    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = { error: "Method not allowed" };
      return;
    }

    const { componentIds, options = {} } = req.body;

    if (
      !componentIds ||
      !Array.isArray(componentIds) ||
      componentIds.length === 0
    ) {
      context.res.status = 400;
      context.res.body = { error: "componentIds array is required" };
      return;
    }

    context.log(`Importing ${componentIds.length} components:`, componentIds);

    // Mock component data with real component mappings
    const componentDatabase = {
      "fluent-button-001": {
        id: "fluent-button-001",
        name: "Button Primary",
        category: "Actions",
        library: "Fluent UI",
        htmlCode: `<button class="btn btn-primary" type="button">
  <span class="btn-text">Primary Action</span>
</button>`,
        cssCode: `.btn {
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #0078d4;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #106ebe;
}

.btn-primary:active {
  background-color: #005a9e;
}

.btn-text {
  display: inline-block;
}`,
      },
      "fluent-button-002": {
        id: "fluent-button-002",
        name: "Button Secondary",
        category: "Actions",
        library: "Fluent UI",
        htmlCode: `<button class="btn btn-secondary" type="button">
  <span class="btn-text">Secondary Action</span>
</button>`,
        cssCode: `.btn-secondary {
  background-color: transparent;
  color: #0078d4;
  border: 1px solid #0078d4;
}

.btn-secondary:hover {
  background-color: #0078d4;
  color: #ffffff;
}

.btn-secondary:active {
  background-color: #005a9e;
  border-color: #005a9e;
}`,
      },
      "atlas-hero-001": {
        id: "atlas-hero-001",
        name: "Hero Section",
        category: "Marketing",
        library: "Atlas Design",
        htmlCode: `<section class="hero-section">
  <div class="hero-container">
    <div class="hero-content">
      <h1 class="hero-title">Welcome to Microsoft Learn</h1>
      <p class="hero-description">
        Develop your skills with our comprehensive learning paths and hands-on labs.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary">Get Started</button>
        <button class="btn btn-secondary">Browse Catalog</button>
      </div>
    </div>
    <div class="hero-image">
      <div class="hero-bg"></div>
    </div>
  </div>
</section>`,
        cssCode: `.hero-section {
  background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
  color: white;
  padding: 80px 20px;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  max-width: 500px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.hero-description {
  font-size: 18px;
  margin: 0 0 30px 0;
  opacity: 0.9;
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-image {
  text-align: center;
}

.hero-bg {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, rgba(0, 120, 212, 0.05) 0%, rgba(16, 110, 190, 0.05) 100%), url('Microsoft-Learn-keyart-neutral-gray-angle-1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  transition: background-size 0.3s ease;
}

.hero-bg:hover {
  background-size: 105%;
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-bg {
    height: 200px;
    background-size: contain;
  }
}`,
      },
      "fluent-input-001": {
        id: "fluent-input-001",
        name: "Text Input",
        category: "Forms",
        library: "Fluent UI",
        htmlCode: `<div class="form-field">
  <label class="form-label" for="input-text">
    Label Text
  </label>
  <input 
    class="form-input" 
    type="text" 
    id="input-text"
    placeholder="Enter text here..."
  />
  <div class="form-helper">Helper text or validation message</div>
</div>`,
        cssCode: `.form-field {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #323130;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #8a8886;
  border-radius: 2px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0078d4;
  box-shadow: 0 0 0 1px #0078d4;
}

.form-input::placeholder {
  color: #a19f9d;
}

.form-helper {
  font-size: 12px;
  color: #605e5c;
  margin-top: 4px;
}`,
      },
      "atlas-card-001": {
        id: "atlas-card-001",
        name: "Learning Path Card",
        category: "Cards",
        library: "Atlas Design",
        htmlCode: `<div class="learning-card">
  <div class="card-image">
    <div class="image-placeholder">🎓</div>
  </div>
  <div class="card-content">
    <div class="card-category">Learning Path</div>
    <h3 class="card-title">Azure Fundamentals</h3>
    <p class="card-description">
      Learn the basics of cloud computing and Microsoft Azure services.
    </p>
    <div class="card-meta">
      <span class="card-duration">4 hours</span>
      <span class="card-level">Beginner</span>
    </div>
    <div class="card-actions">
      <button class="btn btn-primary btn-small">Start Learning</button>
    </div>
  </div>
</div>`,
        cssCode: `.learning-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 320px;
}

.learning-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-image {
  height: 180px;
  background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 48px;
  color: white;
}

.card-content {
  padding: 20px;
}

.card-category {
  font-size: 12px;
  color: #0078d4;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #323130;
}

.card-description {
  font-size: 14px;
  color: #605e5c;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.card-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.card-duration,
.card-level {
  font-size: 12px;
  color: #8a8886;
  background: #f3f2f1;
  padding: 4px 8px;
  border-radius: 12px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 13px;
}`,
      },
      "fluent-dropdown-001": {
        id: "fluent-dropdown-001",
        name: "Dropdown Select",
        category: "Forms",
        library: "Fluent UI",
        htmlCode: `<div class="form-field">
  <label class="form-label" for="dropdown-select">
    Choose an option
  </label>
  <select class="form-select" id="dropdown-select">
    <option value="">Select an option...</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </select>
</div>`,
        cssCode: `.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #8a8886;
  border-radius: 2px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 32px;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #0078d4;
  box-shadow: 0 0 0 1px #0078d4;
}`,
      },
      "fluent-nav-001": {
        id: "fluent-nav-001",
        name: "Navigation Bar",
        category: "Navigation",
        library: "Fluent UI",
        htmlCode: `<nav class="navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <a href="#" class="brand-link">
        <span class="brand-text">Brand</span>
      </a>
    </div>
    <div class="nav-menu">
      <a href="#" class="nav-link active">Home</a>
      <a href="#" class="nav-link">Products</a>
      <a href="#" class="nav-link">Services</a>
      <a href="#" class="nav-link">About</a>
      <a href="#" class="nav-link">Contact</a>
    </div>
    <div class="nav-actions">
      <button class="btn btn-secondary btn-small">Sign In</button>
      <button class="btn btn-primary btn-small">Get Started</button>
    </div>
  </div>
</nav>`,
        cssCode: `.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e1dfdd;
  padding: 0 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
  color: #323130;
  font-size: 20px;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  gap: 24px;
  margin: 0 20px;
}

.nav-link {
  text-decoration: none;
  color: #605e5c;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #0078d4;
  background-color: #f3f2f1;
}

.nav-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
}`,
      },
      "atlas-footer-001": {
        id: "atlas-footer-001",
        name: "Footer Section",
        category: "Layout",
        library: "Atlas Design",
        htmlCode: `<footer class="footer-section">
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-brand">
        <h3 class="footer-brand-title">Microsoft Learn</h3>
        <p class="footer-brand-desc">Develop skills that drive success in any career.</p>
      </div>
      <div class="footer-links">
        <div class="footer-column">
          <h4 class="footer-column-title">Products</h4>
          <ul class="footer-link-list">
            <li><a href="#" class="footer-link">Azure</a></li>
            <li><a href="#" class="footer-link">Microsoft 365</a></li>
            <li><a href="#" class="footer-link">Power Platform</a></li>
            <li><a href="#" class="footer-link">Visual Studio</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4 class="footer-column-title">Resources</h4>
          <ul class="footer-link-list">
            <li><a href="#" class="footer-link">Documentation</a></li>
            <li><a href="#" class="footer-link">Training</a></li>
            <li><a href="#" class="footer-link">Certifications</a></li>
            <li><a href="#" class="footer-link">Q&A</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4 class="footer-column-title">Community</h4>
          <ul class="footer-link-list">
            <li><a href="#" class="footer-link">Events</a></li>
            <li><a href="#" class="footer-link">Blog</a></li>
            <li><a href="#" class="footer-link">Forum</a></li>
            <li><a href="#" class="footer-link">Support</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copyright">&copy; 2025 Microsoft Corporation. All rights reserved.</p>
    </div>
  </div>
</footer>`,
        cssCode: `.footer-section {
  background-color: #323130;
  color: #ffffff;
  padding: 60px 20px 20px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #ffffff;
}

.footer-brand-desc {
  font-size: 16px;
  color: #d2d0ce;
  line-height: 1.5;
  margin: 0;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-column-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #ffffff;
}

.footer-link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link-list li {
  margin-bottom: 8px;
}

.footer-link {
  color: #d2d0ce;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #ffffff;
}

.footer-bottom {
  border-top: 1px solid #484644;
  padding-top: 20px;
  text-align: center;
}

.footer-copyright {
  font-size: 14px;
  color: #a19f9d;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}`,
      },
      "atlas-breadcrumb-001": {
        id: "atlas-breadcrumb-001",
        name: "Breadcrumb Navigation",
        category: "Navigation",
        library: "Atlas Design",
        htmlCode: `<nav class="breadcrumb-nav" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item">
      <a href="#" class="breadcrumb-link">Home</a>
    </li>
    <li class="breadcrumb-item">
      <a href="#" class="breadcrumb-link">Learning Paths</a>
    </li>
    <li class="breadcrumb-item">
      <a href="#" class="breadcrumb-link">Azure</a>
    </li>
    <li class="breadcrumb-item breadcrumb-current" aria-current="page">
      <span class="breadcrumb-text">Azure Fundamentals</span>
    </li>
  </ol>
</nav>`,
        cssCode: `.breadcrumb-nav {
  padding: 16px 0;
  border-bottom: 1px solid #e1dfdd;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
  content: ">";
  margin-left: 8px;
  color: #8a8886;
}

.breadcrumb-link {
  color: #0078d4;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #106ebe;
  text-decoration: underline;
}

.breadcrumb-current .breadcrumb-text {
  color: #323130;
  font-weight: 600;
}`,
      },
      "fluent-checkbox-001": {
        id: "fluent-checkbox-001",
        name: "Checkbox",
        category: "Forms",
        library: "Fluent UI",
        htmlCode: `<div class="form-field">
  <label class="checkbox-label">
    <input type="checkbox" class="checkbox-input" id="checkbox-1">
    <span class="checkbox-indicator"></span>
    <span class="checkbox-text">I agree to the terms and conditions</span>
  </label>
</div>`,
        cssCode: `.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #323130;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-indicator {
  width: 16px;
  height: 16px;
  border: 1px solid #8a8886;
  border-radius: 2px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-indicator {
  background-color: #0078d4;
  border-color: #0078d4;
}

.checkbox-input:checked + .checkbox-indicator::after {
  content: "✓";
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-input:focus + .checkbox-indicator {
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.2);
}

.checkbox-text {
  user-select: none;
}`,
      },
      "fluent-radio-001": {
        id: "fluent-radio-001",
        name: "Radio Group",
        category: "Forms",
        library: "Fluent UI",
        htmlCode: `<fieldset class="radio-fieldset">
  <legend class="radio-legend">Choose your experience level</legend>
  <div class="radio-group">
    <label class="radio-label">
      <input type="radio" class="radio-input" name="experience" value="beginner" checked>
      <span class="radio-indicator"></span>
      <span class="radio-text">Beginner</span>
    </label>
    <label class="radio-label">
      <input type="radio" class="radio-input" name="experience" value="intermediate">
      <span class="radio-indicator"></span>
      <span class="radio-text">Intermediate</span>
    </label>
    <label class="radio-label">
      <input type="radio" class="radio-input" name="experience" value="advanced">
      <span class="radio-indicator"></span>
      <span class="radio-text">Advanced</span>
    </label>
  </div>
</fieldset>`,
        cssCode: `.radio-fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

.radio-legend {
  font-size: 14px;
  font-weight: 600;
  color: #323130;
  margin-bottom: 8px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #323130;
}

.radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-indicator {
  width: 16px;
  height: 16px;
  border: 1px solid #8a8886;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.radio-input:checked + .radio-indicator {
  border-color: #0078d4;
}

.radio-input:checked + .radio-indicator::after {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #0078d4;
}

.radio-input:focus + .radio-indicator {
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.2);
}

.radio-text {
  user-select: none;
}`,
      },
      "atlas-notification-001": {
        id: "atlas-notification-001",
        name: "Notification Banner",
        category: "Feedback",
        library: "Atlas Design",
        htmlCode: `<div class="notification-banner notification-success">
  <div class="notification-content">
    <div class="notification-icon">✓</div>
    <div class="notification-text">
      <strong class="notification-title">Success!</strong>
      <span class="notification-message">Your learning path has been saved successfully.</span>
    </div>
    <button class="notification-close" aria-label="Close notification">×</button>
  </div>
</div>`,
        cssCode: `.notification-banner {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  border-left: 4px solid;
}

.notification-success {
  background-color: #dff6dd;
  border-left-color: #107c10;
  color: #323130;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #107c10;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-right: 8px;
}

.notification-message {
  font-size: 14px;
}

.notification-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #605e5c;
  padding: 4px;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.notification-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
}`,
      },
      "atlas-progress-001": {
        id: "atlas-progress-001",
        name: "Progress Indicator",
        category: "Feedback",
        library: "Atlas Design",
        htmlCode: `<div class="progress-container">
  <div class="progress-header">
    <span class="progress-label">Course Progress</span>
    <span class="progress-percentage">65%</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 65%"></div>
  </div>
  <div class="progress-details">
    <span class="progress-text">13 of 20 modules completed</span>
  </div>
</div>`,
        cssCode: `.progress-container {
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: #323130;
}

.progress-percentage {
  font-size: 14px;
  font-weight: 600;
  color: #0078d4;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f3f2f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0078d4 0%, #106ebe 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-details {
  font-size: 12px;
  color: #605e5c;
}`,
      },
      "atlas-sidebar-001": {
        id: "atlas-sidebar-001",
        name: "Learning Sidebar",
        category: "Navigation",
        library: "Atlas Design",
        htmlCode: `<aside class="learning-sidebar">
  <div class="sidebar-header">
    <h3 class="sidebar-title">Course Content</h3>
    <button class="sidebar-toggle" aria-label="Toggle sidebar">☰</button>
  </div>
  <nav class="sidebar-nav">
    <ul class="sidebar-list">
      <li class="sidebar-item">
        <div class="sidebar-module completed">
          <span class="module-icon">✓</span>
          <span class="module-title">Introduction to Azure</span>
          <span class="module-duration">15 min</span>
        </div>
      </li>
      <li class="sidebar-item">
        <div class="sidebar-module current">
          <span class="module-icon">▶</span>
          <span class="module-title">Azure Services Overview</span>
          <span class="module-duration">30 min</span>
        </div>
      </li>
      <li class="sidebar-item">
        <div class="sidebar-module">
          <span class="module-icon">○</span>
          <span class="module-title">Azure Storage</span>
          <span class="module-duration">25 min</span>
        </div>
      </li>
      <li class="sidebar-item">
        <div class="sidebar-module">
          <span class="module-icon">○</span>
          <span class="module-title">Azure Networking</span>
          <span class="module-duration">40 min</span>
        </div>
      </li>
    </ul>
  </nav>
</aside>`,
        cssCode: `.learning-sidebar {
  width: 300px;
  background-color: #faf9f8;
  border-right: 1px solid #e1dfdd;
  padding: 24px 0;
  height: 100%;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 16px;
  border-bottom: 1px solid #e1dfdd;
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #323130;
  margin: 0;
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #605e5c;
  display: none;
}

.sidebar-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-item {
  margin-bottom: 4px;
}

.sidebar-module {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sidebar-module:hover {
  background-color: #f3f2f1;
}

.sidebar-module.completed {
  background-color: #dff6dd;
}

.sidebar-module.current {
  background-color: #deecf9;
  border-right: 3px solid #0078d4;
}

.module-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.module-title {
  flex: 1;
  font-size: 14px;
  color: #323130;
  font-weight: 500;
}

.module-duration {
  font-size: 12px;
  color: #8a8886;
}

@media (max-width: 768px) {
  .learning-sidebar {
    width: 100%;
    height: auto;
  }
  
  .sidebar-toggle {
    display: block;
  }
}`,
      },
    };

    // Process each component ID
    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const componentId of componentIds) {
      try {
        const component = componentDatabase[componentId];

        if (!component) {
          results.push({
            componentId,
            success: false,
            error: `Component ${componentId} not found`,
          });
          failCount++;
          continue;
        }

        // Apply options to modify the component code
        let htmlCode = component.htmlCode;
        let cssCode = component.cssCode;

        // Apply design system preferences
        if (options.designSystem === "fluent") {
          cssCode = cssCode.replace(/#0078d4/g, "#0078d4"); // Keep Fluent blue
        } else if (options.designSystem === "atlas") {
          cssCode = cssCode.replace(/#0078d4/g, "#0078d4"); // Keep Atlas blue
        }

        // Apply responsive option
        if (options.responsive === false) {
          cssCode = cssCode.replace(/@media[^}]+}/g, ""); // Remove media queries
        }

        // Generate wireframe HTML (simplified for wireframing)
        const wireframeHtml = options.wireframeMode
          ? htmlCode.replace(/class="[^"]*"/g, 'class="wireframe-element"')
          : htmlCode;

        const wireframeCss = options.wireframeMode
          ? `
.wireframe-element {
  border: 2px dashed #8a8886;
  background: #f8f8f8;
  padding: 8px;
  margin: 4px;
  font-family: monospace;
  color: #605e5c;
}
        `
          : cssCode;

        results.push({
          componentId,
          componentName: component.name,
          htmlCode,
          cssCode,
          wireframeHtml,
          wireframeCss,
          success: true,
        });

        successCount++;
      } catch (error) {
        context.log.error(`Error processing component ${componentId}:`, error);
        results.push({
          componentId,
          success: false,
          error: error.message,
        });
        failCount++;
      }
    }

    const response = {
      results,
      summary: {
        total: componentIds.length,
        successful: successCount,
        failed: failCount,
      },
    };

    context.log(
      `Import completed: ${successCount} successful, ${failCount} failed`
    );

    context.res.status = 200;
    context.res.body = response;
  } catch (error) {
    context.log.error("Error importing Figma components:", error);

    context.res.status = 500;
    context.res.body = {
      error: "Failed to import components",
      details: error.message,
    };
  }
};
