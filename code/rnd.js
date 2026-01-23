import Point from './point.js';
import Boundry from './boundry.js';
import Color from './color.js';
export default class Rnd {
  static bool() {
    return (Math.random() < .5);
  }
  //IF ONLY ONE provided, range is 0->min,
  //otherwise its min->max
  static int(min, max) { // max not inclusive..
    if (typeof min !== 'number' && typeof max !== 'number') {
      throw new Error('Rnd.int: Parameters must be numbers..');
    }
    else if (typeof max === 'undefined' && typeof min === 'number') {
      max = min;
      min = 0;
    } else if (typeof min === 'undefined') {
      throw new Error(`Rnd.int: min must be a number. Given: [${min}]`);
    }

    return Math.floor(min + Math.random() * (Math.abs(max) - min));
  }

  //no params 0->1
  //1 param 0->min
  //2 param min->max
  static float(min, max) { //max not inclusive..

    if (typeof max === 'undefined' && typeof min === 'undefined') {
      min = 0;
      max = 1;
    }
    if (typeof max !== 'number') {
      max = min;
      min = 0;
    }
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Rnd.float requires numeric parameters');
    }
    return min + Math.random() * (Math.abs(max) - min);
  }
  static hex(min, max, digits) { //0->15 but 0->F
    if (typeof min !== 'number' || min < 0) min = 0;
    if (typeof max !== 'number' || max < 0 || max > 16) max = 16;
    if (typeof min !== 'number' || typeof max !== 'number' || (digits !== undefined && typeof digits !== 'number')) {
      throw new TypeError('Rnd.hex requires numeric parameters');
    }
    if (digits && digits > 1) {
      let d = 0;
      let s = '';
      while (d < digits) {
        s += Rnd.hex(min, max);
        d++;
      }
      return s;
    }
    return Number.toString(Rnd.int(min, max));
  }
  static norm() {//A normalized vector
    return new Point.fromPolar(Math.Pi * Rnd.float(0, 2), 1);
  }
  static point(boundry) {
    if (!(boundry instanceof Boundry)) throw new Error(`Boundry ${boundry} is not a boundry.`);
    return new Point(Rnd.int(boundry.x1, boundry.x2), Rnd.int(boundry.y1, boundry.y2));
  }
  static vect(minAngle, maxAngle, minMag, maxMag) {
    if (typeof minAngle !== 'number' || typeof maxAngle !== 'number' || typeof minMag !== 'number' || typeof maxMag !== 'number') {
      throw new TypeError('Rnd.vect requires numeric parameters');
    }
    let a = Rnd.float(minAngle, maxAngle);
    let m = Rnd.float(minMag, maxMag);
    return Point.fromPolar(a, m);
  }
  static color(min) {
    if (typeof min === undefined) min = 0;
    if (typeof min !== 'number') throw new Error(`Rnd.color: min [${min}] is not a number.`);
    let m = parseInt(min);
    if (m > 14 || m < 0) throw new Error(`Rnd.color: min [${min} must be between 0 and 1 (inclusive)`);
    let r = Rnd.int(m, 15);
    let g = Rnd.int(m, 15);
    let b = Rnd.int(m, 15);
    if (Rnd.int(0, 3) === 0) r = 0;
    if (Rnd.int(0, 3) === 0) g = 0;
    if (Rnd.int(0, 3) === 0) b = 0;
    if (r + g + b ===0) {
      let r = Rnd.int(m, 15);
      let g = Rnd.int(m, 15);
      let b = Rnd.int(m, 15);
    }
    return new Color(r, g, b);
  }
  static colorAsHex(min) {
    return Rnd.color(min).asHex();
  }
}