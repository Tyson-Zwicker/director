import Point from '../classes/point.js';
import Draw from '../classes/draw.js';
import Boundry from '../classes/boundry.js'

let canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 800;
let ctx = canvas.getContext('2d');
let draw = new Draw(ctx);
let canvasCenter = new Point(canvas.height / 2, canvas.width / 2);

let boundry1 = new Boundry(-200, -200, 200, 200);
let boundry2 = new Boundry(-100, -100, 100, 100);

let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

init();

export default function init() {
  setupEventHandlers();
  animate();
}

function setupEventHandlers() {
  canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    updateMousePosition(e);
  });

  canvas.addEventListener('mouseup', () => {
    mouseDown = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    updateMousePosition(e);
    if (mouseDown) {
      moveBoundry2();
    }
  });
}

function updateMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left - canvas.width / 2;
  mouseY = e.clientY - rect.top - canvas.height / 2;
}

function moveBoundry2() {
  const width = boundry2.width;
  const height = boundry2.height;
  boundry2.x1 = mouseX - width / 2;
  boundry2.y1 = mouseY - height / 2;
  boundry2.x2 = mouseX + width / 2;
  boundry2.y2 = mouseY + height / 2;
}

function drawBox1() {
  draw.box2(boundry1.x1, boundry1.y1, boundry1.x2, boundry1.y2, '#aaa');
}

function drawBox2() {
  draw.box2(boundry2.x1, boundry2.y1, boundry2.x2, boundry2.y2, '#4a90e2');
}

function drawCornersInside() {
  // Check each corner of boundry2
  const corners = [
    { x: boundry2.x1, y: boundry2.y1 }, // top-left
    { x: boundry2.x2, y: boundry2.y1 }, // top-right
    { x: boundry2.x1, y: boundry2.y2 }, // bottom-left
    { x: boundry2.x2, y: boundry2.y2 }  // bottom-right
  ];

  corners.forEach(corner => {
    if (boundry1.isPointInside(corner)) {
      draw.circle2(corner.x, corner.y, 8, '#ff6b6b');
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  drawBox1();
  drawBox2();
  drawCornersInside();
  
  ctx.restore();
  
  requestAnimationFrame(animate);
}

