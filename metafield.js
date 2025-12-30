import Point from './point.js';

export default class MetaField {
  constructor(vector, force, variability, rateOfChange) {
    this.vector = vector;              //This is generally where it points..
    this.currentVector = this.vector;  // this one varies...
    this.force = force;
    this.variability = variability;     // 0>variability>1 : chance of changing 
    this.rateOfChange = rateOfChange;   //how often IN SECONDS it varies.
  }
  enactField(delta) {
    for (actor of Director.actors) {
      if (actor.mass > 0) {
        let acceleration = Point.from(this.vector);
        Point.scale(acceleration, (this.force / actor.mass) * delta);
        Point.add (actor.velocity, acceleration);
      }
    }
    if (variability>0) vary();
  }
  vary (delta){
    
  }
}