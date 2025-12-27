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
  static getActorBounds(actor) {
    return new Boundry(
      actor.position.x - actor.radius(),
      actor.position.y - actor.radius(),
      actor.position.x + actor.radius(),
      actor.position.y + actor.radius()
    );
  }
  isInside(x, y) {
    if (x > this.x1 &&
      x < this.x2 &&
      y > this.y1 &&
      y < this.y2) return true;
    return false;
  }
  touches(otherBoundry) {
    //Is the other (x1,y1) in boundry?
    if (otherBoundry.x1 > this.x1 && otherBoundry.x1 < this.x2 && otherBoundry.y1 > this.y1 && otherBoundry.y1 < this.y2) return true;
    //Is the other (x1,y2) in boundry?
    if (otherBoundry.x1 > this.x1 && otherBoundry.x1 < this.x2 && otherBoundry.y2 > this.y1 && otherBoundry.y2 < this.y2) return true;
      //Is the other (x2,y1) in boundry?
    if (otherBoundry.x2 > this.x1 && otherBoundry.x2 < this.x2 && otherBoundry.y1 > this.y1 && otherBoundry.y1 < this.y2) return true;
      //Is the other (x2,y2) in boundry?
    if (otherBoundry.x2 > this.x1 && otherBoundry.x2 < this.x2 && otherBoundry.y2 > this.y1 && otherBoundry.y2 < this.y2) return true;
      return false;
  }
}
