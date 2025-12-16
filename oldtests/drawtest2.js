
import Point from '../point.js';
import Polygon from '../polygon.js';
import Button from '../button.js';
import Actor from '../actor.js';
import Director from '../director.js';
import Part from '../part.js';
import Appearance from '../appearance.js';
import LineEffect from '../lineeffect.js';
import Color from '../color.js';

// PRIME MOVER
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {
  let rng = 100;
  for (let i = 0; i < 10; i++) {
    let s1 = rnd(10, 100);
    let poly = Polygon.makeIrregular(rnd(7, 15), s1, s1 * 1.5);
    let actor = new Actor(`testobject${i}`, poly);
    actor.position = new Point(rnd(-rng, rng), rnd(-rng, rng));
    actor.spin = 2 * rnd(-10, 10);

    let appearance = new Appearance('#420', '#660', '#fff');
    let hoveredAppearance = new Appearance('#ff0', '#f00');
    let pressedAppearance = new Appearance('#0ff', '#00f');
    let button = new Button(hoveredAppearance, pressedAppearance);
    button.clickFn = function () {
      let newlabel = `${this.actor.name} (${this.actor.position.x},${this.actor.position.y})`;
      this.actor.setLabel(newlabel, new Point(0, 0), appearance, 1);
      this.actor.velocity = new Point(rnd(-10, 10), rnd(-10, 10));
      this.actor.spin = rnd(-10, 10);
    }
    actor.appearance = appearance;
    actor.attachButton(button);
    actor.setLabel(i.toString(), new Point(0, 50),appearance,1);
    Director.addActor(actor);
  }
  let a = new Actor(`A1`, Polygon.triangle(50, 100));
  a.position = new Point(-200, -200);
  a.spin = 10;
  a.rotation = 0;
  a.appearance = new Appearance('#066', '#06f', '#fff');
  let part1 = new Part('box', 20, 0, Polygon.rectangle(20, 20), 0,a);
  part1.appearance = new Appearance('#ff0', '#f00', '#fff');
  a.attachPart(part1);
  let part2 = new Part('box', -20, 0, Polygon.rectangle(30, 30), 0,a);
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

  let count = 0;
  function doMyThing(delta) {
    count++;
    part1.rotation += 1;
    part2.rotation -= 3;
    let spread = 400;
    if (count === 100) {
      let lineEffect = new LineEffect(
        new Point(
          -spread / 2 + Math.random() * spread,
          -spread / 2 + Math.random() * spread
        ),
        new Point (
          spread / 2 + Math.random() * spread,
          spread / 2 + Math.random() * spread
        ),
        4, new Color(15, 0, 15), Math.random()*10
      );
      count =0;
      Director.addBackgroundEffect(lineEffect);
      lineEffect = new LineEffect(
        new Point(
          -spread / 2 + Math.random() * spread,
          -spread / 2 + Math.random() * spread
        ),
        new Point (
          spread / 2 + Math.random() * spread,
          spread / 2 + Math.random() * spread
        ),
        4, new Color(15, 15, 0), Math.random()*10
      );
      count =0;
      Director.addForegroundEffect(lineEffect);
    }
  }
  Director.addCreatorsFunction(doMyThing);



  Director.run();
}


function rnd(min, max) {
  return Math.floor(min + Math.random() * (Math.abs(max) - min));
}
