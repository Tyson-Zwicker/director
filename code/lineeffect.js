import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
import Point from './point.js';
export default class LineEffect {
  constructor(p0, p1, w, color, durationInSeconds) {
    if (!Point.isPointy(p0) || !Point.isPointy(p1)) throw new Error(`LineEffect.constructor: Bad Point: p0(${p0}), p1(${p1})`)
    if (!(this.colorOrGradient instanceof Color)) throw new Error ('LineEffect.constructor.Color is not a color.');
    if (typeof w !== 'number' || w < 0) throw new Error(`Width must be a number >0 [${w}]`);
    if (typeof durationInSeconds !== 'number' || durationInSeconds < 0) throw new Error(`Duration must be a number >0 [${durationInSeconds}]`);
    this.p0 = p0;
    this.p1 = p1;
    this.w = w;
    this.color = color;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  draw(context, delta) {
    let screenPoint0 = Transpose.worldToScreen(this.p0);
    let screenPoint1 = Transpose.worldToScreen(this.p1);
    if (!context || isNaN(delta)) throw (`LineEffect.draw: bad params context ${context}, delta ${delta}`);
    let c = 
    context.strokeStyle = this.color.withOpacity(this.life / this.duration).toHex();
    context.lineWidth = this.w * Director.view.camera.zoom;
    context.beginPath();
    context.moveTo(screenPoint0.x, screenPoint0.y);
    context.lineTo(screenPoint1.x, screenPoint1.y);
    context.stroke();
    this.life -= delta;
    return (this.life > 0);
  }
}