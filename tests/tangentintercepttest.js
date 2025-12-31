import Draw from '../draw.js';
import Line from '../line.js';
import Point from '../point.js';

// ----------> PRIME MOVER <-------------
init();
export default function init() {

  let canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 800;

  let context = canvas.getContext('2d');
  context.fillStyle = '#223';
  context.fillRect(0, 0, canvas.width, canvas.height);
  let draw = new Draw(context);
  
  let center = new Point (canvas.width / 2, canvas.height / 2);
  let len = Math.min (canvas.height, canvas.width) / 3;
  let tanlen = len / 5;

  for (let a = 0; a < 360; a += 30) {
    let p1 = Point.fromPolar(a, len);
    Point.add (p1,center)

    let l = new Line(center, p1);
    let t = Line.getPerpendicular(l, p1, tanlen);
    draw.line2(l, '#ff0');
    draw.line2(t, '#f0f');
    
    let s1a = Point.fromPolar (a+5, len+25);
    Point.add (s1a,center);
    let s1 = new Line (center,  s1a);
    draw.line2(s1,'#0f0');

    let s2a = Point.fromPolar (a-4, len+25);
    Point.add (s2a,center);
    let s2 = new Line (center,  s2a);
    draw.line2(s2,'#f00');

    let ip1 = Line.getPointOfInterception (t, s1);
    draw.circle2 (ip1.x, ip1.y, 5,'#0ff');
  }

}

