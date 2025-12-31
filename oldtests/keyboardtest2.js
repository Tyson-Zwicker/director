import Director from '../classes/director.js';

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
