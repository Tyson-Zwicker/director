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
  Director.run();

});
function makeData() {
  //First some polygons..
  for (let i = 0; i < 10; i++) {
    let p = Polygon.makeIrregular(`poly${i}`, 11, 20, 25);
    Director.addPolygon(p);
  }
  //Make some colors too.
  for (let i = 0; i < 10; i++) {
    let app = new Appearance(`app${i}`, Rnd.colorAsHex(4), Rnd.colorAsHex(8), '#ffffff');
    Director.addAppearance(app);
  }
  //Make some actorTypes
  for (let i = 0; i < 10; i++) {
    let polygon = Director.getPolygon (`poly${Rnd.int(0, 10)}`);
    let actorType = new ActorType(`acttype${i}`, polygon, 10, Rnd.float(0.6,1), true, true);
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

