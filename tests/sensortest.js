
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
  let a = new Actor(`Scout Craft`, Polygon.triangle(50, 100));
  a.position = new Point(0, 0);
  a.spin = 0;
  a.rotation = 90;
  a.appearance = new Appearance('#066', '#06f', '#fff');
  let part1 = new Part('box', -25, -20, Polygon.rectangle(15, 5), 0);
  part1.appearance = new Appearance('#ff0', '#f00', '#fff');
  a.attachPart(part1);
  let part2 = new Part('box', -25, 20, Polygon.rectangle(15, 5), 0);
  part2.appearance = new Appearance('#0f7', '#0ff', '#fff');
  a.attachPart(part2);
  Director.addActor(a);
  let hovered = new Appearance('#ff9', '#f00', '#fff', 2);
  let pressed = new Appearance('#6ff', '#f82', '#fff', 3);
  let sensorA = new Sensor("SensorA", 90, 10, 1, 6000, false);
  let sensorB = new Sensor("SensorB", 270, 10, 1, 6000, false);
  a.attachSensor(sensorA);
  a.attachSensor(sensorB);
  let sensorToggleButton = new Button(hovered, pressed);
  sensorToggleButton.clickFn = function toggleSensors() {
    sensorA.active = !sensorA.active;
    sensorB.active = !sensorA.active;
  }
  a.attachButton(sensorToggleButton);

  let b = new Actor(`BigRed`, Polygon.makeIrregular(70, 500, 700));
  b.position = new Point(3000, 0);
  b.spin = 2;
  b.rotation = 30;
  b.appearance = new Appearance('#f06', '#f00', '#f72');
  Director.addActor(b);

  let c = new Actor(`BigBlue`, Polygon.makeRegular(30, 1500));
  c.position = new Point(-3000, -3000);
  c.spin = 3;
  c.rotation = 60;
  c.appearance = new Appearance('#03F', '#09f', '#0af');
  Director.addActor(c);

  let d = new Actor(`BigPurple`, Polygon.makeRegular(30, 1000));
  d.position = new Point(200, 6000);
  d.spin = 4;
  d.rotation = 90;
  d.appearance = new Appearance('#b0d', '#f0f', '#f0f');
  Director.addActor(d);

  function runTheTest() {
    if (sensorA.active) part1.rotation += 5;
    if (sensorB.active) part2.rotation -= 5;

    sensorA.active = !sensorA.active;
    sensorB.active = !sensorB.active;
  }
  Director.addCreatorsFunction(runTheTest);

  /*
                  Don't forget to change back to run() at some point...
  */

  Director.run();
  //---
}


function rnd(min, max) {
  return Math.floor(min + Math.random() * (Math.abs(max) - min));
}
