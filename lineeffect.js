import Point from './point.js';
import Color from './color.js';
import Director from './director.js';
/* Effects wear out. When their "life" get below 0 they are removed from the director */

export default class LineEffect {
    constructor(p1, p2, w, colorOrGradient, durationInSeconds) {
        this.duration = durationInSeconds;
        this.life = durationInSeconds;
        this.p1 = p1;
        this.p2 = p2;
        this.w = w;
        this.colorOrGradient = colorOrGradient;
    }
    //returns true if it should be removed from the director's list because its "lifespan" has been exceded.
    draw(context, delta) {
        let tp1 = Point.from (this.p1); //The point is fixed in world coordinates, but screen moves so, tp = temporaty point ie. where the screen put you.
        Point.sub(tp1, Director.view.camera);
        Point.scale(tp1,  Director.view.camera.zoom);
        Point.add(tp1,  Director.view.screenCenter);
        let tp2 = Point.from (this.p2); //The point is fixed in world coordinates, but screen moves so, tp = temporaty point ie. where the screen put you.
        Point.sub(tp2,  Director.view.camera);
        Point.scale(tp2,  Director.view.camera.zoom);
        Point.add(tp2,  Director.view.screenCenter);
        if (!context || isNaN(delta)) throw (`LineEffect.draw: bad params context ${context}, delta ${delta}`);
        if (this.colorOrGradient instanceof Color) {
            context.strokeStyle = this.colorOrGradient.asHex();
        } else {
            context.strokeStyle = this.colorOrGradient;
        }
        context.lineWidth = this.w;
        context.beginPath();
        context.moveTo(tp1.x, tp1.y);
        context.lineTo(tp2.x, tp2.y);
        context.stroke();
        this.life -= delta;
        return (this.life > 0);
    }
}