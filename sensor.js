import Point from './point.js';
import Director from './director.js';
import Boundry from './boundry.js';
import Actor from './actor.js';
import LineEffect from './lineeffect.js';
import Color from './color.js';
import SensorResponse from './sensorresponse.js';
import Transpose from './transpose.js';
class Sensor {
  constructor(range, facing, fieldOfView, parent) {
    this.range = range;
    this.facing = facing; //degrees
    this.fieldOfView = fieldOfView;
    this.halfView = fieldOfView / 2;  //degrees to either side of the facing.. to avoid multiplying by 2 every time.
    this.owner = parent;
  }
  detect() {
    //Find the end-points of the line segments defining this sensor field of view.
    let sensorEdge1 = new Point(1, 0);
    Point.rotate(sensorEdge1, this.owner.owner.facing + this.owner.facing + this.fieldOfView / 2);
    Point.scale(sensorEdge1, this.range);
    let sensorEdge2 = new Point(1, 0);
    Point.rotate(sensorEdge2, this.owner.owner.facing + this.owner.facing - this.fieldOfView / 2);
    Point.scale(sensorEdge2, this.range);
    let sensorCenterEdge = new Point(1, 0);
    Point.rotate(sensorCenterEdge, this.owner.owner.facing + this.owner.facing);
    Point.scale(sensorCenterEdge, this.range);

    //Now get the objects that could potentially be in sight based on range.
    let sensorBoundry = new Boundry(
      this.owner.position.x - this.range,
      this.owner.position.y - this.range,
      this.owner.position.x + this.range,
      this.owner.position.y + this.range);
    let candidates = Director.quadtree.findInRange(sensorBoundry);

    //Sort them by distance in ascending order using "Chebyshev Distance" 
    //It is somewhat inaccurate, but very fast...
    candidates.sort((a, b) => {
      // Chebyshev Distance = max(|x1 - x2|, |y1 - y2|)
      const distA = Math.max(
        Math.abs(a.position.x - this.owner.position.x),
        Math.abs(a.position.y - this.owner.position.y)
      );
      const distB = Math.max(
        Math.abs(b.position.x - this.owner.position.x),
        Math.abs(b.position.y - this.owner.position.y)
      );
      return distA - distB;
    });

    //Are they bounded within the two lines segments?  If so, put them in the "detected" list,
    //and refine the sensorEdges to the angles the won't intersect the detected object.

    //TODO: I need a function that can take two points and turn them into a "line" that can
    //then be asked "where is x if y=?? and also where is y if x=??" in order to calculate the
    //boundry. DIGEST THIS:  https://en.wikipedia.org/wiki/Linear_equation 

    //Consider scenarios.  Object is DIRECTLY above (x2-x1 =0) or beside (y2-y1=0).
    //And then squarely in each quadrant.  Are there edge cases?


    for (let candidate of candidates) {

    }
  }
}