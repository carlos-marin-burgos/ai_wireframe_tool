/**
 * Site Header Generator
 * Generates HTML for website headers using Microsoft Learn design system
 * Styles are handled by frontend CSS files, not embedded here
 */

/**
 * Generates a complete site header with navigation
 * @param {Object} options - Configuration options for the header
 * @returns {string} HTML string for the site header
 */
function generateSiteHeaderHTML(options = {}) {
  const {
    siteName = 'Microsoft Learn',
    logoUrl = '/images/microsoft-logo.svg',
    navigationItems = [
      { text: 'Learn', href: '/learn' },
      { text: 'Certifications', href: '/certifications' },
      { text: 'Documentation', href: '/docs' },
      { text: 'Community', href: '/community' }
    ],
    searchEnabled = true,
    userMenu = true,
    theme = 'light'
  } = options;

  const themeClass = theme === 'dark' ? 'ms-header--dark' : 'ms-header--light';

  return `
    <header class="ms-header ${themeClass}" role="banner">
      <div class="ms-header-container">
        <!-- Logo and Site Name -->
        <div class="ms-header-brand">
          <a href="/" class="ms-header-logo" aria-label="${siteName} home">
            <img src="${logoUrl}" alt="${siteName}" class="ms-logo" />
            <span class="ms-header-title">${siteName}</span>
          </a>
        </div>

        <!-- Main Navigation -->
        <nav class="ms-header-nav" role="navigation" aria-label="Main navigation">
          <ul class="ms-nav-list">
            ${navigationItems.map(item => `
              <li class="ms-nav-item">
                <a href="${item.href}" class="ms-nav-link">${item.text}</a>
              </li>
            `).join('')}
          </ul>
        </nav>

        <!-- Header Actions -->
        <div class="ms-header-actions">
          ${searchEnabled ? `
            <div class="ms-search-box">
              <svg class="ms-search-icon" viewBox="0 0 16 16" width="16" height="16">
                <path d="M11.5 6.5a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
                <path d="m13 13-4.35-4.35"/>
              </svg>
              <input type="search" class="ms-search-input" placeholder="Search documentation..." aria-label="Search" />
            </div>
          ` : ''}

          ${userMenu ? `
            <div class="ms-user-menu">
              <button class="ms-user-button" aria-label="User menu" aria-expanded="false">
                <svg class="ms-user-icon" viewBox="0 0 16 16" width="16" height="16">
                  <circle cx="8" cy="4" r="2"/>
                  <path d="M8 8s-3 2-3 5h6c0-3-3-5-3-5z"/>
                </svg>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    </header>
  `;
}

/**
 * Generates a simplified site header for wireframes
 * @param {Object} options - Configuration options
 * @returns {string} HTML string for simplified header
 */
function generateSimpleSiteHeaderHTML(options = {}) {
  const {
    siteName = 'Your Site',
    navigationItems = ['Home', 'About', 'Services', 'Contact']
  } = options;

  return `
    <header class="ms-header ms-header--light" role="banner">
      <div class="ms-header-container">
        <div class="ms-header-brand">
          <a href="/" class="ms-header-logo">
            <span class="ms-header-title">${siteName}</span>
          </a>
        </div>
        <nav class="ms-header-nav">
          <ul class="ms-nav-list">
            ${navigationItems.map(item => `
              <li class="ms-nav-item">
                <a href="#" class="ms-nav-link">${item}</a>
              </li>
            `).join('')}
          </ul>
        </nav>
        <div class="ms-header-actions">
          <div class="ms-search-box">
            <svg class="ms-search-icon" viewBox="0 0 16 16" width="16" height="16">
              <path d="M11.5 6.5a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
              <path d="m13 13-4.35-4.35"/>
            </svg>
            <input type="search" class="ms-search-input" placeholder="Search..." />
          </div>
        </div>
      </div>
    </header>
  `;
}

module.exports = {
  generateSiteHeaderHTML,
  generateSimpleSiteHeaderHTML
};
