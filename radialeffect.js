import Point from './point.js';
import Color from './color.js';
import Director from './director.js';

export default class RadialEffect {
  constructor(position, radius, colorOrGradient, durationInSeconds) {
    this.position = position;
    this.radius = radius;
    this.colorOrGradient = colorOrGradient;
    this.duration = durationInSeconds;
    this.life = durationInSeconds;
  }
  //returns true if it should be removed from the director's list because its "lifespan" has been exceded.
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
    context.moveTo (this.position.x, this.position.y);
    context.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, Math.PI * 2);
    context.fill();
    this.life -= delta;
    return (this.life > 0);
  }
}