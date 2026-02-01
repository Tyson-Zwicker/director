import Point from './point.js';
import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
import Check from './check.js';
export default class RadialEffect {
  constructor(position, initialRadius, expansionRate,color, thickness, durationInSeconds) {
    if (!Check.num(initialRadius)) throw new Error (`RadialEffect.constructor: initial radius must be a number: ${initialRadius}`);
    if (!Check.num(expansionRate)) throw new Error (`RadialEffect.constructor: expansion rate must be a number: ${expansionRate}`);
    if (!Check.num(durationInSeconds)) throw new Error (`RadialEffect.constructor: durationInSeconds must be a number: ${durationInSeconds}`);
    if (!Check.num(thickness )) throw new Error (`RadialEffect.constructor: thickness must be a number: ${thickness}`);
    if (!Check.obj(position, Point)) throw new Error ('RadilEffect.constructor: Position must be a point.');
    if (!Check.obj(color,Color)) throw new Error ('RadilEffect.constructor: Color must be a color.');
    this.position = position;
    this.radius = initialRadius;
    this.expansionRate = expansionRate;
    this.color = color;
    this.thickness = thickness;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  draw(context, delta) {
    if (!Check.num(delta,0)) throw new (`RadialEffect.draw: bad params context ${context}, delta ${delta}`);
    let screenPoint = Transpose.worldToScreen(this.position);    
    let originalLineWidth = context.lineWidth;    
    context.strokeStyle = this.color.withOpacity(this.life / this.duration).asHex();
    context.lineWidth = this.thickness;
    context.beginPath();
    let zoomedRadius = this.radius * Director.view.camera.zoom;
    context.ellipse(screenPoint.x, screenPoint.y, zoomedRadius, zoomedRadius, 0, 0, Math.PI * 2);
    context.stroke();
    context.lineWidth = originalLineWidth;
    this.life -= delta;
    this.radius += this.expansionRate * delta;
    return (this.life > 0);
  }
}