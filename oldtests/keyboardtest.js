
import Point from '../classes/point.js';
import Polygon from '../classes/polygon.js';
import Button from '../classes/button.js';
import Actor from '../classes/actor.js';
import Director from '../classes/director.js';
import Part from '../classes/part.js';
import Appearance from '../classes/appearance.js';

// PRIME MOVER
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {
  let lastKey = undefined;
  function runTest() {
    if (Director.keyboard.lastKey != lastKey) {
      console.log(Director.keyboard.lastKey);
    }
  }
  Director.addCreatorsFunction(runTest);
  Director.run();
}

