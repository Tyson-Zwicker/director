import Point from './point.js';
import Director from './director.js';
import Appearance from './appearance.js'
import Transpose from './transpose.js';
export default class Part {
  name = undefined;
  position = undefined;
  facing = 0;
  owner = undefined;
  polygon = null;
  appearance = undefined;
  particleGenerator = undefined; // Add this property
  
  constructor(name, x, y, polygon, facing, parent) {
    this.name = name;
    this.position = new Point(x, y);
    this.polygon = polygon;
    this.facing = (facing) ? facing : 0;
    this.parent = parent;
  }
  
  attachParticleGenerator(generator) {
    this.particleGenerator = generator;
    generator.attachedPart = this;
    return this;
  }
  
  updateParticleGenerator() {
    if (this.particleGenerator) {
      //    let worldCoords = this.getWorldCoordinates();
      console.log ('updateParticleAccelerator');
      console.log (this);
      console.log (this.parent);
      let worldCoords = Transpose.childToWorld (this,this.parent);
      this.particleGenerator.setPosition(worldCoords);
      this.particleGenerator.setFacing(this.parent.facing + this.facing);
    }
  }
/*  
  getWorldCoordinates() {
    let origin = Point.from(this.actor.position);
    let partOrigin = Point.from(this.position);
    Point.rotate(partOrigin, this.actor.facing);
    Point.add(partOrigin, origin);   
    return partOrigin;
  }
  getScreenCoordinates(){
    let partOrigin = this.getWorldCoordinates();
    Point.sub(partOrigin, Director.view.camera);
    Point.scale(partOrigin, Director.view.camera.zoom);
    Point.add(partOrigin, Director.view.screenCenter);
    return partOrigin;
  }
  */
  isPart() {
    return true;
  }
  
  toString() {
    return `part [${this.name}] owned by [${this.owner?.name}]
    polygon ${this.polygon.toString()}`;
  }
}