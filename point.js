//The whole point of this class is eleminating garbage collection when using vectors,
//which is all the time.  The "persistent" object doesn't get thrown away, and never needs to be re-created.
//It makes the math look a little wierd, but it elimantes a lot of stuttering.
export default class Point {
  x = 0;
  y = 0;
  static toRad = Math.PI / 180;
  constructor(x, y) {
    if (x === undefined || y === undefined) {
      throw new Error(`Point constructor: x or y is undefined`);
    }
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error(`Point constructor: x or y is not a number`);
    }
    if (x === null || y === null) {
      throw new Error(`Point constructor: x or y is null`);
    }
    if (isNaN(x) || isNaN(y)) {
      throw new Error(`Point constructor: x or y is NaN`);
    }
    this.x = x;
    this.y = y;
  }
  static isPointy(p) {
    return p && typeof p.x === 'number' && typeof p.y === 'number' && !isNaN(p.x) && !isNaN(p.y);
  }
  static equal (p1,p2){
    return p1.x ===p2.x && p1.y === p2.y;
  }
  ///Anything with an X and a Y is getting light copied to a new object.
  static from(obj) {
    if (this.isPointy(obj)) {
      return new Point(obj.x, obj.y);
    }
    throw new Error(`Point.from: object is not a point.`);
  }
  //This is a deep copy for points with added stuff 
  static copy(p) {
    if (this.isPointy(p)) {
      let copy = new Point(p.x, p.y);
      let propertyNames = Object.getOwnPropertyNames(p);
      for (let i = 0; i < propertyNames.length; i++) {
        copy[propertyNames[i]] = p[propertyNames[i]];
      }
      return copy;
    }
    throw new Error(`Point.copy: p is not a point`);
  }
  static zero() {
    return new Point(0, 0);
  }
  static create(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      return new Point(x, y);
    }
    throw Error (`Point.create: Bad parameters x:${x}, y:${y}`);
  }
  static add(persistent, change) {
    if (!this.isPointy(persistent)) {
      throw new Error(`Point.add: persistent is not a point [${persistent}]`);
    }
    if (!this.isPointy(change)) {
      throw new Error(`Point.add: change is not a point [${change}]`);
    }
    persistent.x += change.x;
    persistent.y += change.y;
    return persistent;
  }
  static addAbsolute(persistent, change) {
    if (!this.isPointy(persistent)) {
      throw new Error(`Point.addAbsolute: persistent is not a point [${persistent}]`);
    }
    if (!this.isPointy(change)) {
      throw new Error(`Point.addAbsolute: change is not a point [${change}] `);
    }
    persistent.x = Math.abs(persistent.x) + Math.abs(change.x);
    persistent.y = Math.abs(persistent.y) + Math.abs(change.y);
    return persistent;
  }
  static sub(persistent, change) {
    if (!this.isPointy(persistent)) {
      throw new Error(`Point.sub: persistent is not a point [${persistent}]`);
    }
    if (!this.isPointy(change)) {
      throw new Error(`Point.sub: change is not a point [${change}]`);
    }
    persistent.x -= change.x;
    persistent.y -= change.y;
    return persistent;
  }
  static scale(persistent, s) {
    if (!this.isPointy(persistent)) {
      throw new Error(`Point.scale: persistent is not a point [${persistent}]`);
    }
    if (isNaN(s)) {
      throw new Error(`Point.scale: s is NaN[${s}]`);
    }
    persistent.x *= s;
    persistent.y *= s;
    return persistent;
  }
  static rotate(persistent, degrees) {
    if (!this.isPointy(persistent)) {
      throw new Error(`Point.rotate: persistent is not a point [${persistent}]`);
    }
    if (isNaN(degrees)) {
      throw new Error(`Point.rotate: degrees is NaN ${degrees}`);
    }
    let radians = degrees * this.toRad;
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    let x = persistent.x;
    let y = persistent.y;
    persistent.x = x * cos - y * sin;
    persistent.y = x * sin + y * cos;
    return persistent;
  }
  static distance(p1, p2) {
    if (this.isPointy(p1) && this.isPointy(p2)) {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    throw new Error(`Point.distance: p1 or p2 is not a point`);
  }
  static normalize(persistent) {
    if (!this.isPointy(persistent)) {
      throw new Error(`Point.normalize: persistent is not a point`);
    }
    const length = Math.sqrt(persistent.x * persistent.x + persistent.y * persistent.y);
    if (length === 0) {
      throw new Error(`Point.normalize: zero-length vector`);
    }
    persistent.x /= length;
    persistent.y /= length;
    return persistent;
  }
  static dot(p1, p2) {
    if (this.isPointy(p1) && this.isPointy(p2)) {
      return p1.x * p2.x + p1.y * p2.y;
    }
    throw new Error(`Point.dot: p1 or p2 is not a point`);
  }
  toString() {
    return `Point(${this.x},${this.y})`;
  }
}