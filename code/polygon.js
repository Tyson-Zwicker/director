import Point from './point.js';
import Director from './director.js';
import Rnd from './rnd.js';
export default class Polygon {
  
  points = [];
  drawnPoints = [];
  radius = 0;
  constructor(name,points) {
    this.name = name;
    if (!Array.isArray(points)) throw new Error(`${points} is not an array`);
    if (points.length < 3) throw new Error(`Polygon constructor: points length is less than 3`);
    for (let p of points) {
      if (!Point.isPointy(p)) throw new Error(`${p} is not a Point`);
    }
    this.points = points;
    for (let p of this.points) {
      let d = Point.distance(p, Point.zero());
      if (d > this.radius) {
        this.radius = d;
      }
    }    
  }
  draw(origin, rotation, appearance) {
    this.drawnPoints = [];
    let path = new Path2D();
    let first = true;
    for (let point of this.points) {
      let vertex = Point.from(point);
      Point.rotate(vertex, rotation);
      Point.scale(vertex, Director.view.camera.zoom);
      Point.add(vertex, origin);
      this.drawnPoints.push(vertex);
      if (first) {
        path.moveTo(vertex.x, vertex.y);
        first = false
      } else {
        path.lineTo(vertex.x, vertex.y);
      }
    }
    path.closePath();
    Director.view.context.fillStyle = appearance.fillHex;
    Director.view.context.strokeStyle = appearance.strokeHex;
    Director.view.context.lineWidth = appearance.lineWidth;
    Director.view.context.fill(path);
    Director.view.context.stroke(path);
  }
  isPointIn(p) {
    //Trace the line that goes from the point to the right and count how many times it crosses the polygon
    //If it crosses an odd number of times, the point is inside the polygon
    //If it crosses an even number of times, the point is outside the polygon
    var isInside = false;
    if (this.drawnPoints.length > 0) {
      var minX = this.drawnPoints[0].x, maxX = this.drawnPoints[0].x;
      var minY = this.drawnPoints[0].y, maxY = this.drawnPoints[0].y;
      for (var n = 1; n < this.drawnPoints.length; n++) {
        var q = this.drawnPoints[n];
        minX = Math.min(q.x, minX);
        maxX = Math.max(q.x, maxX);
        minY = Math.min(q.y, minY);
        maxY = Math.max(q.y, maxY);
      }
      if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
        return false;
      }
      var i = 0, j = this.drawnPoints.length - 1;
      for (i, j; i < this.drawnPoints.length; j = i++) {
        if ((this.drawnPoints[i].y > p.y) != (this.drawnPoints[j].y > p.y) &&
          p.x < (this.drawnPoints[j].x - this.drawnPoints[i].x) * (p.y - this.drawnPoints[i].y) /
          (this.drawnPoints[j].y - this.drawnPoints[i].y) + this.drawnPoints[i].x) {
          isInside = !isInside;
        }
      }
    }
    return isInside;
  }
  static makeIrregular(name,side, minRadius, maxRadius) {
    let parray = []
    let a = 0;
    for (let i = 0; i < side; i++) {
      let r = Rnd.int (minRadius, maxRadius);
      parray.push(new Point(Math.cos(a) * r, Math.sin(a) * r));
      a = a + Math.PI * 2 / side;
    }
    return new Polygon(name,parray);
  }
  static makeRegular(name,side, radius) {
    let parray = [];
    let a = 0;
    for (let i = 0; i < side; i++) {
      parray.push(new Point(Math.cos(a) * radius, Math.sin(a) * radius));
      a += Math.PI * 2 / side;
    }
    return new Polygon(name,parray);
  }
  static rectangle(name,w, h) {
    let parray = [];
    parray.push(
      new Point(-w / 2, -h / 2),
      new Point(w / 2, -h / 2),
      new Point(w / 2, h / 2),
      new Point(-w / 2, h / 2));
    return new Polygon(name,parray);
  }
  static triangle(name,b, h) {
    let parray = [];
    parray.push(
      new Point(-h / 2, -b / 2),
      new Point(-h / 2, b / 2),
      new Point(h / 2, 0));
    return new Polygon(name,parray);
  }
  toString() {
    let s = `polygon [${this.name}`;
    let so = ']: ';
    for (let p of this.drawnPoints) {
      s += p.toString() + ' ';
    }
    for (let p of this.points) {
      so += p.toString() + '->';
    }
    return `drawn points(${this.drawnPoints.length}): ${s} origin ( ${this.points.length} points): ${so}`;
  }
}