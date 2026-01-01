import Director from '../classes/director.js';
import Color from '../classes/color.js';
import RadialEffect from '../classes/radialeffect.js';
import Point from '../classes/point.js';
import Rnd from '../classes/rnd.js';
document.addEventListener('DOMContentLoaded', () => {
  const testBtn = document.getElementById('testBtn');
  testBtn.addEventListener('click', onTestButtonClick);
});

function onTestButtonClick() {
  console.log('Test button clicked!');
}

// PRIME MOVER
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});
let count = 0;
export default function init() {


  function doSomething() {
    let spread = 400
    if (count === 2) {
      let radialEffect = new RadialEffect(
        new Point(
          Rnd.int(-spread,spread),
          Rnd.int(-spread,spread),
        ),
        Rnd.int(10, 50),
        (new Color(0, 15, 8)).opacity = Rnd.float(), Rnd.float(0.1, 0.4)
      );
      count = 0;
      Director.addBackgroundEffect(radialEffect);
      radialEffect = new RadialEffect(
        new Point(
          Rnd.int(spread),
          Rnd.int(spread)
        ),
        Rnd.int(10, 50),
        Color.random (15), Rnd.float(.3, 2)
      );
      count = 0;
      Director.addForegroundEffect(radialEffect);
    }
    count++;
  }
  let canvas = document.getElementById('mainCanvas');
  let canvasContainer = document.getElementById('canvasContainer');
  Director.addCreatorsFunction(doSomething)
  
  console.log(canvas.width);
  console.log(canvasContainer.clientWidth);

  Director.run(canvas, canvasContainer);
}

