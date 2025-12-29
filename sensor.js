import Line from './line.js';
import Boundry from './boundry.js';
import Point from './point.js';
import Director from './director.js'
import LineEffect from './lineeffect.js';
import Color from './color.js';
export default class Sensor {
  constructor(owner, range, sweepArc, facing, sweepSpeed, active) {
    this.sweepArc = sweepArc;
    this.facing = facing;
    this.halfArc = sweepArc / 2; //to avoid dividing by 2 a lot..
    this.range = range;
    this.sweepDirectionOfRotation = 1; //either 1 or -1 (sweeping between the two angles back and forth..)
    this.sweepAngle = sweepArc / 2; //This is the direction the beam is look now. (always between -halfSweepArc and +halfSweepArc)
    this.sweepSpeed = sweepSpeed; //How many degrees per sweep motoin the beam angle changes..
    this.owner = owner;
    this.active = active;
  }
  detect(delta) {
    let trueFacing = this.owner.facing + this.facing + this.sweepAngle;
    let rayEndPoint = Point.fromPolar(trueFacing, this.range);
    Point.add(rayEndPoint, this.owner.position)
    let rayLine = new Line(this.owner.position, rayEndPoint, 2);
    let candidates = this.#getSortedObjectsWithinRange(rayEndPoint);
    for (let candidate of candidates) {
      if (candidate != this.owner) { //don't detect yourself
        let seenPosition =this.#canSee(candidate, rayLine);
        if (seenPosition === false) {
          this.#drawPingToEdge(rayEndPoint);
        }else{
          this.#drawPingReturned(seenPosition);
          return candidate; //don't look past the first one you see, because anything else will be blocked.        
        }
        
      }
    }
    (this.#sweep(delta));
  }
  #canSee(candidate, rayLine) {
    //Form an imaginary line from this.owner to candidate.
    let imgLine = new Line (this.owner.position,candidate.position);
    //Form a line tangent to this line, at the candidates position
    let tanLine = Line.getPerpendicular (imgLine, candidate.position, candidate.radius);
    //If the rayLine intersects this tangent line, it is detected    
    let seenPosition = Line.getPointOfInterception(tanLine, rayLine);
    return seenPosition; //false if no interception found.
  }
  #drawPingReturned(seenPosition) {
    let ray = new LineEffect(this.owner.position, seenPosition, 1, new Color(0, 15, 0, 1), 3);

    Director.addForegroundEffect(ray);
  }
  #drawPingToEdge(rayEndPoint) {
    let ray = new LineEffect(this.owner.position, rayEndPoint, 1, new Color(15, 0, 0, 1), 3);
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
  #sweep(delta) {
    this.sweepAngle += (delta * this.sweepSpeed) * this.sweepDirectionOfRotation;
    if (this.sweepAngle >= this.sweepArc) {
      this.sweepAngle = this.sweepArc;
      this.sweepDirectionOfRotation = -1;
    }
    else if (this.sweepAngle <= 0) {
      this.sweepAngle = 0;
      this.sweepDirectionOfRotation = 1;
    }
  }
}