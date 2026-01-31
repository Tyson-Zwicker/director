import Director from '../../code/director.js';
import ActorType from '../../code/actortype.js';
import Appearance from '../../code/appearance.js';
import Polygon from '../../code/polygon.js';
import Rnd from '../../code/rnd.js';
import Boundry from '../../code/boundry.js';
import GUI from '../../code/gui_new.js';

document.addEventListener('DOMContentLoaded', function () {
  Director.initialize();
  makeData();
  makeGUI();
  Director.view.backgroundColor = '#505';
  Director.run();
});

function makeGUI() {
  let nrm = new Appearance('app', '#050', '#0a0', '#fff');
  let shd = new Appearance('shd', '#343', '#565', '#999');
  let hov = new Appearance('hov', '#070', '#0f0', '#ffa');
  let prs = new Appearance('prs', '#770', '#5f0', '#000');
  GUI.addText('top', 'Top Text 1', nrm, shd);
  GUI.addText('top', 'Top Text 2', nrm, shd);
  GUI.addText('left', 'Left Text 1', nrm, shd);
  GUI.addText('left', 'Left Text 2', nrm, shd);
  GUI.addButton('left', 'Click Me', nrm, shd, hov, prs, false, (response) => { console.log(response); alert(`${response.owner} says ${response.value}`) }, 'Hello');
  GUI.addButton('left', 'Click Me 2', nrm, shd, hov, prs, false, (response) => { console.log(response); alert(`${response.owner} says ${response.value}`) }, 'World');
  GUI.addText('left', 'Left Text 3', nrm, shd);
  let listOptions = [
    {text:'Option A', value:'A'},
    {text:'Option B', value:'B'},
    {text:'Option C', value:'C'},
    {text:'Option D', value:'D'}
  ]
  GUI.addList ('left','Choose',nrm,shd,hov,prs,listOptions,'C');
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
  let boundry = new Boundry(-1000, -1000, 1000, 1000);
  for (let i = 0; i < 500; i++) {
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