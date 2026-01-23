import Point from './point.js';
import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
export default class RadialEffect {
  constructor(position, radius, color, durationInSeconds) {
    this.position = position;
    this.radius = radius;
    if (!(color instanceof Color)) {
      throw error('RadialEffect.constructor: color is not a color.');
    }
    this.color = color;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  draw(context, delta) {
    let screenPoint = Transpose.worldToScreen(this.position);
    if (!context || isNaN(delta)) throw (`LineEffect.draw: bad params context ${context}, delta ${delta}`);
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