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
const newAppearanceBtn = document.getElementById('newAppearanceBtn');
const exportAppearanceButton = document.getElementById('exportAppearance');
const importAppearanceButton = document.getElementById('importAppearance');
const actorAppearanceDropdown = document.getElementById('actorAppearance');
const actorPolygonDropdown = document.getElementById('actorPolygon');
const actorMass = document.getElementById('actorMass');
const actorXPos = document.getElementById('actorXPos');
const actorYPos = document.getElementById('actorYPos');
const actorXVel = document.getElementById('actorXVel');
const actorYVel = document.getElementById('actorYVel');
const actorFacing = document.getElementById('actorFacing');
const actorSpin = document.getElementById('actorSpin');
const actorName = document.getElementById('actorName');
const actorList = document.getElementById('actorList');
const addActorButton = document.getElementById('addActor');
const removeActorButton = document.getElementById('removeActor');
const importActorButton = document.getElementById('importActor');
const exportActorButton = document.getElementById('exportActor');
const deleteActorButton = document.getElementById('deleteActor');
const actorDeleteModal = document.getElementById('actorDeleteModal');
const actorDeleteList = document.getElementById('actorDeleteList');
const modalDeleteActorBtn = document.getElementById('modalDeleteActorBtn');
const modalCancelActorDeleteBtn = document.getElementById('modalCancelActorDeleteBtn');
const clearActorButton = document.getElementById('clearActor');
const addPolygonButton = document.getElementById('addPolygon');
const removePolygonButton = document.getElementById('removePolygon');
const createPolygonButton = document.getElementById('createPolygonBtn');
const managePolygonButton = document.getElementById('managePolygonBtn');
const polygonList = document.getElementById('polygonList');
const polygonCanvas = document.getElementById('polygonCanvas');
const polygonCtx = polygonCanvas.getContext('2d');
const zoomLevel = document.getElementById('zoomLevel');
const panUpBtn = document.getElementById('panUpBtn');
const panDownBtn = document.getElementById('panDownBtn');
const panLeftBtn = document.getElementById('panLeftBtn');
const panRightBtn = document.getElementById('panRightBtn');
const panCenterBtn = document.getElementById('panCenterBtn');
const partPolygonDropdown = document.getElementById('partPolygon');
const partAppearanceDropdown = document.getElementById('partAppearance');
const partName = document.getElementById('partName');
const partList = document.getElementById('partList');
const addPartButton = document.getElementById('addPart');
const removePartButton = document.getElementById('removePart');
const exportPartButton = document.getElementById('exportPart');
const importPartButton = document.getElementById('importPart');
const deletePartButton = document.getElementById('deletePart');
const partDeleteModal = document.getElementById('partDeleteModal');
const partDeleteList = document.getElementById('partDeleteList');
const modalDeletePartBtn = document.getElementById('modalDeletePartBtn');
const modalCancelPartDeleteBtn = document.getElementById('modalCancelPartDeleteBtn');
const actorPartsList = document.getElementById('actorPartsList');
const addActorPartButton = document.getElementById('addActorPart');
const removeActorPartButton = document.getElementById('removeActorPart');
const partXOffset = document.getElementById('partXOffset');
const partYOffset = document.getElementById('partYOffset');
const partFacing = document.getElementById('partFacing');
const changePartOffsetBtn = document.getElementById('changePartOffset');
const partSelectModal = document.getElementById('partSelectModal');
const partSelectList = document.getElementById('partSelectList');
const modalAddPartBtn = document.getElementById('modalAddPartBtn');
const modalCancelPartBtn = document.getElementById('modalCancelPartBtn');
const modalPartXOffset = document.getElementById('modalPartXOffset');
const modalPartYOffset = document.getElementById('modalPartYOffset');
const modalPartFacing = document.getElementById('modalPartFacing');
const resetDbBtn = document.getElementById('resetDbBtn');
const sceneName = document.getElementById('sceneName');
const sceneShortDesc = document.getElementById('sceneShortDesc');
const sceneMissionText = document.getElementById('sceneMissionText');
const sceneOutput = document.getElementById('sceneOutput');
const toJSONBtn = document.getElementById('toJSONBtn');
const importSceneBtn = document.getElementById('importSceneBtn');
const exportSceneBtn = document.getElementById('exportSceneBtn');
const sceneImportModal = document.getElementById('sceneImportModal');
const sceneImportList = document.getElementById('sceneImportList');
const modalImportSceneBtn = document.getElementById('modalImportSceneBtn');
const modalCancelSceneImportBtn = document.getElementById('modalCancelSceneImportBtn');
const actorPreviewCanvas = document.getElementById('actorPreviewCanvas');
const actorPreviewCtx = actorPreviewCanvas.getContext('2d');
const actorPreviewZoom = document.getElementById('actorPreviewZoom');

let polygons = [];
let selectedPolygonIndex = -1;
let actors = [];
let selectedActorIndex = -1;
let parts = [];
let selectedPartIndex = -1;
let actorParts = []; // Parts associated with current actor
let selectedPartForActor = null;
let panOffsetX = 0;
let panOffsetY = 0;

// ===== Helper Functions =====

// Helper: Remove selection from all items in a container
function removeAllSelections(containerSelector) {
    document.querySelectorAll(`${containerSelector} .polygon-select-item`).forEach(el => {
        el.classList.remove('selected');
    });
}

// Helper: Get data from localStorage with error handling
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return null;
    }
}

// Helper: Save data to localStorage with error handling
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
        return false;
    }
}

// Helper: Update a dropdown with items
function updateDropdown(dropdown, items, valueKey, textKey, placeholder = 'Select...') {
    const currentSelection = dropdown.value;
    dropdown.innerHTML = `<option value="">${placeholder}</option>`;
    
    items.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = valueKey ? item[valueKey] : index;
        option.textContent = textKey ? item[textKey] : item;
        dropdown.appendChild(option);
    });
    
    if (currentSelection !== '') {
        dropdown.value = currentSelection;
    }
}

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

// Actor Preview Drawing Functions
function clearActorPreview() {
    actorPreviewCtx.fillStyle = '#1a1a1a';
    actorPreviewCtx.fillRect(0, 0, actorPreviewCanvas.width, actorPreviewCanvas.height);
}

function drawActorPreviewGrid() {
    const centerX = actorPreviewCanvas.width / 2;
    const centerY = actorPreviewCanvas.height / 2;
    const gridSpacing = 10;
    
    actorPreviewCtx.strokeStyle = '#333333';
    actorPreviewCtx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = centerX; x <= actorPreviewCanvas.width; x += gridSpacing) {
        actorPreviewCtx.beginPath();
        actorPreviewCtx.moveTo(x, 0);
        actorPreviewCtx.lineTo(x, actorPreviewCanvas.height);
        actorPreviewCtx.stroke();
    }
    for (let x = centerX - gridSpacing; x >= 0; x -= gridSpacing) {
        actorPreviewCtx.beginPath();
        actorPreviewCtx.moveTo(x, 0);
        actorPreviewCtx.lineTo(x, actorPreviewCanvas.height);
        actorPreviewCtx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = centerY; y <= actorPreviewCanvas.height; y += gridSpacing) {
        actorPreviewCtx.beginPath();
        actorPreviewCtx.moveTo(0, y);
        actorPreviewCtx.lineTo(actorPreviewCanvas.width, y);
        actorPreviewCtx.stroke();
    }
    for (let y = centerY - gridSpacing; y >= 0; y -= gridSpacing) {
        actorPreviewCtx.beginPath();
        actorPreviewCtx.moveTo(0, y);
        actorPreviewCtx.lineTo(actorPreviewCanvas.width, y);
        actorPreviewCtx.stroke();
    }
    
    // Draw center axes (brighter)
    actorPreviewCtx.strokeStyle = '#555555';
    actorPreviewCtx.lineWidth = 2;
    
    // Y-axis
    actorPreviewCtx.beginPath();
    actorPreviewCtx.moveTo(centerX, 0);
    actorPreviewCtx.lineTo(centerX, actorPreviewCanvas.height);
    actorPreviewCtx.stroke();
    
    // X-axis
    actorPreviewCtx.beginPath();
    actorPreviewCtx.moveTo(0, centerY);
    actorPreviewCtx.lineTo(actorPreviewCanvas.width, centerY);
    actorPreviewCtx.stroke();
}

function worldToPreview(x, y, zoom = 1) {
    const centerX = actorPreviewCanvas.width / 2;
    const centerY = actorPreviewCanvas.height / 2;
    return {
        x: centerX + x * zoom,
        y: centerY - y * zoom  // Flip Y axis for standard coordinate system
    };
}

function drawPolygonInPreview(polygonPoints, appearance, offsetX = 0, offsetY = 0, facing = 0, zoom = 1) {
    if (!polygonPoints || polygonPoints.length === 0) return;
    
    const centerX = actorPreviewCanvas.width / 2;
    const centerY = actorPreviewCanvas.height / 2;
    
    // Convert facing from degrees to radians
    const angleRad = (facing * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    
    actorPreviewCtx.beginPath();
    
    polygonPoints.forEach((point, index) => {
        // Rotate point around origin
        const rotatedX = point.x * cosA - point.y * sinA;
        const rotatedY = point.x * sinA + point.y * cosA;
        
        // Apply offset and convert to screen coords
        const screenPoint = worldToPreview(rotatedX + offsetX, rotatedY + offsetY, zoom);
        
        if (index === 0) {
            actorPreviewCtx.moveTo(screenPoint.x, screenPoint.y);
        } else {
            actorPreviewCtx.lineTo(screenPoint.x, screenPoint.y);
        }
    });
    
    actorPreviewCtx.closePath();
    
    // Fill
    if (appearance && appearance.fill) {
        const fill = appearance.fill;
        // Convert 4-bit color (0-15) to 8-bit (0-255)
        const r = (fill.r !== undefined ? fill.r : 0) * 17;
        const g = (fill.g !== undefined ? fill.g : 0) * 17;
        const b = (fill.b !== undefined ? fill.b : 0) * 17;
        const colorString = `rgb(${r}, ${g}, ${b})`;
        actorPreviewCtx.fillStyle = colorString;
        actorPreviewCtx.fill();
    }
    
    // Stroke
    if (appearance && appearance.stroke) {
        const stroke = appearance.stroke;
        // Convert 4-bit color (0-15) to 8-bit (0-255)
        const r = (stroke.r !== undefined ? stroke.r : 0) * 17;
        const g = (stroke.g !== undefined ? stroke.g : 0) * 17;
        const b = (stroke.b !== undefined ? stroke.b : 0) * 17;
        const colorString = `rgb(${r}, ${g}, ${b})`;
        actorPreviewCtx.strokeStyle = colorString;
        actorPreviewCtx.lineWidth = 2;
        actorPreviewCtx.stroke();
    }
}

function drawActorPreview(actor) {
    clearActorPreview();
    drawActorPreviewGrid();
    
    if (!actor) return;
    
    // Get polygon data
    const polygon = polygons.find(p => p.name === actor.polygonName);
    if (!polygon || !polygon.points || polygon.points.length === 0) {
        return;
    }
    
    // Get appearance data
    const appearance = appearances.find(a => a.name === actor.appearanceName);
    console.log('Actor appearance lookup:', actor.appearanceName, appearance);
    if (!appearance) {
        return;
    }
    
    // Calculate bounding box for auto-scaling
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    const actorFacing = actor.facing || 0;
    const angleRad = (actorFacing * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    
    // Include actor polygon points
    polygon.points.forEach(point => {
        const rotatedX = point.x * cosA - point.y * sinA;
        const rotatedY = point.x * sinA + point.y * cosA;
        minX = Math.min(minX, rotatedX);
        maxX = Math.max(maxX, rotatedX);
        minY = Math.min(minY, rotatedY);
        maxY = Math.max(maxY, rotatedY);
    });
    
    // Include part polygons
    if (actor.parts && Array.isArray(actor.parts)) {
        actor.parts.forEach(partInfo => {
            const part = parts.find(p => p.name === partInfo.name);
            if (!part) return;
            
            const partPolygon = polygons.find(p => p.name === part.polygonName);
            if (!partPolygon || !partPolygon.points) return;
            
            const xOffset = partInfo.xOffset || 0;
            const yOffset = partInfo.yOffset || 0;
            const rotatedOffsetX = xOffset * cosA - yOffset * sinA;
            const rotatedOffsetY = xOffset * sinA + yOffset * cosA;
            
            partPolygon.points.forEach(point => {
                const rotatedX = point.x * cosA - point.y * sinA + rotatedOffsetX;
                const rotatedY = point.x * sinA + point.y * cosA + rotatedOffsetY;
                minX = Math.min(minX, rotatedX);
                maxX = Math.max(maxX, rotatedX);
                minY = Math.min(minY, rotatedY);
                maxY = Math.max(maxY, rotatedY);
            });
        });
    }
    
    // Calculate auto-scale zoom to fit in canvas with padding
    const padding = 20; // pixels of padding
    const boundingWidth = maxX - minX;
    const boundingHeight = maxY - minY;
    const availableWidth = actorPreviewCanvas.width - (padding * 2);
    const availableHeight = actorPreviewCanvas.height - (padding * 2);
    
    let autoZoom = 1;
    if (boundingWidth > 0 && boundingHeight > 0) {
        const zoomX = availableWidth / boundingWidth;
        const zoomY = availableHeight / boundingHeight;
        autoZoom = Math.min(zoomX, zoomY, 10); // Cap at 10x zoom
        autoZoom = Math.max(autoZoom, 0.1); // Minimum 0.1x zoom
    }
    
    // Update zoom field
    actorPreviewZoom.value = autoZoom.toFixed(2);
    
    // Draw the actor's polygon
    drawPolygonInPreview(polygon.points, appearance, 0, 0, actorFacing, autoZoom);
    
    // Draw parts if they exist
    if (actor.parts && Array.isArray(actor.parts)) {
        actor.parts.forEach(partInfo => {
            const part = parts.find(p => p.name === partInfo.name);
            if (!part) return;
            
            const partPolygon = polygons.find(p => p.name === part.polygonName);
            if (!partPolygon || !partPolygon.points) return;
            
            const partAppearance = appearances[part.appearanceIndex];
            console.log('Part appearance lookup:', part.appearanceIndex, partAppearance);
            if (!partAppearance) return;
            
            // Calculate part position relative to actor using offsets
            const xOffset = partInfo.xOffset || 0;
            const yOffset = partInfo.yOffset || 0;
            const partFacingOffset = partInfo.facing || 0;
            const rotatedX = xOffset * cosA - yOffset * sinA;
            const rotatedY = xOffset * sinA + yOffset * cosA;
            
            drawPolygonInPreview(partPolygon.points, partAppearance, rotatedX, rotatedY, actorFacing + partFacingOffset, autoZoom);
        });
    } else if (actor.partNames && Array.isArray(actor.partNames)) {
        // Legacy format support (parts without offsets)
        actor.partNames.forEach(partName => {
            const part = parts.find(p => p.name === partName);
            if (!part) return;
            
            const partPolygon = polygons.find(p => p.name === part.polygonName);
            if (!partPolygon || !partPolygon.points) return;
            
            const partAppearance = appearances[part.appearanceIndex];
            if (!partAppearance) return;
            
            drawPolygonInPreview(partPolygon.points, partAppearance, 0, 0, actor.facing || 0);
        });
    }
}

// Initialize all color previews
updateAllPreviews();

// Add appearance to list
function addAppearance() {
    const name = appearanceName.value.trim() || `Appearance ${appearances.length + 1}`;
    
    // Check if an appearance with this name already exists
    const existingIndex = appearances.findIndex(appearance => appearance.name === name);
    if (existingIndex !== -1) {
        const shouldReplace = confirm(`An appearance with the name "${name}" already exists. Do you want to replace it?`);
        if (!shouldReplace) {
            return;
        }
        // Replace the existing appearance
        appearances[existingIndex] = {
            name: name,
            fill: { ...colors.fill },
            stroke: { ...colors.stroke },
            text: { ...colors.text }
        };
    } else {
        // Add new appearance
        const newAppearance = {
            name: name,
            fill: { ...colors.fill },
            stroke: { ...colors.stroke },
            text: { ...colors.text }
        };
        appearances.push(newAppearance);
    }
    
    renderAppearanceList();
    
    // Clear the form fields after adding
    appearanceName.value = '';
    colors.fill = { r: 0, g: 0, b: 0 };
    colors.stroke = { r: 0, g: 0, b: 0 };
    colors.text = { r: 0, g: 0, b: 0 };
    redSlider.value = 0;
    greenSlider.value = 0;
    blueSlider.value = 0;
    redValue.textContent = 0;
    greenValue.textContent = 0;
    blueValue.textContent = 0;
    updateAllPreviews();
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
    
    // Update part appearance dropdown
    updatePartAppearanceDropdown();
}

// Update the actor appearance dropdown with current appearances
function updateActorAppearanceDropdown() {
    updateDropdown(actorAppearanceDropdown, appearances, 'name', 'name', 'Select appearance...');
}

// Update the part appearance dropdown with current appearances
function updatePartAppearanceDropdown() {
    updateDropdown(partAppearanceDropdown, appearances, null, 'name', 'Select appearance...');
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

// New appearance button - reset fields and deselect
newAppearanceBtn.addEventListener('click', () => {
    // Clear the name field
    appearanceName.value = '';
    
    // Reset colors to black
    colors.fill = { r: 0, g: 0, b: 0 };
    colors.stroke = { r: 0, g: 0, b: 0 };
    colors.text = { r: 0, g: 0, b: 0 };
    
    // Reset sliders
    redSlider.value = 0;
    greenSlider.value = 0;
    blueSlider.value = 0;
    redValue.textContent = 0;
    greenValue.textContent = 0;
    blueValue.textContent = 0;
    
    // Update previews
    updateAllPreviews();
    
    // Deselect appearance list
    appearanceList.selectedIndex = -1;
    selectedAppearanceIndex = -1;
});

// Export appearance to localStorage
exportAppearanceButton.addEventListener('click', () => {
    const name = appearanceName.value.trim();
    
    if (!name) {
        alert('Please enter a name for the appearance before exporting.');
        return;
    }
    
    const appearanceData = {
        name: name,
        fill: { ...colors.fill },
        stroke: { ...colors.stroke },
        text: { ...colors.text }
    };
    
    const appearancesData = getFromLocalStorage('sceneBuilderStoredAppearances') || {};
    appearancesData[name] = appearanceData;
    
    if (saveToLocalStorage('sceneBuilderStoredAppearances', appearancesData)) {
        alert(`Appearance "${name}" exported successfully!`);
    } else {
        alert('Error exporting appearance.');
    }
});

// Import appearance modal
const appearanceImportModal = document.getElementById('appearanceImportModal');
const appearanceImportList = document.getElementById('appearanceImportList');
const modalImportAppearanceBtn = document.getElementById('modalImportAppearanceBtn');
const modalCancelAppearanceBtn = document.getElementById('modalCancelAppearanceBtn');
let selectedImportAppearanceName = null;

importAppearanceButton.addEventListener('click', () => {
    try {
        const storedAppearances = localStorage.getItem('sceneBuilderStoredAppearances');
        
        if (!storedAppearances) {
            alert('No saved appearances found.');
            return;
        }
        
        const appearancesData = JSON.parse(storedAppearances);
        const appearanceNames = Object.keys(appearancesData);
        
        if (appearanceNames.length === 0) {
            alert('No saved appearances found.');
            return;
        }
        
        // Show modal and populate list
        selectedImportAppearanceName = null;
        appearanceImportList.innerHTML = '';
        
        appearanceNames.forEach(name => {
            const item = document.createElement('div');
            item.className = 'polygon-select-item';
            item.textContent = name;
            item.addEventListener('click', () => {
                removeAllSelections('#appearanceImportList');
                item.classList.add('selected');
                selectedImportAppearanceName = name;
            });
            appearanceImportList.appendChild(item);
        });
        
        appearanceImportModal.style.display = 'block';
    } catch (error) {
        alert('Error loading appearances: ' + error.message);
    }
});

// Modal import appearance button
modalImportAppearanceBtn.addEventListener('click', () => {
    if (selectedImportAppearanceName === null) {
        alert('Please select an appearance to import');
        return;
    }
    
    try {
        const storedAppearances = localStorage.getItem('sceneBuilderStoredAppearances');
        const appearancesData = JSON.parse(storedAppearances);
        const importedAppearance = appearancesData[selectedImportAppearanceName];
        
        // Add to appearances list
        appearances.push(importedAppearance);
        renderAppearanceList();
        
        appearanceImportModal.style.display = 'none';
        alert(`Appearance "${selectedImportAppearanceName}" imported successfully!`);
    } catch (error) {
        alert('Error importing appearance: ' + error.message);
    }
});

// Modal cancel appearance button
modalCancelAppearanceBtn.addEventListener('click', () => {
    appearanceImportModal.style.display = 'none';
});

// Close modal when clicking outside
appearanceImportModal.addEventListener('click', (e) => {
    if (e.target === appearanceImportModal) {
        appearanceImportModal.style.display = 'none';
    }
});

// Actor management functions
function addActor() {
    let name = actorName.value.trim() || `Actor ${actors.length + 1}`;
    
    // Check if an actor with this name already exists in the listbox
    const existingActorIndex = actors.findIndex(actor => actor.name === name);
    if (existingActorIndex !== -1) {
        const shouldOverwrite = confirm(`An actor with the name "${name}" already exists in the list.\n\nDo you want to overwrite it with the new actor data?`);
        if (!shouldOverwrite) {
            return;
        }
    }
    
    const mass = parseFloat(actorMass.value) || 1;
    const polygonName = actorPolygonDropdown.value;
    const appearanceName = actorAppearanceDropdown.value;
    
    // Validate that polygon and appearance are selected
    if (!polygonName || polygonName === '') {
        alert('Please select a polygon for the actor.');
        return;
    }
    if (!appearanceName || appearanceName === '') {
        alert('Please select an appearance for the actor.');
        return;
    }
    const xPos = parseFloat(actorXPos.value) || 0;
    const yPos = parseFloat(actorYPos.value) || 0;
    const xVel = parseFloat(actorXVel.value) || 0;
    const yVel = parseFloat(actorYVel.value) || 0;
    const facing = parseFloat(actorFacing.value) || 0;
    const spin = parseFloat(actorSpin.value) || 0;
    
    const actor = {
        name,
        mass,
        polygonName,
        appearanceName,
        xPos,
        yPos,
        xVel,
        yVel,
        facing,
        spin,
        parts: actorParts.map(part => ({
            name: part.name,
            xOffset: part.xOffset || 0,
            yOffset: part.yOffset || 0,
            facing: part.facing || 0
        }))
    };
    
    if (existingActorIndex !== -1) {
        // Overwrite existing actor
        actors[existingActorIndex] = actor;
        selectedActorIndex = existingActorIndex;
    } else {
        // Add new actor
        actors.push(actor);
        selectedActorIndex = actors.length - 1;
    }
    
    // Update localStorage if this actor name exists there
    try {
        const storedActors = localStorage.getItem('sceneBuilderStoredActors');
        if (storedActors) {
            const actorsData = JSON.parse(storedActors);
            if (actorsData[name]) {
                actorsData[name] = actor;
                localStorage.setItem('sceneBuilderStoredActors', JSON.stringify(actorsData));
            }
        }
    } catch (error) {
        console.error('Error updating localStorage:', error);
    }
    
    renderActorList();
    actorList.selectedIndex = selectedActorIndex;
    drawActorPreview(actors[selectedActorIndex]);
    drawMapView();
    
    // Don't clear actorParts - keep them visible for continued editing
    // actorParts = [];
    // renderActorPartsList();
}

function removeActor() {
    if (selectedActorIndex >= 0 && selectedActorIndex < actors.length) {
        actors.splice(selectedActorIndex, 1);
        selectedActorIndex = -1;
        renderActorList();
        drawMapView();
    }
}

function renderActorList() {
    actorList.innerHTML = '';
    
    actors.forEach((actor, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = actor.name;
        actorList.appendChild(option);
    });
}

function saveActorsToLocalStorage() {
    try {
        localStorage.setItem('sceneBuilderActors', JSON.stringify(actors));
    } catch (error) {
        console.error('Error saving actors to localStorage:', error);
    }
}

function loadActorsFromLocalStorage() {
    try {
        const storedActors = localStorage.getItem('sceneBuilderActors');
        if (storedActors) {
            actors = JSON.parse(storedActors);
            
            // Migrate old format (polygonIndex) to new format (polygonName)
            actors = actors.map(actor => {
                if (actor.polygonIndex !== undefined && !actor.polygonName) {
                    const polygon = polygons[actor.polygonIndex];
                    return {
                        ...actor,
                        polygonName: polygon ? polygon.name : '',
                        polygonIndex: undefined
                    };
                }
                return actor;
            });
            
            renderActorList();
            drawMapView();
        }
    } catch (error) {
        console.error('Error loading actors from localStorage:', error);
    }
}

// Clear actor form fields
function clearActorFields() {
    selectedActorIndex = -1;
    actorList.selectedIndex = -1;
    actorName.value = '';
    actorMass.value = 1;
    actorPolygonDropdown.value = '';
    actorAppearanceDropdown.value = '';
    actorXPos.value = 0;
    actorYPos.value = 0;
    actorXVel.value = 0;
    actorYVel.value = 0;
    actorFacing.value = '';
    actorSpin.value = 0;
    actorParts = [];
    renderActorPartsList();
}

// Manual zoom adjustment - redraw actor preview when zoom changes
actorPreviewZoom.addEventListener('input', () => {
    if (selectedActorIndex >= 0 && selectedActorIndex < actors.length) {
        const actor = actors[selectedActorIndex];
        drawActorPreviewWithManualZoom(actor, parseFloat(actorPreviewZoom.value) || 1);
    }
});

// Draw actor preview with manual zoom (no auto-scaling)
function drawActorPreviewWithManualZoom(actor, zoom) {
    clearActorPreview();
    drawActorPreviewGrid();
    
    if (!actor) return;
    
    const polygon = polygons.find(p => p.name === actor.polygonName);
    if (!polygon || !polygon.points || polygon.points.length === 0) return;
    
    const appearance = appearances.find(a => a.name === actor.appearanceName);
    if (!appearance) return;
    
    const actorFacing = actor.facing || 0;
    const angleRad = (actorFacing * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    
    // Draw the actor's polygon
    drawPolygonInPreview(polygon.points, appearance, 0, 0, actorFacing, zoom);
    
    // Draw parts if they exist
    if (actor.parts && Array.isArray(actor.parts)) {
        actor.parts.forEach(partInfo => {
            const part = parts.find(p => p.name === partInfo.name);
            if (!part) return;
            
            const partPolygon = polygons.find(p => p.name === part.polygonName);
            if (!partPolygon || !partPolygon.points) return;
            
            const partAppearance = appearances[part.appearanceIndex];
            if (!partAppearance) return;
            
            const xOffset = partInfo.xOffset || 0;
            const yOffset = partInfo.yOffset || 0;
            const partFacingOffset = partInfo.facing || 0;
            const rotatedX = xOffset * cosA - yOffset * sinA;
            const rotatedY = xOffset * sinA + yOffset * cosA;
            
            drawPolygonInPreview(partPolygon.points, partAppearance, rotatedX, rotatedY, actorFacing + partFacingOffset, zoom);
        });
    } else if (actor.partNames && Array.isArray(actor.partNames)) {
        actor.partNames.forEach(partName => {
            const part = parts.find(p => p.name === partName);
            if (!part) return;
            
            const partPolygon = polygons.find(p => p.name === part.polygonName);
            if (!partPolygon || !partPolygon.points) return;
            
            const partAppearance = appearances[part.appearanceIndex];
            if (!partAppearance) return;
            
            drawPolygonInPreview(partPolygon.points, partAppearance, 0, 0, actorFacing, zoom);
        });
    }
}

// Actor listbox selection
actorList.addEventListener('change', (e) => {
    let actorListIndex = parseInt(e.target.value);
    if (actorListIndex >= 0 && actorListIndex < actors.length) {
      selectedActorIndex = actorListIndex;
    }else{
      
    }
    selectedActorIndex = actorListIndex
    if (actorListIndex >= 0 && actorListIndex < actors.length) {
        const actor = actors[selectedActorIndex];
        actorName.value = actor.name;
        actorMass.value = actor.mass;
        actorPolygonDropdown.value = actor.polygonName || '';
        actorAppearanceDropdown.value = actor.appearanceName || '';
        actorXPos.value = actor.xPos;
        actorYPos.value = actor.yPos;
        actorXVel.value = actor.xVel;
        actorYVel.value = actor.yVel;
        actorFacing.value = actor.facing;
        actorSpin.value = actor.spin;
        
        // Load actor parts with offsets
        actorParts = [];
        if (actor.parts && Array.isArray(actor.parts)) {
            // New format: parts with offsets
            actor.parts.forEach(partInfo => {
                const part = parts.find(p => p.name === partInfo.name);
                if (part) {
                    actorParts.push({
                        ...part,
                        xOffset: partInfo.xOffset || 0,
                        yOffset: partInfo.yOffset || 0,
                        facing: partInfo.facing || 0
                    });
                }
            });
        } else if (actor.partNames && Array.isArray(actor.partNames)) {
            // Legacy format: just part names (no offsets)
            actor.partNames.forEach(partName => {
                const part = parts.find(p => p.name === partName);
                if (part) {
                    actorParts.push({
                        ...part,
                        xOffset: 0,
                        yOffset: 0,
                        facing: 0
                    });
                }
            });
        }
        renderActorPartsList();
        
        // Draw actor in preview canvas
        drawActorPreview(actor);
    } else {
        clearActorPreview();
        drawActorPreviewGrid();
    }
});

// Import actor modal
const actorImportModal = document.getElementById('actorImportModal');
const actorImportList = document.getElementById('actorImportList');
const modalImportActorBtn = document.getElementById('modalImportActorBtn');
const modalCancelActorBtn = document.getElementById('modalCancelActorBtn');
let selectedImportActorIndex = null;

function importActor() {
    try {
        const storedActors = localStorage.getItem('sceneBuilderStoredActors');
        
        if (!storedActors) {
            alert('No saved actors found.');
            return;
        }
        
        const actorsData = JSON.parse(storedActors);
        const actorNames = Object.keys(actorsData);
        
        if (actorNames.length === 0) {
            alert('No saved actors found.');
            return;
        }
        
        // Show modal and populate list
        selectedImportActorIndex = null;
        actorImportList.innerHTML = '';
        
        actorNames.forEach((name, index) => {
            const item = document.createElement('div');
            item.className = 'polygon-select-item';
            item.textContent = name;
            item.addEventListener('click', () => {
                removeAllSelections('#actorImportList');
                item.classList.add('selected');
                selectedImportActorIndex = name;
            });
            actorImportList.appendChild(item);
        });
        
        actorImportModal.style.display = 'block';
    } catch (error) {
        alert('Error loading actors: ' + error.message);
    }
}

// Modal import button
modalImportActorBtn.addEventListener('click', () => {
    if (selectedImportActorIndex === null) {
        alert('Please select an actor to import');
        return;
    }
    
    try {
        const storedActors = localStorage.getItem('sceneBuilderStoredActors');
        const actorsData = JSON.parse(storedActors);
        const importedActor = actorsData[selectedImportActorIndex];
        
        // Check if actor with this name already exists
        let newActorName = importedActor.name;
        console.log('Checking for duplicate actor name:', newActorName);
        console.log('Current actors:', actors.map(a => a.name));
        
        while (actors.some(actor => actor.name === newActorName)) {
            console.log('Duplicate found, prompting for new name');
            const promptResult = prompt(`An actor with the name "${newActorName}" already exists in the list.\n\nEnter a new name for this actor, or click Cancel to abort the import:`, newActorName);
            if (promptResult === null) {
                // User cancelled
                console.log('User cancelled import');
                return;
            }
            newActorName = promptResult.trim();
            if (!newActorName) {
                alert('Actor name cannot be empty.');
                return;
            }
        }
        
        console.log('Using actor name:', newActorName);
        
        // Validation: Check if polygon exists
        const polygonName = importedActor.polygonName || importedActor.polygonIndex || '';
        if (!polygonName || !polygons.find(p => p.name === polygonName)) {
            alert(`Cannot import actor: The polygon "${polygonName}" does not exist. Please import or create this polygon first.`);
            actorImportModal.style.display = 'none';
            return;
        }
        
        // Check if the actor has an appearance and if it exists in current appearances
        let appearanceExists = false;
        if (importedActor.appearanceName) {
            const existingAppearance = appearances.find(app => app.name === importedActor.appearanceName);
            
            if (!existingAppearance) {
                // Try to import the appearance from localStorage
                const storedAppearances = localStorage.getItem('sceneBuilderStoredAppearances');
                if (storedAppearances) {
                    const appearancesData = JSON.parse(storedAppearances);
                    
                    if (appearancesData[importedActor.appearanceName]) {
                        // Import the appearance
                        const importedAppearance = appearancesData[importedActor.appearanceName];
                        appearances.push(importedAppearance);
                        renderAppearanceList();
                        updateActorAppearanceDropdown();
                        appearanceExists = true;
                        alert(`Automatically imported appearance "${importedActor.appearanceName}" for this actor.`);
                    } else {
                        alert(`Cannot import actor: The appearance "${importedActor.appearanceName}" is not found in storage. Please import or create this appearance first.`);
                        actorImportModal.style.display = 'none';
                        return;
                    }
                } else {
                    alert(`Cannot import actor: The appearance "${importedActor.appearanceName}" is required but no stored appearances exist. Please create this appearance first.`);
                    actorImportModal.style.display = 'none';
                    return;
                }
            } else {
                appearanceExists = true;
            }
        } else {
            alert(`Cannot import actor: The actor requires an appearance. Please ensure the actor has an appearance defined.`);
            actorImportModal.style.display = 'none';
            return;
        }
        
        // Load actor parts and auto-import if needed
        actorParts = [];
        let partsToLoad = [];
        
        // Handle new format (parts with offsets) or legacy format (partNames)
        if (importedActor.parts && Array.isArray(importedActor.parts)) {
            partsToLoad = importedActor.parts;
        } else if (importedActor.partNames && Array.isArray(importedActor.partNames)) {
            // Convert legacy format to new format
            partsToLoad = importedActor.partNames.map(name => ({
                name: name,
                xOffset: 0,
                yOffset: 0
            }));
        }
        
        if (partsToLoad.length > 0) {
            const storedParts = localStorage.getItem('sceneBuilderStoredParts');
            const partsData = storedParts ? JSON.parse(storedParts) : {};
            const missingParts = [];
            
            for (const partInfo of partsToLoad) {
                const partName = partInfo.name;
                let part = parts.find(p => p.name === partName);
                
                if (!part && partsData[partName]) {
                    // Auto-import the part from storage
                    part = partsData[partName];
                    parts.push(part);
                    renderPartList();
                    updatePartPolygonDropdown();
                    updatePartAppearanceDropdown();
                }
                
                if (part) {
                    actorParts.push({
                        ...part,
                        xOffset: partInfo.xOffset || 0,
                        yOffset: partInfo.yOffset || 0,
                        facing: partInfo.facing || 0
                    });
                } else {
                    missingParts.push(partName);
                }
            }
            
            if (missingParts.length > 0) {
                alert(`Cannot import actor: The following parts could not be found or imported: ${missingParts.join(', ')}. Please create or import these parts first.`);
                actorImportModal.style.display = 'none';
                return;
            }
        }
        
        // Create actor object with (possibly renamed) name
        // Position, velocity, facing, spin are scene-specific and set to 0 on import
        const newActor = {
            name: newActorName,
            mass: importedActor.mass,
            polygonName: polygonName,
            appearanceName: importedActor.appearanceName || '',
            xPos: 0,
            yPos: 0,
            xVel: 0,
            yVel: 0,
            facing: 0,
            spin: 0,
            parts: actorParts.map(part => ({
                name: part.name,
                xOffset: part.xOffset || 0,
                yOffset: part.yOffset || 0,
                facing: part.facing || 0
            }))
        };
        
        // Add to actors list
        actors.push(newActor);
        renderActorList();
        drawMapView();
        
        // Update UI fields to show the imported actor with 0 position/velocity/facing/spin
        actorName.value = newActor.name;
        actorMass.value = newActor.mass;
        actorPolygonDropdown.value = newActor.polygonName;
        actorAppearanceDropdown.value = newActor.appearanceName;
        actorXPos.value = 0;
        actorYPos.value = 0;
        actorXVel.value = 0;
        actorYVel.value = 0;
        actorFacing.value = 0;
        actorSpin.value = 0;
        renderActorPartsList();
        drawActorPreview(newActor);
        
        actorImportModal.style.display = 'none';
    } catch (error) {
        alert('Error importing actor: ' + error.message);
    }
});

// Modal cancel button
modalCancelActorBtn.addEventListener('click', () => {
    actorImportModal.style.display = 'none';
});

// Close modal when clicking outside
actorImportModal.addEventListener('click', (e) => {
    if (e.target === actorImportModal) {
        actorImportModal.style.display = 'none';
    }
});

// Add event listeners for actor buttons
addActorButton.addEventListener('click', addActor);
removeActorButton.addEventListener('click', removeActor);
importActorButton.addEventListener('click', importActor);

// Export actor to localStorage
exportActorButton.addEventListener('click', () => {
    if (selectedActorIndex < 0 || selectedActorIndex >= actors.length) {
        alert('Please select an actor to export.');
        return;
    }
    
    const actor = actors[selectedActorIndex];
    
    try {
        // Get existing actors from localStorage
        const storedActors = localStorage.getItem('sceneBuilderStoredActors');
        let actorsData = storedActors ? JSON.parse(storedActors) : {};
        
        // Check if actor with this name already exists in storage
        if (actorsData[actor.name]) {
            const overwrite = confirm(`An actor with the name "${actor.name}" already exists in storage.\n\nClick OK to overwrite it, or Cancel to abort.`);
            if (!overwrite) {
                return;
            }
        }
        
        // Add or update the actor (exclude position, velocity, facing, spin - these are scene-specific)
        actorsData[actor.name] = {
            name: actor.name,
            mass: actor.mass,
            polygonName: actor.polygonName,
            appearanceName: actor.appearanceName,
            parts: actor.parts
        };
        
        // Save back to localStorage
        localStorage.setItem('sceneBuilderStoredActors', JSON.stringify(actorsData));
        
        alert(`Actor "${actor.name}" exported successfully!`);
    } catch (error) {
        alert('Error exporting actor: ' + error.message);
    }
});

// Delete Actor button - show delete actor modal
let selectedDeleteActorName = null;

deleteActorButton.addEventListener('click', () => {
    try {
        const storedActors = localStorage.getItem('sceneBuilderStoredActors');
        
        if (!storedActors) {
            alert('No saved actors found in storage');
            return;
        }
        
        const actorsData = JSON.parse(storedActors);
        const actorNames = Object.keys(actorsData);
        
        if (actorNames.length === 0) {
            alert('No saved actors found in storage');
            return;
        }
        
        // Show modal and populate list
        selectedDeleteActorName = null;
        actorDeleteList.innerHTML = '';
        
        actorNames.forEach(name => {
            const item = document.createElement('div');
            item.className = 'polygon-select-item';
            item.textContent = name;
            item.addEventListener('click', () => {
                removeAllSelections('#actorDeleteList');
                item.classList.add('selected');
                selectedDeleteActorName = name;
            });
            actorDeleteList.appendChild(item);
        });
        
        actorDeleteModal.style.display = 'block';
    } catch (error) {
        alert('Error loading actors: ' + error.message);
    }
});

// Modal delete actor button
modalDeleteActorBtn.addEventListener('click', () => {
    if (!selectedDeleteActorName) {
        alert('Please select an actor to delete');
        return;
    }
    
    // Check if the actor is being used in the current scene
    const isUsedInScene = actors.some(a => a.name === selectedDeleteActorName);
    
    if (isUsedInScene) {
        alert('Cannot delete this actor because it is being used in the current scene. Remove it from the scene first.');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${selectedDeleteActorName}" from storage?`)) {
        return;
    }
    
    try {
        const storedActors = localStorage.getItem('sceneBuilderStoredActors');
        const actorsData = JSON.parse(storedActors);
        
        // Delete the actor
        delete actorsData[selectedDeleteActorName];
        
        // Save back to localStorage
        localStorage.setItem('sceneBuilderStoredActors', JSON.stringify(actorsData));
        
        // Close modal or refresh list
        if (Object.keys(actorsData).length === 0) {
            actorDeleteModal.style.display = 'none';
            alert('Actor deleted successfully. No more actors in storage.');
        } else {
            // Refresh the list
            selectedDeleteActorName = null;
            deleteActorButton.click();
            actorDeleteModal.style.display = 'block';
            alert('Actor deleted successfully.');
        }
    } catch (error) {
        alert('Error deleting actor: ' + error.message);
    }
});

// Modal cancel delete actor button
modalCancelActorDeleteBtn.addEventListener('click', () => {
    actorDeleteModal.style.display = 'none';
});

// Close modal when clicking outside
actorDeleteModal.addEventListener('click', (e) => {
    if (e.target === actorDeleteModal) {
        actorDeleteModal.style.display = 'none';
    }
});

clearActorButton.addEventListener('click', clearActorFields);

// Update the actor polygon dropdown with current polygons
function updateActorPolygonDropdown() {
    updateDropdown(actorPolygonDropdown, polygons, 'name', 'name', 'Select polygon...');
}

// Update the part polygon dropdown with current polygons
function updatePartPolygonDropdown() {
    updateDropdown(partPolygonDropdown, polygons, 'name', 'name', 'Select polygon...');
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
            // Update the actor polygon dropdown to select this polygon
            actorPolygonDropdown.value = index;
        });
        polygonList.appendChild(item);
    });
    
    // Update actor polygon dropdown
    updateActorPolygonDropdown();
    
    // Update part polygon dropdown
    updatePartPolygonDropdown();
    
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
        
        // Draw world coordinates next to each vertex
        polygonCtx.fillStyle = '#e0e0e0';
        polygonCtx.font = '10px monospace';
        polygonCtx.textAlign = 'left';
        polygonCtx.textBaseline = 'middle';
        const coordText = `(${Math.round(point.x)},${Math.round(point.y)})`;
        polygonCtx.fillText(coordText, x + 6, y);
        polygonCtx.fillStyle = '#FF6B6B';
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

// Create button - navigate to builder page
createPolygonButton.addEventListener('click', () => {
    // Set flag in localStorage to indicate we're coming from scenes page
    localStorage.setItem('returnToScenes', 'true');
    // Navigate to builder page
    window.location.href = 'builder.html';
});

// Manage button - show manage polygon modal
const managePolygonModal = document.getElementById('managePolygonModal');
const managePolygonList = document.getElementById('managePolygonList');
const modalRenamePolygonBtn = document.getElementById('modalRenamePolygonBtn');
const modalDeletePolygonBtn = document.getElementById('modalDeletePolygonBtn');
const modalCloseManageBtn = document.getElementById('modalCloseManageBtn');
let selectedManagePolygonName = null;

managePolygonButton.addEventListener('click', () => {
    try {
        const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
        
        if (!storedPolygons) {
            alert('No saved polygons found.');
            return;
        }
        
        const polygonsData = JSON.parse(storedPolygons);
        const polygonNames = Object.keys(polygonsData);
        
        if (polygonNames.length === 0) {
            alert('No saved polygons found.');
            return;
        }
        
        // Show modal and populate list
        selectedManagePolygonName = null;
        managePolygonList.innerHTML = '';
        
        polygonNames.forEach(name => {
            const item = document.createElement('div');
            item.className = 'polygon-select-item';
            const polygonData = polygonsData[name];
            const pointCount = Array.isArray(polygonData) ? polygonData.length : (polygonData.points ? polygonData.points.length : 0);
            item.textContent = `${name} (${pointCount} points)`;
            item.addEventListener('click', () => {
                removeAllSelections('#managePolygonList');
                item.classList.add('selected');
                selectedManagePolygonName = name;
            });
            managePolygonList.appendChild(item);
        });
        
        managePolygonModal.style.display = 'block';
    } catch (error) {
        alert('Error loading polygons: ' + error.message);
    }
});

// Rename polygon button
modalRenamePolygonBtn.addEventListener('click', () => {
    if (!selectedManagePolygonName) {
        alert('Please select a polygon to rename');
        return;
    }
    
    const newName = prompt('Enter new name for polygon:', selectedManagePolygonName);
    
    if (!newName || newName === selectedManagePolygonName) {
        return;
    }
    
    try {
        const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
        const polygonsData = JSON.parse(storedPolygons);
        
        // Check if new name already exists
        if (polygonsData[newName]) {
            alert('A polygon with that name already exists.');
            return;
        }
        
        // Rename the polygon
        const polygonData = polygonsData[selectedManagePolygonName];
        if (polygonData && typeof polygonData === 'object' && !Array.isArray(polygonData) && polygonData.name) {
            // New format: update the name property
            polygonData.name = newName;
        }
        polygonsData[newName] = polygonData;
        delete polygonsData[selectedManagePolygonName];
        
        // Save back to localStorage
        localStorage.setItem('polygonBuilderPolygons', JSON.stringify(polygonsData));
        
        // Update local polygons array
        const polygonIndex = polygons.findIndex(p => p.name === selectedManagePolygonName);
        if (polygonIndex !== -1) {
            polygons[polygonIndex].name = newName;
        }
        
        // Refresh the manage list
        selectedManagePolygonName = newName;
        managePolygonButton.click();
        managePolygonModal.style.display = 'block';
        
        // Update the polygon list display
        renderPolygonList();
        updateActorPolygonDropdown();
        
    } catch (error) {
        alert('Error renaming polygon: ' + error.message);
    }
});

// Delete polygon button
modalDeletePolygonBtn.addEventListener('click', () => {
    if (!selectedManagePolygonName) {
        alert('Please select a polygon to delete');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${selectedManagePolygonName}"?`)) {
        return;
    }
    
    try {
        const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
        const polygonsData = JSON.parse(storedPolygons);
        
        // Delete the polygon
        delete polygonsData[selectedManagePolygonName];
        
        // Save back to localStorage
        localStorage.setItem('polygonBuilderPolygons', JSON.stringify(polygonsData));
        
        // Update local polygons array
        const polygonIndex = polygons.findIndex(p => p.name === selectedManagePolygonName);
        if (polygonIndex !== -1) {
            polygons.splice(polygonIndex, 1);
            if (selectedPolygonIndex === polygonIndex) {
                selectedPolygonIndex = -1;
            } else if (selectedPolygonIndex > polygonIndex) {
                selectedPolygonIndex--;
            }
        }
        
        // Refresh the manage list
        selectedManagePolygonName = null;
        
        // Close modal if no more polygons
        if (Object.keys(polygonsData).length === 0) {
            managePolygonModal.style.display = 'none';
        } else {
            managePolygonButton.click();
            managePolygonModal.style.display = 'block';
        }
        
        // Update the polygon list display
        renderPolygonList();
        updateActorPolygonDropdown();
        
    } catch (error) {
        alert('Error deleting polygon: ' + error.message);
    }
});

// Close manage modal button
modalCloseManageBtn.addEventListener('click', () => {
    managePolygonModal.style.display = 'none';
});

// Close modal when clicking outside
managePolygonModal.addEventListener('click', (e) => {
    if (e.target === managePolygonModal) {
        managePolygonModal.style.display = 'none';
    }
});

// Modal elements for polygon selection
const polygonSelectModal = document.getElementById('polygonSelectModal');
const polygonSelectList = document.getElementById('polygonSelectList');
const modalAddPolygonBtn = document.getElementById('modalAddPolygonBtn');
const modalCancelPolygonBtn = document.getElementById('modalCancelPolygonBtn');
let selectedPolygonForImport = null;

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
        selectedPolygonForImport = null;
        polygonSelectList.innerHTML = '';
        
        polygonNames.forEach(name => {
            const item = document.createElement('div');
            item.className = 'polygon-select-item';
            const polygonData = polygonsData[name];
            const pointCount = Array.isArray(polygonData) ? polygonData.length : (polygonData.points ? polygonData.points.length : 0);
            item.textContent = `${name} (${pointCount} points)`;
            item.addEventListener('click', () => {
                removeAllSelections('#polygonSelectList');
                item.classList.add('selected');
                selectedPolygonForImport = name;
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
    if (!selectedPolygonForImport) {
        alert('Please select a polygon to add');
        return;
    }
    
    try {
        const storedPolygons = localStorage.getItem('polygonBuilderPolygons');
        const polygonsData = JSON.parse(storedPolygons);
        const polygonData = polygonsData[selectedPolygonForImport];
        
        // Handle both old format (array) and new format (object with name/points)
        let polygonPoints;
        if (Array.isArray(polygonData)) {
            polygonPoints = polygonData;
        } else if (polygonData && polygonData.points) {
            polygonPoints = polygonData.points;
        } else {
            alert('Invalid polygon data');
            return;
        }
        
        // Add polygon to list with its data
        polygons.push({ 
            name: selectedPolygonForImport,
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
    
    const zoomValue = parseFloat(zoomLevel.value) || 1.0;
    const zoom = 1 / zoomValue; // Invert zoom so higher values zoom out
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
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
    
    // Draw world coordinate labels on axes
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Calculate world coordinates at canvas edges
    const leftWorldX = Math.round((-centerX - panOffsetX) / zoom);
    const rightWorldX = Math.round((centerX - panOffsetX) / zoom);
    const topWorldY = Math.round((-centerY - panOffsetY) / zoom);
    const bottomWorldY = Math.round((centerY - panOffsetY) / zoom);
    
    // X-axis labels (left and right edges)
    ctx.fillText(leftWorldX.toString(), 30, centerY + 5);
    ctx.fillText(rightWorldX.toString(), canvas.width - 30, centerY + 5);
    
    // Y-axis labels (top and bottom edges)
    ctx.textBaseline = 'middle';
    ctx.fillText(topWorldY.toString(), centerX + 5, 20);
    ctx.fillText(bottomWorldY.toString(), centerX + 5, canvas.height - 20);
    ctx.stroke();
    
    // Draw actors
    actors.forEach((actor, index) => {
        // Convert world coordinates to screen coordinates with pan offset
        const screenX = centerX + (actor.xPos * zoom) + panOffsetX;
        const screenY = centerY + (actor.yPos * zoom) + panOffsetY; // Positive Y goes down (screen coordinates)
        
        // Get polygon and appearance
        const polygon = polygons.find(p => p.name === actor.polygonName);
        const appearance = appearances.find(app => app.name === actor.appearanceName);
        
        if (!polygon || !polygon.points || polygon.points.length === 0) {
            // Draw a simple circle if no polygon
            ctx.fillStyle = appearance ? `#${appearance.fill.r.toString(16)}${appearance.fill.g.toString(16)}${appearance.fill.b.toString(16)}` : '#4a90e2';
            ctx.beginPath();
            ctx.arc(screenX, screenY, 5 * zoom, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        
        // Draw polygon at actor position with rotation
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate((actor.facing || 0) * Math.PI / 180); // Convert degrees to radians
        ctx.scale(zoom, zoom);
        
        // Set colors from appearance
        if (appearance) {
            ctx.fillStyle = `#${appearance.fill.r.toString(16)}${appearance.fill.g.toString(16)}${appearance.fill.b.toString(16)}`;
            ctx.strokeStyle = `#${appearance.stroke.r.toString(16)}${appearance.stroke.g.toString(16)}${appearance.stroke.b.toString(16)}`;
        } else {
            ctx.fillStyle = 'rgba(74, 144, 226, 0.5)';
            ctx.strokeStyle = '#4a90e2';
        }
        
        ctx.lineWidth = 2 / zoom;
        
        // Draw polygon
        ctx.beginPath();
        polygon.points.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
        
        // Draw actor name
        ctx.fillStyle = '#ffffff';
        ctx.font = `${12}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(actor.name, screenX, screenY - (20 * zoom));
    });
}

// Initialize when page loads
window.addEventListener('load', initCanvas);
window.addEventListener('resize', initCanvas);

// Zoom level change listener
zoomLevel.addEventListener('change', () => {
    drawMapView();
});

// Pan button event listeners
const PAN_STEP = 50;

panUpBtn.addEventListener('click', () => {
    panOffsetY += PAN_STEP;
    drawMapView();
});

panDownBtn.addEventListener('click', () => {
    panOffsetY -= PAN_STEP;
    drawMapView();
});

panLeftBtn.addEventListener('click', () => {
    panOffsetX -= PAN_STEP;
    drawMapView();
});

panRightBtn.addEventListener('click', () => {
    panOffsetX += PAN_STEP;
    drawMapView();
});

panCenterBtn.addEventListener('click', () => {
    panOffsetX = 0;
    panOffsetY = 0;
    drawMapView();
});

// Initialize polygon canvas
clearPolygonCanvas();

// Load actors from localStorage on page load
loadActorsFromLocalStorage();

// Note: Auto-loading of polygons has been disabled per user preference
// The unused loadPolygonsFromStorage() function has been removed

// Initialize part dropdowns
updatePartPolygonDropdown();
updatePartAppearanceDropdown();

// Add part to list
function addPart() {
    const name = partName.value.trim();
    
    if (!name) {
        alert('Part must have a name.');
        return;
    }
    
    const appearanceIndex = partAppearanceDropdown.value;
    if (!appearanceIndex || appearanceIndex === '') {
        alert('Part must have an appearance selected.');
        return;
    }
    
    const polygonName = partPolygonDropdown.value;
    if (!polygonName || polygonName === '') {
        alert('Part must have a polygon selected.');
        return;
    }
    
    // Check if part with this name already exists
    const existingPartIndex = parts.findIndex(p => p.name === name);
    if (existingPartIndex !== -1) {
        const shouldOverwrite = confirm(`A part with the name "${name}" already exists in the list.\n\nDo you want to overwrite it with the new part data?`);
        if (!shouldOverwrite) {
            return;
        }
    }
    
    const part = {
        name,
        polygonName,
        appearanceIndex
    };
    
    if (existingPartIndex !== -1) {
        // Overwrite existing part
        parts[existingPartIndex] = part;
    } else {
        // Add new part
        parts.push(part);
    }
    
    // Update localStorage if this part name exists there
    const storedParts = getFromLocalStorage('sceneBuilderStoredParts');
    if (storedParts && storedParts[name]) {
        storedParts[name] = part;
        saveToLocalStorage('sceneBuilderStoredParts', storedParts);
    }
    
    renderPartList();
    
    // Update actor preview if an actor is selected
    if (selectedActorIndex >= 0 && selectedActorIndex < actors.length) {
        const actor = actors[selectedActorIndex];
        drawActorPreview(actor);
    }
    
    // Clear the form fields after adding
    partName.value = '';
    partPolygonDropdown.value = '';
    partAppearanceDropdown.value = '';
}

// Remove selected part from list
function removePart() {
    if (selectedPartIndex >= 0 && selectedPartIndex < parts.length) {
        parts.splice(selectedPartIndex, 1);
        selectedPartIndex = -1;
        renderPartList();
        
        // Update actor preview if an actor is selected
        if (selectedActorIndex >= 0 && selectedActorIndex < actors.length) {
            const actor = actors[selectedActorIndex];
            drawActorPreview(actor);
        }
    }
}

// Render the part list
function renderPartList() {
    partList.innerHTML = '';
    
    parts.forEach((part, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = part.name;
        partList.appendChild(option);
    });
}

// Part listbox selection
partList.addEventListener('change', (e) => {
    selectedPartIndex = parseInt(e.target.value);
    if (selectedPartIndex >= 0 && selectedPartIndex < parts.length) {
        const part = parts[selectedPartIndex];
        partName.value = part.name;
        partPolygonDropdown.value = part.polygonName || '';
        partAppearanceDropdown.value = part.appearanceIndex;
    }
});

// Add event listeners for part buttons
addPartButton.addEventListener('click', addPart);
removePartButton.addEventListener('click', removePart);

// Export part to localStorage
exportPartButton.addEventListener('click', () => {
    if (selectedPartIndex < 0 || selectedPartIndex >= parts.length) {
        alert('Please select a part to export.');
        return;
    }
    
    const part = parts[selectedPartIndex];
    
    try {
        // Get existing parts from localStorage
        const storedParts = localStorage.getItem('sceneBuilderStoredParts');
        let partsData = storedParts ? JSON.parse(storedParts) : {};
        
        // Add or update the part
        partsData[part.name] = part;
        
        // Save back to localStorage
        localStorage.setItem('sceneBuilderStoredParts', JSON.stringify(partsData));
        
        alert(`Part "${part.name}" exported successfully!`);
    } catch (error) {
        alert('Error exporting part: ' + error.message);
    }
});

// Import part modal
const partImportModal = document.getElementById('partImportModal');
const partImportList = document.getElementById('partImportList');
const modalImportPartBtn = document.getElementById('modalImportPartBtn');
const modalCancelPartImportBtn = document.getElementById('modalCancelPartImportBtn');
let selectedImportPartName = null;

importPartButton.addEventListener('click', () => {
    try {
        const storedParts = localStorage.getItem('sceneBuilderStoredParts');
        
        if (!storedParts) {
            alert('No saved parts found.');
            return;
        }
        
        const partsData = JSON.parse(storedParts);
        const partNames = Object.keys(partsData);
        
        if (partNames.length === 0) {
            alert('No saved parts found.');
            return;
        }
        
        // Show modal and populate list
        selectedImportPartName = null;
        partImportList.innerHTML = '';
        
        partNames.forEach(name => {
            const item = document.createElement('div');
            item.className = 'polygon-select-item';
            item.textContent = name;
            item.addEventListener('click', () => {
                removeAllSelections('#partImportList');
                item.classList.add('selected');
                selectedImportPartName = name;
            });
            partImportList.appendChild(item);
        });
        
        partImportModal.style.display = 'block';
    } catch (error) {
        alert('Error loading parts: ' + error.message);
    }
});

// Modal import part button
modalImportPartBtn.addEventListener('click', () => {
    if (selectedImportPartName === null) {
        alert('Please select a part to import');
        return;
    }
    
    try {
        const storedParts = localStorage.getItem('sceneBuilderStoredParts');
        const partsData = JSON.parse(storedParts);
        const importedPart = partsData[selectedImportPartName];
        
        // Add to parts list
        parts.push(importedPart);
        renderPartList();
        
        // Select the imported part
        selectedPartIndex = parts.length - 1;
        partList.selectedIndex = selectedPartIndex;
        
        // Load the part into the form fields
        partName.value = importedPart.name;
        partPolygonDropdown.value = importedPart.polygonName || importedPart.polygonIndex || '';
        partAppearanceDropdown.value = importedPart.appearanceIndex;
        
        partImportModal.style.display = 'none';
        alert(`Part "${selectedImportPartName}" imported successfully!`);
    } catch (error) {
        alert('Error importing part: ' + error.message);
    }
});

// Modal cancel part button
modalCancelPartImportBtn.addEventListener('click', () => {
    partImportModal.style.display = 'none';
});

// Close modal when clicking outside
partImportModal.addEventListener('click', (e) => {
    if (e.target === partImportModal) {
        partImportModal.style.display = 'none';
    }
});

// Delete Part button - show delete part modal
let selectedDeletePartName = null;

deletePartButton.addEventListener('click', () => {
    try {
        const storedParts = localStorage.getItem('sceneBuilderStoredParts');
        
        if (!storedParts) {
            alert('No saved parts found in storage');
            return;
        }
        
        const partsData = JSON.parse(storedParts);
        const partNames = Object.keys(partsData);
        
        if (partNames.length === 0) {
            alert('No saved parts found in storage');
            return;
        }
        
        // Show modal and populate list
        selectedDeletePartName = null;
        partDeleteList.innerHTML = '';
        
        partNames.forEach(name => {
            const item = document.createElement('div');
            item.className = 'polygon-select-item';
            item.textContent = name;
            item.addEventListener('click', () => {
                removeAllSelections('#partDeleteList');
                item.classList.add('selected');
                selectedDeletePartName = name;
            });
            partDeleteList.appendChild(item);
        });
        
        partDeleteModal.style.display = 'block';
    } catch (error) {
        alert('Error loading parts: ' + error.message);
    }
});

// Modal delete part button
modalDeletePartBtn.addEventListener('click', () => {
    if (!selectedDeletePartName) {
        alert('Please select a part to delete');
        return;
    }
    
    // Check if the part is being used in the current scene
    const isUsedInScene = parts.some(p => p.name === selectedDeletePartName);
    
    if (isUsedInScene) {
        alert('Cannot delete this part because it is being used in the current scene. Remove it from the scene first.');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${selectedDeletePartName}" from storage?`)) {
        return;
    }
    
    try {
        const storedParts = localStorage.getItem('sceneBuilderStoredParts');
        const partsData = JSON.parse(storedParts);
        
        // Delete the part
        delete partsData[selectedDeletePartName];
        
        // Save back to localStorage
        localStorage.setItem('sceneBuilderStoredParts', JSON.stringify(partsData));
        
        // Close modal or refresh list
        if (Object.keys(partsData).length === 0) {
            partDeleteModal.style.display = 'none';
            alert('Part deleted successfully. No more parts in storage.');
        } else {
            // Refresh the list
            selectedDeletePartName = null;
            deletePartButton.click();
            partDeleteModal.style.display = 'block';
            alert('Part deleted successfully.');
        }
    } catch (error) {
        alert('Error deleting part: ' + error.message);
    }
});

// Modal cancel delete part button
modalCancelPartDeleteBtn.addEventListener('click', () => {
    partDeleteModal.style.display = 'none';
});

// Close modal when clicking outside
partDeleteModal.addEventListener('click', (e) => {
    if (e.target === partDeleteModal) {
        partDeleteModal.style.display = 'none';
    }
});

// Close modal when clicking outside
partImportModal.addEventListener('click', (e) => {
    if (e.target === partImportModal) {
        partImportModal.style.display = 'none';
    }
});

// Add Part button - show part selection modal
addActorPartButton.addEventListener('click', () => {
    if (parts.length === 0) {
        alert('No parts available. Please create parts first.');
        return;
    }
    
    // Reset offset fields
    modalPartXOffset.value = 0;
    modalPartYOffset.value = 0;
    modalPartFacing.value = 0;
    
    // Show modal and populate with parts
    selectedPartForActor = null;
    partSelectList.innerHTML = '';
    
    parts.forEach((part, index) => {
        const item = document.createElement('div');
        item.className = 'polygon-select-item';
        item.textContent = part.name;
        item.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('#partSelectList .polygon-select-item').forEach(el => {
                el.classList.remove('selected');
            });
            // Select this item
            item.classList.add('selected');
            selectedPartForActor = index;
        });
        partSelectList.appendChild(item);
    });
    
    partSelectModal.style.display = 'block';
});

// Modal Add Part button
modalAddPartBtn.addEventListener('click', () => {
    if (selectedPartForActor === null) {
        alert('Please select a part to add');
        return;
    }
    
    // Get X and Y offsets from modal input fields
    const xOffset = parseFloat(modalPartXOffset.value) || 0;
    const yOffset = parseFloat(modalPartYOffset.value) || 0;
    const facing = parseFloat(modalPartFacing.value) || 0;
    
    const part = parts[selectedPartForActor];
    
    // Create a part instance with offset data
    const partInstance = {
        ...part,
        xOffset: xOffset,
        yOffset: yOffset,
        facing: facing
    };
    
    actorParts.push(partInstance);
    renderActorPartsList();
    
    // Update actor preview
    if (selectedActorIndex >= 0 && selectedActorIndex < actors.length) {
        const actor = actors[selectedActorIndex];
        drawActorPreview(actor);
    }
    
    partSelectModal.style.display = 'none';
});

// Modal Cancel Part button
modalCancelPartBtn.addEventListener('click', () => {
    partSelectModal.style.display = 'none';
});

// Remove Part button
removeActorPartButton.addEventListener('click', () => {
    const selectedIndex = actorPartsList.selectedIndex;
    if (selectedIndex >= 0 && selectedIndex < actorParts.length) {
        actorParts.splice(selectedIndex, 1);
        renderActorPartsList();
        
        // Update actor preview
        if (selectedActorIndex >= 0 && selectedActorIndex < actors.length) {
            const actor = actors[selectedActorIndex];
            drawActorPreview(actor);
        }
    }
});

// Render actor parts list
function renderActorPartsList() {
    actorPartsList.innerHTML = '';
    
    actorParts.forEach((part, index) => {
        const option = document.createElement('option');
        option.value = index;
        const offsetText = part.xOffset !== undefined ? ` (${part.xOffset}, ${part.yOffset})` : '';
        option.textContent = part.name + offsetText;
        actorPartsList.appendChild(option);
    });
}

// Handle actor parts list selection to show offsets
actorPartsList.addEventListener('change', () => {
    const selectedIndex = actorPartsList.selectedIndex;
    if (selectedIndex >= 0 && selectedIndex < actorParts.length) {
        const part = actorParts[selectedIndex];
        partXOffset.value = part.xOffset || 0;
        partYOffset.value = part.yOffset || 0;
        partFacing.value = part.facing || 0;
    }
});

// Handle change offset button
changePartOffsetBtn.addEventListener('click', () => {
    const selectedIndex = actorPartsList.selectedIndex;
    if (selectedIndex >= 0 && selectedIndex < actorParts.length) {
        const xOffset = parseFloat(partXOffset.value) || 0;
        const yOffset = parseFloat(partYOffset.value) || 0;
        const facing = parseFloat(partFacing.value) || 0;
        
        actorParts[selectedIndex].xOffset = xOffset;
        actorParts[selectedIndex].yOffset = yOffset;
        actorParts[selectedIndex].facing = facing;
        
        renderActorPartsList();
        
        // Update actor preview
        if (selectedActorIndex >= 0 && selectedActorIndex < actors.length) {
            const actor = actors[selectedActorIndex];
            drawActorPreview(actor);
        }
        
        alert('Offset updated');
    } else {
        alert('Please select a part from the list');
    }
});

// Reset DB button - clear all localStorage
resetDbBtn.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to clear all stored data?\n\nThis will delete all saved actors, appearances, and parts from localStorage.\n\nPolygons will NOT be deleted.\n\nThis action cannot be undone.');
    
    if (confirmed) {
        // Clear specific localStorage items, but NOT polygons
        localStorage.removeItem('sceneBuilderStoredActors');
        localStorage.removeItem('sceneBuilderStoredAppearances');
        localStorage.removeItem('sceneBuilderStoredParts');
        localStorage.removeItem('sceneBuilderScenes');
        localStorage.removeItem('sceneBuilderActors');
        // Note: NOT removing 'polygonBuilderPolygons'
        
        // Clear arrays except polygons
        actors = [];
        parts = [];
        appearances = [];
        actorParts = [];
        
        // Reset selected indices
        selectedActorIndex = -1;
        selectedPartIndex = -1;
        selectedAppearanceIndex = -1;
        
        // Clear all actor fields
        clearActorFields();
        
        // Clear all part fields
        partName.value = '';
        partPolygonDropdown.value = '';
        partAppearanceDropdown.value = '';
        
        // Clear all appearance fields
        appearanceName.value = '';
        redSlider.value = 0;
        greenSlider.value = 0;
        blueSlider.value = 0;
        redValue.textContent = 0;
        greenValue.textContent = 0;
        blueValue.textContent = 0;
        colors.fill = { r: 0, g: 0, b: 0 };
        colors.stroke = { r: 0, g: 0, b: 0 };
        colors.text = { r: 0, g: 0, b: 0 };
        
        // Update all lists and dropdowns
        renderActorList();
        renderPartList();
        renderAppearanceList();
        renderActorPartsList();
        updateActorPolygonDropdown();
        updateActorAppearanceDropdown();
        updatePartPolygonDropdown();
        updatePartAppearanceDropdown();
        updateAllPreviews();
        
        // Clear map view
        drawMapView();
        
        alert('All stored data has been cleared (polygons preserved).');
    }
});

// To JSON button - generate scene JSON
toJSONBtn.addEventListener('click', () => {
    // Validate required fields
    const errors = [];
    
    if (!sceneName.value.trim()) {
        errors.push('Scene name is missing');
    }
    
    if (!sceneShortDesc.value.trim()) {
        errors.push('Scene description is missing');
    }
    
    if (!sceneMissionText.value.trim()) {
        errors.push('Mission text is missing');
    }
    
    if (actors.length === 0) {
        errors.push('No actors defined');
    }
    
    if (polygons.length === 0) {
        errors.push('No polygons defined');
    }
    
    if (appearances.length === 0) {
        errors.push('No appearances defined');
    }
    
    if (errors.length > 0) {
        alert('Cannot generate JSON. The following issues were found:\n\n' + errors.join('\n'));
        return;
    }
    
    // Generate JSON
    const sceneData = {
        name: sceneName.value.trim(),
        shortDescription: sceneShortDesc.value.trim(),
        missionText: sceneMissionText.value.trim(),
        actors: actors.map(actor => ({
            name: actor.name,
            mass: actor.mass,
            polygonName: actor.polygonName,
            appearanceName: actor.appearanceName,
            position: { x: actor.xPos, y: actor.yPos },
            velocity: { x: actor.xVel, y: actor.yVel },
            facing: actor.facing,
            spin: actor.spin,
            parts: actor.parts || []
        })),
        parts: parts.map(part => ({
            name: part.name,
            polygonName: part.polygonName,
            appearanceName: appearances[part.appearanceIndex]?.name || ''
        })),
        polygons: polygons.map(polygon => ({
            name: polygon.name,
            points: polygon.points || polygon.dots || []
        })),
        appearances: appearances.map(appearance => ({
            name: appearance.name,
            fill: appearance.fill,
            stroke: appearance.stroke,
            text: appearance.text
        }))
    };
    
    // Find all appearance names used in actors and parts
    const usedAppearanceNames = new Set();
    actors.forEach(actor => {
        if (actor.appearanceName) {
            usedAppearanceNames.add(actor.appearanceName);
        }
    });
    parts.forEach(part => {
        const appearanceName = appearances[part.appearanceIndex]?.name;
        if (appearanceName) {
            usedAppearanceNames.add(appearanceName);
        }
    });
    
    // Filter appearances to only used ones
    const usedAppearances = appearances.filter(appearance => 
        usedAppearanceNames.has(appearance.name)
    ).map(appearance => ({
        name: appearance.name,
        fill: appearance.fill,
        stroke: appearance.stroke,
        text: appearance.text
    }));
    
    // Find all part names used in actors
    const usedPartNames = new Set();
    actors.forEach(actor => {
        if (actor.parts && actor.parts.length > 0) {
            actor.parts.forEach(partInfo => usedPartNames.add(partInfo.name));
        } else if (actor.partNames && actor.partNames.length > 0) {
            // Legacy format support
            actor.partNames.forEach(partName => usedPartNames.add(partName));
        }
    });
    
    // Filter parts to only used ones
    const usedParts = parts.filter(part => 
        usedPartNames.has(part.name)
    ).map(part => ({
        name: part.name,
        polygonName: part.polygonName,
        appearanceName: appearances[part.appearanceIndex]?.name || ''
    }));
    
    // All actors are used (they're in the scene)
    const usedActors = actors.map(actor => ({
        name: actor.name,
        mass: actor.mass,
        polygonName: actor.polygonName,
        appearanceName: actor.appearanceName,
        position: { x: actor.xPos, y: actor.yPos },
        velocity: { x: actor.xVel, y: actor.yVel },
        facing: actor.facing,
        spin: actor.spin,
        parts: actor.parts || []
    }));
    
    // Build output with scene JSON followed by lists
    let output = JSON.stringify(sceneData, null, 2);
    output += '\n\n// Appearances used in this scene:\n';
    output += JSON.stringify(usedAppearances, null, 2);
    output += '\n\n// Parts used in this scene:\n';
    output += JSON.stringify(usedParts, null, 2);
    output += '\n\n// Actors in this scene:\n';
    output += JSON.stringify(usedActors, null, 2);
    
    sceneOutput.value = output;
});

// Export Scene button - save to local storage
exportSceneBtn.addEventListener('click', () => {
    // Validate required fields
    const errors = [];
    
    if (!sceneName.value.trim()) {
        errors.push('Scene name is missing');
    }
    
    if (!sceneShortDesc.value.trim()) {
        errors.push('Scene description is missing');
    }
    
    if (!sceneMissionText.value.trim()) {
        errors.push('Mission text is missing');
    }
    
    if (actors.length === 0) {
        errors.push('No actors defined');
    }
    
    if (polygons.length === 0) {
        errors.push('No polygons defined');
    }
    
    if (appearances.length === 0) {
        errors.push('No appearances defined');
    }
    
    if (errors.length > 0) {
        alert('Cannot export scene. The following issues were found:\n\n' + errors.join('\n'));
        return;
    }
    
    // Generate scene data
    const sceneData = {
        name: sceneName.value.trim(),
        shortDescription: sceneShortDesc.value.trim(),
        missionText: sceneMissionText.value.trim(),
        actors: actors.map(actor => ({
            name: actor.name,
            mass: actor.mass,
            polygonName: actor.polygonName,
            appearanceName: actor.appearanceName,
            position: { x: actor.xPos, y: actor.yPos },
            velocity: { x: actor.xVel, y: actor.yVel },
            facing: actor.facing,
            spin: actor.spin,
            parts: actor.parts || []
        })),
        parts: parts.map(part => ({
            name: part.name,
            polygonName: part.polygonName,
            appearanceIndex: part.appearanceIndex
        })),
        polygons: polygons.map(polygon => ({
            name: polygon.name,
            points: polygon.points || polygon.dots || []
        })),
        appearances: appearances.map(appearance => ({
            name: appearance.name,
            fill: appearance.fill,
            stroke: appearance.stroke,
            text: appearance.text
        }))
    };
    
    // Save to local storage by name
    const storedScenes = JSON.parse(localStorage.getItem('sceneBuilderScenes') || '{}');
    storedScenes[sceneData.name] = sceneData;
    localStorage.setItem('sceneBuilderScenes', JSON.stringify(storedScenes));
    
    alert(`Scene "${sceneData.name}" has been exported to local storage.`);
});

// Import Scene button - show modal with list
let selectedSceneForImport = null;

importSceneBtn.addEventListener('click', () => {
    const storedScenes = JSON.parse(localStorage.getItem('sceneBuilderScenes') || '{}');
    const sceneNames = Object.keys(storedScenes);
    
    if (sceneNames.length === 0) {
        alert('No scenes found in local storage.');
        return;
    }
    
    // Show modal and populate with scenes
    selectedSceneForImport = null;
    sceneImportList.innerHTML = '';
    
    sceneNames.forEach((name) => {
        const item = document.createElement('div');
        item.className = 'polygon-select-item';
        item.textContent = name;
        item.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('#sceneImportList .polygon-select-item').forEach(el => {
                el.classList.remove('selected');
            });
            // Select this item
            item.classList.add('selected');
            selectedSceneForImport = name;
        });
        sceneImportList.appendChild(item);
    });
    
    sceneImportModal.style.display = 'block';
});

// Modal Import Scene button
modalImportSceneBtn.addEventListener('click', () => {
    if (selectedSceneForImport === null) {
        alert('Please select a scene to import');
        return;
    }
    
    const storedScenes = JSON.parse(localStorage.getItem('sceneBuilderScenes') || '{}');
    const sceneData = storedScenes[selectedSceneForImport];
    
    // Load scene data into the builder
    sceneName.value = sceneData.name || '';
    sceneShortDesc.value = sceneData.shortDescription || '';
    sceneMissionText.value = sceneData.missionText || '';
    
    // Load polygons
    polygons = sceneData.polygons.map(polygon => ({
        name: polygon.name,
        points: polygon.points || [],
        dots: polygon.points || []
    }));
    renderPolygonList();
    updateActorPolygonDropdown();
    updatePartPolygonDropdown();
    
    // Load appearances
    appearances = sceneData.appearances.map(appearance => ({
        name: appearance.name,
        fill: appearance.fill,
        stroke: appearance.stroke,
        text: appearance.text
    }));
    renderAppearanceList();
    updateActorAppearanceDropdown();
    updatePartAppearanceDropdown();
    
    // Load parts
    parts = sceneData.parts.map(part => ({
        name: part.name,
        polygonName: part.polygonName,
        appearanceIndex: part.appearanceIndex
    }));
    renderPartList();
    
    // Load actors
    actors = sceneData.actors.map(actor => ({
        name: actor.name,
        mass: actor.mass,
        polygonName: actor.polygonName,
        appearanceName: actor.appearanceName,
        xPos: actor.position.x,
        yPos: actor.position.y,
        xVel: actor.velocity.x,
        yVel: actor.velocity.y,
        facing: actor.facing,
        spin: actor.spin,
        parts: actor.parts || actor.partNames?.map(name => ({ name, xOffset: 0, yOffset: 0 })) || []
    }));
    renderActorList();
    
    // Redraw the map
    drawMapView();
    
    sceneImportModal.style.display = 'none';
    alert(`Scene "${selectedSceneForImport}" has been imported successfully.`);
});

// Modal Cancel Scene Import button
modalCancelSceneImportBtn.addEventListener('click', () => {
    sceneImportModal.style.display = 'none';
});

// Initialize actor preview canvas on page load
clearActorPreview();
drawActorPreviewGrid();
