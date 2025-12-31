import Draw from '../classes/draw.js';
import Line from '../classes/line.js';
import Point from '../classes/point.js';
// ----------> PRIME MOVER <-------------
init();
export default function init() {
  let canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 800;
  
  let l = new Line (new Point (100,100), new Point (700,700));
  let l1 = new Line (new Point (150,50), new Point (250,550));
  let l2 = new Line (new Point (400,10), new Point (50,600));
  let l3 = new Line (new Point (20,700), new Point (620,240));
  let l4 = new Line ( new Point (400,200),new Point (50,50));

  let draw = new Draw(canvas.getContext('2d'));
  draw.fillbox2 (0,0,800,800,'#024');
  draw.line2 (l,'#fff');
  draw.line2 (l1,'#0f0');
  draw.line2 (l2,'#f00');
  draw.line2 (l3,'#00f');
  draw.line2 (l4,'#f0f');

  let result = Line.getPointOfInterception (l,l1);
  if (result){
    draw.circle2 (result.x, result.y,10,'#488' );
  }
  result = Line.getPointOfInterception (l,l2);
  if (result){
    draw.circle2 (result.x, result.y,10,'#f88' );
  }
  result = Line.getPointOfInterception (l,l3);
  if (result){
    draw.circle2 (result.x, result.y,10,'#88f' );
  }
  result = Line.getPointOfInterception (l1,l2);
  if (result){
    draw.circle2 (result.x, result.y,10,'#ff0' );
  }
  result = Line.getPointOfInterception (l2,l3);
  if (result){
    draw.circle2 (result.x, result.y,10,'#ff0' );
  }
  result = Line.getPointOfInterception (l1,l3);
  if (result){
    draw.circle2 (result.x, result.y,10,'#0ff' );
  }
  result = Line.getPointOfInterception (l4,l1);
  if (result){
    draw.circle2 (result.x, result.y,10,'#f55' );
  }
  result = Line.getPointOfInterception (l4,l2);
  if (result){
    draw.circle2 (result.x, result.y,10,'#f5f' );
  }
  result = Line.getPointOfInterception (l4,l);
  if (result){
    draw.circle2 (result.x, result.y,10,'#f5f' );
  }else{
    console.log ('successfully did not detect any interception.');
  }
  let perp = Line.getPerpendicular (l,l.p1,20);
  draw.line2 (perp, '#ff0');
  let perp1 = Line.getPerpendicular (l1,l1.p1,30);
  draw.line2 (perp1, '#ff0');
  let perp2 = Line.getPerpendicular (l2,l2.p1,40);
  draw.line2 (perp2, '#ff0');
  let perp3 = Line.getPerpendicular (l3,l3.p1,20);
  draw.line2 (perp3, '#ff0');
  let perp4 = Line.getPerpendicular (l4,l4.p1,20);
  draw.line2 (perp4, '#ff0');
  
  let perp5 = Line.getPerpendicular (l,l.p0,20);
  draw.line2 (perp5, '#0ff');
  let perp6 = Line.getPerpendicular (l1,l1.p0,30);
  draw.line2 (perp6, '#0ff');
  let perp7 = Line.getPerpendicular (l2,l2.p0,40);
  draw.line2 (perp7, '#0ff');
  let perp8 = Line.getPerpendicular (l3,l3.p0,20);
  draw.line2 (perp8, '#0ff');
  let perp9 = Line.getPerpendicular (l4,l4.p0,20);
  draw.line2 (perp9, '#0ff');

}

