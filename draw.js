
export default class Draw {
    constructor(context2d) {
        this.g = context2d;
    }
    line(x1, y1, x2, y2, w, colorOrGradient) {        
        if (isNaN(w)) throw new Error('no width defined.');
        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) throw new Error(`line.draw bad coordinates (${x1},${y1}) (${x2},${y2})`);
        this.g.strokeStyle = colorOrGradient.asHex();
        this.g.lineWidth = w;
        this.g.moveTo(x1, y1);
        this.g.lineTo(x2, y2);
        this.g.stroke();
    }
}
