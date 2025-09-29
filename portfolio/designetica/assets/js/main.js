// Designetica Case Study JavaScript
// Based on carlosmarin.net interactive functionality

document.addEventListener("DOMContentLoaded", function () {
  // Initialize loading screen
  initLoadingScreen();

  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize animations
  initAnimations();

  // Initialize scroll effects
  initScrollEffects();
});

// Loading Screen Management
function initLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");

  // Simulate loading time for dramatic effect
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");

      // Remove from DOM after transition
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }
  }, 1500);
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
  const scrollTop = document.querySelector(".scroll-top");

  if (scrollTop) {
    scrollTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Handle internal anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Animation and Fade-in Effects
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for fade-in animation
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Observe grid items
  const gridItems = document.querySelectorAll(
    ".arch-item, .result-item, .case-study-item, .flow-step"
  );
  gridItems.forEach((item, index) => {
    // Add staggered animation delay
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
  });
}

// Scroll Effects and Header Behavior
function initScrollEffects() {
  const header = document.querySelector(".header");
  let lastScrollTop = 0;
  let isScrolling = false;

  window.addEventListener("scroll", function () {
    if (!isScrolling) {
      requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove header shadow based on scroll position
    if (scrollTop > 10) {
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.boxShadow = "none";
    }

    // Update scroll direction for potential future features
    if (scrollTop > lastScrollTop) {
      // Scrolling down
      document.body.classList.add("scrolling-down");
      document.body.classList.remove("scrolling-up");
    } else {
      // Scrolling up
      document.body.classList.add("scrolling-up");
      document.body.classList.remove("scrolling-down");
    }

    lastScrollTop = scrollTop;
  }
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimization for scroll events
const debouncedScrollHandler = debounce(function () {
  // Additional scroll-based functionality can be added here
}, 16); // ~60fps

window.addEventListener("scroll", debouncedScrollHandler);

// Accessibility Enhancements
document.addEventListener("keydown", function (e) {
  // Enable keyboard navigation for interactive elements
  if (e.key === "Enter" || e.key === " ") {
    const focusedElement = document.activeElement;
    if (focusedElement.tagName === "A" && !focusedElement.href) {
      e.preventDefault();
      focusedElement.click();
    }
  }
});

// Error Handling
window.addEventListener("error", function (e) {
  console.warn("Case study page error:", e.message);
  // Graceful degradation - ensure basic functionality works
});

// Image Loading Optimization
function initImageLoading() {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("load", function () {
      this.classList.add("loaded");
    });

    img.addEventListener("error", function () {
      this.classList.add("error");
      // Fallback for missing images
      console.warn("Image failed to load:", this.src);
    });
  });
}

// Initialize image loading when DOM is ready
initImageLoading();

// Export functions for potential testing or external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initLoadingScreen,
    initSmoothScrolling,
    initAnimations,
    initScrollEffects,
    debounce,
  };
}
