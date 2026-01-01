import Actor from '../classes/actor.js';
import Appearance from '../classes/appearance.js';
import Button from '../classes/button.js';
import Director from '../classes/director.js';
import Part from '../classes/part.js'
import Polygon from '../classes/polygon.js';
import Point from '../classes/point.js';
import Rnd from '../classes/rnd.js';
import Sensor from '../classes/sensor.js';

let trackingEnabled = false;

document.addEventListener('DOMContentLoaded', () => {
  const focusBtn = document.getElementById('focusBtn');
  focusBtn.addEventListener('click', onFocusButtonClick);

  const trackBtn = document.getElementById('trackBtn');
  trackBtn.addEventListener('click', onTrackButtonClick);

  const velIncBtn = document.getElementById('velInc');
  velIncBtn.addEventListener('click', onVelIncClick);

  const velDecBtn = document.getElementById('velDec');
  velDecBtn.addEventListener('click', onVelDecClick);

  const turnLeftBtn = document.getElementById('turnleft');
  turnLeftBtn.addEventListener('click', onTurnLeftClick);

  const turnRightBtn = document.getElementById('rightturn');
  turnRightBtn.addEventListener('click', onTurnRightClick);

  const rudderMidshipsBtn = document.getElementById('ruddermiships');
  rudderMidshipsBtn.addEventListener('click', onRudderMidshipsClick);
});

function onFocusButtonClick() {
  Director.view.camera.x = player.position.x;
  Director.view.camera.y = player.position.y;
}

function onTrackButtonClick() {
  trackingEnabled = !trackingEnabled;
  const trackBtn = document.getElementById('trackBtn');
  if (trackingEnabled) {
    trackBtn.style.opacity = '1';
    console.log('Tracking enabled');
  } else {
    trackBtn.style.opacity = '0.5';
    console.log('Tracking disabled');
  }
}

function onVelIncClick() {
  let thrustVector = Point.fromPolar(player.facing, 300);
  Point.scale (thrustVector, Director.delta);
  console.log('player:');
  console.log(player);
  Point.add(player.velocity, thrustVector);
  console.log('Velocity Increase clicked!');
}

function onVelDecClick() {
  let thrustVector = Point.fromPolar(player.facing, 300);
  Point.scale (thrustVector, -Director.delta);
  Point.add(player.velocity, thrustVector);
  console.log('Velocity Decrease clicked!');
}

function onTurnLeftClick() {
  if (player.spin < 60) player.spin -= 2
  console.log('Turn Left clicked!');
}

function onTurnRightClick() {
  if (player.spin < 60) player.spin += 2;
  console.log('Turn Right clicked!');
}

function onRudderMidshipsClick() {
  player.spin /= 2;
  if (Math.abs(player.spin) < 1) player.spin = 0;
  console.log('Rudder Midships clicked!');
}

// PRIME MOVER
let player = undefined;
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();

});
export default function init() {
  //Add some rocks..
  let rng = 20000;
  for (let i = 0; i < 1000; i++) {
    let s1 = Rnd.int(10, 100);
    let poly = Polygon.makeIrregular(Rnd.int(7, 15), s1, s1 * 1.5);
    let a = new Actor(
      `testobject${i}`,
      poly,
      new Appearance('#420', '#660', '#fff')
    );
    a.position = new Point(Rnd.int(-rng, rng), Rnd.int(-rng, rng));
    a.spin = 2 * Rnd.int(-10, 10);
    let hoveredAppearance = new Appearance('#ff0', '#f00');
    let pressedAppearance = new Appearance('#0ff', '#00f');
    let button = new Button(hoveredAppearance, pressedAppearance);
    button.clickFn = function () {
      let newlabel = `${this.actor.name} (${this.actor.position.x},${this.actor.position.y})`;
      this.actor.setLabel(newlabel, new Point(0, 0), a.appearance, 1);
      this.actor.velocity = new Point(Rnd.int(-50, 50), Rnd.int(-50, 50));
      this.actor.spin = Rnd.int(-10, 10);
    }
    a.attachButton(button);
    a.setLabel(i.toString(), new Point(0, 50), a.appearance, 1);
    Director.addActor(a);
  }
  //Add a triangle ship to interact with
  player = new Actor(`Player`, Polygon.triangle(50, 100), new Appearance('#066', '#06f', '#fff'));
  player.position = new Point(10, 10);
  player.spin = 0;
  player.facing = 0;
  let part1 = new Part('box1', 20, -10, Polygon.rectangle(3, 7), 0, player);
  part1.appearance = new Appearance('#ff0', '#f00', '#fff');
  player.attachPart(part1);
  let part2 = new Part('box2', 20, 10, Polygon.rectangle(3, 7), 0, player);
  part2.appearance = new Appearance('#ff0', '#f00', '#fff');
  player.attachPart(part2);
  let sensor1 = new Sensor(player, 2000, 33, 0, 10, true);
  let sensor2 = new Sensor(player, 600, 45, 270, 10, true);
  let sensor3 = new Sensor(player, 600, 45, 90, 10, true);
  player.attachSensor(sensor1);
  player.attachSensor(sensor2);
  player.attachSensor(sensor3);
  Director.addActor(player);

  let canvas = document.getElementById('mainCanvas');
  let canvasContainer = document.getElementById('canvasContainer');

  //Director.addCreatorsFunction(doSomething)  

  Director.run(canvas, canvasContainer);
}

