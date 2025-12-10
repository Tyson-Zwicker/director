import Point from './point.js';
import Color from './color.js';
import Director from './director.js';

export default class ParticleEffect {
  particleSize = 1;
  constructor(position, radius, color, durationInSeconds) {
    this.position = position;
    this.color = color;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  
  draw(context, delta) {
    let tp = Point.from(this.position); //The point is fixed in world coordinates, but screen moves so, tp = temporaty point ie. where the screen put you.
    Point.sub(tp, Director.view.camera);
    Point.scale(tp, Director.view.camera.zoom);
    Point.add(tp, Director.view.screenCenter);
    if (!context || isNaN(delta)) throw (`LineEffect.draw: bad params context ${context}, delta ${delta}`);
    if (this.colorOrGradient instanceof Color) {
      let color = this.colorOrGradient.changeBrightness(this.life / this.duration);
      context.fillStyle = color.asHex();
    } else {
      context.fillStyle = this.colorOrGradient;
    }
    let scale = Math.max (1, Director.view.camera.zoom*particleSize);
    context.fillRect(this.position.x-scale/2, this.position.y - scale/2,scale, scale);    
    this.life -= delta;
    return (this.life > 0);
  }
}