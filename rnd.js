export default class Rnd {
  static int(min, max) { // max not inclusive..
    return Math.floor(min + Math.random() * (Math.abs(max) - min));
  }

  static float(min, max) { //max not inclusive..
    if (!max) max = 1;
    if (!min) min = 0;
    return min + Math.random() * (Math.abs(max) - min);
  }
  static hex(min, max, digits) { //0->15 but 0->F
    if (!min) min = 0;
    if (!max) max = 16;
    if (digits && digits>1){
      let d = 0;
      let s= '';
      while (d<digits){
        s+=Rnd.hex (min,max);
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
    let a = Rnd.float(minAngle, maxAngle);
    let m = Rnd.float(minMag, maxMag);
    return Point.fromPolar(a, m);
  }
}