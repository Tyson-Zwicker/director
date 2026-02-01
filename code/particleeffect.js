import Point from './point.js';
import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
import Check from './check.js';

export default class ParticleEffect {
  constructor(position, velocity, color, size, durationInSeconds) {
    if (!Point.isPointy(position)) throw new Error(`ParticleEffect.constructor: position should be a point: ${position}`);
    if (!Point.isPointy(velocity)) throw new Error(`ParticleEffect.constructor: velocity should be a compenent vector. ${velocity}`);
    if (!Check.obj (color,Color)) throw new Error(`Color must be a Color object : ${color}`);
    if (!Check.num(durationInSeconds,0)) throw new Error (`ParticleEffect.constructor: durationInSeconds must be a number greater than 0:  [${duration}]`);
    this.position = position;
    this.size = size;
    this.color = color;
    this.velocity = velocity;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  move(delta) {
    if (!Check.num(delta,0)) throw new Error(`ParticleEffect.move: delta must be a number: [${delta}]`);
    let scaledVelocity = Point.from(this.velocity);
    Point.scale(scaledVelocity, delta);
    Point.add(this.position, scaledVelocity);
  }
  draw(context, delta) {
    let screenPoint = Transpose.worldToScreen (this.position);
    if (!Check.obj (context)) throw (`LineEffect.draw: bad params context: [${context}]`);
    if (!Check.num(delta)) throw (`LineEffect.draw: bad params  delta: [${delta}]`);
    let color = this.color.withOpacity(this.life / this.duration);
    context.fillStyle = color.asHex();
    let particleSize = this.size * Director.view.camera.zoom;
    context.fillRect(
      screenPoint.x - particleSize / 2,
      screenPoint.y - particleSize / 2,
      particleSize, particleSize
    );
    context.fillStyle = color.asHex();
    this.life -= delta;
    return (this.life > 0);
  }
}