import Point from '../classes/point.js';
import Polygon from '../classes/polygon.js';
import Actor from '../classes/actor.js';
import Director from '../classes/director.js';
import Appearance from '../classes/appearance.js';
import Color from '../classes/color.js';
import Rnd from '../classes/rnd.js';

document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {
  let square = Polygon.rectangle(50, 50);
  // Create a bunch of actors in a grid with random velocities
  const spacing = 500;
  const startX = -1400, startY = -1400;
  let count = 0;
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      let name = `A${count}`;
      let poly = Polygon.makeRegular(20, Rnd.int(5,50));
      let a = new Actor(name, poly);
      a.position = new Point(startX + i * spacing, startY + j * spacing);
      a.spin = Rnd.int (-10,10);
      a.facing = Rnd.int (360);
      a.appearance = new Appearance(
        Color.random(8).asHex(),
        Color.random(8).asHex(),
        Color.random(8).asHex()
      );
      a.velocity = Point.zero();
      a.bounceCoefficient = Rnd.float (0.5,1);
      a.setLabel(name, new Point(0, 0),a.appearance, 1);
      Director.addActor(a);
      Director.addFieldToActor(a, -a.mass() * 10);
      count++;
    }
  }

  Director.run();
}
