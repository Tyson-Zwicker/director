import Color from './color.js';
import Director from './director.js';
import ParticleEffect from "./particleeffect.js";
import Point from './point.js';

export default class ParticleGenertor {
  constructor(name, origin, angleMin, angleMax, velMin, velMax, color, size, durMin, durMax, periodMillis, foreground) {
    if (typeof name !== 'string') throw new Error(`ParticleGenerator.constructor ParticleGenerators must be named ${name}`);
    this.name = name;
    if (!Point.isPointy(origin)) throw new Error(`ParticleGenerator.constructor origin must be a point ${origin}`);
    this.origin = origin;
    if (typeof angleMin !== 'number' || typeof angleMax !== 'number') throw new Error(`ParticleGenerator.constructor: angles be degreest ${angleMin}, ${angleMax}`);
    this.angleMin = angleMin;
    this.angleMax = angleMax;
    if (typeof velMin !== 'number' || typeof velMax !== 'number') throw new Error(`ParticleGenerator.constructor: velocities be numbers ${velMin}, ${velMax}`);
    this.velMin = velMin;
    this.velMax = velMin;
    if (!(color instanceof Color)) throw new Error(`ParticleGenerator.constructor: color must be a Color, ${color}`);
    this.color = color;
    if (typeof size !== 'number' || size <= 0) new Error(`ParticleGenerator.constructor: size must be a number and >0 ${size}`);
    this.size = size;
    if (typeof durMin !== 'number' || typeof durMax !== 'number' || durMin <= 0) throw new Error(`ParticleGenerator.constructor: durations be numbers (in seconds)${velMin}, ${velMax}`);
    this.durMin = durMin;   //in seconds.
    this.durMax = durMax;   //in seconds.
    if (typeof foreground !== 'boolean') throw new Error(`ParticleGenerator.constructor: foreground must be true, or false (for background) [${foreground}].`)
    this.foreground = foreground;
    this.lastGeneratedMillis = 0;
    if (typeof periodMillis !== 'number' || size <= 0) new Error(`ParticleGenerator.constructor: period must be a number and >0 (inMilliseconds) ${periodMillis}`);
    this.periodMillis = periodMillis;
    // Object pool for reusing ParticleEffect instances
    this.particlePool = [];
    this.poolSize = 100; // Pre-allocate 100 particles
    this.#initializePool();
  }
  #initializePool() {
    for (let i = 0; i < this.poolSize; i++) {
      this.particlePool.push(
        new ParticleEffect(
          Point.from(this.origin),
          { x: 0, y: 0 },
          this.color,
          this.size,
          0
        )
      );
    }
  }
  #getParticleFromPool() {
    if (this.particlePool.length > 0) {
      return this.particlePool.pop();
    }
    // Create new one if pool exhausted
    return this.#makeNew();
  }
  #returnParticleToPool(particle){
    this.particlePool.push (particle);
  }
  #makeNew() {
    return new ParticleEffect(
      Point.from(this.origin),
      this.#getRandomVelocityComponents(),
      this.color, this.size, rnd(this.durMin, this.durMax)  //color, size, duration
    );
  }
  generate(now) {
    if (now - this.lastGeneratedMillis > this.periodMillis) {
      this.lastGeneratedMillis = now;
      let particleEffect = this.#makeNew();
      if (this.foreground) {
        Director.addForegroundEffect(particleEffect);
        return;
      }

      Director.addBackgroundEffect(particleEffect);
    }
  }
  #getRandomVelocityComponents() {
    let a = rnd(this.angleMin, this.angleMax);
    let m = rnd(this.velMin, this.velMax);
    return Point.fromPolar(a, m);
  }
}


function rnd(min, max) {
  return Math.floor(min + (max - min) * Math.random());
}