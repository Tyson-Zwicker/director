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
  isInside(x, y) {
    if (x > this.x1 &&
      x < this.x2 &&
      y > this.y1 &&
      y < this.y2) return true;
    return false;
  }
    touches(otherBoundry) {
    return (
      ((otherBoundry.x2 = this.x1 && otherBoundry.x2 <= this.x2) ||
        (otherBoundry.x1 >= this.x1 && otherBoundry.x1 <= this.x2)) ||
      ((otherBoundry.y2 >=this.y1 && otherBoundry.y2 <= this.y2) ||
        (otherBoundry.y1 >= this.y1 && otherBoundry.y1 <= this.y2)));
  }
}
