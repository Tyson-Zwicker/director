import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
import Point from './point.js';
export default class LineEffect {
  constructor(p1, p2, w, colorOrGradient, durationInSeconds) {
    if (!Point.isPointy(p1) || !Point.isPointy(p2)) throw new Error(`LineEffect.constructor: Bad Point: p1(${p1}), p2(${p2})`)
    if (typeof w !== 'number' || w<0) throw new Error(`Width must be a number >0 [${w}]`);
    if (typeof durationInSeconds !== 'number' || durationInSeconds<0) throw new Error(`Duration must be a number >0 [${durationInSeconds}]`);
    this.p1 = p1;
    this.p2 = p2;
    this.w = w;
    this.colorOrGradient = colorOrGradient;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  draw(context, delta) {
    let screenPoint1 = Transpose.worldToScreen(this.p1);
    let screenPoint2 = Transpose.worldToScreen(this.p2);
    if (!context || isNaN(delta)) throw (`LineEffect.draw: bad params context ${context}, delta ${delta}`);
    if (this.colorOrGradient instanceof Color) {
      let color = this.colorOrGradient.withOpacity(this.life / this.duration);
      context.strokeStyle = color.asHex();
    } else {
      context.strokeStyle = this.colorOrGradient;
    }
    context.lineWidth = this.w * Director.view.camera.zoom;
    context.beginPath();
    context.moveTo(screenPoint1.x, screenPoint1.y);
    context.lineTo(screenPoint2.x, screenPoint2.y);
    context.stroke();
    this.life -= delta;
    return (this.life > 0);
  }
}