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



  //Try to make them orbit.

  let star = new Actor('Star', Polygon.makeRegular(40, 500), new Appearance('#FFA', '#FFF', "Star", 3));
  star.BounceCoefficient =0;
  Director.addActor(star);
  Director.addFieldToActor(star, star.mass() * - 1);

  let planet = new Actor('Planet', Polygon.makeRegular(12, 10), new Appearance('#090', '#69F', 3));
  planet.position = new Point(800, 0);
  planet.velocity = new Point(0,102);
  planet.bounceCoefficient = 0;
  Director.addActor(planet);
  Director.addFieldToActor(planet, planet.mass() *  -1)


  Director.run();
}

