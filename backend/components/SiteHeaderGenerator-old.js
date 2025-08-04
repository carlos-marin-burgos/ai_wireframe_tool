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
        <div class="ms-header-actions">
          ${searchEnabled ? `
            <div class="ms-search-container">
              <button class="ms-search-button" aria-label="Search" aria-expanded="false">
                <svg class="ms-search-icon" viewBox="0 0 16 16" width="16" height="16">
                  <path d="M11.5 6.5a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
                  <path d="m13 13-4.35-4.35"/>
                </svg>
              </button>
              <div class="ms-search-dropdown" role="search">
                <input type="search" class="ms-search-input" placeholder="Search documentation..." aria-label="Search" />
              </div>
            </div>
          ` : ''}

          ${userMenu ? `
            <div class="ms-user-menu">
              <button class="ms-user-button" aria-label="User menu" aria-expanded="false">
                <svg class="ms-user-icon" viewBox="0 0 16 16" width="16" height="16">
                  <circle cx="8" cy="8" r="8"/>
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  <path d="M8 14s-3-2-3-5 1-3 3-3 3 0 3 3-3 5-3 5z"/>
                </svg>
              </button>
              <div class="ms-user-dropdown">
                <a href="/profile" class="ms-dropdown-link">Profile</a>
                <a href="/settings" class="ms-dropdown-link">Settings</a>
                <hr class="ms-dropdown-divider" />
                <a href="/signout" class="ms-dropdown-link">Sign out</a>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="ms-mobile-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
          <span class="ms-mobile-toggle-bar"></span>
          <span class="ms-mobile-toggle-bar"></span>
          <span class="ms-mobile-toggle-bar"></span>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div class="ms-mobile-nav" role="navigation" aria-label="Mobile navigation">
        <ul class="ms-mobile-nav-list">
          ${navigationItems.map(item => `
            <li class="ms-mobile-nav-item">
              <a href="${item.href}" class="ms-mobile-nav-link">${item.text}</a>
            </li>
          `).join('')}
        </ul>
      </div>
    </header>

    <style>
      .ms-header {
        background: var(--ms-color-background-primary);
        border-bottom: 1px solid var(--ms-color-border-subtle);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .ms-header--light {
        --ms-color-background-primary: #ffffff;
        --ms-color-text-primary: #323130;
        --ms-color-border-subtle: #e1dfdd;
      }

      .ms-header--dark {
        --ms-color-background-primary: #1b1a19;
        --ms-color-text-primary: #ffffff;
        --ms-color-border-subtle: #323130;
      }

      .ms-header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        height: 64px;
      }

      .ms-header-brand {
        display: flex;
        align-items: center;
      }

      .ms-header-logo {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--ms-color-text-primary);
      }

      .ms-logo {
        height: 32px;
        margin-right: 12px;
      }

      .ms-header-title {
        font-size: 18px;
        font-weight: 600;
      }

      .ms-header-nav {
        flex: 1;
        margin: 0 32px;
      }

      .ms-nav-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 32px;
      }

      .ms-nav-link {
        color: var(--ms-color-text-primary);
        text-decoration: none;
        font-weight: 500;
        padding: 8px 0;
        transition: color 0.2s ease;
      }

      .ms-nav-link:hover {
        color: #0078d4;
      }

      .ms-header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .ms-search-container,
      .ms-user-menu {
        position: relative;
      }

      .ms-search-button,
      .ms-user-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        color: var(--ms-color-text-primary);
      }

      .ms-search-button:hover,
      .ms-user-button:hover {
        background: rgba(0, 120, 212, 0.1);
      }

      .ms-mobile-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        flex-direction: column;
        gap: 4px;
        padding: 8px;
      }

      .ms-mobile-toggle-bar {
        width: 24px;
        height: 2px;
        background: var(--ms-color-text-primary);
        transition: all 0.3s ease;
      }

      .ms-mobile-nav {
        display: none;
        background: var(--ms-color-background-primary);
        border-top: 1px solid var(--ms-color-border-subtle);
        padding: 16px 24px;
      }

      .ms-mobile-nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .ms-mobile-nav-item {
        margin-bottom: 8px;
      }

      .ms-mobile-nav-link {
        color: var(--ms-color-text-primary);
        text-decoration: none;
        font-weight: 500;
        padding: 12px 0;
        display: block;
      }

      @media (max-width: 768px) {
        .ms-header-nav {
          display: none;
        }

        .ms-mobile-toggle {
          display: flex;
        }

        .ms-header-actions {
          gap: 8px;
        }
      }
    </style>
  `;
}

module.exports = {
  generateSiteHeaderHTML
};
