import Draw from '../draw.js';
import Color from '../color.js';
// ----------> PRIME MOVER <-------------
init();
export default function init() {
  console.log('drawtest.init..');
  let canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 800;
  let context = canvas.getContext('2d');
  context.fillStyle = '#223';
  context.fillRect(0, 0, canvas.width, canvas.height);
  let draw = new Draw(context);
  console.log('drawtest.draw instantiated.');
  let red = new Color(15, 0, 0, 0.5);
  console.log(`drawtest.red:${red.toString()}`);
  draw.line(50, 50, 100, 100, 10, red);
  let green = new Color(10, 15, 0, 0.5);
  draw.line(50, 100, 100, 50, 20, green);

  let spacing = 20;
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let red = Math.ceil(15 - x);
      let blue = Math.ceil(15 - y);
      let green = Math.ceil(15 - (red + blue) / 2);
      let color = new Color(red, green, blue, 0.3);
      draw.box(x * spacing, y * spacing, (x + 1) * spacing, (y + 1) * spacing, color);
    }
  }

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let red = Math.ceil(15 - x);
      let blue = Math.ceil(15 - y);
      let green = Math.ceil(15 - (red + blue) / 2);
      let color = new Color(red, green,blue, 1);
      draw.box(400 + x * spacing, y * spacing, 400 + (x + 1) * spacing, (y + 1) * spacing, color);
    }
  }

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let red = Math.ceil(15 - x);
      let blue = Math.ceil(15 - y);
      let green = Math.ceil(15 - (red + blue) / 2);
      let color = new Color(red, green, blue).changeBrightness(0.5);
      draw.box(400 + x * spacing, 400 + y * spacing, 400 + (x + 1) * spacing, 400 + (y + 1) * spacing, color);
    }
  }

   for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let red = Math.ceil(15 - x);
      let blue = Math.ceil(15 - y);
      let green = Math.ceil(15 - (red + blue) / 2);
      let color = new Color(red, green, blue).changeBrightness(0.33);
      draw.box( x * spacing, 400 + y * spacing,  (x + 1) * spacing, 400 + (y + 1) * spacing, color);
    }
  }      
}

