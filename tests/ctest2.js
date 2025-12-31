import Point from '../classes/point.js';
import Polygon from '../classes/polygon.js';
import Actor from '../classes/actor.js';
import Director from '../classes/director.js';
import Appearance from '../classes/appearance.js';
import Color from '../classes/color.js';
import Rnd from '../classes/rnd.js';
// ----------> PRIME MOVER <-------------
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {

  let square = Polygon.rectangle(50, 50);

  // Create a bunch of actors in a grid with random velocities
  
  const spacing = 50;
  const startX = -300, startY = -300;
  let count = 0;
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      let name = `A${count}`;
      let poly = Polygon.makeRegular(Rnd.int (5,10), Rnd.int (5,10));
      let a = new Actor(name, poly);
      a.position = new Point(startX + i * spacing, startY + j * spacing);
      a.spin = Rnd.int (-10,10);
      a.facing = Rnd.int (360);
      a.appearance = new Appearance(Color.random(8).asHex(),Color.random(8).asHex(),Color.random(8).asHex());
      // Random velocity

      let angle = Rnd.int (360);
      let speed = Rnd.int (5, 20);
      a.velocity = Point.fromPolar (angle,speed);
      a.bounceCoefficient = Rnd.float (0.5,1);
      a.setLabel(name, new Point(0, 0),a.appearance, 1);
      Director.addActor(a);
      count++;
    }
  }
  Director.run();
}
