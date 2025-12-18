const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const backBtn = document.getElementById('backBtn');
const endBtn = document.getElementById('endBtn');
const polygonBtn = document.getElementById('polygonBtn');
const symmetryBtn = document.getElementById('symmetryBtn');
const clearBtn = document.getElementById('clearBtn');
const gridSizeInput = document.getElementById('gridSize');
const outputBox = document.getElementById('outputBox');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const mouseCoordsField = document.getElementById('mouseCoords');
const zoomLevel = document.getElementById('zoomLevel');

let dots = [];
const DOT_RADIUS = 5;
let gridSize = 20;
let symmetryMode = false;
let symmetryDots = []; // Track dots added during symmetry mode
let snapIndicator = null; // Track snap indicator position

// Update back button visibility
function updateBackButtonVisibility() {
  const returnToScenes = localStorage.getItem('returnToScenes');
  // Show back button only if we came from scenes AND there are no dots
  if (returnToScenes === 'true' && dots.length === 0) {
    backBtn.style.display = 'block';
  } else {
    backBtn.style.display = 'none';
  }
}

// Back button - return to scenes page
backBtn.addEventListener('click', () => {
  localStorage.removeItem('returnToScenes');
  window.location.href = 'scenes.html';
});

// Draw grid
function drawGrid() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const zoom = parseFloat(zoomLevel.value) || 1.0;
  const scaledGridSize = gridSize * zoom;
  
  if (gridSize > 0) {
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = centerX; x <= canvas.width; x += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let x = centerX - scaledGridSize; x >= 0; x -= scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = centerY; y <= canvas.height; y += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let y = centerY - scaledGridSize; y >= 0; y -= scaledGridSize) {
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
  
  // Draw coordinate labels at axis edges
  ctx.fillStyle = '#888';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Left edge (negative X)
  const leftX = -centerX / zoom;
  ctx.fillText(Math.round(leftX).toString(), 30, centerY - 10);
  
  // Right edge (positive X)
  const rightX = (canvas.width - centerX) / zoom;
  ctx.fillText(Math.round(rightX).toString(), canvas.width - 30, centerY - 10);
  
  // Top edge (positive Y)
  const topY = centerY / zoom;
  ctx.fillText(Math.round(topY).toString(), centerX + 10, 15);
  
  // Bottom edge (negative Y)
  const bottomY = -(canvas.height - centerY) / zoom;
  ctx.fillText(Math.round(bottomY).toString(), centerX + 10, canvas.height - 15);
}

// Snap coordinate to grid and convert to world coordinates
function snapToGrid(value, center) {
  const zoom = parseFloat(zoomLevel.value) || 1.0;
  if (gridSize <= 0) {
    return (value - center) / zoom; // Convert to world coordinates
  }
  const offset = value - center;
  const scaledGridSize = gridSize * zoom;
  const snapped = Math.round(offset / scaledGridSize) * scaledGridSize;
  return snapped / zoom; // Return world coordinate
}

// Draw a single dot (converts world coords to screen coords)
function drawDot(worldX, worldY) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const zoom = parseFloat(zoomLevel.value) || 1.0;
  const screenX = centerX + (worldX * zoom);
  const screenY = centerY - (worldY * zoom); // Negate Y for screen coordinates
  
  ctx.fillStyle = '#FF6B6B';
  ctx.beginPath();
  ctx.arc(screenX, screenY, DOT_RADIUS, 0, Math.PI * 2);
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
  
  // Draw snap indicator
  if (snapIndicator) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const zoom = parseFloat(zoomLevel.value) || 1.0;
    const screenX = centerX + (snapIndicator.x * zoom);
    const screenY = centerY - (snapIndicator.y * zoom);
    
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    ctx.beginPath();
    ctx.arc(screenX, screenY, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Find dot at screen position
function findDotAt(screenX, screenY) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const zoom = parseFloat(zoomLevel.value) || 1.0;
  
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    // Convert world coords to screen coords for comparison
    const dotScreenX = centerX + (dot.x * zoom);
    const dotScreenY = centerY - (dot.y * zoom);
    const dx = dotScreenX - screenX;
    const dy = dotScreenY - screenY;
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
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  
  if (e.button === 0) { // Left click - add dot
    const centerY = canvas.height / 2;
    
    // In symmetry mode, don't allow dots in bottom half
    if (symmetryMode && screenY > centerY) {
      return;
    }
    
    const worldX = snapToGrid(screenX, canvas.width / 2);
    const worldY = snapToGrid(screenY, canvas.height / 2);
    // Negate Y to convert from screen to world coordinates
    const newDot = { x: worldX, y: -worldY };
    dots.push(newDot);
    
    // Track dots added during symmetry mode
    if (symmetryMode) {
      symmetryDots.push(newDot);
    }
    
    redraw();
    updateBackButtonVisibility();
  } else if (e.button === 2) { // Right click - remove dot
    const index = findDotAt(screenX, screenY);
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

// Track mouse position and display world coordinates
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Calculate snapped position for indicator
  const snappedX = snapToGrid(screenX, centerX);
  const snappedY = snapToGrid(screenY, centerY);
  
  // Display snapped coordinates
  mouseCoordsField.value = `(${Math.round(snappedX)}, ${Math.round(-snappedY)})`;
  
  // In symmetry mode, don't show indicator in bottom half
  if (symmetryMode && screenY > centerY) {
    snapIndicator = null;
  } else {
    snapIndicator = { x: snappedX, y: -snappedY };
  }
  
  redraw();
});

// Clear snap indicator when mouse leaves canvas
canvas.addEventListener('mouseleave', () => {
  snapIndicator = null;
  redraw();
});

// End button - connect all dots
endBtn.addEventListener('click', () => {
  if (dots.length < 2) return;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const zoom = parseFloat(zoomLevel.value) || 1.0;
  
  ctx.strokeStyle = '#4a90e2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  // Convert world coords to screen coords
  ctx.moveTo(centerX + (dots[0].x * zoom), centerY - (dots[0].y * zoom));
  
  for (let i = 1; i < dots.length; i++) {
    ctx.lineTo(centerX + (dots[i].x * zoom), centerY - (dots[i].y * zoom));
  }
  
  // Connect back to first dot
  ctx.lineTo(centerX + (dots[0].x * zoom), centerY - (dots[0].y * zoom));
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
    // Exiting symmetry mode - mirror symmetry dots across x-axis (negate Y) in REVERSE order
    for (let i = symmetryDots.length - 1; i >= 0; i--) {
      const dot = symmetryDots[i];
      // Mirror across x-axis by negating the Y world coordinate
      dots.push({ x: dot.x, y: -dot.y });
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
  updateBackButtonVisibility();
});

// Handle grid size changes
gridSizeInput.addEventListener('input', (e) => {
  gridSize = parseInt(e.target.value) || 0;
  redraw();
});

// Zoom change handler
zoomLevel.addEventListener('change', () => {
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
  updateBackButtonVisibility();
});