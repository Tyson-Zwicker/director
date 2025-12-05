import Director from './Director.js';
import Point from './points.js';
import Director from './director.js';
import QuadTree from '.quadtree.js';
import Boundry from 'boundry.js';
export default class Sensor {
  //Direction is a component vector
  //returns "false" or an object with "position" and "distance".
  //angle is its centerline. sweep is degrees to either side of centerline
  //speed is degrees per second
  //strength is used to calc the distance 
  constructor(actor, angle, sweep, speed, distance) {
    this.actor = actor;
    this.angle = angle;
    this.sweep = sweep;
    this.currentAngle = angle;
    this.currentDirection = 1;
    this.speed = speed;
    this.distance = distance;
  }

  sweep(delta) {
    //Get the candidates and go through the list.
    let cx = this.actor.position.x;
    let cy = this.actor.position.y;
    let sensorBoundry = new Boundry(cx - this.distance, cy - this.distance, cx + this.distance, cy + this.distance);
    let foundActors = Director.quadtree.findInBounds(sensorBoundry);

    let results = this.#examineCandidates();

    //move sensors currentAngle, send it back the otherway when it reaches its the edge of its sweep
    this.currentAngle += delta;
    if (this.currentAngle > this.sweep + this.direction) {
      this.currentAngle = this.sweep + this.direction * delta;
      this.direction *= -1;
    }
    return closestActor;
  }
  #examineCandidates(foundActors) {
    let closestDistance = Number.MAX_SAFE_INTEGER;
    let closestActor = undefined;
    for (actor in foundActors) {
      let points = actor.polygon.points;
      for (let i = 0; i < points.length; i++) {
        let barrierPoint1 = undefined;
        let barrierPoint2 = undefined;
        if (i == points.length - 1) {
          //connect last point to first point.
          barrierPoint1 = p[i];
          barrierPoint2 = p[i + 1];
        } else {
          //connect all but last point to next point
          barrierPoint1 = p[i];
          barrierPoint2 = p[0];
        }
        let result = this.#rayCast(this.actor.position, this.direction + this.actor.rotation, barrierPoint1, barrierPoint2);
        if (result && result.distance < closestDistance) {
           result[actor] = actor; //Add this information to the sensor results..
        }
      }
      return result;
    }
    //return the one with the shortest distance.
  }
  #rayCast(originPoint, direction, barrierPoint1, barrierPoint2) {
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
      return {
        position: p,
        distance: d
      };
    }
    return false; //They don't ever hit.
  }
}