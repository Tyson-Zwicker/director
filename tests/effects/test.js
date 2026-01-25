import Director from '../../code/director.js';
import ActorType from '../../code/actortype.js';
import Appearance from '../../code/appearance.js';
import Point from '../../code/point.js';
import Polygon from '../../code/polygon.js';
import Rnd from '../../code/rnd.js';
import Boundry from '../../code/boundry.js';
import Color from '../../code/color.js';
import ParticleGenerator from '../../code/particlegenerator.js';
import CircleEffect from '../../code/circleeffect.js';
import LineEffect from '../../code/lineeffect.js';
import RadialEffect from '../../code/radialeffect.js';
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
  let whichEffect = Rnd.int(3);
  let foreground = (Rnd.bool());
  let bounds = new Boundry(-1500, -1500, 1500, 1500);
  if (whichEffect == 0) {
    let lineEffect = new LineEffect(Rnd.point(bounds), Rnd.point(bounds), Rnd.int(1, 5), Rnd.color(10), Rnd.float(0.5, 1));
    if (foreground) {
      Director.addForegroundEffect(lineEffect);
    } else {
      Director.addBackgroundEffect(lineEffect);
    }
  } else if (whichEffect == 1) {
    let circleEffect = new CircleEffect(Rnd.point(bounds), Rnd.int(10, 50), Rnd.color(10), Rnd.float(0.2, 1.5));
    if (foreground) {
      Director.addForegroundEffect(circleEffect);
    } else {
      Director.addBackgroundEffect(circleEffect);
    }
  } else if (whichEffect == 2) {
    let radialEffect = new RadialEffect(Rnd.point(bounds), Rnd.int(10, 50), Rnd.int (50,300), Rnd.color(10), Rnd.int (5,30),Rnd.float(0.5, 2));
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
    let fill = Rnd.colorAsHex (4);
    let stroke = Rnd.colorAsHex (10);
    let app = new Appearance(`app${i}`, fill,stroke, '#fff');
    Director.addAppearance(app);
  }
  //And one for the player
  Director.addAppearance(new Appearance('player', '#a00', '#f80', '#fff'));
  //Make some actorTypes
  for (let i = 0; i < 10; i++) {
    let polygon = Director.getPolygon(`poly${Rnd.int(0, 10)}`);
    let actorType = new ActorType(`acttype${i}`, polygon, 10, Rnd.float(0.6, 1), true, true);
    Director.addActorType(actorType);
  }
  //Make some actors.
  let boundry = new Boundry(-1000, -1000, 1000, 1000);
  for (let i = 0; i < 50; i++) {
    let actorType = Director.getActorType(`acttype${Rnd.int(0, 9)}`);
    let appearance = Director.getAppearance(`app${Rnd.int(0, 10)}`);
    let actor = actorType.createActorInstance(`actor${i}`, appearance, Rnd.point(boundry), Rnd.vect(0, 360, 5, 60), Rnd.int(360), Rnd.int(-10, 10));
    Director.addActor(actor);
  }
}