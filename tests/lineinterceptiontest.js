import Draw from '../draw.js';
import Line from '../line.js';
import Point from '../point.js';
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

  let draw = new Draw(canvas.getContext('2d'));
  console.log (draw);
  draw.fillbox2 (0,0,800,800,'#024');
  draw.line2 (l,'#fff');
  draw.line2 (l1,'#0f0');
  draw.line2 (l2,'#f00');
  draw.line2 (l3,'#00f');

  let result = Line.pointOfInterception (l,l1);
  if (result){
    draw.circle2 (result.x, result.y,10,'#488' );
  }
  result = Line.pointOfInterception (l,l2);
  if (result){
    draw.circle2 (result.x, result.y,10,'#f88' );
  }
  result = Line.pointOfInterception (l,l3);
  if (result){
    draw.circle2 (result.x, result.y,10,'#88f' );
  }
  result = Line.pointOfInterception (l1,l2);
  if (result){
    draw.circle2 (result.x, result.y,10,'#ff0' );
  }
  result = Line.pointOfInterception (l2,l3);
  if (result){
    draw.circle2 (result.x, result.y,10,'#ff0' );
  }
  result = Line.pointOfInterception (l1,l3);
  if (result){
    draw.circle2 (result.x, result.y,10,'#0ff' );
  }


}

