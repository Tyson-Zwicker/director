//Eventually these will be like parts and labels: actors will be able to attach them..
//foreground is a boolean.  
import Color from './color.js';
import Director from './director.js';
import ParticleEffect from './particleeffect.js';
import Point from './point.js';
export default class ParticleGenerator {

  constructor(name, position, centerAngle, sweep, absoluteVelocityMin, absoluteVelocityMax, color, foreground, particlesPerSecond, durationMin, durationMax) {
    this.counter = 0;
    this.name = name;
    if (!Point.isPointy(position)) throw new Error(`ParticleGenerator.constructor: position must be a point ${position}`);
    this.position = position;
    this.centerAngle = centerAngle;
    this.sweep = sweep;
    this.absoluteVelocityMin = absoluteVelocityMin; //Scalar value in DEGREES.
    this.absoluteVelocityMax = absoluteVelocityMax; //Scalar value in DEGREES.
    if (!(color instanceof Color)) throw new Error(`ParticleGenerator.constructor: color must be a point ${color}`)
    this.color = color;
    this.foreground = foreground;
    this.particlesPerSecond = particlesPerSecond;
    this.durationMin = durationMin;
    this.durationMax = durationMax;
    this.frequencyInMilliseconds = 1000 / particlesPerSecond;
    this.lastParticleMilliseconds = Date.now();
  }
  generate(now) {
    //Facts:
    //all of the particles are generated in the same position.
    //all of them seam immortal..
    //eventually  new ones stop getting generated at all..

    if (now - this.lastParticleMilliseconds > this.frequencyInMilliseconds) {
      this.lastParticleMilliseconds = now;
      let a = this.centerAngle - this.sweep / 2 + Math.random() * this.sweep;
      let v = this.rnd(this.absoluteVelocityMin, this.absoluteVelocityMax);
      let velocity = Point.fromPolar(a, v);
      let duration = this.rnd(this.durationMin, this.durationMax);
      /*
      let particleEffect1 = new ParticleEffect(
        new Point(-50, 0),
        new Point(0, -20),
        new Color(15, 15, 0), 20, 20  //color, size, duration
      );
      let particleEffect2 = new ParticleEffect(
        new Point(50, 0),
        new Point(0, 20),
        new Color(0, 15, 15), 20, 10  //color, size, duration
      );
      */
      let p = new ParticleEffect(
        this.position,
        velocity,
        this.color, 10, duration);
      p.id = this.counter++;
      console.log(`generating ${p.id} p${p.position} v${p.velocity} l:${p.life} c${p.color.asHex()}`);

      if (this.foreground) {
        Director.addForegroundEffect(p);
      } else {
        Director.addBackgroundEffect(p);
      }
    }
  }
  rnd(min, max) {
    return Math.floor(min + Math.random() * (Math.abs(max) - min));
  }
}