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
const fillHex = document.getElementById('fillHex');
const strokeHex = document.getElementById('strokeHex');
const textHex = document.getElementById('textHex');
const colorTypeRadios = document.querySelectorAll('input[name="colorType"]');

// Store color values for each type
const colors = {
    fill: { r: 0, g: 0, b: 0 },
    stroke: { r: 0, g: 0, b: 0 },
    text: { r: 0, g: 0, b: 0 }
};

let currentColorType = 'fill';

// Update color preview for specific type
function updateColorPreview(type) {
    const color = new Color(colors[type].r, colors[type].g, colors[type].b);
    const hexColor = color.asHex();
    
    if (type === 'fill') {
        fillPreview.style.backgroundColor = hexColor;
        fillHex.value = hexColor;
    } else if (type === 'stroke') {
        strokePreview.style.backgroundColor = hexColor;
        strokeHex.value = hexColor;
    } else if (type === 'text') {
        textPreview.style.backgroundColor = hexColor;
        textHex.value = hexColor;
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
