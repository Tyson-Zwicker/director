// Scene Builder JavaScript
import Color from '../color.js';

// Get canvas and context
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Get appearance controls
const redSlider = document.getElementById('redSlider');
const greenSlider = document.getElementById('greenSlider');
const blueSlider = document.getElementById('blueSlider');
const redValue = document.getElementById('redValue');
const greenValue = document.getElementById('greenValue');
const blueValue = document.getElementById('blueValue');
const fillPreview = document.getElementById('fillPreview');
const strokePreview = document.getElementById('strokePreview');
const textPreview = document.getElementById('textPreview');
const colorTypeRadios = document.querySelectorAll('input[name="colorType"]');
const appearanceName = document.getElementById('appearanceName');
const addButton = document.getElementById('addAppearance');
const removeButton = document.getElementById('removeAppearance');
const appearanceList = document.getElementById('appearanceList');
const actorAppearanceDropdown = document.getElementById('actorAppearance');
const actorPolygonDropdown = document.getElementById('actorPolygon');
const actorMass = document.getElementById('actorMass');
const actorXPos = document.getElementById('actorXPos');
const actorYPos = document.getElementById('actorYPos');
const actorXVel = document.getElementById('actorXVel');
const actorYVel = document.getElementById('actorYVel');
const actorFacing = document.getElementById('actorFacing');
const actorSpin = document.getElementById('actorSpin');
const addPolygonButton = document.getElementById('addPolygon');
const removePolygonButton = document.getElementById('removePolygon');
const polygonList = document.getElementById('polygonList');
const polygonCanvas = document.getElementById('polygonCanvas');
const polygonCtx = polygonCanvas.getContext('2d');

let polygons = [];
let selectedPolygonIndex = -1;

// Validate number inputs for position and velocity fields
function validateNumberInput(inputElement) {
    const value = inputElement.value.trim();
    
    if (value === '') {
        inputElement.style.backgroundColor = '';
        inputElement.style.color = '';
        return;
    }
    
    if (isNaN(value) || value === '') {
        inputElement.style.backgroundColor = '#8B0000';
        inputElement.style.color = '#ffffff';
        // Prevent the invalid value from being set
        setTimeout(() => {
            inputElement.value = '';
            inputElement.style.backgroundColor = '';
            inputElement.style.color = '';
        }, 500);
    } else {
        inputElement.style.backgroundColor = '';
        inputElement.style.color = '';
    }
}

actorMass.addEventListener('input', (e) => validateNumberInput(e.target));
actorXPos.addEventListener('input', (e) => validateNumberInput(e.target));
actorYPos.addEventListener('input', (e) => validateNumberInput(e.target));
actorXVel.addEventListener('input', (e) => validateNumberInput(e.target));
actorYVel.addEventListener('input', (e) => validateNumberInput(e.target));
actorSpin.addEventListener('input', (e) => validateNumberInput(e.target));

// Store color values for each type
const colors = {
    fill: { r: 0, g: 0, b: 0 },
    stroke: { r: 0, g: 0, b: 0 },
    text: { r: 0, g: 0, b: 0 }
};

let currentColorType = 'fill';
let appearances = [];
let selectedAppearanceIndex = -1;

// Update color preview for specific type
function updateColorPreview(type) {
    const color = new Color(colors[type].r, colors[type].g, colors[type].b);
    const hexColor = color.asHex();
    
    if (type === 'fill') {
        fillPreview.style.backgroundColor = hexColor;
        fillPreview.textContent = hexColor;
    } else if (type === 'stroke') {
        strokePreview.style.backgroundColor = hexColor;
        strokePreview.textContent = hexColor;
    } else if (type === 'text') {
        textPreview.style.backgroundColor = hexColor;
        textPreview.textContent = hexColor;
    }
}

// Update all color previews
function updateAllPreviews() {
    updateColorPreview('fill');
    updateColorPreview('stroke');
    updateColorPreview('text');
}

// Update sliders from current color type
function loadSlidersFromCurrentType() {
    redSlider.value = colors[currentColorType].r;
    greenSlider.value = colors[currentColorType].g;
    blueSlider.value = colors[currentColorType].b;
    
    redValue.textContent = colors[currentColorType].r;
    greenValue.textContent = colors[currentColorType].g;
    blueValue.textContent = colors[currentColorType].b;
}

// Save sliders to current color type
function saveSlidersToCurrentType() {
    colors[currentColorType].r = parseInt(redSlider.value);
    colors[currentColorType].g = parseInt(greenSlider.value);
    colors[currentColorType].b = parseInt(blueSlider.value);
    
    redValue.textContent = colors[currentColorType].r;
    greenValue.textContent = colors[currentColorType].g;
    blueValue.textContent = colors[currentColorType].b;
    
    updateColorPreview(currentColorType);
}

// Add event listeners for sliders
redSlider.addEventListener('input', saveSlidersToCurrentType);
greenSlider.addEventListener('input', saveSlidersToCurrentType);
blueSlider.addEventListener('input', saveSlidersToCurrentType);

// Add event listeners for radio buttons
colorTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentColorType = e.target.value;
        loadSlidersFromCurrentType();
    });
});

// Initialize all color previews
updateAllPreviews();

// Add appearance to list
function addAppearance() {
    const name = appearanceName.value.trim() || `Appearance ${appearances.length + 1}`;
    
    const newAppearance = {
        name: name,
        fill: { ...colors.fill },
        stroke: { ...colors.stroke },
        text: { ...colors.text }
    };
    
    appearances.push(newAppearance);
    renderAppearanceList();
}

// Remove selected appearance from list
function removeAppearance() {
    if (selectedAppearanceIndex >= 0 && selectedAppearanceIndex < appearances.length) {
        appearances.splice(selectedAppearanceIndex, 1);
        selectedAppearanceIndex = -1;
        renderAppearanceList();
    }
}

// Render the appearance list
function renderAppearanceList() {
    appearanceList.innerHTML = '';
    
    appearances.forEach((appearance, index) => {
        const item = document.createElement('div');
        item.className = 'appearance-item';
        if (index === selectedAppearanceIndex) {
            item.classList.add('selected');
        }
        item.textContent = appearance.name;
        item.addEventListener('click', () => loadAppearance(index));
        appearanceList.appendChild(item);
    });
    
    // Update actor appearance dropdown
    updateActorAppearanceDropdown();
}

// Update the actor appearance dropdown with current appearances
function updateActorAppearanceDropdown() {
    // Save current selection
    const currentSelection = actorAppearanceDropdown.value;
    
    // Clear and rebuild dropdown
    actorAppearanceDropdown.innerHTML = '<option value="">Select appearance...</option>';
    
    appearances.forEach((appearance, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = appearance.name;
        actorAppearanceDropdown.appendChild(option);
    });
    
    // Restore selection if it still exists
    if (currentSelection !== '') {
        actorAppearanceDropdown.value = currentSelection;
    }
}

// Load appearance into controls
function loadAppearance(index) {
    selectedAppearanceIndex = index;
    const appearance = appearances[index];
    
    // Update name
    appearanceName.value = appearance.name;
    
    // Update colors
    colors.fill = { ...appearance.fill };
    colors.stroke = { ...appearance.stroke };
    colors.text = { ...appearance.text };
    
    // Update sliders to current color type
    loadSlidersFromCurrentType();
    
    // Update all previews
    updateAllPreviews();
    
    // Update selected state in list
    renderAppearanceList();
}

// Add event listeners for buttons
addButton.addEventListener('click', addAppearance);
removeButton.addEventListener('click', removeAppearance);

// Update the actor polygon dropdown with current polygons
function updateActorPolygonDropdown() {
    // Save current selection
    const currentSelection = actorPolygonDropdown.value;
    
    // Clear and rebuild dropdown
    actorPolygonDropdown.innerHTML = '<option value="">Select polygon...</option>';
    
    polygons.forEach((polygon, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = polygon.name;
        actorPolygonDropdown.appendChild(option);
    });
    
    // Restore selection if it still exists
    if (currentSelection !== '') {
        actorPolygonDropdown.value = currentSelection;
    }
}

// Polygon management functions
function removePolygon() {
    if (selectedPolygonIndex >= 0 && selectedPolygonIndex < polygons.length) {
        polygons.splice(selectedPolygonIndex, 1);
        selectedPolygonIndex = -1;
        renderPolygonList();
    }
}

function renderPolygonList() {
    polygonList.innerHTML = '';
    
    polygons.forEach((polygon, index) => {
        const item = document.createElement('div');
        item.className = 'polygon-item';
        if (index === selectedPolygonIndex) {
            item.classList.add('selected');
        }
        item.textContent = polygon.name;
        item.addEventListener('click', () => {
            selectedPolygonIndex = index;
            renderPolygonList();
            drawPolygonPreview(polygon);
        });
        polygonList.appendChild(item);
    });
    
    // Update actor polygon dropdown
    updateActorPolygonDropdown();
    
    // Clear canvas if no polygon selected
    if (selectedPolygonIndex === -1) {
        clearPolygonCanvas();
    }
}

// Draw selected polygon on canvas
function drawPolygonPreview(polygon) {
    if (!polygon.points || polygon.points.length === 0) {
        clearPolygonCanvas();
        return;
    }
    
    // Clear canvas
    polygonCtx.clearRect(0, 0, polygonCanvas.width, polygonCanvas.height);
    
    // Draw grid
    polygonCtx.strokeStyle = '#404040';
    polygonCtx.lineWidth = 1;
    const centerX = polygonCanvas.width / 2;
    const centerY = polygonCanvas.height / 2;
    
    // Vertical lines
    for (let x = 0; x <= polygonCanvas.width; x += 50) {
        polygonCtx.beginPath();
        polygonCtx.moveTo(x, 0);
        polygonCtx.lineTo(x, polygonCanvas.height);
        polygonCtx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= polygonCanvas.height; y += 50) {
        polygonCtx.beginPath();
        polygonCtx.moveTo(0, y);
        polygonCtx.lineTo(polygonCanvas.width, y);
        polygonCtx.stroke();
    }
    
    // Draw axes
    polygonCtx.strokeStyle = '#888';
    polygonCtx.lineWidth = 2;
    polygonCtx.beginPath();
    polygonCtx.moveTo(centerX, 0);
    polygonCtx.lineTo(centerX, polygonCanvas.height);
    polygonCtx.stroke();
    
    polygonCtx.beginPath();
    polygonCtx.moveTo(0, centerY);
    polygonCtx.lineTo(polygonCanvas.width, centerY);
    polygonCtx.stroke();
    
    // Calculate scaling to fit polygon in canvas
    const points = polygon.points;
    const padding = 40;
    const maxDim = Math.max(polygonCanvas.width, polygonCanvas.height) - padding * 2;
    
    // Find bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
    });
    
    const width = maxX - minX;
    const height = maxY - minY;
    const scale = Math.min(maxDim / Math.max(width, height, 1), 1);
    
    // Draw polygon
    polygonCtx.strokeStyle = '#4a90e2';
    polygonCtx.fillStyle = 'rgba(74, 144, 226, 0.2)';
    polygonCtx.lineWidth = 2;
    
    polygonCtx.beginPath();
    points.forEach((point, index) => {
        // Center the polygon in the canvas
        const x = centerX + (point.x - (minX + maxX) / 2) * scale;
        const y = centerY + (point.y - (minY + maxY) / 2) * scale;
        
        if (index === 0) {
            polygonCtx.moveTo(x, y);
        } else {
            polygonCtx.lineTo(x, y);
        }
    });
    polygonCtx.closePath();
    polygonCtx.fill();
    polygonCtx.stroke();
    
    // Draw vertices
    polygonCtx.fillStyle = '#FF6B6B';
    points.forEach(point => {
        const x = centerX + (point.x - (minX + maxX) / 2) * scale;
        const y = centerY + (point.y - (minY + maxY) / 2) * scale;
        polygonCtx.beginPath();
        polygonCtx.arc(x, y, 4, 0, Math.PI * 2);
        polygonCtx.fill();
    });
}

// Clear polygon canvas
function clearPolygonCanvas() {
    polygonCtx.clearRect(0, 0, polygonCanvas.width, polygonCanvas.height);
    
    // Draw grid
    polygonCtx.strokeStyle = '#404040';
    polygonCtx.lineWidth = 1;
    const centerX = polygonCanvas.width / 2;
    const centerY = polygonCanvas.height / 2;
    
    for (let x = 0; x <= polygonCanvas.width; x += 50) {
        polygonCtx.beginPath();
        polygonCtx.moveTo(x, 0);
        polygonCtx.lineTo(x, polygonCanvas.height);
        polygonCtx.stroke();
    }
    
    for (let y = 0; y <= polygonCanvas.height; y += 50) {
        polygonCtx.beginPath();
        polygonCtx.moveTo(0, y);
        polygonCtx.lineTo(polygonCanvas.width, y);
        polygonCtx.stroke();
    }
    
    // Draw axes
    polygonCtx.strokeStyle = '#888';
    polygonCtx.lineWidth = 2;
    polygonCtx.beginPath();
    polygonCtx.moveTo(centerX, 0);
    polygonCtx.lineTo(centerX, polygonCanvas.height);
    polygonCtx.stroke();
    
    polygonCtx.beginPath();
    polygonCtx.moveTo(0, centerY);
    polygonCtx.lineTo(polygonCanvas.width, centerY);
    polygonCtx.stroke();
}

// Add event listeners for polygon buttons
addPolygonButton.addEventListener('click', addPolygon);
removePolygonButton.addEventListener('click', removePolygon);

// Modal elements for polygon selection
const polygonSelectModal = document.getElementById('polygonSelectModal');
const polygonSelectList = document.getElementById('polygonSelectList');
const modalAddPolygonBtn = document.getElementById('modalAddPolygonBtn');
const modalCancelPolygonBtn = document.getElementById('modalCancelPolygonBtn');
let selectedStoredPolygonName = null;

// Update addPolygon to show modal with stored polygons
function addPolygon() {
    try {
        const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
        
        if (!storedPolygons) {
            alert('No saved polygons found. Use the Builder page to create polygons.');
            return;
        }
        
        const polygonsData = JSON.parse(storedPolygons);
        const polygonNames = Object.keys(polygonsData);
        
        if (polygonNames.length === 0) {
            alert('No saved polygons found. Use the Builder page to create polygons.');
            return;
        }
        
        // Show modal and populate list
        selectedStoredPolygonName = null;
        polygonSelectList.innerHTML = '';
        
        polygonNames.forEach(name => {
            const item = document.createElement('div');
            item.className = 'polygon-select-item';
            item.textContent = `${name} (${polygonsData[name].length} points)`;
            item.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.polygon-select-item').forEach(el => {
                    el.classList.remove('selected');
                });
                // Select this item
                item.classList.add('selected');
                selectedStoredPolygonName = name;
            });
            polygonSelectList.appendChild(item);
        });
        
        polygonSelectModal.style.display = 'block';
    } catch (error) {
        alert('Error loading polygons: ' + error.message);
    }
}

// Modal add button
modalAddPolygonBtn.addEventListener('click', () => {
    if (!selectedStoredPolygonName) {
        alert('Please select a polygon to add');
        return;
    }
    
    try {
        const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
        const polygonsData = JSON.parse(storedPolygons);
        const polygonPoints = polygonsData[selectedStoredPolygonName];
        
        // Add polygon to list with its data
        polygons.push({ 
            name: selectedStoredPolygonName,
            points: polygonPoints
        });
        
        renderPolygonList();
        polygonSelectModal.style.display = 'none';
    } catch (error) {
        alert('Error adding polygon: ' + error.message);
    }
});

// Modal cancel button
modalCancelPolygonBtn.addEventListener('click', () => {
    polygonSelectModal.style.display = 'none';
});

// Close modal when clicking outside
polygonSelectModal.addEventListener('click', (e) => {
    if (e.target === polygonSelectModal) {
        polygonSelectModal.style.display = 'none';
    }
});

// Initialize the canvas
function initCanvas() {
    // Resize canvas to fit available space
    const column = canvas.parentElement;
    const columnWidth = column.clientWidth - 42; // Account for padding (20px * 2) and borders
    const columnHeight = column.clientHeight - 80; // Account for heading and spacing
    
    canvas.width = Math.max(300, columnWidth);
    canvas.height = Math.max(400, columnHeight);
    
    // Draw initial grid or background
    drawMapView();
}

// Draw the map view
function drawMapView() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw axes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    
    // Vertical axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Horizontal axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
}

// Initialize when page loads
window.addEventListener('load', initCanvas);
window.addEventListener('resize', initCanvas);

// Initialize polygon canvas
clearPolygonCanvas();
