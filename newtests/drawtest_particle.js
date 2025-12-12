import Point from '../point.js';
import Polygon from '../polygon.js';
import Button from '../button.js';
import Actor from '../actor.js';
import Director from '../director.js';
import Part from '../part.js';
import Appearance from '../appearance.js';
import ParticleEffect from '../particleeffect.js';
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
  a.rotation = 0;
  a.appearance = new Appearance('#066', '#06f', '#fff');
  let part1 = new Part('box', 20, 0, Polygon.rectangle(20, 20), 0);
  part1.appearance = new Appearance('#ff0', '#f00', '#fff');
  a.attachPart(part1);
  let part2 = new Part('box', -20, 0, Polygon.rectangle(30, 30), 0);
  part2.appearance = new Appearance('#0f7', '#0ff', '#fff');
  a.attachPart(part2);
  Director.addActor(a);

  let b = new Actor(`B2`, Polygon.triangle(50, 100));
  b.position = new Point(-200, 200);
  b.spin = 2;
  b.rotation = 30;
  b.appearance = new Appearance('#606', '#60f', '#fff');
  Director.addActor(b);

  let c = new Actor(`C3`, Polygon.triangle(50, 100));
  c.position = new Point(200, 200);
  c.spin = 3;
  c.rotation = 60;
  c.appearance = new Appearance('#660', '#6f0', '#fff');
  Director.addActor(c);

  let d = new Actor(`D4`, Polygon.triangle(50, 100));
  d.position = new Point(200, -200);
  d.spin = 4;
  d.rotation = 90;
  d.appearance = new Appearance('#600', '#f00', '#fff');
  Director.addActor(d);
  //Add toggle button function to part test (triangle)

  let particleEffect = new ParticleEffect(
        new Point(0, 0),
        new Point (0,20),
        new Color (15,15,15), 20, 20  //color, size, duration
  );
  Director.addBackgroundEffect (particleEffect);
  
  function doMyThing(delta) { 
    part1.rotation += 1;
    part2.rotation -= 3;
  }
  Director.addCreatorsFunction(doMyThing);
  Director.run();
}

function rnd(min, max) {
  return Math.floor(min + Math.random() * (Math.abs(max) - min));
}
