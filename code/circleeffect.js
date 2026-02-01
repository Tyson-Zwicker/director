import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
import Point from './point.js';
import Check from './check.js';

export default class CircleEffect {
  constructor(position, radius, color, durationInSeconds) {
    if (!Check.obj(position, Point)) throw new Error(`CircleEffect.constructor: position must be a point: ${position}`);
    if (!Check.num(radius)) throw new Error(`CircleEffect.constructor: radius must be a number: ${radius}`);
    if (!Check.obj(color, Color)) throw new Error('CircleEffect.constructor: color is not a color.');
    this.position = position;
    this.radius = radius;    
    this.color = color;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  draw(context, delta) {
    if (!Check.obj (context)) throw new Error (`CircleEffect.draw: invalid context ${context}`);
    if (!Check.num (delta)) throw new Error (`CircleEffect.draw: bad delta value ${delta}`);
    let screenPoint = Transpose.worldToScreen(this.position);    
    context.fillStyle = this.color.withOpacity(this.life / this.duration).asHex();
    context.beginPath();
    context.moveTo(screenPoint.x, screenPoint.y);
    let zoomedRadius = this.radius * Director.view.camera.zoom;
    context.ellipse(screenPoint.x, screenPoint.y, zoomedRadius, zoomedRadius, 0, 0, Math.PI * 2);
    context.fill();
    this.life -= delta;
    return (this.life > 0);
  }
}