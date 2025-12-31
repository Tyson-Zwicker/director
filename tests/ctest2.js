import Point from '../point.js';
import Polygon from '../polygon.js';
import Button from '../button.js';
import Actor from '../actor.js';
import Director from '../director.js';
import Part from '../part.js';
import Appearance from '../appearance.js';
import Color from '../color.js';
// ----------> PRIME MOVER <-------------
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {

  let square = Polygon.rectangle(50, 50);

  // Create a bunch of actors in a grid with random velocities
  const numActors = 20;
  const spacing = 60;
  const startX = -300, startY = -300;
  let count = 0;
  for (let i = 0; i < 33; i++) {
    for (let j = 0; j < 55; j++) {
      let name = `A${count}`;
      let poly = Polygon.makeRegular(5+ Math.floor(Math.random() * 10), 5 + Math.floor(Math.random() * 10));
      let a = new Actor(name, poly);
      a.position = new Point(startX + i * spacing, startY + j * spacing);
      a.spin = Math.random() * 20 - 10;
      a.facing = Math.random() * 360;
      a.appearance = new Appearance(Color.random(8).asHex(),Color.random(8).asHex(),Color.random(8).asHex());
      // Random velocity

      let angle = Math.random() * Math.PI * 2;
      let speed = 5 + Math.random() * 15;
      a.velocity = new Point(Math.cos(angle) * speed, Math.sin(angle) * speed);
      a.bounceCoefficient = Math.random();
      a.setLabel(name, new Point(0, 0),a.appearance, 1);
      Director.addActor(a);
      count++;
    }
  }
  Director.run();
}
