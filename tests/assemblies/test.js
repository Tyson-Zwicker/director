import Director from '../../code/director.js';
import ActorType from '../../code/actortype.js';
import Actor from '../../actor.js';
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
  Director.addPolygon(Polygon.rectangle('bridge', 50, 50));
  Director.addPolygon(Polygon.makeRegular('fuelcell', 10, 30));
  Director.addPolygon(Polygon.triangle('bow', 30, 30));
  Director.addPolygon(Polygon.makeRegular('thruster', 6, 10));
  Director.addPolygon(Polygon.rectangle('connector', '25', '10'));
  Director.addPolygon(Polygon.makeRegular('engine', 6, 50));

  const m = 10;
  Director.addActorType(new ActorType('bridge', 'bridge', m, 0.9));
  Director.addActorType(new ActorType('fuelcell', 'fuelcell', m * 2, 0.2));
  Director.addActorType(new ActorType('bow', 'fuelcell', m * 2, 0.2));
  Director.addActorType(new ActorType('thruster', 'thruster', m / 20, 0.3));
  Director.addActorType(new ActorType('connector', 'connector', m / 10, 0.5));
  Director.addActorType(new ActorType('engine', 'engine', m, 0.1));

  let assembly = 0;
  Director.addActor(Director.getActorType('bridge').createActorInstance(`bridge${assembly}`, Appearance.red));
  Director.addActor(Director.getActorType('bridge').createActorInstance(`bridge${assembly}`, Appearance.red));
}