import Line from './lines.js';
import Boundry from './boundry.js';
import Point from './Point.js';
class Sensor {
  constructor(owner, range, sweepArc, facing, sweepSpeed) {
    this.sweepArc = sweepArc;
    this.facing = facing;
    this.halfArc = sweepArc / 2; //to avoid dividing by 2 a lot..
    this.range = range;
    this.sweepDirectionOfRotation = 1; //either 1 or -1 (sweeping between the two angles back and forth..)
    this.sweepAngle = sweepArc / 2; //This is the direction the beam is look now. (always between -halfSweepArc and +halfSweepArc)
    this.sweepSpeed = sweepSpeed; //How many degrees per sweep motoin the beam angle changes..
    this.owner = owner;
  }
  detect() {
    let trueFacing = this.owner.facing + this.facing + this.sweepAngle;
    let rayEndPoint = Point.fromPolar(trueFacing, this.range);
    Point.add(rayEndPoint, this.owner.position)
    let rayLine = new Line(this.owner.position, rayEndPoint, 2);
    let candidates = this.#getSortedObjectsWithinRange(rayEndPoint);
    for (let candidate of candidates) {
      if (this.#canSee(rayLine, rayLine.p1, 2)) {
        this.#drawPingReturned(candidate);
        return candidate; //don't look past the first one you see, because anything else will be blocked.        
      }
      this.#drawPingToEdge(rayEndPoint);
    }
    (this.#sweep());
  }
  #canSee(rayLine) {
    let tangentLine = Line.getPerpendicular(rayLine, rayLine.p1, 2);
    return Line.getPointOfInterception(rayLine, tangentLine);
  }
  #drawPingReturned(trueFacing, candidate) {
    let rayPoint = Point.fromPolar(trueFacing, candidate.distance)
    let ray = new LineEffect(this.owner.position, closestPoint, 2, new Color(0, 15, 0, 1), 2);
    Director.addForegroundEffect(ray);
  }
  #drawPingToEdge(rayEndPoint) {
    let ray = new LineEffect(this.owner.position, rayEndPoint, 2, new Color(7, 7, 7, 1), 2);
    Director.addForegroundEffect(ray);
  }
  #getSortedObjectsWithinRange(rayEndPoint) {
    let sensorBoundry = new Boundry(this.owner.position.x, this.owner.position.y, rayEndPoint.x, rayEndPoint.y);//TODO: FIGURE THIS OUT BASED ON THE FACING AND RANGE    
    let candidates = Director.quadtree.findInRange(sensorBoundry);
    for (let candidate of candidates) {
      candidate["distance"] = Point.distance(this.owner.position, candidate.position);
    }
    return candidates.sort((a, b) => { return a.distance - b.distance });
  }
  #sweep() {
    this.sweepAngle += this.sweepSpeed * this.sweepDirectionOfRotation;
    if (this.sweepAngle >= this.sweepArc) {
      this.sweepAngle = sweepArc;
      this.sweepDirectionOfRotation = -1;
    }
    else if (this.sweepAngle <= 0) {
      this.sweepAngle =0;
      this.sweepDirectionOfRotation = 1;      
    }
  }



  #findIntersection(p0, p1, q0, q1) {
    //Based on Andre LeMothe's "Tricks of the Windows Game Programming Gurus""
    let s1 = new Point(p1.x - p0.x, p1.y - p0.y);
    let s2 = new Point(q1.x - q0.x, q1.y - q0.y);
    let s = (-s1.y * (p0.x - q0.x) + s1.x * (p0.y - q0.y)) / (-s2.x * s1.y + s1.x * s2.y);
    let t = (s2.x * (p0.y - q0.y) - s2.y * (p0.x - q0.x)) / (-s2.x * s1.y + s1.x + s1.x * s2.y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return new Point(p0.x + (t * s1.x), p0.y + (t * s1.y));
    } else {
      return false;
    }
  }
}