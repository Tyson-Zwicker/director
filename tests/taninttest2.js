import Draw from '../classes/draw.js';
import Line from '../classes/line.js';
import Point from '../classes/point.js';
// ----------> PRIME MOVER <-------------

let walls = [];
let canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 800;
let canvasCenter = new Point (canvas.width / 2, canvas.height / 2);

let context = canvas.getContext('2d');
let draw = new Draw(context);
let maxR = Math.min(canvas.width, canvas.height);
let center = Point.from (canvasCenter);

// Track mouse position
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  center.x = event.clientX - rect.left;
  center.y = event.clientY - rect.top;
});

init();
export default function init() {

  let canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 800;

  let context = canvas.getContext('2d');
  context.fillStyle = '#223';
  context.fillRect(0, 0, canvas.width, canvas.height);
  let da = 23.73 //i like hendecagons

  for (let a = 0; a < 360; a += da) {
    let p0 = Point.fromPolar(a, maxR / 3);
    let p1 = Point.fromPolar((a + da), maxR / 3);
    Point.add(p0, canvasCenter);
    Point.add(p1, canvasCenter);

    let line = new Line(canvasCenter, p0);
    
    let tan = Line.getPerpendicular(line, line.p1, maxR / 10);
    walls.push({
      "p0": p0,
      "p1": p1,
      "line": line,
      "tan": tan
    });
  }

  // Animation loop
  function animate() {
    // Clear canvas
    context.fillStyle = '#223';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    drawTheWalls();
    drawRays();
    
    requestAnimationFrame(animate);
  }

  function drawTheWalls() {
    for (let i = 0; i < walls.length; i++) {
      draw.line2(walls[i].tan, '#0ff');
      // draw.line2(new Line (canvasCenter, walls[i].tan.p0), '#570');
      // draw.line2(new Line (canvasCenter, walls[i].tan.p1), '#570');
      draw.line2(new Line (canvasCenter, new Point (walls[i].line.p0.x, walls[i].line.p0.y)),'#0f0f');
    }
  }

  function drawRays() {
    for (let a = 0; a < 360; a += 60) {
      let p1 = Point.fromPolar(a + 5, maxR);
      Point.add(p1, center);
      let ray1 = new Line(Point.from(center), p1);
      draw.line2(ray1, '#900');
      
      // Check ray1 against all walls
      for (let i = 0; i < walls.length; i++) {
        let intersection = Line.getPointOfInterception(ray1, walls[i].tan);
        if (intersection) {
          draw.circle2(intersection.x, intersection.y, 5, '#ff0');
        }
      }
      
      let p2 = Point.fromPolar(a - 5, maxR);
      Point.add(p2, center);
      let ray2 = new Line(Point.from(center), p2);
      draw.line2(ray2, '#080');
      
      // Check ray2 against all walls
      for (let i = 0; i < walls.length; i++) {
        let intersection = Line.getPointOfInterception(ray2, walls[i].tan);
        if (intersection) {
          draw.circle2(intersection.x, intersection.y, 5, '#0ff');
        }
      }
    }
  }

  animate();
}

