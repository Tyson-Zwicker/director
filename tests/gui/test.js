import Director from '../../code/director.js';
import ActorType from '../../code/actortype.js';
import Appearance from '../../code/appearance.js';
import Color from '../../code/color.js';
import Polygon from '../../code/polygon.js';
import Rnd from '../../code/rnd.js';
import Boundry from '../../code/boundry.js';
document.addEventListener('DOMContentLoaded', function () {
  Director.initialize();
  makeGUI();
  Director.view.backgroundColor = '#505';
  Director.run();

});
function makeGUI(){
  let app1 = new Appearance('app1', '#050', '#0a0', '#fff');
  Director.gui.addText('top', 'Top Text 1', app1);
  Director.gui.addText('top', 'Top Text 2', app1);
  Director.gui.addText('left', 'Left Text 1', app1);
  Director.gui.addText('left', 'Left Text 2', app1);
  Director.gui.addText('right', 'Right Text 1', app1);
  Director.gui.addText('right', 'Right Text 2', app1);
  Director.gui.addText('bottom', 'Bottom Text 1', app1);
  Director.gui.addText('bottom', 'Bottom Text 2', app1);
}

