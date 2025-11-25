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

  let star = new Actor('Star', Polygon.makeRegular(40, 1000), new Appearance('#FFA', '#FFF', "Star", 3));
  star.bounceCoefficient =0.1;
  Director.addActor(star);
  Director.addFieldToActor(star, star.mass() * - 1);

  let planet = new Actor('Planet', Polygon.makeRegular(12, 10), new Appearance('#F90', '#FF0', 3));
  planet.position = new Point(1800, 0);
  planet.velocity = new Point(0,260);
  planet.bounceCoefficient = 0.1;
  Director.addActor(planet);
  Director.addFieldToActor(planet, planet.mass()*-1);

  let planet3 = new Actor('Planet3', Polygon.makeRegular(16, 30), new Appearance('#090', '#69F', 3));
  planet3.position = new Point(2300, 0);
  planet3.velocity = new Point(0,42);
  planet3.bounceCoefficient = 0.1;
  Director.addActor(planet3);
  Director.addFieldToActor(planet3, planet3.mass()*-1);
  Director.run();

  let planet2 = new Actor('Planet2', Polygon.makeRegular(20, 50), new Appearance('rgba(93, 44, 61, 1)', '#FFF', 3));
  planet2.position = new Point(2800, 0);
  planet2.velocity = new Point(0,21);
  planet2.bounceCoefficient = 0.1;
  Director.addActor(planet2);
  Director.addFieldToActor(planet2, planet2.mass()*-1);
  Director.run();
}

