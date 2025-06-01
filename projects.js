// === DevNom Portfolio Projects Page JavaScript ===
// Handles interactive effects for project cards and navigation
// Syncs text breathing animations with organism breathing rate

// Note: Sound functionality has been removed - add back when sound files are available

// Get all project cards for potential future interactive effects
const projectCards = document.querySelectorAll('.project-card');
const navLinks = document.querySelectorAll('.nav-link');

// Get text elements that should breathe with the organism
const navBrand = document.querySelector('.nav-brand');
const projectsHeader = document.querySelector('.projects-header');

// === TEXT BREATHING SYNC ===
// Function to update text breathing animations when breathing rate changes
function updateTextBreathingAnimation(duration) {
  // Remove any existing dynamic text breathing styles
  const existingStyle = document.getElementById('dynamic-text-breathing');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new style element with updated animation durations for text
  const style = document.createElement('style');
  style.id = 'dynamic-text-breathing';
  
  // Override the default 3s text breathing animations with new duration
  style.textContent = `
    .nav-brand {
      animation: text-breathing ${duration}s infinite ease-in-out !important;
    }
    .projects-header {
      animation: text-breathing ${duration}s infinite ease-in-out !important;
    }
  `;
  
  // Add the new styles to the page
  document.head.appendChild(style);
}

// Listen for breathing rate changes from the main page (if available)
// This allows the text to sync with BPM control changes
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'breathingRateChange') {
    updateTextBreathingAnimation(event.data.duration);
  }
});

// === FUTURE ENHANCEMENTS ===
// This file is ready for adding:
// - Hover sound effects (when sound files are available)
// - Project card animations
// - Dynamic content loading
// - Filtering/search functionality

// Example of how to add hover effects to project cards:
/*
projectCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    // Add hover animations here
    console.log('Project card hovered');
  });
  
  card.addEventListener('click', function() {
    // Add click effects here
    console.log('Project card clicked');
  });
});
*/

// Example of how to add navigation hover effects:
/*
navLinks.forEach(link => {
  link.addEventListener('mouseenter', function() {
    // Add navigation hover effects here
    console.log('Navigation link hovered');
  });
});
*/

console.log('Projects page loaded successfully - text breathing animations active');

// === Hamburger Menu Toggle ===
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('nav-links');
if (hamburger && navLinksMenu) {
  hamburger.addEventListener('click', () => {
    const open = navLinksMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// === Project Description Slide Toggle (Mobile Only) ===
if (window.innerWidth <= 700) {
  function closeAllOverlays() {
    document.querySelectorAll('.project-overlay').forEach(overlay => {
      overlay.style.maxHeight = null;
      overlay.style.transition = 'max-height 0.4s cubic-bezier(0.4,0.2,0.2,1)';
      overlay.parentElement.querySelector('.desc-toggle').setAttribute('aria-expanded', 'false');
      overlay.parentElement.querySelector('.desc-toggle').textContent = 'Show Description';
    });
  }
  document.querySelectorAll('.desc-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const overlay = this.parentElement.querySelector('.project-overlay');
      if (!overlay) return;
      const isOpen = overlay.style.maxHeight && overlay.style.maxHeight !== '0px';
      closeAllOverlays();
      if (!isOpen) {
        overlay.style.maxHeight = overlay.scrollHeight + 'px';
        overlay.style.transition = 'max-height 0.4s cubic-bezier(0.4,0.2,0.2,1)';
        this.setAttribute('aria-expanded', 'true');
        this.textContent = 'Hide Description';
      }
    });
  });
} 