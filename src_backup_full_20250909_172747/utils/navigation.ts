// Vanilla JavaScript navigation and footer utility
export function initializeNavigation() {
  const navContainer = document.getElementById('top-navigation');
  if (!navContainer) return;

  // Create navigation HTML with Designetica and CXS logos
  navContainer.innerHTML = `
    <div class="container-fluid d-flex align-items-center justify-content-between px-3" style="background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <a class="navbar-brand" href="/">
        <img src="/designetica.png" alt="Designetica" style="height: 40px; object-fit: contain;" />
      </a>
      <div class="cxs-logo d-flex align-items-center">
        <!-- CXS Logo on the right -->
        <img src="/cxsLogo.png" alt="CXS Logo" style="height: 30px; object-fit: contain;" />
      </div>
    </div>
  `;
}

// Initialize footer content
export function initializeFooter() {
  const footerContainer = document.getElementById('app-footer');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <div class="footer">
      <span class="footer-content">
        © ${new Date().getFullYear()} Designetica by Cloud Experience Studio - Microsoft 2025. 
        <a href="#">Privacy Policy</a> | 
        <a href="#">Terms of Service</a>
      </span>
    </div>
  `;
}

// Function to cleanup navigation and footer if needed
export function cleanup() {
  const navContainer = document.getElementById('top-navigation');
  const footerContainer = document.getElementById('app-footer');
  
  if (navContainer) {
    navContainer.innerHTML = '';
  }
  if (footerContainer) {
    footerContainer.innerHTML = '';
  }
}
