import Point from './point.js';
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
    //returns true if it should be removed from the director's list because duration.
    draw(context,delta) {      
        if (!context || isNan (delta)) throw (`LineEffect.draw: bad params context ${context}, delta ${delta}`);  
        if (this.colorOrGradient instanceof Color) {
            context.strokeStyle = this.colorOrGradient.asHex();
        } else {
            context.strokeStyle = this.colorOrGradient;
        }
        context.lineWidth = this.w;
        context.beginPath();
        context.moveTo(this.p1.x, this.p1.y);
        context.lineTo(this.p2.x, this.p2.y);
        context.stroke();
        this.life-=delta;
        return (this.life<0);
    }
}