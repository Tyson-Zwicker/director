import Color from './color.js';
import Director from './director.js';
import ParticleEffect from "./particleeffect.js";
import Point from './point.js';

export default class ParticleGenertor {
  constructor(name, position, angleMin, angleMax, velMin, velMax, color, size, durMin, durMax, periodMillis, foreground) {
    if (typeof name !== 'string') throw new Error(`ParticleGenerator.constructor ParticleGenerators must be named ${name}`);
    this.name = name;
    if (!Point.isPointy(position)) throw new Error(`ParticleGenerator.constructor origin must be a point ${position}`);
    this.position = position;
    if (typeof angleMin !== 'number' || typeof angleMax !== 'number') throw new Error(`ParticleGenerator.constructor: angles be degreest ${angleMin}, ${angleMax}`);
    this.angleMin = angleMin;
    this.angleMax = angleMax;
    this.anglePartOffset =0;
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
    this.particlePool = [];
    this.poolSize = this.durMax*1000 / this.periodMillis;
    this.attachedPart = undefined; // Add this property
    this.#initializePool();
  }

  #initializePool() {
    for (let i = 0; i < this.poolSize; i++) {
      this.particlePool.push(
        new ParticleEffect(
          Point.from(this.position),
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
      let p = this.particlePool.pop();
      this.#refresh(p);
      return p;
    }
    // Create new one if pool exhausted
    return this.#makeNew();
  }
  recycle (particle) {
    this.particlePool.push(particle);
  }
  #refresh(p) {
    p.position = Point.from (this.position);
    p.size = this.size;
    p.color = this.color;
    p.velocity= this.#getRandomVelocityComponents();
    let life = rnd (this.durMin, this.durMax);
    p.duration = life;
    p.life = life;
    p.generator = this;
  }
  #makeNew() {
    let particle = new ParticleEffect(
      Point.from(this.position),
      this.#getRandomVelocityComponents(),
      this.color, this.size, rnd(this.durMin, this.durMax)  //color, size, duration
    );
    particle.genertor = this;
    return particle;
  }
  generate(now) {
    if (now - this.lastGeneratedMillis > this.periodMillis) {
      this.lastGeneratedMillis = now;
      let particleEffect = this.#getParticleFromPool();
      if (this.foreground) {
        Director.addForegroundEffect(particleEffect);
        return;
      }

      Director.addBackgroundEffect(particleEffect);
    }
  }
  #getRandomVelocityComponents() {
    let a = this.anglePartOffset+rnd(this.angleMin, this.angleMax);
    let m = rnd(this.velMin, this.velMax);
    return Point.fromPolar(a, m);
  }
  setPosition(newPosition) {
    this.position = Point.from(newPosition);
  }
  
  setFacing(angleInDegrees) {
    // Store rotation if you need it for particle generation
    this.anglePartOffset = angleInDegrees;
  }
}

function rnd(min, max) {
  return Math.floor(min + (max - min) * Math.random());
}