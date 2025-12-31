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
  touches(boundry) {
    // Check each corner
    const corners = [
      { x: boundry.x1, y: boundry.y1 }, // top-left
      { x: boundry.x2, y: boundry.y1 }, // top-right
      { x: boundry.x1, y: boundry.y2 }, // bottom-left
      { x: boundry.x2, y: boundry.y2 }  // bottom-right
    ];

    corners.forEach(corner => {
      if (boundry.isInside(corner.x, corner.y)) {
        return true;
      }
    });
  }
}
