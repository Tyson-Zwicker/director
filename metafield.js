import Point from './point.js';
import Rnd from './rnd.js';

/* Acts over everthing (well, actors.. not sure I want to drag particles into this..)
 so the vector says which way everything gets pulled (again pixel =meter, force in newtons, mass in kg..)
 and then there is Variability.  That's mostly to play with stuff like WIND on a small scale map.
 In such an instance Gravity would have vector (0,1) because it always just point down
  with a constant rate of acceleration.. and a variability of ZERO.

Wind would have a vector (0,0) (because wind doesn't cause consant acceleration), but the higher
the variability, the "windier " it will be look.  Add two a give on a + or - x to give it drift.


You can have more than one.  ex. Gravity + wind + maybe some water or something.. 
 */

 export default class MetaField {
  constructor(vector, force, directionVariability, forceVariability, rateOfChange) {
    this.vector = vector;                           //This is generally where it points..
    this.currentVector = this.vector;               // this one varies...
    this.forceVariability = variability;            // 0>variability>1 : chance of changing 
    this.directionVariability = directionVariability;
    if (forceVariability < 0 || forceVariability > 1) throw new Error(`Force Variability must be between 0 and 1 value:${forceVariability}`);
    if (directionVariability < 0 || directionVariability > 1) throw new Error(`Force Variability must be between 0 and 1 value:${forceVariability}`);
    
    this.rateOfChange = rateOfChange;               //how often IN SECONDS it varies.
  }
  enactField(delta) {
    for (actor of Director.actors) {
      if (actor.mass > 0) {
        let acceleration = Point.from(this.currentVector);
        let variantAcceleration = vary(acceleration);
        Point.scale(variantAcceleration, (1/actor.mass));
        Point.scale(variantAcceleration, delta);
        Point.add(actor.velocity, acceleration);
      }
    }
    if (variability > 0) vary();
  }
  vary(delta) {
    //YOU ARE HERE
  }
}