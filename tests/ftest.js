import Point from '../point.js';
import Polygon from '../polygon.js';
import Button from '../button.js';
import Actor from '../actor.js';
import Director from '../director.js';
import Part from '../part.js';
import Appearance from '../appearance.js';

// ----------> PRIME MOVER <-------------
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {

  let square = Polygon.rectangle(50, 50);

  // Create a bunch of actors in a grid with random velocities

  const spacing = 200;
  const startX = -400, startY = -400;
  let count = 0;
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      let name = `A${count}`;
      let poly = Polygon.makeRegular(20, 5 + Math.floor(Math.random() * 50));
      let a = new Actor(name, poly);
      a.position = new Point(startX + i * spacing, startY + j * spacing);
      a.spin = Math.random() * 20 - 10;
      a.rotation = Math.random() * 360;
      a.appearance = new Appearance(
        `hsl(${Math.floor(Math.random() * 360)},80%,40%)`,
        `hsl(${Math.floor(Math.random() * 360)},80%,60%)`,
        "#fff"
      );
      let angle = Math.random() * Math.PI * 2;
      let speed = 0// + Math.random() * 15;
      a.velocity = Point.zero();
      a.bounceCoefficient = Math.ceil(1, Math.random()*2);
      a.setLabel(name, new Point(0, 0), 1);
      Director.addActor(a);
      Director.addFieldToActor(a, -a.mass() * 10);
      count++;
    }
  }

  Director.run();
}
