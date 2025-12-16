import Point from './point.js';
export default class Boundry {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
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
    //Corner cases (will also catch if other boundry is INSIDE this)
    //case 1: otherboundry.x1,y1 inside this.
    //case 2: otherboundry.x1,y2 inside this.
    //case 3: otherboundry.x2,y1 inside this.
    //case 4: otherboundry.x1,y2 inside this.
    //return true if ANY of the above are true..

    if (this.isInside (otherBoundry.x1, otherBoundry.y1)) return true;
    if (this.isInside (otherBoundry.x1, otherBoundry.y2)) return true;
    if (this.isInside (otherBoundry.x2, otherBoundry.y1)) return true;
    if (this.isInside (otherBoundry.x2, otherBoundry.y2)) return true;

    return (
      ((otherBoundry.x2 > this.x1 && otherBoundry.x2 < this.x2) ||
        (otherBoundry.x1 > this.x1 && otherBoundry.x1 < this.x2)) ||
      ((otherBoundry.y2 > this.y1 && otherBoundry.y2 < this.y2) ||
        (otherBoundry.y1 > this.y1 && otherBoundry.y1 < this.y2)));
    //The only case it doesn't detect is if THIS is INSIDE other other boundry,
    //but I don't that I want it to...
  }
}
