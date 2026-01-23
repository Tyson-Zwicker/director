import Director from '../../code/director.js';
import ActorType from '../../code/actortype.js';
import Appearance from '../../code/appearance.js';
import Actor from '../../code/actor.js';
import Point from '../../code/point.js';
import Polygon from '../../code/polygon.js';
import Rnd from '../../code/rnd.js';
import Boundry from '../../code/boundry.js';
import Sensor from '../../code/sensor.js';

document.addEventListener('DOMContentLoaded', function () {
  Director.initialize();
  makeData();
  Director.run();
});

let player1 = undefined;;

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
    let app = new Appearance(`app${i}`, Rnd.colorAsHex(8), Rnd.colorAsHex(12), '#ffffff');
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
  for (let i = 0; i < 100; i++) {
    let actorType = Director.getActorType(`acttype${Rnd.int(0, 9)}`);
    let appearance = Director.getAppearance(`app${Rnd.int(0, 10)}`);
    let actor = actorType.createActorInstance(`actor${i}`, appearance, Rnd.point(boundry), Rnd.vect(0, 360, 0, 5), Rnd.int(360), Rnd.int(-10, 10));
    Director.addActor(actor);
  }
  //Make the player
  player1 = new Actor('player1', Director.getPolygon('triangle'), Director.getAppearance('player'), 100, 0.8, true, true);
  Director.addActor(player1);
  //Add keyboard bindings:
  Director.bindKey('w', w_key);
  Director.bindKey('s', s_key);
  Director.bindKey('a', a_key);
  Director.bindKey('d', d_key);
  Director.bindKey('x', x_key);
  player1.attachSensor(new Sensor(400, 33, 0, 7.2, true));
  player1.attachSensor(new Sensor(1000, 45, 270, 3.6, true));
  player1.attachSensor(new Sensor(1000, 45, 90, 3.6, true));
}
function x_key(e, delta) {
  if (player1.spin === 0) return;
  player1.spin = .95 * player1.spin;
}
function w_key(e, delta) {
  if (e.action === 'press' || e.action === 'hold') {
    let thrustMagnitude = 1000; // Adjust this for more/less thrust
    let thrustVector = Point.fromPolar(player1.facing, thrustMagnitude);
    player1.applyForce(thrustVector, delta);
  }
}
function s_key(e, delta) {
  if (e.action === 'press' || e.action === 'hold') {
    let thrustMagnitude = -2000; // Adjust this for more/less thrust
    let thrustVector = Point.fromPolar(player1.facing, thrustMagnitude);
    player1.applyForce(thrustVector, delta);
  }
}
function a_key(e, delta) {
  if (e.action === 'press' || e.action === 'hold') {
    player1.spin -= 0.01 / delta;
    if (player1.spin > 180) player1.spin = 180;
  }
}
function d_key(e, delta) {
  if (e.action === 'press' || e.action === 'hold') {
    player1.spin += .01 / delta;
    if (player1.spin < -180) player1.spin = -180;
  }
}
