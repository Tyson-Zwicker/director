import ParticleEffect from "./particleeffect.js";
import Color from './color.js';

export default class ParticleGenertor {
  constructor(origin, angleMin, angleMax, velMin, velMax, color, size, durMin, durMax, periodMillis, foreground) {
    if (!isPointry(origin)) throw new Error(`ParticleGenerator.constructor origin must be a point ${origin}`);
    this.origin = origin;
    if (!(angleMin instanceof 'number') || !(angleMax instanceof 'number')) throw new Error(`ParticleGenerator.constructor: angles be degreest ${angleMin}, ${angleMax}`);
    this.angleMin = angleMin;
    this.angleMax = angleMax;
    if (!(velMin instanceof 'number') || !(velMax instanceof 'number')) throw new Error(`ParticleGenerator.constructor: velocities be numbers ${velMin}, ${velMax}`);
    this.velMin = velMin;
    this.velMax = velMin;
    if (!(color instanceof 'Color')) throw new Error(`ParticleGenerator.constructor: color must be a Color, ${color}`);
    this.color = color;
    if (!(size instanceof 'number' || size <= 0)) new Error(`ParticleGenerator.constructor: size must be a number and >0 ${size}`);
    this.size = size;
    if (!(durMin instanceof 'number') || !(durMax instanceof 'number')) throw new Error(`ParticleGenerator.constructor: durations be numbers (in seconds)${velMin}, ${velMax}`);
    this.durMin = durMin;   //in seconds.
    this.durMax = durMax;   //in seconds.
    if (!(foreground instanceof 'bool')) throw new Error(`ParticleGenerator.constructor: foreground must be true, or false (for background) [${foreground}].`)
    this.foreground = foreground;
    this.lastGeneratedMillis = 0;
    if (!(periodMillis instanceof 'number' || size <= 0)) new Error(`ParticleGenerator.constructor: period must be a number and >0 (inMilliseconds) ${periodMillis}`);
    this.periodMillis = periodMillis;
  }
  generate(now) {
    if (now - this.astGeneratedMillis > this.periodMillis) {
      let particleEffect = new ParticleEffect(
        this.origin,
        this.#getRandomVelocityComponents(),
        this.color, this.size, rnd(this.minDur, this.maxDur)  //color, size, duration
      );
      if (this.foreground) {
        Director.addForegroundEffect(particleEffect)
        return;
      }
      Director.addBackgroundEffect(particleEffect)
    }
  }
  #getRandomVelocityComponents() {
    let a = rnd(angleMin, angleMax);
    let v = rnd(velMin, velMax);
    return Point.fromPolar(a, l);

  }
}


function rnd(min, max) {
  return Math.floor(min + (max - min) * Math.random());
}