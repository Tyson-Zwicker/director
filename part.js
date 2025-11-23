import Point from './point.js';
import Appearance from './appearance.js'
export default class Part {
  name = undefined;
  offset = undefined;
  rotation = 0;
  owner = undefined; //This is defined by the Actor class when attachPart() is called.
  polygon = null;
  appearance = undefined;
  constructor(name, x, y, polygon, rotation) {
    this.name = name;
    this.polygon = polygon;
    this.offset = new Point(x, y);
    this.rotation = (rotation)? rotation:0;
  }
  isPart() {
    return true;
  }
  toString() {
    return `part [${this.name}] owned by [${this.owner?.name}]
    polygon ${this.polygon.toString()}`;
  }
}