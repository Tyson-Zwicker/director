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

  let poly = Polygon.makeRegular(11, 20);
  let a = new Actor("1", poly);
  a.position = new Point(-100, 0);
  a.spin = Math.random() * 20 - 10;
  a.facing = Math.random() * 360;
  a.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  a.velocity = new Point(1, 0);
  a.bounceCoefficient = 0.5;
  a.setLabel("1", new Point(0, 30), a.appearance, 1);
  Director.addActor(a);

  let b = new Actor("2", poly);
  b.position = new Point(100, 0);
  b.spin = Math.random() * 20 - 10;
  b.facing = Math.random() * 360;
  b.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  b.velocity = new Point(-1, 0);
  a.bounceCoefficient = 0.5;
  a.setLabel("2", new Point(0, 30), a.appearance, 1);
  Director.addActor(b);

  Director.run();
}
