const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const endBtn = document.getElementById('endBtn');
const polygonBtn = document.getElementById('polygonBtn');
const symmetryBtn = document.getElementById('symmetryBtn');
const clearBtn = document.getElementById('clearBtn');
const gridSizeInput = document.getElementById('gridSize');
const outputBox = document.getElementById('outputBox');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');

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
    ctx.strokeStyle = '#404040';
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
  ctx.strokeStyle = '#888';
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
  ctx.fillStyle = '#FF6B6B';
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
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
  
  ctx.strokeStyle = '#4a90e2';
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
    outputBox.value = 'No dots to display';
    return;
  }
  
  const coordString = dots.map(dot => `new Point(${dot.x},${dot.y})`).join(', ');
  outputBox.value = `[${coordString}]`;
});

// Symmetry button - toggle symmetry mode
symmetryBtn.addEventListener('click', () => {
  symmetryMode = !symmetryMode;
  
  if (symmetryMode) {
    // Entering symmetry mode
    symmetryDots = [];
    symmetryBtn.style.backgroundColor = '#FF6B6B';
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
    symmetryBtn.style.backgroundColor = '#4a90e2';
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

// Export button - save dots to localStorage
exportBtn.addEventListener('click', () => {
  if (dots.length === 0) {
    alert('No dots to export');
    return;
  }
  
  const polygonName = prompt('Enter a name for this polygon:', `Polygon ${new Date().getTime()}`);
  
  if (!polygonName) {
    return; // User cancelled
  }
  
  try {
    // Get existing polygons
    const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
    const polygons = storedPolygons ? JSON.parse(storedPolygons) : {};
    
    // Add new polygon
    polygons[polygonName] = dots;
    
    // Save back to localStorage
    localStorage.setItem('polygonBuilderPolygons', JSON.stringify(polygons));
    alert(`Exported "${polygonName}" with ${dots.length} dot(s) to storage`);
    
    // Check if we should return to scenes page
    const returnToScenes = localStorage.getItem('returnToScenes');
    if (returnToScenes === 'true') {
      localStorage.removeItem('returnToScenes');
      window.location.href = 'scenes.html';
    }
  } catch (error) {
    alert('Error exporting: ' + error.message);
  }
});

// Import button - show modal with list of stored polygons
const importModal = document.getElementById('importModal');
const polygonListModal = document.getElementById('polygonListModal');
const modalImportBtn = document.getElementById('modalImportBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
let selectedPolygonName = null;

importBtn.addEventListener('click', () => {
  try {
    const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
    
    if (!storedPolygons) {
      alert('No saved polygons found in storage');
      return;
    }
    
    const polygons = JSON.parse(storedPolygons);
    const polygonNames = Object.keys(polygons);
    
    if (polygonNames.length === 0) {
      alert('No saved polygons found in storage');
      return;
    }
    
    // Show modal and populate list
    selectedPolygonName = null;
    polygonListModal.innerHTML = '';
    
    polygonNames.forEach(name => {
      const item = document.createElement('div');
      item.className = 'polygon-list-item';
      item.textContent = `${name} (${polygons[name].length} dots)`;
      item.addEventListener('click', () => {
        // Remove previous selection
        document.querySelectorAll('.polygon-list-item').forEach(el => {
          el.classList.remove('selected');
        });
        // Select this item
        item.classList.add('selected');
        selectedPolygonName = name;
      });
      polygonListModal.appendChild(item);
    });
    
    importModal.style.display = 'block';
  } catch (error) {
    alert('Error loading polygons: ' + error.message);
  }
});

// Modal import button
modalImportBtn.addEventListener('click', () => {
  if (!selectedPolygonName) {
    alert('Please select a polygon to import');
    return;
  }
  
  try {
    const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
    const polygons = JSON.parse(storedPolygons);
    const loadedDots = polygons[selectedPolygonName];
    
    if (!Array.isArray(loadedDots) || loadedDots.length === 0) {
      alert('Invalid polygon data');
      return;
    }
    
    // Replace all current data with imported data
    dots = loadedDots;
    symmetryDots = [];
    symmetryMode = false;
    symmetryBtn.style.backgroundColor = '#4a90e2';
    symmetryBtn.textContent = 'Symmetry';
    
    redraw();
    importModal.style.display = 'none';
    alert(`Imported "${selectedPolygonName}" with ${dots.length} dot(s)`);
  } catch (error) {
    alert('Error importing: ' + error.message);
  }
});

// Modal cancel button
modalCancelBtn.addEventListener('click', () => {
  importModal.style.display = 'none';
});

// Close modal when clicking outside
importModal.addEventListener('click', (e) => {
  if (e.target === importModal) {
    importModal.style.display = 'none';
  }
});

// Initialize
window.addEventListener('load', () => {
  redraw();
});