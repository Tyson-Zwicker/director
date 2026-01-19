const color_grid = '#555555';
const color_centerLine = '#00aa00';
const color_labels = '#0060A0';
const color_lines = '#4499ff';
const color_dots = '#ff0000';
const nameField = document.getElementById('name'); //EVERYTHING has a name.
const zoomRange = document.getElementById('zoomRange');
const zoomValue = document.getElementById('zoomValue');
const gridSizeRange = document.getElementById('gridSizeRange');
const gridSizeValue = document.getElementById('gridSizeValue');
const usePointsBtn = document.getElementById('usePoints');
const horizontalSymmetryBtn = document.getElementById('horizontalSymmetry');
const clearBtn = document.getElementById('clearPoints');
const panUpBtn = document.getElementById('panUp');
const panDownBtn = document.getElementById('panDown');
const panLeftBtn = document.getElementById('panLeft');
const panRightBtn = document.getElementById('panRight');
const panCenterBtn = document.getElementById('panCenter');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const mouseCoordsX = document.getElementById('mouseCoordsX');
const mouseCoordsY = document.getElementById('mouseCoordsY');
let currentZoom = 1;
let currentGridSize = 10;
let horizontalSymmetry = false;
let panX = 0;
let panY = 0;
let panStep = 20;
const polygon = [];
const hSymPoints = [];
let polygonReference = undefined; //ref to main.js currentPolygonData..



export default function setUpCanvas(showCanvas, readOnly, polyRef) {
  if (!showCanvas) {
    hide();
  }
  if (readOnly) {
    const divCanvasButtons = document.getElementById('div_canvasButtons');
    if (divCanvasButtons) {
      divCanvasButtons.classList.add('is-hidden');
    }
  }
  if (polyRef) {
    polygonReference = polyRef;
    drawCanvas();
  }
  return drawCanvas; //returns the function so it can be called from main.js
}
function hide() {
  const column3 = document.getElementById('column3');
  if (column3) {
    column3.classList.add('is-hidden');
  }
}
zoomRange.addEventListener('input', (e) => {
  currentZoom = parseFloat(e.target.value);
  zoomValue.value = currentZoom.toFixed(1);
});
zoomRange.addEventListener('change', (e) => {
  currentZoom = parseFloat(e.target.value);
  zoomValue.value = currentZoom.toFixed(1);
  drawCanvas();
  panStep = 20 / currentZoom;
});
gridSizeRange.addEventListener('input', (e) => {
  currentGridSize = parseInt(e.target.value);
  gridSizeValue.value = currentGridSize;
});
gridSizeRange.addEventListener('change', (e) => {
  currentGridSize = parseInt(e.target.value);
  gridSizeValue.value = currentGridSize;
  drawCanvas();
});
usePointsBtn.addEventListener('click', () => {        //sets polygon in main.js
  console.log('using:');
  console.log(polygon);
  polygonReference.length = 0;
  polygonReference.push(...polygon);
  console.log('ref is now:');
  console.log(polygonReference);
  let name = nameField.value;
  alert(`Current polygon attached to: ${name}`);
});
horizontalSymmetryBtn.addEventListener('click', () => {
  if (horizontalSymmetry) {
    placeHSymPoints();
  }
  horizontalSymmetry = !horizontalSymmetry;
  hSymPoints.length = 0;;
  horizontalSymmetryBtn.classList.toggle('active');
  drawCanvas();
});
clearBtn.addEventListener('click', () => {
  polygon.length = 0;
  hSymPoints.length = 0;
  drawCanvas();
});
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
canvas.addEventListener('click', (e) => {
  let rect = canvas.getBoundingClientRect();
  let mouse = {
    "x": Math.floor(e.clientX - rect.left),
    "y": Math.floor(e.clientY - rect.top)
  };
  handleCanvasClick(mouse);
  drawCanvas();
});
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  let rect = canvas.getBoundingClientRect();
  let mouse = {
    "x": Math.floor(e.clientX - rect.left),
    "y": Math.floor(e.clientY - rect.top)
  };
  handleCanvasClick(mouse, true);
  drawCanvas();
});
canvas.addEventListener('mousemove', (e) => {
  let rect = canvas.getBoundingClientRect();
  let screenCoord = {
    "x": e.clientX - rect.left,
    "y": e.clientY - rect.top
  };
  let localCoord = screenToLocal(screenCoord);
  mouseCoordsX.value = Math.round(localCoord.x * 100) / 100;
  mouseCoordsY.value = Math.round(localCoord.y * 100) / 100;
});
function localToScreen(local, xOffset, yOffset) {  
  let screen = { "x": local.x, "y": local.y }
  screen.x += panX; screen.y += panY;
  if (xOffset && yOffset) {
    screen.x += xOffset, y += yOffset;
  }
  screen.x *= currentZoom; screen.y *= currentZoom;
  screen.x += (canvas.width / 2); screen.y += (canvas.height / 2);
  return screen;
}
function screenToLocal(screen) {
  let local = { "x": screen.x, "y": screen.y };
  local.x -= (canvas.width / 2); local.y -= (canvas.height / 2);
  local.x /= currentZoom; local.y /= currentZoom;
  local.x -= panX; local.y -= panY;
  return local;
}
function drawCanvas(poly, x, y) {
  console.log (`drawCanvas: offset ${x},${y}`);
  if (poly) { //Param is only used when called from main..
    polygon.length = 0;
    polygon.push(...poly);
  }
  if (typeof x ==='number' && typeof y ==='number') {
    //this is an overlay with an offset- don't clear the screen and redraw the grid..
    //just draw the polygon that gave us with an offset.
    _drawPolygon(x, y);
  } else {
    // drawing a polygon like normal..
    _drawBackground();
    _drawGrid();
    _drawGridLabels();
    _drawPolygon();
  }
}
function _drawBackground() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (horizontalSymmetry) {
    ctx.fillStyle = '#555555';
    let cy = localToScreen({ "x": 0, "y": 0 }).y;
    ctx.fillRect(0, cy, canvas.width, canvas.height - cy);
  }
}
function _drawPolygon(x, y) {
  console.log (`_drawPolygon: offset ${x},${y}`);
  ctx.strokeStyle = color_lines;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < polygon.length; i++) {
    let screen = localToScreen(polygon[i], x, y);
    if (i === 0) ctx.moveTo(screen.x, screen.y);
    else ctx.lineTo(screen.x, screen.y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = color_dots;
  for (let i = 0; i < polygon.length; i++) {
    let screen = localToScreen(polygon[i]);
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function _drawGrid() {
  let gridSize = Math.floor(currentGridSize);
  if (gridSize >= 3) {
    ctx.strokeStyle = color_grid;
    ctx.lineWidth = 1;
    let x; let y; let sx; let sy;//local /screen
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
    let topCenter = localToScreen({ "x": 0, "y": top }); let bottomCenter = localToScreen({ "x": 0, "y": bottom });
    let leftCenter = localToScreen({ "x": left, "y": 0 }); let rightCenter = localToScreen({ "x": right, "y": 0 });
    let center = localToScreen({ "x": 0, "y": 0 });
    ctx.strokeStyle = color_centerLine;
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(topCenter.x, topCenter.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(bottomCenter.x, bottomCenter.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(leftCenter.x, leftCenter.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(rightCenter.x, rightCenter.y); ctx.stroke();
  }
}

function _drawGridLabels() {

}
function handleCanvasClick(mouseCoord, rightButton) {
  let localCoord = screenToLocal(mouseCoord);
  if (horizontalSymmetry) {
    if (localCoord.y <= 0) {
      if (rightButton) {
        removeNearestHSymPoint(localCoord);
        removeNearestPolygonPoint(localCoord);
      } else {
        let snappedCoord = snapToGrid(localCoord);
        hSymPoints.push(snappedCoord);
        polygon.push(snappedCoord);
      }
    }
  } else {
    if (rightButton) {
      removeNearestPolygonPoint(localCoord);
    } else {
      let snappedCoord = snapToGrid(localCoord);
      polygon.push(snappedCoord);
    }
  }
}
function removeNearestPolygonPoint(point) {
  let nearestIndex = -1;
  let nearestDistance = Infinity;
  for (let i = 0; i < polygon.length; i++) {
    let dx = polygon[i].x - point.x;
    let dy = polygon[i].y - point.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = i;
    }
  }
  if (nearestIndex !== -1) {
    polygon.splice(nearestIndex, 1);
  }
}
function removeNearestHSymPoint(point) {
  let nearestIndex = -1;
  let nearestDistance = Infinity;
  for (let i = 0; i < hSymPoints.length; i++) {
    let dx = hSymPoints[i].x - point.x;
    let dy = hSymPoints[i].y - point.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = i;
    }
  }
  if (nearestIndex !== -1) {
    hSymPoints.splice(nearestIndex, 1);
  }
}
function placeHSymPoints() {
  for (let i = hSymPoints.length - 1; i >= 0; i--) { //draw them in reverse order, with inverted y's.
    polygon.push({ "x": hSymPoints[i].x, "y": -hSymPoints[i].y });
  }
}
function snapToGrid(localCoord) {
  return {
    x: Math.round(localCoord.x / currentGridSize) * currentGridSize,
    y: Math.round(localCoord.y / currentGridSize) * currentGridSize
  };
}