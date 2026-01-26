import Director from '../../code/director.js';
import ActorType from '../../code/actortype.js';
import Appearance from '../../code/appearance.js';
import Color from '../../code/color.js';
import Polygon from '../../code/polygon.js';
import Rnd from '../../code/rnd.js';
import Boundry from '../../code/boundry.js';
document.addEventListener('DOMContentLoaded', function () {
  Director.initialize();
  makeData();
  makeGUI();
  Director.view.backgroundColor = '#505';
  Director.run();

});

function makeGUI() {
  let nrm = new Appearance('app', '#050', '#0a0', '#fff');
  let hov = new Appearance('hov', '#070', '#0f0', '#ffa');
  let prs = new Appearance('prs', '#770', '#5f0', '#000');
  Director.gui.addText('top', 'Top Text 1', nrm);
  Director.gui.addText('top', 'Top Text 2', nrm);
  Director.gui.addText('left', 'Left Text 1', nrm);
  Director.gui.addText('left', 'Left Text 2', nrm);
  Director.gui.addButton('left', 'Click Me', nrm, hov, prs, false, (owner) => { console.log(owner); alert(`${owner}`) });
  Director.gui.addText('left', 'Left Text 3', nrm);

  //make buttons for list items..
  // gui.getButton(label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn) 
  let item1 = Director.gui.getButton('Option 1', nrm, hov, prs, false, undefined)
  let item2 = Director.gui.getButton('Option 2', nrm, hov, prs, false, undefined)
  let item3 = Director.gui.getButton('Option 3', nrm, hov, prs, false, undefined)
  let listItems = [item1, item2, item3];
  Director.gui.addList('left', 'Choose:', nrm, hov, prs, 'testlist', listItems);

  // Director.gui.addText('right', 'Right Text 1', nrm);
  // Director.gui.addText('right', 'Right Text 2', nrm);


  Director.gui.addText('bottom', 'Bottom Text 1', nrm);
  Director.gui.addText('bottom', 'Bottom Text 2', nrm);
}

function makeData() {
  //First some polygons..
  for (let i = 0; i < 10; i++) {
    let p = Polygon.makeIrregular(`poly${i}`, 11, 20, 25);
    Director.addPolygon(p);
  }
  //Make some colors too.
  for (let i = 0; i < 10; i++) {
    let app = new Appearance(`app${i}`, Rnd.colorAsHex(4), Rnd.colorAsHex(8), '#fff');
    Director.addAppearance(app);
  }
  //Make some actorTypes
  for (let i = 0; i < 10; i++) {
    let polygon = Director.getPolygon(`poly${Rnd.int(0, 9)}`);
    let actorType = new ActorType(`acttype${i}`, polygon, 10, Rnd.float(0.6, 1), true, true);
    Director.addActorType(actorType);
  }
  //Make some actors.
  let boundry = new Boundry(-5000, -5000, 5000, 5000);
  for (let i = 0; i < 3000; i++) {
    let actorType = Director.getActorType(`acttype${Rnd.int(0, 9)}`);
    let appearance = Director.getAppearance(`app${Rnd.int(0, 10)}`);
    let actor = actorType.createActorInstance(`actor${i}`,
      appearance,
      Rnd.point(boundry),
      Rnd.vect(0, 360, 5, 60),
      Rnd.int(360),
      Rnd.int(-10, 10));
    Director.addActor(actor);
  }
}