import Point from './point.js';
import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
export default class RadialEffect {
  constructor(position, radius, colorOrGradient, durationInSeconds) {
    this.position = position;
    this.radius = radius;
    this.colorOrGradient = colorOrGradient;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  draw(context, delta) {
    let screenPoint = Transpose.worldToScreen (this.position);
    if (!context || isNaN(delta)) throw (`LineEffect.draw: bad params context ${context}, delta ${delta}`);
    if (this.colorOrGradient instanceof Color) {
      let color = this.colorOrGradient.withOpacity(this.life / this.duration);
      context.fillStyle = color.asHex();
    } else {
      context.fillStyle = this.colorOrGradient;
    }
    context.beginPath();
    context.moveTo(screenPoint.x, screenPoint.y);
    let zoomedRadius = this.radius * Director.view.camera.zoom;
    context.ellipse(screenPoint.x, screenPoint.y, zoomedRadius, zoomedRadius, 0, 0, Math.PI * 2);
    context.fill();

    this.life -= delta;
    return (this.life > 0);
  }
}