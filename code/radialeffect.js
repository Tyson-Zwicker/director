import Point from './point.js';
import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
export default class RadialEffect {
  constructor(position, initialRadius, expansionRate,color, thickness, durationInSeconds) {
    if (typeof initialRadius !=='number') throw new Error (`RadialEffect.constructor: initial radius must be a number: ${initialRadius}`);
    if (typeof expansionRate !=='number') throw new Error (`RadialEffect.constructor: expansion rate must be a number: ${expansionRate}`);
    if (typeof durationInSeconds !=='number') throw new Error (`RadialEffect.constructor: durationInSeconds must be a number: ${durationInSeconds}`);
    if (typeof thickness !=='number') throw new Error (`RadialEffect.constructor: thickness must be a number: ${thickness}`);
    if (!(position instanceof Point)) throw new Error ('RadilEffect.constructor: Position must be a point.');
    if (!(color instanceof Color)) throw new Error ('RadilEffect.constructor: Color must be a color.');
    this.position = position;
    this.radius = initialRadius;
    this.expansionRate = expansionRate;
    this.color = color;
    this.thickness = thickness;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  draw(context, delta) {
    let screenPoint = Transpose.worldToScreen(this.position);
    if (!context || isNaN(delta)) throw (`RadialEffect.draw: bad params context ${context}, delta ${delta}`);
    
    // Save/restore context to avoid affecting other drawing
    let originalLineWidth = context.lineWidth;
    
    context.strokeStyle = this.color.withOpacity(this.life / this.duration).asHex();
    context.lineWidth = this.thickness;
    context.beginPath();
    let zoomedRadius = this.radius * Director.view.camera.zoom;
    context.ellipse(screenPoint.x, screenPoint.y, zoomedRadius, zoomedRadius, 0, 0, Math.PI * 2);
    context.stroke();
    
    // Restore context state
    context.lineWidth = originalLineWidth;

    this.life -= delta;
    this.radius += this.expansionRate * delta;
    return (this.life > 0);
  }
}