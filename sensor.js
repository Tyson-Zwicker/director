import Point from './point.js';
import Director from './director.js';
import Boundry from './boundry.js';
import Actor from './actor.js';
import LineEffect from './lineeffect.js';
import Color from './color.js';
import SensorResponse from './sensorresponse.js';
import Transpose from './transpose.js';
export default class Sensor {
  //Points reflect World Coordinates.
  //Direction is a component vector
  //returns "false" or an object with "position" and "distance".
  //centerAngle is the degree of offset the sensor has from the centerline of the actor.
  //fieldOfView is # of degrees the sensor can swivel through to either side of the centerAngle.
  //speed is degrees per second
  //currentDirection is either + or -1 depending on which way the sensor is sweeping
  //currentAngle is a between -fieldOfView and +fieldOfView.  It is added as an offset to "angle"
  //***YOU MUST ATTACH THIS TO AN ACTOR USING [actor.attachSensor ()] OR IT WON'T WORK.
  constructor(name, centerAngle, fieldOfView, speed, range, active) {
    if (typeof active != 'boolean') throw new Error(`active must true or false ${active}`);
    if (typeof centerAngle !== 'number' || centerAngle < 0 || centerAngle > 359) throw new Error(`Sensor.constructor: Invalid centerAngle [${centerAngle}]`)
    if (typeof range !== 'number' || range < 1) throw new Error(`distance must be  >=1 [${range}]`);
    if (typeof fieldOfView !== 'number' || fieldOfView < 0 || fieldOfView > 359) throw new Error(`Sensor.constructor: Invalid fieldOfView [${fieldOfView}]`);
    if (typeof speed !== 'number' || speed < 0 || speed > fieldOfView / 2) throw new Error(`speed must be less than speed and >0 [${speed}]`);
    this.active = active;
    this.actor = undefined; //Assigned when attached to an actor.
    this.centerAngle = centerAngle; //Defined as 0 if forward, -90 if port, +90 starboard, 180 to aft, etc.
    this.currentDirection = 1;
    this.currentOffset = 0; //varies from -fieldOfView to +fieldOfView.
    this.range = range;
    this.fieldOfView = fieldOfView;
    this.name = name;
    this.speed = speed;
  }

  sweep(delta) {
    if (!this.actor || !(this.actor instanceof Actor)) throw new Error(`Sensor.sweep: No actor attached[ ${this.actor}]`);
    //Get the candidates and go through the list.
    let cx = this.actor.position.x;
    let cy = this.actor.position.y;
    let sensorBoundry = new Boundry(cx - this.range, cy - this.range, cx + this.range, cy + this.range);
    let foundActors = Director.quadtree.findInRange(sensorBoundry);

    //console.log(foundActors);

    let results = this.#examineCandidates(foundActors);
    this.#moveSensor(delta);
    let worldAngle = this.actor.facing + this.centerAngle + this.currentOffset;
    let p2 = Point.fromPolar(worldAngle, this.range);
    Point.add (p2, this.actor.position); //<--- CHANGE
    this.#drawAttempt(this.actor.position, p2);
    if (results.locationOfResponse !== undefined) {          //We're drawing the "bounce back" so if nothing is seen, nothing gets drawn.
      console.log(results.locationOfResponse);
      this.#draw(results.locationOfResponse)
    }
    return results;
  }
  #moveSensor(delta) {
    //move sensors currentAngle. (relative angle from -fieldOfView<->+fieldOFView)
    this.currentOffset += delta * this.speed * this.currentDirection;
    //send it back the otherway when it reaches its the edge of its sweep
    if (this.currentOffset > this.fieldOfView) {
      this.currentOffset = this.fieldOfView;
      this.currentDirection = -1;
    }
    if (this.currentOffset < -this.fieldOfView) {
      this.currentOffset = -this.fieldOfView;
      this.currentDirection = 1;
    }
  }
  #draw(closestPoint) {
    //only happens if a sensor returns a "blip"
    let sensorRay = new LineEffect(this.actor.position, closestPoint, 2, new Color(0, 15, 0, 1), 2);
    Director.addForegroundEffect(sensorRay);
  }
  #drawAttempt(p1, p2) {
    let sensorRay = new LineEffect(p1, p2, 1, new Color(15, 0, 0,0.2), 2)
    Director.addBackgroundEffect(sensorRay);
  }
  #examineCandidates(foundActors) {
    let worldAngle = this.actor.facing + this.centerAngle + this.currentOffset;
    let response = new SensorResponse(
      Director.lastFrameTime,
      this,
      this.actor,
      Point.from(this.actor.position),
      worldAngle,
      this.actor.facing,
      this.currentOffset
    );
    for (let actor of foundActors) {
      let points = actor.polygon.points;
      for (let i = 0; i < points.length; i++) {
        let barrierPoint1 = undefined;        //These represent the two ends of a line segment
        let barrierPoint2 = undefined;        //formed by the face of the actor's polygon.
        if (i === points.length - 1) {
          //connect last point to first point.
          barrierPoint1 = Point.from(points[i]);
          barrierPoint2 = Point.from(points[0]);
        } else {
          //connect all but last point to next point
          barrierPoint1 = Point.from(points[i]);
          barrierPoint2 = Point.from(points[i + 1]);
        }
        //The barrier points are in LocalCoordinates (the center of the polygon is 0,0)
        //They need to be transformed to World Coordinates.

        let worldPoint1 = Transpose.pointToWorld(barrierPoint1,actor);
        let worldPoint2 = Transpose.pointToWorld(barrierPoint2,actor);

        let result = this.#rayCast(Point.from(this.actor.position), worldAngle, this.range, Point.from(worldPoint1), Point.from(worldPoint2));
        if (result !== false && result.distance < response.distance && result.distance < this.range) {
          console.log(result);
          response.setResponse(result.point, result.distance, actor);
        }
      }
    }
    return response;
  }
  #rayCast2(originPoint, direction, range, barrierPoint1, barrierPoint2) {
    //Where the math came from:
    //https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282

    let p = originPoint;
    let r = Point.fromPolar(direction, range);
    let q = barrierPoint1;
    let s = barrierPoint2;
    Point.sub(s, barrierPoint1);

    //REMEMBER: ORDER OF CROSSING IS IMPORTANT,
    //AND IN 2D YIELDS A SCALAR VALUE (SIGNED AREA OF PARALLELAGRAM DRAWN BY INTERSECTION..)

    //t = (q-p) cross s/(r cross s)
    let qp = Point.from(q);
    qp = Point.sub(qp, p);
    let tnum = Point.cross(qp, s);
    let tden = Point.cross(r, s);
    //u = (p-q) cross r/ (s croos r)
    let pq = Point.from(p);
    Point.sub(pq, q);
    let unum = Point.cross(qp, r);
    let uden = Point.cross(s, r);
    let u = unum / uden;

    //TODO: 4 cases
    // Collinear  if (r x s) = 0 and (q-p) x r =0

    //Parallel, non intersecting (r x s) = 0 and (qip) x r !=0

    //Intersection!  r x s !=0 and 0<t<1 and 0<u<1 
    //Point of intersection is p + tr OR q + us, either works.

    //Otherwise they don't intersect.

  }
  #rayCast(originPoint, direction, range, barrierPoint1, barrierPoint2) {
    //Math courtesy of  Prof. Daniel Shiffman
    //https://www.youtube.com/@TheCodingTrain
    
    const x1 = barrierPoint1.x;
    const y1 = barrierPoint1.y;
    const x2 = barrierPoint2.x;
    const y2 = barrierPoint2.y;

    const x3 = originPoint.x;
    const y3 = originPoint.y;
    const directionComponents = Point.fromPolar(direction, range);
    const x4 = x3 + directionComponents.x * this.range;
    const y4 = y3 + directionComponents.y * this.range;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return false;  //They are parallel 
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0 && u < 1) {
      let x = x1 + t * (x2 - x1)
      let y = y1 + t * (y2 - y1);
      const p = new Point(x, y);
      const d = Point.distance(originPoint, p);
      return {
        point: p,
        distance: d
      };
    }
    return false; //They don't ever hit.
  }
}