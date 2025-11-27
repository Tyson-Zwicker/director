
export default class Draw {
    constructor(context2d) {
        this.g = context2d;
    }
    line(x1, y1, x2, y2, w, colorOrGradient) {
        console.log(colorOrGradient);
        if (isNaN(w)) throw new Error ('no width defined.');
        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) throw new error(`line.draw bad coordinates (${x1},${y1}) (${x2},${y2})`)
        console.log (`setting style to color or gradient: ${colorOrGradient}`)
        this.g.strokeStyle = colorOrGradient.asHex();

        console.log(this.g.strokeStyle);
        this.g.lineWidth = w;
        console.log('moving');

        this.g.moveTo(x1, y1);
        this.g.lineTo(x2, y2);
        this.g.stroke();
        console.log('stroked.');
    }
}
