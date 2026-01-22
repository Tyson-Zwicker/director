import Point from './point.js';
import Transpose from './transpose.js';
export default class Part {
  partTypeName = undefined;
  name = undefined;
  position = undefined;
  facing = 0;
  owner = undefined;
  polygon = null;
  appearance = undefined;
  particleGenerator = undefined; //must be attached.

  constructor(partTypeName, polygon) {
    this.partTypeName = partTypeName;
    this.polygon = polygon;
  }
  createInstance(name, appearance, offsetFromActorOrigin, facing, spin) {
    //owner is set when part is attached by actor or director..
    let attachedPart = new Part(this.partTypeName, this.polygon);
    attachedPart.name = name;
    attachedPart.appearance = appearance;
    attachedPart.position = offsetFromActorOrigin;
    attachedPart.facing = facing;
    attachedPart.spin = spin;
    return attachedPart;
  }
  isPart() {
    return true;
  }
  attachParticleGenerator (generator){  
    this.particleGenerator = generator;
    generator.attachedPart = this;
    return this;
  }
  updateParticleGenerator() {
    if (this.particleGenerator) {      
      let worldCoords = Transpose.childToWorld (this,this.parent);
      this.particleGenerator.setPosition(worldCoords);
      this.particleGenerator.setFacing(this.parent.facing + this.facing);
    }
  }
  toString() {
    return `part [${this.name}] owned by [${this.owner?.name}]
    polygon ${this.polygon.toString()}`;
  }
}