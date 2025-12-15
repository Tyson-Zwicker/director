
import Point from '../point.js';
import Polygon from '../polygon.js';
import Button from '../button.js';
import Actor from '../actor.js';
import Director from '../director.js';
import Part from '../part.js';
import Appearance from '../appearance.js';

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


function rnd(min, max) {
  return Math.floor(min + Math.random() * (Math.abs(max) - min));
}
