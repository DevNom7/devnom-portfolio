// === DevNom Portfolio Landing Page JavaScript ===
// Handles breathing organism animations and interactive RR controls

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

// === RR VITAL SIGNS SYSTEM ===
const rrValue = document.getElementById('rr-value');
let currentRespiratoryRate = 3;  // Default: 3-second breathing cycle (20 RR)

// Calculate RR from breathing cycle duration
function calculateRR(breathingDuration) {
  // RR = 60 seconds / breathingDuration (in seconds)
  return Math.round(60 / breathingDuration);
}

function updateRRDisplay(duration) {
  if (!rrValue) return;
  rrValue.style.animation = `rr-pulse ${duration}s infinite ease-in-out`;
}

function showCalibrating() {
  if (rrValue) rrValue.textContent = '--';  // Show dashes (calibrating)
}

function showFluctuatingRR(readingIndex) {
  const fluctuationReadings = [28, 15, 35, 22, 18, 24, 19, 21, calculateRR(currentRespiratoryRate)];
  if (rrValue) rrValue.textContent = fluctuationReadings[readingIndex];
}

function showFinalRR() {
  if (rrValue) rrValue.textContent = calculateRR(currentRespiratoryRate);
}

let vitalsCompleted = false;  // Enable RR controls

// === INTERACTIVE RR CONTROLS ===
const rrUpButton = document.getElementById('rr-up');
const rrDownButton = document.getElementById('rr-down');

function increaseRespiratoryRate() {
  if (currentRespiratoryRate > 1) currentRespiratoryRate--;
  updateRRDisplay(currentRespiratoryRate);
  if (rrValue) rrValue.textContent = calculateRR(currentRespiratoryRate);
}

function decreaseRespiratoryRate() {
  if (currentRespiratoryRate < 10) currentRespiratoryRate++;
  updateRRDisplay(currentRespiratoryRate);
  if (rrValue) rrValue.textContent = calculateRR(currentRespiratoryRate);
}

if (rrUpButton && rrDownButton) {
  rrUpButton.addEventListener('click', increaseRespiratoryRate);
  rrDownButton.addEventListener('click', decreaseRespiratoryRate);
}

// Initial setup
updateRRDisplay(currentRespiratoryRate);
showCalibrating();
setTimeout(() => {
  let readingIndex = 0;
  const interval = setInterval(() => {
    showFluctuatingRR(readingIndex);
    readingIndex++;
    if (readingIndex >= 8) {
      clearInterval(interval);
      showFinalRR();
      vitalsCompleted = true;
    }
  }, 300);
}, 1000);

// === INITIALIZATION ===
// Start the vital signs simulation when the page finishes loading
window.addEventListener('load', () => {
  updateRRDisplay(currentRespiratoryRate);
  showCalibrating();
  setTimeout(() => {
    let readingIndex = 0;
    const interval = setInterval(() => {
      showFluctuatingRR(readingIndex);
      readingIndex++;
      if (readingIndex >= 8) {
        clearInterval(interval);
        showFinalRR();
        vitalsCompleted = true;
      }
    }, 300);
  }, 1000);
}); 