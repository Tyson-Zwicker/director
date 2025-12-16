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
  isPart() {
    return true;
  }
  
  toString() {
    return `part [${this.name}] owned by [${this.owner?.name}]
    polygon ${this.polygon.toString()}`;
  }
}