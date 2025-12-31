import Point from './point.js';
export default class Boundry {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  get width() {
    return this.x2 - this.x1;
  }

  get height() {
    return this.y2 - this.y1;
  }

  isBoundry() {
    return (this.x2 > this.x1) && (this.y2 > this.y1) && (!isNaN(this.x1 + this.x2 + this.y1 + this.y2));
  }
  isPointInside(point) {
    let { x, y } = point;
    return (x > this.x1 && x < this.x2 && y > this.y1 && y < this.y2);
  }
  isPointOnEdge(point) {
    let { x, y } = point;
    if (x === this.x1 && y > this.y1 && y < this.y2) return true; //left edge
    if (x === this.x2 && y > this.y1 && y < this.y2) return true; //right edge
    if (y === this.y1 && x > this.x1 && x < this.x2) return true //top edge
    if (y === this.y2 && x > this.x1 && x < this.x2) return true //top edge
    return false;
  }
  touches(points) {
    for (let point of points) {
      if (this.isPointInside(point) || this.isPointOnEdge(point)) {
        return true;
      }
    }    
    return false;
  }
}
