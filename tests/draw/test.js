import Draw from '../../code/draw.js';
import Color from '../../code/color.js';
import Appearance from '../../code/appearance.js';
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
  let red = new Color(15, 0, 0, 0.5);
  draw.line(50, 50, 100, 100, 10, red);
  let green = new Color(10, 15, 0, 0.5);
  draw.line(50, 100, 100, 50, 20, green);

  let spacing = 10;
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let ravg = 15 - x;
      let bavg = x;
      let gavg = y;
      let red = Math.ceil(ravg);
      let green = Math.ceil(gavg);
      let blue = Math.ceil(bavg);

      let color = new Color(red, green, blue, 0.3);
      draw.fillBox(
        x * spacing,
        y * spacing,
        (x + 1) * spacing,
        (y + 1) * spacing, color);
    }
  }

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let ravg = 15 - x;
      let bavg = x;
      let gavg = y;
      let red = Math.ceil(ravg);
      let green = Math.ceil(gavg);
      let blue = Math.ceil(bavg);
      let color = new Color(red, green, blue, 1);
      draw.fillBox(
        200 + x * spacing,
        y * spacing,
        200 + (x + 1) * spacing,
        (y + 1) * spacing, color);
    }
  }

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let ravg = 15 - x;
      let bavg = x;
      let gavg = y;
      let red = Math.ceil(ravg);
      let green = Math.ceil(gavg);
      let blue = Math.ceil(bavg);
      let color = new Color(red, green, blue).changeBrightness(.3);
      draw.fillBox(
        200 + x * spacing,
        200 + y * spacing,
        200 + (x + 1) * spacing,
        200 + (y + 1) * spacing, color);
    }
  }

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let ravg = 15 - x;
      let bavg = x;
      let gavg = y;
      let red = Math.ceil(ravg);
      let green = Math.ceil(gavg);
      let blue = Math.ceil(bavg);
      let color = new Color(red, green, blue).changeBrightness(0.8);
      draw.fillBox(
        x * spacing,
        200 + y * spacing,
        (x + 1) * spacing,
        200 + (y + 1) * spacing, color);
    }
  }
  let appearance = new Appearance ('test','#040','#0a0','#fff',2);
  draw.textBox (400,5,500,45, 'Text Box!', 16, 'monospace', appearance);
}

