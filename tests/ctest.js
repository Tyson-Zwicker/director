import Point from '../classes/point.js';
import Polygon from '../classes/polygon.js';
import Actor from '../classes/actor.js';
import Director from '../classes/director.js';
import Appearance from '../classes/appearance.js';
import Color from '../classes/color.js';
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
  a.velocity = new Point(5, 0);
  a.bounceCoefficient = 0.5;
  a.setLabel("1", new Point(0, 30), a.appearance, 1);
  Director.addActor(a);

  let b = new Actor("2", poly);
  b.position = new Point(100, 0);
  b.spin = Math.random() * 20 - 10;
  b.facing = Math.random() * 360;
  b.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  b.velocity = new Point(-5, 0);
  a.bounceCoefficient = 0.5;
  a.setLabel("2", new Point(0, 30), b.appearance, 1);
  Director.addActor(b);

  poly = Polygon.makeRegular(11, 20);
  let c = new Actor("3", poly);
  c.position = new Point(0, -200);
  c.spin = Math.random() * 20 - 10;
  c.facing = Math.random() * 360;
  c.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  c.velocity = new Point(0, 7);
  c.bounceCoefficient = 0.5;
  c.setLabel("3", new Point(0, 30), c.appearance, 1);
  Director.addActor(c);

  let d = new Actor("4", poly);
  d.position = new Point(0, -100);
  d.spin = Math.random() * 20 - 10;
  d.facing = Math.random() * 360;
  d.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  d.velocity = new Point(0, -7);
  d.bounceCoefficient = 0.9;
  d.setLabel("4", new Point(0, 30), d.appearance, 1);
  Director.addActor(d);

  poly = Polygon.makeRegular(11, 20);
  let e = new Actor("5", poly);
  e.position = new Point(200, 200);
  e.spin = Math.random() * 20 - 10;
  e.facing = Math.random() * 360;
  e.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  e.velocity = new Point(3, 3);
  e.bounceCoefficient = 0.5;
  e.setLabel("5", new Point(0, 30), c.appearance, 1);
  Director.addActor(e);

  poly = Polygon.makeRegular(11, 20);
  let f = new Actor("6", poly);
  f.position = new Point(300, 300);
  f.spin = Math.random() * 20 - 10;
  f.facing = Math.random() * 360;
  f.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  f.velocity = new Point(-3, -3);
  f.bounceCoefficient = 0.5;
  f.setLabel("6", new Point(0, 30), d.appearance, 1);
  Director.addActor(f);

  poly = Polygon.makeRegular(11, 20);
  let g = new Actor("7", poly);
  g.position = new Point(-200, 200);
  g.spin = Math.random() * 20 - 10;
  g.facing = Math.random() * 360;
  g.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  g.velocity = new Point(-3, 3);
  g.bounceCoefficient = 0.5;
  g.setLabel("7", new Point(0, 30), c.appearance, 1);
  Director.addActor(g);

  let h = new Actor("8", poly);
  h.position = new Point(-300, 300);
  h.spin = Math.random() * 20 - 10;
  h.facing = Math.random() * 360;
  h.appearance = new Appearance(Color.random(8).asHex(), Color.random(8).asHex(), Color.random(8).asHex());
  h.velocity = new Point(3, -3);
  h.bounceCoefficient = 0.5;
  h.setLabel("8", new Point(0, 30), d.appearance, 1);
  Director.addActor(h);

  Director.run();
}
