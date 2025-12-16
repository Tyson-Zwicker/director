import Point from './point.js';
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
  //NO PARENT: //Just moves a damn point to the Director.view.camera location..
  //IF parent defined:
  //For finding the origin of a POINT, given its own position(offset) and its parents position AND FACING
  //-->AND THEN move it to screen coords.
  static pointToScreen(point, parent) {
    let p = Point.from(parent);
    let o = Point.from(this.position);
    Point.scale(o, Director.view.camera.zoom);
    Point.add(p, o);
    Point.sub(p, Director.view.camera);
    Point.scale(p, Director.view.camera.zoom);
    Point.add(p, director.view.screenCenter);

  }
  //UNLIKE POINTS.. children have a facing.  THis moves the point, but it considers the child's facing as well.
  //The "child" is the object that owns the "point" being drawn.
  //Think: world position of a point in a part
  static childToWorld(point, child, parent) {
    let childOrigin = Transpose.pointToWorld(child.position, parent);
    let p = Point.from(point);
    Point.rotate(p, child.facing + parent.facing);
    Point.add(p, childOrigin);
    return p;
  }
  //returns a point in a child object, accounting
  //for both objects facing in SCREEN coordinates.
  //Think:Screen position of a point in a part.
  static childToScreen(point, child, parent) {
    
    let p = Point.from (point);
    Point.rotate (p, parent.facing+child.facing);
    Point.scale (p, Director.view.camera.zoom);
    Point.add (p,childToWorld (point, child.parent));
    return p;
  }
}