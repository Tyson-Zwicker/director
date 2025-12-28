class Sensor {
  constructor(owner, range, sweepArc, facing, sweepSpeed) {
    this.sweepArc = sweepArc;
    this.facing = facing;
    this.halfArc = sweepArc/2; //to avoid dividing by 2 a lot..
    this.range = range;
    this.sweepDirectionofRotation = 1; //either 1 or -1 (sweeping between the two angles back and forth..)
    this.sweepAngle = sweepArc / 2; //This is the direction the beam is look now. (always between -halfSweepArc and +halfSweepArc)
    this.sweepSpeed = sweepSpeed; //How many degrees per sweep motoin the beam angle changes..
    this.owner = owner;
  }
  detect(){
    let trueFacing = this.owner.facing + this.facing + this.sweepAngle;
    let rayEndPoint = new Point.fromPolar (trueFacing, this.range);
    let candidates = this.#getSortedObjectsWithinRange(rayEndPoint);
    for (let candidate of candidates){
      if (this.#canSee(candidate)) {
        this.#drawPingReturned(candidate);
        return candidate; //don't look past the first one you see, because anything else will be blocked.        
      }
      this.#drawPingToEdge (rayEndPoint);
    }
    this.#sweep;
  }
  #drawPingReturned (trueFacing, candidate){
      let rayPoint = Point.fromPolar (trueFacing, candidate.distance)
      let ray = new LineEffect(this.actor.position, closestPoint, 2, new Color(0, 15, 0, 1), 2);
      Director.addForegroundEffect(ray);  
  }
  #drawPingToEdge (rayEndPoint){
    let ray = new LineEffect(this.actor.position, rayEndPoint, 2, new Color(7, 7, 7, 1), 2);
    Director.addForegroundEffect(ray);
  }
  #getSortedObjectsWithinRange(rayEndPoint){    
    let sensorBoundry = new Boundry (owner.position.x,owner.position.y,rayEndPoint.x, rayEndPoint.y);//TODO: FIGURE THIS OUT BASED ON THE FACING AND RANGE
    //Use Quadtree to get the candidates for detection    
    let candidates = Director.quadtree.findInRange(sensorBoundry);
    //add a distance property based on their distance to the origin..
    for (let candidate of  candidates){
      candidate["distance"] = Point.distance (owner.position, rayEndPoint);
    }
    //return that array, sorted from closest to farthest
    return candidates.sort ((a,b)=>{return a.distance - b.distance});
  }
  #sweep() {
    this.sweepAngle += this.sweepSpeed * this.sweepDirectionofRotation;
    if (sweepAngle >= sweepArc) {
      sweepAngle = sweepArc;
      sweepDirectionOfRotation = -1;
    }
    if (sweepAngle < 0) {
      sweepAngle = 0;
      sweepAngle = 1;
    }
  }
  
 
  #canSee(actor) {
    //https://www.mathsisfun.com/algebra/trig-interactive-unit-circle.html
    //also remember that the perpendicular to any line y=mx+b = y=-mx+b
    //Also you could just start at the center of the candidate, set and calculate where a point would be 
    //from there are +90 and -90 degrees from the "true facing" of the ray.  That would give you both points to..
    
    //TODO:
    //get the angle to the center of obj from origin.

    //atan2 gives proper angles for quadrants 1 and 2
    //q3 and q4 give -values so true angle would be (2pi + given value)

    //If that angle is within a degree of the sweepAngle - return true.
    //get a the line segments tangential to the line from origin to obj.
    //the first line segment goes to the "right" of the obj position, the other to the left.
    //If line coming from the origin intersects either line segment, return true.
  }
    #findIntersection(p0, p1, q0, q1) {
      //Based on Andrre LeMothe's "Tricks of the Windows Game Programming Gurus""
      let s1 = new Point(p1.x - p0.x, p1.y - p0.y);
      let s2 = new Point(q1.x - q0.x, q1.y - q0.y);
      let s = (-s1.y * (p0.x - q0.x) + s1.x * (p0.y - q0.y)) / (-s2.x * s1.y + s1.x * s2.y);
      let t = (s2.x * (p0.y - q0.y) - s2.y * (p0.x - q0.x)) / (-s2.x * s1.y + s1.x + s1.x * s2.y);
  
      if (s>=0 &&s<=1 && t>=0 && t<=1){
        return new Point (p0.x + (t * s1.x),p0.y + (t * s1.y));
      }else{
        return false;
      }
    }
}