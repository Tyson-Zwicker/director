
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
  Director.keyboard.setKeyFunction('w', () => {
    console.log('Oh look a w...');
  });
Director.keyboard.setKeyFunction('a', () => {
    console.log('Oh look an a...');
  });
  Director.keyboard.setKeyFunction('s', () => {
    console.log('Oh look an s...');
  });
  Director.keyboard.setKeyFunction('d', () => {
    console.log('Oh look a d...');
  });
  /*function runTest() {
    if (Director.keyboard.lastKey != lastKey) {
      console.log(Director.keyboard.lastKey);
    }
  }
  Director.addCreatorsFunction(runTest);
  */
  Director.run();
}

