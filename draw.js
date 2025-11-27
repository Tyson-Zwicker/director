
export default class Draw {
    constructor(context2d) {
        this.g = context2d;
    }
    line(x1, y1, x2, y2, w = 1, colorOrGradient) {
        let color = '';
        if (NaN(x1) || NaN(x2) || Nan(x3) || Nan(x4)) throw new error(`line.draw bad coordinates (${x1},${y1}) (${x2},${y2})`)
        g.setStrokeStyle = colorOrGradient;
        g.lineWidth = w;
        g.moveTo(x1, y1);
        g.LineTo(x2, y2);
    }
}
