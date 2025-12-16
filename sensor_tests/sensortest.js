
import Point from '../point.js';
import Polygon from '../polygon.js';
import Button from '../button.js';
import Actor from '../actor.js';
import Director from '../director.js';
import Part from '../part.js';
import Appearance from '../appearance.js';
import Sensor from '../sensor.js';
// PRIME MOVER
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {
  let a = new Actor(`ScoutCraft`, Polygon.triangle(50, 100));
  a.position = new Point(50, 50);
  a.spin = 0;
  a.facing = 90;
  a.appearance = new Appearance('#066', '#06f', '#fff');
  let part1 = new Part('box', -25, -20, Polygon.rectangle(15, 5), 0,a);
  part1.appearance = new Appearance('#ff0', '#f00', '#fff');
  a.attachPart(part1);
  let part2 = new Part('box', -25, 20, Polygon.rectangle(15, 5), 0,a);
  part2.appearance = new Appearance('#0f7', '#0ff', '#fff');
  a.attachPart(part2);
  Director.addActor(a);
  let hovered = new Appearance('#ff9', '#f00', '#fff', 2);
  let pressed = new Appearance('#6ff', '#f82', '#fff', 3);
  let sensorA = new Sensor("SensorA", 90, 10, 1, 3000, true);
  let sensorB = new Sensor("SensorB", 270, 10, 1, 3000, true);
  a.attachSensor(sensorA);
  a.attachSensor(sensorB);
  let sensorToggleButton = new Button(hovered, pressed);
  sensorToggleButton.clickFn = function toggleSensors() {
    sensorA.active = !sensorA.active;
    sensorB.active = !sensorA.active;
  }
  a.attachButton(sensorToggleButton);

  let b = new Actor(`BigRed`, Polygon.makeIrregular(70, 500, 700));
  b.position = new Point(1500, 1500);
  b.spin = 2;
  b.facing = 30;
  b.appearance = new Appearance('#f06', '#f00', '#f72');
  Director.addActor(b);

  let c = new Actor(`BigBlue`, Polygon.makeRegular(30, 1500));
  c.position = new Point(-1500, -1500);
  c.spin = 3;
  c.facing = 60;
  c.appearance = new Appearance('#03F', '#09f', '#0af');
  Director.addActor(c);

  let d = new Actor(`BigPurple`, Polygon.makeRegular(30, 1000));
  d.position = new Point(200, 9000);
  d.spin = 4;
  d.facing = 90;
  d.appearance = new Appearance('#b0d', '#f0f', '#f0f');
  Director.addActor(d);


  
    // Get the actor we want to control (A1)
    let controlledActor = Director.actors.get('ScoutCraft');
  
    // W key - increase velocity
    Director.keyboard.setKeyFunction('w', () => {
      if (controlledActor) {
        let thrustMagnitude = 300; // Adjust this for more/less thrust
        let thrustVector = Point.fromPolar(controlledActor.facing, thrustMagnitude);
        controlledActor.velocity.x += thrustVector.x / 60; // Divide by 60 to normalize per frame
        controlledActor.velocity.y += thrustVector.y / 60;
      }
    });
  
    // A key - rotate left (steer)
    Director.keyboard.setKeyFunction('a', () => {
      if (controlledActor) {
        controlledActor.spin -= 5; // Rotate 5 degrees left
      }
    });
  
    // S key - decrease velocity (reverse/brake)
    Director.keyboard.setKeyFunction('s', () => {
      if (controlledActor) {
        let brakeMagnitude = 150;
        let brakeVector = Point.fromPolar(controlledActor.facing + 180, brakeMagnitude);
        controlledActor.velocity.x += brakeVector.x / 60;
        controlledActor.velocity.y += brakeVector.y / 60;
      }
    });
  
    // D key - rotate right (steer)
    Director.keyboard.setKeyFunction('d', () => {
      if (controlledActor) {
        controlledActor.spin += 5; // Rotate 5 degrees right
      }
    });
  function runTheTest() {
    if (sensorA.active) part1.facing += 5;
    if (sensorB.active) part2.facing -= 5;

    sensorA.active = !sensorA.active;
    sensorB.active = !sensorB.active;
  }
  Director.addCreatorsFunction(runTheTest);
  Director.run();
  
}


function rnd(min, max) {
  return Math.floor(min + Math.random() * (Math.abs(max) - min));
}
