import Point from './point.js';
import Director from './director.js';

export default class Transpose {
  //For finding the origin of a POINT, given its own position(offset) and its parents position AND FACING
  //Returns WORLD coordinates.
  static pointToWorld(point, parent) {
    let p = Point.from(parent.position);
    let o = Point.from(point);
    Point.rotate(o, parent.facing);
    Point.add(p, o);
    return p;
  }
  //Converts world coordinates to screen coordinates
  static worldToScreen(point) {
    let p = Point.from(point);
    Point.sub(p, Director.view.camera);
    Point.scale(p, Director.view.camera.zoom);
    Point.add(p, Director.view.screenCenter);
    return p;
  }
  //UNLIKE POINTS.. children have a facing.  THis moves the point, but it considers the child's facing as well.
  //The "child" is the object that owns the "point" being drawn.
  //Think: world position of a point in a part
  static childToWorld(child, parent) {
    let childOrigin = Point.from (child.position)
    Point.rotate(childOrigin, parent.facing);
    Point.add(childOrigin, parent.position);
    return childOrigin;
  }
  //returns a point in a child object, accounting
  //for both objects facing in SCREEN coordinates.
  //Think:Screen position of a point in a part.
  static childToScreen(child, parent) {
    let childWorldCoords = Transpose.childToWorld(child, parent);
    return Transpose.worldToScreen(childWorldCoords);
  }
}