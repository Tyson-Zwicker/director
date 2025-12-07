import Point from './point.js';
import Director from './director.js';
import Boundry from './boundry.js';
import Actor from './actor.js';
export default class Sensor {
  //Points reflect World Coordinates.
  //Direction is a component vector
  //returns "false" or an object with "position" and "distance".
  //centerAngle is the degree of offset the sensor has from the centerline of the actor.
  //sweep is # of degrees the sensor can swivel through toeither side of the centerAngle.
  //speed is degrees per second
  //currentDirection is either + or -1 depending on which way the sensor is sweepingn
  //currentAngle is a between -sweep and +sweep.  It is added as an offset to "angle"
  //***YOU MUST ATTACH THIS TO AN ACTOR USING [actor.attachSensor ()] OR IT WON'T WORK.
  constructor(name, centerAngle, fieldOfView, speed, distance, active) {
    if (typeof centerAngle!=='number' || centerAngle < 0 || centerAngle > 359) throw new Error(`Sensor.constructor: Invalid centerAngle [${centerAngle}]`)
    if (typeof fieldOfView!=='number' || fieldOfView < 0 || fieldOfView > 359) throw new Error(`Sensor.constructor: Invalid fieldOfView [${fieldOfView}]`);
    if (typeof speed!=='number' || speed<0 || speed>fieldOfView/2) throw new Error (`speed must be less than sweep and >0 [${speed}]`);
    if (typeof distance!=='number' || distance<1) throw new Error (`distance must be  >=1 [${distance}]`);
    if (typeof active!='boolean') throw new Error (`active must true or false ${active}`);
    
    this.name = name;
    this.centerAngle = centerAngle; //Defined as 0 if forward, -90 if port, +90 starboard, 180 to aft, etc.
    this.fieldOfView = fieldOfView;
    this.speed = speed;
    this.distance = distance;
    this.active = active;
    this.currentOffset = 0; //varies from -sweep to +sweep.
    this.currentDirection = 1;
  }

  sweep(delta) {
    if (!this.actor || !(this.actor instanceof Actor)) throw new Error(`Sensor.sweep: No actor attached[ ${this.actor}]`);
    //Get the candidates and go through the list.
    let cx = this.actor.position.x;
    let cy = this.actor.position.y;
    let sensorBoundry = new Boundry(cx - this.distance, cy - this.distance, cx + this.distance, cy + this.distance);
    let foundActors = Director.quadtree.findInRange(sensorBoundry);
    let results = this.#examineCandidates(foundActors);
    this.#moveSensor(delta);
    return results;
  }
  #moveSensor(delta) {
    //move sensors currentAngle. (relative angle from -sweep<->+sweep)
    this.currentOffset += delta * this.speed * this.currentDirection;
    //send it back the otherway when it reaches its the edge of its sweep
    if (this.currentOffset > this.sweep) {
      this.currentOffset = this.sweep;
      this.currentDirection *= -1;
    }
    if (this.currentOffset < -this.sweep) {
      this.currentOffset = -this.sweep;
      this.currentDirection *= -1;
    }
  }
  #examineCandidates(foundActors) {
    let closestDistance = Number.MAX_SAFE_INTEGER;
    let closestPoint = undefined;
    let closestActor = undefined;
    for (let actor of foundActors) {
      let points = actor.polygon.points;
      for (let i = 0; i < points.length; i++) {
        let barrierPoint1 = undefined;
        let barrierPoint2 = undefined;
        if (i === points.length - 1) {
          //connect last point to first point.
          barrierPoint1 = points[i];
          barrierPoint2 = points[0];
        } else {
          //connect all but last point to next point
          barrierPoint1 = points[i];
          barrierPoint2 = points[i + 1];
        }
        let worldAngle = this.actor.rotation + this.centerAngle + this.currentOffset
        let result = this.#rayCast(this.actor.position, worldAngle, barrierPoint1, barrierPoint2);
        if (result && result.distance < closestDistance) {
          closestDistance = result.distance;
          closestPoint = result.point;
          closestActor = actor;
        }
      }
    }
    //return the one with the shortest distance.
    return {
      closestPoint: closestPoint,
      closestDistance: closestDistance,
      closestActor: closestActor
    };
  }
  #rayCast(originPoint, direction, barrierPoint1, barrierPoint2) {
    const x1 = barrierPoint1.x;
    const y1 = barrierPoint1.y;
    const x2 = barrierPoint2.x;
    const y2 = barrierPoint2.y;

    const x3 = originPoint.x;
    const y3 = originPoint.y;
    const directionComponents = Point.fromPolar(direction, 1);
    const x4 = x3 + directionComponents.x;
    const y4 = y3 + directionComponents.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return false;  //They are parallel 
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const p = new Point(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
      const d = Point.distance(originPoint, p);
      return {
        point: p,
        distance: d
      };
    }
    return false; //They don't ever hit.
  }
}