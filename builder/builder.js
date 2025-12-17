const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const endBtn = document.getElementById('endBtn');
const polygonBtn = document.getElementById('polygonBtn');
const symmetryBtn = document.getElementById('symmetryBtn');
const clearBtn = document.getElementById('clearBtn');
const gridSizeInput = document.getElementById('gridSize');

let dots = [];
const DOT_RADIUS = 5;
let gridSize = 20;
let symmetryMode = false;
let symmetryDots = []; // Track dots added during symmetry mode

// Draw grid
function drawGrid() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  if (gridSize > 0) {
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = centerX; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let x = centerX - gridSize; x >= 0; x -= gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = centerY; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let y = centerY - gridSize; y >= 0; y -= gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }
  
  // Draw axes (x=0 and y=0)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  
  // Y-axis (x=0)
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
  
  // X-axis (y=0)
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();
}

// Snap coordinate to grid
function snapToGrid(value, center) {
  if (gridSize <= 0) return value;
  const offset = value - center;
  const snapped = Math.round(offset / gridSize) * gridSize;
  return center + snapped;
}

// Draw a single dot
function drawDot(x, y) {
  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}

// Redraw all dots and lines
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  drawGrid();
  
  // Dim bottom half if symmetry mode is active
  if (symmetryMode) {
    const centerY = canvas.height / 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, centerY, canvas.width, canvas.height / 2);
  }
  
  // Draw dots
  dots.forEach(dot => {
    drawDot(dot.x, dot.y);
  });
}

// Check if click is near a dot
function findDotAt(x, y) {
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const dx = dot.x - x;
    const dy = dot.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= DOT_RADIUS + 5) { // 5px tolerance
      return i;
    }
  }
  return -1;
}

// Handle canvas clicks
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  if (e.button === 0) { // Left click - add dot
    const centerY = canvas.height / 2;
    
    // In symmetry mode, don't allow dots in bottom half
    if (symmetryMode && y > centerY) {
      return;
    }
    
    const snappedX = snapToGrid(x, canvas.width / 2);
    const snappedY = snapToGrid(y, canvas.height / 2);
    const newDot = { x: snappedX, y: snappedY };
    dots.push(newDot);
    
    // Track dots added during symmetry mode
    if (symmetryMode) {
      symmetryDots.push(newDot);
    }
    
    redraw();
  } else if (e.button === 2) { // Right click - remove dot
    const index = findDotAt(x, y);
    if (index !== -1) {
      dots.splice(index, 1);
      redraw();
    }
  }
});

// Prevent context menu on right click
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// End button - connect all dots
endBtn.addEventListener('click', () => {
  if (dots.length < 2) return;
  
  ctx.strokeStyle = '#0000FF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dots[0].x, dots[0].y);
  
  for (let i = 1; i < dots.length; i++) {
    ctx.lineTo(dots[i].x, dots[i].y);
  }
  
  // Connect back to first dot
  ctx.lineTo(dots[0].x, dots[0].y);
  ctx.stroke();
});

// Polygon button - show coordinates
polygonBtn.addEventListener('click', () => {
  if (dots.length === 0) {
    alert('No dots to display');
    return;
  }
  
  const coordString = dots.map(dot => `(${dot.x},${dot.y})`).join(',');
  alert(coordString);
});

// Symmetry button - toggle symmetry mode
symmetryBtn.addEventListener('click', () => {
  symmetryMode = !symmetryMode;
  
  if (symmetryMode) {
    // Entering symmetry mode
    symmetryDots = [];
    symmetryBtn.style.backgroundColor = '#FF6347';
    symmetryBtn.textContent = 'Symmetry (ON)';
  } else {
    // Exiting symmetry mode - mirror symmetry dots to bottom half in REVERSE order
    const centerY = canvas.height / 2;
    for (let i = symmetryDots.length - 1; i >= 0; i--) {
      const dot = symmetryDots[i];
      const mirrorY = 2 * centerY - dot.y;
      dots.push({ x: dot.x, y: mirrorY });
    }
    symmetryDots = [];
    symmetryBtn.style.backgroundColor = '#4CAF50';
    symmetryBtn.textContent = 'Symmetry';
  }
  
  redraw();
});

// Clear button - remove all dots
clearBtn.addEventListener('click', () => {
  dots = [];
  redraw();
});

// Handle grid size changes
gridSizeInput.addEventListener('input', (e) => {
  gridSize = parseInt(e.target.value) || 0;
  redraw();
});

// Initialize
window.addEventListener('load', () => {
  redraw();
});