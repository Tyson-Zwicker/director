import Point from './point.js';
import Color from './color.js';
import Director from './director.js';
import Transpose from './transpose.js';
export default class ParticleEffect {
  constructor(position, velocity, color, size, durationInSeconds) {
    if (!Point.isPointy(position)) throw new Error(`ParticleEffect.constructor: position should be a point: ${position}`);
    this.position = position;
    this.size = size;
    if (!(color instanceof Color)) throw new Error(`Color must be a Color object : ${color}`);
    this.color = color;
    if (!Point.isPointy(velocity)) throw new Error(`ParticleEffect.constructor: velocity should be a compenent vector. ${velocity}`);
    this.velocity = velocity;
    if (typeof durationInSeconds !=='number' && durationInSeconds>0) throw (`ParticleEffect.constructor.  Duration must a number greater than zero. [${durationInSeconds}]`)
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  move(delta) {
    if (delta == undefined) throw new Error(`ParticleEffect.move: no delta ${delta}`);
    let scaledVelocity = Point.from(this.velocity);
    Point.scale(scaledVelocity, delta);
    Point.add(this.position, scaledVelocity);
  }
  draw(context, delta) {
    let screenPoint = Transpose.worldToScreen (this.position);
    if (!context || isNaN(delta)) throw (`LineEffect.draw: bad params context ${context}, delta ${delta}`);
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