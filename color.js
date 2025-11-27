export class Color {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.color = '';
        if (r === undefined || g === undefined && b === undefined) throw new error(`line.draw: bad color ${r},${g},${b}`);
        if (a !== undefined) {
            if (!(a >= 0 && a <= 1)) throw new error(`draw.line: transarency out of range. 0=transparent, 1=opaque ${a}`);
            if (r + g + b + a >= 0) {
                color = `rgba(${r},${g},${b},${a}}`;
            }
        }
        color = `rgb(${r},${g},${b})`;
    }
    getLinearGradient(x1,y1,x2,y2, stopPoint1, color1, stopPoint2, color2, stopPoint3, color3, stopPoint4,color4) {
        if (NaN(x1) || NaN(x2) || Nan(x3) || Nan(x4)) throw new error(`line.draw bad coordinates (${x1},${y1}) (${x2},${y2})`)
        let gradient = g.createLinearGradient(x1, y1, x2, y2);
        if (stopPoint1 && color1){
            if (isNaN(stopPoint1)) throw error (`draw.setLinearGradient: ${stopPoint1} is not a number between 0 and 1`)
            gradient.addColorStop (stopPoint1, color1.color);        
        }
        if (stopPoint2 && color2){
            if (isNaN(stopPoint2)) throw error (`draw.setLinearGradient: ${stopPoint2} is not a number between 0 and 1`)
            gradient.addColorStop (stopPoint2, color2.color);        
        }
        if (stopPoint3 && color3){
            if (isNaN(stopPoint3)) throw error (`draw.setLinearGradient: ${stopPoint3} is not a number between 0 and 1`)
            gradient.addColorStop (stopPoint3, color3.color);        
        }
        if (stopPoint4 && color4){
            if (isNaN(stopPoint4)) throw error (`draw.setLinearGradient: ${stopPoint4} is not a number between 0 and 1`)
            gradient.addColorStop (stopPoint4, color4.color);        
        }
    }
}