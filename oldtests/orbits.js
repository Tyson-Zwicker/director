import Point from '../classes/point.js';
import Polygon from '../classes/polygon.js';
import Button from '../classes/button.js';
import Actor from '../classes/actor.js';
import Director from '../classes/director.js';
import Part from '../classes/part.js';
import Appearance from '../classes/appearance.js';
// ----------> PRIME MOVER <-------------
document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  init();
});

export default function init() {



  //Try to make them orbit.

  let star = new Actor('Star', Polygon.makeRegular(40, 1100), new Appearance('#FFA', '#FFF', "#FFF",3));
  star.bounceCoefficient =0.1;
  Director.addActor(star);
  Director.addFieldToActor(star, star.mass() * - 250);

  let planet = new Actor('Planet', Polygon.makeRegular(12, 10), new Appearance('#F90', '#FF0', "#FFF", 3));
  planet.position = new Point(1800, 0);
  planet.velocity = new Point(0,290);
  planet.bounceCoefficient = 0.1;
  Director.addActor(planet);
  Director.addFieldToActor(planet, planet.mass()*-1);

  let planet3 = new Actor('Planet2', Polygon.makeRegular(16, 30), new Appearance('#090', '#69F', "#FFF", 3));
  planet3.position = new Point(2300, 0);
  planet3.velocity = new Point(0,90);
  planet3.bounceCoefficient = 0.1;
  Director.addActor(planet3);
  Director.addFieldToActor(planet3, planet3.mass()*-1);

  let planet2 = new Actor('Planet3', Polygon.makeRegular(20, 150), new Appearance('#f42', '#0F6', '#FFF', 3));
  planet2.position = new Point(2800, 0);
  planet2.velocity = new Point(0,24);
  planet2.bounceCoefficient = 0.1;
  Director.addActor(planet2);
  Director.addFieldToActor(planet2, planet2.mass()*-1);
  Director.run();
}

