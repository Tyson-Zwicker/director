export default class Rnd {
  //IF ONLY ONE provided, range is 0->min,
  //otherwise its min->max
  static int(min, max) { // max not inclusive..
    if (!max && typeof min === 'number') {
      max = min;
      min = 0;
    }
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Rnd.int requires numeric parameters');
    }
    return Math.floor(min + Math.random() * (Math.abs(max) - min));
  }

  //no params 0->1
  //1 param 0->min
  //2 param min->max
  static float(min, max) { //max not inclusive..
    if (!max &&!min){
      min=0;
      max = 1;
    }
    if (!max){
      max = min;
      min = 0;
    } 
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Rnd.float requires numeric parameters');
    }
    return min + Math.random() * (Math.abs(max) - min);
  }
  static hex(min, max, digits) { //0->15 but 0->F
    if (!min || min < 0) min = 0;
    if (!max || max < 0 || max > 16) max = 16;
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
    return new Point(Rnd.float(-1, 1), Rnd.float(-1, 1));
  }
  static vect(minAngle, maxAngle, minMag, maxMag) {
    if (typeof minAngle !== 'number' || typeof maxAngle !== 'number' || typeof minMag !== 'number' || typeof maxMag !== 'number') {
      throw new TypeError('Rnd.vect requires numeric parameters');
    }
    let a = Rnd.float(minAngle, maxAngle);
    let m = Rnd.float(minMag, maxMag);
    return Point.fromPolar(a, m);
  }
}