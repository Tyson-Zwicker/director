import Point from './point.js';
import Director from './director.js';
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
    this.offset = new Point(x, y);
    this.polygon = polygon;
    this.rotation = (rotation) ? rotation : 0;
  }
  getWorldCoordinates(actor) {
    let origin = Point.from(actor.position);
    let partOrigin = Point.from(this.offset);
    Point.rotate(partOrigin, actor.rotation);
    Point.add(partOrigin, origin);
    Point.sub(partOrigin, Director.view.camera);
    Point.scale(partOrigin, Director.view.camera.zoom);
    Point.add(partOrigin, Director.view.screenCenter);
    return partOrigin;

  }
  isPart() {
    return true;
  }
  toString() {
    return `part [${this.name}] owned by [${this.owner?.name}]
    polygon ${this.polygon.toString()}`;
  }
}