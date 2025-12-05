import Director from './Director.js';
import Point from './points.js';
import LineEffect from './lineeffects.js';

export default class Sensor {
  //Direction is a component vector
  //returns "false" or an object with "position" and "distance".
  constructor (actor, angle1, angle2, speed, strength){
    this.actor = actor;
    this.angle1 = angle1;
    this.angle2 = angle2;
    this.angleCurrent = undefined;
    this.speed = speed;
    this.strength = strength;
  }
  //Use the quad tree to get a list of potential
  //sensor candidates.
  /// MOVE THIS TO Actor so it doesn't recalc this list
  //more than it needs to.  When an actor gets a new
  //sensor it should update a maxPossible range (or whatever)

  getCandidates (){

  }
  sweep (delta){
    if (angle ===undefined){
      //figure out an angle set in the middle of and keep
      //in mind angles are modal, integers, etc.. keep it
      //within 360..
    }
    //move angle by delta, between angle1 and angle2
    //Get the candidates and go through the list.
    //return the one with the shortest distance.

  }
  static canSee(originPoint, direction, barrierPoint1, barrierPoint2, addLineEffect) {
    const x1 = barrierPoint1.x;
    const y1 = barrierPoint1.y;
    const x2 = barrierPoint2.x;
    const y2 = barrierPoint2.y;

    const x3 = originPoint.x;
    const y3 = originPoint.y;
    const x4 = x3 + direction.x;
    const y4 = y3 + direction.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return false;  //They are parallel 
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const p = new Point(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
      const d = Point.distance(originPoint, p);
      if (addLineEffect) {
        Director.addForegroundEffect(
          originPoint,
          p,
          1,
          new Color(15, 15, 15),
          0.5
        );
      }
      return {
        position: p,
        distance: d
      };
    };
    return false; //They don't ever hit.
  }
}