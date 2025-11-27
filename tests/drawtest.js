import Draw from '../draw.js';
import Color from '../color.js';
// ----------> PRIME MOVER <-------------
init();
export default function init() { 
  console.log ('init..');
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext ('2d');
  context.fillStyle = '#223';
  context.fillRect (0,0,canvas.width, canvas.height);
  let draw = new Draw (context);
  console.log ('draw instantiated.');
  let red = new Color (15,0,0);
  console.log (red.toString());
  draw.line (50,50, 100,100, 10,red);
    
}

