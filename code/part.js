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
  createInstance ( name, offsetFromActorOrigin, facing, appearance){
    //owner is set when part is attached by actor or director..
    let attachedPart = new Part(this.partTypeName, this.polygon);    
    attachedPart.name = name;
    attachedPart.position = offsetFromActorOrigin;
    attachedPart.facing = facing;
    attachedPart.appearance = appearance;
    return attachedPart;
  }
  isPart() {
    return true;
  }
  
  toString() {
    return `part [${this.name}] owned by [${this.owner?.name}]
    polygon ${this.polygon.toString()}`;
  }
}