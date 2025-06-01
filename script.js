// === DevNom Portfolio Landing Page JavaScript ===
// Handles breathing organism animations and interactive BPM controls

// === HOVER EFFECTS ===
// Add visual effects when hovering over the breathing organism
const elementLink = document.querySelector('.element-link');

// These functions will be called by hover events (if you want to add hover background effects later)
function addHoverEffect() {
  // You can add background glow effects here if needed
}
function removeHoverEffect() {
  // Remove background glow effects here if needed
}

// Add hover event listeners to the main element
if (elementLink) {
  elementLink.addEventListener('mouseenter', addHoverEffect);
  elementLink.addEventListener('mouseleave', removeHoverEffect);
  elementLink.addEventListener('focus', addHoverEffect);   // For keyboard navigation
  elementLink.addEventListener('blur', removeHoverEffect);  // For keyboard navigation
}

// === BPM VITAL SIGNS SYSTEM ===
// Variables to track breathing rate and vital signs status
const bpmValue = document.getElementById('bpm-value');
let currentBreathingRate = 3;  // Default: 3-second breathing cycle (20 BPM)
let vitalsCompleted = false;   // Tracks if initial vital signs simulation is done

// Calculate BPM from breathing cycle duration
function calculateBPM(breathingDuration) {
  // Formula: 60 seconds ÷ breathing cycle duration = breaths per minute
  return Math.round(60 / breathingDuration);
}

// Dynamically update CSS animations when breathing rate changes
function updateBreathingAnimation(duration) {
  // Remove any existing dynamic styles
  const existingStyle = document.getElementById('dynamic-breathing');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new style element with updated animation durations
  const style = document.createElement('style');
  style.id = 'dynamic-breathing';
  
  // Override the default 3s animations with new duration
  style.textContent = `
    .glow-bg {
      animation: red-breathing ${duration}s infinite ease-in-out !important;
    }
    .main-img {
      animation: image-breathing ${duration}s infinite ease-in-out !important;
    }
    .bpm-value {
      animation: bpm-pulse ${duration}s infinite ease-in-out !important;
    }
  `;
  
  // Add the new styles to the page
  document.head.appendChild(style);
}

// Simulate realistic vital signs monitoring when page loads
function simulateVitalSigns() {
  // Phase 1: Show "Loading..." for 1.5 seconds (sensor initialization)
  setTimeout(() => {
    bpmValue.textContent = '--';  // Show dashes (calibrating)
  }, 1500);

  // Phase 2: Fluctuating readings (simulates finding the pulse)
  // Realistic BPM readings that settle on the final calculated value
  const fluctuationReadings = [28, 15, 35, 22, 18, 24, 19, 21, calculateBPM(currentBreathingRate)];
  let readingIndex = 0;
  
  // Change reading every 300ms to simulate real medical equipment
  const fluctuationInterval = setInterval(() => {
    if (readingIndex < fluctuationReadings.length) {
      bpmValue.textContent = fluctuationReadings[readingIndex];
      readingIndex++;
    } else {
      // Phase 3: Stop fluctuating and show final stable reading
      clearInterval(fluctuationInterval);
      bpmValue.textContent = calculateBPM(currentBreathingRate);
      vitalsCompleted = true;  // Enable BPM controls
    }
  }, 300);

  // Start the fluctuation phase after the calibration period
  setTimeout(() => {
    // Fluctuations begin here (interval is already set up above)
  }, 2000);
}

// === INTERACTIVE BPM CONTROLS ===
// Get the up/down arrow buttons
const bpmUpButton = document.getElementById('bpm-up');
const bpmDownButton = document.getElementById('bpm-down');

// Increase breathing rate (faster breathing = higher BPM)
function increaseBreathingRate() {
  // Only allow changes after vital signs are complete
  if (vitalsCompleted && currentBreathingRate > 1) {
    currentBreathingRate -= 0.2;  // Decrease duration = faster breathing
    currentBreathingRate = Math.max(1, Math.round(currentBreathingRate * 10) / 10);  // Min 1 second
    
    // Update all animations and display
    updateBreathingAnimation(currentBreathingRate);
    bpmValue.textContent = calculateBPM(currentBreathingRate);
  }
}

// Decrease breathing rate (slower breathing = lower BPM)
function decreaseBreathingRate() {
  // Only allow changes after vital signs are complete
  if (vitalsCompleted && currentBreathingRate < 6) {
    currentBreathingRate += 0.2;  // Increase duration = slower breathing
    currentBreathingRate = Math.min(6, Math.round(currentBreathingRate * 10) / 10);  // Max 6 seconds
    
    // Update all animations and display
    updateBreathingAnimation(currentBreathingRate);
    bpmValue.textContent = calculateBPM(currentBreathingRate);
  }
}

// Add click event listeners to the arrow buttons
if (bpmUpButton && bpmDownButton) {
  bpmUpButton.addEventListener('click', increaseBreathingRate);
  bpmDownButton.addEventListener('click', decreaseBreathingRate);
}

// === INITIALIZATION ===
// Start the vital signs simulation when the page finishes loading
window.addEventListener('load', simulateVitalSigns); 