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
const actorMass = document.getElementById('actorMass');

// Validate mass input to only accept non-negative numbers
actorMass.addEventListener('input', (e) => {
    if (e.target.value !== '' && parseFloat(e.target.value) < 0) {
        e.target.value = 0;
    }
});

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
