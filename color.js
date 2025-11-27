export default class Color {
    //We are going to store the values, internally, as decimal between 1 and 0.
    //Well give them back either as #RBGA Strings.

    constructor(r, g, b, opacity = 1) {
        if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error(`color.constructor: Color component undefined R${r} G${g} B${b}`);
        if (r < 0 || r > 15 || g < 0 || g > 15 || b < 0 || b > 15) throw new Error(`color.constructor: rgb must be 0>=value<=15 R${r} G${g} B${b}`)
        if (opacity && opacity < 0 || opacity > 1) throw new Error(`Color.constructor: opacity must be between 0 and 1 [${opacity}`);
        this.r = r;
        this.g = g;
        this.b = b;
        this.opacity = opacity;
        if (!opacity) this.opacity = 1;
        if (opacity < 0 || opacity > 1) throw new Error('transparency must be a number between 0 and 1');
    }
    toString() {
        let r = `r:${this.r} g:${this.g} b:${this.b} a:${this.opacity} hex:${this.asHex()}`;
        return r;
    }
    getLinearGradient(x1, y1, x2, y2, stopPoint1, color1, stopPoint2, color2, stopPoint3, color3, stopPoint4, color4) {
        if (isNaN(x1) || isNaN(x2)) throw new Error(`line.draw bad coordinates (${x1},${y1}) (${x2},${y2})`)
        let gradient = this.g.createLinearGradient(x1, y1, x2, y2);
        if (stopPoint1 && color1) {
            if (isNaN(stopPoint1)) throw Error(`draw.setLinearGradient: ${stopPoint1} is not a number between 0 and 1`)
            gradient.addColorStop(stopPoint1, color1.color);
        }
        if (stopPoint2 && color2) {
            if (isNaN(stopPoint2)) throw Error(`draw.setLinearGradient: ${stopPoint2} is not a number between 0 and 1`)
            gradient.addColorStop(stopPoint2, color2.color);
        }
        if (stopPoint3 && color3) {
            if (isNaN(stopPoint3)) throw Error(`draw.setLinearGradient: ${stopPoint3} is not a number between 0 and 1`)
            gradient.addColorStop(stopPoint3, color3.color);
        }
        if (stopPoint4 && color4) {
            if (isNaN(stopPoint4)) throw Error(`draw.setLinearGradient: ${stopPoint4} is not a number between 0 and 1`)
            gradient.addColorStop(stopPoint4, color4.color);
        }
        return gradient;
    }
    asHex() {
        let r = `#${this.#intToHex(this.r)}${this.#intToHex(this.g)}${this.#intToHex(this.b)}${this.#floatToHex(this.opacity)}`;
        return r;

    }

    #intToHex(value) {
        if (value < 0 || value > 15) throw new Error(`color.#intToHex: value out of bounds ${value}. Must be (0,15) inclusive`);
        return value.toString(16).toUpperCase();
    }
    #floatToHex(value) {
        if (value < 0 || value > 1) throw new Error(`color.floatToHex: value of of bounds ${value}. Must be between (0 and 1) inclusive`);
        let base10 = value * 15;
        return this.#intToHex(Math.round(base10));
    }
}