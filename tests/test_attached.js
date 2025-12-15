import Point from '../point.js';
import Polygon from '../polygon.js';
import Button from '../button.js';
import Actor from '../actor.js';
import Director from '../director.js';
import Part from '../part.js';
import Appearance from '../appearance.js';
import ParticleEffect from '../particleeffect.js';
import ParticleGenerator from '../particlegenerator.js';
import Color from '../color.js';

// PRIME MOVER
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {

  let a = new Actor(`A1`, Polygon.triangle(50, 100));
  a.position = new Point(-200, -200);
  a.spin = 10;
  a.facing = 0;
  a.appearance = new Appearance('#066', '#06f', '#fff');
  let part1 = new Part('box', 20, 0, Polygon.rectangle(20, 20), 0,a );
  part1.appearance = new Appearance('#ff0', '#f00', '#fff');
  a.attachPart(part1);
  let part2 = new Part('box', -20, 0, Polygon.rectangle(30, 30), 0, a);
  part2.appearance = new Appearance('#0f7', '#0ff', '#fff');
  a.attachPart(part2);
  Director.addActor(a);

  let b = new Actor(`B2`, Polygon.triangle(50, 100));
  b.position = new Point(-200, 200);
  b.spin = 2;
  b.facing = 30;
  b.appearance = new Appearance('#606', '#60f', '#fff');
  Director.addActor(b);

  let c = new Actor(`C3`, Polygon.triangle(50, 100));
  c.position = new Point(200, 200);
  c.spin = 3;
  c.facing = 60;
  c.appearance = new Appearance('#660', '#6f0', '#fff');
  Director.addActor(c);

  let d = new Actor(`D4`, Polygon.triangle(50, 100));
  d.position = new Point(200, -200);
  d.spin = 4;
  d.facing = 90;
  d.appearance = new Appearance('#600', '#f00', '#fff');
  Director.addActor(d);

  let redParticles = new ParticleGenerator(
    'red',
    new Point(0, 0),
    170, 190, 50, 150,
    new Color(15, 0, 0),
    2,
    5, 20,
    5, true
  );
  Director.addParticleGenerator(redParticles);
  part1.attachParticleGenerator (redParticles);
  let blueParticles = new ParticleGenerator(
    'blue',
    new Point(0, 0),
    90, 270, 50, 150,
    new Color(0, 0, 15),
    2,
    5, 20,
    2, true
  );
  Director.addParticleGenerator(blueParticles);
  let greenParticles = new ParticleGenerator(
    'green',
    new Point(0, 0),
    -10, 10, 50, 150,
    new Color(0, 15, 0),
    2,
    5, 20,
    10, true
  );
  Director.addParticleGenerator(greenParticles);
  part2.attachParticleGenerator (greenParticles);
  let cyanParticles = new ParticleGenerator(
    'cyan',
    new Point(0, 0),
    0, 355, 60, 150,
    new Color(0, 10, 15),
    2,
    5, 20,
    10, true
  );
  Director.addParticleGenerator(cyanParticles);
  function doMyThing(delta) {
    part1.facing += 1;
    part2.facing -= 3;
  }
  Director.addCreatorsFunction(doMyThing);
  Director.run();
}
function rnd(min, max) {
  return Math.floor(min + (max - min) * Math.random());
}