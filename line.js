import Point from './point.js';
export default class Line {
  constructor(point0, point1) {
    this.p0 = point0;
    this.p1 = point1;
  }

  //returns a point if they intersect and "false" if they do not.
  static pointOfInterception(line0, line1) {
    //Based on Andrre LeMothe's "Tricks of the Windows Game Programming Gurus""
    let p0 = line0.p0;
    let p1 = line0.p1;
    let q0 = line1.p0;
    let q1 = line1.p1;
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
  //returns a line prependicular to the line parameter, with the given length.
  //The Mid-Point of the returned line will be p1 of the line.
  //If angle has been calculated somewhere you can pass it (efficiency!) otherwise it calculates it.
  static getPerpendicularToEndOf(line, desiredLength, originalLineAngle) {
    
    if (!originalLineAngle) {
      let dx = line.p0.x - line.p1.x;
      let dy = line.p0.y - line.p1.y;
      //atan2 gives proper angles for quadrants 1 and 2
      //q3 and q4 give -values so true angle would be (2pi + given value) 
      originalLineAngle = Math.atan(y, x);
      //If quadrant 3 or 4, subtract the value from 360. y > 0
      if (y > 0) originalLineAngle = 2 * Math.PI - a;      
    }
    let origin = line.p1;
    let p0 = new Point.fromPolar (originalLineAngle+90, desiredLength/2);
    let p1 = new Point.fromPolar (originalLineAngle-90, desiredLength/2);
    return new Line (p0,p1);
  }
}