import Color from './color.js';
import Director from './director.js';
import ParticleEffect from "./particleeffect.js";
import Point from './point.js';
import Rnd from './rnd.js';
import Check from './check.js';
export default class ParticleGenertor {
  constructor(name, position, angleMin, angleMax, velMin, velMax, color, batchSize, size, durMin, durMax, periodMillis, foreground) {
    if (!Check.str( name)) throw new Error(`ParticleGenerator.constructor ParticleGenerators must be named ${name}`);
    if (!Point.isPointy(position)) throw new Error(`ParticleGenerator.constructor origin must be a point ${position}`);
    if (!(Check.num (angleMin)&&Check.num(angleMax))) throw new Error(`ParticleGenerator.constructor: angles be degreest ${angleMin}, ${angleMax}`);
    if (!(Check.num (velMin) && Check.num(velMax))) throw new Error(`ParticleGenerator.constructor: velocities be numbers ${velMin}, ${velMax}`);
    if (!(Check.obj (color, Color))) throw new Error(`ParticleGenerator.constructor: color must be a Color, ${color}`);
    if (!Check.num(batchSize,1)) throw new Error(`ParticleGenerator.constructor: batch size must be a number and >0 ${batchSize}`);
    if (!Check.num( size,0)) new Error(`ParticleGenerator.constructor: size must be a number and >0 ${size}`);
    if (!(Check.num(durMin,0) && Check.num (durMax, 0))) throw new Error(`ParticleGenerator.constructor: durations be numbers (in seconds)${velMin}, ${velMax}`);
    if (!Check.bool(foreground)) throw new Error(`ParticleGenerator.constructor: foreground must be true, or false (for background) [${foreground}].`)
    if (!Check.num(periodMillis,1)) new Error(`ParticleGenerator.constructor: period must be a number and >0 (inMilliseconds) ${periodMillis}`);
    
    this.name = name;    
    this.position = position;
    this.angleMin = angleMin;
    this.angleMax = angleMax;
    this.anglePartOffset = 0;
    this.velMin = velMin;
    this.velMax = velMin;
    this.color = color;
    this.batchSize = batchSize;
    this.size = size;
    this.durMin = durMin;   //in seconds.
    this.durMax = durMax;   //in seconds.
    this.foreground = foreground;
    this.lastGeneratedMillis = 0;
    this.periodMillis = periodMillis;
    this.particlePool = [];
    this.poolSize = this.durMax * 1000 / this.periodMillis;
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
  recycle(particle) {
    this.particlePool.push(particle);
  }
  #refresh(p) {
    p.position = Point.from(this.position);
    p.size = this.size;
    p.color = this.color;
    p.velocity = this.#getRandomVelocityComponents();
    let life = Rnd.float(this.durMin, this.durMax);
    p.duration = life;
    p.life = life;
    p.generator = this;
  }
  #makeNew() {
    let particle = new ParticleEffect(
      Point.from(this.position),
      this.#getRandomVelocityComponents(),
      this.color, this.size, Rnd.float(this.durMin, this.durMax)  //color, size, duration
    );
    particle.genertor = this;
    return particle;
  }
  generate(now) {
    if (now - this.lastGeneratedMillis > this.periodMillis) {
      this.lastGeneratedMillis = now;
      for (let i = 0; i < this.batchSize; i++) {
        let particleEffect = this.#getParticleFromPool();
        if (this.foreground) {
          Director.addForegroundEffect(particleEffect);
        } else {
          Director.addBackgroundEffect(particleEffect);
        }
      }
    }
  }
  #getRandomVelocityComponents() {
    let a = this.anglePartOffset + Rnd.float(this.angleMin, this.angleMax);
    let m = Rnd.float(this.velMin, this.velMax);
    return Point.fromPolar(a, m);
  }
  setPosition(newPosition) {
    this.position = Point.from(newPosition);
  }
  setFacing(angleInDegrees) {   
    this.anglePartOffset = angleInDegrees; // Store rotation if you need it for particle generation
  }
}
