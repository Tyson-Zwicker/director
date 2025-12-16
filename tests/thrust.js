import Point from '../point.js';
import Polygon from '../polygon.js';
import Button from '../button.js';
import Keyboard from '../keyboard.js';
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

   let rng = 10000;
    for (let i = 0; i < 1000; i++) {
      let s1 = rnd(10, 100);
      let poly = Polygon.makeIrregular(rnd(7, 15), s1, s1 * 1.5);
      let a = new Actor(
        `testobject${i}`,
         poly,
          new Appearance('#420', '#660', '#fff')
      );
      a.position = new Point(rnd(-rng, rng), rnd(-rng, rng));
      a.spin = 2 * rnd(-10, 10);
      let hoveredAppearance = new Appearance('#ff0', '#f00');
      let pressedAppearance = new Appearance('#0ff', '#00f');
      let button = new Button(hoveredAppearance, pressedAppearance);
      button.clickFn = function () {
        let newlabel = `${this.actor.name} (${this.actor.position.x},${this.actor.position.y})`;
        this.actor.setLabel(newlabel, new Point(0, 0), 1);
        this.actor.velocity = new Point(rnd(-50, 50), rnd(-50, 50));
        this.actor.spin = rnd(-10, 10);
        }
      a.attachButton(button);
      a.setLabel(i.toString(), new Point(0, 50),a.appearance, 1);
      Director.addActor(a);
    }
    let a = new Actor(`A1`, Polygon.triangle(50, 100),new Appearance('#066', '#06f', '#fff'));
    a.position = new Point(-200, -200);
    a.spin = 10;
    a.facing = 0;
    let part1 = new Part('box', 20, -10, Polygon.rectangle(3, 7), 0,a);
    part1.appearance = new Appearance('#ff0', '#f00', '#fff');
    a.attachPart(part1);
    let part2 = new Part('box', 20, 10, Polygon.rectangle(3, 7), 0,a);
    part2.appearance = new Appearance('#ff0', '#f00', '#fff');
    a.attachPart(part2);
    Director.addActor(a);
  
    let b = new Actor(`B2`, Polygon.triangle(50, 100),new Appearance('#606', '#60f', '#fff'));
    b.position = new Point(-200, 200);
    b.spin = 10;
    b.facing = 30;
    Director.addActor(b);
  
    let c = new Actor(`C3`, Polygon.triangle(50, 100),new Appearance('#660', '#6f0', '#fff'));
    c.position = new Point(200, 200);
    c.spin = 3;
    c.facing = 60;  
    Director.addActor(c);
  
    let d = new Actor(`D4`, Polygon.triangle(50, 100),new Appearance('#600', '#f00', '#fff'));
    d.position = new Point(200, -200);
    d.spin = 4;
    d.facing = 90;
    Director.addActor(d);

  let redParticles = new ParticleGenerator(
    'red',
    new Point(0, 0),
    170, 190, 150, 250,
    new Color(15, 0, 0),
    2,
    5, 20,
    5, true
  );
  Director.addParticleGenerator(redParticles);
  part1.attachParticleGenerator(redParticles);
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
  part2.attachParticleGenerator(greenParticles);
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
 
  // Get the actor we want to control (A1)
  let controlledActor = Director.actors.get('A1');
  
  // W key - increase velocity
  Director.keyboard.setKeyFunction('w', () => {
    if (controlledActor) {
      let thrustMagnitude = 300; // Adjust this for more/less thrust
      let thrustVector = Point.fromPolar(controlledActor.facing, thrustMagnitude);
      controlledActor.velocity.x += thrustVector.x / 60; // Divide by 60 to normalize per frame
      controlledActor.velocity.y += thrustVector.y / 60;
    }
  });
  
  // A key - rotate left (steer)
  Director.keyboard.setKeyFunction('a', () => {
    if (controlledActor) {
      controlledActor.spin -= 5; // Rotate 5 degrees left
    }
  });
  
  // S key - decrease velocity (reverse/brake)
  Director.keyboard.setKeyFunction('s', () => {
    if (controlledActor) {
      let brakeMagnitude = 150;
      let brakeVector = Point.fromPolar(controlledActor.facing + 180, brakeMagnitude);
      controlledActor.velocity.x += brakeVector.x / 60;
      controlledActor.velocity.y += brakeVector.y / 60;
    }
  });
  
  // D key - rotate right (steer)
  Director.keyboard.setKeyFunction('d', () => {
    if (controlledActor) {
      controlledActor.spin += 5; // Rotate 5 degrees right
    }
  });
  
  function doMyThing(delta) {
    part1.facing += 4;
    part2.facing -= 4;
  }
  Director.addCreatorsFunction(doMyThing);
  Director.run();
}
function rnd(min, max) {
  return Math.floor(min + (max - min) * Math.random());
}