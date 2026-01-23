import Director from '../../code/director.js';
import ActorType from '../../code/actortype.js';
import Appearance from '../../code/appearance.js';
import Point from '../../code/point.js';
import Polygon from '../../code/polygon.js';
import Rnd from '../../code/rnd.js';
import Boundry from '../../code/boundry.js';
import Color from '../../code/color.js';
import ParticleGenerator from '../../code/particlegenerator.js';
import RadialEffect from '../../code/radialeffect.js';
import LineEffect from '../../code/lineeffect.js';
document.addEventListener('DOMContentLoaded', function () {
  Director.initialize();
  makeData();
  placeParticleGenerator();
  Director.run();

  Director.addCreatorsFunction(makeSomeEffects);
});

let player1 = undefined;;

function placeParticleGenerator() {
  let generator1 = new ParticleGenerator('generator1', new Point(0, 30), 0, 360, 20, 80, new Color(15, 0, 0), 10, 2, 5, 30, 50, true);
  let generator2 = new ParticleGenerator('generator2', new Point(0, -30), 0, 360, 5, 20, new Color(0, 0, 15), 1, 4, 5, 30, 10, true);
  Director.addParticleGenerator(generator1);
  Director.addParticleGenerator(generator2);
}
function makeSomeEffects() {
  /*class LineEffect {
 constructor(p0, p1, w, color, durationInSeconds)
 ParticleGenertor {
 constructor(name, position, angleMin, angleMax, velMin, velMax, color, size, durMin, durMax, periodMillis, foreground) {
  class RadialEffect {
 constructor(position, radius, color, durationInSeconds) {
 */
  let whichEffect = Rnd.int(2);
  let foreground = (Rnd.bool());
  let bounds = new Boundry(-500, -500, 500, 500);
  if (whichEffect == 0) {
    let lineEffect = new LineEffect(Rnd.point(bounds), Rnd.point(bounds), Rnd.int(1, 5), Rnd.color(10), Rnd.float(0.5, 3));
    if (foreground) {
      Director.addForegroundEffect(lineEffect);
    } else {
      Director.addBackgroundEffect(lineEffect);
    }
  } else if (whichEffect == 1) {
    let radialEffect = new RadialEffect(Rnd.point(bounds), Rnd.int(10, 50), Rnd.color(10), Rnd.float(0.5, 2));
    if (foreground) {
      Director.addForegroundEffect(radialEffect);
    } else {
      Director.addBackgroundEffect(radialEffect);
    }
  }
}
function makeData() {
  //First some polygons..
  for (let i = 0; i < 10; i++) {
    let p = Polygon.makeIrregular(`poly${i}`, 11, 20, 25);
    Director.addPolygon(p);
  }
  //Now make the "player" polygon...
  Director.addPolygon(Polygon.triangle('triangle', 30, 50));
  //Make some colors too.
  for (let i = 0; i < 10; i++) {
    let app = new Appearance(`app${i}`, Rnd.colorAsHex(4), Rnd.colorAsHex(8), '#ffffff');
    Director.addAppearance(app);
  }
  //And one for the player
  Director.addAppearance(new Appearance('player', '#aa0000', '#ff8800', '#ffffff'));
  //Make some actorTypes
  for (let i = 0; i < 10; i++) {
    let polygon = Director.getPolygon(`poly${Rnd.int(0, 10)}`);
    let actorType = new ActorType(`acttype${i}`, polygon, 10, Rnd.float(0.6, 1), true, true);
    Director.addActorType(actorType);
  }
  //Make some actors.
  let boundry = new Boundry(-1000, -1000, 1000, 1000);
  for (let i = 0; i < 500; i++) {
    let actorType = Director.getActorType(`acttype${Rnd.int(0, 9)}`);
    let appearance = Director.getAppearance(`app${Rnd.int(0, 10)}`);
    let actor = actorType.createActorInstance(`actor${i}`, appearance, Rnd.point(boundry), Rnd.vect(0, 360, 5, 60), Rnd.int(360), Rnd.int(-10, 10));
    Director.addActor(actor);
  }
}