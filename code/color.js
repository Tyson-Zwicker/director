import Rnd from './rnd.js';

export default class Color {
  //We are going to store the values, internally, as decimal between 1 and 0.
  //Well give them back either as #RBGA Strings.

  constructor(r, g, b, opacity = 1) {
    if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error(`color.constructor: Color component undefined R${r} G${g} B${b}`);
    if (r < 0 || r > 15 || g < 0 || g > 15 || b < 0 || b > 15) throw new Error(`color.constructor: rgb must be 0>=value<=15 R${r} G${g} B${b}`)
    if (opacity === null || opacity === undefined) opacity = 1;
    if (opacity < 0 || opacity > 1) throw new Error(`Color.constructor: opacity must be between 0 and 1 [${opacity}]`);
    this.r = r;
    this.g = g;
    this.b = b;
    this.opacity = opacity;
  }
  asHex() {
    let r = `#${this.#intToHex(this.r)}${this.#intToHex(this.g)}${this.#intToHex(this.b)}${this.#floatToHex(this.opacity)}`;
    return r;
  }
  withOpacity(opacity) {
    return new Color (this.r,this.g,this.b,this.opacity * opacity );
  }
  //negative number makes it brighter or dimmer. Range is 0 to 1. 0 makes it black,1 changes nothing.
  changeBrightness(c) {
    if (isNaN(c) || c < 0 || c > 1) throw new Error(`color.changeBrightness: change should be a value between 0 and 1 ${c}`);
    let dr = Math.ceil(this.r * c);
    let dg = Math.ceil(this.g * c);
    let db = Math.ceil(this.b * c);
    dr = Math.min(15, dr); dr = Math.max(0, dr);
    dg = Math.min(15, dg); dg = Math.max(0, dg);
    db = Math.min(15, db); db = Math.max(0, db);
    return new Color(dr, dg, db, this.opacity)
  }
  #floatToHex(value) {
    if (value < 0 || value > 1) throw new Error(`color.floatToHex: value of of bounds ${value}. Must be between (0 and 1) inclusive`);
    let base10 = value * 15;
    return this.#intToHex(Math.round(base10));
  }
  static fromHex(hex) {
    if (hex[0] !== '#') throw new Error(`Color.fromHex: must start with "#". Parameter was [${hex}]`);
    let r = parseInt(hex[1], 16);
    let g = parseInt(hex[2], 16);
    let b = parseInt(hex[3], 16);
    let op = 1;
    if (hex.length === 5) {
      let op = parseInt(hex[4], 16) / 15;//This turns #F into 1 and #0 into 0..
    }
    return new Color(r, g, b, op);
  }
  getLinearGradient(context, x1, y1, x2, y2, stopPoint1, color1, stopPoint2, color2, stopPoint3, color3, stopPoint4, color4) {
    if (isNaN(x1) || isNaN(x2)) throw new Error(`line.draw bad coordinates (${x1},${y1}) (${x2},${y2})`)
    let gradient = context.createLinearGradient(x1, y1, x2, y2);
    if (stopPoint1 !== undefined && color1) {
      if (isNaN(stopPoint1)) throw Error(`draw.setLinearGradient: ${stopPoint1} is not a number between 0 and 1`)
      gradient.addColorStop(stopPoint1, color1.asHex());
    }
    if (stopPoint2 !== undefined && color2) {
      if (isNaN(stopPoint2)) throw Error(`draw.setLinearGradient: ${stopPoint2} is not a number between 0 and 1`)
      gradient.addColorStop(stopPoint2, color2.asHex());
    }
    if (stopPoint3 !== undefined && color3) {
      if (isNaN(stopPoint3)) throw Error(`draw.setLinearGradient: ${stopPoint3} is not a number between 0 and 1`)
      gradient.addColorStop(stopPoint3, color3.asHex());
    }
    if (stopPoint4 !== undefined && color4) {
      if (isNaN(stopPoint4)) throw Error(`draw.setLinearGradient: ${stopPoint4} is not a number between 0 and 1`)
      gradient.addColorStop(stopPoint4, color4.asHex());
    }
    return gradient;
  }
  #intToHex(value) {
    if (value < 0 || value > 15) throw new Error(`color.#intToHex: value out of bounds ${value}. Must be (0,15) inclusive`);
    return value.toString(16).toUpperCase();
  }
  toString() {
    let r = `r:${this.r} g:${this.g} b:${this.b} a:${this.opacity} hex:${this.asHex()}`;
    return r;
  }
}