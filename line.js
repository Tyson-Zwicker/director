import Point from './point.js';
export default class Line {
  constructor(point0, point1) {
    this.p0 = point0; 
    this.p1 = point1;
  }

  //returns a point if they intersect and "false" if they do not.
  static getPointOfInterception(line0, line1) {
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
  static getPerpendicular(line, origin, desiredLength) {
    //calculate then angle
    let dx = line.p0.x - line.p1.x;
    let dy = line.p0.y - line.p1.y;
    let angle = Math.atan2(dy, dx);
    if (angle < 0) {
      //adjust for quadrants 3 and 4..
      angle = 2 * Math.PI + angle;
    }
    //get the tangent angle and its counterpart with the opposite slope..
    let angle1 = (angle + Math.PI / 2) * Point.toDeg;
    let angle2 = (angle - Math.PI / 2) * Point.toDeg;
    angle *= Point.toDeg;
    let p0 = Point.fromPolar(angle1, desiredLength / 2);
    let p1 = Point.fromPolar(angle2, desiredLength / 2);
    Point.add(p0, origin);
    Point.add(p1, origin);
    return new Line(p0, p1);
  }
}