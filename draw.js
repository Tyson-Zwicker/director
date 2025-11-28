import Color from './color.js';
export default class Draw {
    constructor(context2d) {
        this.g = context2d;
    }
    line(x1, y1, x2, y2, w, colorOrGradient) {
        if (isNaN(w)) throw new Error('no width defined.');
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) throw new Error(`line.draw bad: coordinates (${x1},${y1}) (${x2},${y2})`);
        if (colorOrGradient instanceof Color) {
            this.g.strokeStyle = colorOrGradient.asHex();
        } else {
            this.g.strokeStyle = colorOrGradient;
        }
        this.g.lineWidth = w;
        this.g.beginPath();
        this.g.moveTo(x1, y1);
        this.g.lineTo(x2, y2);
        this.g.stroke();
    }
    box (x1,y1,x2,y2,colorOrGradient){
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) throw new Error(`line.draw bad: coordinates (${x1},${y1}) (${x2},${y2})`);
        if (colorOrGradient instanceof Color) {
            this.g.fillStyle = colorOrGradient.asHex();
        } else {
            this.g.fillStyle = colorOrGradient;
        }
        this.g.fillRect (x1,y1,x2-x1,y2-y1);
    }
}
