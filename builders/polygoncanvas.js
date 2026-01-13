const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const color_grid = '#555555';
const color_centerLine = '#00aa00';
const color_labels = '#0060A0';
const color_lines = '#4499ff';
const color_dots = '#ff0000';

let world_Center;
let world_Boundry;
let screen_Center;
let screen_Boundry;
let screen_GridSize;

// Get zoom controls
const zoomRange = document.getElementById('zoomRange');
const zoomValue = document.getElementById('zoomValue');

// Get grid size controls
const gridSizeRange = document.getElementById('gridSizeRange');
const gridSizeValue = document.getElementById('gridSizeValue');

// Get symmetry buttons
const horizontalSymmetryBtn = document.getElementById('HorizontalSymmetry');
const verticalSymmetryBtn = document.getElementById('VerticalSymmetry');

// Get pan controls
const panUpBtn = document.getElementById('panUp');
const panDownBtn = document.getElementById('panDown');
const panLeftBtn = document.getElementById('panLeft');
const panRightBtn = document.getElementById('panRight');
const panCenterBtn = document.getElementById('panCenter');

let currentZoom = 1;
let currentGridSize = 10;
let horizontalSymmetry = false;
let verticalSymmetry = false;
let panX = 0;
let panY = 0;
const panStep = 10;
let polygon = [{ x: -50, y: -50 }, { x: 25, y: -80 }, { "x": 70, "y": -40 }, { "x": 55, "y": -20 }, { "x": -40, "y": 50 }];

// Add event listener for zoom range slider
zoomRange.addEventListener('input', (e) => {
  currentZoom = parseFloat(e.target.value);
  zoomValue.value = currentZoom.toFixed(1);
});

// Add event listener for when slider is changed (released)
zoomRange.addEventListener('change', (e) => {
  currentZoom = parseFloat(e.target.value);
  zoomValue.value = currentZoom.toFixed(1);
  drawCanvas();
});

// Add event listener for grid size range slider
gridSizeRange.addEventListener('input', (e) => {
  currentGridSize = parseInt(e.target.value);
  gridSizeValue.value = currentGridSize;
});

// Add event listener for when grid size slider is changed (released)
gridSizeRange.addEventListener('change', (e) => {
  currentGridSize = parseInt(e.target.value);
  gridSizeValue.value = currentGridSize;
  drawCanvas();
});

// Add toggle functionality for horizontal symmetry button
horizontalSymmetryBtn.addEventListener('click', () => {
  horizontalSymmetry = !horizontalSymmetry;
  horizontalSymmetryBtn.classList.toggle('active');
});

// Add toggle functionality for vertical symmetry button
verticalSymmetryBtn.addEventListener('click', () => {
  verticalSymmetry = !verticalSymmetry;
  verticalSymmetryBtn.classList.toggle('active');
});

// Add pan control event listeners
panUpBtn.addEventListener('click', () => {
  panY += panStep;
  drawCanvas();
});

panDownBtn.addEventListener('click', () => {
  panY -= panStep;
  drawCanvas();
});

panLeftBtn.addEventListener('click', () => {
  panX += panStep;
  drawCanvas();
});

panRightBtn.addEventListener('click', () => {
  panX -= panStep;
  drawCanvas();
});

panCenterBtn.addEventListener('click', () => {
  panX = 0;
  panY = 0;
  drawCanvas();
});

function localToScreen(local) {
  let screen = { "x": local.x, "y": local.y }
  screen.x += panX; screen.y += panY;
  screen.x *= currentZoom; screen.y *= currentZoom;
  screen.x += (canvas.width / 2); screen.y += (canvas.height / 2);
  return screen;
}
function ScreenToLocal(screen) {
  let local = { "x": screen.x, "y": screen.y };
  local.x -= (canvas.width / 2); local.y -= (canvas.height / 2);
  local.x /= currentZoom; local.y /= currentZoom;
  local.x -= panX; local.y -= panY;
  return local;
}
function drawCanvas() {
  console.log('clearing the screen and calling draw subroutines.');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  _drawGrid();
  _drawGridLabels();
  _drawPolygon();
  console.log('draw subroutines completed.');
}
function _drawPolygon() {
  console.log('draw Polygon start');
  ctx.strokeStyle = color_lines;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < polygon.length; i++) {
    let screen = localToScreen(polygon[i]);
    if (i === 0) ctx.moveTo(screen.x, screen.y);
    else ctx.lineTo(screen.x, screen.y);
  }
  ctx.closePath();
  ctx.stroke();
  console.log('draw Polygon complete');
}

function _drawGrid() {
  console.log('draw grid start');
  let gridSize = Math.floor(currentGridSize * currentZoom);
  if (gridSize >= 3) {
    ctx.strokeStyle = color_grid;
    ctx.lineWidth = 1;
    let x; let y;let sx; let sy;//local /screen
    x = 0;
    do {
      sx = localToScreen({ "x": x, "y": 0 }).x;
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, canvas.height); ctx.stroke();
      x += gridSize;
    } while (sx < canvas.width);
    let right = x;
    x = 0;
    do {
      sx = localToScreen({ "x": x, "y": 0 }).x;
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, canvas.height); ctx.stroke();
      x -= gridSize;
    } while (sx > 0);
    let left = x;
    y = 0;
    do {
      sy = localToScreen({ "x": 0, "y": y }).y;
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(canvas.width, sy); ctx.stroke();
      y += gridSize;
    } while (sy < canvas.height);
    let bottom = y;
    y = 0;
    do {
      sy = localToScreen({ "x": 0, "y": y }).y;
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(canvas.width, sy); ctx.stroke();
      y -= gridSize;
    } while (sy > 0);
    let top = y;
    let topCenter = localToScreen({"x":0,  "y":top}); let bottomCenter = localToScreen({"x":0, "y":bottom});
    let leftCenter = localToScreen({"x":left, "y":0}); let rightCenter = localToScreen({"x":right, "y":0});
    let center = localToScreen({"x":0, "y":0});
    ctx.strokeStyle = color_centerLine;
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(topCenter.x, topCenter.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(bottomCenter.x, bottomCenter.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(leftCenter.x, leftCenter.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(rightCenter.x, rightCenter.y); ctx.stroke();
  }
  console.log('drawGrid() complete');
}

function _drawGridLabels() {

}
