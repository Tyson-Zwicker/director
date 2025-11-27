import Polygon from '../polygon.js';
import Director from '../director.js';
import Appearance from '../appearance.js';
import Draw from './drawtest.js';

// ----------> PRIME MOVER <-------------
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {

  //let draw = new Draw (Director.view.context);

  Director.run();
}
