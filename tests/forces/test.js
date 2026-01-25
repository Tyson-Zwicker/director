import Director from '../../code/director.js';
import ActorType from '../../code/actortype.js';
import Appearance from '../../code/appearance.js';
import Polygon from '../../code/polygon.js';
import Rnd from '../../code/rnd.js';
import Point from '../../code/point.js';
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
    let polygon = Director.getPolygon(`poly${Rnd.int(0, 10)}`);
    let actorType = new ActorType(`acttype${i}`, polygon, 10, Rnd.float(0.8,1), true, true);
    Director.addActorType(actorType);
  }
  //Make some actors.


  for (let x = -2000; x < 2000; x += 200) {
    for (let y = -2000; y < 2000; y += 200) {
      let actorType = Director.getActorType(`acttype${Rnd.int(0, 9)}`);
      let appearance = Director.getAppearance(`app${Rnd.int(0, 10)}`);
      let actor = actorType.createActorInstance(`actor${x + '|' + y}`, appearance, new Point(x, y), Rnd.vect (0,360,0,100), Rnd.int(360), 0);
      let forceStrength = -1;
      Director.addFieldToActor (actor, forceStrength);
      Director.addActor(actor);
    };

  }
}

